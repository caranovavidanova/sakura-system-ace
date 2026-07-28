-- Sakura System — AutoCenter Edition
-- Migration 0011: catálogo de serviços (nome + preço padrão). Usado no
-- módulo "Serviços" e selecionável nos itens de Ordem de Serviço, no lugar
-- de digitar o serviço na mão toda vez.

create table if not exists servicos (
  id uuid primary key default gen_random_uuid(),
  codigo_interno text,
  descricao text not null,
  preco_padrao numeric(12, 2),
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

-- TEMPORÁRIO: mesma lógica das migrations anteriores (0002, 0003...) —
-- libera acesso pela chave pública; permissão de verdade fica na interface
-- (ver seção 6 do PROJETO_STATUS.md).
alter table servicos enable row level security;

drop policy if exists "servicos_acesso_temporario" on servicos;
create policy "servicos_acesso_temporario" on servicos
  for all
  using (true)
  with check (true);
