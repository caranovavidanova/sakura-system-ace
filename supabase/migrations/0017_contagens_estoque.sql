-- Sakura System — AutoCenter Edition
-- Migration 0017: contagem/inventário físico de estoque — registra a
-- contagem manual de um produto, o saldo que o sistema calculava no
-- momento e a diferença encontrada. O app gera automaticamente um
-- lançamento de ajuste em estoque_movimentos quando há diferença (mesmo
-- padrão que "Qtde. estoque inicial" já usa no cadastro de produto).
-- Idempotente: seguro rodar de novo.

create table if not exists contagens_estoque (
  id uuid primary key default gen_random_uuid(),
  peca_id uuid not null references pecas (id) on delete cascade,
  quantidade_contada numeric(12, 2) not null,
  saldo_sistema numeric(12, 2) not null,
  diferenca numeric(12, 2) not null,
  observacao text,
  operador_id uuid references operadores (id),
  criado_em timestamptz not null default now()
);

create index if not exists contagens_estoque_peca_id_idx on contagens_estoque (peca_id);

alter table contagens_estoque enable row level security;

drop policy if exists "contagens_estoque_acesso_autenticados" on contagens_estoque;
create policy "contagens_estoque_acesso_autenticados" on contagens_estoque
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);
