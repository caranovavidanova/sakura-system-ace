-- Sakura System — AutoCenter Edition
-- Migration 0029: categoria de serviço (tabela própria, mesmo padrão de
-- "categorias" pra peças) — agrupa o catálogo de serviços por área do
-- veículo (Pneus, Suspensão, Amortecedores, Freios, Alinhamento...),
-- selecionável no cadastro de serviço em Configurações → "Categorias de
-- serviço". Tabela separada de "categorias" (que é só pra produtos) —
-- o conceito é diferente, mesmo padrão já usado com "categorias_caixa".
-- Idempotente: seguro rodar de novo.

create table if not exists categorias_servicos (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  criado_em timestamptz not null default now()
);

alter table categorias_servicos enable row level security;

drop policy if exists "categorias_servicos_acesso_autenticados" on categorias_servicos;
create policy "categorias_servicos_acesso_autenticados" on categorias_servicos
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

alter table servicos
  add column if not exists categoria_id uuid references categorias_servicos (id) on delete set null;
