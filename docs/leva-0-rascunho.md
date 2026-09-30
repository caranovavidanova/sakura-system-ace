# Leva 0: RASCUNHO das 6 tarefas (ainda não viraram issue)

> **Arquivo temporário.** Esperando o "ok" da Sofia pra virar a etiqueta `leva-0` e 6 issues.
> Depois de criadas as issues, **apagar este arquivo** (as issues passam a ser a fonte). Ninguém
> pega tarefa daqui.

**O que a leva 0 entrega**: o painel publicado na internet, com login pelo GitHub (só quem é da
Sakura Corp entra), mostrando a leva atual com o **contador** e a **lista das tarefas por estado**,
tudo **atualizando sozinho em tempo real**. Visual parecido com o do Claude.

**O que fica pra leva 1** (a linha de produção completa), no fim deste arquivo.

**Ordem**: cada tarefa depende da anterior. Por isso, nesta leva, **a próxima só começa depois
que a anterior foi aprovada pela Sofia e entrou na `main`**. Total estimado: **27 h**.

**O caminho da leva 0**
```
tarefa 1 → PR → Sofia aprova
tarefa 2 → PR → Sofia aprova          + Sofia liga a Cloudflare
tarefa 3 → PR → Sofia aprova e confere o endereço no ar
                                      + Sofia cria os apps de login
tarefa 4 → PR → Sofia aprova
tarefa 5 → PR → Sofia aprova          + Sofia liga o aviso automático (webhook)
tarefa 6 → PR → Sofia aprova  →  fim da leva 0 (ver o fim deste arquivo)
```

**Em todas as tarefas vale:**
- Ler a seção 0 do `PROJETO_STATUS.md` e o `docs/painel.md` antes, e seguir "Como começar uma tarefa".
- O Claude guia a pessoa passo a passo, com calma, em tudo que não for programar.
- **Antes de começar**: conferir o "Depende de" da tarefa. Se a tarefa anterior ainda não foi
  aprovada, ou se a parte da Sofia ainda não aparece em "Andamento" no `docs/painel.md`, **não
  começar**: o Claude escreve uma mensagem curta de WhatsApp pra pessoa mandar pra Sofia, e para.
- **No fim de toda tarefa**, nesta ordem:
  1. conferir o "Pronto quando" com a pessoa, item por item;
  2. abrir o PR com `Closes #<número>` e pedir a revisão da `caranovavidanova` (isso já avisa a
     Sofia pelo GitHub). **Não mesclar**;
  3. **avisar no WhatsApp**: o Claude escreve a mensagem, curta e informal, e a pessoa só copia
     e manda. Modelo: *"Oi Sofia! Terminei a tarefa <número> (<nome curto>). O PR é o
     #<número do PR>, tá esperando sua revisão."*
  4. esperar a aprovação antes de pegar a próxima.
- **Pra começar**, a pessoa diz ao Claude dela: *"Quero fazer a tarefa #<número> do sakura-corp/sakura-system-ace."*

---

## Tarefa 1 de 6 · Criar o projeto do painel · Estimativa: 2 h

**Depende de**: nada. É a primeira.

**Objetivo**: o esqueleto do painel na pasta `painel/`, uma página que abre no navegador escrito
"Painel da Sakura", ainda sem nenhuma função.

**O que fazer**
1. Criar `painel/` como projeto **Vite + React + TypeScript**, com as mesmas versões principais do
   programa das lojas (ver o `package.json` da raiz): React 19, Vite 6, TypeScript 5.7, Tailwind 4
   com `@tailwindcss/vite`, Node 22.
2. `painel/package.json` com `"name": "sakura-painel"`, `"private": true` e os scripts `dev`,
   `build` (`tsc -b && vite build`), `preview`, `typecheck` e `test` (Vitest, só do painel).
3. Uma página só: título "Painel da Sakura" e a linha "Em construção: leva 0", usando uma classe do
   Tailwind pra provar que ele funciona. `<html lang="pt-BR">` e `<title>Painel da Sakura</title>`.
4. Na raiz, pra ela não misturar com o painel:
   - `eslint.config.js`: acrescentar `"painel"` na linha `ignores` (hoje `["dist", "dist-electron", "release"]`);
   - `vitest.config.ts`: `test.exclude` com `[...configDefaults.exclude, "painel/**"]`;
   - `.gitignore`: acrescentar `painel/node_modules`, `painel/dist` e `painel/.dev.vars` (esse
     último vai guardar uma senha de teste na tarefa 4 e nunca pode subir).
5. `docs/painel.md`: preencher "Como rodar no PC" e acrescentar uma linha em "Andamento".

**Pronto quando**
- `cd painel`, `npm install`, `npm run dev` abre a página com "Painel da Sakura".
- `cd painel` e `npm run build` passam sem erro.
- Na raiz, `npm run lint`, `npm run typecheck` e `npm run test:fusos` continuam passando; CI do PR verde.
- Nada mudou fora de `painel/`, das 3 linhas da raiz acima e do `docs/painel.md`.

**Fora desta tarefa**: visual, login, dados, Cloudflare.

---

## Tarefa 2 de 6 · O visual e a tela da leva, com dados de exemplo · Estimativa: 5 h

**Depende de**: tarefa 1 aprovada.

**Objetivo**: a cara do painel pronta, no estilo do Claude, mostrando uma leva de mentira: o
contador no topo e as tarefas agrupadas por estado. Ainda sem GitHub.

**O que fazer**
1. **Cores e fontes**: exatamente as da seção "Design" do `docs/painel.md` (claro e escuro), como
   variáveis no `@theme` do Tailwind, num arquivo `painel/src/estilo.css`. Fontes Inter e
   Source Serif 4 pelo npm (`@fontsource-variable/...`). Ícones: `lucide-react`.
2. **Formato de uma tarefa**, em `painel/src/tipos.ts` (a tarefa 5 vai usar o mesmo):
   ```ts
   export type EstadoTarefa = "livre" | "andamento" | "revisao" | "feita";
   export type Tarefa = {
     numero: number; titulo: string; url: string; estado: EstadoTarefa;
     dono?: { login: string; avatar: string };
     estimativaHoras?: number; prUrl?: string;
   };
   ```
3. **Dados de exemplo** em `painel/src/dados/exemplo.ts`: uma "leva-0" com 8 tarefas cobrindo os
   4 estados, incluindo uma pessoa com 2 tarefas em andamento (pra testar o aviso do item 5).
4. **Contas** em `painel/src/logica/contador.ts`, como funções puras, com testes Vitest:
   quantas tarefas por estado, total, e horas (`somente as feitas` / `todas`).
5. **Layout**:
   - **Barra lateral** (no celular, barra no topo): "Sakura Corp" em texto; seção "Levas" com a
     leva atual marcada; item "Financeiro" desativado, escrito "em breve".
   - **Topo do conteúdo**: nome da leva ("Leva 0") em Source Serif 4, e o **contador**: cartões
     pequenos com Livres, Em andamento, Em revisão e Feitas; embaixo, "X de Y tarefas feitas ·
     A h de B h", com uma barra de progresso.
   - **Lista**: 4 grupos nesta ordem: Em andamento, Em revisão, Livres, Feitas. Cada tarefa mostra
     `#número`, título, o selo do estado (cores da tabela), o dono (foto redonda + nome) ou
     "livre", a estimativa, e abre no GitHub em aba nova ao clicar.
   - **Aviso da regra "uma por vez"**: se alguém aparece em mais de uma tarefa em andamento, um
     aviso discreto no topo ("fulano está com 2 tarefas em andamento").
6. Funcionar bem de 375 px (celular) a tela grande; foco do teclado visível; nenhuma cor fora das tabelas.

**Pronto quando**
- `npm run dev` mostra a leva de exemplo como descrito, no modo claro e no escuro.
- Os testes do contador passam (`cd painel`, `npm test`) e foram vistos falhar ao quebrar uma conta de propósito.
- `npm run build` passa; CI da raiz verde.

**Fora desta tarefa**: dados de verdade, login, Cloudflare.

---

## Tarefa 3 de 6 · Publicar na Cloudflare · Estimativa: 3 h

**Depende de**: tarefa 2 aprovada **e** a Sofia ter ligado a Cloudflare ao repositório (em
"Andamento" do `docs/painel.md` aparece "Cloudflare ligada"). Ela faz isso com o Claude dela;
ver "O que a Sofia faz" no fim. **Quem programa não mexe na conta da Cloudflare.**

**Objetivo**: o painel no ar, num endereço da internet, atualizando sozinho toda vez que uma
mudança do painel entra na `main`.

**O que fazer**
1. **Worker com os arquivos da página** (Cloudflare Workers com "static assets"):
   `painel/wrangler.jsonc` com `name: "sakura-painel"`, `main: "worker/index.ts"`, uma
   `compatibility_date` atual, e
   `assets: { directory: "./dist", not_found_handling: "single-page-application", run_worker_first: ["/api/*"] }`.
2. `painel/worker/index.ts`: responde `GET /api/saude` com `{ "ok": true }`; todo o resto é a página.
3. `wrangler` como dependência de desenvolvimento; script `dev:worker` (`wrangler dev`) pra rodar
   página + worker juntos no PC. **Não criar script de publicar**: quem publica é a Cloudflare, a
   partir da `main`.
4. `docs/painel.md`: o endereço do painel e como rodar com `wrangler dev`.

**Pronto quando**
- No PC, `npm run build` + `npm run dev:worker` abre a página, e `/api/saude` responde `{"ok":true}`.
- Depois de mesclado pela Sofia: o endereço público abre o painel de exemplo, e `/api/saude` responde.
- CI da raiz verde.

**Fora desta tarefa**: login, dados, tempo real.

---

## Tarefa 4 de 6 · Login pelo GitHub (só quem é da Sakura Corp) · Estimativa: 6 h

**Depende de**: tarefa 3 aprovada **e** a Sofia ter criado os dois GitHub Apps e cadastrado os
segredos (em "Andamento" aparece "apps de login criados"), **e** a pessoa ter recebido dela, pelo
Bitwarden Send, o segredo do app de teste.

**Objetivo**: pra ver o painel, a pessoa entra com a conta do GitHub. Só entra quem for membro da
organização `sakura-corp`; quem não é vê "Esta conta não faz parte da Sakura Corp".

**Como funciona (já decidido, não inventar outro jeito)**
- **Dois GitHub Apps** da organização, criados pela Sofia: **"Sakura Painel"** (o de verdade;
  segredo só na Cloudflare) e **"Sakura Painel (teste)"** (volta pro `localhost`; o segredo dele
  fica no `painel/.dev.vars` de quem programa, que o `.gitignore` já barra).
  Permissões: Issues (ler e escrever), Pull requests (ler), Metadata (ler), Members da
  organização (ler). Instalados **só** no `sakura-system-ace`.
- **O token da pessoa nunca chega ao JavaScript da página**: fica num cookie `sessao`
  **cifrado** (AES-GCM, com a chave `CHAVE_DA_SESSAO`), `HttpOnly`, `Secure`, `SameSite=Lax`.
  Quem conversa com o GitHub é o Worker.
- Segredos (nomes exatos): `GITHUB_APP_CLIENT_ID` (não é segredo, vai como variável),
  `GITHUB_APP_CLIENT_SECRET` e `CHAVE_DA_SESSAO` (segredos da Cloudflare).

**O que fazer** (no `painel/worker/`)
1. `GET /api/login`: gera um `state` aleatório, guarda num cookie curto (10 min, HttpOnly) e
   manda pra `https://github.com/login/oauth/authorize?client_id=…&redirect_uri=…&state=…`.
2. `GET /api/login/volta`: confere o `state`; troca o `code` pelo token
   (`POST https://github.com/login/oauth/access_token`); pega o usuário (`GET /user`); confere se
   é membro (`GET /orgs/sakura-corp/members/<login>` tem que dar 204). Se não for, volta pra
   `/?erro=nao-membro` sem criar sessão. Se for, grava o cookie `sessao` com
   `{ token, refresh, expiraEm, login, avatar }` cifrado e volta pra `/`.
3. Token vencido (os do GitHub App duram 8 h): renovar com o `refresh`
   (`grant_type=refresh_token`); se não der, apagar a sessão e pedir login de novo.
4. `GET /api/eu`: `{ login, avatar }` ou 401. `POST /api/sair`: apaga a sessão.
5. **Página**: sem sessão, uma tela limpa com o botão "Entrar com o GitHub"; com `?erro=nao-membro`,
   a mensagem acima; logada, foto e nome no canto da barra lateral, com "Sair".
6. **Nunca** escrever token, cookie ou segredo em log, erro ou tela.
7. Testes Vitest das partes puras: cifrar/decifrar a sessão (e recusar sessão adulterada),
   conferir o `state`.
8. `docs/painel.md`: como pôr o `.dev.vars` no PC (sem colar o valor no manual).

**Pronto quando**
- No PC, com o app de teste: entrar com uma conta da Sakura Corp mostra o painel; com uma conta de
  fora, mostra a mensagem; "Sair" funciona.
- Os testes passam e foram vistos falhar com uma sessão adulterada.
- Depois de mesclado: o mesmo no endereço público, com o app de verdade.
- CI da raiz verde.

**Fora desta tarefa**: dados de verdade, tempo real, botão de pegar tarefa.

---

## Tarefa 5 de 6 · As tarefas de verdade do GitHub · Estimativa: 5 h

**Depende de**: tarefa 4 aprovada.

**Objetivo**: trocar os dados de exemplo pelas issues de verdade, com o estado certo de cada uma.

**O que fazer**
1. `GET /api/levas` (Worker, com o token da sessão): as etiquetas do repositório com o formato
   `leva-<número>`, em ordem.
2. `GET /api/leva/<n>`: **uma consulta GraphQL** no GitHub que traz, das issues com a etiqueta
   `leva-<n>` (abertas e fechadas, até 100): número, título, link, aberta/fechada, texto,
   responsável (login e foto) e os PRs que fecham a issue (`closedByPullRequestsReferences`).
   Devolve no formato `Tarefa` da tarefa 2.
3. **Regra do estado** (função pura em `painel/src/logica/estado.ts`, com testes):
   fechada → `feita`; aberta com PR aberto que a fecha → `revisao`; aberta com responsável →
   `andamento`; senão → `livre`.
4. **Estimativa**: ler do texto da issue a linha `Estimativa: N h` (aceitar `2h`, `2 h`, `1,5 h`);
   sem a linha, não mostra.
5. **Qual é a leva atual**: a de maior número que tem pelo menos uma tarefa aberta; se todas
   estiverem fechadas, a de maior número. As outras aparecem na barra lateral pra escolher.
6. Carregando: esqueleto discreto. Erro: mensagem clara, com botão "Tentar de novo".
7. Tirar os dados de exemplo da tela (podem ficar nos testes).

**Pronto quando**
- O painel publicado mostra as tarefas da `leva-0` de verdade, com os estados e o contador certos.
- Pegar uma tarefa no GitHub e recarregar a página muda o estado dela.
- Os testes de estado e estimativa passam e foram vistos falhar.
- CI da raiz verde.

**Fora desta tarefa**: atualizar sem recarregar (tarefa 6).

---

## Tarefa 6 de 6 · Tempo real · Estimativa: 6 h

**Depende de**: tarefa 5 aprovada **e** a Sofia ter ligado o aviso automático (webhook) do
GitHub App "Sakura Painel" e cadastrado o segredo dele (em "Andamento" aparece "webhook ligado").

**Objetivo**: quando alguém pega, entrega ou fecha uma tarefa no GitHub, o painel de todo mundo
muda sozinho em poucos segundos, sem recarregar.

**Como funciona (já decidido)**
- O GitHub avisa o Worker a cada mudança (webhook), e o Worker repassa o aviso pra todos os
  painéis abertos por uma conexão sempre ligada (WebSocket), usando um **Durable Object** da
  Cloudflare (a versão com SQLite, que está no plano grátis).
- O aviso não leva dado nenhum da tarefa: só "a tarefa #N mudou". Cada painel busca de novo pela
  própria sessão.

**O que fazer**
1. `POST /api/webhook`: confere a assinatura `X-Hub-Signature-256` (HMAC-SHA256 do corpo com o
   segredo `GITHUB_WEBHOOK_SECRET`, comparação em tempo constante); recusa com 401 se não bater;
   ignora o que não for deste repositório; repassa `{ evento, numero }` ao Durable Object.
2. **Durable Object `SalaDoPainel`**: uma sala só (`idFromName("painel")`), usando a API de
   WebSocket com hibernação (`ctx.acceptWebSocket`); manda o aviso pra todas as conexões.
   No `wrangler.jsonc`: o binding e a migration com `new_sqlite_classes: ["SalaDoPainel"]`.
3. `GET /api/tempo-real`: só com sessão válida; abre o WebSocket com a sala.
4. **Página**: um `useTempoReal()` que conecta, e a cada aviso busca a leva de novo (juntando
   avisos seguidos em 1 segundo). Se cair, reconecta sozinho (1 s, 2 s, 5 s, 10 s, até 30 s).
   Um ponto "ao vivo" na barra lateral (verde conectado; "reconectando…" quando cair). De reserva,
   busca de novo a cada 2 minutos e quando a janela volta a ficar em foco.
5. Testes: a conferência da assinatura (com um exemplo conhecido) e a espera de reconexão.
6. `docs/painel.md`: como o tempo real funciona, em 5 linhas.

**Pronto quando**
- Com o painel aberto em dois navegadores, pôr seu nome numa tarefa no GitHub muda os dois em
  poucos segundos, sem recarregar.
- Um webhook com assinatura errada é recusado.
- Os testes passam e foram vistos falhar.
- CI da raiz verde.

---

## O que a Sofia faz (com o Claude dela guiando, na hora de cada tarefa)

Cada coisa que ela faz, o Claude dela **anota em "Andamento" do `docs/painel.md`** (ex:
"30/10: Cloudflare ligada"). É ali que o Claude de quem programa confere se pode começar.

- **Antes da tarefa 1**: criar a etiqueta `leva-0` e as issues (o Claude dela faz) e convidar o Gustavo.
- **Antes da tarefa 3**: na Cloudflare, ligar o repositório ("Workers Builds"): pasta `painel`,
  comando de build `npm ci && npm run build`, publicar com `npx wrangler deploy`, só da `main`,
  **sem publicar branches de PR**.
- **Antes da tarefa 4**: criar os dois GitHub Apps na `sakura-corp` e cadastrar
  `GITHUB_APP_CLIENT_SECRET` e `CHAVE_DA_SESSAO` na Cloudflare. Passar o segredo do app **de
  teste** pro Gustavo pelo **Bitwarden Send** (um link cifrado que se apaga sozinho), nunca por mensagem.
- **Antes da tarefa 6**: no "Sakura Painel", ligar o webhook (endereço
  `https://<painel>/api/webhook`, eventos Issues, Pull request e Label) e cadastrar
  `GITHUB_WEBHOOK_SECRET` na Cloudflare.
- **Depois do painel**: a conferência automática (CI) do painel, feita pelo Claude dela.

## Fim da leva 0 (depois que a tarefa 6 for aprovada)

1. O Claude de quem fez a 6 escreve a mensagem de WhatsApp: *"Oi Sofia! A tarefa 6 foi aprovada,
   a leva 0 terminou. O painel tá no ar em <endereço>."*
2. A leva **congela**: ninguém começa tarefa nova.
3. **Todo mundo testa** o painel publicado, com a lista de testes que o Claude da Sofia manda. O
   que achar de estranho vira comentário (com print) numa issue nova, e a Sofia decide o que fazer.
4. O Claude da Sofia escreve o **relatório da leva**, a Sofia aprova, e os dois planejam a
   **leva 1**. Até as tarefas da leva 1 aparecerem, não tem tarefa pra pegar.

## Leva 1 (depois): a linha de produção completa

Só como mapa; cada item vira tarefa detalhada quando a leva 1 for planejada:
- Botão **"Pegar"** no painel: põe a pessoa na tarefa, só se estiver livre e se ela não tiver
  outra em andamento (a regra "uma por vez" vira trava de verdade).
- **Fases da leva**: planejando → em andamento → congelada → em teste → relatório → aprovada →
  liberada, com o painel mostrando em que fase está e o que falta.
- **Horas por pessoa na semana** (somando as estimativas).
- **O relatório da leva** e a aprovação da Sofia dentro do painel.
- Depois: **Financeiro e DRE**, com banco próprio e privado.

---

## Mensagem do primeiro dia (APROVADA pela Sofia em 30/09/2026)

Quem entra na equipe instala o Claude Code no PC (não a versão pela internet: vai precisar abrir o
painel no navegador pra testar) e cola isto como **primeira mensagem**:

> Oi, Claude. Vou trabalhar no projeto **Sakura System**, que está no GitHub no repositório
> **`sakura-corp/sakura-system-ace`**. Me guie **um passo por vez**, como se eu nunca tivesse
> feito isso: diga exatamente onde clicar ou o que digitar, o que deve aparecer na tela, e
> **espere eu responder "feito"** antes do próximo passo.
>
> Hoje o objetivo é **só deixar meu computador pronto**, sem programar nada:
> 1. Me pergunte se meu computador é Windows ou Mac.
> 2. Confira o que já tenho instalado e me ajude a instalar o que faltar: **Git**, **Node.js
>    versão 22** e **GitHub CLI** (o programa `gh`).
> 3. Me ajude a entrar na minha conta do GitHub pelo GitHub CLI (`gh auth login`, pelo navegador).
> 4. **Clone** o repositório com `gh repo clone sakura-corp/sakura-system-ace`, numa pasta que você
>    vai me ajudar a escolher. **Não baixe como ZIP.** Precisa ser clonado, pra eu conseguir
>    entregar meu trabalho depois.
> 5. Me explique como abrir o Claude Code **dentro dessa pasta** e espere eu abrir.
> 6. Já dentro da pasta, leia a **seção 0 do `PROJETO_STATUS.md`** e o **`docs/painel.md`**, e me
>    explique em português simples, em poucas linhas, como vai ser o meu trabalho.
>
> **Hoje não mude nada no projeto, não crie branch e não pegue tarefa.** Quando tudo estiver
> pronto, diga "tudo pronto" e pare.

Mensagem de WhatsApp da Sofia pra pessoa (curta):

> *Oi Gustavo! Te convidei pro GitHub da Sakura, aceita lá pelo e-mail. Depois instala o Claude
> Code no teu PC (o passo a passo tá em code.claude.com/docs) e entra com a tua conta Pro. Quando
> abrir, cola esse texto como primeira mensagem: [o texto acima]*

**Em aberto**: se esse texto vai morar no `docs/painel.md` numa seção "Primeiro dia" (a
sugestão foi feita; ela aprovou o texto, não o lugar).
