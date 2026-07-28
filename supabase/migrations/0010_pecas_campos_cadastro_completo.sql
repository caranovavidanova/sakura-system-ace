-- Sakura System — AutoCenter Edition
-- Migration 0010: campos novos no cadastro de produto (código de barras,
-- marca, modelo, aplicação e os campos fiscais C.E.S.T. e origem da
-- mercadoria). Idempotente: seguro rodar de novo.

alter table pecas
  add column if not exists codigo_barras text,
  add column if not exists marca text,
  add column if not exists modelo text,
  add column if not exists aplicacao text,
  add column if not exists cest text,
  add column if not exists origem text;
