# Comparativo com o Anexar (concorrente) — o que temos e o que falta

> Feito em 29/09/2026 a partir de 8 prints do site do Anexar que ela mandou (a página de venda do
> módulo de auto center deles). **É uma lista pra consulta futura, não um plano aprovado**: nada
> daqui é pra construir antes de ela pedir. Quando um item virar trabalho, ele ganha código no
> `MELHORIAS.md` (onde já existe um `FN-`, está indicado).

Legenda: ✅ temos · 🟡 temos em parte · ❌ não temos

## Resumo

| Grupo (como está no site deles) | ✅ | 🟡 | ❌ |
|---|---|---|---|
| Gestão Operacional (10) | 4 | 3 | 3 |
| Outros operacionais (9) | 2 | 0 | 7 |
| Controle Financeiro (13) | 2 | 4 | 7 |
| Análise de Resultados (8) | 1 | 3 | 4 |
| Documentos Fiscais (7) | 3 | 0 | 4 |
| App Auto Center (9) | 0 | 0 | 9 (o app inteiro) |
| **Total (56)** | **12** | **10** | **34** |

A conta engana um pouco: boa parte dos ❌ é coisa que uma borracharia pequena quase não usa
(MDF-e, expedição, cheque, SPED). O que mais pesa na venda pra outras lojas: **orçamento**,
**checklist com fotos**, **agenda**, **devolução**, **DRE**, **curva ABC** e o **app de celular**.
E temos coisas que eles não anunciam: WhatsApp pronto em toda parte, garantia impressa, fechamento
de caixa com quebra/sobra, comissão com recibo congelado, cotação de peça por fornecedor e
importação da nota do fornecedor por XML.

## Gestão Operacional

| Recurso deles | Nós | Onde / o que falta |
|---|---|---|
| Ordem de Serviço | ✅ | Ordens de Serviço |
| Análise de veículos | 🟡 | Ficha do veículo (histórico por placa) existe. Falta o **relatório por marca/modelo/aplicação** (ex: "que modelo mais aparece", "que peça sai mais pro Onix") |
| Checklist de atendimento | ❌ | `FN-02` (checklist de entrada com fotos) |
| Orçamento rápido (PDV) | 🟡 | A Venda de balcão é o PDV. Falta o **orçamento rápido**: montar o preço, imprimir/mandar e não baixar estoque |
| Controle de estoque | ✅ | Estoque (saldo, mínimo, "precisa comprar", leitor de código de barras) |
| Inventário | ✅ | Estoque → Contagem (gera o ajuste sozinho) |
| Tabelas de preço | ❌ | Hoje cada peça tem **um** preço. Falta preço por tipo de cliente (varejo/frota/revenda) ou por forma de pagamento |
| Orçamentos | ❌ | `FN-01` (orçamento separado da OS, com aprovação do cliente) |
| Consultas sintéticas | 🟡 | Relatórios de estoque e Relações dão os totais; faltam consultas prontas por período/cliente/peça |
| Centro de armazenamento de estoque | ✅ | Depósitos (Configurações → Depósitos) |

## Outros operacionais (a faixa de botões sem título)

| Recurso deles | Nós | Onde / o que falta |
|---|---|---|
| Gerenciamento de boletos | ❌ | Emitir boleto e baixar quando pago precisa de banco/intermediário (ex: Asaas, Inter). Serve junto com Contas a Receber |
| Devolução de produtos | ❌ | `FN-08` (devolução e troca: volta ao estoque, estorno no caixa, motivo) |
| Controle de cadastros de usuários | ✅ | Configurações → Operadores, com permissão por módulo protegida pelo banco |
| Preventiva de equipamentos | ❌ | Lembrete de manutenção dos equipamentos da loja (elevador, compressor, balanceadora, calibrador). Parecido com o `FN-06`, que é o lembrete de revisão **do carro do cliente** |
| Expedição | ❌ | Separar/conferir mercadoria pra entrega. Pouco uso em borracharia |
| Reserva de produtos | ❌ | Hoje a peça só sai do estoque quando entra na OS. Falta "segurar" uma peça pro cliente sem vender |
| Etiquetas de produtos | ❌ | Imprimir etiqueta com código de barras e preço (junto com a impressora térmica, `FN-10`) |
| Agenda de compromissos | ❌ | `FN-05`. O calendário do Início só mostra feriado, aniversário e conta a vencer |
| Ordem de compra | ✅ | Fornecedores → Pedidos de compra (com recebimento parcial) |

## Controle Financeiro

| Recurso deles | Nós | Onde / o que falta |
|---|---|---|
| Centro de custo | ❌ | Separar despesa por setor/loja/atividade (ex: "pneus" x "mecânica") |
| Controle de contas e caixas | 🟡 | Um Caixa por loja. Falta **mais de uma conta** (gaveta, banco, conta da maquininha) e transferência entre elas |
| Contas a pagar e receber | ✅ | Os dois módulos, com recorrência e desfazer |
| Renegociações | ❌ | Refazer uma conta a receber atrasada em novas parcelas |
| Convênio | ❌ | Empresa/frota que abastece a conta no mês e paga tudo junto (fatura mensal por cliente) |
| DRE e DRO | ❌ | Relações tem vendas × custo × lucro. Falta o **DRE** de verdade (receita → custo → despesas por categoria → resultado do mês) |
| Controle de cartões | 🟡 | Parcelas e juros do cartão na venda. Falta **taxa da maquininha** e "quando cai na conta" (recebíveis) |
| Controle de cheque | ❌ | Cadastro de cheque recebido, data pra depositar, devolvido |
| Plano de contas | 🟡 | As categorias do Caixa são um plano simples (um nível). Falta hierarquia (grupo → subgrupo), que é o que alimenta o DRE |
| Gerenciamento de comissões | ✅ | Funcionários → Comissões (com pagamento registrado e recibo) |
| Controle de vales | ❌ | Adiantamento a funcionário, descontado depois na comissão/salário |
| Limite de crédito | ❌ | Teto de "a receber depois" por cliente, com aviso (nunca trava — item 33 de `docs/licoes.md`) |
| Histórico financeiro de cliente | 🟡 | Dá pra ver as OS do cliente e a ficha do veículo. Falta uma tela só com tudo que ele comprou, pagou e deve |

## Análise de Resultados

| Recurso deles | Nós | Onde / o que falta |
|---|---|---|
| Centenas de modelos de relatórios | 🟡 | Temos poucos relatórios, mas certeiros (Relações, estoque, comissões, lucratividade) |
| Curva ABC | ❌ | Classificar peças/serviços/clientes em A/B/C pelo quanto vendem. A aba Lucratividade já tem os números, falta a classificação |
| Consultas analíticas | 🟡 | Lucratividade por item; falta filtro livre (por cliente, marca, categoria, técnico) |
| Gráfico de vendas | ✅ | Relações → Gráficos (diário a anual, com comparação) |
| Fluxo de caixa | 🟡 | O Caixa mostra o que **já** entrou/saiu. Falta o **projetado**: somar contas a pagar e a receber dos próximos dias/semanas |
| Envio de SMS | ❌ | Temos WhatsApp em vez disso (mais usado no Brasil). SMS não parece valer |
| Cadastro e controle de meta | ❌ | `FN-12` (metas e comparação) |
| Envio de relatórios pelo WhatsApp | ❌ | Ex: resumo do dia/mês mandado pro dono. Hoje o WhatsApp só é usado com cliente |

## Documentos Fiscais

| Recurso deles | Nós | Onde / o que falta |
|---|---|---|
| Notas de entrada | ✅ | Fornecedores → Importar XML da nota do fornecedor |
| NFS-e | ✅ | Emissão automática via Focus NFe, em produção |
| NF-e (modelo 55) | ❌ | Só emitimos NFC-e. A NF-e é pra vender pra **empresa** que precisa de nota "de verdade" (ex: frota) e pra devolução ao fornecedor. A Focus NFe já faz, falta a tela |
| NFC-e | ✅ | Emissão automática via Focus NFe, em produção |
| MDF-e | ❌ | Manifesto de transporte de carga. Só pra quem transporta mercadoria entre cidades: não se aplica a borracharia |
| Manifestação do destinatário (MD-e) | ❌ | Puxar da SEFAZ as notas emitidas **contra o CNPJ da loja** (compras) sem esperar o fornecedor mandar o XML. Casa bem com a importação de XML que já existe. A Focus NFe oferece |
| SPED Fiscal/Contábil | ❌ | Arquivo mensal pro governo. Loja do Simples Nacional em geral não entrega SPED Fiscal, e quem gera é a contabilidade. Mais perto de nós está o `FN-13` (relatório mensal pra contabilidade) |

## App Auto Center (celular/tablet)

**Não temos nada disso**: o Sakura é só o programa de Windows. O app deles é uma "extensão do
sistema" pro mecânico usar no pátio:

| Recurso do app | Existe no programa de Windows? |
|---|---|
| Gestão da OS | ✅ |
| Inserção de produtos e serviços na OS | ✅ |
| Troca de status da OS | ✅ |
| Lançamento de horários dos mecânicos | ❌ nem no Windows (quanto tempo cada mecânico gastou em cada OS) |
| Cadastro de clientes | ✅ |
| Cadastro de veículos | ✅ |
| Assinatura de autorizações | ❌ nem no Windows (cliente assina no tablet autorizando o serviço/orçamento) |
| Fotos e arquivos | ❌ nem no Windows (foto do carro/peça anexada na OS) |
| Checklist de atendimento | ❌ nem no Windows (`FN-02`) |

Como o banco é o Supabase, um app de celular conseguiria ler e gravar os mesmos dados sem
servidor novo. Mas é um **projeto novo inteiro** (outra tecnologia, publicar em loja de apps ou
versão web pro celular), então é **decisão estrutural**: apresentar opções e esperar ela.
Assinatura, fotos e checklist deveriam nascer primeiro no Windows (`FN-01`/`FN-02`) e o app vir
depois, reaproveitando.

## Sugestão de ordem (se e quando ela quiser atacar)

Não é decisão, é ponto de partida pra conversa:

1. **Orçamento** (`FN-01`) + **checklist com fotos e assinatura** (`FN-02`): é o que o cliente da
   oficina vê, e o que mais aparece no site deles.
2. **Devolução** (`FN-08`) e **agenda** (`FN-05`): buracos do dia a dia.
3. **Financeiro "de dono"**: fluxo de caixa projetado, DRE com plano de contas em grupos, curva
   ABC, taxa da maquininha, limite de crédito, vales. Quase tudo com dados que já existem.
4. **Tabela de preço**, **convênio**, **NF-e modelo 55** e **MD-e**: quando aparecer loja com
   frota/empresa como cliente.
5. **App de celular**: depois do 1, como projeto próprio.
6. Provavelmente nunca: MDF-e, SPED (é da contabilidade), SMS (WhatsApp cobre), expedição, cheque
   (só se uma loja pedir).
