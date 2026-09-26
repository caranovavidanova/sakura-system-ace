-- Sakura System — AutoCenter Edition
-- TESTE do segundo lote da etapa 2 do TR-04.1 (migration 0061). NÃO é
-- migration, e NUNCA deve ser rodado no Supabase de verdade — grava e apaga
-- dado de teste.
--
-- Prova as duas metades da promessa, que são opostas e por isso precisam ser
-- medidas juntas:
--   • quem não tem o módulo não lê, não cria, não paga e não apaga conta
--     nenhuma — nem a pagar, nem a receber;
--   • e MESMO ASSIM duas coisas de outros módulos continuam funcionando:
--     quem fatura OS "a receber depois" cria a conta daquela OS, e quem tem
--     Funcionários lê as contas a receber (a aba Comissões avisa com elas
--     quais OS o cliente ainda não pagou).
--
-- A segunda metade importa tanto quanto a primeira: uma trava que impedisse
-- o balcão de faturar não seria segurança, seria sistema quebrado. E as duas
-- portas precisam ser ESTREITAS — quem fatura cria a conta de uma OS da loja
-- dele, e só; quem tem Funcionários lê, e só. É por isso que cada porta é
-- testada também pelo lado de fora.
--
-- Como rodar: ver o cabeçalho de supabase/scripts/testar-auditoria.sql, ou
-- `npm run test:sql -- testar-contas-permissao`.
-- Terminou imprimindo "TODAS AS CHECAGENS PASSARAM", passou.

do $$
declare
  loja_a    uuid := 'c0c0a000-0000-0000-0000-00000000000a';
  loja_b    uuid := 'c0c0a000-0000-0000-0000-00000000000b';
  o_caixa   uuid := 'c0c0b000-0000-0000-0000-000000000001';  -- só Caixa
  o_os      uuid := 'c0c0b000-0000-0000-0000-000000000002';  -- só Ordens de Serviço
  o_rh      uuid := 'c0c0b000-0000-0000-0000-000000000003';  -- só Funcionários
  o_pagar   uuid := 'c0c0b000-0000-0000-0000-000000000004';  -- só Contas a Pagar
  o_receber uuid := 'c0c0b000-0000-0000-0000-000000000005';  -- só Contas a Receber
  o_os_ab   uuid := 'c0c0b000-0000-0000-0000-000000000006';  -- só OS, nas DUAS lojas
  cliente   uuid := 'c0c0c000-0000-0000-0000-000000000001';
  os_a      uuid := 'c0c0d000-0000-0000-0000-00000000000a';
  os_a2     uuid := 'c0c0d000-0000-0000-0000-0000000000a2';
  os_b      uuid := 'c0c0d000-0000-0000-0000-00000000000b';
  quantas   int;
begin
  -- ---- preparo -----------------------------------------------------------
  insert into lojas (id, nome, cidade, uf) values
    (loja_a, 'Loja A de Teste', 'Araraquara', 'SP'),
    (loja_b, 'Loja B de Teste', 'Araraquara', 'SP')
    on conflict (id) do nothing;

  insert into auth.users (id) values (o_caixa), (o_os), (o_rh), (o_pagar), (o_receber), (o_os_ab)
    on conflict do nothing;

  insert into operadores (id, usuario, nome, admin, permissoes, ativo) values
    (o_caixa,   'tc_caixa',   'Só Caixa',            false, array['painel','caixa'],          true),
    (o_os,      'tc_os',      'Só OS',               false, array['painel','ordens_servico'], true),
    (o_rh,      'tc_rh',      'Só Funcionários',     false, array['painel','funcionarios'],   true),
    (o_pagar,   'tc_pagar',   'Só Contas a Pagar',   false, array['painel','contas_pagar'],   true),
    (o_receber, 'tc_receber', 'Só Contas a Receber', false, array['painel','contas_receber'], true),
    (o_os_ab,   'tc_os_ab',   'Só OS, nas duas',     false, array['painel','ordens_servico'], true)
    on conflict (id) do nothing;

  -- Todos são da loja A. Só o o_os_ab tem acesso também à B.
  insert into operador_lojas (operador_id, loja_id) values
    (o_caixa, loja_a), (o_os, loja_a), (o_rh, loja_a), (o_pagar, loja_a), (o_receber, loja_a),
    (o_os_ab, loja_a), (o_os_ab, loja_b)
    on conflict do nothing;

  insert into clientes (id, nome, tipo_pessoa) values (cliente, 'Cliente de Teste', 'fisica')
    on conflict (id) do nothing;

  insert into ordens_servico (id, loja_id, cliente_id, status) values
    (os_a,  loja_a, cliente, 'concluida'),
    (os_a2, loja_a, cliente, 'concluida'),
    (os_b,  loja_b, cliente, 'concluida')
    on conflict (id) do nothing;

  insert into contas_pagar (loja_id, descricao, valor, vencimento) values
    (loja_a, 'Aluguel da A', 1500.00, current_date),
    (loja_b, 'Aluguel da B', 1800.00, current_date);

  -- Uma conta a receber avulsa (sem OS) em cada loja.
  insert into contas_receber (loja_id, cliente_id, descricao, valor, vencimento) values
    (loja_a, cliente, 'Fiado da A', 200.00, current_date),
    (loja_b, cliente, 'Fiado da B', 300.00, current_date);

  set local role authenticated;

  -- ===================================================================
  -- A. O balconista só-Caixa: nada, nas duas tabelas
  -- ===================================================================
  perform set_config('request.jwt.claim.sub', o_caixa::text, true);

  select count(*) into quantas from contas_pagar;
  if quantas <> 0 then
    raise exception 'FALHOU (1): só-Caixa leu % conta(s) a pagar', quantas;
  end if;

  select count(*) into quantas from contas_receber;
  if quantas <> 0 then
    raise exception 'FALHOU (2): só-Caixa leu % conta(s) a receber', quantas;
  end if;

  begin
    insert into contas_pagar (loja_id, descricao, valor, vencimento)
      values (loja_a, 'Conta inventada', 10.00, current_date);
    raise exception 'FALHOU (3): só-Caixa criou conta a pagar';
  exception when insufficient_privilege then
    if sqlerrm not like '%row-level security%' then raise; end if;  -- é a RLS, não falta de GRANT
  end;

  -- 4 e 5: comando SEM filtro, contado com `get diagnostics`. Um filtro
  -- (ou um `returning` que cite coluna) faria o banco aplicar também a regra
  -- de LEITURA, e o teste passaria pela regra errada (§6 item 74). As
  -- versões "b" conferem a outra tabela de contas, que faltava.
  update contas_pagar set valor = 0.01; get diagnostics quantas = row_count;
  if quantas <> 0 then
    raise exception 'FALHOU (4): só-Caixa alterou % conta(s) a pagar', quantas;
  end if;
  update contas_receber set valor = 0.01; get diagnostics quantas = row_count;
  if quantas <> 0 then
    raise exception 'FALHOU (4b): só-Caixa alterou % conta(s) a receber', quantas;
  end if;

  delete from contas_receber; get diagnostics quantas = row_count;
  if quantas <> 0 then
    raise exception 'FALHOU (5): só-Caixa apagou % conta(s) a receber', quantas;
  end if;
  delete from contas_pagar; get diagnostics quantas = row_count;
  if quantas <> 0 then
    raise exception 'FALHOU (5b): só-Caixa apagou % conta(s) a pagar', quantas;
  end if;

  -- ===================================================================
  -- B. Quem só fatura OS: cria a conta DA OS, e nada além
  -- ===================================================================
  perform set_config('request.jwt.claim.sub', o_os::text, true);

  -- 6. o faturamento "a receber depois" — igual ao app: sem `returning`
  insert into contas_receber (loja_id, cliente_id, ordem_servico_id, descricao, valor, vencimento)
    values (loja_a, cliente, os_a, 'Faturamento da OS de teste', 450.00, current_date + 30);

  -- 7. cobrança avulsa (sem OS) é do módulo, não de quem fatura
  begin
    insert into contas_receber (loja_id, cliente_id, descricao, valor, vencimento)
      values (loja_a, cliente, 'Cobrança inventada', 999.00, current_date);
    raise exception 'FALHOU (7): quem só fatura OS criou conta a receber avulsa';
  exception when insufficient_privilege then
    if sqlerrm not like '%row-level security%' then raise; end if;
  end;

  -- 8. nem amarrada a uma OS de OUTRA loja
  begin
    insert into contas_receber (loja_id, cliente_id, ordem_servico_id, descricao, valor, vencimento)
      values (loja_a, cliente, os_b, 'OS da outra loja', 999.00, current_date);
    raise exception 'FALHOU (8): quem só fatura OS criou conta amarrada a uma OS de outra loja';
  exception when insufficient_privilege then
    if sqlerrm not like '%row-level security%' then raise; end if;
  end;

  -- 8b. ...nem por quem trabalha nas duas lojas e ENXERGA as duas OS: a conta
  --     é da loja A e a OS é da B. Sem este caso, a conferência de loja
  --     dentro da policy parecia desnecessária — pro operador de uma loja só,
  --     a RLS de ordens_servico já esconde a OS da outra.
  perform set_config('request.jwt.claim.sub', o_os_ab::text, true);
  begin
    insert into contas_receber (loja_id, cliente_id, ordem_servico_id, descricao, valor, vencimento)
      values (loja_a, cliente, os_b, 'Conta da A com OS da B', 999.00, current_date);
    raise exception 'FALHOU (8b): conta de uma loja amarrada à OS de outra loja';
  exception when insufficient_privilege then
    if sqlerrm not like '%row-level security%' then raise; end if;
  end;
  perform set_config('request.jwt.claim.sub', o_os::text, true);

  -- 9. faturar não dá direito a ler a lista
  select count(*) into quantas from contas_receber;
  if quantas <> 0 then
    raise exception 'FALHOU (9): quem só fatura OS leu % conta(s) a receber', quantas;
  end if;

  -- 10. nem a marcar como recebida
  update contas_receber set status = 'recebido'; get diagnostics quantas = row_count;
  if quantas <> 0 then
    raise exception 'FALHOU (10): quem só fatura OS marcou % conta(s) como recebida', quantas;
  end if;
  delete from contas_receber; get diagnostics quantas = row_count;
  if quantas <> 0 then
    raise exception 'FALHOU (10b): quem só fatura OS apagou % conta(s) a receber', quantas;
  end if;

  -- 11. e Contas a Pagar continua fechada pra ele
  select count(*) into quantas from contas_pagar;
  if quantas <> 0 then
    raise exception 'FALHOU (11): quem só fatura OS leu % conta(s) a pagar', quantas;
  end if;

  -- ===================================================================
  -- C. Quem tem Funcionários: lê as contas a receber da loja, e só lê
  -- ===================================================================
  perform set_config('request.jwt.claim.sub', o_rh::text, true);

  -- 12. as duas da loja A (a avulsa e a da OS), nunca a da B
  select count(*) into quantas from contas_receber;
  if quantas <> 2 then
    raise exception
      'FALHOU (12): Funcionários devia ler 2 contas a receber (as da loja A) e leu %. '
      'Menos é a aba Comissões perdendo o aviso de OS não paga; mais é outra loja vazando.', quantas;
  end if;

  -- 13. e a da OS está entre elas (é a que a aba Comissões usa)
  select count(*) into quantas from contas_receber where ordem_servico_id = os_a;
  if quantas <> 1 then
    raise exception 'FALHOU (13): Funcionários não enxergou a conta da OS faturada';
  end if;

  -- 14. ler não dá direito a receber
  update contas_receber set status = 'recebido'; get diagnostics quantas = row_count;
  if quantas <> 0 then
    raise exception 'FALHOU (14): Funcionários marcou % conta(s) como recebida', quantas;
  end if;
  delete from contas_receber; get diagnostics quantas = row_count;
  if quantas <> 0 then
    raise exception 'FALHOU (14b): Funcionários apagou % conta(s) a receber', quantas;
  end if;

  -- 15. nem a criar
  begin
    insert into contas_receber (loja_id, cliente_id, descricao, valor, vencimento)
      values (loja_a, cliente, 'Cobrança do RH', 1.00, current_date);
    raise exception 'FALHOU (15): Funcionários criou conta a receber';
  exception when insufficient_privilege then
    if sqlerrm not like '%row-level security%' then raise; end if;
  end;

  -- 16. e Contas a Pagar continua fechada pra ele
  select count(*) into quantas from contas_pagar;
  if quantas <> 0 then
    raise exception 'FALHOU (16): Funcionários leu % conta(s) a pagar', quantas;
  end if;

  -- ===================================================================
  -- D. Quem TEM Contas a Pagar: o módulo inteiro, só da loja dele
  -- ===================================================================
  -- Sem esta parte e a próxima, uma policy que barrasse todo mundo passaria.
  perform set_config('request.jwt.claim.sub', o_pagar::text, true);

  select count(*) into quantas from contas_pagar;
  if quantas <> 1 then
    raise exception 'FALHOU (17): Contas a Pagar devia ler 1 conta (a da loja A) e leu %', quantas;
  end if;

  insert into contas_pagar (loja_id, descricao, valor, vencimento)
    values (loja_a, 'Luz', 300.00, current_date);

  with s as (update contas_pagar set status = 'paga' where descricao = 'Luz' returning 1)
  select count(*) into quantas from s;
  if quantas <> 1 then
    raise exception 'FALHOU (18): Contas a Pagar não conseguiu marcar a conta como paga';
  end if;

  with s as (delete from contas_pagar where descricao = 'Luz' returning 1)
  select count(*) into quantas from s;
  if quantas <> 1 then
    raise exception 'FALHOU (19): Contas a Pagar não conseguiu apagar a conta';
  end if;

  select count(*) into quantas from contas_receber;
  if quantas <> 0 then
    raise exception 'FALHOU (20): Contas a Pagar leu % conta(s) a receber', quantas;
  end if;

  -- ===================================================================
  -- E. Quem TEM Contas a Receber: o módulo inteiro, só da loja dele
  -- ===================================================================
  perform set_config('request.jwt.claim.sub', o_receber::text, true);

  select count(*) into quantas from contas_receber;
  if quantas <> 2 then
    raise exception 'FALHOU (21): Contas a Receber devia ler 2 contas (as da loja A) e leu %', quantas;
  end if;

  -- cobrança avulsa (o "+ Nova conta" da tela)
  insert into contas_receber (loja_id, cliente_id, descricao, valor, vencimento)
    values (loja_a, cliente, 'Cobrança manual', 80.00, current_date);

  -- e também a conta de uma OS, se for ele quem lança
  insert into contas_receber (loja_id, cliente_id, ordem_servico_id, descricao, valor, vencimento)
    values (loja_a, cliente, os_a2, 'Outra OS', 90.00, current_date);

  with s as (update contas_receber set status = 'recebido' where descricao = 'Cobrança manual' returning 1)
  select count(*) into quantas from s;
  if quantas <> 1 then
    raise exception 'FALHOU (22): Contas a Receber não conseguiu marcar como recebido';
  end if;

  select count(*) into quantas from contas_pagar;
  if quantas <> 0 then
    raise exception 'FALHOU (23): Contas a Receber leu % conta(s) a pagar', quantas;
  end if;

  reset role;

  -- A conta que o faturamento criou existe de verdade (conferido como dono,
  -- já que quem faturou não enxerga a lista).
  select count(*) into quantas from contas_receber where ordem_servico_id = os_a and valor = 450.00;
  if quantas <> 1 then
    raise exception 'FALHOU (24): a conta do faturamento não ficou gravada';
  end if;

  -- ---- limpeza ------------------------------------------------------------
  delete from contas_receber where loja_id in (loja_a, loja_b);
  delete from contas_pagar where loja_id in (loja_a, loja_b);
  delete from ordens_servico where loja_id in (loja_a, loja_b);
  delete from clientes where id = cliente;
  delete from funcionarios where operador_id in (o_caixa, o_os, o_rh, o_pagar, o_receber, o_os_ab);
  delete from operador_lojas where operador_id in (o_caixa, o_os, o_rh, o_pagar, o_receber, o_os_ab);
  delete from operadores where id in (o_caixa, o_os, o_rh, o_pagar, o_receber, o_os_ab);
  delete from auth.users where id in (o_caixa, o_os, o_rh, o_pagar, o_receber, o_os_ab);
  delete from depositos where loja_id in (loja_a, loja_b);
  delete from configuracoes_garantia where loja_id in (loja_a, loja_b);
  delete from configuracoes_fiscais_loja where loja_id in (loja_a, loja_b);
  delete from configuracoes_painel_inicio where loja_id in (loja_a, loja_b);
  delete from lojas where id in (loja_a, loja_b);
  delete from auditoria;

  raise notice 'TODAS AS CHECAGENS PASSARAM';
end;
$$;
