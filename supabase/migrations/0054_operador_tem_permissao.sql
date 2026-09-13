-- Sakura System — AutoCenter Edition
-- Migration 0054: a função que o banco vai usar pra checar permissão de
-- módulo. ETAPA 1 de 3 do item TR-04.1 — só a função, NENHUMA policy usa
-- ela ainda. Nada muda de comportamento ao rodar esta migration.
--
-- O problema que a série inteira resolve: hoje a permissão de módulo é
-- checada só na TELA. Um balconista com permissão só de "Caixa" não vê o
-- menu Clientes — mas a chave `anon` está no computador dele, a sessão é
-- válida, e um `select * from clientes` pela API responde a lista inteira.
-- A RLS exige estar logado e ter acesso à loja; não exige a permissão do
-- módulo. É a diferença entre esconder e proteger (seção 6, item 1).
--
-- Enquanto quem opera é o pai dela e os funcionários da loja dele, isso é
-- risco teórico, e o PROJETO_STATUS sempre foi honesto sobre isso. Quando o
-- operador for funcionário de uma empresa que só comprou o sistema, deixa de
-- ser: dá pra exportar o cadastro de clientes inteiro — e o de TODAS as
-- lojas da mesma empresa, já que `clientes` e `pecas` são compartilhados —
-- sem deixar rastro, porque a auditoria registra escrita, nunca leitura.
--
-- Por que `security definer`: esta função consulta `operadores`, e vai ser
-- chamada de dentro de policies. Sem `security definer` ela reagiria à
-- própria RLS e daria `infinite recursion detected in policy` (42P17) — é o
-- item 13 da seção 6, e o mesmo motivo de `operador_atual_e_admin()`
-- (migration 0008) ser assim.
--
-- Como usar na etapa 2, quando ela chegar — as duas regras não são estilo,
-- são desempenho medido e documentado pelo Supabase:
--
--   create policy "clientes_leitura" on clientes
--     for select
--     to authenticated                              -- não avalia pra anônimo
--     using ((select operador_tem_permissao('clientes')));   -- avalia UMA vez
--
-- O `select` em volta faz o planejador tratar como `initPlan` e rodar a
-- função uma vez por consulta, em vez de uma vez por linha.
--
-- Idempotente: seguro rodar de novo.

create or replace function operador_tem_permissao(modulo text)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from operadores
    where id = auth.uid()
      and ativo = true
      and (admin = true or modulo = any (permissoes))
  );
$$;

comment on function operador_tem_permissao(text) is
  'TR-04.1 etapa 1. Verdadeiro se quem está logado é admin ativo, ou se o '
  'módulo está em operadores.permissoes. As chaves válidas são as de MODULOS '
  'em src/types/operador.ts. Usar sempre como (select operador_tem_permissao(...)) '
  'dentro de policy, e com TO authenticated.';
