-- Sakura System — AutoCenter Edition
-- TESTE do TR-05.1 (migration 0060, travas de dado). NÃO é migration, e
-- NUNCA deve ser rodado no Supabase de verdade — grava dado de teste (e
-- apaga o que gravou no fim).
--
-- As duas metades, como sempre:
--   • cada trava RECUSA a linha impossível que existe pra barrar;
--   • e ACEITA o caso de verdade que parece estranho e não é — conta de
--     valor zero (OS de garantia), CNPJ alfanumérico (desde julho de 2026),
--     OS faturada por um computador com o relógio uns minutos atrasado.
--     Uma trava que também barrasse esses casos seria tranca, não trava.
--
-- Como rodar: ver o cabeçalho de supabase/scripts/testar-auditoria.sql
-- (depois da instalação completa). "TODAS AS CHECAGENS PASSARAM" = passou.
--
-- Esta é a metade "o banco recusa". A outra metade — a tela explicar a
-- recusa em português, e o formulário da OS barrar antes de chegar aqui —
-- está em src/lib/errors.test.ts e em OrdemServicoForm.test.tsx.

do $$
declare
  loja    uuid := 'dada0000-0000-0000-0000-00000000000a';
  cli     uuid := 'dada1111-0000-0000-0000-000000000001';
  os_id   uuid := 'dada2222-0000-0000-0000-000000000001';
  forn    uuid := 'dada3333-0000-0000-0000-000000000001';
  ped     uuid := 'dada4444-0000-0000-0000-000000000001';
  peca    uuid := 'dada5555-0000-0000-0000-000000000001';
  recusas int := 0;

  -- tenta o comando; conta 1 se o Postgres recusou pela trava com esse nome
  proibidos text[][] := array[
    ['ck_ordens_servico_itens_preco',    format($q$insert into ordens_servico_itens (ordem_servico_id, tipo, descricao, quantidade, preco_unitario) values (%L, 'servico', 'x', 1, -1)$q$, os_id)],
    ['ck_ordens_servico_itens_desconto', format($q$insert into ordens_servico_itens (ordem_servico_id, tipo, descricao, quantidade, preco_unitario, desconto) values (%L, 'servico', 'x', 1, 10, 10.01)$q$, os_id)],
    ['ck_ordens_servico_itens_desconto', format($q$insert into ordens_servico_itens (ordem_servico_id, tipo, descricao, quantidade, preco_unitario, desconto) values (%L, 'servico', 'x', 1, 10, -1)$q$, os_id)],
    ['ck_pecas_preco_custo',             $q$insert into pecas (descricao, preco_custo) values ('x', -0.01)$q$],
    ['ck_pecas_preco_venda',             $q$insert into pecas (descricao, preco_venda) values ('x', -5)$q$],
    ['ck_pecas_prazo_garantia',          $q$insert into pecas (descricao, prazo_garantia_dias) values ('x', -1)$q$],
    ['ck_pecas_aliquota_icms',           $q$insert into pecas (descricao, aliquota_icms) values ('x', 300)$q$],
    ['ck_servicos_preco_padrao',         $q$insert into servicos (descricao, preco_padrao) values ('x', -1)$q$],
    ['ck_servicos_custo',                $q$insert into servicos (descricao, custo) values ('x', -1)$q$],
    ['ck_contas_pagar_valor',            format($q$insert into contas_pagar (loja_id, descricao, valor, vencimento) values (%L, 'x', -1, current_date)$q$, loja)],
    ['ck_contas_receber_valor',          format($q$insert into contas_receber (loja_id, cliente_id, descricao, valor, vencimento) values (%L, %L, 'x', -1, current_date)$q$, loja, cli)],
    ['ck_pedidos_compra_itens_preco',    format($q$insert into pedidos_compra_itens (pedido_compra_id, peca_id, quantidade_pedida, preco_unitario) values (%L, %L, 1, -1)$q$, ped, peca)],
    ['ck_pedidos_compra_itens_recebida', format($q$insert into pedidos_compra_itens (pedido_compra_id, peca_id, quantidade_pedida, quantidade_recebida) values (%L, %L, 1, -1)$q$, ped, peca)],
    ['ck_ordens_servico_datas',          format($q$update ordens_servico set data_fechamento = data_abertura - interval '3 days' where id = %L$q$, os_id)],
    ['ck_juros_percentual',              format($q$insert into configuracoes_juros_parcelas (loja_id, numero_parcelas, juros_percentual) values (%L, 3, 150)$q$, loja)],
    ['ck_config_fiscal_aliquota_iss',    format($q$update configuracoes_fiscais_loja set aliquota_iss = 25 where loja_id = %L$q$, loja)],
    ['ck_config_fiscal_cnpj',            format($q$update configuracoes_fiscais_loja set cnpj = '12.345.678/0001' where loja_id = %L$q$, loja)],
    ['ck_clientes_cnpj_juridica',        $q$insert into clientes (nome, tipo_pessoa, cpf_cnpj) values ('PJ pela metade', 'juridica', '12.345.678/0001')$q$]
  ];
  i int;
begin
  -- ---- preparo -------------------------------------------------------------
  insert into lojas (id, nome, cidade, uf) values (loja, 'Loja (teste travas)', 'Araraquara', 'SP')
    on conflict (id) do nothing;
  insert into configuracoes_fiscais_loja (loja_id) values (loja) on conflict (loja_id) do nothing;
  insert into clientes (id, nome) values (cli, 'Cliente das travas') on conflict (id) do nothing;
  insert into ordens_servico (id, loja_id, cliente_id, data_abertura) values (os_id, loja, cli, now())
    on conflict (id) do nothing;
  insert into fornecedores (id, nome) values (forn, 'Fornecedor das travas') on conflict (id) do nothing;
  insert into pecas (id, descricao) values (peca, 'Peça das travas') on conflict (id) do nothing;
  insert into pedidos_compra (id, loja_id, fornecedor_id) values (ped, loja, forn) on conflict (id) do nothing;

  -- ===================================================================
  -- A. Cada trava recusa o impossível
  -- ===================================================================
  for i in 1 .. array_length(proibidos, 1) loop
    begin
      execute proibidos[i][2];
      raise exception 'FALHOU: a trava % deixou passar: %', proibidos[i][1], proibidos[i][2];
    exception
      when check_violation then
        if sqlerrm not like '%' || proibidos[i][1] || '%' then
          raise exception 'FALHOU: esperava a trava %, veio: %', proibidos[i][1], sqlerrm;
        end if;
        recusas := recusas + 1;
    end;
  end loop;

  if recusas <> array_length(proibidos, 1) then
    raise exception 'FALHOU: só % de % recusas', recusas, array_length(proibidos, 1);
  end if;

  -- ===================================================================
  -- B. ...e aceita o que parece estranho e é de verdade
  -- ===================================================================
  -- OS de garantia: total zero, faturada "a receber" → conta de valor zero
  insert into contas_receber (loja_id, cliente_id, descricao, valor, vencimento)
    values (loja, cli, 'OS de garantia', 0, current_date);
  -- item de graça, e desconto que zera a linha
  insert into ordens_servico_itens (ordem_servico_id, tipo, descricao, quantidade, preco_unitario, desconto)
    values (os_id, 'servico', 'Retorno de garantia', 1, 0, 0),
           (os_id, 'servico', 'Cortesia', 2, 10, 20);
  -- CNPJ alfanumérico (julho de 2026 em diante), com e sem pontuação
  insert into clientes (nome, tipo_pessoa, cpf_cnpj) values
    ('PJ nova, com pontuação', 'juridica', '12.ABC.345/01DE-35'),
    ('PJ nova, só os caracteres', 'juridica', '12abc34501de35'),
    ('PJ sem CNPJ ainda', 'juridica', null),
    ('PJ sem CNPJ, campo em branco', 'juridica', '  '),
    ('Pessoa física, CPF qualquer', 'fisica', '123');
  update configuracoes_fiscais_loja set cnpj = '12.ABC.345/01DE-35', aliquota_iss = 3 where loja_id = loja;
  -- relógio do computador da loja uns minutos atrás do servidor
  update ordens_servico set data_fechamento = data_abertura - interval '5 minutes' where id = os_id;
  -- 1x (à vista) não é linha da tabela de juros; 12x com 0% é
  insert into configuracoes_juros_parcelas (loja_id, numero_parcelas, juros_percentual) values (loja, 12, 0);

  -- ---- limpeza ------------------------------------------------------------
  delete from configuracoes_juros_parcelas where loja_id = loja;
  delete from contas_receber where loja_id = loja;
  delete from ordens_servico_itens where ordem_servico_id = os_id;
  delete from ordens_servico where id = os_id;
  delete from pedidos_compra_itens where pedido_compra_id = ped;
  delete from pedidos_compra where id = ped;
  delete from fornecedores where id = forn;
  delete from pecas where id = peca;
  delete from clientes where id = cli or nome like 'PJ %' or nome = 'Pessoa física, CPF qualquer';
  delete from depositos where loja_id = loja;
  delete from configuracoes_garantia where loja_id = loja;
  delete from configuracoes_fiscais_loja where loja_id = loja;
  delete from configuracoes_painel_inicio where loja_id = loja;
  delete from lojas where id = loja;
  delete from auditoria;

  raise notice 'TODAS AS CHECAGENS PASSARAM (% recusas do impossível, nas 17 travas)', recusas;
end;
$$;
