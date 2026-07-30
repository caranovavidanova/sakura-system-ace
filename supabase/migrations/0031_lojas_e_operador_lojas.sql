-- Sakura System — AutoCenter Edition
-- Migration 0031: fundação multi-loja, parte 1 — tabela `lojas`, vínculo
-- many-to-many `operador_lojas` (um operador pode ter acesso a mais de uma
-- loja — ex: o dono vendo as duas lojas, um balconista só a dele) e as
-- funções de apoio pra RLS por loja.
--
-- A loja em uso hoje (produção, dados reais) vira a "loja 1", com um UUID
-- fixo e conhecido (não gerado na hora) — assim o backfill é sempre
-- idempotente, mesmo rodando a migration de novo.
--
-- `operadores.admin` continua sendo um único boolean por operador (não uma
-- flag por loja): um "admin só da loja A" é um operador com admin=true e
-- 1 linha em operador_lojas; o dono que administra as duas lojas é um
-- operador com admin=true e 2 linhas. Ver PROJETO_STATUS.md seção 3/6.
--
-- Migrations 0032 e 0033 continuam essa fundação (loja_id nas tabelas
-- operacionais, e as tabelas de configuração viram "1 linha por loja"). A
-- ordem entre as três importa: esta migration precisa rodar inteira antes,
-- porque as próximas dependem das funções e da tabela operador_lojas já
-- populada.
-- Idempotente: seguro rodar de novo.

create table if not exists lojas (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  cidade text,
  uf text,
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

-- Loja 1 = a loja única que já existe hoje. UUID fixo de propósito (não
-- gen_random_uuid()) pra todo o resto desta migration e das próximas poder
-- referenciar essa loja de forma previsível no backfill.
insert into lojas (id, nome)
values ('00000000-0000-0000-0000-000000000001', 'Loja 1')
on conflict (id) do nothing;

alter table lojas enable row level security;

drop policy if exists "lojas_leitura_autenticados" on lojas;
create policy "lojas_leitura_autenticados" on lojas
  for select
  using (auth.uid() is not null);

create table if not exists operador_lojas (
  operador_id uuid not null references operadores (id) on delete cascade,
  loja_id uuid not null references lojas (id) on delete cascade,
  criado_em timestamptz not null default now(),
  primary key (operador_id, loja_id)
);

-- Dá acesso à loja 1 pra todo operador já existente — sem isso, assim que a
-- RLS por loja entrar em vigor (migrations 0032/0033), ninguém conseguiria
-- ver nada.
insert into operador_lojas (operador_id, loja_id)
select o.id, '00000000-0000-0000-0000-000000000001'
from operadores o
where not exists (
  select 1 from operador_lojas ol
  where ol.operador_id = o.id and ol.loja_id = '00000000-0000-0000-0000-000000000001'
);

alter table operador_lojas enable row level security;

drop policy if exists "operador_lojas_leitura_autenticados" on operador_lojas;
create policy "operador_lojas_leitura_autenticados" on operador_lojas
  for select
  using (auth.uid() is not null);

-- As funções abaixo são `security definer` — a consulta interna não passa
-- pela RLS de novo, então checar a própria tabela `operadores`/
-- `operador_lojas` dentro delas não causa recursão infinita. Mesmo motivo
-- documentado na migration 0008 pra `operador_atual_e_admin()`.

-- O operador logado tem acesso (admin ou não) a essa loja?
create or replace function operador_tem_acesso_loja(p_loja_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from operador_lojas
    where operador_id = auth.uid() and loja_id = p_loja_id
  );
$$;

-- O operador logado é admin especificamente dessa loja?
create or replace function operador_e_admin_da_loja(p_loja_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from operador_lojas ol
    join operadores o on o.id = ol.operador_id
    where ol.operador_id = auth.uid()
      and ol.loja_id = p_loja_id
      and o.admin = true
      and o.ativo = true
  );
$$;

-- O operador logado é admin de QUALQUER loja (usado só em INSERT, onde
-- ainda não existe vínculo operador_lojas com o alvo que está sendo criado).
create or replace function operador_atual_e_admin_de_alguma_loja()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from operador_lojas ol
    join operadores o on o.id = ol.operador_id
    where ol.operador_id = auth.uid()
      and o.admin = true
      and o.ativo = true
  );
$$;

-- O operador logado administra o operador-alvo (ou seja: é admin em pelo
-- menos uma loja que o alvo também tem acesso)?
create or replace function operador_administra(p_operador_alvo_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from operador_lojas ol_admin
    join operadores admin_atual on admin_atual.id = ol_admin.operador_id
    join operador_lojas ol_alvo on ol_alvo.loja_id = ol_admin.loja_id
    where ol_admin.operador_id = auth.uid()
      and admin_atual.admin = true
      and admin_atual.ativo = true
      and ol_alvo.operador_id = p_operador_alvo_id
  );
$$;

-- INSERT em lojas: precisa ser admin de pelo menos uma loja (não dá pra
-- exigir "admin daquela loja" porque ela ainda não existe nesse momento).
drop policy if exists "lojas_insercao_admins" on lojas;
create policy "lojas_insercao_admins" on lojas
  for insert
  with check (operador_atual_e_admin_de_alguma_loja());

drop policy if exists "lojas_atualizacao_admins" on lojas;
create policy "lojas_atualizacao_admins" on lojas
  for update
  using (operador_e_admin_da_loja(id))
  with check (operador_e_admin_da_loja(id));

-- Escrita em operador_lojas: só quem já é admin daquela loja específica pode
-- dar/tirar acesso de alguém a ela — é aqui, e não no INSERT de `operadores`,
-- que o limite "admin da loja A não dá acesso à loja B" é reforçado.
drop policy if exists "operador_lojas_escrita_admins" on operador_lojas;
create policy "operador_lojas_escrita_admins" on operador_lojas
  for all
  using (operador_e_admin_da_loja(loja_id))
  with check (operador_e_admin_da_loja(loja_id));

-- `operadores`: leitura continua igual (qualquer logado lê a lista inteira,
-- de todas as lojas — decisão deliberada, ver PROJETO_STATUS.md seção 6).
-- Escrita passa a ser loja-aware: criar exige ser admin de alguma loja;
-- editar/excluir exige administrar especificamente aquele operador-alvo
-- (compartilhar uma loja onde quem está logado é admin).
drop policy if exists "operadores_escrita_admins" on operadores;

drop policy if exists "operadores_insercao_admins" on operadores;
create policy "operadores_insercao_admins" on operadores
  for insert
  with check (operador_atual_e_admin_de_alguma_loja());

drop policy if exists "operadores_atualizacao_admins" on operadores;
create policy "operadores_atualizacao_admins" on operadores
  for update
  using (operador_administra(id))
  with check (operador_administra(id));

drop policy if exists "operadores_exclusao_admins" on operadores;
create policy "operadores_exclusao_admins" on operadores
  for delete
  using (operador_administra(id));
