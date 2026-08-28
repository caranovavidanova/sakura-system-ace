-- ===================================================================
-- STUB DO SUPABASE PARA VALIDAR MIGRATIONS NUM POSTGRES COMUM
-- ===================================================================
--
-- ⚠️  NUNCA rodar isto no Supabase de verdade. Serve SÓ pra testar as
--     migrations num Postgres local (o do ambiente de desenvolvimento),
--     onde os schemas `auth` e `storage` do Supabase não existem.
--
-- Não faz parte da sequência de migrations nem da instalação de uma loja.
--
-- Uso típico (ambiente de desenvolvimento):
--   service postgresql start
--   sudo -u postgres createdb teste_sakura
--   sudo -u postgres psql -d teste_sakura -f supabase/scripts/stub-supabase-local.sql
--   sudo -u postgres psql -d teste_sakura -f supabase/instalacao/instalacao-completa.sql
--   (rodar o segundo comando DUAS vezes, pra provar idempotência)
--
-- Existe porque toda sessão que precisava validar uma migration recriava
-- estes mesmos stubs do zero.
-- ===================================================================

create extension if not exists "pgcrypto";

-- --- schema auth (só o que as migrations do projeto encostam) ---
create schema if not exists auth;

create table if not exists auth.users (
  id uuid primary key default gen_random_uuid(),
  email text
);

-- No Supabase real, auth.uid() devolve o id do usuário logado, lido do JWT.
-- Aqui devolve o que estiver em `request.jwt.claim.sub`, pra dar pra simular
-- login de operadores diferentes num teste de RLS:
--   set local role authenticated;
--   set local "request.jwt.claim.sub" = '<uuid do operador>';
create or replace function auth.uid()
returns uuid
language sql
stable
as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;

-- --- schema storage (bucket de XML de nota fiscal) ---
create schema if not exists storage;

create table if not exists storage.buckets (
  id text primary key,
  name text not null,
  public boolean not null default false
);

create table if not exists storage.objects (
  id uuid primary key default gen_random_uuid(),
  bucket_id text references storage.buckets (id),
  name text,
  owner uuid
);

-- --- papéis que o Supabase cria sozinho ---
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then
    create role authenticated;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'anon') then
    create role anon;
  end if;
  if not exists (select 1 from pg_roles where rolname = 'service_role') then
    create role service_role;
  end if;
end
$$;

-- --- permissões que o Supabase concede sozinho ---
-- Sem isto, um teste de RLS falha com "permission denied for schema auth" em
-- vez de mostrar o que o operador realmente enxerga.
grant usage on schema public, auth, storage to authenticated, anon, service_role;
grant execute on function auth.uid() to authenticated, anon, service_role;
grant select on auth.users to authenticated, service_role;

-- Vale pras tabelas que as migrations criarem DEPOIS deste arquivo.
alter default privileges in schema public
  grant select, insert, update, delete on tables to authenticated, service_role;
alter default privileges in schema public
  grant usage, select on sequences to authenticated, service_role;

-- E pras que porventura já existam.
grant select, insert, update, delete on all tables in schema public to authenticated, service_role;
