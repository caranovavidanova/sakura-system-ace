-- Sakura System — AutoCenter Edition
-- Migration 0005: ordens de serviço e seus itens (peças e serviços)

create table if not exists ordens_servico (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references clientes (id) on delete restrict,
  veiculo_id uuid references veiculos (id) on delete set null,
  status text not null default 'aberta'
    check (status in ('aberta', 'em_andamento', 'concluida', 'faturada')),
  km_entrada int,
  descricao_problema text,
  forma_pagamento text,
  data_abertura timestamptz not null default now(),
  data_fechamento timestamptz
);

create index if not exists ordens_servico_cliente_id_idx on ordens_servico (cliente_id);

create table if not exists ordens_servico_itens (
  id uuid primary key default gen_random_uuid(),
  ordem_servico_id uuid not null references ordens_servico (id) on delete cascade,
  tipo text not null check (tipo in ('peca', 'servico')),
  peca_id uuid references pecas (id),
  descricao text not null,
  quantidade numeric(12, 2) not null check (quantidade > 0),
  preco_unitario numeric(12, 2) not null default 0,
  desconto numeric(12, 2) not null default 0
);

create index if not exists ordens_servico_itens_ordem_id_idx
  on ordens_servico_itens (ordem_servico_id);

-- TEMPORÁRIO: mesma lógica das migrations anteriores — libera acesso pela
-- chave pública até a autenticação de usuário ser implementada.
alter table ordens_servico enable row level security;
alter table ordens_servico_itens enable row level security;

create policy "ordens_servico_acesso_temporario" on ordens_servico
  for all
  using (true)
  with check (true);

create policy "ordens_servico_itens_acesso_temporario" on ordens_servico_itens
  for all
  using (true)
  with check (true);
