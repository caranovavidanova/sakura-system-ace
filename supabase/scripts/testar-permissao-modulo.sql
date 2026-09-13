-- Sakura System — AutoCenter Edition
-- TESTE de operador_tem_permissao() (migration 0054). NÃO é migration, e
-- NUNCA deve ser rodado no Supabase de verdade — grava e apaga dado de teste.
--
-- Prova os quatro perfis que a etapa 2 do TR-04.1 vai depender: admin,
-- operador com permissão, operador SEM a permissão, e operador inativo.
--
-- Como rodar: ver o cabeçalho de supabase/scripts/testar-auditoria.sql.
-- Terminou imprimindo "TODAS AS CHECAGENS PASSARAM", passou.

do $$
declare
  o_admin uuid := 'aaaaaaaa-0000-0000-0000-000000000001';
  o_caixa uuid := 'aaaaaaaa-0000-0000-0000-000000000002';
  o_fora  uuid := 'aaaaaaaa-0000-0000-0000-000000000003';
  resposta boolean;
begin
  -- ---- preparo -----------------------------------------------------------
  insert into auth.users (id) values (o_admin), (o_caixa), (o_fora)
    on conflict do nothing;

  insert into operadores (id, usuario, nome, admin, permissoes, ativo) values
    (o_admin, 'teste_admin', 'Admin de Teste',       true,  array['painel'],          true),
    (o_caixa, 'teste_caixa', 'Balconista de Teste',  false, array['painel','caixa'],  true),
    (o_fora,  'teste_fora',  'Desligado de Teste',   false, array['painel','caixa'],  false)
    on conflict (id) do nothing;

  -- ---- 1. admin enxerga módulo que nem está na lista dele -----------------
  perform set_config('request.jwt.claim.sub', o_admin::text, true);
  select operador_tem_permissao('clientes') into resposta;
  if resposta is not true then
    raise exception 'FALHOU: admin devia ter permissão de qualquer módulo';
  end if;

  -- ---- 2. operador comum: tem a que foi dada... ---------------------------
  perform set_config('request.jwt.claim.sub', o_caixa::text, true);
  select operador_tem_permissao('caixa') into resposta;
  if resposta is not true then
    raise exception 'FALHOU: o balconista tem "caixa" na lista e foi recusado';
  end if;

  -- ---- 3. ...e NÃO tem a que não foi dada ---------------------------------
  -- Esta é a checagem que a série TR-04.1 inteira existe pra garantir.
  select operador_tem_permissao('clientes') into resposta;
  if resposta is not false then
    raise exception 'FALHOU: o balconista só-Caixa foi aceito em "clientes"';
  end if;

  -- ---- 4. operador inativo não tem permissão nenhuma ----------------------
  -- Desligar alguém tem que tirar o acesso, não só sumir com ele da lista.
  perform set_config('request.jwt.claim.sub', o_fora::text, true);
  select operador_tem_permissao('caixa') into resposta;
  if resposta is not false then
    raise exception 'FALHOU: operador inativo continuou com permissão';
  end if;

  -- ---- 5. sem ninguém logado, nada ----------------------------------------
  perform set_config('request.jwt.claim.sub', '', true);
  select operador_tem_permissao('caixa') into resposta;
  if resposta is not false then
    raise exception 'FALHOU: sem sessão devia ser falso, veio %', resposta;
  end if;

  -- ---- limpeza ------------------------------------------------------------
  perform set_config('request.jwt.claim.sub', o_admin::text, true);
  delete from operadores where id in (o_admin, o_caixa, o_fora);
  delete from auth.users where id in (o_admin, o_caixa, o_fora);
  delete from auditoria;

  raise notice 'TODAS AS CHECAGENS PASSARAM';
end;
$$;
