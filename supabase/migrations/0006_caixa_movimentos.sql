-- Sakura System — AutoCenter Edition
-- Migration 0006: caixa diário (nasce das OS faturadas + lançamentos manuais)

create table if not exists caixa_movimentos (
  id uuid primary key default gen_random_uuid(),
  data timestamptz not null default now(),
  ordem_servico_id uuid references ordens_servico (id),
  tipo text not null check (tipo in ('entrada', 'saida')),
  forma_pagamento text,
  valor numeric(12, 2) not null check (valor >= 0),
  descricao text,
  constraint caixa_movimentos_ordem_id_idx_unique unique (ordem_servico_id)
);

-- TEMPORÁRIO: mesma lógica das migrations anteriores — libera acesso pela
-- chave pública até a autenticação de usuário ser implementada.
alter table caixa_movimentos enable row level security;

drop policy if exists "caixa_movimentos_acesso_temporario" on caixa_movimentos;
create policy "caixa_movimentos_acesso_temporario" on caixa_movimentos
  for all
  using (true)
  with check (true);
