-- Sakura System — AutoCenter Edition
-- Migration 0046: coluna focus_nfe_ref em notas_fiscais_arquivos — guarda a
-- referência (`ref`) que a Focus NFe usa pra identificar a nota, gerada na
-- hora da emissão automática (ver montarRefNota() em src/lib/focusNfe.ts).
-- Sem isso salvo, não tinha como cancelar uma nota emitida automaticamente
-- depois — cancelarNFCe()/cancelarNFSe() (lib/focusNfe.ts) exigem esse `ref`,
-- que nunca foi persistido em lugar nenhum antes desta migration. Só
-- preenchida pra notas com origem="automatica"; upload manual de XML não usa.
-- Idempotente: seguro rodar de novo.

alter table notas_fiscais_arquivos
  add column if not exists focus_nfe_ref text;
