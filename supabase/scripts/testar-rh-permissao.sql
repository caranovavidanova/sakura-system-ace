-- Sakura System — AutoCenter Edition
-- TESTE do TR-04.3 (migration 0056). NÃO é migration, e NUNCA deve ser
-- rodado no Supabase de verdade — grava e apaga dado de teste.
--
-- Prova as duas metades da promessa do item, que são opostas e por isso
-- precisam ser medidas juntas:
--   • quem NÃO tem o módulo "Funcionários" não alcança salário, CPF nem
--     filho de ninguém, nem pela tabela nem pela view;
--   • e MESMO ASSIM continua conseguindo montar uma OS — ou seja, enxerga
--     nome e cargo pela view, só da loja dele.
--
-- A segunda metade importa tanto quanto a primeira: uma trava que também
-- impede o balconista de abrir OS não é segurança, é sistema quebrado.
--
-- Como rodar: ver o cabeçalho de supabase/scripts/testar-auditoria.sql.
-- Terminou imprimindo "TODAS AS CHECAGENS PASSARAM", passou.

do $$
declare
  loja_a  uuid := 'caca0000-0000-0000-0000-00000000000a';
  loja_b  uuid := 'caca0000-0000-0000-0000-00000000000b';
  o_rh    uuid := 'caca1111-0000-0000-0000-000000000001';  -- tem o módulo, não é admin
  o_caixa uuid := 'caca1111-0000-0000-0000-000000000002';  -- só Caixa
  f_a     uuid := 'caca2222-0000-0000-0000-00000000000a';
  f_b     uuid := 'caca2222-0000-0000-0000-00000000000b';
  quantas int;
  problema text;
begin
  -- ---- preparo: duas lojas, dois operadores, um funcionário em cada loja --
  insert into lojas (id, nome, cidade, uf) values
    (loja_a, 'Loja A de Teste', 'Araraquara', 'SP'),
    (loja_b, 'Loja B de Teste', 'Araraquara', 'SP')
    on conflict (id) do nothing;

  insert into auth.users (id) values (o_rh), (o_caixa) on conflict do nothing;

  insert into operadores (id, usuario, nome, admin, permissoes, ativo) values
    (o_rh,    'teste_rh',    'RH de Teste',         false, array['painel','funcionarios'], true),
    (o_caixa, 'teste_caixa2','Balconista de Teste', false, array['painel','caixa'],        true)
    on conflict (id) do nothing;

  insert into operador_lojas (operador_id, loja_id) values
    (o_rh, loja_a), (o_caixa, loja_a)
    on conflict do nothing;

  -- O gatilho da 0019 espelhou os dois em funcionarios sem loja nenhuma.
  update funcionarios set loja_id = loja_a where operador_id in (o_rh, o_caixa);

  insert into funcionarios (id, loja_id, nome, cargo, salario, cpf) values
    (f_a, loja_a, 'Mecânico da A', 'Mecânico', 3500.00, '11122233344'),
    (f_b, loja_b, 'Mecânico da B', 'Mecânico', 4200.00, '55566677788')
    on conflict (id) do nothing;

  insert into funcionario_filhos (funcionario_id, nome, data_nascimento)
    values (f_a, 'Filho do mecânico', '2015-03-04');

  set local role authenticated;

  -- ===================================================================
  -- A. O balconista sem o módulo
  -- ===================================================================
  perform set_config('request.jwt.claim.sub', o_caixa::text, true);

  -- 1. a tabela base some inteira
  select count(*) into quantas from funcionarios;
  if quantas <> 0 then
    raise exception 'FALHOU: balconista sem o módulo leu % linha(s) de funcionarios', quantas;
  end if;

  -- 2. e o salário junto com ela (a checagem que dá nome ao item)
  select count(salario) into quantas from funcionarios;
  if quantas <> 0 then
    raise exception 'FALHOU: balconista sem o módulo alcançou % salário(s)', quantas;
  end if;

  -- 3. filho de funcionário é dado de criança: não sai nem pela herança
  select count(*) into quantas from funcionario_filhos;
  if quantas <> 0 then
    raise exception 'FALHOU: balconista sem o módulo leu % filho(s)', quantas;
  end if;

  -- 4. nem escreve: alterar salário alheio seria pior que lê-lo
  with s as (update funcionarios set nome = nome returning 1)
  select count(*) into quantas from s;
  if quantas <> 0 then
    raise exception 'FALHOU: balconista sem o módulo alterou % linha(s)', quantas;
  end if;

  -- ===================================================================
  -- B. ...e ainda assim consegue montar uma OS
  -- ===================================================================
  -- 5. a view entrega nome e cargo — só da loja dele, nunca das duas.
  select count(*) into quantas from funcionarios_publico;
  if quantas <> 3 then
    raise exception
      'FALHOU: o balconista devia ver 3 na view (os da loja A) e viu %. '
      'Mais que isso é a view vazando outra loja; menos é o seletor de '
      'técnico da OS chegando vazio pra ele.', quantas;
  end if;

  -- 6. a view não pode ter ganhado coluna sensível por descuido
  select string_agg(column_name, ', ' order by column_name) into problema
    from information_schema.columns
   where table_schema = 'public' and table_name = 'funcionarios_publico'
     and column_name not in ('id','loja_id','nome','cargo','operador_id','ativo');
  if problema is not null then
    raise exception 'FALHOU: funcionarios_publico ganhou coluna fora da janela pública: %', problema;
  end if;

  -- 7. e a view não pode ser porta de escrita: ela é auto-atualizável e
  --    passa por cima da RLS, então o que a fecha é o revoke da 0056.
  begin
    with s as (update funcionarios_publico set nome = nome returning 1)
    select count(*) into quantas from s;
    raise exception 'FALHOU: deu pra escrever na tabela base por dentro da view (% linha(s))', quantas;
  exception
    when insufficient_privilege then null;  -- é o esperado
  end;

  -- ===================================================================
  -- C. Quem TEM o módulo continua com o cadastro inteiro
  -- ===================================================================
  -- Sem esta parte, uma policy que barrasse todo mundo passaria no teste.
  perform set_config('request.jwt.claim.sub', o_rh::text, true);

  -- 8. vê os da loja dele (3 espelhos/cadastros da loja A), e só
  select count(*) into quantas from funcionarios;
  if quantas <> 3 then
    raise exception 'FALHOU: o RH da loja A devia ler 3 funcionários e leu %', quantas;
  end if;

  -- 9. com salário
  select count(salario) into quantas from funcionarios;
  if quantas <> 1 then
    raise exception 'FALHOU: o RH devia alcançar 1 salário (o do mecânico da A) e alcançou %', quantas;
  end if;

  -- 10. e com os filhos
  select count(*) into quantas from funcionario_filhos;
  if quantas <> 1 then
    raise exception 'FALHOU: o RH devia ler 1 filho e leu %', quantas;
  end if;

  -- 11. não é admin, e mesmo assim grava
  with s as (insert into funcionarios (loja_id, nome) values (loja_a, 'Contratado no teste') returning 1)
  select count(*) into quantas from s;
  if quantas <> 1 then
    raise exception 'FALHOU: o RH não conseguiu cadastrar funcionário';
  end if;

  reset role;

  -- ---- limpeza ------------------------------------------------------------
  delete from funcionario_filhos where funcionario_id = f_a;
  delete from funcionarios where loja_id in (loja_a, loja_b);
  delete from operador_lojas where operador_id in (o_rh, o_caixa);
  delete from operadores where id in (o_rh, o_caixa);
  delete from auth.users where id in (o_rh, o_caixa);
  delete from depositos where loja_id in (loja_a, loja_b);
  delete from configuracoes_garantia where loja_id in (loja_a, loja_b);
  delete from configuracoes_fiscais_loja where loja_id in (loja_a, loja_b);
  delete from configuracoes_painel_inicio where loja_id in (loja_a, loja_b);
  delete from lojas where id in (loja_a, loja_b);
  delete from auditoria;

  raise notice 'TODAS AS CHECAGENS PASSARAM';
end;
$$;
