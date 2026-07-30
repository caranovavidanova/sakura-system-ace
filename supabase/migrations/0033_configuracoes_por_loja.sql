-- Sakura System — AutoCenter Edition
-- Migration 0033: fundação multi-loja, parte 3 — as tabelas de configuração
-- que hoje são "singleton" (1 linha só, id fixo em 1: configuracoes_garantia,
-- configuracoes_fiscais_loja, configuracoes_painel_inicio) passam a ter
-- 1 linha POR LOJA, trocando a PK de `id smallint` pra `loja_id uuid`.
-- `configuracoes_juros_parcelas` não é singleton (1 linha por
-- numero_parcelas, 2 a 12) — a PK vira composta (loja_id, numero_parcelas).
--
-- Troca de PK não é uma mudança aditiva, então cada tabela usa um bloco
-- guardado (checa o estado atual antes de alterar) pra continuar
-- idempotente — mesmo padrão usado na migration 0019 ao repontar FKs de
-- tecnico_id/vendedor_id. Depende das migrations 0031/0032 já terem
-- rodado. Idempotente: seguro rodar de novo.

-- configuracoes_garantia
alter table configuracoes_garantia add column if not exists loja_id uuid references lojas (id);
update configuracoes_garantia set loja_id = '00000000-0000-0000-0000-000000000001' where loja_id is null;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_name = 'configuracoes_garantia' and column_name = 'id'
  ) then
    alter table configuracoes_garantia alter column loja_id set not null;
    alter table configuracoes_garantia drop constraint configuracoes_garantia_pkey;
    alter table configuracoes_garantia drop constraint if exists configuracoes_garantia_singleton;
    alter table configuracoes_garantia add constraint configuracoes_garantia_pkey primary key (loja_id);
    alter table configuracoes_garantia drop column id;
  end if;
end $$;

drop policy if exists "configuracoes_garantia_acesso_autenticados" on configuracoes_garantia;
drop policy if exists "configuracoes_garantia_acesso_por_loja" on configuracoes_garantia;
create policy "configuracoes_garantia_acesso_por_loja" on configuracoes_garantia
  for all
  using (operador_tem_acesso_loja(loja_id))
  with check (operador_tem_acesso_loja(loja_id));

-- configuracoes_fiscais_loja
alter table configuracoes_fiscais_loja add column if not exists loja_id uuid references lojas (id);
update configuracoes_fiscais_loja set loja_id = '00000000-0000-0000-0000-000000000001' where loja_id is null;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_name = 'configuracoes_fiscais_loja' and column_name = 'id'
  ) then
    alter table configuracoes_fiscais_loja alter column loja_id set not null;
    alter table configuracoes_fiscais_loja drop constraint configuracoes_fiscais_loja_pkey;
    alter table configuracoes_fiscais_loja drop constraint if exists configuracoes_fiscais_loja_singleton;
    alter table configuracoes_fiscais_loja add constraint configuracoes_fiscais_loja_pkey primary key (loja_id);
    alter table configuracoes_fiscais_loja drop column id;
  end if;
end $$;

drop policy if exists "configuracoes_fiscais_loja_acesso_autenticados" on configuracoes_fiscais_loja;
drop policy if exists "configuracoes_fiscais_loja_acesso_por_loja" on configuracoes_fiscais_loja;
create policy "configuracoes_fiscais_loja_acesso_por_loja" on configuracoes_fiscais_loja
  for all
  using (operador_tem_acesso_loja(loja_id))
  with check (operador_tem_acesso_loja(loja_id));

-- configuracoes_painel_inicio
alter table configuracoes_painel_inicio add column if not exists loja_id uuid references lojas (id);
update configuracoes_painel_inicio set loja_id = '00000000-0000-0000-0000-000000000001' where loja_id is null;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_name = 'configuracoes_painel_inicio' and column_name = 'id'
  ) then
    alter table configuracoes_painel_inicio alter column loja_id set not null;
    alter table configuracoes_painel_inicio drop constraint configuracoes_painel_inicio_pkey;
    alter table configuracoes_painel_inicio drop constraint if exists configuracoes_painel_inicio_singleton;
    alter table configuracoes_painel_inicio add constraint configuracoes_painel_inicio_pkey primary key (loja_id);
    alter table configuracoes_painel_inicio drop column id;
  end if;
end $$;

drop policy if exists "configuracoes_painel_inicio_acesso_autenticados" on configuracoes_painel_inicio;
drop policy if exists "configuracoes_painel_inicio_acesso_por_loja" on configuracoes_painel_inicio;
create policy "configuracoes_painel_inicio_acesso_por_loja" on configuracoes_painel_inicio
  for all
  using (operador_tem_acesso_loja(loja_id))
  with check (operador_tem_acesso_loja(loja_id));

-- configuracoes_juros_parcelas: não é singleton — PK vira composta
-- (loja_id, numero_parcelas) em vez de só numero_parcelas.
alter table configuracoes_juros_parcelas add column if not exists loja_id uuid references lojas (id);
update configuracoes_juros_parcelas set loja_id = '00000000-0000-0000-0000-000000000001' where loja_id is null;

do $$
begin
  if not exists (
    select 1 from information_schema.key_column_usage
    where table_name = 'configuracoes_juros_parcelas'
      and column_name = 'loja_id'
      and constraint_name = 'configuracoes_juros_parcelas_pkey'
  ) then
    alter table configuracoes_juros_parcelas alter column loja_id set not null;
    alter table configuracoes_juros_parcelas drop constraint configuracoes_juros_parcelas_pkey;
    alter table configuracoes_juros_parcelas add constraint configuracoes_juros_parcelas_pkey
      primary key (loja_id, numero_parcelas);
  end if;
end $$;

drop policy if exists "configuracoes_juros_parcelas_acesso_autenticados" on configuracoes_juros_parcelas;
drop policy if exists "configuracoes_juros_parcelas_acesso_por_loja" on configuracoes_juros_parcelas;
create policy "configuracoes_juros_parcelas_acesso_por_loja" on configuracoes_juros_parcelas
  for all
  using (operador_tem_acesso_loja(loja_id))
  with check (operador_tem_acesso_loja(loja_id));
