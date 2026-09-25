-- Sakura System — AutoCenter Edition
-- TESTE do TL-46.1 (migration 0059, comissão paga). NÃO é migration, e
-- NUNCA deve ser rodado no Supabase de verdade — grava e apaga dado de teste.
--
-- A promessa em uma frase: um pagamento de comissão registrado não muda
-- depois, não se repete pro mesmo período, e só quem cuida de funcionário
-- (o módulo Funcionários) enxerga — desfazer é só de admin.
--
-- Como rodar: ver o cabeçalho de supabase/scripts/testar-auditoria.sql.
-- Terminou imprimindo "TODAS AS CHECAGENS PASSARAM", passou.

do $$
declare
  loja_a  uuid := 'c0c00000-0000-0000-0000-00000000000a';
  loja_b  uuid := 'c0c00000-0000-0000-0000-00000000000b';
  o_admin uuid := 'c0c01111-0000-0000-0000-000000000001';
  o_rh    uuid := 'c0c01111-0000-0000-0000-000000000002';  -- tem Funcionários, não é admin
  o_caixa uuid := 'c0c01111-0000-0000-0000-000000000003';  -- só Caixa
  o_rh_b  uuid := 'c0c01111-0000-0000-0000-000000000004';  -- Funcionários, mas da loja B
  f_ana   uuid := 'c0c02222-0000-0000-0000-00000000000a';
  quantas int;
begin
  insert into lojas (id, nome, cidade, uf) values
    (loja_a, 'Loja A (teste comissão)', 'Araraquara', 'SP'),
    (loja_b, 'Loja B (teste comissão)', 'Araraquara', 'SP')
    on conflict (id) do nothing;
  insert into auth.users (id) values (o_admin), (o_rh), (o_caixa), (o_rh_b) on conflict do nothing;
  insert into operadores (id, usuario, nome, admin, permissoes, ativo) values
    (o_admin, 'tc_admin', 'Admin de teste', true,  array['painel'],                 true),
    (o_rh,    'tc_rh',    'RH de teste',    false, array['painel','funcionarios'],  true),
    (o_caixa, 'tc_caixa', 'Caixa de teste', false, array['painel','caixa'],         true),
    (o_rh_b,  'tc_rh_b',  'RH da B',        false, array['painel','funcionarios'],  true)
    on conflict (id) do nothing;
  insert into operador_lojas (operador_id, loja_id) values
    (o_admin, loja_a), (o_rh, loja_a), (o_caixa, loja_a), (o_rh_b, loja_b)
    on conflict do nothing;
  insert into funcionarios (id, loja_id, nome, comissao) values (f_ana, loja_a, 'Ana Mecânica', 10)
    on conflict (id) do nothing;

  set local role authenticated;

  -- ===================================================================
  -- A. Quem tem o módulo Funcionários registra
  -- ===================================================================
  perform set_config('request.jwt.claim.sub', o_rh::text, true);
  insert into comissoes_fechamentos (
    loja_id, funcionario_id, funcionario_nome, periodo_inicio, periodo_fim, percentual,
    valor_calculado, valor_pago, data_pagamento, snapshot
  ) values (
    loja_a, f_ana, 'Ana Mecânica', '2026-09-01', '2026-09-30', 10, 123.45, 123.45, '2026-10-05',
    '[{"ordemId":"x","numero":7,"papel":"vendedor","comissao":123.45}]'
  );

  -- ===================================================================
  -- B. O mesmo período não se registra duas vezes
  -- ===================================================================
  begin
    insert into comissoes_fechamentos (
      loja_id, funcionario_id, funcionario_nome, periodo_inicio, periodo_fim,
      valor_calculado, valor_pago, data_pagamento
    ) values (loja_a, f_ana, 'Ana Mecânica', '2026-09-01', '2026-09-30', 1, 1, '2026-10-06');
    raise exception 'FALHOU: o mesmo período foi registrado duas vezes';
  exception when unique_violation then null;
  end;

  -- ===================================================================
  -- C. Ninguém altera um pagamento, nem o próprio RH
  -- ===================================================================
  with s as (update comissoes_fechamentos set valor_pago = 1 returning 1)
  select count(*) into quantas from s;
  if quantas <> 0 then
    raise exception 'FALHOU: deu pra alterar % pagamento(s)', quantas;
  end if;

  -- ===================================================================
  -- D. O RH (não admin) não desfaz
  -- ===================================================================
  with s as (delete from comissoes_fechamentos returning 1)
  select count(*) into quantas from s;
  if quantas <> 0 then
    raise exception 'FALHOU: quem não é admin apagou % pagamento(s)', quantas;
  end if;

  -- ===================================================================
  -- E. Sem o módulo Funcionários: não lê nem registra
  -- ===================================================================
  perform set_config('request.jwt.claim.sub', o_caixa::text, true);
  select count(*) into quantas from comissoes_fechamentos;
  if quantas <> 0 then
    raise exception 'FALHOU: o balconista do caixa leu % pagamento(s) de comissão', quantas;
  end if;
  begin
    insert into comissoes_fechamentos (
      loja_id, funcionario_id, funcionario_nome, periodo_inicio, periodo_fim,
      valor_calculado, valor_pago, data_pagamento
    ) values (loja_a, f_ana, 'Ana Mecânica', '2026-08-01', '2026-08-31', 1, 1, '2026-09-05');
    raise exception 'FALHOU: o balconista do caixa registrou pagamento de comissão';
  exception when insufficient_privilege then null;
  end;

  -- ===================================================================
  -- F. Loja B não vê a loja A
  -- ===================================================================
  perform set_config('request.jwt.claim.sub', o_rh_b::text, true);
  select count(*) into quantas from comissoes_fechamentos;
  if quantas <> 0 then
    raise exception 'FALHOU: o RH da loja B leu % pagamento(s) da loja A', quantas;
  end if;

  -- ===================================================================
  -- G. O admin desfaz
  -- ===================================================================
  perform set_config('request.jwt.claim.sub', o_admin::text, true);
  with s as (delete from comissoes_fechamentos where loja_id = loja_a returning 1)
  select count(*) into quantas from s;
  if quantas <> 1 then
    raise exception 'FALHOU: o admin devia desfazer 1 pagamento e desfez %', quantas;
  end if;

  -- e registra de novo, pra conferir o nome sobrevivendo ao cadastro
  insert into comissoes_fechamentos (
    loja_id, funcionario_id, funcionario_nome, periodo_inicio, periodo_fim,
    valor_calculado, valor_pago, data_pagamento
  ) values (loja_a, f_ana, 'Ana Mecânica', '2026-09-01', '2026-09-30', 123.45, 120, '2026-10-05');

  reset role;

  -- ===================================================================
  -- H. O funcionário sai do cadastro, o registro continua dizendo pra quem foi
  -- ===================================================================
  delete from funcionarios where id = f_ana;
  if (select funcionario_nome from comissoes_fechamentos where loja_id = loja_a) is distinct from 'Ana Mecânica' then
    raise exception 'FALHOU: o registro perdeu o nome de quem recebeu';
  end if;
  if (select funcionario_id from comissoes_fechamentos where loja_id = loja_a) is not null then
    raise exception 'FALHOU: funcionario_id devia virar nulo quando o cadastro sai';
  end if;

  -- ===================================================================
  -- I. Auditoria guardou o registro, o desfazer e o registro de novo
  -- ===================================================================
  select count(*) into quantas from auditoria where tabela = 'comissoes_fechamentos';
  if quantas < 3 then
    raise exception 'FALHOU: a auditoria devia ter ao menos 3 linhas de comissão paga e tem %', quantas;
  end if;

  -- ---- limpeza ------------------------------------------------------------
  delete from comissoes_fechamentos where loja_id in (loja_a, loja_b);
  delete from operador_lojas where operador_id in (o_admin, o_rh, o_caixa, o_rh_b);
  delete from funcionarios where operador_id in (o_admin, o_rh, o_caixa, o_rh_b) or loja_id in (loja_a, loja_b);
  delete from operadores where id in (o_admin, o_rh, o_caixa, o_rh_b);
  delete from auth.users where id in (o_admin, o_rh, o_caixa, o_rh_b);
  delete from depositos where loja_id in (loja_a, loja_b);
  delete from configuracoes_garantia where loja_id in (loja_a, loja_b);
  delete from configuracoes_fiscais_loja where loja_id in (loja_a, loja_b);
  delete from configuracoes_painel_inicio where loja_id in (loja_a, loja_b);
  delete from lojas where id in (loja_a, loja_b);
  delete from auditoria;

  raise notice 'TODAS AS CHECAGENS PASSARAM';
end;
$$;
