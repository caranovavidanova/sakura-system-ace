-- Sakura System — AutoCenter Edition
-- Migration 0047: coluna codigo_cnae em configuracoes_fiscais_loja — só usada
-- na emissão de NFS-e. Descoberta testando a emissão de verdade em produção:
-- Araraquara rejeitou a nota com "Preencher a tag cnae e envie novamente" —
-- campo `codigo_cnae` (documentado pela Focus NFe como obrigatório pra NFS-e)
-- que o Sakura System ainda não pedia nem mandava. Vem do Cartão CNPJ da
-- empresa ("Atividade econômica principal"). Idempotente: seguro rodar de novo.

alter table configuracoes_fiscais_loja
  add column if not exists codigo_cnae text;
