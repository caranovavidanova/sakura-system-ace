-- Sakura System — AutoCenter Edition
-- Migration 0022: amplia o cadastro de Funcionários com os campos de RH que a
-- usuária pediu depois de ver o cadastro de um sistema de referência
-- (documentos, endereço/contato, cargo/admissão, família) — dados de saúde
-- (enfermidades/medicamentos) ficaram de fora por escolha explícita dela
-- (dado sensível, mais cuidado de LGPD). Idempotente: seguro rodar de novo.

alter table funcionarios
  -- Documentos e dados pessoais
  add column if not exists cpf text,
  add column if not exists rg text,
  add column if not exists cnh_categoria text,
  add column if not exists cnh_numero text,
  add column if not exists data_nascimento date,
  add column if not exists estado_civil text,
  add column if not exists tipo_sanguineo text,
  -- Endereço e contato
  add column if not exists cep text,
  add column if not exists endereco text,
  add column if not exists numero text,
  add column if not exists bairro text,
  add column if not exists cidade text,
  add column if not exists estado text,
  add column if not exists complemento text,
  add column if not exists telefone text,
  add column if not exists celular text,
  add column if not exists email text,
  -- Cargo e admissão (cargo em si já existia)
  add column if not exists pis text,
  add column if not exists codigo_registro text,
  add column if not exists cbo text,
  add column if not exists salario numeric,
  add column if not exists comissao numeric,
  add column if not exists admissao date,
  add column if not exists data_ferias date,
  -- Família: filiação e cônjuge
  add column if not exists pai text,
  add column if not exists mae text,
  add column if not exists naturalidade text,
  add column if not exists sexo text,
  add column if not exists conjuge_nome text,
  add column if not exists conjuge_nascimento date,
  add column if not exists data_casamento date,
  add column if not exists conjuge_telefone text,
  add column if not exists conjuge_celular text;

-- Família: filhos (lista, um funcionário pode ter vários).
create table if not exists funcionario_filhos (
  id uuid primary key default gen_random_uuid(),
  funcionario_id uuid not null references funcionarios (id) on delete cascade,
  nome text not null,
  data_nascimento date,
  criado_em timestamptz not null default now()
);

alter table funcionario_filhos enable row level security;

drop policy if exists "funcionario_filhos_acesso_autenticados" on funcionario_filhos;
create policy "funcionario_filhos_acesso_autenticados" on funcionario_filhos
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);
