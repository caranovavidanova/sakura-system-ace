-- Sakura System — AutoCenter Edition
-- Migration 0064: venda de balcão (item FN-09 do guia de melhorias).
--
-- O problema. Tudo passava por ordem de serviço, e uma OS exige cliente e
-- nasce "em andamento". Vender um pneu, uma bateria ou um par de palhetas pra
-- quem não vai deixar o carro obrigava a abrir uma OS de mentira (poluindo a
-- lista de OS e o ticket médio), lançar direto no caixa (sem baixar estoque e
-- sem NFC-e) ou não registrar.
--
-- O caminho escolhido NÃO é um módulo de PDV à parte: a venda de balcão é uma
-- ordem de serviço marcada com `tipo = 'venda_balcao'`. Assim, baixa de
-- estoque, caixa, contas a receber, NFC-e, garantia e comissão continuam
-- funcionando exatamente como já funcionam — nada disso foi reescrito. O que
-- muda é só o que a tela faz com a marca: a venda tem uma tela própria, curta,
-- e aparece separada das OS na lista e fora do ticket médio.
--
-- Duas decisões que valem saber:
--
--   • O NÚMERO é o mesmo contador das OS (o gatilho da migration 0037 não
--     muda). Uma venda pode ser a "Venda 17" entre a "OS 16" e a "OS 18".
--     A alternativa — um contador próprio — deixaria dois documentos com o
--     mesmo número na mesma loja ("OS 3" e "Venda 3"), e esse número aparece
--     sozinho em lugares que não dizem o tipo (movimentação de estoque,
--     referência de nota, conversa com a contabilidade). Número único vale
--     mais que número sem pulo.
--
--   • Cliente que não se identifica vira o cliente fixo "Consumidor" (decisão
--     dela, 26/09/2026, entre "Consumidor fixo" e "cliente opcional"). Tornar
--     `cliente_id` opcional mexeria em umas 20 telas e quebraria os
--     computadores ainda na versão anterior ao abrir uma venda sem cliente.
--     Com o Consumidor, a regra em uso não muda. O programa esconde esse
--     cliente do cadastro e das listas de escolha, e NUNCA manda documento
--     dele na NFC-e — mesmo que alguém grave um CPF nele pela API.
--
-- Rodar antes ou depois da versão nova do programa: tanto faz pra quem já
-- está usando. A versão anterior continua funcionando (só mostra a venda como
-- se fosse uma OS); a versão nova sem esta migration funciona em tudo, menos
-- em registrar uma venda de balcão (e a faixa de "banco desatualizado" avisa).
--
-- Idempotente: seguro rodar de novo.

-- ===================================================================
-- 1. A marca: OS ou venda de balcão
-- ===================================================================

alter table ordens_servico
  add column if not exists tipo text not null default 'os';

alter table ordens_servico drop constraint if exists ck_ordens_servico_tipo;
alter table ordens_servico
  add constraint ck_ordens_servico_tipo check (tipo in ('os', 'venda_balcao'));

comment on column ordens_servico.tipo is
  '''os'' = ordem de serviço de sempre; ''venda_balcao'' = venda de peça no '
  'balcão, sem veículo, que nasce concluída e é faturada na mesma tela. As '
  'duas usam o mesmo contador de número por loja.';

-- ===================================================================
-- 2. O cliente "Consumidor"
-- ===================================================================
-- UUID fixo, no mesmo espírito da "Loja 1" (migration 0031): é assim que o
-- programa sabe qual é ele sem precisar procurar pelo nome. `clientes` é
-- compartilhada entre as lojas da empresa, então é um Consumidor só.

insert into clientes (id, nome, tipo_pessoa)
values ('00000000-0000-0000-0000-00000000c000', 'Consumidor', 'fisica')
on conflict (id) do nothing;

insert into schema_versao (versao) values (64) on conflict do nothing;
