-- Sakura System — AutoCenter Edition
-- Migration 0021: tipo de pessoa (física/jurídica) no cadastro de cliente —
-- pedido da usuária pra diferenciar cliente pessoa física (CPF) de pessoa
-- jurídica/empresa (CNPJ). Idempotente: seguro rodar de novo.

alter table clientes
  add column if not exists tipo_pessoa text not null default 'fisica'
  check (tipo_pessoa in ('fisica', 'juridica'));
