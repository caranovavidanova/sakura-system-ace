-- Sakura System — AutoCenter Edition
-- ============================================================================
-- Script de USO ÚNICO — não é migration, não faz parte da sequência de
-- supabase/migrations/. Remove a Ordem de Serviço usada pra testar a emissão
-- de NFS-e em PRODUÇÃO (Focus NFe) na loja Pneus Amigão, revertendo tudo que
-- ela gerou, na ordem certa pra não esbarrar em chave estrangeira:
--   1. estorna a baixa de estoque de peça usada, se teve item de peça na OS
--      (apaga o movimento de saída "uso_em_os" — a peça volta a ter a
--      quantidade de antes);
--   2. remove o lançamento de Caixa gerado ao faturar;
--   3. remove pendência de Contas a Receber vinculada (só existe se o
--      faturamento foi "a receber depois" em vez de "recebido agora");
--   4. remove o arquivo de nota fiscal salvo no Sakura System;
--   5. só então apaga a OS em si (os itens da OS somem sozinhos, em cascata).
--
-- IMPORTANTE — ordem das coisas: cancele a NFS-e direto no painel da Focus
-- NFe (focusnfe.com.br) ANTES de rodar este script. Isso aqui só limpa o
-- registro dentro do Sakura System — não cancela nada na prefeitura.
--
-- TROQUE o número 999 (aparece em todos os passos abaixo) pelo número real
-- da OS de teste antes de rodar. CONFIRA sempre com o PASSO 1 (preview)
-- antes do PASSO 2 (os deletes) — confirme que é a OS certa, não uma OS de
-- cliente real.
-- ============================================================================

-- PASSO 1 — PREVIEW: rode isto sozinho e confira que é a OS certa
select os.id, os.numero, os.status, c.nome as cliente, os.data_fechamento
from ordens_servico os
join clientes c on c.id = os.cliente_id
where os.numero = 999; -- <-- troque 999 pelo número real da OS de teste

-- PASSO 2 — depois de conferir a linha acima, rode o bloco inteiro abaixo
-- (troque 999 em todo lugar que aparecer):

delete from estoque_movimentos
where motivo = 'uso_em_os'
  and referencia = 'OS 999'; -- <-- troque aqui também

delete from caixa_movimentos
where ordem_servico_id in (
  select id from ordens_servico where numero = 999
);

delete from contas_receber
where ordem_servico_id in (
  select id from ordens_servico where numero = 999
);

delete from notas_fiscais_arquivos
where ordem_servico_id in (
  select id from ordens_servico where numero = 999
);

delete from ordens_servico
where numero = 999;
