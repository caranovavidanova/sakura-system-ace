-- Sakura System — AutoCenter Edition
-- Migration 0059: comissão paga fica registrada e congelada (item TL-46.1).
--
-- O PROBLEMA. A comissão de cada funcionário é sempre RECALCULADA a partir
-- das OS. Desde a v0.9.28 dá pra corrigir o valor de um item de OS já
-- lançado — então uma correção numa OS antiga muda, retroativamente, uma
-- comissão que já foi paga. E ninguém fica sabendo: a tela simplesmente
-- mostra outro número.
--
-- O DESENHO. Registrar um pagamento grava, junto com o valor pago, um
-- RETRATO das OS que formaram aquele número (`snapshot`). Daí em diante a
-- tela compara o recálculo de hoje com o retrato, e quando divergir MOSTRA
-- (nunca esconde) — é o sinal de que alguém editou uma OS depois do
-- pagamento. O retrato também é o que permite avisar quando uma OS de um
-- período novo já foi paga num período anterior que cruza com ele.
--
-- TRÊS DECISÕES QUE VALEM SABER:
--
-- 1. O NOME do funcionário é gravado junto, e não só o id: registro de
--    pagamento é histórico, e precisa continuar dizendo pra quem foi mesmo se
--    o cadastro mudar ou sair (mesmo motivo do `operador_nome` da auditoria,
--    migration 0053).
-- 2. NINGUÉM ALTERA um registro de pagamento (não existe policy de update,
--    declarado na matriz de RLS). Registrou errado? Um admin da loja desfaz e
--    registra de novo — e a trilha de auditoria guarda os dois.
-- 3. LER E REGISTRAR EXIGEM O MÓDULO FUNCIONÁRIOS no banco — é onde a tela de
--    Comissões mora, e a tabela `funcionarios` já exige o mesmo desde a 0056.
--    Tabela nova não tem comportamento antigo pra quebrar.
--
-- Não lança nada no Caixa, de propósito: comissão costuma sair junto do
-- salário, por Pix ou em dinheiro, e cada loja faz de um jeito. Se for pago
-- em dinheiro da gaveta, é um lançamento manual de saída, como sempre foi.
--
-- Idempotente: seguro rodar de novo.

create table if not exists comissoes_fechamentos (
  id               uuid primary key default gen_random_uuid(),
  loja_id          uuid not null references lojas(id),
  funcionario_id   uuid references funcionarios(id) on delete set null,
  funcionario_nome text not null,
  periodo_inicio   date not null,
  periodo_fim      date not null,
  percentual       numeric(5,2),
  -- o que a tela calculou no momento do pagamento (pode ser negativo: lucro
  -- negativo dá comissão negativa, e isso precisa aparecer, não sumir)
  valor_calculado  numeric(12,2) not null,
  valor_pago       numeric(12,2) not null,
  data_pagamento   date not null,
  observacao       text,
  -- [{ "ordemId", "numero", "papel": "vendedor"|"tecnico", "comissao" }]
  snapshot         jsonb not null default '[]'::jsonb,
  operador_id      uuid references operadores(id) on delete set null,
  criado_em        timestamptz not null default now(),
  constraint comissoes_fechamentos_periodo_unico unique (funcionario_id, periodo_inicio, periodo_fim),
  constraint ck_comissoes_fechamentos_valores check (
    periodo_fim >= periodo_inicio and valor_pago >= 0
  )
);

comment on table comissoes_fechamentos is
  'TL-46.1. Um pagamento de comissão por funcionário por período, com o retrato '
  'das OS que formaram o valor. A tela compara o recálculo com o retrato e avisa '
  'quando uma OS foi editada depois do pagamento. Sem update; desfazer é de admin.';

create index if not exists comissoes_fechamentos_loja_idx
  on comissoes_fechamentos (loja_id, periodo_fim desc);

alter table comissoes_fechamentos enable row level security;

drop policy if exists "comissoes_fechamentos_leitura" on comissoes_fechamentos;
drop policy if exists "comissoes_fechamentos_insercao" on comissoes_fechamentos;
drop policy if exists "comissoes_fechamentos_exclusao" on comissoes_fechamentos;

create policy "comissoes_fechamentos_leitura" on comissoes_fechamentos
  for select to authenticated
  using (
    operador_tem_acesso_loja(loja_id)
    and (select operador_tem_permissao('funcionarios'))
  );

create policy "comissoes_fechamentos_insercao" on comissoes_fechamentos
  for insert to authenticated
  with check (
    operador_tem_acesso_loja(loja_id)
    and (select operador_tem_permissao('funcionarios'))
  );

create policy "comissoes_fechamentos_exclusao" on comissoes_fechamentos
  for delete to authenticated
  using (operador_e_admin_da_loja(loja_id));

drop trigger if exists trigger_auditoria on comissoes_fechamentos;
create trigger trigger_auditoria
  after insert or update or delete on comissoes_fechamentos
  for each row execute function registrar_auditoria('id');

insert into schema_versao (versao) values (59) on conflict do nothing;
