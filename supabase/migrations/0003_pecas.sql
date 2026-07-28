-- Sakura System — AutoCenter Edition
-- Migration 0003: peças/produtos (com dados fiscais)

create table if not exists pecas (
  id uuid primary key default gen_random_uuid(),
  codigo_interno text,
  descricao text not null,
  unidade text,
  preco_custo numeric(12, 2),
  preco_venda numeric(12, 2),
  ncm text,
  cfop_padrao text,
  cst_ou_csosn text,
  aliquota_icms numeric(5, 2),
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

-- TEMPORÁRIO: mesma lógica da migration 0002 — libera acesso pela chave
-- pública até a autenticação de usuário ser implementada.
alter table pecas enable row level security;

drop policy if exists "pecas_acesso_temporario" on pecas;
create policy "pecas_acesso_temporario" on pecas
  for all
  using (true)
  with check (true);
