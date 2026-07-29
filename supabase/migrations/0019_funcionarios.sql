-- Sakura System — AutoCenter Edition
-- Migration 0019: funcionarios — cadastro leve (nome, cargo, ativo) para
-- pessoal que não precisa de login no sistema, mas precisa ser selecionável
-- como técnico numa peça/serviço da OS ou como vendedor/atendente da OS.
--
-- Todo operador (quem loga no sistema) também é um funcionário por trás dos
-- panos: ao criar/editar um operador, um gatilho espelha automaticamente o
-- registro em funcionarios (ligado por operador_id), então o seletor de
-- técnico/vendedor sempre junta os dois grupos sem exigir cadastro duplicado.
--
-- tecnico_id (ordens_servico_itens) e vendedor_id (ordens_servico) passam a
-- apontar pra funcionarios em vez de operadores — criado_por_id/
-- atualizado_por_id continuam em operadores, porque esses são sobre quem
-- de fato mexeu no sistema (auditoria), não sobre quem presta o serviço.
--
-- Idempotente: seguro rodar de novo.

create table if not exists funcionarios (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  cargo text,
  operador_id uuid unique references operadores (id) on delete set null,
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

alter table funcionarios enable row level security;

drop policy if exists "funcionarios_acesso_autenticados" on funcionarios;
create policy "funcionarios_acesso_autenticados" on funcionarios
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

-- Espelha todo operador já existente (não duplica se a migration rodar de novo).
insert into funcionarios (nome, operador_id, ativo)
select o.nome, o.id, o.ativo
from operadores o
where not exists (select 1 from funcionarios f where f.operador_id = o.id);

-- Mantém o espelho em dia quando um operador é criado ou tem nome/status alterado.
create or replace function sincroniza_funcionario_operador()
returns trigger as $$
begin
  insert into funcionarios (nome, operador_id, ativo)
  values (new.nome, new.id, new.ativo)
  on conflict (operador_id) do update
    set nome = excluded.nome, ativo = excluded.ativo;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_sincroniza_funcionario_operador on operadores;
create trigger trg_sincroniza_funcionario_operador
  after insert or update of nome, ativo on operadores
  for each row execute function sincroniza_funcionario_operador();

-- Repontar ordens_servico_itens.tecnico_id de operadores(id) pra funcionarios(id).
-- Guardado por uma checagem do FK atual: se já foi migrado numa execução
-- anterior, o nome do constraint muda e a condição abaixo não bate de novo.
do $$
declare
  fk_target text;
begin
  select confrelid::regclass::text into fk_target
  from pg_constraint
  where conrelid = 'ordens_servico_itens'::regclass
    and conname = 'ordens_servico_itens_tecnico_id_fkey';

  if fk_target = 'operadores' then
    alter table ordens_servico_itens
      add column tecnico_funcionario_id uuid references funcionarios (id);

    update ordens_servico_itens i
    set tecnico_funcionario_id = f.id
    from funcionarios f
    where f.operador_id = i.tecnico_id;

    alter table ordens_servico_itens drop column tecnico_id;
    alter table ordens_servico_itens rename column tecnico_funcionario_id to tecnico_id;
    alter table ordens_servico_itens
      rename constraint ordens_servico_itens_tecnico_funcionario_id_fkey
      to ordens_servico_itens_tecnico_id_fkey;
  end if;
end $$;

-- Mesma coisa para ordens_servico.vendedor_id.
do $$
declare
  fk_target text;
begin
  select confrelid::regclass::text into fk_target
  from pg_constraint
  where conrelid = 'ordens_servico'::regclass
    and conname = 'ordens_servico_vendedor_id_fkey';

  if fk_target = 'operadores' then
    alter table ordens_servico
      add column vendedor_funcionario_id uuid references funcionarios (id);

    update ordens_servico o
    set vendedor_funcionario_id = f.id
    from funcionarios f
    where f.operador_id = o.vendedor_id;

    alter table ordens_servico drop column vendedor_id;
    alter table ordens_servico rename column vendedor_funcionario_id to vendedor_id;
    alter table ordens_servico
      rename constraint ordens_servico_vendedor_funcionario_id_fkey
      to ordens_servico_vendedor_id_fkey;
  end if;
end $$;
