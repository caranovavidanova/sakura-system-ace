-- Sakura System — AutoCenter Edition
-- Migration 0035: adiciona custo (ex: mão de obra) ao catálogo de serviços,
-- mesmo padrão já usado em `pecas.preco_custo`. Sem isso, a aba
-- Lucratividade (Relações) calculava a margem de peça certinha, mas
-- considerava o custo de todo item de serviço como zero — subestimando o
-- custo real da loja.
-- Idempotente: seguro rodar de novo.

alter table servicos add column if not exists custo numeric;
