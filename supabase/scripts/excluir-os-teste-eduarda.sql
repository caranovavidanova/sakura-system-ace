-- Sakura System — AutoCenter Edition
-- ============================================================================
-- Script de USO ÚNICO — não é migration, não faz parte da sequência de
-- supabase/migrations/. Remove as Ordens de Serviço de TESTE abertas na loja
-- de verdade (Pneus Amigão) pro cliente "Eduarda Cristina" (nome usado como
-- teste ao validar a emissão de NFC-e/NFS-e). Reverte tudo que aquelas OS
-- geraram, na ordem certa pra não esbarrar em chave estrangeira:
--   1. estorna a baixa de estoque das peças usadas (apaga o movimento de
--      saída "uso_em_os" — a peça volta a ter a quantidade de antes);
--   2. remove os lançamentos de Caixa gerados, se alguma chegou a ser
--      faturada;
--   3. remove pendências de Contas a Receber vinculadas;
--   4. remove os arquivos de nota fiscal (são de homologação, sem valor
--      fiscal — só referência de teste mesmo);
--   5. só então apaga as OS em si (os itens da OS somem sozinhos, em
--      cascata).
--
-- O cadastro do cliente "Eduarda Cristina" e o veículo dela NÃO são
-- apagados por este script — só as OS de teste. Se quiser remover o cliente
-- também, é pela tela normal de Clientes → Excluir.
--
-- CONFIRA antes de rodar: rode só o PASSO 1 (preview) primeiro e confira a
-- lista. Só rode o PASSO 2 (os deletes) se a lista bater com o que você
-- espera — nenhuma OS de cliente real misturada aí.
-- ============================================================================

-- PASSO 1 — PREVIEW: rode isto sozinho e confira a lista antes de continuar
select os.id, os.numero, os.status, os.data_abertura, os.data_fechamento
from ordens_servico os
join clientes c on c.id = os.cliente_id
where c.nome ilike '%Eduarda Cristina%';

-- PASSO 2 — depois de conferir a lista acima, rode o bloco inteiro abaixo:

delete from estoque_movimentos
where motivo = 'uso_em_os'
  and referencia in (
    select 'OS ' || os.numero
    from ordens_servico os
    join clientes c on c.id = os.cliente_id
    where c.nome ilike '%Eduarda Cristina%'
  );

delete from caixa_movimentos
where ordem_servico_id in (
  select os.id
  from ordens_servico os
  join clientes c on c.id = os.cliente_id
  where c.nome ilike '%Eduarda Cristina%'
);

delete from contas_receber
where ordem_servico_id in (
  select os.id
  from ordens_servico os
  join clientes c on c.id = os.cliente_id
  where c.nome ilike '%Eduarda Cristina%'
);

delete from notas_fiscais_arquivos
where ordem_servico_id in (
  select os.id
  from ordens_servico os
  join clientes c on c.id = os.cliente_id
  where c.nome ilike '%Eduarda Cristina%'
);

delete from ordens_servico
where id in (
  select os.id
  from ordens_servico os
  join clientes c on c.id = os.cliente_id
  where c.nome ilike '%Eduarda Cristina%'
);
