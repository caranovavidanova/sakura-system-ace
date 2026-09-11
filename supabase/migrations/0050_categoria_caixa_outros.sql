-- Sakura System — AutoCenter Edition
-- Migration 0050: semeia a categoria "Outros" em categorias_caixa.
--
-- A categoria do lançamento manual de caixa passou a ser OBRIGATÓRIA no
-- formulário (item TL-27 do guia de melhorias). O motivo está na própria tela
-- de Saídas: como era opcional, ninguém preenchia, e o bloco "Por categoria"
-- virou um balde só — "Sem categoria: R$ 31.000,00", todas as despesas do mês
-- juntas. Categoria opcional é, na prática, relatório por categoria que não
-- existe.
--
-- Por que semear aqui, e por que isso NÃO é detalhe:
--
--   `categorias_caixa` (migration 0020) nunca foi semeada por migration
--   nenhuma — diferente de `categorias` e `categorias_servicos`, que a 0030
--   semeia. Ou seja, um banco recém-instalado tem ZERO categorias de caixa.
--   Exigir a categoria sem garantir que exista pelo menos uma opção deixaria
--   o operador sem conseguir lançar nada no caixa, sem saída pela tela — é a
--   lição do item 33 da seção 6 (validação de que não se tem certeza serve de
--   aviso, nunca de tranca, ainda mais quando guarda a porta de entrada).
--
--   "Outros" é o mínimo pra regra obrigatória ser sempre cumprível: quem não
--   souber onde encaixar um lançamento escolhe "Outros" em vez de ficar
--   travado. As categorias de verdade (Aluguel, Sucata, Mercado...) continuam
--   sendo criadas por quem usa, em Configurações → Categorias de caixa.
--
-- Uma para cada tipo, porque `categorias_caixa` separa entrada de saída e o
-- formulário só oferece as do tipo escolhido — uma "Outros" só de saída
-- deixaria a entrada travada do mesmo jeito.
--
-- NÃO torna a coluna `caixa_movimentos.categoria_id` NOT NULL, de propósito:
-- os lançamentos AUTOMÁTICOS legitimamente não têm categoria (o faturamento
-- de uma OS entra no caixa sem categoria nenhuma, e é assim que deve ser), e
-- o histórico já gravado sem categoria não pode ser recusado pelo banco. A
-- obrigatoriedade é do formulário manual, não da tabela.
--
-- Idempotente: seguro rodar de novo (a tabela tem `unique (nome, tipo)`, e o
-- `on conflict` abaixo só ignora a linha que já existir).

insert into categorias_caixa (nome, tipo)
values ('Outros', 'entrada'),
       ('Outros', 'saida')
on conflict (nome, tipo) do nothing;
