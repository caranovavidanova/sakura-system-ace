# Projeto, identidade visual e decisões técnicas

> Parte da memória do projeto. O índice é o `PROJETO_STATUS.md` (carrega sozinho em toda sessão);
> este arquivo só é aberto quando o assunto pede. Os números de seção e de item citados aqui
> ("item 33 da seção 6") continuam valendo: a seção 6 é `docs/licoes.md`, a 5 é `docs/banco.md`,
> a 7 é `docs/modulos.md`, a 8 é `docs/pendencias-e-futuro.md` e a 9 é `docs/operacao.md`.

## 2. O que é o projeto

**Sakura System** é uma linha de sistemas de gestão empresarial por nicho. Esta é a primeira
edição: **SSACE — Sakura System AutoCenter Edition**, para autocenters/borracharias. Referência de
mercado: S3Auto (Comsis) — um ERP tradicional e funcional, mas com UX densa/datada. O diferencial
do SSACE é UX simples e moderna, mantendo as funções essenciais de um ERP de autocenter. Depois do
SSACE validado, a ideia é criar outras edições (ex: Supermarket Edition), reaproveitando a base
arquitetural.

### Plano de expansão/vendas (definido pela usuária)

Três fases, nessa ordem, sem pressa de pular etapa:

1. **Lançar na borracharia do pai dela** (ver seção 1), em **Araraquara**, com tudo funcionando —
   usar de verdade lá é como ela pretende achar bugs reais (os que só aparecem usando de verdade,
   não em teste) e descobrir que funções novas fazem falta no dia a dia. É o gatilho pra atacar a
   emissão de nota fiscal (seção 8, item 1). **Em andamento, e já rodando na loja de verdade**:
   instalador publicado (`v0.9.2` a `v0.9.7`, ver seção 7 "Empacotamento") — confirmado nesta
   sessão que já está em uso real na loja (não só na máquina pessoal dela): ela reportou telas com
   OS de cliente de verdade (ex: "OS 1", cliente "Silvio Criscolin") e pegou bugs de uso real
   (Operador Teste travado, "Importar por foto" com erro genérico, menu nativo do Electron, badge
   de status quebrando linha — ver itens 23-25 da seção 6), exatamente o tipo de bug que só aparece
   usando pra valer. Banco de produção limpo, só existe uma loja real no Supabase: "Pneus Amigão"
   (Araraquara). Auto-update via GitHub Releases confirmado funcionando de novo nesta sessão
   (`v0.9.5` → `v0.9.6` sozinho, ver item 21 da seção 6). **Assinou o Focus NFe e a emissão
   automática já está validada de ponta a ponta em produção** (NFC-e e NFS-e, ver item 1 da
   seção 8) — não depende mais de emitir por fora do sistema.
2. **Expandir pra mais 2-3 lojas de conhecidos do pai dela, também em Araraquara** — ainda como
   teste, validar como o sistema se comporta crescendo pra fora de uma loja só, antes de pensar
   grande. **Primeiro caso real surgiu numa sessão posterior**: o pai dela contou que um amigo dele
   provavelmente vai comprar o sistema pras **duas lojas** que esse amigo tem. Como é uma empresa
   diferente da do pai dela (não é a mesma razão social), o modelo confirmado é: **cada empresa
   (dono diferente) = 1 projeto Supabase próprio**, totalmente isolado — diferente da fundação
   **multi-loja** já construída (essa é pra **uma empresa com várias lojas**, e continua servindo
   normalmente dentro do projeto Supabase do amigo, já que ele tem 2 lojas próprias).
   **Resolvido (construído nesta sessão)**: o instalador só sabia conectar num Supabase só
   (URL/chave gravadas no build via secret do GitHub), o que impedia instalar pra esse amigo sem
   gerar um instalador separado por cliente. Agora cada computador escolhe a conexão na primeira
   abertura e o valor fica guardado só naquela máquina — ver "Conexão com o banco (multi-empresa)"
   na seção 7. Serve também de base pro modelo self-service da fase 3 (site de assinatura).
   **Publicado na `v0.9.18` e confirmado funcionando por ela** (instalou no notebook, colou URL +
   chave, entrou normalmente). **Pendência**: avisar a loja do pai dela que, na primeira abertura
   depois de atualizar, o app vai pedir a conexão uma vez — motivo e valores na seção 7.
   **Cenário conversado em 25/09/2026** (ainda hipotético — ela disse "vamo supor"): além da loja
   do pai, **uma empresa com 2 lojas (o amigo) e uma empresa com 1 loja** — ou seja 3 bancos no
   Supabase, 4 lojas e 4 CNPJs. **O valor NÃO está decidido.** Preço, custo por loja e
   cuidados de contrato ficam no repositório privado `caranovavidanova/sakura-corp` (desde 27/09/2026).
3. **Oferecer pras ~30 lojas de autocenter que o pai dela conhece e poderia apresentar o sistema**
   — essa fase **já envolve estados diferentes** (não fica só em Araraquara/SP como as fases
   anteriores) — o que pode importar pra emissão fiscal (regras de ICMS/ISS variam por
   estado/município; não assumir que o que funcionar pra loja do pai dela vai servir sem ajuste
   pras outras) e é justamente aí que vira a "versão comercial" mencionada em outros pontos deste
   documento (site externo de assinatura pra criar loja nova sozinho, seção 8 item 2;
   reconsiderar centralizar o custo da IA em vez de cada loja pagar a própria conta Anthropic,
   seção 8 item 6). Não adiantar esse trabalho agora — as duas fases anteriores ainda não
   aconteceram.

### Identidade visual — como está hoje

- **Tema escuro/neon (confirmado pela usuária)**: paleta rosa/roxo neon sobre fundo quase preto —
  `sakura-pink` `#ff4dce`, `sakura-purple` `#b624ff`, fundo `sakura-bg` `#0b070a`
  (`src/styles/globals.css`, tokens `--color-sakura-*`), `color-scheme: dark` no `:root`. Substituiu
  o tema claro/rosa original (paleta `#FFC9F3`/`#B38DAC`/`#C7C7C7` sobre fundo claro) — a troca foi
  feita pela usuária com ajuda do Gemini (fora do Claude Code) e confirmada nesta sessão depois de
  ver rodando de verdade. **`sakura-purple-dark` virou um tom claro (`#e8d5e5`)** e `sakura-muted`
  (`#9e8d9a`) são as variantes de texto sobre fundo escuro — mesma regra de sempre (nunca usar
  `text-sakura-gray` como texto, nem opacidade baixa em cima de `sakura-card`), só que os nomes das
  variáveis agora carregam valores invertidos (claro→escuro) — **cuidado ao ler CSS antigo/exemplos
  desta documentação**: onde antes dizia "sakura-purple-dark é escuro pra contraste sobre card
  claro", agora é o oposto (claro pra contraste sobre card escuro). Ainda não foi feita uma auditoria
  de contraste WCAG completa da paleta nova — se algum texto parecer "sumido" em uma tela ainda não
  tocada por essa leva de mudanças, é candidato a ajuste pontual, não bug misterioso.
- Estilo "glassmorphism escuro": blocos arredondados translúcidos (`sakura-card`, com
  `backdrop-filter: blur` + glow neon sutil) flutuando sobre um fundo escuro com brilho difuso rosa/
  roxo (`sakura-shell-bg`), aplicado em praticamente toda tela do app (o Login usa
  `public/sakura-login-bg-premium.png` como fundo, no lugar do antigo `sakura-login-bg.svg`, e o
  próprio `sakura-card` no bloco de login em vez de um vidro à parte). Cartões de tendência do
  Início não usam mais gráfico/sparkline — só valor grande + seta `›`, com um leve glow interno por
  métrica (ver seção 7).
- **Barra de rolagem 100% customizada** (`src/components/AreaRolavel.tsx`): a barra nativa do
  Windows/Chromium não respeita `border-radius`, então nunca fica "dentro" de um card de vidro —
  a solução foi esconder a nativa por completo (`scrollbar-width: none` +
  `::-webkit-scrollbar { display: none }`) e desenhar o próprio "polegar" como uma div comum
  (arredondada, arrastável via `pointerdown`/`pointermove`). Aplicado em `<main>` (App.tsx) e na
  `Sidebar`; **não** no `Modal.tsx` (já tem `max-h-[85vh]`, caso raro, manter simples). **Cuidado
  de cascata CSS aprendido aqui** (ver item 14 da seção 6): qualquer CSS "puro" escrito direto em
  `globals.css`, fora de `@layer`, tem prioridade **maior** que classes do Tailwind (que ficam
  dentro de `@layer`), não importa a especificidade — reset globais (`*`, seletores soltos)
  precisam ficar dentro de `@layer base`.
- Checkbox/rádio usam `accent-color` na paleta do app. O **botão de abrir o calendário** dentro de
  `input[type=date]` é o ícone nativo do Chromium com `filter: invert(100%)` (pra ficar branco
  sobre o card escuro) e, desde 03/09/2026, com tamanho, respiro e fundo arredondado — antes era
  um quadradinho minúsculo que ela mal enxergava. **Pegadinha ao mexer**: o `invert` vale pro
  elemento inteiro, fundo incluído, então a cor de fundo é escrita ao contrário do que aparece na
  tela (o `rgba(0,0,0,…)` do CSS é o cinza claro que se vê). **Não mexido de propósito**: a seta do
  `<select>` continua nativa (os ~15 selects do app têm paddings variados, arriscaria desalinhar
  sem conferir cada um visualmente).
- **Logo**: `public/sakura-icon.svg` (flor de 5 pétalas arredondadas + estames, favicon/ícone da
  janela) e `public/sakura-logo.svg` (só o wordmark "Sakura System" / "by Sakura Corp" em itálico
  serifado, sem a flor — usado no menu lateral via `Logo.tsx`). Ambos desenhados à mão em SVG,
  **não** são a arte oficial da usuária.
  - **Pendência em aberto**: a usuária tem um SVG "oficial" da logo (gerado por um traçador de
    imagem tipo VTracer, ~200 `<path>` vetoriais). **Não tentar transcrever esse SVG via chat** —
    já se perdeu conteúdo numa tentativa antiga ("Sakura System" virou "Sal u a System") e o
    arquivo é grande demais pra colar inteiro com segurança.
  - **Pendência de upload de imagem**: pedir "arquivo anexado em vez de colado" não é garantia de
    que o arquivo chega de verdade neste ambiente — já aconteceu de a usuária anexar pelo botão
    "+" (não colar) e mesmo assim o arquivo não aparecer em `/root/.claude/uploads/<session>/`, só
    a imagem renderizada na conversa, sem erro visível do lado dela. Não é 100% das vezes (fotos
    do formulário de funcionário chegaram certinho pelo mesmo tipo de anexo), mas não é raro. **Se
    acontecer de novo**: confirmar com `find /root/.claude/uploads -type f` se o arquivo chegou
    antes de processar; se não chegou, recriar a imagem à mão em SVG a partir do que dá pra ver na
    conversa, mostrando um preview renderizado (Playwright + Chromium) antes de aplicar de vez.

## 3. Decisões técnicas já tomadas (não reabrir sem motivo forte)

| Decisão | Escolha | Por quê |
|---|---|---|
| Tipo de app | Desktop (Windows) via Electron | Definido pela usuária desde o início |
| Frontend | React + Vite + TypeScript (não Next.js) | Next.js é para apps com servidor; Electron não precisa disso |
| Empacotamento Electron | `vite-plugin-electron` + `vite-plugin-electron-renderer` | Um único `vite.config.ts` builda renderer + main + preload com hot reload |
| Estilo | Tailwind CSS v4 (`@tailwindcss/vite`, config via `@theme` no CSS) | Rapidez para manter a paleta consistente |
| Dados | Supabase (Postgres em nuvem) | Pensando em app mobile futuro, multi-loja, e emissão fiscal (que exige internet de qualquer forma) |
| Roteamento | `react-router-dom` com `HashRouter` | Electron carrega arquivo local (`file://`); `HashRouter` evita problemas de rota que `BrowserRouter` teria |
| Versionamento | SemVer + `CHANGELOG.md` | Só "lançar" versão quando testado e funcionando |
| Lint | ESLint 9 flat config só com `rules-of-hooks` + `exhaustive-deps` | `eslint-plugin-react-hooks` v7 traz regras experimentais que reprovariam o padrão "fetch on mount" usado em todas as páginas |
| Autenticação | Supabase Auth (e-mail/senha), operador só digita **usuário** — o app monta `usuario@sakura.local` por baixo dos panos | Login rápido, sem digitar e-mail. Ver seção 6 pra limitações |
| Permissões por módulo | Checadas **na interface do app**; desde 2026 também **no banco**, tabela por tabela (item `TR-04.1`): RH (`0056`), Contas a Pagar/Receber (`0061`) e Caixa (`0062`) já exigem o módulo. Clientes, peças/estoque e OS ainda não | Começou só na tela por rapidez; a proteção no banco entra por lotes, cada um com decisão dela. Ver item 1 da seção 6 |
| RLS das tabelas de negócio | Exige **login** e acesso à loja em todas; nas tabelas dos lotes acima, exige também o módulo (com "portas estreitas" pra quem precisa de um pedaço, ex: faturar OS lança no Caixa) | O risco mudou com a venda pra terceiros (fase 2), e o reforço começou por dinheiro e RH |
| Fluxo de Git **enquanto não existir uma v1.0 oficial publicada** | Criar/reusar uma branch de trabalho, commitar, abrir PR e **já mergear direto em `main`** ao final de cada tarefa — nunca deixar PR esperando aprovação manual | Pedido explícito da usuária. **Sempre informar no chat, em português simples, os comandos exatos e onde rodar cada um** depois do merge. Revisitar quando existir uma v1.0 publicada de verdade |
| Ir pra produção sem emissão fiscal pronta | A usuária já usa o sistema na borracharia (cadastro, OS, estoque, caixa) e continua emitindo nota fiscal por fora até a emissão automática ficar pronta | Desbloqueia o uso real sem esperar o projeto de integração fiscal (depende de escolher provedor + certificado digital) |
| Empacotamento do instalador Windows | Instalador simples (NSIS) + atualização automática via GitHub Releases (`electron-builder` + `electron-updater`) | Evita ter que reinstalar manualmente em cada loja toda vez que sair uma versão nova |
| Conexão com o Supabase no app instalado | Digitada na primeira abertura e guardada **naquele computador** (`conexao.json` na pasta de dados do app) — **não** embutida no build | Um instalador só passa a servir qualquer empresa (fase 2). Os secrets saíram do `release.yml` de propósito: embutidos, o instalador entregue a um cliente novo viria apontando pro banco de outra empresa. Em `npm run dev` o `.env` continua valendo. Ver seção 7 |
| Chave da IA (leitura de nota fiscal por foto) | Fica só como secret de uma Supabase Edge Function — nunca no app Electron instalado | Cada loja (projeto Supabase próprio) paga pela própria conta Anthropic, sem expor a chave a quem tem acesso ao computador. Ver seção 7 e item 8 da seção 8 |
| Quem paga a infraestrutura das lojas clientes (28/08/2026) | **Tudo na conta da usuária** — Supabase, Anthropic e Focus NFe. O dono da loja não cria conta em serviço nenhum e nunca vê que eles existem | Decisão explícita dela. É o que justifica a mensalidade e o que permite dar suporte de verdade; em troca, o dado dos clientes das lojas fica sob responsabilidade dela — daí o backup ser obrigatório, não opcional. **Substitui** o modelo antigo de "cada loja cria a própria conta Anthropic" descrito na linha acima e no item 6 da seção 8 |
| Plano do Supabase por empresa cliente (28/08/2026, corrigido em 10/09/2026) | **Pro desde a primeira venda** — mas a cobrança é **por organização, não por empresa**: US$25 cobre a organização com o 1º projeto, e cada projeto a mais custa a partir de US$10/mês | O plano grátis não guarda cópia de segurança automática — perder o dado de uma loja de terceiro seria muito pior que esse custo. **Os dois pontos que estavam "não confirmados" foram confirmados em 10/09/2026**: o grátis permite no máximo **2 projetos ativos por organização** e **pausa o projeto sozinho depois de 1 semana** sem uso. **Correção importante da conta antiga**: o "~R$145/mês por empresa" registrado aqui antes estava errado — 4 empresas numa organização só custam US$25 + 3×US$10 = US$55 (~R$280), não 4×US$145. Ver "Onde tudo parou (10/09/2026)" |
| Instalação de empresa nova | Um arquivo SQL único (`supabase/instalacao/instalacao-completa.sql`, gerado por `npm run gerar-instalacao`) + o checklist `supabase/instalacao/INSTALAR-LOJA-NOVA.md` | Colar as ~47 migrations uma por uma era o maior risco operacional da venda: pular uma ou trocar a ordem não dá erro na hora, só quebra depois na tela do app. Ver itens 36 e 37 da seção 6 |
| Site de apresentação (28/08/2026) | Pasta `site/` no próprio repositório, **HTML/CSS puros sem build**, publicado na Vercel com Root Directory = `site` | Uma página só não justifica um segundo `node_modules`; sem build não há risco de quebrar o build/teste do app, e a usuária consegue editar um texto sem rodar nada. Reaproveita a conexão da Vercel que já existia no repositório e só atrapalhava (check falhando nos PRs) |
| Canal de atualização (25/09/2026, item TR-09.1) | Toda versão nasce no GitHub como **pré-lançamento** (canal de teste) e só chega nas outras lojas quando ela roda o workflow **"Liberar versão para todas as lojas"**. Cada computador escolhe o canal em Configurações → "Atualizações deste computador" (padrão: normal) | Publicar atualizava todas as lojas no mesmo minuto — com lojas de terceiros, uma versão ruim vira vários telefonemas. Usa o mecanismo que o `electron-updater` já tem pro GitHub (`allowPrerelease`), em vez do "copiar `latest.yml` entre canais" que o guia sugeria e que não funciona com o provedor GitHub. Ver "Liberar uma versão para todas as lojas" na seção 9 |
| Versão de cada computador (26/09/2026, migration 0063) | Cada computador cria um número próprio (`computador.json`) e grava no banco, a cada login, versão, canal e loja (tabela `computadores`). Migration que aperta uma regra da versão anterior declara `-- versao-minima-do-programa: X`, e o botão de atualizar os bancos espera os computadores em uso abaixo de X (com uma caixinha pra passar por cima) | Com lojas de terceiros, conferir à mão "alguém ainda está na versão velha?" (como na `0062`) deixa de ser possível. Registro no login, e não um sinal contínuo de vida: é o que responde a pergunta sem tráfego a mais. A exigência é da MIGRATION, não uma regra geral — quase toda migration só acrescenta e não precisa esperar ninguém. Escolha dela entre as opções. Ver seção 9, "Atualizar o banco de todas as empresas" |
| Nome do arquivo do instalador (28/08/2026) | Fixo: `SakuraSystem-Setup.exe` (`build.artifactName` no `package.json`), sem o número da versão | Permite ao site apontar pra um endereço permanente (`/releases/latest/download/SakuraSystem-Setup.exe`) que sempre entrega a última versão, sem editar o site a cada lançamento. Seguro pro auto-update: o `latest.yml` guarda o nome do arquivo, então a próxima versão já aponta sozinha pro nome novo |
| Preço no site (28/08/2026) | Mostrar **o que está incluído, sem valor fechado** — escolha dela, entre "sem preço nenhum" e "preço na cara" | O valor da mensalidade não é preço de tabela, e a venda é pra conhecidos do pai dela, onde o valor pode variar caso a caso |
| Multi-loja: 1 projeto Supabase pode servir 2+ lojas | Tabela de junção `operador_lojas` (many-to-many, não uma coluna `loja_id` em `operadores`) + `usuario` continua único **globalmente** (não por loja) | Um dono/gerente pode ter acesso a mais de uma loja (o balconista só à dele); manter `usuario` global evita seletor de loja na tela de login e reescrever o esquema de e-mail sintético — ganho não compensa a complexidade pro tamanho de operação dela. Ver seção 5 |
| Multi-loja: o que é compartilhado entre lojas vs. o que é por loja | Compartilhado: `clientes`/`veiculos`, `pecas`, `servicos`, `categorias`/`categorias_servicos`/`categorias_caixa`, `fornecedores`. Por loja: estoque, caixa, OS, contas a pagar, notas fiscais, funcionários, `pedidos_compra`, as 4 configurações | Pedido explícito da usuária: catálogo único pra empresa toda (evita recadastro duplicado, cliente que frequenta 2 lojas fica com histórico único); só o que é fisicamente de cada loja fica separado |
| Token da Focus NFe (25/09/2026, item TR-04.2) | Mora num **cofre** (`segredos_fiscais_loja`, sem policy nenhuma) e quem usa é o **porteiro** — a Edge Function `focus-nfe`, que confere quem pede e só **repassa** a nota que o programa montou. A tela só sabe SE a loja tem token; trocar é só de escrita | O token emite e cancela nota no CNPJ da loja e ia até o computador de todo operador. **Tabela, e não secret da função** como o guia sugeria: secret é um por projeto Supabase (uma empresa), e duas lojas em CNPJs diferentes precisam de dois tokens. **Repassar, e não remontar a nota lá**: remontar seria a sexta vez de uma conta de dinheiro divergindo entre dois lugares. Escolha dela entre as opções, 25/09/2026. Ver item 71 da seção 6 |
| Cadastro mensal da alíquota da NFS-e no portal da prefeitura (26/09/2026) | **Responsabilidade da contabilidade de cada empresa**; o sistema só lembra (faixa no Início, o mês inteiro, só em loja que emite NFS-e) | É cadastro no site da prefeitura, por CNPJ, sem API — o sistema não tem como fazer. Em loja de terceiro, trocar o texto da faixa (Configurações → Dados fiscais) pra dizer a quem avisar. Ver o marco de 26/09/2026 |
| Venda de balcão (26/09/2026, item FN-09, migration 0064) | Uma OS marcada `tipo = 'venda_balcao'`, **não** um módulo de PDV à parte; cliente que não se identifica vira o cliente fixo **"Consumidor"** (UUID `…c000`); o número é o **mesmo contador** das OS | Reaproveita estoque, caixa, NFC-e e garantia sem reescrever nada. "Consumidor" em vez de cliente opcional: escolha dela entre as opções — opcional mexeria em ~20 telas e quebraria a versão anterior ao abrir uma venda sem cliente. Contador compartilhado pra o número nunca repetir na loja ("OS 3" e "Venda 3"), porque ele aparece sozinho em estoque e referência de nota. Ver seção 7, "Ordens de Serviço" |
| Leitor de nota fiscal por IA ("Importar por foto") nas lojas novas (27/09/2026) | **Fica fora das primeiras versões** pras lojas novas: não se instala nem se configura a Edge Function nem a chave da Anthropic nelas | Decisão dela: é um recurso que ela quer trabalhar melhor depois. Tira um passo da instalação de cada loja nova (conta na Anthropic, secret, Edge Function) e um custo por loja. O código continua no app; voltar a oferecer é decisão dela |
| Gerenciamento de formulário | `react-hook-form` + `zod` — **migração concluída**, todo formulário do app já está nesse padrão | Pedido da usuária, baseado num plano de refatoração de outra IA (Gemini) — decisão explícita de que é o padrão geral, não um teste isolado. Ver "Padrão de formulário" na seção 4 |
| Endereço do repositório (29/09/2026) | `sakura-corp/sakura-system-ace`, na organização dela (transferido da conta pessoal) | Base pra equipe. O endereço antigo redireciona, inclusive pro atualizador; por isso **nunca criar um `sakura-system-ace` na conta pessoal** |
| Repositório público ou privado (29/09/2026) | **Continua público** por enquanto (opção C, "sem custo a mais no momento") | Fechar quando tiver CNPJ ou antes do primeiro cliente, e **antes** criar um repositório público só de versões. O que isso exige está no marco de 29-30/09 do `docs/historico.md` |
| Segredos das automações (30/09/2026) | Em **cofres** (environments): `backup` (só `main`) e `lojas` (só `main` + aprovação dela). Valores guardados no Bitwarden dela | Um workflow rodado da branch de um colaborador não recebe segredo de cofre restrito à `main` (item 78 de `docs/licoes.md`) |
| Mudanças na `main` (30/09/2026) | Ruleset **`main protegida`**: PR + 1 aprovação, sem apagar nem force push; Repository admin (ela) isento | Colaborador não mescla sozinho; ela continua mesclando direto |
| Publicar e liberar versão (30/09/2026) | Release, Liberar e Atualizar bancos **só pelo "Run workflow" na `main`, com a aprovação dela** (cofre `lojas`); o Release não dispara mais por tag; ruleset **`versões`** impede mudar ou apagar `v*` | Quem aperta não decide sozinho. O furo que sobra (workflow na própria branch) está no item 78 de `docs/licoes.md`, e a trava de verdade é um repositório só de versões, pra depois |
| Painel da equipe (29-30/09/2026) | Pasta `painel/` no mesmo repositório, React + Vite, Cloudflare (Worker + Durable Object, plano grátis), login por GitHub App só pra membros da `sakura-corp`, dados das issues (sem banco próprio), tempo real por webhook | Decisões dela; tudo em `docs/painel.md`. Financeiro/DRE depois, **fora do GitHub** (banco privado) |

