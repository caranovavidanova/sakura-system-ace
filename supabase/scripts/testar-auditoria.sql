-- Sakura System — AutoCenter Edition
-- TESTE da trilha de auditoria (migrations 0040 + 0053). NÃO é migration:
-- não faz parte da sequência de instalação e NUNCA deve ser rodado no
-- Supabase de verdade — ele grava e apaga dado de teste.
--
-- Para que serve: provar, num Postgres local, as quatro promessas da
-- migration 0053 — e principalmente a terceira, que é a que protege segredo.
--
-- Como rodar (ver seção 9 do PROJETO_STATUS.md):
--
--   service postgresql start
--   sudo -u postgres psql -c "drop database if exists sakura_teste;" \
--                        -c "create database sakura_teste;"
--   sudo -u postgres psql -d sakura_teste -f supabase/scripts/stub-supabase-local.sql
--   sudo -u postgres psql -d sakura_teste -f supabase/instalacao/instalacao-completa.sql
--   sudo -u postgres psql -d sakura_teste -f supabase/scripts/testar-auditoria.sql
--
-- Cada checagem estoura com `raise exception` se falhar. Terminou sem erro e
-- imprimindo "TODAS AS CHECAGENS PASSARAM", passou.

do $$
declare
  operador_teste uuid := '11111111-1111-1111-1111-111111111111';
  loja_teste uuid := '00000000-0000-0000-0000-000000000001';
  cliente_teste uuid := '22222222-2222-2222-2222-222222222222';
  ordem_teste uuid := '33333333-3333-3333-3333-333333333333';
  item_teste uuid := '44444444-4444-4444-4444-444444444444';
  achado text;
  quantas int;
  recusou boolean := false;
begin
  -- ---- preparo -----------------------------------------------------------
  insert into auth.users (id) values (operador_teste) on conflict do nothing;
  insert into operadores (id, usuario, nome, admin, permissoes, ativo)
    values (operador_teste, 'teste_auditoria', 'Operador de Teste', true, array['inicio'], true)
    on conflict (id) do nothing;
  insert into operador_lojas (operador_id, loja_id)
    values (operador_teste, loja_teste) on conflict do nothing;

  perform set_config('request.jwt.claim.sub', operador_teste::text, true);
  delete from auditoria;

  -- ---- 1. CRIAR deixa rastro (não deixava antes da 0053) ------------------
  insert into clientes (id, nome, cpf_cnpj) values (cliente_teste, 'Cliente de Teste', '123');

  select count(*) into quantas
    from auditoria where tabela = 'clientes' and acao = 'criar' and registro_id = cliente_teste;
  if quantas <> 1 then
    raise exception 'FALHOU: criar um cliente não gerou linha de auditoria (achou %)', quantas;
  end if;

  -- ---- 2. mudar o VALOR de um item de OS deixa rastro ---------------------
  -- É o buraco da v0.9.28: desde ela dá pra corrigir o preço de um item pela
  -- tela, e isso não aparecia em lugar nenhum.
  insert into ordens_servico (id, loja_id, cliente_id)
    values (ordem_teste, loja_teste, cliente_teste);
  insert into ordens_servico_itens
    (id, ordem_servico_id, tipo, descricao, quantidade, preco_unitario)
    values (item_teste, ordem_teste, 'servico', 'Alinhamento', 1, 60);
  update ordens_servico_itens set preco_unitario = 120 where id = item_teste;

  select (dados_antes ->> 'preco_unitario') || ' -> ' || (dados_depois ->> 'preco_unitario')
    into achado
    from auditoria where tabela = 'ordens_servico_itens' and acao = 'atualizar';
  if achado is distinct from '60.00 -> 120.00' then
    raise exception 'FALHOU: o antes/depois do preço do item saiu como "%"', achado;
  end if;

  -- ---- 3. o token da Focus NFe NUNCA aparece em texto claro ---------------
  -- Sem isto, a trilha viraria o lugar novo onde o segredo fica legível.
  update configuracoes_fiscais_loja
    set focus_nfe_token = 'TOKEN_QUE_NAO_PODE_VAZAR', cnpj = '00.000.000/0001-00'
    where loja_id = loja_teste;
  update configuracoes_fiscais_loja
    set focus_nfe_token = 'OUTRO_TOKEN_QUE_NAO_PODE_VAZAR'
    where loja_id = loja_teste;

  select count(*) into quantas
    from auditoria
    where dados_antes::text like '%NAO_PODE_VAZAR%'
       or dados_depois::text like '%NAO_PODE_VAZAR%';
  if quantas <> 0 then
    raise exception 'FALHOU: o token da Focus NFe vazou em % linha(s) da auditoria', quantas;
  end if;

  select dados_depois ->> 'focus_nfe_token' into achado
    from auditoria where tabela = 'configuracoes_fiscais_loja' and acao = 'atualizar' limit 1;
  if achado is distinct from '***' then
    raise exception 'FALHOU: o token devia estar mascarado como ***, veio "%"', achado;
  end if;

  -- ...mas o que NÃO é segredo tem que continuar auditável.
  select dados_depois ->> 'cnpj' into achado
    from auditoria where tabela = 'configuracoes_fiscais_loja' and acao = 'atualizar' limit 1;
  if achado is distinct from '00.000.000/0001-00' then
    raise exception 'FALHOU: a máscara comeu o CNPJ junto (veio "%")', achado;
  end if;

  -- ---- 4. tabela de PK composta (não tem coluna `id`) ---------------------
  -- A função da 0040 gravava `new.id` fixo e teria estourado aqui.
  insert into configuracoes_juros_parcelas (loja_id, numero_parcelas, juros_percentual)
    values (loja_teste, 3, 4.5);
  delete from configuracoes_juros_parcelas where loja_id = loja_teste and numero_parcelas = 3;

  select count(*) into quantas
    from auditoria
    where tabela = 'configuracoes_juros_parcelas' and registro_id = loja_teste;
  if quantas <> 2 then
    raise exception 'FALHOU: PK composta devia gerar 2 linhas (criar + excluir), gerou %', quantas;
  end if;

  -- ---- 5. a retenção mínima do expurgo não é negociável -------------------
  -- O `raise` de falha fica FORA do bloco de propósito: dentro dele, o
  -- próprio erro de falha seria capturado pelo `exception` logo abaixo e o
  -- teste passaria sempre — teste que não sabe ficar vermelho não prova nada.
  begin
    perform expurgar_auditoria(1);
  exception
    when others then
      recusou := true;
  end;
  if not recusou then
    raise exception 'FALHOU: expurgar_auditoria(1) devia ter sido recusado (retenção mínima)';
  end if;

  -- ---- 6. o nome de quem fez fica gravado junto ---------------------------
  select operador_nome into achado from auditoria where tabela = 'clientes' limit 1;
  if achado is distinct from 'Operador de Teste' then
    raise exception 'FALHOU: o nome de quem fez devia estar gravado, veio "%"', achado;
  end if;

  -- ---- 7. excluir um operador NÃO trava por causa da trilha ---------------
  -- Antes da 0053 a FK era NO ACTION: com linha de auditoria apontando pro
  -- operador, o caminho de exclusão documentado (painel do Supabase, seção 6
  -- item 23) quebraria com erro de chave estrangeira.
  delete from ordens_servico_itens where id = item_teste;
  delete from ordens_servico where id = ordem_teste;
  delete from clientes where id = cliente_teste;
  delete from operador_lojas where operador_id = operador_teste;
  delete from operadores where id = operador_teste;

  select count(*) into quantas from auditoria where operador_nome = 'Operador de Teste';
  if quantas = 0 then
    raise exception 'FALHOU: a trilha perdeu o nome de quem fez ao excluir o operador';
  end if;

  -- E o `operador_id` continua ali, sem FK, porque é por ele que a tela filtra.
  select count(*) into quantas from auditoria where operador_id = operador_teste;
  if quantas = 0 then
    raise exception 'FALHOU: o operador_id sumiu da trilha ao excluir o operador';
  end if;

  -- ---- limpeza ------------------------------------------------------------
  delete from auth.users where id = operador_teste;
  delete from auditoria;

  raise notice 'TODAS AS CHECAGENS PASSARAM';
end;
$$;
