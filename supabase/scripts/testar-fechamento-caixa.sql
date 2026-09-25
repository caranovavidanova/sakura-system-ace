-- Sakura System — AutoCenter Edition
-- TESTE do TR-06.4 (migration 0058, fechamento de caixa). NÃO é migration, e
-- NUNCA deve ser rodado no Supabase de verdade — grava e apaga dado de teste.
--
-- A promessa em uma frase: a diferença do caixa NUNCA some. Ela vira um
-- lançamento de verdade, na mesma transação do fechamento; só admin desfaz;
-- e quem não tem o módulo Caixa não fecha nem lê.
--
-- Como rodar: ver o cabeçalho de supabase/scripts/testar-auditoria.sql.
-- Terminou imprimindo "TODAS AS CHECAGENS PASSARAM", passou.

do $$
declare
  loja_a   uuid := 'fcfc0000-0000-0000-0000-00000000000a';
  loja_b   uuid := 'fcfc0000-0000-0000-0000-00000000000b';
  o_admin  uuid := 'fcfc1111-0000-0000-0000-000000000001';  -- admin da loja A
  o_caixa  uuid := 'fcfc1111-0000-0000-0000-000000000002';  -- balconista, só Caixa
  o_os     uuid := 'fcfc1111-0000-0000-0000-000000000003';  -- balconista, só OS
  o_caixab uuid := 'fcfc1111-0000-0000-0000-000000000004';  -- balconista da loja B
  f_id     uuid;
  mov      record;
  quantas  int;
begin
  insert into lojas (id, nome, cidade, uf) values
    (loja_a, 'Loja A (teste fechamento)', 'Araraquara', 'SP'),
    (loja_b, 'Loja B (teste fechamento)', 'Araraquara', 'SP')
    on conflict (id) do nothing;

  insert into auth.users (id) values (o_admin), (o_caixa), (o_os), (o_caixab) on conflict do nothing;
  insert into operadores (id, usuario, nome, admin, permissoes, ativo) values
    (o_admin,  'tf_admin',  'Admin de teste',      true,  array['painel'],                   true),
    (o_caixa,  'tf_caixa',  'Caixa de teste',      false, array['painel','caixa'],           true),
    (o_os,     'tf_os',     'OS de teste',         false, array['painel','ordens_servico'],  true),
    (o_caixab, 'tf_caixab', 'Caixa da B de teste', false, array['painel','caixa'],           true)
    on conflict (id) do nothing;
  insert into operador_lojas (operador_id, loja_id) values
    (o_admin, loja_a), (o_caixa, loja_a), (o_os, loja_a), (o_caixab, loja_b)
    on conflict do nothing;

  set local role authenticated;

  -- ===================================================================
  -- A. Faltou dinheiro: vira "Quebra de caixa", em dinheiro, no dia certo
  -- ===================================================================
  perform set_config('request.jwt.claim.sub', o_caixa::text, true);

  f_id := fechar_caixa(loja_a, date '2026-09-20', 100, 850.00, 830.00,
                       '{"pix": 300}'::jsonb, 'troco errado', timestamptz '2026-09-20 23:59:00-03');

  select m.* into mov
    from fechamentos_caixa f join caixa_movimentos m on m.id = f.caixa_movimento_id
   where f.id = f_id;
  if mov.id is null then
    raise exception 'FALHOU: o fechamento com falta não gerou lançamento';
  end if;
  -- `is distinct from`, e não `<>`: com `<>`, uma forma de pagamento NULA
  -- faria a comparação dar nulo e a checagem passar calada (foi o que a
  -- mutação "quebra sem forma de pagamento" mostrou).
  if mov.tipo is distinct from 'saida' or mov.valor is distinct from 20.00
     or mov.forma_pagamento is distinct from 'dinheiro' then
    raise exception 'FALHOU: a quebra devia ser saída de 20,00 em dinheiro e saiu % de % em %',
      mov.tipo, mov.valor, mov.forma_pagamento;
  end if;
  if (mov.data at time zone 'America/Sao_Paulo')::date <> date '2026-09-20' then
    raise exception 'FALHOU: a quebra caiu no dia % e não no dia fechado', mov.data;
  end if;
  if (select nome from categorias_caixa where id = mov.categoria_id) is distinct from 'Quebra de caixa' then
    raise exception 'FALHOU: a quebra saiu sem a categoria "Quebra de caixa"';
  end if;
  if (select diferenca from fechamentos_caixa where id = f_id) <> -20.00 then
    raise exception 'FALHOU: a diferença gravada não é -20,00';
  end if;
  if (select operador_id from fechamentos_caixa where id = f_id) <> o_caixa then
    raise exception 'FALHOU: o fechamento não guardou quem fechou';
  end if;

  -- ===================================================================
  -- B. O mesmo dia não fecha duas vezes
  -- ===================================================================
  begin
    perform fechar_caixa(loja_a, date '2026-09-20', 100, 850, 850, '{}'::jsonb, null, null);
    raise exception 'FALHOU: o mesmo dia fechou duas vezes';
  exception when others then
    if sqlerrm not like '%já foi fechado%' then raise; end if;
  end;

  -- ===================================================================
  -- C. Sobrou dinheiro: vira "Sobra de caixa", uma entrada
  -- ===================================================================
  f_id := fechar_caixa(loja_a, date '2026-09-21', 100, 500, 505.50, '{}'::jsonb, null, null);
  select m.* into mov
    from fechamentos_caixa f join caixa_movimentos m on m.id = f.caixa_movimento_id
   where f.id = f_id;
  if mov.tipo is distinct from 'entrada' or mov.valor <> 5.50 then
    raise exception 'FALHOU: a sobra devia ser entrada de 5,50';
  end if;

  -- ===================================================================
  -- D. Bateu certinho: nenhum lançamento
  -- ===================================================================
  f_id := fechar_caixa(loja_a, date '2026-09-22', 100, 400, 400, '{}'::jsonb, null, null);
  if (select caixa_movimento_id from fechamentos_caixa where id = f_id) is not null then
    raise exception 'FALHOU: caixa que bateu gerou lançamento';
  end if;

  -- ===================================================================
  -- E. Ninguém altera um fechamento, nem o balconista desfaz
  -- ===================================================================
  with s as (update fechamentos_caixa set valor_contado = 850 returning 1)
  select count(*) into quantas from s;
  if quantas <> 0 then
    raise exception 'FALHOU: deu pra alterar % fechamento(s)', quantas;
  end if;

  begin
    perform desfazer_fechamento_caixa(
      (select id from fechamentos_caixa where loja_id = loja_a and data = date '2026-09-20'));
    raise exception 'FALHOU: o balconista desfez um fechamento';
  exception when others then
    if sqlerrm not like '%administrador%' then raise; end if;
  end;

  -- ===================================================================
  -- F. Sem o módulo Caixa: não lê nem fecha
  -- ===================================================================
  perform set_config('request.jwt.claim.sub', o_os::text, true);
  select count(*) into quantas from fechamentos_caixa;
  if quantas <> 0 then
    raise exception 'FALHOU: operador sem o módulo Caixa leu % fechamento(s)', quantas;
  end if;
  begin
    perform fechar_caixa(loja_a, date '2026-09-23', 0, 10, 10, '{}'::jsonb, null, null);
    raise exception 'FALHOU: operador sem o módulo Caixa fechou o caixa';
  exception when insufficient_privilege then null;
  end;
  -- O `returning` de dentro da função também passa pela policy de LEITURA,
  -- então a checagem acima seria reprovada mesmo sem a policy de INSERT
  -- exigir o módulo. Esta aqui mede a de insert sozinha: sem `returning`.
  begin
    insert into fechamentos_caixa (loja_id, data, saldo_sistema, valor_contado, diferenca)
    values (loja_a, date '2026-09-23', 10, 10, 0);
    raise exception 'FALHOU: operador sem o módulo Caixa gravou um fechamento direto na tabela';
  exception when insufficient_privilege then null;
  end;

  -- ===================================================================
  -- G. Loja B não vê a loja A, nem fecha por ela
  -- ===================================================================
  perform set_config('request.jwt.claim.sub', o_caixab::text, true);
  select count(*) into quantas from fechamentos_caixa;
  if quantas <> 0 then
    raise exception 'FALHOU: o caixa da loja B leu % fechamento(s) da loja A', quantas;
  end if;
  begin
    perform fechar_caixa(loja_a, date '2026-09-24', 0, 10, 10, '{}'::jsonb, null, null);
    raise exception 'FALHOU: o caixa da loja B fechou o caixa da loja A';
  exception when insufficient_privilege then null;
  end;

  -- ===================================================================
  -- H. O admin desfaz — e a quebra sai junto
  -- ===================================================================
  perform set_config('request.jwt.claim.sub', o_admin::text, true);
  select caixa_movimento_id into mov
    from fechamentos_caixa where loja_id = loja_a and data = date '2026-09-20';
  perform desfazer_fechamento_caixa(
    (select id from fechamentos_caixa where loja_id = loja_a and data = date '2026-09-20'));
  if exists (select 1 from fechamentos_caixa where loja_id = loja_a and data = date '2026-09-20') then
    raise exception 'FALHOU: o admin não conseguiu desfazer';
  end if;
  if exists (select 1 from caixa_movimentos where id = mov.caixa_movimento_id) then
    raise exception 'FALHOU: desfazer deixou a quebra de caixa órfã no caixa';
  end if;

  -- e o dia pode ser fechado de novo, agora com o valor certo
  perform fechar_caixa(loja_a, date '2026-09-20', 100, 850, 850, '{}'::jsonb, 'recontado', null);

  reset role;

  -- ===================================================================
  -- I. A trilha de auditoria guardou o fechamento e o desfazer
  -- ===================================================================
  select count(*) into quantas from auditoria
   where tabela = 'fechamentos_caixa' and acao = 'excluir';
  if quantas <> 1 then
    raise exception 'FALHOU: a auditoria devia ter 1 exclusão de fechamento e tem %', quantas;
  end if;

  -- ---- limpeza ------------------------------------------------------------
  delete from fechamentos_caixa where loja_id in (loja_a, loja_b);
  delete from caixa_movimentos where loja_id in (loja_a, loja_b);
  delete from operador_lojas where operador_id in (o_admin, o_caixa, o_os, o_caixab);
  delete from funcionarios where operador_id in (o_admin, o_caixa, o_os, o_caixab);
  delete from operadores where id in (o_admin, o_caixa, o_os, o_caixab);
  delete from auth.users where id in (o_admin, o_caixa, o_os, o_caixab);
  delete from depositos where loja_id in (loja_a, loja_b);
  delete from configuracoes_garantia where loja_id in (loja_a, loja_b);
  delete from configuracoes_fiscais_loja where loja_id in (loja_a, loja_b);
  delete from configuracoes_painel_inicio where loja_id in (loja_a, loja_b);
  delete from lojas where id in (loja_a, loja_b);
  delete from auditoria;

  raise notice 'TODAS AS CHECAGENS PASSARAM';
end;
$$;
