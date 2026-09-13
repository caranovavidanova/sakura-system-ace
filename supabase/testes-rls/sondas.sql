-- ===================================================================
-- SONDAS DE INSERT DA MATRIZ DE RLS  (item TR-07.3)
-- ===================================================================
--
-- ⚠️  NUNCA rodar no Supabase de verdade — faz parte do banco descartável de
--     `npm run test:rls`, junto com cenario.sql.
--
-- Uma linha por tabela, com a MENOR inserção válida possível apontando pra
-- **loja A** (quando a tabela tem dono). O runner executa cada uma como cada
-- um dos cinco papéis e conta quantas linhas entraram: 1 = a RLS deixou,
-- 0 = a RLS recusou.
--
-- Por que a inserção mínima: qualquer coluna a mais vira chance de o teste
-- falhar por NOT NULL ou CHECK e **parecer** que foi a RLS que bloqueou —
-- que é exatamente a confusão que este teste existe pra evitar. O runner
-- separa os dois casos pelo código de erro do Postgres (42501 é RLS;
-- qualquer outro estoura a rodada em vez de virar um zero silencioso).
--
-- Se uma migration nova criar tabela com RLS, ela precisa de linha aqui —
-- o runner reprova quando encontra tabela sem sonda.
-- ===================================================================

create schema if not exists teste_rls;

drop table if exists teste_rls.sondas;
create table teste_rls.sondas (
  tabela    text primary key,
  insercao  text not null
);

insert into teste_rls.sondas (tabela, insercao) values

-- ---------- catálogo compartilhado ---------------------------------------
('categorias',            $$insert into categorias (nome) values ('Sonda')$$),
('categorias_servicos',   $$insert into categorias_servicos (nome) values ('Sonda')$$),
('categorias_caixa',      $$insert into categorias_caixa (nome, tipo) values ('Sonda', 'entrada')$$),
('clientes',              $$insert into clientes (nome) values ('Cliente sonda')$$),
('veiculos',              $$insert into veiculos (cliente_id, placa) values ('cccccccc-0000-0000-0000-0000000000aa', 'SON1D01')$$),
('pecas',                 $$insert into pecas (descricao) values ('Peça sonda')$$),
('servicos',              $$insert into servicos (descricao) values ('Serviço sonda')$$),
('fornecedores',          $$insert into fornecedores (nome) values ('Fornecedor sonda')$$),
('cotacoes_pecas',        $$insert into cotacoes_pecas (peca_id, fornecedor_id, preco) values ('eeeeeeee-0000-0000-0000-0000000000aa', 'ffffffff-0000-0000-0000-0000000000aa', 1.00)$$),

-- ---------- dado de negócio da loja A ------------------------------------
('depositos',             $$insert into depositos (loja_id, nome) values ('11111111-1111-1111-1111-1111111111aa', 'Depósito sonda')$$),
('funcionarios',          $$insert into funcionarios (loja_id, nome) values ('11111111-1111-1111-1111-1111111111aa', 'Funcionário sonda')$$),
('funcionario_filhos',    $$insert into funcionario_filhos (funcionario_id, nome) values ('33333333-0000-0000-0000-0000000000aa', 'Filho sonda')$$),
('ordens_servico',        $$insert into ordens_servico (numero, loja_id, cliente_id) values (900, '11111111-1111-1111-1111-1111111111aa', 'cccccccc-0000-0000-0000-0000000000aa')$$),
('ordens_servico_itens',  $$insert into ordens_servico_itens (ordem_servico_id, tipo, descricao, quantidade) values ('44444444-0000-0000-0000-0000000000aa', 'servico', 'Item sonda', 1)$$),
('caixa_movimentos',      $$insert into caixa_movimentos (loja_id, tipo, valor) values ('11111111-1111-1111-1111-1111111111aa', 'entrada', 1.00)$$),
('estoque_movimentos',    $$insert into estoque_movimentos (loja_id, deposito_id, peca_id, tipo, quantidade, motivo) values ('11111111-1111-1111-1111-1111111111aa', '22222222-0000-0000-0000-0000000000aa', 'eeeeeeee-0000-0000-0000-0000000000aa', 'entrada', 1, 'ajuste')$$),
('contagens_estoque',     $$insert into contagens_estoque (loja_id, deposito_id, peca_id, quantidade_contada, saldo_sistema, diferenca) values ('11111111-1111-1111-1111-1111111111aa', '22222222-0000-0000-0000-0000000000aa', 'eeeeeeee-0000-0000-0000-0000000000aa', 1, 1, 0)$$),
('contas_pagar',          $$insert into contas_pagar (loja_id, descricao, valor, vencimento) values ('11111111-1111-1111-1111-1111111111aa', 'Conta sonda', 1.00, current_date)$$),
('contas_receber',        $$insert into contas_receber (loja_id, cliente_id, descricao, valor, vencimento) values ('11111111-1111-1111-1111-1111111111aa', 'cccccccc-0000-0000-0000-0000000000aa', 'Receber sonda', 1.00, current_date)$$),
('notas_fiscais_arquivos',$$insert into notas_fiscais_arquivos (loja_id, tipo, competencia, nome_arquivo, storage_path) values ('11111111-1111-1111-1111-1111111111aa', 'nfe', date_trunc('month', current_date), 'sonda.xml', 'nfe/sonda.xml')$$),
('pedidos_compra',        $$insert into pedidos_compra (numero, loja_id, fornecedor_id) values (900, '11111111-1111-1111-1111-1111111111aa', 'ffffffff-0000-0000-0000-0000000000aa')$$),
('pedidos_compra_itens',  $$insert into pedidos_compra_itens (pedido_compra_id, peca_id, quantidade_pedida) values ('99999999-0000-0000-0000-0000000000aa', 'eeeeeeee-0000-0000-0000-0000000000aa', 1)$$),
('whatsapp_mensagens',    $$insert into whatsapp_mensagens (loja_id, chave) values ('11111111-1111-1111-1111-1111111111aa', 'cobranca')$$),

-- ---------- configurações da loja A --------------------------------------
-- As duas de chave composta usam uma chave livre (12 parcelas / outro modelo
-- de mensagem); as três de chave simples usam a loja A, que o cenário deixou
-- de propósito sem linha.
('configuracoes_juros_parcelas', $$insert into configuracoes_juros_parcelas (loja_id, numero_parcelas, juros_percentual) values ('11111111-1111-1111-1111-1111111111aa', 12, 5.0)$$),
('configuracoes_whatsapp',       $$insert into configuracoes_whatsapp (loja_id, chave, texto) values ('11111111-1111-1111-1111-1111111111aa', 'carro_pronto', 'Sonda')$$),
('configuracoes_garantia',       $$insert into configuracoes_garantia (loja_id, texto) values ('11111111-1111-1111-1111-1111111111aa', 'Sonda')$$),
('configuracoes_fiscais_loja',   $$insert into configuracoes_fiscais_loja (loja_id) values ('11111111-1111-1111-1111-1111111111aa')$$),
('configuracoes_painel_inicio',  $$insert into configuracoes_painel_inicio (loja_id, cartoes) values ('11111111-1111-1111-1111-1111111111aa', array['vendas_mes'])$$),

-- ---------- administração -------------------------------------------------
('lojas',          $$insert into lojas (nome) values ('Loja sonda')$$),
('operadores',     $$insert into operadores (id, usuario, nome) values ('00000000-9999-9999-9999-999999999999', 'sonda', 'Operador sonda')$$),
-- Dar à mão acesso da loja A pro operador órfão: é a ação real que esta
-- policy governa, e a que criou o beco sem saída do §6 item 23.
('operador_lojas', $$insert into operador_lojas (operador_id, loja_id) values ('aaaaaaaa-4444-4444-4444-444444444444', '11111111-1111-1111-1111-1111111111aa')$$),
-- A trilha não tem policy de insert pra ninguém, de propósito: só a função
-- de gatilho grava. Esta sonda é o que prova isso a cada rodada.
('auditoria',      $$insert into auditoria (tabela, registro_id, acao) values ('clientes', 'cccccccc-0000-0000-0000-0000000000aa', 'criar')$$);
