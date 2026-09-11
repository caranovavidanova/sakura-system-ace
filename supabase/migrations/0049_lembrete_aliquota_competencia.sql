-- Sakura System — AutoCenter Edition
-- Migration 0049: lembrete da alíquota da competência (NFS-e).
--
-- Toda primeira NFS-e do mês é recusada pela prefeitura enquanto a alíquota
-- daquela competência não for cadastrada no portal dela ("Por gentileza,
-- conclua o cadastro de todas as alíquotas referentes à competência
-- vigente"). É tarefa recorrente do lojista, não do sistema — e já custou uma
-- manhã de trabalho (PROJETO_STATUS.md, seção 8, item 1). As duas colunas
-- abaixo deixam o sistema avisar ANTES de a nota ser recusada:
--
--   competencia_aliquota_confirmada — o mês (sempre no dia 1º, igual à
--   competência da nota fiscal) cuja alíquota já foi cadastrada no portal.
--   Enquanto for diferente do mês corrente, o Início mostra o aviso. É
--   preenchida pelo botão "Já cadastrei" e, sozinha, por toda NFS-e que a
--   prefeitura autorizar no mês (se autorizou, a alíquota está lá).
--
--   aliquota_passo_a_passo — o caminho dentro do portal, em texto editável,
--   porque isso muda de município pra município. Em branco, o app usa o
--   passo a passo de Araraquara (portal Giap) que está no código.
--
-- Idempotente: seguro rodar de novo.

alter table configuracoes_fiscais_loja
  add column if not exists competencia_aliquota_confirmada date,
  add column if not exists aliquota_passo_a_passo text;
