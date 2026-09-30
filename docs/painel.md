# Painel da equipe: manual

> Pra quem está construindo o painel, e pro Claude dessa pessoa. **Antes de tudo, a seção 0 do
> `PROJETO_STATUS.md`** ("Quem está trabalhando?"): ela manda mais que este arquivo. As decisões
> abaixo são da Sofia (29 e 30/09/2026). Mudar alguma delas é conversa com ela, não escolha de
> quem está programando.

## O que é

Uma página web **interna da equipe da Sakura Corp**. A 1ª versão mostra as **tarefas da leva** e
**quem está com cada uma**. O painel **lê o GitHub, não o substitui**: as tarefas são as issues
deste repositório (`sakura-corp/sakura-system-ace`), e o que o painel mostra vem de lá.

**Tudo aqui é público**, porque o repositório é público: o código do painel, as issues, os PRs.
Tarefa, comentário e código nunca levam preço, dado de loja, nome de cliente ou senha.

## Como a equipe trabalha (é isso que o painel mostra)

- **Leva** é o pacote de trabalho do período, com **várias tarefas**, de várias pessoas. Cada
  leva tem uma etiqueta no GitHub: `leva-0`, `leva-1`, `leva-2`…
- **Tarefa** é uma issue com a etiqueta da leva. **Um dono** (o "responsável", *assignee*) e
  **um PR**, que fecha a issue quando entra (`Closes #N` na descrição do PR).
- **Estado de uma tarefa**:
  - **livre** = aberta e sem responsável;
  - **com fulano** = aberta, com responsável;
  - **feita** = fechada.
- **Pegar tarefa**: a pessoa pega **uma livre** (ninguém distribui), **põe o nome dela antes de
  começar**, e segura **uma por vez**. Só pega outra depois que o PR da atual foi aberto.
- **Estimativa**: cada tarefa diz no texto quantas horas deve levar, numa linha
  `Estimativa: N h`. O trabalho da equipe é medido em horas por semana, não em dinheiro.
- **Fim da leva**: ela **congela**, todo mundo testa, o Claude da Sofia escreve o relatório, a
  Sofia aprova, e só então vem banco e "Liberar versão". **Bug de loja não espera a leva.**
- **As tarefas nascem nas conversas da Sofia com o Claude dela**, que cria as issues.

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

1. **Login pelo GitHub**, só pra membros da `sakura-corp`.
2. **A lista das tarefas da leva atual**, com o estado de cada uma: livre / com fulano / feita.

As tarefas da leva 0, em pedaços pequenos (um PR cada), ficam nas issues com a etiqueta `leva-0`.

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
