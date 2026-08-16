-- Sakura System — AutoCenter Edition
-- Migration 0040: trilha de auditoria — "quem mexeu em quê".
--
-- Uma tabela genérica (`auditoria`) recebe uma linha toda vez que um
-- registro é **editado** ou **excluído** numa tabela sensível — via trigger
-- de banco, não chamada manual do app. Isso importa: um trigger pega
-- qualquer alteração não importa por onde ela veio (tela do app, um bug
-- futuro, até uma edição manual pelo SQL Editor do Supabase), diferente de
-- logar "na mão" dentro de cada função do `lib/`, que exigiria lembrar de
-- adicionar em todo lugar e vazaria silenciosamente em qualquer um
-- esquecido.
--
-- Escopo desta primeira leva (dá pra estender depois, é só repetir o bloco
-- de trigger pra outra tabela): `operadores`, `pecas`, `servicos`,
-- `caixa_movimentos`, `contas_pagar`, `contas_receber`, `ordens_servico`,
-- `clientes`, `fornecedores`, `pedidos_compra`, `lojas`. Só
-- **UPDATE/DELETE** (não INSERT) — a criação de um registro já fica
-- registrada nele mesmo (a maioria das tabelas já tem `criado_em`, várias
-- também têm `operador_id`/`criado_por_id`); o que faltava era saber quem
-- mudou ou apagou algo depois de criado, que é o que este módulo cobre.
--
-- Leitura só pra admin (`operador_atual_e_admin()`, já existe desde a
-- migration 0008). Escrita só acontece pelo trigger (função `security
-- definer`, roda com o dono da função — por isso não precisa de policy de
-- insert aqui, um operador comum não consegue gravar direto nesta tabela).
--
-- Idempotente: seguro rodar de novo.

create table if not exists auditoria (
  id uuid primary key default gen_random_uuid(),
  tabela text not null,
  registro_id uuid not null,
  acao text not null check (acao in ('atualizar', 'excluir')),
  operador_id uuid references operadores (id),
  dados_antes jsonb,
  dados_depois jsonb,
  criado_em timestamptz not null default now()
);

create index if not exists auditoria_tabela_registro_idx on auditoria (tabela, registro_id);
create index if not exists auditoria_criado_em_idx on auditoria (criado_em desc);
create index if not exists auditoria_operador_id_idx on auditoria (operador_id);

alter table auditoria enable row level security;
drop policy if exists "auditoria_leitura_admins" on auditoria;
create policy "auditoria_leitura_admins" on auditoria
  for select
  using (operador_atual_e_admin());

create or replace function registrar_auditoria()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (tg_op = 'UPDATE') then
    insert into auditoria (tabela, registro_id, acao, operador_id, dados_antes, dados_depois)
    values (tg_table_name, new.id, 'atualizar', auth.uid(), to_jsonb(old), to_jsonb(new));
    return new;
  elsif (tg_op = 'DELETE') then
    insert into auditoria (tabela, registro_id, acao, operador_id, dados_antes, dados_depois)
    values (tg_table_name, old.id, 'excluir', auth.uid(), to_jsonb(old), null);
    return old;
  end if;
  return null;
end;
$$;

do $$
declare
  tabela_alvo text;
begin
  foreach tabela_alvo in array array[
    'operadores', 'pecas', 'servicos', 'caixa_movimentos', 'contas_pagar',
    'contas_receber', 'ordens_servico', 'clientes', 'fornecedores',
    'pedidos_compra', 'lojas'
  ]
  loop
    execute format('drop trigger if exists trigger_auditoria on %I', tabela_alvo);
    execute format(
      'create trigger trigger_auditoria after update or delete on %I ' ||
      'for each row execute function registrar_auditoria()',
      tabela_alvo
    );
  end loop;
end;
$$;
