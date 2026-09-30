# Painel da equipe: manual

> Pra quem está construindo o painel, e pro Claude dessa pessoa. **Antes de tudo, a seção 0 do
> `PROJETO_STATUS.md`** ("Quem está trabalhando?"): ela manda mais que este arquivo. As decisões
> abaixo são da Sofia (29 e 30/09/2026). Mudar alguma delas é conversa com ela, não escolha de
> quem está programando.

## O que é, e aonde ele vai

Nas palavras da Sofia (30/09/2026): uma **interface de autogestão**, com um **design parecido com
o do Claude**. Por enquanto ela tem que fazer **toda a linha de produção que já decidimos**, com
**contador de tarefas** e o resto. As expansões serão o **financeiro da Sakura Corp, com DRE**.
Ou seja, **um sistema nosso**, que permita administrar a empresa toda, da forma mais automatizada
possível. E **ligado em tempo real ao GitHub**: tempo real é importante pra organização.

Na prática, hoje:
- O painel **lê o GitHub, não o substitui**: as tarefas são as issues deste repositório
  (`sakura-corp/sakura-system-ace`), e o que o painel mostra vem de lá.
- **Tempo real**: quando alguém pega, entrega ou fecha uma tarefa no GitHub, o painel de todo
  mundo muda sozinho, em segundos, sem recarregar a página.
- **Financeiro e DRE ficam pra depois**, e com um cuidado: dinheiro da empresa **não pode morar
  no GitHub**, que é público. Quando chegar a hora, o financeiro vai precisar de um banco próprio
  e privado; aí sim um Supabase faz sentido. Decidir com a Sofia quando chegar.
- O desenho já nasce preparado pra crescer: uma barra lateral com uma seção por assunto ("Levas"
  hoje; "Financeiro" aparece desativado, escrito "em breve").

**Tudo aqui é público**, porque o repositório é público: o código do painel, as issues, os PRs.
Tarefa, comentário e código nunca levam preço, dado de loja, nome de cliente ou senha.

## Como a equipe trabalha (é isso que o painel mostra)

- **Leva** é o pacote de trabalho do período, com **várias tarefas**, de várias pessoas. Cada
  leva tem uma etiqueta no GitHub: `leva-0`, `leva-1`, `leva-2`…
- **Tarefa** é uma issue com a etiqueta da leva. **Um dono** (o "responsável", *assignee*) e
  **um PR**, que fecha a issue quando entra (`Closes #N` na descrição do PR).
- **Estado de uma tarefa**:
  - **livre** = aberta e sem responsável;
  - **em andamento** = aberta, com responsável, ainda sem PR aberto;
  - **em revisão** = aberta, com um PR aberto que a fecha (`Closes #N`), esperando a Sofia;
  - **feita** = fechada.
- **Pegar tarefa**: a pessoa pega **uma livre** (ninguém distribui), **põe o nome dela antes de
  começar**, e segura **uma por vez**. Só pega outra depois que o PR da atual foi aberto.
- **Estimativa**: cada tarefa diz no texto quantas horas deve levar, numa linha
  `Estimativa: N h`. O trabalho da equipe é medido em horas por semana, não em dinheiro.
- **Fim da leva**: ela **congela**, todo mundo testa, o Claude da Sofia escreve o relatório, a
  Sofia aprova, e só então vem banco e "Liberar versão". **Bug de loja não espera a leva.**
- **As tarefas nascem nas conversas da Sofia com o Claude dela**, que cria as issues.

## Como começar uma tarefa

A pessoa abre o Claude dela e diz só o nome ou o número da tarefa (ex: *"quero fazer a tarefa
#12"*). A partir daí, o Claude:
1. **Confere quem é** (seção 0 do `PROJETO_STATUS.md`) e **lê a issue inteira** e este manual.
2. **Explica em português simples**, antes de mexer em qualquer coisa:
   - o que é a tarefa e pra que ela serve no painel;
   - o que o Claude vai fazer sozinho (o código);
   - o que a pessoa vai precisar fazer (instalar, testar, abrir o PR), e quanto tempo deve levar.
3. **Guia a pessoa a pôr o nome dela na tarefa** no GitHub, se ainda não pôs, passo a passo.
4. Programa. Sempre que a pessoa precisar fazer alguma coisa que não seja só esperar o código
   (rodar um comando, abrir o navegador, testar, clicar numa tela), o Claude **guia um passo por
   vez, com calma**: onde clicar, o que digitar, o que deve aparecer, e espera ela confirmar
   antes do próximo passo. Nada de despejar dez passos de uma vez.
5. No fim, confere o "Pronto quando" da tarefa com a pessoa, item por item, e guia a abertura do
   PR (com `Closes #N`) e o pedido de revisão da Sofia. **Não mescla.**

## Design (parecido com o do Claude)

Inspiração de estilo, não cópia: **nada de logotipo, nome, fonte proprietária ou ícone da
Anthropic ou do Claude**. O que se copia é o jeito: calmo, claro, muito espaço, tipografia boa.
- **Layout**: barra lateral fixa à esquerda (no celular vira uma barra no topo), conteúdo no meio
  com largura máxima de ~960 px, cartões com borda fina e cantos de 12 px, sem sombra forte, sem
  vidro nem neon (o visual do programa das lojas não vale aqui).
- **Fontes** (grátis, instaladas pelo npm, sem CDN): **Inter** na interface
  (`@fontsource-variable/inter`) e **Source Serif 4** nos títulos
  (`@fontsource-variable/source-serif-4`). Ícones: `lucide-react`.
- **Cores**: claro por padrão, escuro quando o computador estiver no modo escuro
  (`prefers-color-scheme`). Todas as combinações abaixo foram conferidas: passam no contraste
  WCAG AA (4,5:1 ou mais pra texto).

| Papel | Claro | Escuro |
|---|---|---|
| Fundo | `#FAF9F5` | `#1F1E1D` |
| Cartão / superfície | `#FFFFFF` | `#2A2927` |
| Borda | `#E6E3DA` | `#3A3936` |
| Texto | `#1F1E1D` | `#F2F0EA` |
| Texto secundário | `#6B6963` | `#A8A59C` |
| Destaque (rosa Sakura, escurecido pra ler bem) | `#B8237F` (texto branco em cima) | `#F07CC4` (texto `#1F1E1D` em cima) |

| Estado da tarefa | Claro (texto / fundo) | Escuro (texto / fundo) |
|---|---|---|
| Livre | `#5F5D57` / `#EFEDE6` | `#C9C6BD` / `#34332F` |
| Em andamento | `#A81F74` / `#FBE7F3` | `#F59BD2` / `#43243A` |
| Em revisão | `#7A4F00` / `#FBEFD9` | `#F2C46B` / `#3F3322` |
| Feita | `#2B6534` / `#E4F1E6` | `#8FD19C` / `#233A28` |

## Decisões técnicas (já tomadas)

- **Onde mora**: na pasta `painel/` deste repositório, como **projeto separado**, com
  `package.json` e `node_modules` próprios. O painel não importa nada de `src/` (o programa das
  lojas), e o programa não importa nada do painel.
  - O `tsconfig.json` da raiz já olha só `src` e `electron`.
  - O **primeiro PR do painel** acrescenta `painel/` aos `ignores` do `eslint.config.js` da raiz e
    confere que o CI da raiz continua verde. O painel não pode quebrar o CI do programa das lojas.
- **Tecnologia**: React + Vite + TypeScript, a mesma do programa das lojas.
- **Onde fica no ar**: na **Cloudflare**, no plano grátis. A página e a parte do login ficam no
  mesmo lugar (um Worker com os arquivos da página). A conta da Cloudflare é da Sofia: **quem
  mexe na configuração dela é a Sofia**.
  - A publicação sai **só da `main`**.
  - Se as prévias de PR forem ligadas um dia, elas **não recebem** o segredo do login. Código
    que ainda não foi revisado não pode ter acesso a ele.
- **Login pelo GitHub, já na 1ª versão**:
  - É feito por um **GitHub App da organização `sakura-corp`**, e não por um "OAuth App".
    Motivo: o GitHub App deixa limitar o que o login pode fazer (só as issues deste
    repositório), e o OAuth App daria acesso a todos os repositórios públicos da pessoa.
  - **Quem cria o GitHub App é a Sofia**, com passo a passo, quando a tarefa do login chegar.
  - O **segredo do app** (*client secret*) fica **só na Cloudflare**, nunca no repositório.
  - **Só entra quem for membro da organização `sakura-corp`**. O painel confere pela API do
    GitHub, com o token de quem está entrando.
  - O token da pessoa não vai pra lugar nenhum além do navegador dela e da API do GitHub, e
    nunca aparece em log.
- **Dados**: vêm da **API do GitHub**, com o token de quem está logado. **Sem banco próprio.**

## 1ª versão (leva 0)

1. **No ar na Cloudflare**, atualizando sozinho a cada mudança do painel na `main`.
2. **Login pelo GitHub**, só pra membros da `sakura-corp`.
3. **A leva atual**: o contador (livres, em andamento, em revisão, feitas, horas) e a lista das
   tarefas agrupadas por estado, com os dados de verdade das issues.
4. **Tempo real**: o painel de todo mundo muda sozinho quando uma tarefa muda no GitHub.

As 6 tarefas da leva 0, com o passo a passo de cada uma, ficam nas issues com a etiqueta `leva-0`.
A **leva 1** é a linha de produção completa (botão de pegar tarefa, fases da leva, horas por
pessoa, relatório e aprovação); depois vem o financeiro.

## Regras pra quem trabalha no painel (resumo da seção 0)

- Mexe **só no painel**: a pasta `painel/` e este arquivo. Se precisar mexer fora, avisa a
  Sofia antes.
- Branch → PR → **pede a revisão da Sofia** e para. **Nunca mescla.**
- Não publica, não libera, não mexe em banco, versão, tag, secret, cofre, ruleset nem
  configuração do repositório. Nem por um workflow novo.
- Não mexe no "Onde parou" do `PROJETO_STATUS.md`, que é da Sofia. O andamento vai na seção
  "Andamento" abaixo e na descrição do PR.
- Um PR por tarefa, com `Closes #N`.

## Como rodar no PC

*Ainda não existe código.* O primeiro PR do painel escreve aqui os comandos, que devem ser algo
como `cd painel`, `npm install`, `npm run dev`, e também o que precisa estar configurado pro
login funcionar no PC.

## Andamento

- **30/09/2026**: manual criado. Nenhuma linha de código do painel ainda. A leva 0 está sendo
  planejada pela Sofia com o Claude dela.
