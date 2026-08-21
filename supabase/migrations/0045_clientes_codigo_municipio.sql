-- Sakura System — AutoCenter Edition
-- Migration 0045: coluna codigo_municipio (IBGE) em clientes, só usada na
-- emissão de NFS-e (identifica o município do tomador do serviço). Antes
-- disso o operador precisava digitar esse código manualmente toda vez que
-- emitia uma NFS-e — agora é preenchido sozinho junto com o resto do
-- endereço, quando o CEP é buscado (o ViaCEP já devolve o código IBGE de
-- graça, ver lib/viaCep.ts), e fica salvo no cadastro do cliente pra não
-- precisar digitar de novo nas próximas emissões pra esse mesmo cliente.
-- Idempotente: seguro rodar de novo.

alter table clientes
  add column if not exists codigo_municipio text;
