-- Sakura System — AutoCenter Edition
-- Migration 0041: cadastro de Depósito — locais físicos de estoque dentro de
-- uma loja (ex: "Depósito Principal", "Fundos"). Toda loja (já existente ou
-- criada depois desta migration) ganha automaticamente um depósito padrão —
-- nada muda pra quem usa um só lugar físico; só quem criar um depósito
-- extra passa a escolher entre eles.
--
-- `estoque_movimentos` e `contagens_estoque` ganham `deposito_id` (mesmo
-- padrão nullable → backfill → not null das migrations 0031-0033 pra
-- loja_id). O saldo por peça continua sendo a soma de todos os depósitos da
-- loja (calcularSaldoPorPeca, sem mudança) — o saldo por depósito é um
-- cálculo novo (calcularSaldoPorPecaEDeposito), usado na Contagem.
--
-- Idempotente: seguro rodar de novo.

create table if not exists depositos (
  id uuid primary key default gen_random_uuid(),
  loja_id uuid not null references lojas (id),
  nome text not null,
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

create index if not exists depositos_loja_id_idx on depositos (loja_id);

-- Toda loja que ainda não tem nenhum depósito ganha um "Depósito Principal"
-- — cobre o backfill de lojas já existentes. Lojas novas passam a ganhar o
-- depósito padrão direto pelo app (lib/lojas.ts → criarLoja()), mas rodar
-- esta migration de novo também cobre qualquer loja criada fora do app.
insert into depositos (loja_id, nome)
select l.id, 'Depósito Principal'
from lojas l
where not exists (select 1 from depositos d where d.loja_id = l.id);

alter table depositos enable row level security;

drop policy if exists "depositos_leitura_por_loja" on depositos;
create policy "depositos_leitura_por_loja" on depositos
  for select
  using (operador_tem_acesso_loja(loja_id));

drop policy if exists "depositos_insercao_admins" on depositos;
create policy "depositos_insercao_admins" on depositos
  for insert
  with check (operador_e_admin_da_loja(loja_id));

drop policy if exists "depositos_atualizacao_admins" on depositos;
create policy "depositos_atualizacao_admins" on depositos
  for update
  using (operador_e_admin_da_loja(loja_id))
  with check (operador_e_admin_da_loja(loja_id));

drop policy if exists "depositos_exclusao_admins" on depositos;
create policy "depositos_exclusao_admins" on depositos
  for delete
  using (operador_e_admin_da_loja(loja_id));

-- estoque_movimentos
alter table estoque_movimentos add column if not exists deposito_id uuid references depositos (id);
update estoque_movimentos em
set deposito_id = (
  select d.id from depositos d
  where d.loja_id = em.loja_id
  order by d.criado_em asc
  limit 1
)
where deposito_id is null;
alter table estoque_movimentos alter column deposito_id set not null;
create index if not exists estoque_movimentos_deposito_id_idx on estoque_movimentos (deposito_id);

-- contagens_estoque
alter table contagens_estoque add column if not exists deposito_id uuid references depositos (id);
update contagens_estoque ce
set deposito_id = (
  select d.id from depositos d
  where d.loja_id = ce.loja_id
  order by d.criado_em asc
  limit 1
)
where deposito_id is null;
alter table contagens_estoque alter column deposito_id set not null;
create index if not exists contagens_estoque_deposito_id_idx on contagens_estoque (deposito_id);
