# O que o Sakura System oferece — levantamento

> Rascunho de trabalho (25/09/2026). É a **matéria-prima** da apresentação em slides que o pai
> dela vai usar com os amigos donos de autocenter. Está escrito do ponto de vista do dono da loja:
> o que muda no dia a dia dele.
>
> **Regras da apresentação, decididas por ela**: formal, em slides, **sem preço**, **sem citar a
> Pneus Amigão pelo nome** e **sem citar o "Importar por foto"**.

**Legenda**

- ✅ já usado de verdade na Pneus Amigão
- 🆕 pronto no sistema, mas **ainda não usado na loja** — bom testar antes de mostrar pra alguém
- ⚠️ tem um porém, explicado na própria linha

## Em uma frase

Um programa só pra loja inteira (ordem de serviço, estoque, caixa, contas e nota fiscal), feito
pra quem não entende de computador, e que nasceu no balcão de uma borracharia de verdade em
Araraquara.

## 1. No balcão: a ordem de serviço

- ✅ Abre a OS escolhendo o cliente e o carro. Cada OS ganha número próprio (OS 1, 2, 3...).
- ✅ Peça e serviço na mesma OS, com quantidade, preço, desconto e o técnico que fez cada item.
- ✅ A peça lançada na OS sai do estoque sozinha.
- ✅ Mostra o total de cada item e o **lucro de cada OS** na hora.
- ✅ Etapas simples: em andamento → concluída → faturada. Vira "finalizada" quando todas as notas
  fiscais daquela OS já saíram.
- ✅ Dá pra corrigir um item lançado errado (ex: alinhamento lançado a R$120 que era R$60), e o
  estoque se acerta sozinho.
- ✅ Depois de faturada, a OS trava. Assim o caixa não fica diferente do que o cliente pagou.
- ✅ Documento de garantia pro cliente assinar, com os dados da loja, do carro e dos itens.
- 🆕 Cliente novo ou carro novo se cadastra **sem sair da OS**, por um botão no próprio campo.
- 🆕 Cliente com um carro só: o carro já vem preenchido. Mostra o KM da última visita e avisa se o
  KM digitado for menor (quase sempre é um dígito faltando).
- 🆕 Ao lançar a peça, mostra quanto tem dela no estoque e avisa se ela está sem preço de custo.
- 🆕 Botão **"Avisar"**: abre o WhatsApp do cliente com "seu carro está pronto" já escrito.
- 🆕 Rascunho automático: se o programa fechar no meio, ao reabrir ele oferece recuperar o que
  estava digitado.

## 2. Cobrar e receber

- ✅ Divide o pagamento em mais de uma forma (metade Pix, metade cartão).
- ✅ Parcela só a parte do cartão, com os juros que a loja configurar, igual à maquininha.
- ✅ Pode faturar como "a receber depois": vira conta a receber, e só entra no caixa quando o
  cliente pagar.
- 🆕 Botão **"Cobrar"**: abre o WhatsApp do cliente com a cobrança já escrita (valor e
  vencimento), e anota que ele foi cobrado naquele dia.
- 🆕 Os textos das mensagens de WhatsApp são editáveis pela própria loja.

## 3. Caixa e contas

- ✅ Caixa do dia: tudo que entrou e saiu, separado por forma de pagamento.
- ✅ **Lucro do dia de verdade**: desconta o custo da peça, o custo do serviço e as despesas do dia.
- ✅ Contas a pagar com vencimento. Conta mensal (aluguel, luz) se recria sozinha depois de paga, e
  dá pra dizer até quando ela se repete.
- ✅ Pagar uma conta lança a saída no caixa sozinho. Se foi engano, dá pra desfazer.
- ✅ Contas a receber: quem ficou devendo, quanto e até quando.
- 🆕 Toda despesa tem categoria (aluguel, fornecedor, sucata...), pra o relatório mostrar pra onde o
  dinheiro está indo. Também dá pra organizar de uma vez as despesas antigas que ficaram sem
  categoria.

## 4. Estoque

- ✅ Cadastro de peça com custo, preço de venda e margem, que se calculam entre si.
- ✅ Extrato de cada peça: tudo que entrou e saiu, com o motivo. É ali que se descobre de onde
  veio um saldo estranho.
- ✅ Inventário: conta o que tem na prateleira, o sistema compara e acerta a diferença.
- ✅ Mais de um depósito (ex: loja e fundos), se precisar.
- ✅ Relatórios: dinheiro parado em peça, saldo negativo, peça parada há muito tempo.
- 🆕 Estoque mínimo por peça e o filtro **"Precisa comprar"**.
- 🆕 Busca que aceita **leitor de código de barras**: bipou, abriu a peça.
- 🆕 Campos próprios de pneu: medida, índice de carga/velocidade e DOT.
- 🆕 Os campos fiscais da peça (NCM, CSOSN...) têm um "?" explicando de onde tirar cada valor.
- ⛔ "Importar por foto/PDF" **desligado em 25/09/2026**, a pedido dela, até ela decidir o que
  fazer com ele. **Não citar em material de apresentação.**

## 5. Compras e fornecedores

- ✅ Cadastro de fornecedor.
- ✅ Pedido de compra com número. O recebimento pode ser inteiro ou em partes, e já dá entrada no
  estoque.
- ✅ **Histórico de preço**: ao pedir uma peça, mostra quanto cada fornecedor cobrou nas últimas
  compras, do mais barato pro mais caro.
- ✅ Importa o arquivo XML da nota do fornecedor: acha o fornecedor, casa as peças e dá entrada no
  estoque de uma vez.
- 🆕 Botão **"Enviar"**: manda o pedido pro fornecedor pelo WhatsApp, com a lista de itens.

## 6. Nota fiscal

- ✅ **NFC-e (peça) e NFS-e (serviço) emitidas de dentro da OS**, em produção, na Pneus Amigão.
- ✅ O sistema sabe de qual nota cada OS precisa (só peça, só serviço ou os dois) e mostra só o
  botão certo.
- ✅ Espera a autorização e já mostra o PDF pra imprimir ou baixar.
- ✅ Cancelamento pelo próprio sistema, com justificativa.
- ✅ Arquivo de todas as notas por mês. Baixa os XMLs do mês inteiro num arquivo só, do jeito que
  a contabilidade pede.
- ✅ Guarda também as notas emitidas fora do sistema.
- 🆕 Nota no CNPJ de cliente empresa. Está pronto e testado, mas ainda não saiu nenhuma venda de
  verdade pra empresa.
- 🆕 **"Ver DANFE"**: reabre o PDF de uma nota antiga quando o cliente pede de novo.
- 🆕 Antes de emitir, avisa quando alguma peça está com o código fiscal errado, dizendo **o nome
  da peça** (a SEFAZ só diz "item 1").
- 🆕 Aviso no começo de todo mês pra cadastrar a alíquota na prefeitura antes da primeira nota de
  serviço (Araraquara exige isso todo mês).
- ⚠️ Pra emitir nota, **cada loja precisa de certificado digital, credenciamento na SEFAZ e
  cadastro na prefeitura**. Isso leva dias e passa pela contabilidade da loja. O resto do sistema
  funciona desde o primeiro dia.

## 7. Equipe

- ✅ Cada funcionário entra com o próprio usuário e senha, e o dono escolhe o que cada um vê.
- ✅ Senha esquecida: o dono gera uma senha temporária na hora, sem depender de e-mail.
- ✅ Ficha completa de funcionário: documentos, admissão, salário e família.
- ✅ **Comissões**: quanto cada um vendeu, quanto de lucro gerou e quanto tem a receber, separando
  quem vendeu de quem executou. A tela avisa quando o número merece desconfiança (peça sem custo,
  OS que o cliente ainda não pagou).
- 🆕 Salário e documentos protegidos de verdade: só quem tem permissão enxerga, nem mexendo por
  fora do programa.

## 8. Pro dono: enxergar o negócio

- ✅ Tela de início com vendas, lucro e ticket médio do mês. O dono escolhe quais cartões aparecem.
- 🆕 Cada cartão compara com o mesmo período do mês passado ("↑ 12%"), mostra prejuízo em vermelho
  e tem um "?" explicando o número.
- 🆕 Contas a pagar dos **próximos 15 dias**, já contando as atrasadas.
- ✅ Calendário com feriados, aniversários de clientes e contas vencendo.
- ✅ Carros no pátio e OS abertas. 🆕 Com "há quantos dias", em amarelo a partir de 3 dias.
- ✅ Gráficos de vendas, custos e lucro por dia, semana, mês e ano.
- ✅ Lucratividade por peça e por serviço: o que vende muito mas dá pouco lucro.
- ✅ Garantias em vigor: cada peça vendida com garantia, com cliente, placa e data de vencimento.
- ✅ Auditoria: quem mudou ou apagou o quê, e quando. 🆕 Agora inclui preço de item de OS.
- ✅ Mais de uma loja no mesmo sistema, com clientes e peças em comum e caixa, estoque e OS
  separados por loja.

## 9. Fácil de usar

- ✅ Feito pra usar só no teclado: Enter pula pro próximo campo.
- ✅ Endereço preenchido pelo CEP.
- ✅ Número não muda sozinho por um toque na seta do teclado (já aconteceu no estoque).
- ✅ Visual moderno, diferente dos sistemas antigos cheios de tela cinza e botão pequeno.

## 10. O que vem junto na mensalidade (serviço, não tela)

- ✅ Instalação e configuração feitas por ela.
- ✅ Atualização automática: fechou e abriu, já está na versão nova.
- 🆕 Versão nova roda primeiro na loja do pai dela, e só depois chega nas outras.
- ✅ Banco de dados na nuvem, **só daquela empresa** (não mistura com outras lojas).
- ✅ Cópia de segurança todo dia, cifrada, guardada em dois lugares diferentes. Ela já abriu uma
  cópia pra conferir.
- ✅ Quantos computadores a loja quiser, sem custo por máquina.
- ✅ O dono não cria conta em serviço nenhum: está tudo dentro da assinatura.
- ✅ Suporte direto com ela, sem central de atendimento.
- 🆕 Tela de Diagnóstico: quando algo dá errado, o funcionário manda um resumo pelo WhatsApp (sem
  senha nem chave dentro).

## 11. Provas que dá pra citar

- Em uso diário na Pneus Amigão, em Araraquara, desde agosto de 2026.
- Nota fiscal de peça e de serviço emitidas de verdade pelo sistema.
- Cada função nasceu de um problema real de balcão, não de uma lista de recursos.

## 12. O que o sistema NÃO faz (melhor o pai saber antes que perguntem)

- Só roda em **Windows**. Não tem versão de celular nem de Mac.
- Precisa de **internet**.
- Não conversa com a **maquininha de cartão**: o valor é digitado.
- Não traz os dados do sistema antigo sozinho. Depende do formato que o sistema antigo consegue
  exportar.
- Não guarda **foto da peça**.
- Nota fiscal tem a burocracia de dias por loja (item 6).
- A nota de serviço só foi feita e testada na prefeitura de **Araraquara**. Loja de outra cidade
  precisa conferir como é a prefeitura de lá.
- Na instalação, o Windows mostra "editor desconhecido". É normal: basta clicar em "Mais
  informações" e depois "Executar assim mesmo".

---

**Lembrete que não vai pro texto**: antes da primeira venda pra loja de fora da família, falta o
contrato com a parte de proteção de dados (`ANTES-DA-PRIMEIRA-VENDA.md`, na raiz do repositório).
