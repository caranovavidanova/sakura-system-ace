-- Sakura System — AutoCenter Edition
-- TESTE do terceiro lote da etapa 2 do TR-04.1 (migration 0062). NÃO é
-- migration, e NUNCA deve ser rodado no Supabase de verdade — grava e apaga
-- dado de teste.
--
-- As duas metades, como sempre:
--   • quem não tem Caixa (nem Relações) não lê, não lança, não edita e não
--     apaga lançamento nenhum;
--   • e MESMO ASSIM as quatro portas estreitas funcionam — e continuam
--     estreitas: Relações lê tudo e só lê; quem fatura OS lança a entrada da
--     OS e lê só os lançamentos de OS; quem paga conta lança a saída, enxerga
--     e apaga só a que está ligada a uma conta; quem recebe conta lança a
--     entrada e enxerga só a dela.
--
-- As checagens de "não altera / não apaga" usam o comando SEM filtro e
-- contam com `get diagnostics`. De propósito: um filtro (ou um `returning`
-- que cite coluna) faz o Postgres aplicar TAMBÉM a regra de leitura, e aí o
-- teste passaria pela regra errada — foi assim que uma mutação na regra de
-- exclusão sobreviveu à primeira versão deste arquivo (§6 item 74).
--
-- A parte G simula, comando a comando, o que o app faz ao pagar e ao
-- "desfazer pagamento" — é ali que a ordem dos passos importa.
--
-- Como rodar: `npm run test:sql -- testar-caixa-permissao`.
-- Terminou imprimindo "TODAS AS CHECAGENS PASSARAM", passou.

do $$
declare
  loja_a     uuid := 'cacaa000-0000-0000-0000-00000000000a';
  loja_b     uuid := 'cacaa000-0000-0000-0000-00000000000b';
  o_painel   uuid := 'cacab000-0000-0000-0000-000000000001';  -- só Início
  o_caixa    uuid := 'cacab000-0000-0000-0000-000000000002';  -- Caixa
  o_rel      uuid := 'cacab000-0000-0000-0000-000000000003';  -- só Relações
  o_os       uuid := 'cacab000-0000-0000-0000-000000000004';  -- só OS
  o_pagar    uuid := 'cacab000-0000-0000-0000-000000000005';  -- só Contas a Pagar
  o_receber  uuid := 'cacab000-0000-0000-0000-000000000006';  -- só Contas a Receber
  o_os_ab    uuid := 'cacab000-0000-0000-0000-000000000007';  -- só OS, nas DUAS lojas
  cliente    uuid := 'cacac000-0000-0000-0000-000000000001';
  os_a       uuid := 'cacad000-0000-0000-0000-00000000000a';
  os_b       uuid := 'cacad000-0000-0000-0000-00000000000b';
  mov_manual uuid := 'cacae000-0000-0000-0000-000000000001';  -- aluguel, loja A
  mov_os     uuid := 'cacae000-0000-0000-0000-000000000002';  -- faturamento da os_a
  mov_pagar  uuid := 'cacae000-0000-0000-0000-000000000003';  -- saída ligada a conta paga
  mov_rec    uuid := 'cacae000-0000-0000-0000-000000000004';  -- entrada ligada a conta recebida
  mov_b      uuid := 'cacae000-0000-0000-0000-00000000000b';  -- lançamento da loja B
  novo       uuid;
  conta      uuid := 'cacaf000-0000-0000-0000-000000000001';
  quantas    int;
begin
  -- ---- preparo -----------------------------------------------------------
  insert into lojas (id, nome, cidade, uf) values
    (loja_a, 'Loja A de Teste', 'Araraquara', 'SP'),
    (loja_b, 'Loja B de Teste', 'Araraquara', 'SP')
    on conflict (id) do nothing;

  insert into auth.users (id) values
    (o_painel), (o_caixa), (o_rel), (o_os), (o_pagar), (o_receber), (o_os_ab)
    on conflict do nothing;

  insert into operadores (id, usuario, nome, admin, permissoes, ativo) values
    (o_painel,  'tx_painel',  'Só Início',           false, array['painel'],                   true),
    (o_caixa,   'tx_caixa',   'Caixa',               false, array['painel','caixa'],           true),
    (o_rel,     'tx_rel',     'Só Relações',         false, array['painel','relatorios'],      true),
    (o_os,      'tx_os',      'Só OS',               false, array['painel','ordens_servico'],  true),
    (o_pagar,   'tx_pagar',   'Só Contas a Pagar',   false, array['painel','contas_pagar'],    true),
    (o_receber, 'tx_receber', 'Só Contas a Receber', false, array['painel','contas_receber'],  true),
    (o_os_ab,   'tx_os_ab',   'Só OS, nas duas',     false, array['painel','ordens_servico'],  true)
    on conflict (id) do nothing;

  insert into operador_lojas (operador_id, loja_id) values
    (o_painel, loja_a), (o_caixa, loja_a), (o_rel, loja_a), (o_os, loja_a),
    (o_pagar, loja_a), (o_receber, loja_a), (o_os_ab, loja_a), (o_os_ab, loja_b)
    on conflict do nothing;

  insert into clientes (id, nome, tipo_pessoa) values (cliente, 'Cliente de Teste', 'fisica')
    on conflict (id) do nothing;

  insert into ordens_servico (id, loja_id, cliente_id, status) values
    (os_a, loja_a, cliente, 'faturada'),
    (os_b, loja_b, cliente, 'faturada')
    on conflict (id) do nothing;

  insert into caixa_movimentos (id, loja_id, ordem_servico_id, tipo, forma_pagamento, valor, descricao) values
    (mov_manual, loja_a, null, 'saida',   'dinheiro', 1500.00, 'Aluguel'),
    (mov_os,     loja_a, os_a, 'entrada', 'pix',       450.00, 'Faturamento da OS de teste'),
    (mov_pagar,  loja_a, null, 'saida',   'pix',       300.00, 'Conta de luz'),
    (mov_rec,    loja_a, null, 'entrada', 'dinheiro',  200.00, 'Fiado recebido'),
    (mov_b,      loja_b, null, 'entrada', 'dinheiro',  999.00, 'Venda da loja B');

  insert into contas_pagar (loja_id, descricao, valor, vencimento, status, caixa_movimento_id)
    values (loja_a, 'Conta de luz', 300.00, current_date, 'paga', mov_pagar);
  insert into contas_receber (loja_id, cliente_id, descricao, valor, vencimento, status, caixa_movimento_id)
    values (loja_a, cliente, 'Fiado', 200.00, current_date, 'recebido', mov_rec);

  set local role authenticated;

  -- ===================================================================
  -- A. Quem só tem o Início: nada
  -- ===================================================================
  perform set_config('request.jwt.claim.sub', o_painel::text, true);

  select count(*) into quantas from caixa_movimentos;
  if quantas <> 0 then
    raise exception 'FALHOU (1): quem só tem o Início leu % lançamento(s) do Caixa', quantas;
  end if;

  begin
    insert into caixa_movimentos (loja_id, tipo, valor, descricao)
      values (loja_a, 'entrada', 10.00, 'Inventado');
    raise exception 'FALHOU (2): quem só tem o Início lançou no Caixa';
  exception when insufficient_privilege then
    if sqlerrm not like '%row-level security%' then raise; end if;
  end;

  update caixa_movimentos set valor = 0.01; get diagnostics quantas = row_count;
  if quantas <> 0 then raise exception 'FALHOU (3): quem só tem o Início alterou % lançamento(s)', quantas; end if;

  delete from caixa_movimentos; get diagnostics quantas = row_count;
  if quantas <> 0 then raise exception 'FALHOU (4): quem só tem o Início apagou % lançamento(s)', quantas; end if;

  -- ===================================================================
  -- B. O Caixa: tudo da loja dele
  -- ===================================================================
  perform set_config('request.jwt.claim.sub', o_caixa::text, true);

  select count(*) into quantas from caixa_movimentos;
  if quantas <> 4 then
    raise exception 'FALHOU (5): o Caixa devia ler os 4 lançamentos da loja A e leu %', quantas;
  end if;

  -- lançamento manual, pedindo a linha de volta (como o fechamento de caixa faz)
  insert into caixa_movimentos (loja_id, tipo, valor, descricao)
    values (loja_a, 'entrada', 5.00, 'Sucata') returning id into novo;

  with s as (update caixa_movimentos set descricao = 'Sucata vendida' where id = novo returning 1)
  select count(*) into quantas from s;
  if quantas <> 1 then raise exception 'FALHOU (6): o Caixa não conseguiu editar o lançamento'; end if;

  with s as (delete from caixa_movimentos where id = novo returning 1) select count(*) into quantas from s;
  if quantas <> 1 then raise exception 'FALHOU (7): o Caixa não conseguiu apagar o lançamento'; end if;

  -- ===================================================================
  -- C. Relações: lê tudo da loja dele, e só lê
  -- ===================================================================
  perform set_config('request.jwt.claim.sub', o_rel::text, true);

  select count(*) into quantas from caixa_movimentos;
  if quantas <> 4 then
    raise exception
      'FALHOU (8): Relações devia ler os 4 lançamentos da loja A e leu %. '
      'Menos é gráfico de lucro errado com cara de certo; mais é outra loja vazando.', quantas;
  end if;

  begin
    insert into caixa_movimentos (loja_id, tipo, valor, descricao)
      values (loja_a, 'saida', 10.00, 'Relações lançando');
    raise exception 'FALHOU (9): Relações lançou no Caixa';
  exception when insufficient_privilege then
    if sqlerrm not like '%row-level security%' then raise; end if;
  end;

  update caixa_movimentos set valor = 0.01; get diagnostics quantas = row_count;
  if quantas <> 0 then raise exception 'FALHOU (10): Relações alterou % lançamento(s)', quantas; end if;

  delete from caixa_movimentos; get diagnostics quantas = row_count;
  if quantas <> 0 then raise exception 'FALHOU (11): Relações apagou % lançamento(s)', quantas; end if;

  -- ===================================================================
  -- D. Quem só fatura OS: os lançamentos DE OS, e mais nada
  -- ===================================================================
  perform set_config('request.jwt.claim.sub', o_os::text, true);

  -- 12. só o faturamento da OS (é o que a nota e a garantia usam)
  select count(*) into quantas from caixa_movimentos;
  if quantas <> 1 then
    raise exception 'FALHOU (12): quem só tem OS devia ler 1 lançamento (o da OS) e leu %', quantas;
  end if;
  select count(*) into quantas from caixa_movimentos where id = mov_manual;
  if quantas <> 0 then raise exception 'FALHOU (13): quem só tem OS enxergou o aluguel'; end if;

  -- 14. faturar "recebido agora" — igual ao app: id gerado antes, sem returning
  insert into caixa_movimentos (id, loja_id, ordem_servico_id, tipo, forma_pagamento, valor, descricao)
    values (gen_random_uuid(), loja_a, os_a, 'entrada', 'cartao_credito', 100.00, 'Faturamento (2ª forma)');

  -- 15. saída não é faturamento
  begin
    insert into caixa_movimentos (loja_id, ordem_servico_id, tipo, valor, descricao)
      values (loja_a, os_a, 'saida', 10.00, 'Saída pela OS');
    raise exception 'FALHOU (15): quem só tem OS lançou uma saída';
  exception when insufficient_privilege then
    if sqlerrm not like '%row-level security%' then raise; end if;
  end;

  -- 16. entrada solta, sem OS, também não
  begin
    insert into caixa_movimentos (loja_id, tipo, valor, descricao)
      values (loja_a, 'entrada', 10.00, 'Entrada solta');
    raise exception 'FALHOU (16): quem só tem OS lançou entrada sem OS';
  exception when insufficient_privilege then
    if sqlerrm not like '%row-level security%' then raise; end if;
  end;

  -- 17. nem editar, nem apagar
  update caixa_movimentos set valor = 0.01; get diagnostics quantas = row_count;
  if quantas <> 0 then raise exception 'FALHOU (17): quem só tem OS alterou % lançamento(s)', quantas; end if;
  delete from caixa_movimentos; get diagnostics quantas = row_count;
  if quantas <> 0 then raise exception 'FALHOU (18): quem só tem OS apagou % lançamento(s)', quantas; end if;

  -- 19. quem trabalha nas duas lojas não amarra lançamento da A numa OS da B
  perform set_config('request.jwt.claim.sub', o_os_ab::text, true);
  begin
    insert into caixa_movimentos (loja_id, ordem_servico_id, tipo, valor, descricao)
      values (loja_a, os_b, 'entrada', 10.00, 'Loja A com OS da B');
    raise exception 'FALHOU (19): lançamento de uma loja amarrado à OS de outra loja';
  exception when insufficient_privilege then
    if sqlerrm not like '%row-level security%' then raise; end if;
  end;

  -- ===================================================================
  -- E. Quem só tem Contas a Pagar: a saída da conta, e mais nada
  -- ===================================================================
  perform set_config('request.jwt.claim.sub', o_pagar::text, true);

  select count(*) into quantas from caixa_movimentos;
  if quantas <> 1 then
    raise exception 'FALHOU (20): Contas a Pagar devia enxergar 1 lançamento (o da conta paga) e enxergou %', quantas;
  end if;

  begin
    insert into caixa_movimentos (loja_id, tipo, valor, descricao)
      values (loja_a, 'entrada', 10.00, 'Entrada pelo Contas a Pagar');
    raise exception 'FALHOU (21): Contas a Pagar lançou uma entrada';
  exception when insufficient_privilege then
    if sqlerrm not like '%row-level security%' then raise; end if;
  end;

  -- 22. um `delete` SEM filtro passa só pela regra de EXCLUSÃO (um filtro
  --     faria o banco aplicar também a de leitura, que já esconderia o resto
  --     — e o teste provaria a regra errada). Tem que apagar exatamente 1: a
  --     saída ligada à conta. O aluguel fica.
  delete from caixa_movimentos; get diagnostics quantas = row_count;
  if quantas <> 1 then
    raise exception 'FALHOU (22): Contas a Pagar apagou % lançamento(s) — só podia apagar a saída da própria conta', quantas;
  end if;

  update caixa_movimentos set valor = 0.01; get diagnostics quantas = row_count;
  if quantas <> 0 then raise exception 'FALHOU (23): Contas a Pagar alterou % lançamento(s)', quantas; end if;

  -- ===================================================================
  -- F. Quem só tem Contas a Receber: a entrada da conta, e mais nada
  -- ===================================================================
  perform set_config('request.jwt.claim.sub', o_receber::text, true);

  select count(*) into quantas from caixa_movimentos;
  if quantas <> 1 then
    raise exception 'FALHOU (24): Contas a Receber devia enxergar 1 lançamento (o da conta recebida) e enxergou %', quantas;
  end if;

  -- 25. receber — igual ao app: id gerado antes, sem returning (com e sem OS)
  insert into caixa_movimentos (id, loja_id, tipo, forma_pagamento, valor, descricao)
    values (gen_random_uuid(), loja_a, 'entrada', 'pix', 80.00, 'Recebido');
  insert into caixa_movimentos (id, loja_id, ordem_servico_id, tipo, forma_pagamento, valor, descricao)
    values (gen_random_uuid(), loja_a, os_a, 'entrada', 'pix', 90.00, 'Recebido de OS');

  begin
    insert into caixa_movimentos (loja_id, tipo, valor, descricao)
      values (loja_a, 'saida', 10.00, 'Saída pelo Contas a Receber');
    raise exception 'FALHOU (26): Contas a Receber lançou uma saída';
  exception when insufficient_privilege then
    if sqlerrm not like '%row-level security%' then raise; end if;
  end;

  delete from caixa_movimentos; get diagnostics quantas = row_count;
  if quantas <> 0 then raise exception 'FALHOU (27): Contas a Receber apagou % lançamento(s)', quantas; end if;

  -- ===================================================================
  -- G. Pagar e desfazer, do jeito que o app faz — como quem só tem
  --    Contas a Pagar
  -- ===================================================================
  perform set_config('request.jwt.claim.sub', o_pagar::text, true);

  insert into contas_pagar (id, loja_id, descricao, valor, vencimento)
    values (conta, loja_a, 'Internet', 120.00, current_date);

  -- pagar: 1) lança a saída com o id já gerado, sem pedir de volta...
  novo := gen_random_uuid();
  insert into caixa_movimentos (id, loja_id, tipo, forma_pagamento, valor, descricao)
    values (novo, loja_a, 'saida', 'pix', 120.00, 'Internet');
  -- ...2) liga a conta ao lançamento
  update contas_pagar set status = 'paga', caixa_movimento_id = novo where id = conta;

  select count(*) into quantas from caixa_movimentos where id = novo;
  if quantas <> 1 then raise exception 'FALHOU (28): depois de pagar, a saída ligada não ficou visível'; end if;

  -- desfazer: 1) apaga o lançamento ENQUANTO ele ainda está ligado — com
  --    `returning id`, como o app (`.delete().eq("id").select("id")`)...
  with s as (delete from caixa_movimentos where id = novo returning id) select count(*) into quantas from s;
  if quantas <> 1 then
    raise exception 'FALHOU (29): "desfazer pagamento" não conseguiu apagar a saída da própria conta';
  end if;
  -- ...e a chave estrangeira desligou a conta sozinha (on delete set null)
  select count(*) into quantas from contas_pagar where id = conta and caixa_movimento_id is null;
  if quantas <> 1 then raise exception 'FALHOU (30): a conta continuou ligada a um lançamento apagado'; end if;

  reset role;

  -- A ordem antiga (desligar antes, apagar depois) deixava a saída órfã.
  -- Conferido de propósito, pra ninguém "arrumar" a ordem de volta:
  novo := gen_random_uuid();
  insert into caixa_movimentos (id, loja_id, tipo, valor, descricao) values (novo, loja_a, 'saida', 50.00, 'Órfã');
  update contas_pagar set caixa_movimento_id = novo where id = conta;
  set local role authenticated;
  perform set_config('request.jwt.claim.sub', o_pagar::text, true);
  update contas_pagar set caixa_movimento_id = null where id = conta;   -- desligou primeiro
  with s as (delete from caixa_movimentos where id = novo returning id) select count(*) into quantas from s;
  if quantas <> 0 then
    raise exception 'FALHOU (31): a ordem antiga apagou — o teste 29 não está provando o que diz';
  end if;
  reset role;

  -- ===================================================================
  -- H. A ligação com a conta tem de ser DA MESMA LOJA. A porta das contas é
  --    uma função `security definer` (por desempenho — ver a 0062), então
  --    não herda a RLS das contas: ela mesma confere a loja. Uma conta da
  --    loja B apontando pra um lançamento da loja A não abre a porta pra
  --    ninguém da loja A.
  -- ===================================================================
  novo := gen_random_uuid();
  insert into caixa_movimentos (id, loja_id, tipo, valor, descricao)
    values (novo, loja_a, 'saida', 70.00, 'Ligado a conta de outra loja');
  insert into contas_pagar (loja_id, descricao, valor, vencimento, status, caixa_movimento_id)
    values (loja_b, 'Conta da loja B', 70.00, current_date, 'paga', novo);
  insert into contas_receber (loja_id, cliente_id, descricao, valor, vencimento, status, caixa_movimento_id)
    values (loja_b, cliente, 'Fiado da loja B', 70.00, current_date, 'recebido', novo);

  set local role authenticated;
  perform set_config('request.jwt.claim.sub', o_pagar::text, true);
  select count(*) into quantas from caixa_movimentos where id = novo;
  if quantas <> 0 then
    raise exception 'FALHOU (33): Contas a Pagar enxergou um lançamento da loja A pela conta de outra loja';
  end if;
  -- nenhuma saída da loja A está ligada a conta da loja A a esta altura:
  -- o `delete` sem filtro tem de apagar zero
  delete from caixa_movimentos; get diagnostics quantas = row_count;
  if quantas <> 0 then
    raise exception 'FALHOU (34): Contas a Pagar apagou % lançamento(s) pela conta de outra loja', quantas;
  end if;

  perform set_config('request.jwt.claim.sub', o_receber::text, true);
  select count(*) into quantas from caixa_movimentos where id = novo;
  if quantas <> 0 then
    raise exception 'FALHOU (35): Contas a Receber enxergou um lançamento da loja A pela conta de outra loja';
  end if;
  reset role;

  -- 36 e 37. quem não está logado não pergunta às funções (o `revoke`)
  set local role anon;
  begin
    perform caixa_movimento_de_conta_pagar(novo, loja_a);
    raise exception 'FALHOU (36): quem não está logado chamou caixa_movimento_de_conta_pagar';
  exception when insufficient_privilege then null;
  end;
  begin
    perform caixa_movimento_de_conta_receber(novo, loja_a);
    raise exception 'FALHOU (37): quem não está logado chamou caixa_movimento_de_conta_receber';
  exception when insufficient_privilege then null;
  end;
  reset role;

  -- 32. o aluguel sobreviveu ao `delete` sem filtro da parte E
  select count(*) into quantas from caixa_movimentos where id = mov_manual;
  if quantas <> 1 then raise exception 'FALHOU (32): o aluguel foi apagado por quem só tem Contas a Pagar'; end if;

  -- ---- limpeza ------------------------------------------------------------
  delete from contas_pagar where loja_id in (loja_a, loja_b);
  delete from contas_receber where loja_id in (loja_a, loja_b);
  delete from caixa_movimentos where loja_id in (loja_a, loja_b);
  delete from ordens_servico where loja_id in (loja_a, loja_b);
  delete from clientes where id = cliente;
  delete from funcionarios where operador_id in (o_painel, o_caixa, o_rel, o_os, o_pagar, o_receber, o_os_ab);
  delete from operador_lojas where operador_id in (o_painel, o_caixa, o_rel, o_os, o_pagar, o_receber, o_os_ab);
  delete from operadores where id in (o_painel, o_caixa, o_rel, o_os, o_pagar, o_receber, o_os_ab);
  delete from auth.users where id in (o_painel, o_caixa, o_rel, o_os, o_pagar, o_receber, o_os_ab);
  delete from depositos where loja_id in (loja_a, loja_b);
  delete from configuracoes_garantia where loja_id in (loja_a, loja_b);
  delete from configuracoes_fiscais_loja where loja_id in (loja_a, loja_b);
  delete from configuracoes_painel_inicio where loja_id in (loja_a, loja_b);
  delete from lojas where id in (loja_a, loja_b);
  delete from auditoria;

  raise notice 'TODAS AS CHECAGENS PASSARAM';
end;
$$;
