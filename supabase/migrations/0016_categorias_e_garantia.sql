-- Sakura System — AutoCenter Edition
-- Migration 0016: categoria de produto (tabela própria, reutilizável entre
-- peças — evita erro de digitação e permite renomear uma categoria e
-- refletir em todas as peças de uma vez) e prazo de garantia por peça
-- (usado na tela de Garantias; a garantia em si não vira tabela nova —
-- é calculada a partir da data de fechamento da OS + este prazo).
-- Idempotente: seguro rodar de novo.

create table if not exists categorias (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  criado_em timestamptz not null default now()
);

alter table categorias enable row level security;

drop policy if exists "categorias_acesso_autenticados" on categorias;
create policy "categorias_acesso_autenticados" on categorias
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

alter table pecas add column if not exists categoria_id uuid references categorias (id) on delete set null;
alter table pecas add column if not exists prazo_garantia_dias integer;
