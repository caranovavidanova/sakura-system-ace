-- Sakura System — AutoCenter Edition
-- Migration 0008: corrige recursão infinita na policy de escrita de `operadores`
--
-- A policy "operadores_escrita_admins" (migration 0007) verifica se quem está
-- logado é admin consultando a própria tabela `operadores` — isso faz o
-- Postgres reavaliar a mesma policy dentro da subconsulta, entrando num loop
-- ("infinite recursion detected in policy for relation operadores").
--
-- A correção padrão é fazer essa verificação dentro de uma função
-- `security definer`: ela roda com privilégio de dono da função, então a
-- consulta interna não passa pela RLS de novo, e a recursão para de existir.

create or replace function operador_atual_e_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from operadores
    where id = auth.uid()
      and admin = true
      and ativo = true
  );
$$;

drop policy if exists "operadores_escrita_admins" on operadores;
create policy "operadores_escrita_admins" on operadores
  for all
  using (operador_atual_e_admin())
  with check (operador_atual_e_admin());
