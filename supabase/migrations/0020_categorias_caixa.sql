-- Sakura System — AutoCenter Edition
-- Migration 0020: categorias de caixa (aluguel, mercado, limpeza, sucata...)
-- pra classificar lançamentos manuais de entrada/saída no Caixa — usadas
-- pelas abas novas "Entradas" e "Saídas" dentro do módulo Caixa Diário.
-- Idempotente: seguro rodar de novo.

create table if not exists categorias_caixa (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  tipo text not null check (tipo in ('entrada', 'saida')),
  criado_em timestamptz not null default now(),
  unique (nome, tipo)
);

alter table categorias_caixa enable row level security;

drop policy if exists "categorias_caixa_acesso_autenticados" on categorias_caixa;
create policy "categorias_caixa_acesso_autenticados" on categorias_caixa
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

alter table caixa_movimentos
  add column if not exists categoria_id uuid references categorias_caixa (id) on delete set null;
