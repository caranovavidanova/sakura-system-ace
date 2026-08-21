-- Sakura System — AutoCenter Edition
-- Migration 0044: campos extras em configuracoes_fiscais_loja pra emissão de
-- NFS-e (serviço) via Focus NFe — código IBGE do município da loja (exigido
-- pela API como "prestador.codigo_municipio"), código do serviço na lista da
-- LC 116/2003 (item_lista_servico — "14.01", usado como padrão pro app: cobre
-- "manutenção e conservação de veículos", a atividade principal de um
-- autocenter/borracharia), alíquota do ISS e o código tributário do serviço
-- específico do município (varia de cidade pra cidade, opcional — só alguns
-- municípios exigem). Nenhum desses bloqueia a emissão de NFC-e (peças), que
-- não usa nenhum deles. Ver PROJETO_STATUS.md seção 8, item 1.
-- Idempotente: seguro rodar de novo.

alter table configuracoes_fiscais_loja
  add column if not exists codigo_municipio text,
  add column if not exists item_lista_servico text default '14.01',
  add column if not exists aliquota_iss numeric,
  add column if not exists codigo_tributario_municipio text;
