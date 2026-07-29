-- Sakura System — AutoCenter Edition
-- Migration 0025: módulo "Contas a Pagar" — contas mensais (aluguel, etc.)
-- com data de vencimento, diferente das Entradas/Saídas manuais do Caixa
-- (que só registram dinheiro que já saiu). Ao marcar uma conta como paga, o
-- app gera automaticamente uma Saída em caixa_movimentos (mesmo padrão do
-- faturamento de OS) e, se a conta for recorrente, já cria a próxima
-- ocorrência (mesmo valor, vencimento um mês depois). Ver PROJETO_STATUS.md.
-- Idempotente: seguro rodar de novo.

create table if not exists contas_pagar (
  id uuid primary key default gen_random_uuid(),
  descricao text not null,
  valor numeric not null,
  vencimento date not null,
  categoria_id uuid references categorias_caixa (id) on delete set null,
  recorrente boolean not null default false,
  status text not null default 'pendente' check (status in ('pendente', 'paga')),
  data_pagamento timestamptz,
  caixa_movimento_id uuid references caixa_movimentos (id) on delete set null,
  operador_id uuid references operadores (id) on delete set null,
  criado_em timestamptz not null default now()
);

alter table contas_pagar enable row level security;

drop policy if exists "contas_pagar_acesso_autenticados" on contas_pagar;
create policy "contas_pagar_acesso_autenticados" on contas_pagar
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);
