-- Sakura System — AutoCenter Edition
-- Migration 0014: remove o card "Prazos" da tela de Ordem de Serviço a
-- pedido do usuário — não vingou. Idempotente: seguro rodar de novo.

alter table ordens_servico
  drop column if exists previsao_entrega,
  drop column if exists data_retorno;
