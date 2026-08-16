-- Sakura System — AutoCenter Edition
-- Migration 0038: cadastro de Fornecedores — só o cadastro básico por
-- enquanto (nome/razão social, CNPJ, telefone, e-mail), base pra decidir
-- depois qual funcionalidade avançada de estoque vem em seguida (Pedido de
-- Compra, Entrada via NFe do fornecedor, Depósito, Garantia do fornecedor —
-- ver PROJETO_STATUS.md seção 8, item 4). Compartilhado entre lojas, mesmo
-- padrão de clientes/peças/serviços/categorias — um fornecedor pode
-- abastecer mais de uma loja da empresa.
-- Idempotente: seguro rodar de novo.

create table if not exists fornecedores (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  cnpj text,
  telefone text,
  email text,
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

alter table fornecedores enable row level security;

drop policy if exists "fornecedores_acesso_autenticados" on fornecedores;
create policy "fornecedores_acesso_autenticados" on fornecedores
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);
