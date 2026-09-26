-- Sakura System — AutoCenter Edition
-- TESTE da migration 0064 (venda de balcão, item FN-09). NÃO é migration, e
-- NUNCA deve ser rodado no Supabase de verdade — grava e apaga dado de teste.
--
-- A promessa, em duas metades:
--   • o que já existe continua igual: OS antiga e OS nova sem dizer o tipo
--     são "os", e tipo inventado é recusado;
--   • e a venda de balcão funciona pra quem ela existe — o balconista que só
--     tem o módulo Ordens de Serviço enxerga o cliente "Consumidor", registra
--     a venda no nome dele e fatura, com o número saindo do MESMO contador
--     das OS (número único por loja, nunca "OS 3" e "Venda 3" juntas).
--
-- Como rodar: ver o cabeçalho de supabase/scripts/testar-auditoria.sql.
-- Terminou imprimindo "TODAS AS CHECAGENS PASSARAM", passou.

do $$
declare
  consumidor uuid := '00000000-0000-0000-0000-00000000c000';
  loja       uuid := 'ba1c0000-0000-0000-0000-00000000000a';
  o_balcao   uuid := 'ba1c1111-0000-0000-0000-000000000001';  -- só Ordens de Serviço
  cliente    uuid := 'ba1c2222-0000-0000-0000-000000000001';
  n_os1      int;
  n_venda    int;
  n_os2      int;
  venda_id   uuid;
  quantas    int;
  linha      record;
begin
  insert into lojas (id, nome, cidade, uf) values (loja, 'Loja (teste venda)', 'Araraquara', 'SP')
    on conflict (id) do nothing;
  insert into auth.users (id) values (o_balcao) on conflict do nothing;
  insert into operadores (id, usuario, nome, admin, permissoes, ativo) values
    (o_balcao, 'tv_balcao', 'Balconista da venda', false, array['painel', 'ordens_servico'], true)
    on conflict (id) do nothing;
  insert into operador_lojas (operador_id, loja_id) values (o_balcao, loja) on conflict do nothing;
  insert into clientes (id, nome) values (cliente, 'Cliente de verdade') on conflict (id) do nothing;

  -- ===================================================================
  -- A. O cliente Consumidor existe, e é pessoa física sem documento
  -- ===================================================================
  select * into linha from clientes where id = consumidor;
  if linha.id is null then
    raise exception 'FALHOU: a migration não criou o cliente Consumidor';
  end if;
  if linha.nome <> 'Consumidor' or linha.tipo_pessoa <> 'fisica' or coalesce(linha.cpf_cnpj, '') <> '' then
    raise exception 'FALHOU: o Consumidor nasceu diferente do combinado: %', row_to_json(linha);
  end if;

  -- ===================================================================
  -- B. OS sem dizer o tipo continua sendo OS (o programa antigo não manda)
  -- ===================================================================
  insert into ordens_servico (loja_id, cliente_id) values (loja, cliente)
    returning numero into n_os1;
  if (select tipo from ordens_servico where loja_id = loja and numero = n_os1) <> 'os' then
    raise exception 'FALHOU: OS criada sem tipo não virou "os"';
  end if;

  -- ===================================================================
  -- C. Tipo inventado é recusado pela trava, com o nome certo
  -- ===================================================================
  begin
    insert into ordens_servico (loja_id, cliente_id, tipo) values (loja, cliente, 'pdv');
    raise exception 'FALHOU: aceitou um tipo de ordem inventado';
  exception when check_violation then
    if sqlerrm not like '%ck_ordens_servico_tipo%' then
      raise exception 'FALHOU: esperava a trava ck_ordens_servico_tipo, veio: %', sqlerrm;
    end if;
  end;

  -- ===================================================================
  -- D. O balconista (só Ordens de Serviço) faz uma venda no Consumidor
  -- ===================================================================
  set local role authenticated;
  perform set_config('request.jwt.claim.sub', o_balcao::text, true);

  select count(*) into quantas from clientes where id = consumidor;
  if quantas <> 1 then
    raise exception 'FALHOU: o balconista não enxerga o cliente Consumidor';
  end if;

  venda_id := gen_random_uuid();
  -- Sem `returning`: é assim que o programa grava (e o `returning` passaria
  -- também pela regra de leitura, testando outra coisa — §6 item 74).
  insert into ordens_servico (id, loja_id, cliente_id, tipo, status, vendedor_id)
    values (venda_id, loja, consumidor, 'venda_balcao', 'concluida', null);
  insert into ordens_servico_itens (ordem_servico_id, tipo, descricao, quantidade, preco_unitario)
    values (venda_id, 'peca', 'Palheta 20"', 2, 35);
  update ordens_servico set status = 'faturada', forma_pagamento = 'Pix', data_fechamento = now()
    where id = venda_id;
  get diagnostics quantas = row_count;
  if quantas <> 1 then
    raise exception 'FALHOU: o balconista não conseguiu faturar a venda (% linhas)', quantas;
  end if;

  select numero into n_venda from ordens_servico where id = venda_id;
  reset role;

  -- ===================================================================
  -- E. Um contador só: OS, venda e OS de novo saem em sequência
  -- ===================================================================
  insert into ordens_servico (loja_id, cliente_id) values (loja, cliente)
    returning numero into n_os2;
  if n_venda <> n_os1 + 1 or n_os2 <> n_venda + 1 then
    raise exception 'FALHOU: a numeração não é compartilhada: OS %, venda %, OS %', n_os1, n_venda, n_os2;
  end if;

  select count(*) into quantas from ordens_servico where loja_id = loja and tipo = 'venda_balcao';
  if quantas <> 1 then
    raise exception 'FALHOU: esperava 1 venda de balcão na loja, achei %', quantas;
  end if;

  -- ===================================================================
  -- F. Com venda no nome dele, o Consumidor não pode ser apagado
  -- ===================================================================
  begin
    delete from clientes where id = consumidor;
    raise exception 'FALHOU: deu pra apagar o Consumidor mesmo com venda no nome dele';
  exception when foreign_key_violation then
    null;
  end;

  -- ---- limpeza ------------------------------------------------------------
  delete from ordens_servico where loja_id = loja;
  delete from operador_lojas where loja_id = loja;
  delete from operadores where id = o_balcao;
  delete from clientes where id = cliente;
  delete from lojas where id = loja;

  raise notice 'TODAS AS CHECAGENS PASSARAM';
end $$;
