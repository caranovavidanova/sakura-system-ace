-- Sakura System — AutoCenter Edition
-- Migration 0009: data de nascimento do cliente (usada no calendário do Início,
-- pra marcar aniversário de cliente no mês). Idempotente: seguro rodar de novo.

alter table clientes
  add column if not exists data_nascimento date;
