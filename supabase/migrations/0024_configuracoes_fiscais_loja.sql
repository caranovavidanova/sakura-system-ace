-- Sakura System — AutoCenter Edition
-- Migration 0024: dados fiscais da loja + preparação para emissão automática
-- de nota fiscal via Focus NFe (ainda não habilitada — falta a usuária
-- assinar um plano e colar o token aqui). Loja única (não multi-loja), por
-- isso uma tabela "singleton" (1 linha só, id fixo), editável só pelo admin
-- em Configurações. Ver PROJETO_STATUS.md seção 8, item 1.
--
-- Também prepara `notas_fiscais_arquivos` (migration 0023) para guardar
-- documentos emitidos automaticamente, não só upload manual de XML — mesma
-- tabela/bucket, só com campos novos pra registrar o retorno do provedor
-- fiscal (número, chave de acesso, status).
-- Idempotente: seguro rodar de novo.

create table if not exists configuracoes_fiscais_loja (
  id smallint primary key default 1,
  cnpj text,
  razao_social text,
  nome_fantasia text,
  inscricao_estadual text,
  inscricao_municipal text,
  regime_tributario text check (regime_tributario in ('simples_nacional', 'lucro_presumido', 'lucro_real')),
  cep text,
  rua text,
  numero text,
  bairro text,
  cidade text,
  uf text,
  telefone text,
  email text,
  focus_nfe_token text,
  focus_nfe_ambiente text not null default 'homologacao' check (focus_nfe_ambiente in ('homologacao', 'producao')),
  atualizado_em timestamptz not null default now(),
  constraint configuracoes_fiscais_loja_singleton check (id = 1)
);

insert into configuracoes_fiscais_loja (id)
values (1)
on conflict (id) do nothing;

alter table configuracoes_fiscais_loja enable row level security;

drop policy if exists "configuracoes_fiscais_loja_acesso_autenticados" on configuracoes_fiscais_loja;
create policy "configuracoes_fiscais_loja_acesso_autenticados" on configuracoes_fiscais_loja
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

alter table notas_fiscais_arquivos
  add column if not exists origem text not null default 'manual'
  check (origem in ('manual', 'automatica'));

alter table notas_fiscais_arquivos add column if not exists numero text;
alter table notas_fiscais_arquivos add column if not exists chave_acesso text;
alter table notas_fiscais_arquivos add column if not exists status text;
