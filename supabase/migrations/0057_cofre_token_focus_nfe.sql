-- Sakura System — AutoCenter Edition
-- Migration 0057: o token da Focus NFe sai do alcance do operador — item
-- TR-04.2, parte 1 de 2.
--
-- O problema. `configuracoes_fiscais_loja.focus_nfe_token` é uma coluna
-- comum: qualquer operador com acesso à loja — balconista incluído — lê
-- essa coluna pela API, com a chave que está no computador dele. E esse
-- token EMITE E CANCELA NOTA FISCAL NO CNPJ DA LOJA. Nas mãos erradas ele
-- não vaza dado: produz documento fiscal falso ou cancela documento
-- verdadeiro, com consequência tributária pro dono da loja. Era o segredo
-- mais sensível do sistema guardado com menos cuidado que a chave da
-- Anthropic.
--
-- Como fica:
--   • o token passa a morar em `segredos_fiscais_loja`, uma tabela SEM
--     POLICY NENHUMA: nenhum operador lê, nem admin, nem o próprio app. Só
--     a service role (que existe apenas dentro das Edge Functions) enxerga;
--   • quem usa o token é o "porteiro" — a Edge Function `focus-nfe` —, que
--     confere quem está pedindo antes de repassar à Focus NFe;
--   • o admin continua trocando o token pela tela de Configurações, por
--     `definir_token_focus_nfe()`: dá pra ESCREVER, nunca ler de volta;
--   • a tela só precisa saber "esta loja tem token?", e isso é tudo que
--     `loja_tem_token_focus_nfe()` responde.
--
-- ⚠️  POR QUE A COLUNA ANTIGA NÃO SOME AQUI. A regra do projeto (seção 9,
--     "Voltar uma versão"): migration nunca tira coluna em uso na mesma
--     versão que passa a usar a nova. Se a versão do porteiro sair ruim e
--     for preciso voltar pra v0.9.40, aquela versão lê o token da coluna
--     antiga — e emitir nota não pode parar por causa de um rollback.
--     A parte 2 (uma migration seguinte) limpa a coluna antiga, SÓ depois
--     de uma nota emitida e uma cancelada de verdade pelo porteiro. Até lá
--     o token continua copiado lá, legível como sempre foi: a proteção de
--     verdade chega com a parte 2.
--
-- Por que tabela nova, e não um secret da Edge Function como o guia
-- sugeria (decidido com a usuária em 25/09/2026): um secret é um por projeto
-- Supabase, ou seja, um por EMPRESA — e uma empresa com duas lojas em CNPJs
-- diferentes precisaria de dois tokens, a menos que um token da Focus NFe
-- sirva pros dois CNPJs, o que não deu pra confirmar. A tabela guarda um
-- por loja, e continua funcionando se um dia a conta da Focus NFe for
-- unificada: é o mesmo token colado em cada loja.
--
-- Idempotente: seguro rodar de novo.

-- ===================================================================
-- 1. O cofre
-- ===================================================================

create table if not exists segredos_fiscais_loja (
  loja_id         uuid primary key references lojas(id) on delete cascade,
  focus_nfe_token text not null,
  atualizado_em   timestamptz not null default now()
);

comment on table segredos_fiscais_loja is
  'TR-04.2. O token da Focus NFe de cada loja. SEM POLICY NENHUMA de '
  'propósito: nenhum operador lê nem escreve aqui pela API. Quem lê é a Edge '
  'Function focus-nfe (service role); quem escreve é '
  'definir_token_focus_nfe(), só admin da loja. Não criar policy de select '
  'aqui — é o que transformaria o cofre de volta numa coluna comum.';

alter table segredos_fiscais_loja enable row level security;

-- Nenhuma policy. Os quatro comandos estão declarados como lacuna
-- proposital em supabase/testes-rls/lacunas-de-proposito.csv, e a matriz de
-- RLS reprova se alguém criar uma.

-- ===================================================================
-- 2. Copiar o token que já existe (pra ninguém precisar colar de novo)
-- ===================================================================
-- `do nothing` no conflito: rodando esta migration de novo depois de o
-- admin ter trocado o token pelo cofre, a cópia antiga não pode passar por
-- cima da nova.

insert into segredos_fiscais_loja (loja_id, focus_nfe_token)
select loja_id, btrim(focus_nfe_token)
  from configuracoes_fiscais_loja
 where focus_nfe_token is not null
   and btrim(focus_nfe_token) <> ''
on conflict (loja_id) do nothing;

-- ===================================================================
-- 3. Escrever sem poder ler: só admin da loja
-- ===================================================================

create or replace function definir_token_focus_nfe(p_loja_id uuid, p_token text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not operador_e_admin_da_loja(p_loja_id) then
    raise exception 'Só um administrador desta loja pode trocar o token da Focus NFe.'
      using errcode = '42501';
  end if;
  if p_token is null or btrim(p_token) = '' then
    raise exception 'O token da Focus NFe não pode ficar em branco.'
      using errcode = '22023';
  end if;

  insert into segredos_fiscais_loja (loja_id, focus_nfe_token, atualizado_em)
  values (p_loja_id, btrim(p_token), now())
  on conflict (loja_id) do update
    set focus_nfe_token = excluded.focus_nfe_token,
        atualizado_em   = now();
end;
$$;

comment on function definir_token_focus_nfe(uuid, text) is
  'TR-04.2. Grava (ou troca) o token da Focus NFe da loja. Só admin ativo da '
  'loja. Não devolve nada — o token não sai do banco por aqui.';

-- ===================================================================
-- 4. A tela só precisa de "tem token?"
-- ===================================================================

create or replace function loja_tem_token_focus_nfe(p_loja_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select operador_tem_acesso_loja(p_loja_id)
     and exists (
       select 1 from segredos_fiscais_loja
        where loja_id = p_loja_id
          and btrim(focus_nfe_token) <> ''
     );
$$;

comment on function loja_tem_token_focus_nfe(uuid) is
  'TR-04.2. Verdadeiro se a loja tem token da Focus NFe no cofre. Só '
  'responde a quem tem acesso à loja; pra qualquer outro, falso.';

-- ===================================================================
-- 5. Quem pode usar o porteiro, e pra quê
-- ===================================================================
-- A regra mora aqui, e não dentro da Edge Function, pra existir num lugar
-- só e poder ser testada num Postgres local (testar-porteiro-focus-nfe.sql).
-- O porteiro chama esta função COMO O OPERADOR que pediu, então o
-- `auth.uid()` lá dentro é quem está no balcão.
--
-- A regra copia o que a tela já permite hoje, pra ninguém perder nada:
--   • emitir, consultar e baixar o PDF/XML: quem abre a aba Fechamento da OS
--     (módulo Ordens de Serviço) ou a tela de Notas Fiscais;
--   • cancelar: só quem tem Notas Fiscais — é a única tela que cancela.
-- Admin ativo passa em tudo (é o que operador_tem_permissao já faz).

create or replace function pode_usar_focus_nfe(p_loja_id uuid, p_acao text)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select operador_tem_acesso_loja(p_loja_id)
     and case p_acao
           when 'cancelar' then operador_tem_permissao('notas_fiscais')
           when 'emitir'   then operador_tem_permissao('ordens_servico')
                             or operador_tem_permissao('notas_fiscais')
           when 'consultar' then operador_tem_permissao('ordens_servico')
                             or operador_tem_permissao('notas_fiscais')
           when 'baixar'   then operador_tem_permissao('ordens_servico')
                             or operador_tem_permissao('notas_fiscais')
           else false
         end;
$$;

comment on function pode_usar_focus_nfe(uuid, text) is
  'TR-04.2. A regra do porteiro da Focus NFe. Ações: emitir, consultar, '
  'baixar, cancelar. Qualquer outra resposta é falso.';

-- As três funções são `security definer`. Sem estes revokes, o Postgres dá
-- EXECUTE a PUBLIC e o Supabase dá ao `anon` — e quem não está logado
-- conseguiria ao menos perguntar. Com eles, só quem está logado chama.
revoke all on function definir_token_focus_nfe(uuid, text) from public, anon;
revoke all on function loja_tem_token_focus_nfe(uuid)      from public, anon;
revoke all on function pode_usar_focus_nfe(uuid, text)     from public, anon;
grant execute on function definir_token_focus_nfe(uuid, text) to authenticated;
grant execute on function loja_tem_token_focus_nfe(uuid)      to authenticated;
grant execute on function pode_usar_focus_nfe(uuid, text)     to authenticated;

-- ===================================================================
-- 6. Auditoria: quem trocou o token, e quando — sem o token
-- ===================================================================
-- A máscara da 0053 é por NOME DE COLUNA, e a coluna aqui se chama
-- focus_nfe_token de propósito: o valor sai como '***' na trilha.

drop trigger if exists trigger_auditoria on segredos_fiscais_loja;
create trigger trigger_auditoria
  after insert or update or delete on segredos_fiscais_loja
  for each row execute function registrar_auditoria('loja_id');

insert into schema_versao (versao) values (57) on conflict do nothing;
