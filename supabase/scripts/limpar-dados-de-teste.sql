-- Sakura System — AutoCenter Edition
-- ============================================================================
-- ATENÇÃO: isto NÃO é uma migration. Não faz parte da sequência 0001-00NN de
-- supabase/migrations/ (essas são de setup de estrutura, seguras de rodar
-- de novo a qualquer momento). Este aqui é um script de USO ÚNICO — apaga de
-- verdade os dados de negócio cadastrados até agora (clientes, veículos,
-- peças, serviços, ordens de serviço, caixa, estoque, contas a pagar, notas
-- fiscais). Rode só se tiver certeza de que tudo isso é dado de TESTE.
--
-- O que NÃO é apagado: seu(s) login(s) de operador, as configurações da loja
-- (juros de parcelamento, texto de garantia, dados fiscais, cartões do
-- Início), as categorias de caixa, e qualquer funcionário que já esteja
-- vinculado a um operador (login) de verdade.
--
-- ORDEM DE EXECUÇÃO (importante):
--   1. Rode as migrations 0028, 0029 e 0030 em supabase/migrations/ (nessa
--      ordem) — elas criam a categoria de serviço e semeiam as categorias +
--      catálogo de serviços padrão.
--   2. SÓ DEPOIS rode este script. Ele já sabe preservar as categorias e os
--      serviços padrão semeados no passo 1 (filtra pelo nome/descrição
--      deles) — se rodar antes, os "padrão" ainda não existem e não tem
--      problema, mas a ordem acima é a pensada.
--
-- Depois de rodar: os arquivos de XML de nota fiscal que já foram
-- enviados continuam de verdade dentro do bucket "notas-fiscais" no
-- Supabase Storage — este script só limpa a tabela que aponta pra eles.
-- Se quiser apagar os arquivos de teste também, é manual: painel do
-- Supabase → Storage → bucket "notas-fiscais" → selecionar tudo → excluir.
-- ============================================================================

-- Ordem pensada pra não esbarrar em chave estrangeira (filho antes do pai).
delete from contas_pagar;
delete from caixa_movimentos;
delete from notas_fiscais_arquivos;
delete from ordens_servico; -- cascata: apaga também ordens_servico_itens

delete from pecas; -- cascata: apaga também estoque_movimentos e contagens_estoque

delete from servicos
where descricao not in (
  'Alinhamento Dianteiro',
  'Balanceamento',
  'Montagem de Pneu',
  'Rodízio de Pneus',
  'Serviço técnico – Suspensão',
  'Serviço técnico – Amortecedores',
  'Retífica de Disco de Freio',
  'Higienização de Freio',
  'Sangria de Freio',
  'Serviço técnico – Freios',
  'Alinhamento Traseiro',
  'Cambagem Dianteira Direita',
  'Cambagem Dianteira Esquerda',
  'Caster Dianteiro Direito',
  'Caster Dianteiro Esquerdo',
  'Eixo Traseiro Completo',
  'Serviço técnico – Outros'
);

delete from clientes; -- cascata: apaga também veiculos

delete from categorias
where nome not in ('Pneus', 'Suspensão', 'Amortecedores', 'Freios', 'Outras Peças');

delete from categorias_servicos
where nome not in ('Pneus', 'Suspensão', 'Amortecedores', 'Freios', 'Alinhamento', 'Outros Serviços');

-- Só remove funcionário "avulso" de teste (sem login vinculado). Quem já
-- loga no sistema (tem operador_id) nunca é apagado por aqui.
delete from funcionarios where operador_id is null;
