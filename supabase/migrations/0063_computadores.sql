-- Sakura System — AutoCenter Edition
-- Migration 0063: cada computador diz ao banco em que versão está.
--
-- O problema. Até aqui, "em que versão está cada computador da loja?" não
-- tinha resposta. O programa se atualiza sozinho, mas só quando é fechado e
-- aberto de novo — e um computador que ficou ligado três dias, ou um notebook
-- que só abre de vez em quando, fica pra trás sem ninguém saber. Isso já
-- pesou uma vez: a migration 0062 quebraria a v0.9.42 pra quem paga conta sem
-- ter o Caixa, e a única saída foi conferir À MÃO que não havia operador
-- daquele perfil na loja. Com lojas de outras empresas, conferir à mão deixa
-- de ser possível.
--
-- Como fica:
--   • cada computador ganha uma identidade própria, criada por ele mesmo na
--     primeira vez que abre (um arquivo `computador.json` na pasta de dados
--     do app) — é o `id` desta tabela;
--   • a cada login, o programa grava aqui a versão dele, o canal de
--     atualização, o sistema operacional, a loja e quem entrou — pela função
--     `registrar_computador()`, nunca direto na tabela;
--   • o admin vê a lista em Configurações → "Computadores desta empresa",
--     dá um apelido pra cada um ("Balcão", "Notebook da Carol") e pode
--     "esquecer" um computador que não existe mais;
--   • o botão "Atualizar o banco de todas as empresas" lê esta tabela antes
--     de aplicar uma migration que exige uma versão mínima do programa, e
--     espera os computadores atrasados (ver scripts/atualizar-bancos.mjs).
--
-- O que esta tabela NÃO guarda, de propósito: nada de negócio — nenhum
-- valor, nenhum cliente, nenhuma OS. É o carimbo "este computador, nesta
-- versão, foi visto em tal dia". O nome da máquina é o nome que o Windows dá
-- a ela (ex: "DESKTOP-7GH2K1"), que já aparece na rede da loja.
--
-- Limite conhecido, aceito: um operador logado que descubra o `id` de outro
-- computador consegue gravar por cima da linha dele. O `id` é um UUID
-- aleatório que só o admin enxerga, e o estrago possível é mentir a versão de
-- um computador — nenhum dado da loja fica exposto por isso.
--
-- Idempotente: seguro rodar de novo.

-- ===================================================================
-- 1. A tabela
-- ===================================================================

create table if not exists computadores (
  id              uuid primary key,
  nome_maquina    text not null default '',
  apelido         text,
  versao_app      text not null,
  canal           text not null default 'normal',
  sistema         text,
  loja_id         uuid references lojas(id) on delete set null,
  operador_id     uuid references operadores(id) on delete set null,
  primeiro_acesso timestamptz not null default now(),
  visto_em        timestamptz not null default now()
);

comment on table computadores is
  'Um computador por linha, com a versão do programa em que ele estava da '
  'última vez que alguém entrou nele. Gravado só por registrar_computador(). '
  'Lido pelo admin (Configurações) e pelo botão de atualizar os bancos, que '
  'espera os computadores atrasados antes de uma migration que exige versão '
  'mínima.';

-- As travas moram em blocos `do` pra rodar de novo sem erro de "já existe".
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'ck_computadores_versao') then
    -- Só "números.números.números": é o que deixa comparar versão no banco
    -- (`string_to_array(versao_app, '.')::int[]`) sem um texto qualquer
    -- estourar a consulta do botão de atualizar os bancos.
    alter table computadores add constraint ck_computadores_versao
      check (versao_app ~ '^[0-9]{1,4}\.[0-9]{1,4}\.[0-9]{1,6}$');
  end if;
  if not exists (select 1 from pg_constraint where conname = 'ck_computadores_canal') then
    alter table computadores add constraint ck_computadores_canal
      check (canal in ('normal', 'teste'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'ck_computadores_tamanhos') then
    -- Quem grava aqui é qualquer operador logado (pela função). Sem limite de
    -- tamanho, dava pra encher a tabela com um texto de megabytes.
    alter table computadores add constraint ck_computadores_tamanhos
      check (char_length(nome_maquina) <= 100
             and (apelido is null or char_length(apelido) <= 60)
             and (sistema is null or char_length(sistema) <= 200));
  end if;
end;
$$;

create index if not exists computadores_visto_em_idx on computadores (visto_em desc);

alter table computadores enable row level security;

-- ===================================================================
-- 2. Quem enxerga e quem esquece: o admin da loja em que o computador
--    foi visto por último
-- ===================================================================
-- Computador sem loja (a loja foi excluída, ou ele nunca chegou a entrar
-- numa) fica visível pra qualquer admin — senão viraria uma linha que
-- ninguém consegue ver nem apagar, o beco do §6 item 23.
--
-- INSERT e UPDATE não têm policy, de propósito: gravar é só por
-- registrar_computador() e trocar o apelido é só por
-- definir_apelido_computador(). Os dois estão declarados como lacuna em
-- supabase/testes-rls/lacunas-de-proposito.csv.

drop policy if exists computadores_select on computadores;
create policy computadores_select on computadores
  for select to authenticated
  using (
    operador_e_admin_da_loja(loja_id)
    or (loja_id is null and operador_atual_e_admin_de_alguma_loja())
  );

drop policy if exists computadores_delete on computadores;
create policy computadores_delete on computadores
  for delete to authenticated
  using (
    operador_e_admin_da_loja(loja_id)
    or (loja_id is null and operador_atual_e_admin_de_alguma_loja())
  );

-- ===================================================================
-- 3. Registrar: qualquer operador logado, sobre o computador em que está
-- ===================================================================
-- Chamado pelo programa logo depois do login. `security definer` porque o
-- balconista precisa gravar a linha do computador dele sem poder LER a
-- tabela (a lista de computadores é assunto de admin).
--
-- O apelido e o primeiro acesso nunca são tocados aqui: o apelido é do admin,
-- e o primeiro acesso é o que diz há quanto tempo aquele computador existe.

create or replace function registrar_computador(
  p_id           uuid,
  p_nome_maquina text,
  p_versao       text,
  p_canal        text,
  p_sistema      text,
  p_loja_id      uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null
     or not exists (select 1 from operadores where id = auth.uid() and ativo) then
    raise exception 'Só um operador ativo, logado, registra o computador.'
      using errcode = '42501';
  end if;
  if p_id is null then
    raise exception 'O computador precisa de uma identidade.' using errcode = '22023';
  end if;
  if p_loja_id is not null and not operador_tem_acesso_loja(p_loja_id) then
    raise exception 'Você não tem acesso a esta loja.' using errcode = '42501';
  end if;

  insert into computadores as c
    (id, nome_maquina, versao_app, canal, sistema, loja_id, operador_id, visto_em)
  values
    (p_id,
     left(coalesce(btrim(p_nome_maquina), ''), 100),
     btrim(p_versao),
     coalesce(p_canal, 'normal'),
     left(nullif(btrim(p_sistema), ''), 200),
     p_loja_id,
     auth.uid(),
     now())
  on conflict (id) do update
    set nome_maquina = excluded.nome_maquina,
        versao_app   = excluded.versao_app,
        canal        = excluded.canal,
        sistema      = excluded.sistema,
        loja_id      = excluded.loja_id,
        operador_id  = excluded.operador_id,
        visto_em     = now();
end;
$$;

comment on function registrar_computador(uuid, text, text, text, text, uuid) is
  'Grava (ou atualiza) a linha deste computador: versão, canal, sistema, '
  'loja e quem entrou. Chamado pelo programa a cada login. Não devolve nada.';

-- ===================================================================
-- 4. Apelido: só quem enxerga o computador
-- ===================================================================

create or replace function definir_apelido_computador(p_id uuid, p_apelido text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_loja uuid;
begin
  select loja_id into v_loja from computadores where id = p_id;
  if not found then
    raise exception 'Computador não encontrado.' using errcode = '22023';
  end if;
  if not (operador_e_admin_da_loja(v_loja)
          or (v_loja is null and operador_atual_e_admin_de_alguma_loja())) then
    raise exception 'Só um administrador da loja dá nome aos computadores.'
      using errcode = '42501';
  end if;

  update computadores
     set apelido = left(nullif(btrim(p_apelido), ''), 60)
   where id = p_id;
end;
$$;

comment on function definir_apelido_computador(uuid, text) is
  'Dá (ou tira, com texto em branco) o apelido de um computador. Só admin da '
  'loja em que ele foi visto por último.';

-- As duas funções são `security definer`. Sem estes revokes, o Postgres dá
-- EXECUTE a PUBLIC e o Supabase dá ao `anon` — e quem não está logado
-- conseguiria ao menos chamar (a própria função recusaria, mas a porta não
-- precisa existir).
revoke all on function registrar_computador(uuid, text, text, text, text, uuid) from public, anon;
revoke all on function definir_apelido_computador(uuid, text) from public, anon;
grant execute on function registrar_computador(uuid, text, text, text, text, uuid) to authenticated;
grant execute on function definir_apelido_computador(uuid, text) to authenticated;

-- Sem auditoria, de propósito: esta linha muda a CADA login, e a trilha
-- ficaria cheia de "atualizou computador" escondendo o que importa.

insert into schema_versao (versao) values (63) on conflict do nothing;
