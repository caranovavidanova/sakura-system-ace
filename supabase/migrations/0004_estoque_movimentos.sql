-- Sakura System — AutoCenter Edition
-- Migration 0004: movimentações de estoque (entrada/saída)

create table if not exists estoque_movimentos (
  id uuid primary key default gen_random_uuid(),
  peca_id uuid not null references pecas (id) on delete cascade,
  tipo text not null check (tipo in ('entrada', 'saida')),
  quantidade numeric(12, 2) not null check (quantidade > 0),
  motivo text not null check (motivo in ('compra', 'venda', 'ajuste', 'uso_em_os')),
  referencia text,
  criado_em timestamptz not null default now()
);

create index if not exists estoque_movimentos_peca_id_idx on estoque_movimentos (peca_id);

-- TEMPORÁRIO: mesma lógica das migrations anteriores — libera acesso pela
-- chave pública até a autenticação de usuário ser implementada.
alter table estoque_movimentos enable row level security;

drop policy if exists "estoque_movimentos_acesso_temporario" on estoque_movimentos;
create policy "estoque_movimentos_acesso_temporario" on estoque_movimentos
  for all
  using (true)
  with check (true);
