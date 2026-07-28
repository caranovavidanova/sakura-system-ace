-- Sakura System — AutoCenter Edition
-- Migration 0001: clientes e veículos

create extension if not exists "pgcrypto";

create table if not exists clientes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  cpf_cnpj text,
  telefone text,
  email text,
  cep text,
  rua text,
  numero text,
  bairro text,
  cidade text,
  uf text,
  criado_em timestamptz not null default now()
);

create table if not exists veiculos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references clientes (id) on delete cascade,
  placa text not null,
  marca text,
  modelo text,
  ano int,
  cor text,
  km_atual int,
  criado_em timestamptz not null default now()
);

create index if not exists veiculos_cliente_id_idx on veiculos (cliente_id);
