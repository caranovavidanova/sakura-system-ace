-- Sakura System — AutoCenter Edition
-- Migration 0034: corrige um bug real de RLS que impedia criar uma loja nova
-- pelo app.
--
-- O que acontecia: `criarLoja()` (src/lib/lojas.ts) faz dois inserts — 1) a
-- loja em si, 2) o vínculo do operador criador em `operador_lojas` (senão
-- ele ficaria sem acesso à loja que acabou de criar). O primeiro insert
-- sempre funcionava (a policy `lojas_insercao_admins` só exige ser admin de
-- QUALQUER loja). O segundo insert sempre FALHAVA: a policy
-- `operador_lojas_escrita_admins` (migration 0031) exigia
-- `operador_e_admin_da_loja(loja_id)`, que checa se já existe uma linha em
-- `operador_lojas` ligando esse operador a essa loja — só que essa é
-- exatamente a linha que o insert está tentando criar (problema do
-- "ovo e a galinha"). Resultado: a loja nova ficava criada (órfã, sem
-- ninguém vinculado a ela) e o app mostrava um erro no segundo passo.
--
-- Correção: divide a policy "for all" em duas (insert vs. update/delete).
-- A de insert ganha um caminho de bootstrap — o próprio operador pode se
-- vincular a uma loja que AINDA não tem ninguém vinculado, desde que ele já
-- seja admin de alguma outra loja (mesma função usada pra permitir o insert
-- em `lojas`). Isso preserva o isolamento entre lojas: só funciona enquanto
-- a loja alvo está "zerada"; depois que ela já tem algum vínculo, só quem já
-- é admin especificamente dela pode mexer (igual antes).
-- Idempotente: seguro rodar de novo.

drop policy if exists "operador_lojas_escrita_admins" on operador_lojas;
drop policy if exists "operador_lojas_insercao" on operador_lojas;
drop policy if exists "operador_lojas_atualizacao" on operador_lojas;
drop policy if exists "operador_lojas_exclusao" on operador_lojas;

create policy "operador_lojas_insercao" on operador_lojas
  for insert
  with check (
    (
      operador_id = auth.uid()
      and operador_atual_e_admin_de_alguma_loja()
      and not exists (
        select 1 from operador_lojas ol_existente
        where ol_existente.loja_id = operador_lojas.loja_id
      )
    )
    or operador_e_admin_da_loja(loja_id)
  );

create policy "operador_lojas_atualizacao" on operador_lojas
  for update
  using (operador_e_admin_da_loja(loja_id))
  with check (operador_e_admin_da_loja(loja_id));

create policy "operador_lojas_exclusao" on operador_lojas
  for delete
  using (operador_e_admin_da_loja(loja_id));

-- Conserta o estrago que o bug acima já pode ter deixado: qualquer loja que
-- ficou "órfã" (criada, mas sem ninguém vinculado, porque o segundo insert
-- sempre falhava) fica invisível pro LojaSwitcher e ninguém consegue nem
-- inativá-la pelo app (a policy de update também exige já ser admin dela).
-- Vincula toda loja órfã a todo admin ativo — mesmo padrão de backfill já
-- usado pra "Loja 1" na migration 0031.
insert into operador_lojas (operador_id, loja_id)
select o.id, l.id
from lojas l
cross join operadores o
where o.admin = true
  and o.ativo = true
  and not exists (
    select 1 from operador_lojas ol where ol.loja_id = l.id
  );
