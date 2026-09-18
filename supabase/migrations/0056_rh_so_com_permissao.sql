-- Sakura System — AutoCenter Edition
-- Migration 0056: dado de RH só pra quem tem o módulo — item TR-04.3, e a
-- PRIMEIRA tabela da etapa 2 do TR-04.1 (a função de permissão da 0054
-- finalmente sendo usada por uma policy).
--
-- O problema. `funcionarios` guarda salário, comissão, CPF, RG, CNH,
-- filiação, nome do cônjuge — e `funcionario_filhos` guarda nome e
-- nascimento de criança. A TELA esconde tudo isso de quem não tem a
-- permissão "Funcionários"; a RLS não escondia nada: qualquer operador
-- logado com acesso à loja podia pedir a tabela inteira pela API, com a
-- chave que está no computador dele. Salário de colega circulando na loja é
-- briga na hora; CPF/RG/filiação é dado pessoal de terceiro sob a LGPD.
-- Deixar dado de saúde de fora do cadastro (decisão antiga do projeto) só
-- faz sentido se o resto também estiver fechado.
--
-- O que NÃO pode quebrar junto. Todo mundo que abre uma OS precisa escolher
-- técnico e vendedor, e precisa ver o nome do técnico num item já lançado —
-- inclusive o balconista que não tem o módulo. Ou seja: `nome` é público,
-- `salario` não, e a mesma tabela tem os dois.
--
-- Como fica, então:
--   • a TABELA `funcionarios` passa a exigir a permissão do módulo, nos
--     quatro comandos;
--   • a VIEW `funcionarios_publico` entrega só id/nome/cargo/ativo/loja_id/
--     operador_id pra qualquer operador com acesso à loja. É por ela que os
--     seletores de técnico e vendedor passam a ler.
--
-- ⚠️  A RECEITA DO GUIA ESTÁ ERRADA, e vale saber por quê antes de
--     "consertar" isto. O item TR-04.3 pede uma view com
--     `security_invoker = true`. Medido num Postgres 16: com a tabela base
--     fechada pro invocador, a view `security_invoker = true` devolve ZERO
--     linhas — ela obedece à RLS da base, que é justamente o que se quer
--     contornar aqui. Só `security_invoker = false` (o padrão) atravessa,
--     porque aí a view roda com os direitos do dono, que é o dono da tabela
--     e não reage a RLS.
--
--     A consequência disso é a regra desta migration: como a view passa por
--     cima da RLS, **o filtro de loja tem que estar escrito dentro dela**.
--     Sem o `where operador_tem_acesso_loja(...)` abaixo, ela entregaria os
--     funcionários de TODAS as lojas da empresa pra qualquer um.
--
-- Por que os quatro comandos viram policies separadas, e não uma `for all`:
-- policies são permissivas, então uma `for all` sobrevivente daria `select`
-- a quem a nova policy quer barrar. E toda vez que uma tabela ganha comando
-- sem policy, o efeito é filtrar a zero linhas **sem erro nenhum** (§6 item
-- 15) — por isso os quatro estão escritos aqui, um a um, e a matriz de RLS
-- (`npm run test:rls`) reprova se algum sumir.
--
-- Idempotente: seguro rodar de novo.

-- ===================================================================
-- 1. A tabela base: só com a permissão do módulo
-- ===================================================================
-- O `(select ...)` em volta da função não é estilo: faz o planejador rodar a
-- checagem uma vez por consulta em vez de uma vez por linha (é o que o
-- cabeçalho da 0054 explica).

drop policy if exists "funcionarios_acesso_autenticados" on funcionarios;
drop policy if exists "funcionarios_acesso_por_loja" on funcionarios;
drop policy if exists "funcionarios_leitura" on funcionarios;
drop policy if exists "funcionarios_insercao" on funcionarios;
drop policy if exists "funcionarios_alteracao" on funcionarios;
drop policy if exists "funcionarios_exclusao" on funcionarios;

create policy "funcionarios_leitura" on funcionarios
  for select to authenticated
  using (
    operador_tem_acesso_loja(loja_id)
    and (select operador_tem_permissao('funcionarios'))
  );

create policy "funcionarios_insercao" on funcionarios
  for insert to authenticated
  with check (
    operador_tem_acesso_loja(loja_id)
    and (select operador_tem_permissao('funcionarios'))
  );

create policy "funcionarios_alteracao" on funcionarios
  for update to authenticated
  using (
    operador_tem_acesso_loja(loja_id)
    and (select operador_tem_permissao('funcionarios'))
  )
  with check (
    operador_tem_acesso_loja(loja_id)
    and (select operador_tem_permissao('funcionarios'))
  );

create policy "funcionarios_exclusao" on funcionarios
  for delete to authenticated
  using (
    operador_tem_acesso_loja(loja_id)
    and (select operador_tem_permissao('funcionarios'))
  );

-- O gatilho que espelha operador → funcionário (migration 0019) é
-- `security definer`, então continua gravando por cima destas policies: criar
-- um operador novo não passa a exigir o módulo Funcionários. Já o `update`
-- que `criarOperador()` faz em seguida (pra preencher a loja) passa, e isso
-- está certo: só admin cria operador, e admin satisfaz a função de permissão.

-- ===================================================================
-- 2. Os filhos: mesma regra, herdando a loja pelo funcionário
-- ===================================================================
-- Aqui não existe "parte pública": nome e nascimento de filho de funcionário
-- não servem pra nenhuma tela fora do módulo.

drop policy if exists "funcionario_filhos_acesso_autenticados" on funcionario_filhos;
drop policy if exists "funcionario_filhos_acesso_por_loja" on funcionario_filhos;
drop policy if exists "funcionario_filhos_acesso" on funcionario_filhos;

create policy "funcionario_filhos_acesso" on funcionario_filhos
  for all to authenticated
  using (
    (select operador_tem_permissao('funcionarios'))
    and exists (
      select 1 from funcionarios f
      where f.id = funcionario_filhos.funcionario_id
        and operador_tem_acesso_loja(f.loja_id)
    )
  )
  with check (
    (select operador_tem_permissao('funcionarios'))
    and exists (
      select 1 from funcionarios f
      where f.id = funcionario_filhos.funcionario_id
        and operador_tem_acesso_loja(f.loja_id)
    )
  );

-- O `exists` acima consulta `funcionarios`, que agora tem RLS mais apertada.
-- Não vira recursão nem bloqueio extra: quem passa na primeira condição
-- (tem o módulo) também passa na policy de leitura de `funcionarios`.

-- ===================================================================
-- 3. A janela pública: nome e cargo, e mais nada
-- ===================================================================

drop view if exists funcionarios_publico;

create view funcionarios_publico
with (security_invoker = false, security_barrier = true)
as
  select f.id,
         f.loja_id,
         f.nome,
         f.cargo,
         f.operador_id,
         f.ativo
    from funcionarios f
   where operador_tem_acesso_loja(f.loja_id);

comment on view funcionarios_publico is
  'TR-04.3. A parte de `funcionarios` que qualquer operador com acesso à loja '
  'pode ver: o necessário pra escolher técnico e vendedor numa OS. Roda com os '
  'direitos do dono (security_invoker = false), então NÃO reage à RLS da '
  'tabela base — é o where daqui que isola a loja, e tirá-lo abre o cadastro '
  'da empresa inteira. security_barrier impede que um filtro do chamador seja '
  'avaliado antes desse where. Só SELECT é concedido: ela é auto-atualizável, '
  'e sem o revoke abaixo daria pra escrever na tabela base por dentro dela, '
  'passando por cima das policies.';

-- O Supabase concede os quatro comandos sozinho em tudo que nasce no schema
-- public (`alter default privileges`). Sem este revoke, a view viraria uma
-- porta de escrita sem RLS — e uma porta de leitura pro `anon`.
revoke all on funcionarios_publico from anon, authenticated;
grant select on funcionarios_publico to authenticated;

insert into schema_versao (versao) values (56) on conflict do nothing;
