-- Sakura System — AutoCenter Edition
-- Migration 0023: módulo "Notas Fiscais" — guarda os arquivos XML de NFe/NFS-e
-- organizados por mês, com vínculo opcional a uma Ordem de Serviço. A emissão
-- fiscal automática ainda não existe (ver PROJETO_STATUS.md), então por
-- enquanto o upload é manual: a usuária sobe o XML da nota que já emite por
-- fora. Quando a emissão automática for construída, ela pode gravar direto
-- nessa mesma tabela/bucket em vez do upload manual.
--
-- Primeira vez que este projeto usa o Supabase Storage — cria um bucket
-- privado ("notas-fiscais") além da tabela de metadados de sempre.
-- Idempotente: seguro rodar de novo.

insert into storage.buckets (id, name, public)
values ('notas-fiscais', 'notas-fiscais', false)
on conflict (id) do nothing;

drop policy if exists "notas_fiscais_storage_acesso_autenticados" on storage.objects;
create policy "notas_fiscais_storage_acesso_autenticados" on storage.objects
  for all
  using (bucket_id = 'notas-fiscais' and auth.uid() is not null)
  with check (bucket_id = 'notas-fiscais' and auth.uid() is not null);

create table if not exists notas_fiscais_arquivos (
  id uuid primary key default gen_random_uuid(),
  tipo text not null check (tipo in ('nfe', 'nfse')),
  competencia date not null,
  nome_arquivo text not null,
  storage_path text not null,
  ordem_servico_id uuid references ordens_servico (id) on delete set null,
  operador_id uuid references operadores (id) on delete set null,
  criado_em timestamptz not null default now()
);

alter table notas_fiscais_arquivos enable row level security;

drop policy if exists "notas_fiscais_arquivos_acesso_autenticados" on notas_fiscais_arquivos;
create policy "notas_fiscais_arquivos_acesso_autenticados" on notas_fiscais_arquivos
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);
