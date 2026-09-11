# Sakura System — AutoCenter Edition — Estado do Projeto

> ## ⛔ NENHUMA CREDENCIAL NESTE ARQUIVO
>
> **Senha, token, chave, CSC, certificado: o lugar deles é o painel do próprio serviço — nunca
> um arquivo deste repositório, este incluído.** O repositório é **público** (foi aberto pra o
> auto-update funcionar, seção 6 item 21), então tudo aqui é lido por qualquer pessoa.
>
> E apagar depois **não resolve**: o texto continua no histórico do Git pra sempre. Já aconteceu —
> o CSC da SEFAZ, o token do portal da prefeitura e a senha do portal ficaram escritos aqui, foram
> removidos em 02/09/2026 e **seguem no histórico**; a única saída é trocar as três (ver "O que
> depende dela pra andar"). Não repetir o gesto de "colo aqui só pra não esquecer".
>
> Desde 11/09/2026 o CI tem uma varredura automática (`.gitleaks.toml`), mas ela só pega
> credencial com formato reconhecível — uma senha de portal ou um CSC são texto comum, e passam
> batido. A trava de verdade é esta regra.

> Este arquivo existe para que qualquer sessão futura (eu, sem memória da conversa) consiga
> entender o projeto e continuar exatamente de onde parou. Sempre que uma funcionalidade nova
> for concluída e validada pela usuária, **atualize este arquivo** (não deixe ele ficar
> desatualizado) — e de vez em quando **limpe o que não serve mais** (tutoriais de migration já
> confirmada, narrativa de sessão que virou só histórico sem lição nenhuma). Prefira reescrever a
> seção 7 como "estado atual por módulo" em vez de empilhar mais um parágrafo por PR — o que
> importa pra uma sessão nova é o que está pronto **hoje**, não a arqueologia de como chegou lá.
>
> **Cuidado ao ler**: a expressão "nesta sessão" aparece mais de 60 vezes aqui, escrita por sessões
> diferentes ao longo de meses — **ela não quer dizer a sessão atual**, e não dá pra saber a qual
> se refere só pelo texto. Trate como "em algum momento do passado". Ao escrever coisa nova,
> prefira a data ("Onde tudo parou", no fim deste arquivo, é o marco mais recente) ou o número da
> versão publicada. Uma primeira limpeza foi feita em 02/09/2026 (o histórico fiscal já resolvido e
> quatro relatórios de sessão viraram resumo) — o resto das expressões "nesta sessão" continua
> valendo a pena limpar quando sobrar tempo.

## 1. Quem é a usuária e como trabalhar com ela

- Sem experiência prévia em programação. **Explicar decisões técnicas em linguagem simples**, sem
  assumir conhecimento de jargão.
- Antes de decisões estruturais importantes (arquitetura, bibliotecas, modelagem de dados),
  **apresentar opções + recomendação e esperar confirmação** — não decidir sozinho.
- Construir em **etapas pequenas e testáveis**. Mostrar funcionando antes de avançar.
- A usuária testa em uma máquina Windows local (terminal integrado do VS Code / PowerShell). Ela
  copia e cola os comandos que eu forneço — eu não tenho acesso à máquina dela.
- **Instalador Windows**: ela baixa e instala primeiro na **própria máquina dela** (não a da
  borracharia) pra testar antes de levar pra loja de verdade — bom lembrar disso ao dar
  instruções de instalação/teste, não assumir que já está testando no ambiente de produção.
- **A borracharia é do pai dela** — ela é quem constrói o sistema, mas quem vai operar no dia a
  dia é o pai (e funcionários da loja dele). A primeira versão "de verdade" só vai pra lá quando
  ela achar que está pronta o suficiente (ver decisão sobre nota fiscal/lançamento na seção 8).
- E-mail: caranovavidanova@gmail.com.
- **A organização atual de módulos/abas no menu lateral e dentro de cada tela** (ex: Caixa com
  abas Diário/Entradas/Saídas, "Contas a Pagar" como módulo próprio) **é provisória** — a usuária
  disse explicitamente que pretende repensar essa organização melhor no futuro. Não tratar a
  posição/formato atual de nenhum módulo como definitivo nem resistir a reorganizar quando ela
  pedir — é esperado que isso mude.
- **Fluxo de configuração de serviços externos**: quando um recurso novo depende de uma conta
  paga de terceiro (Anthropic, Focus NFe), a usuária cria a própria conta/chave e cola no lugar
  certo — ela mesma paga o próprio uso, sem exigir que eu tenha acesso a nada disso. Ela pede
  ajuda passo a passo com prints de tela (ver seção 9).
- Quando ela manda um print de uma tela de configuração (Supabase, GitHub etc.) e pergunta "qual
  desses" ou "assim?", ela geralmente já está no meio do passo a passo que eu dei — vale conferir
  o print com atenção antes de responder, às vezes tem um detalhe (nome errado, campo a mais) que
  muda o resultado.
- **Mensagem que ela vai mandar pra outra pessoa** (contabilidade, suporte da Focus NFe, cliente):
  escrever **curta e informal**, do jeito que uma pessoa fala — não recapitular todo o contexto
  técnico. Se existe um print ou e-mail que já explica o problema, é ele que carrega a parte
  técnica, e a mensagem fica só: *"preciso de ajuda com isso / o print explica / vocês fazem pra
  mim? / preciso receber X de volta"*. Ela rejeitou explicitamente uma primeira versão longa e
  formal ("quero mais humano, mais simples, sem precisar desse contexto todo"). Vale pra qualquer
  texto que sai da nossa conversa pro mundo — o cuidado com contexto completo é pro
  `PROJETO_STATUS.md`, não pro WhatsApp dela.
- **"Estou pensando em fazer X com você no fim de semana" é PLANO, não autorização pra começar
  agora** (aprendido em 28/08/2026, do jeito ruim). Ela disse "to pensando em pegar firme esse fim
  de semana com você pra fazer um site" — eu tratei como sinal verde, alinhei três decisões por
  perguntas e construí o site inteiro na mesma sessão. A resposta dela: *"na verdade nem precisava
  ter feito site ainda"*. Nada foi perdido (ficou guardado pra quando ela quiser), mas foi trabalho
  grande feito na hora errada, sem ela por perto pra ir opinando. **Regra pra sessões futuras**:
  quando ela descrever intenção futura ("estou pensando em", "semana que vem", "quando der"),
  responder alinhando e **perguntar se é pra começar agora** antes de construir. Responder as
  perguntas de alinhamento dela **não** é o mesmo que ela mandar executar. Vale principalmente pra
  coisa grande e nova (um site, um módulo) — correção de bug e ajuste pequeno que ela relatou
  continuam sendo pra fazer na hora.
- **Sempre que eu aprender uma preferência de trabalho nova**, documentar aqui — não só nas
  decisões técnicas da seção 3, mas qualquer coisa sobre *como* ela quer que eu trabalhe. Sessões
  futuras não têm memória da conversa, só deste arquivo.
- **Este arquivo carrega sozinho em toda sessão nova** — `CLAUDE.md` importa `AGENTS.md` e
  `PROJETO_STATUS.md` (`@AGENTS.md` / `@PROJETO_STATUS.md`), então não é preciso a usuária colar
  ou anexar este arquivo de novo pra eu ter esse contexto. Basta abrir uma sessão nova apontando
  pro repositório `caranovavidanova/sakura-system-ace`.

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
| Permissões por módulo | Checadas **na interface do app**, não reforçadas em RLS por categoria | Mais rápido de construir; ver seção 6 pro trade-off de segurança |
| RLS das tabelas de negócio | Exige **login** (`auth.uid() is not null`), mas não reforça permissão por módulo | Fecha o buraco de acesso sem login; reforço por módulo fica pra depois se o risco mudar (ex: sistema vendido pra terceiros) |
| Fluxo de Git **enquanto não existir uma v1.0 oficial publicada** | Criar/reusar uma branch de trabalho, commitar, abrir PR e **já mergear direto em `main`** ao final de cada tarefa — nunca deixar PR esperando aprovação manual | Pedido explícito da usuária. **Sempre informar no chat, em português simples, os comandos exatos e onde rodar cada um** depois do merge. Revisitar quando existir uma v1.0 publicada de verdade |
| Ir pra produção sem emissão fiscal pronta | A usuária já usa o sistema na borracharia (cadastro, OS, estoque, caixa) e continua emitindo nota fiscal por fora até a emissão automática ficar pronta | Desbloqueia o uso real sem esperar o projeto de integração fiscal (depende de escolher provedor + certificado digital) |
| Empacotamento do instalador Windows | Instalador simples (NSIS) + atualização automática via GitHub Releases (`electron-builder` + `electron-updater`) | Evita ter que reinstalar manualmente em cada loja toda vez que sair uma versão nova |
| Conexão com o Supabase no app instalado | Digitada na primeira abertura e guardada **naquele computador** (`conexao.json` na pasta de dados do app) — **não** embutida no build | Um instalador só passa a servir qualquer empresa (fase 2). Os secrets saíram do `release.yml` de propósito: embutidos, o instalador entregue a um cliente novo viria apontando pro banco de outra empresa. Em `npm run dev` o `.env` continua valendo. Ver seção 7 |
| Chave da IA (leitura de nota fiscal por foto) | Fica só como secret de uma Supabase Edge Function — nunca no app Electron instalado | Cada loja (projeto Supabase próprio) paga pela própria conta Anthropic, sem expor a chave a quem tem acesso ao computador. Ver seção 7 e item 8 da seção 8 |
| Quem paga a infraestrutura das lojas clientes (28/08/2026) | **Tudo na conta da usuária** — Supabase, Anthropic e Focus NFe. O dono da loja não cria conta em serviço nenhum e nunca vê que eles existem | Decisão explícita dela. É o que justifica a mensalidade e o que permite dar suporte de verdade; em troca, o dado dos clientes das lojas fica sob responsabilidade dela — daí o backup ser obrigatório, não opcional. **Substitui** o modelo antigo de "cada loja cria a própria conta Anthropic" descrito na linha acima e no item 6 da seção 8 |
| Plano do Supabase por empresa cliente (28/08/2026, corrigido em 10/09/2026) | **Pro desde a primeira venda** — mas a cobrança é **por organização, não por empresa**: US$25 cobre a organização com o 1º projeto, e cada projeto a mais custa a partir de US$10/mês | O plano grátis não guarda cópia de segurança automática — perder o dado de uma loja de terceiro seria muito pior que esse custo. **Os dois pontos que estavam "não confirmados" foram confirmados em 10/09/2026**: o grátis permite no máximo **2 projetos ativos por organização** e **pausa o projeto sozinho depois de 1 semana** sem uso. **Correção importante da conta antiga**: o "~R$145/mês por empresa" registrado aqui antes estava errado — 4 empresas numa organização só custam US$25 + 3×US$10 = US$55 (~R$280), não 4×US$145. Ver "Onde tudo parou (10/09/2026)" |
| Instalação de empresa nova | Um arquivo SQL único (`supabase/instalacao/instalacao-completa.sql`, gerado por `npm run gerar-instalacao`) + o checklist `supabase/instalacao/INSTALAR-LOJA-NOVA.md` | Colar as ~47 migrations uma por uma era o maior risco operacional da venda: pular uma ou trocar a ordem não dá erro na hora, só quebra depois na tela do app. Ver itens 36 e 37 da seção 6 |
| Site de apresentação (28/08/2026) | Pasta `site/` no próprio repositório, **HTML/CSS puros sem build**, publicado na Vercel com Root Directory = `site` | Uma página só não justifica um segundo `node_modules`; sem build não há risco de quebrar o build/teste do app, e a usuária consegue editar um texto sem rodar nada. Reaproveita a conexão da Vercel que já existia no repositório e só atrapalhava (check falhando nos PRs) |
| Nome do arquivo do instalador (28/08/2026) | Fixo: `SakuraSystem-Setup.exe` (`build.artifactName` no `package.json`), sem o número da versão | Permite ao site apontar pra um endereço permanente (`/releases/latest/download/SakuraSystem-Setup.exe`) que sempre entrega a última versão, sem editar o site a cada lançamento. Seguro pro auto-update: o `latest.yml` guarda o nome do arquivo, então a próxima versão já aponta sozinha pro nome novo |
| Preço no site (28/08/2026) | Mostrar **o que está incluído, sem valor fechado** — escolha dela, entre "sem preço nenhum" e "preço na cara" | O R$350/loja foi calculado pras 3 primeiras lojas (fase 2), não é preço de tabela; e a venda é pra conhecidos do pai dela, onde o valor pode variar caso a caso |
| Multi-loja: 1 projeto Supabase pode servir 2+ lojas | Tabela de junção `operador_lojas` (many-to-many, não uma coluna `loja_id` em `operadores`) + `usuario` continua único **globalmente** (não por loja) | Um dono/gerente pode ter acesso a mais de uma loja (o balconista só à dele); manter `usuario` global evita seletor de loja na tela de login e reescrever o esquema de e-mail sintético — ganho não compensa a complexidade pro tamanho de operação dela. Ver seção 5 |
| Multi-loja: o que é compartilhado entre lojas vs. o que é por loja | Compartilhado: `clientes`/`veiculos`, `pecas`, `servicos`, `categorias`/`categorias_servicos`/`categorias_caixa`, `fornecedores`. Por loja: estoque, caixa, OS, contas a pagar, notas fiscais, funcionários, `pedidos_compra`, as 4 configurações | Pedido explícito da usuária: catálogo único pra empresa toda (evita recadastro duplicado, cliente que frequenta 2 lojas fica com histórico único); só o que é fisicamente de cada loja fica separado |
| Gerenciamento de formulário | `react-hook-form` + `zod` — **migração concluída**, todo formulário do app já está nesse padrão | Pedido da usuária, baseado num plano de refatoração de outra IA (Gemini) — decisão explícita de que é o padrão geral, não um teste isolado. Ver "Padrão de formulário" na seção 4 |

## 4. Estrutura de pastas

```
amigao/                        (raiz do repositório GitHub: caranovavidanova/sakura-system-ace —
                                 renomeado nesta sessão, era "amigao"; a pasta local pode continuar
                                 se chamando "amigao" sem problema, é só o nome no GitHub que mudou)
├── electron/main.ts            # processo principal (janela, autoUpdater, abre DevTools em modo dev)
├── electron/preload.ts         # bridge (hoje só expõe versão do app)
├── src/
│   ├── main.tsx, App.tsx       # entrada React + rotas (App.tsx decide Login vs. app conforme sessão)
│   ├── contexts/AuthContext.tsx # sessão do Supabase Auth + perfil do operador logado (hook useAuth)
│   ├── components/              # Sidebar.tsx, Logo.tsx, MiniCalendario.tsx, PermissaoRoute.tsx
│   │                             # (guarda de rota por permissão), Modal.tsx (modal genérico,
│   │                             # usado por previews de NFe/NFS-e/Garantia), BotaoVoltar.tsx
│   │                             # (sem onClick vira ícone de casinha e navega pro Início; com
│   │                             # onClick vira seta), SecaoRecolhivel.tsx (acordeão, usado em
│   │                             # Configurações), GraficoBarras.tsx / GraficoRadar.tsx (SVG puro,
│   │                             # usados em Relações), VeiculoIcone.tsx (ícone por tipo de
│   │                             # veículo, pintado com a cor cadastrada), AreaRolavel.tsx (barra
│   │                             # de rolagem 100% customizada, ver seção 2), AcoesDaLinha.tsx
│   │                             # (ações de linha de lista: botão de ícone de 32x32 pro que é
│   │                             # do dia a dia + menu de três pontinhos pro que não dá pra
│   │                             # desfazer — ver item 51 da seção 6), LojaSwitcher.tsx
│   │                             # (seletor de loja ativa, só aparece com 2+ lojas — fica no
│   │                             # rodapé da Sidebar), VersaoApp.tsx (mostra a versão do app,
│   │                             # pequena, no canto inferior direito, lendo
│   │                             # window.sakuraApp.version exposto pelo preload), Combobox.tsx
│   │                             # (select com busca por digitação — abre mostrando a lista
│   │                             # inteira, mas deixa filtrar digitando; usado em todo select do
│   │                             # app cuja lista vem de dado dinâmico — peça, serviço, cliente,
│   │                             # veículo, técnico/vendedor, categoria etc. — ver seção 6 sobre o
│   │                             # bug de clique já corrigido nele; ganhou a opção `permitirLivre`
│   │                             # nesta sessão — quando ligada, aceita digitar um valor que não
│   │                             # está na lista de sugestões em vez de exigir escolher uma opção,
│   │                             # usado hoje só na Marca do veículo, ver seção 7 "Clientes"),
│   │                             # AvisoRascunho.tsx (faixa "restaurar rascunho não salvo?", usada
│   │                             # por todo formulário com auto-save — ver hooks abaixo)
│   ├── hooks/useEnterParaProximoCampo.ts  # Enter avança pro próximo campo em qualquer <form>
│   │                             # do app (em vez de tentar submeter) — aplicado uma única vez,
│   │                             # globalmente, em App.tsx + useLimparDataAoApagar.ts (nesta
│   │                             # sessão — Backspace/Delete num campo de data limpa o campo
│   │                             # inteiro em vez de não fazer nada, mesmo padrão de aplicação
│   │                             # global em App.tsx; ver item 27 da seção 6)
│   │                             # + useRascunhoFormulario.ts (auto-save local a cada 30s; o hook
│   │                             # `useRascunho` junta autosave + restaurar/descartar, usado por
│   │                             # OS, Cliente, Funcionário, Produto e Pedido de Compra)
│   ├── lib/                     # supabase.ts + conexao.ts (decide com qual Supabase/empresa este
│   │                             # computador fala — ver "Conexão com o banco" na seção 7)
│   │                             # + datas.ts (hojeLocal()/diaLocal() — o dia no fuso de quem usa,
│   │                             # nunca toISOString(), que é UTC; ver itens 34 e 42 da seção 6)
│   │                             # + zip.ts (monta .zip sem biblioteca externa, usado pra baixar
│   │                             # os XMLs de um mês de uma vez — ver "Notas Fiscais" na seção 7)
│   │                             # + um arquivo por entidade (clientes.ts, pecas.ts,
│   │                             # servicos.ts, estoque.ts, ordensServico.ts, caixa.ts,
│   │                             # operadores.ts, funcionarios.ts, notasFiscais.ts, auth.ts,
│   │                             # errors.ts, categorias.ts, categoriasCaixa.ts, categoriasServico.ts,
│   │                             # contagens.ts, garantias.ts, contasPagar.ts, lojas.ts, depositos.ts
│   │                             # (locais físicos de estoque dentro de uma loja — mesmo padrão CRUD
│   │                             # de lojas.ts, mas sem exclusão de verdade; expõe também
│   │                             # buscarDepositoPadraoId(), usada por lib/estoque.ts e por qualquer
│   │                             # fluxo que baixa/dá entrada em estoque sozinho sem perguntar "em
│   │                             # qual depósito" pro operador, ver seção 5) — lojas.ts e todo lib de
│   │                             # tabela per-loja recebem `lojaId` explícito nas funções de
│   │                             # listar/criar) + feriados.ts (feriados
│   │                             # nacionais, Páscoa calculada) + configuracoes.ts (juros de
│   │                             # parcelamento + texto de garantia + dados fiscais da loja, agora
│   │                             # uma linha por loja, filtradas por `lojaId`) +
│   │                             # garantiaTexto.ts + garantiaDocumento.ts (HTML da garantia) +
│   │                             # notaFiscalXml.ts (recibo HTML "versão para o cliente" a partir
│   │                             # do XML) + focusNfe.ts (integração com o Focus NFe — emissão
│   │                             # de NFC-e/NFS-e, ver seção 8 item 1) + corVeiculo.ts (nome de cor em
│   │                             # português → hex aproximado) + origemMercadoria.ts (lista de
│   │                             # códigos de origem da mercadoria, 0 a 8) + iaNotaFiscal.ts
│   │                             # (chama a Edge Function de leitura de nota fiscal por foto) +
│   │                             # fornecedores.ts + pedidosCompra.ts + cotacoesPecas.ts (histórico
│   │                             # de preço por fornecedor, ver "Cotação de peças" na seção 7) +
│   │                             # notaFiscalXmlFornecedor.ts (lê o XML de NFe que o fornecedor
│   │                             # emite pra loja — puro parsing com `DOMParser`, sem IA nem Edge
│   │                             # Function, é formato público/estável do governo — usado pelo
│   │                             # "Importar XML de nota fiscal" em Pedidos de Compra, ver seção
│   │                             # 7; módulo de Fornecedores) +
│   │                             # auditoria.ts (só leitura — `listarAuditoria`, filtra por
│   │                             # tabela/operador; a escrita é 100% via trigger de banco, ver
│   │                             # seção 5) + marcasVeiculo.ts (nesta sessão — lista estática de
│   │                             # ~80 montadoras, usada só como sugestão no Combobox de Marca do
│   │                             # veículo, ver seção 7 "Clientes")
│   ├── pages/<modulo>/           # uma pasta por módulo: painel, clientes, estoque, fornecedores,
│   │                             # servicos, ordens-servico, caixa, contas-pagar, relatorios (rota
│   │                             # /relatorios, label "Relações" — abas Gráficos/Lucratividade,
│   │                             # absorveu o antigo módulo "Lucratividade"), garantias,
│   │                             # notas-fiscais, funcionarios, auditoria (admin-only, sem entrada
│   │                             # em MODULOS — acesso via ícone no rodapé da Sidebar, igual
│   │                             # Configurações, não é permissão de operador comum), login,
│   │                             # conexao (só ConexaoPage.tsx — tela de conectar ao banco da
│   │                             # empresa, aparece no lugar do login enquanto não há conexão
│   │                             # salva; sem permissão nem rota, é decidida em App.tsx),
│   │                             # configuracoes. Cada pasta tem
│   │                             # <Modulo>Page.tsx (lista) + <Modulo>Form.tsx (formulário), com
│   │                             # exceções:
│   │   login/          # LoginPage.tsx + TrocarSenhaPage.tsx (nesta sessão — tela cheia,
│   │                   # bloqueante, aparece no lugar do app normal quando
│   │                   # `operador.deve_trocar_senha` é true; ver "Login e permissões" na seção 7)
│   │   clientes/       # ClienteForm.tsx (orquestrador, ~100 linhas) + campos/ (DadosClienteFields,
│   │                   # EnderecoFields, VeiculosFields — este último usa useFieldArray, com um
│   │                   # `<input type="hidden">` pro `id` do veículo existente, ver seção 4).
│   │                   # **Segundo módulo migrado** pro padrão `react-hook-form` + `zod`.
│   │   estoque/       # EstoquePage.tsx com 4 abas: Produtos (ProdutosSection.tsx + PecaForm.tsx —
│   │                   # orquestrador, ~80 linhas, terceiro módulo migrado pro padrão
│   │                   # react-hook-form + zod — + campos/ com DadosCadastraisFields,
│   │                   # TributosFields, PrecosFields (custo/margem%/preço final calculados entre
│   │                   # si, ver schemas/peca.ts) + ImportarNotasFiscaisModal.tsx — leitura por
│   │                   # foto), Movimentações (MovimentacoesSection.tsx + MovimentoForm.tsx),
│   │                   # Contagem (ContagemSection.tsx — inventário físico), Relatórios
│   │                   # (RelatoriosEstoqueSection.tsx). Sem módulo "Peças" separado.
│   │   fornecedores/   # FornecedoresPage.tsx (orquestrador de abas) com abas "Cadastro"
│   │                   # (FornecedoresSection.tsx + FornecedorForm.tsx, igual padrão
│   │                   # Clientes/Serviços) e "Pedidos de compra" (PedidosCompraSection.tsx +
│   │                   # PedidoCompraForm.tsx — itens via useFieldArray, igual OS — +
│   │                   # PedidoCompraItemRow.tsx, mesmo espírito do ItemOSRow.tsx: mostra as
│   │                   # cotações anteriores daquela peça por fornecedor ao escolher a peça, com
│   │                   # botão "usar esse preço" — + ReceberPedidoModal.tsx +
│   │                   # ImportarNotaFiscalXmlModal.tsx — lê o XML da nota fiscal do fornecedor e
│   │                   # já cria um pedido "recebido" com entrada de estoque e cotação, ver seção
│   │                   # 7)
│   │   garantias/      # GarantiasPage.tsx é só lista (deriva de ordens_servico_itens +
│   │                   # pecas.prazo_garantia_dias, sem tabela própria)
│   │   servicos/       # catálogo de serviços, só lista + form (com categoria via
│   │                   # categorias_servicos), sem abas
│   │   ordens-servico/ # OrdemServicoForm.tsx (orquestrador, ~240 linhas — quarto módulo migrado
│   │                   # pro padrão react-hook-form + zod, ver "Padrão de formulário" na seção 4)
│   │                   # + campos/ (DetalhesFields, ItensFields — usa useFieldArray pros itens
│   │                   # novos da OS, itens já lançados continuam só leitura) + ItemOSRow.tsx
│   │                   # (linha de peça/serviço — trocar peça/serviço auto-preenche descrição e
│   │                   # preço, select fica controlado via watch/setValue em vez de register, ver
│   │                   # seção 4) + FaturamentoCard.tsx (faturamento com parcelas calculadas, ainda
│   │                   # não migrado) + FechamentoTab.tsx (NFC-e/NFS-e + garantia, só aparece com
│   │                   # status concluída/faturada) + GarantiaVisualModal.tsx
│   │   configuracoes/  # JurosParcelasSection.tsx, CategoriasSection.tsx, CategoriasCaixaSection.tsx,
│   │                   # CategoriasServicoSection.tsx, TextoGarantiaSection.tsx,
│   │                   # DadosFiscaisSection.tsx, CartoesInicioSection.tsx (todas dentro de
│   │                   # SecaoRecolhivel e recebem `lojaId` — dado por loja agora); LojasSection.tsx
│   │                   # (criar/inativar lojas, sempre visível, mesmo padrão do card Operadores);
│   │                   # OperadorForm.tsx ganhou multi-select de lojas (só aparece com 2+ lojas)
│   │   funcionarios/   # FuncionariosPage.tsx (orquestrador de abas Cadastro/Comissões) +
│   │                   # FuncionariosSection.tsx (lista + formulário) + ComissoesSection.tsx
│   │                   # (comissão por funcionário, veio de relatorios/ em 03/09/2026 — ver
│   │                   # seção 7) + FuncionarioForm.tsx (orquestrador enxuto, ~140 linhas) com abas "Dados
│   │                   # gerais" e "Família" + campos/ (um componente por grupo de campos:
│   │                   # IdentificacaoFields, DocumentosFields, EnderecoFields, ContatoFields,
│   │                   # CargoAdmissaoFields, FiliacaoFields, ConjugeFields, FilhosFields — este
│   │                   # último usa useFieldArray do react-hook-form pra lista dinâmica de filhos
│   │                   # — + FormCompartilhado.tsx com Secao/Campo/inputClasse reaproveitados).
│   │                   # **Primeiro módulo migrado pro padrão novo de formulário** (react-hook-form
│   │                   # + zod, ver "Padrão de formulário" logo abaixo) — referência pra migrar os
│   │                   # demais formulários do app quando for a vez deles.
│   │   caixa/          # CaixaPage.tsx (orquestrador de abas) + DiarioSection.tsx +
│   │                   # EntradaSaidaSection.tsx (reusado por Entradas/Saídas, parametrizado por tipo)
│   │   notas-fiscais/  # NotasFiscaisPage.tsx com abas NFe/NFS-e + ArquivosSection.tsx +
│   │                   # NotaFiscalVisualModal.tsx (recibo "versão para o cliente")
│   │   contas-pagar/   # ContasPagarPage.tsx + ContaPagarForm.tsx + PagarContaModal.tsx
│   │   contas-receber/ # ContasReceberPage.tsx + ReceberContaModal.tsx + ContaReceberForm.tsx
│   │                   # (nasce sozinha ao faturar uma OS escolhendo "a receber", e desde esta
│   │                   # sessão também dá pra lançar à mão, igual Contas a Pagar)
│   │   relatorios/     # RelatoriosPage.tsx (orquestrador de abas) + GraficosSection.tsx (barras +
│   │                   # radar, ex-conteúdo do antigo módulo "Relatórios") + LucratividadeSection.tsx
│   │                   # (margem por peça/serviço, ex-módulo "Lucratividade" separado, agora conta o
│   │                   # custo de serviço também, não só de peça). A aba Comissões morava aqui e
│   │                   # foi pra funcionarios/ em 03/09/2026.
│   ├── schemas/                  # esquemas zod de validação de formulário + funções de mapeamento
│   │                             # form↔banco, e as contas de dinheiro como funções puras
│   │                             # testáveis (metricasCaixa.ts — lucro/custo/ticket médio
│   │                             # compartilhados; faturamento.ts — juros/parcelas/rateio;
│   │                             # comissoes.ts — comissão por vendedor e por técnico;
│   │                             # dinheiro.ts — paraCentavos/deCentavos/arredondarCentavo/somar,
│   │                             # as contas de centavo num lugar só: a MESMA expressão de
│   │                             # arredondamento estava copiada 12 vezes em 7 arquivos, ver
│   │                             # item 49 da seção 6) + arquitetura.test.ts (não testa conta
│   │                             # nenhuma — varre src/pages/ e reprova conta de dinheiro escrita
│   │                             # dentro de uma tela, item 49)
│   │                             # (ex: funcionario.ts — paraValoresFormulario,
│   │                             # paraNovoFuncionario, paraFilhosPreenchidos). Pasta nova —
│   │                             # `funcionario.ts`, `cliente.ts`, `peca.ts` até agora (este último
│   │                             # também guarda o cálculo custo↔margem%↔preço final) — ver
│   │                             # "Padrão de formulário" abaixo.
│   ├── styles/globals.css       # paleta Sakura System (Tailwind v4 @theme)
│   └── types/                    # um arquivo por entidade + loja.ts (Loja, NovaLoja) +
│                                  # configuracao.ts (JurosParcela, ConfiguracaoGarantia,
│                                  # ConfiguracaoFiscalLoja — todas com `loja_id` no lugar do antigo
│                                  # `id: 1`, ver seção 5) + itemNotaFiscal.ts (item extraído da
│                                  # leitura por IA) + cotacaoPeca.ts (histórico de preço por
│                                  # fornecedor, sem `loja_id` — compartilhado, ver seção 7) +
│                                  # notaFiscalXmlFornecedor.ts (item extraído do XML de NFe do
│                                  # fornecedor — não confundir com itemNotaFiscal.ts, que é o
│                                  # item da leitura por foto/IA)
├── supabase/migrations/          # SQL numerado sequencialmente (0001 a 0049), todas idempotentes
├── supabase/instalacao/          # instalacao-completa.sql (as 49 migrations concatenadas num
│                                  # arquivo só, pra instalar empresa nova colando UMA vez — GERADO
│                                  # por `npm run gerar-instalacao`, não editar à mão) +
│                                  # INSTALAR-LOJA-NOVA.md (o checklist que ela segue de verdade ao
│                                  # vender: banco, Auth, primeiro admin, app, configuração inicial,
│                                  # e o que costuma dar errado). Ver seção 9
├── supabase/scripts/             # SQL de uso único, NÃO faz parte da sequência de migrations —
│                                  # stub-supabase-local.sql (cria os schemas auth/storage e as
│                                  # permissões que o Supabase dá sozinho, pra validar migrations e
│                                  # testar RLS num Postgres local — NUNCA rodar no Supabase real) +
│                                  # limpar-dados-de-teste.sql (apaga dados de negócio de teste,
│                                  # preserva login/config; ver seção 5) + excluir-os-teste-eduarda.sql
│                                  # (uso único, criado numa sessão pra apagar as OS de teste abertas
│                                  # em nome de "Eduarda Cristina" na loja real, sem tocar no cadastro
│                                  # do cliente/veículo — ver "Empacotamento"/nota fiscal na seção 7/8)
│                                  # + excluir-os-teste-nfse-producao.sql (mesmo padrão, preparado
│                                  # nesta sessão pra limpar a OS usada no teste de NFS-e em PRODUÇÃO
│                                  # sugerido pelo suporte da Focus NFe — troca o número da OS antes
│                                  # de rodar; ver item 1 da seção 8)
├── supabase/functions/           # Edge Functions (Deno) — ler-notas-fiscais/index.ts: lê fotos ou
│                                  # PDFs de nota fiscal via Claude/Anthropic e devolve os produtos
│                                  # estruturados (a ANTHROPIC_API_KEY fica só como secret dessa
│                                  # função no Supabase, nunca no app instalado); e
│                                  # redefinir-senha-operador/index.ts (nesta sessão): admin gera
│                                  # senha temporária pra outro operador — usa a service role key
│                                  # (só o Supabase injeta sozinha, sem secret manual pra
│                                  # configurar), ver "Login e permissões" na seção 7.
├── site/                         # site de apresentação (HTML/CSS puros, SEM etapa de build —
│                                  # de propósito: uma página só não justifica um segundo
│                                  # node_modules, e assim não atrapalha build/teste do app).
│                                  # index.html (todo o texto), styles.css (mesma paleta do app),
│                                  # telas/*.jpg (imagens do sistema com dados inventados),
│                                  # ferramentas/ (abre o app de verdade num navegador com o
│                                  # Supabase respondido por dados inventados, e fotografa as
│                                  # telas — ver site/README.md): banco-falso.mjs (o Supabase de
│                                  # mentira, compartilhado) + dados-demo.mjs (os dados
│                                  # inventados, cobrem TODAS as tabelas) + gerar-telas.mjs (as
│                                  # 5 imagens do site) + gerar-catalogo-telas.mjs (as 54 telas
│                                  # do sistema, inclusive formulários/abas/janelas que só
│                                  # aparecem depois de clicar; escreve junto um catalogo.json
│                                  # com título e explicação de cada uma — ver "Onde tudo parou
│                                  # (10/09/2026)"), README.md (como ver, publicar na Vercel e
│                                  # regerar as imagens)
├── build/icon.png                # ícone do app (1024x1024, gerado a partir de public/sakura-icon.svg)
├── scripts/gerar-instalacao-completa.mjs # `npm run gerar-instalacao` — regera
│                                  # supabase/instalacao/instalacao-completa.sql a partir das
│                                  # migrations. Rodar SEMPRE que criar uma migration nova; o
│                                  # `npm test` reprova se o arquivo estiver desatualizado
│                                  # (scripts/gerar-instalacao-completa.test.ts)
├── scripts/varredura-contraste.mjs # `npm run contraste` — procura combinação de fundo/letra
│                                  # ilegível nas classes do app (sobra do tema claro antigo), ver
│                                  # item 17 da seção 6
├── scripts/testar-nos-dois-fusos.mjs # `npm run test:fusos` — roda a suíte DUAS vezes, em
│                                  # America/Sao_Paulo e em UTC. Está em .mjs porque
│                                  # `TZ=x npm test` não funciona no PowerShell do Windows dela.
│                                  # Ver item 48 da seção 6
├── .github/workflows/ci.yml      # CI — roda em todo push/PR as cinco checagens que antes eram
│                                  # feitas à mão: typecheck, lint, testes nos dois fusos,
│                                  # contraste e "o instalacao-completa.sql está em dia?". Tem um
│                                  # segundo job ("segredos") que varre credencial e barra
│                                  # certificado digital versionado. NÃO builda o instalador
│                                  # (isso é do release.yml). Ver item 48 da seção 6
├── .github/workflows/release.yml # builda + publica o instalador Windows no GitHub Releases quando uma tag "v*" é enviada
│                                  # (NÃO embute mais a conexão do Supabase — ver seção 7)
├── .gitleaks.toml                # regras da varredura de segredo do CI. Tem 3 regras próprias
│                                  # além das de fábrica, porque as de fábrica deixavam passar
│                                  # justamente `sb_secret_...` (Supabase) e `sk-ant-...`
│                                  # (Anthropic) — testado, não suposto. Ver item 49 da seção 6
├── eslint.config.js              # flat config do ESLint 9 — além das regras de hooks, tem a
│                                  # trava contra cortar o dia de um timestamp em UTC
│                                  # (`no-restricted-syntax`), ver item 48 da seção 6
├── vitest.config.ts              # config de teste separado do vite.config.ts de propósito (não
│                                  # carrega os plugins do Electron, que não fazem sentido numa
│                                  # rodada de teste unitário puro) — `npm test` roda uma vez,
│                                  # `npm run test:watch` fica observando arquivo mudar. Testes
│                                  # ficam ao lado do arquivo testado (`<arquivo>.test.ts`), não
│                                  # numa pasta `__tests__` separada.
├── MELHORIAS.md                  # GUIA DE MELHORIAS (11/09/2026) — um cardápio priorizado de mais
│                                  # de cem sugestões: 12 eixos transversais (TR-nn), as 54 telas
│                                  # uma a uma (TL-nn), 15 funcionalidades que faltam (FN-nn) e um
│                                  # roteiro em 5 etapas. Cada item tem prompt pronto, critério de
│                                  # aceite e um "não mexer".
│                                  # **NÃO é ordem de execução** — ela escolhe o que entra em cada
│                                  # sessão, pelo código do item (ex: "faz o TR-11.1").
│                                  # **De propósito, este arquivo NÃO é carregado sozinho** (não
│                                  # está nos `@imports` do CLAUDE.md): são 227 KB, que em toda
│                                  # sessão nova gastariam contexto que faz falta pro trabalho de
│                                  # verdade. Abrir só quando ela citar um item ou pedir sugestão
│                                  # de próximo passo.
│                                  # A Etapa 1 dele já foi feita (ver "onde parou", 11/09/2026).
├── CHANGELOG.md                  # fechado até [0.1.3] - 2026-07-29; segue tudo em v1.0.0 não tagueada
└── .env (local, não commitado)   # VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY (chave "anon"/publishable)
```

**Padrão de código estabelecido** (seguir em módulos novos):

- Cada entidade tem: `types/<entidade>.ts` (interfaces + tipo `Novo<Entidade>`), `lib/<entidade>.ts`
  (funções `listar`, `criar`, `excluir` usando o client `supabase`), `pages/<modulo>/<Modulo>Page.tsx`
  (lista + estado de carregamento/erro) e `<Modulo>Form.tsx` (formulário controlado).
- Erros do Supabase **não são `instanceof Error`** — sempre usar `mensagemDeErro()` de
  `src/lib/errors.ts` para exibir a mensagem real.
- **Nunca usar `window.prompt()`** — Electron não suporta. `alert()` e `confirm()` funcionam bem.
- Toda tabela nova precisa de RLS + policy (ver seção 6 sobre a dívida técnica de segurança).
- Ao criar valores default a partir de variáveis de ambiente (`import.meta.env.VITE_*`), usar `||`
  e não `??` — o Vite injeta variáveis ausentes como **string vazia**, não `undefined`, e `??` só
  substitui `null`/`undefined` (ver bug corrigido na seção 6, item 8).
- Toda migration que se diz "idempotente" precisa dropar o nome **final** da policy/objeto antes
  de criar (não só o nome antigo que está substituindo) — ver item 13 da seção 6.

**Padrão de formulário — `react-hook-form` + `zod`, migração concluída**: decisão tomada pela
usuária (a partir de um plano de refatoração escrito por outra IA, Gemini, fora desta sessão) de
que esse é o jeito **padrão** de construir formulários no app, substituindo o padrão antigo
(`useState` bruto por campo + função `campo()`/`setDados()` genérica). **Todo formulário do app já
foi migrado** (nesta e na sessão anterior): `FuncionarioForm.tsx`, `ClienteForm.tsx`,
`PecaForm.tsx`, `OrdemServicoForm.tsx` (o mais complexo, itens de peça/serviço via
`useFieldArray`), `OperadorForm.tsx` (checkbox de permissões/lojas via array nativo do RHF),
`ServicoForm.tsx`, `CaixaForm.tsx`, `MovimentoForm.tsx`, `ContaPagarForm.tsx`,
`PagarContaModal.tsx`, `ReceberContaModal.tsx`, `LojasSection.tsx` (dois `useForm` — cadastro novo
+ edição inline por loja, cada card de edição remonta com dados próprios em vez de um `reset()`
manual) e `FaturamentoCard.tsx` (o mais carregado de cálculo — juros/parcelas/split de pagamento
viraram funções puras em `schemas/faturamento.ts`, testáveis fora do componente). É, desde então,
o padrão que a skill `/gerar-modulo` deveria seguir também — conferir se já gera nesse formato ao
usá-la de novo. Convenção estabelecida no piloto, seguida em todos:
  - Schema de validação zod + funções de mapeamento form↔banco ficam em `src/schemas/<entidade>.ts`
    (não junto do componente): `<entidade>FormSchema`, `paraValoresFormulario(existente?)` (banco →
    formulário), `para<Entidade>(valores)` (formulário → banco, convertendo `""` pra `null` e string
    numérica pra `number`).
  - O formulário em si vira um **orquestrador** (`useForm` + abas/estado de UI + `handleSubmit`),
    delegando os campos pra componentes menores em `<modulo>/campos/<Grupo>Fields.tsx`, cada um
    recebendo `register` (e `control`, só quando precisa de `useFieldArray` — caso de listas
    dinâmicas tipo "filhos" ou "veículos").
  - `Secao`/`Campo`/`inputClasse` (os wrappers visuais de sempre) viram um arquivo só,
    `<modulo>/campos/FormCompartilhado.tsx`, reaproveitado por todos os grupos de campos daquele
    módulo (cada módulo tem o seu próprio — não compartilhado entre módulos diferentes, de
    propósito, pra não acoplar Clientes e Funcionários por causa de um wrapper visual).
  - **Item de lista dinâmica que tem `id` de banco (ex: veículo de um cliente) precisa de um
    `<input type="hidden">` registrado pro campo `id`** dentro do `useFieldArray`, mesmo ele nunca
    aparecendo pro usuário — sem isso, dar "Adicionar"/"Remover" no meio da lista arrisca perder o
    `id` original e recriar a linha no banco, desconectando referências de outra tabela (caso real:
    `veiculos.id` referenciado por `ordens_servico.veiculo_id`, ver `VeiculosFields.tsx`).
  - **Campos que se recalculam entre si** (ex: custo → margem % → preço final em `PecaForm.tsx`)
    não dá pra resolver só com `register` — usam `watch()` (ler o valor atual de outro campo) +
    `setValue()` (escrever no campo derivado) dentro de um `onChange` customizado, com a conta em
    si isolada como função pura no `schemas/<entidade>.ts` (`precoAPartirDaMargem`/
    `margemAPartirDoPreco` em `schemas/peca.ts`), não dentro do componente.
  - **Select com valor "sentinela" que não existe de verdade no dado** (ex: "Serviço avulso" no
    item de OS, que na prática é `servico_id` vazio/nenhum) **não dá pra registrar direto via
    `register()`** — mutar `e.target.value` (como no truque de maiúsculas do `uf`/`estado`) faz o
    `<select>` "desmarcar" visualmente porque o valor não bate com nenhuma `<option>`. Nesse caso,
    deixar o campo **controlado de verdade** (`value={watch(...)}` + `onChange` chamando
    `setValue()` com a tradução do sentinela pro valor real), sem passar `register()` nesse
    elemento — funciona sem `Controller`, só com `watch`/`setValue` (ver `ItemOSRow.tsx`, troca de
    peça/serviço/tipo do item da OS).

**Skill `/gerar-modulo`** (`.claude/skills/gerar-modulo/SKILL.md`): automatiza a criação de um
módulo novo inteiro (migration + types + lib + página + form + registro em `MODULOS`/`App.tsx`)
seguindo esse padrão de código. Uso: `/gerar-modulo <Nome do módulo>`. Preferir essa skill a fazer
o andaime manualmente sempre que o pedido for "módulo/cadastro novo".

## 5. Modelagem de dados (Supabase / Postgres) — como está hoje

Migrations `0001` a `0036` em `supabase/migrations/` já estão confirmadas rodando sem erro no
projeto Supabase da usuária (ref `rlgdjiowvnfzsedehyga`) — incluindo a fundação multi-loja
(`0031`-`0033`, que ela testou de verdade: criou uma 2ª loja, foi quando apareceu o bug de RLS
descrito no `0034` abaixo) e a correção + módulos novos (`0034` a `0036`, criadas e validadas
localmente nesta sessão — Postgres local, `service postgresql start` + `sudo -u postgres psql`,
rodando a sequência inteira do zero e confirmando idempotência — e já rodadas por ela no Supabase
real logo em seguida). **`0037`, criada e validada localmente na mesma sessão, também já foi
confirmada rodando no Supabase real dela.** Resumo das últimas:
- `0028`: migra quem só tinha a permissão "Lucratividade" liberada (sem "Relações").
- `0029`: cria `categorias_servicos` + coluna `servicos.categoria_id`.
- `0030`: semeia categorias de peça/serviço padrão e ~17 serviços padrão (sem preço), baseados
  numa ficha de orçamento de referência do ramo — nenhuma "peça" é criada (exigiria dado fiscal
  real, que não dá pra inventar com segurança).
- `0031`/`0032`/`0033`: **fundação multi-loja** — ver subseção "Multi-loja" logo abaixo pro
  desenho completo. Resumo: cria `lojas` + `operador_lojas`; adiciona `loja_id` nas tabelas
  operacionais; converte as 4 tabelas de configuração de singleton pra "1 linha por loja"; reescreve
  toda a RLS pra checar acesso à loja (não só login). A loja real dela vira "Loja 1" via backfill
  automático — nenhum dado existente é perdido.
- `0034`: corrige um bug real de RLS que impedia criar uma loja nova pelo app (a policy de
  `operador_lojas` exigia já ser admin da loja alvo pra se vincular a ela — impossível pra uma loja
  recém-criada, que ainda não tem ninguém vinculado). Também reconecta automaticamente qualquer
  loja que tenha ficado "órfã" (criada, mas sem ninguém vinculado) por causa desse bug.
- `0035`: adiciona `custo` a `servicos` (mesmo padrão de `pecas.preco_custo`) — sem isso, a aba
  Lucratividade sempre considerava o custo de serviço como zero.
- `0036`: cria `contas_receber` — ver módulo "Contas a Receber" na seção 7.
- `0037`: três mudanças pedidas pela usuária depois de usar o sistema na prática — (a) número
  sequencial por loja em `ordens_servico.numero` (1, 2, 3... por loja, via trigger `before insert`,
  em vez do UUID cortado que aparecia como "OS #a0270a6e"); (b) simplifica `status` da OS, removendo
  "aberta" como estado distinto de "em_andamento" (toda OS nova já nasce "em_andamento"); (c) remove
  a trava de "1 lançamento de Caixa por OS" (`caixa_movimentos_ordem_id_idx_unique`), permitindo
  faturar dividindo entre mais de uma forma de pagamento (1 lançamento por forma usada). Corrige
  também, de brinde, um bug real encontrado testando a exclusão de loja: nunca existiu policy de
  RLS pra `DELETE` em `lojas` (só select/insert/update) — sem policy nenhuma cobrindo o comando, o
  delete "funcionava" sem erro nenhum, mas apagava 0 linhas (bug silencioso, sem mensagem de erro
  nenhuma). Ver item 15 da seção 6.
- `0038`: adiciona `operadores.deve_trocar_senha` (bool, default `false`) — suporte pra
  redefinição de senha esquecida (ver "Login e permissões" na seção 7).
- `0039`: cria o módulo de Fornecedores — `fornecedores` (compartilhado), `pedidos_compra` (por
  loja, número sequencial via trigger, mesmo padrão de `ordens_servico.numero`) e
  `pedidos_compra_itens` (sem `loja_id` próprio, herda via `pedido_compra_id`, mesmo padrão de
  `ordens_servico_itens`). Ver "Fornecedores" na seção 7.
- `0040`: cria a trilha de auditoria — tabela genérica `auditoria` + função `registrar_auditoria()`
  (trigger, `security definer`) aplicada via `UPDATE`/`DELETE` num conjunto de tabelas sensíveis
  (`operadores`, `pecas`, `servicos`, `caixa_movimentos`, `contas_pagar`, `contas_receber`,
  `ordens_servico`, `clientes`, `fornecedores`, `pedidos_compra`, `lojas`). Ver "Auditoria" na
  seção 7.
- `0041` (criada e validada localmente nesta sessão — Postgres local, rodada duas vezes pra provar
  idempotência, e com um teste manual de RLS trocando de papel/`auth.uid()` simulado pra confirmar
  que balconista só vê depósito da própria loja e só admin cria/edita; **já rodada e confirmada por
  ela no Supabase real**): cria o cadastro de Depósito — tabela `depositos` (locais físicos de
  estoque dentro de uma loja, ex: "Depósito Principal", "Fundos") + `deposito_id` em
  `estoque_movimentos` e `contagens_estoque` (mesmo padrão nullable → backfill → not null das
  migrations 0031-0033 pra `loja_id`). Toda loja (já existente, via backfill dinâmico por loja —
  testado com 2 lojas simuladas, não só a Loja 1 — ou criada depois desta migration, via
  `lib/lojas.ts` → `criarLoja()`) já nasce com um "Depósito Principal" sozinho, então nada muda pra
  quem usa um só lugar físico. Ver "Depósitos" na seção 7 e a subseção logo abaixo dos tipos de
  `estoque_movimentos`/`contagens_estoque`.
- `0042` (criada e validada localmente numa sessão anterior — Postgres local, rodada duas vezes pra
  provar idempotência, RLS conferida com `authenticated`/`auth.uid()` simulado; **já confirmada
  rodando no Supabase real dela**): cria `cotacoes_pecas` — histórico de preço por fornecedor
  (peça, fornecedor, preço, data), compartilhado entre lojas (mesmo padrão RLS de `fornecedores`:
  qualquer logado lê/grava, sem escopo de loja). Gravado sozinho pelo app a cada Pedido de Compra
  com preço (não tem formulário próprio) — ver "Cotação de peças" na seção 7.
- `0043` (criada nesta sessão, validada localmente num Postgres local — rodada duas vezes pra
  provar idempotência — e **já confirmada rodando no Supabase real dela**): adiciona
  `contas_pagar.recorrente_ate` (date, opcional). Sem valor, uma conta recorrente continua sendo
  recriada pra sempre ao pagar (comportamento de sempre); preenchido, `pagarConta()`
  (`lib/contasPagar.ts`) para de criar a próxima ocorrência quando o próximo vencimento passar
  dessa data. Ver "Contas a Pagar" na seção 7.
- `0044` (criada nesta sessão, validada num Postgres local — rodada duas vezes pra provar
  idempotência —, **já confirmada rodando no Supabase real dela**): adiciona 4 colunas opcionais a
  `configuracoes_fiscais_loja`, só usadas na emissão de NFS-e — `codigo_municipio` (IBGE da
  cidade da loja), `item_lista_servico` (código da LC 116/2003, default `'14.01'`),
  `aliquota_iss`, `codigo_tributario_municipio`. NFC-e não depende de nenhuma delas. Ver item 1 da
  seção 8.
- `0045`: adiciona `clientes.codigo_municipio` (código IBGE), preenchido sozinho junto com o resto
  do endereço quando o CEP é buscado — evita digitar esse código toda vez que emite uma NFS-e pro
  mesmo cliente.
- `0046` (criada nesta sessão, validada num Postgres local — rodada duas vezes pra provar
  idempotência — **ainda não rodada por ela**): adiciona `notas_fiscais_arquivos.focus_nfe_ref` —
  guarda a referência que a Focus NFe usa pra identificar a nota, gerada na hora da emissão
  automática. Sem essa coluna, não tinha como cancelar uma nota emitida automaticamente depois
  (ver botão "Cancelar nota" na seção 7, módulo "Notas Fiscais").
- `0047` (criada nesta sessão, validada num Postgres local — rodada duas vezes pra provar
  idempotência — **ainda não rodada por ela**): adiciona `configuracoes_fiscais_loja.codigo_cnae`
  — campo exigido por Araraquara (e provavelmente outras prefeituras) pra autorizar a NFS-e, que o
  Sakura System não pedia nem mandava. Ver item 1 da seção 8.
- `0048` (criada em 11/09/2026, validada num Postgres local — a sequência inteira rodada três
  vezes do zero, e a migration sozinha duas vezes num banco no estado 0047 **com dado plantado**
  — **rodada e confirmada por ela no Supabase real em 11/09/2026**): declara a precisão de 5 colunas de valor que eram `numeric`
  "solto", sem casas decimais — `contas_pagar.valor`, `contas_receber.valor`,
  `funcionarios.salario`, `servicos.custo` (todas pra `numeric(12,2)`) e
  `configuracoes_fiscais_loja.aliquota_iss` (pra `numeric(5,2)`). **Não é mudança cosmética**:
  `numeric` sem casas guarda exatamente o que mandarem, e o valor que ia pra
  `contas_receber.valor` ao faturar uma OS vinha de uma soma **sem arredondamento** — dá pra ver
  o efeito no teste que foi feito: um `1234.5600000000002` foi gravado inteiro, com as 13 casas.
  Depois da migration ele vira `1234.56`. Ver item 49 da seção 6 pro lado do aplicativo, que foi
  corrigido junto.
- `0049` (criada em 11/09/2026, validada num Postgres local — a instalação inteira rodada três
  vezes do zero, e a migration sozinha duas vezes num banco no estado 0048 **com dado plantado**
  — **rodada e confirmada por ela no Supabase real em 11/09/2026**, antes da tag, como manda a
  ordem descrita abaixo): duas colunas em `configuracoes_fiscais_loja` pro lembrete da
  alíquota da competência (NFS-e) — `competencia_aliquota_confirmada` (date: o mês, sempre no dia
  1º, cuja alíquota já foi cadastrada no portal da prefeitura) e `aliquota_passo_a_passo` (text: o
  caminho dentro do portal, editável porque muda de município; em branco vale o padrão de
  Araraquara, que está em `src/schemas/aliquotaCompetencia.ts`). Ver "Aviso da alíquota do mês" na
  seção 7. **Ordem importa**: essa migration precisa estar rodada ANTES de a versão nova chegar no
  computador da loja — sem as colunas, salvar em Configurações → Dados fiscais dá erro de "coluna
  não existe".

**Inventário de tipos de coluna (conferido em 11/09/2026 — não precisa checar de novo)**. Feito
rodando a instalação completa num Postgres local e consultando o `information_schema`, a pedido
do guia de melhorias (TR-05.3 e TR-05.5):
- **Dinheiro: nenhuma coluna é `double precision`/`real`.** Todas as 16 colunas de valor são
  `numeric` — ou seja, o erro clássico de ponto flutuante nunca entrou pelo armazenamento. As 5
  que estavam sem casas declaradas foram fechadas pela migration `0048` acima; o resto já era
  `numeric(12,2)` (dinheiro), `numeric(12,2)` (quantidade) ou `numeric(5,2)`/`numeric(6,2)`
  (percentual).
- **Data: nenhuma coluna é `timestamp` sem fuso.** As 28 colunas de instante são `timestamptz`, e
  as 12 de dia de calendário são `date` (vencimento, competência, data do pedido, nascimento,
  admissão, férias) — que é exatamente a separação certa.
- **`caixa_movimentos.data` é `timestamptz` de propósito, não é engano.** À primeira vista parece
  que devia ser `date` ("a data do movimento"), mas o Caixa Diário mostra a **hora** de cada
  lançamento e já converte pro dia local ao filtrar. Não trocar pra `date` — perderia a hora.

**`0038`, `0039` e `0040` já foram confirmadas rodando no Supabase real dela** — a `0040`
(auditoria) já foi testada de verdade (editou/excluiu algo e conferiu que apareceu na tela).
Falta só, pra redefinição de senha funcionar de ponta a ponta, publicar a Edge Function
`redefinir-senha-operador` (a migration `0038` sozinha não é suficiente pra essa — passo a passo
na seção 9).

Depois dessas, tem também `supabase/scripts/limpar-dados-de-teste.sql` — não é migration
(não faz parte da sequência de setup), é um script de **uso único** que a usuária pode rodar pra
apagar os dados de negócio de teste (clientes, veículos, peças, serviços, OS, caixa, estoque,
contas a pagar, contas a receber, notas fiscais, fornecedores, pedidos de compra, cotações de
peças) mantendo o login de operador, as lojas/depósitos e as configurações da loja. **Atualizado
nesta sessão** pra cobrir as tabelas que não existiam quando foi escrito originalmente
(Fornecedores/Pedidos de Compra/Cotação de Peças, migrations `0039`/`0042`) — sem isso, rodar o
script antigo quebraria com erro de chave estrangeira assim que tocasse em `pecas`/`fornecedores`
com pedido ou cotação vinculada. Validado num Postgres local com dado de teste inserido em todas
as tabelas novas, rodando o script de verdade e conferindo zero erro + contagem final exata (só os
17 serviços/5 categorias/6 categorias de serviço padrão sobrando). Usado nesta sessão pra limpar o
resquício de teste da loja real dela (Pneus Amigão) antes do lançamento de verdade, e pra deixar a
"Loja 2" de teste sem nenhum dado vinculado — depois de rodar, ela conseguiu excluir a "Loja 2"
direto pela tela (Configurações → Lojas → 🗑), sem precisar de SQL manual pra isso (a única exceção
documentada no próprio arquivo é se a exclusão pela tela continuar reclamando de dado vinculado,
sinal de algo não coberto pelo script). Ver comentário no topo do próprio arquivo pra ordem exata
de execução.

Todas as migrations são idempotentes — seguro rodar de novo caso precise reconectar ou montar
outro projeto Supabase do zero (ver seção 9).

### Multi-loja: como o acesso por loja funciona (migrations 0031-0033)

- **`lojas`**: id (uuid), nome, cidade, uf, ativo, criado_em. A loja real da usuária virou a "Loja
  1", com um **UUID fixo** (`00000000-0000-0000-0000-000000000001`, não gerado na hora) — é assim
  que o backfill das outras migrations sabe pra qual loja apontar os dados já existentes. Sem
  exclusão pelo app, só `ativo = false` (mesmo padrão de `pecas`/`servicos`/`funcionarios`).
- **`operador_lojas`**: tabela de junção many-to-many (`operador_id`, `loja_id`, PK composta) —
  **não** existe coluna `loja_id` em `operadores`. Um operador comum tem 1 linha (acesso só à
  própria loja); o dono/gerente que administra 2+ lojas tem 2+ linhas. `operadores.admin` continua
  1 boolean só — o que muda é que seu efeito passa a ser sempre escopado pelas lojas em que esse
  operador tem uma linha em `operador_lojas` (um "admin só da loja A" e o "dono admin das duas" são
  a mesma flag `admin=true`, a diferença é só quantas linhas eles têm aqui).
- **Quais tabelas ganharam `loja_id`** (`not null`, exceto a exceção abaixo): `estoque_movimentos`,
  `contagens_estoque`, `ordens_servico`, `caixa_movimentos`, `contas_pagar`,
  `notas_fiscais_arquivos`, e as 4 tabelas de configuração (viraram singleton **por loja**, ver
  próximo item). `ordens_servico_itens` e `funcionario_filhos` **não** ganharam `loja_id` próprio —
  herdam via FK (RLS consulta a tabela-pai). `clientes`/`veiculos`, `pecas`, `servicos`,
  `categorias`/`categorias_servicos`/`categorias_caixa` **continuam compartilhados**, sem
  `loja_id` — decisão explícita da usuária (catálogo único pra empresa toda).
- **`configuracoes_garantia`, `configuracoes_fiscais_loja`, `configuracoes_painel_inicio`**: eram
  "singleton" (`id smallint` fixo em 1) e viraram **1 linha por loja** — a PK trocou de `id` pra
  `loja_id uuid`. `configuracoes_juros_parcelas` (que já era multi-linha, 1 por `numero_parcelas`)
  ganhou `loja_id` na PK composta (`loja_id, numero_parcelas`). Os tipos TS correspondentes
  (`src/types/configuracao.ts`) trocaram o campo `id: 1` por `loja_id: string`.
- **`funcionarios.loja_id` é a única exceção `nullable`**: o gatilho que espelha um `operador` novo
  em `funcionarios` (migration 0019) dispara no `insert` de `operadores`, **antes** do app inserir
  as linhas em `operador_lojas` — nesse instante ainda não dá pra saber a loja. `src/lib/
  operadores.ts` → `criarOperador()` preenche esse campo logo em seguida, via `update`, assim que
  `operador_lojas` é populada. Enquanto `loja_id` está nulo (janela de milissegundos), o registro
  fica invisível pra todo mundo via RLS — comportamento seguro por padrão, não é bug.
- **RLS**: 4 funções `security definer` novas (mesmo padrão de `operador_atual_e_admin()`, migration
  0008, pra evitar `infinite recursion`): `operador_tem_acesso_loja(loja_id)`,
  `operador_e_admin_da_loja(loja_id)`, `operador_atual_e_admin_de_alguma_loja()` (usada só no
  INSERT de `operadores`/`lojas`, quando ainda não existe vínculo com o alvo) e
  `operador_administra(operador_alvo_id)` (usada no UPDATE/DELETE de `operadores`, pra impedir que
  um admin da loja A edite um operador da loja B). Tabelas compartilhadas continuam com a policy de
  sempre (`auth.uid() is not null`); tabelas per-loja passam a exigir
  `operador_tem_acesso_loja(loja_id)`. A leitura de `operadores` (lista completa, todas as lojas)
  **continua aberta pra qualquer logado** — decisão deliberada, dado exposto é baixo risco
  (nome/permissões, não financeiro), documentado como endurecimento futuro possível.
- **Bucket de Storage `notas-fiscais` NÃO foi segmentado por loja** — decisão de escopo deliberada
  (reescrever `storage_path` exigiria migrar objetos já existentes via API, não dá por SQL; a
  tabela `notas_fiscais_arquivos`, por onde o app sempre lê, já fica isolada por `loja_id`/RLS
  corretamente). Risco residual aceito, documentado, endurecimento futuro opcional.
- **Login continua igual**: `operadores.usuario` continua único **globalmente** (não por loja), tela
  de login não mudou, `src/lib/auth.ts` não mudou. "Qual loja estou vendo" é escolhido **depois**
  do login, via `LojaSwitcher.tsx` na Sidebar (só aparece pra quem tem acesso a 2+ lojas — some por
  completo pra quem usa 1 loja só, como ela hoje). Guardado em `localStorage` (`sakura_loja_ativa_id`)
  — é só estado de UI, o limite de segurança real é sempre a RLS no banco.
- **Fora de escopo desta fase** (não construído, mas arquitetura não trava pra depois): relatórios
  consolidando 2+ lojas numa visão só (cada `listar*()` per-loja recebe 1 `lojaId`, não uma lista);
  preço por peça/serviço variando por loja (extensão puramente aditiva se um dia precisar — ver
  comentário na migration 0031/PROJETO_STATUS anterior a esta sessão).

- **`clientes`**: id, nome (vira "Razão social" na tela quando `tipo_pessoa` é jurídica, mesmo
  campo), tipo_pessoa (`fisica`/`juridica`, default `fisica`), cpf_cnpj (rótulo muda pra "CPF" ou
  "CNPJ" conforme o tipo), telefone, email, cep, rua, numero, bairro, cidade, uf,
  data_nascimento (usada pro calendário do Início marcar aniversário do mês), criado_em
- **`veiculos`**: id, cliente_id (FK), placa, marca, modelo, ano, cor, **tipo**
  (`hatch`/`sedan`/`suv`/`picape`/`moto`, opcional — usado só pra escolher o ícone certo na seção
  "Veículos no pátio" do Início), km_atual, criado_em
- **`pecas`**: id, codigo_interno (exibido como "Referência"), codigo_barras, descricao, marca,
  modelo, aplicacao, unidade, preco_custo, preco_venda, ncm, cest, cfop_padrao, origem,
  cst_ou_csosn, aliquota_icms, categoria_id (FK categorias, opcional), prazo_garantia_dias (int,
  opcional, usado pelo módulo Garantias), ativo, criado_em. **Margem % não é salva no banco** — é
  só calculada na tela a partir de `preco_custo`/`preco_venda`.
- **`categorias`**: id, nome (único), criado_em. Gerenciada em Configurações (admin), selecionável
  no cadastro de produto. Sem hierarquia nem campos extras, de propósito. Vem semeada com 5
  categorias padrão (Pneus, Suspensão, Amortecedores, Freios, Outras Peças — migration `0030`).
- **`categorias_servicos`**: id, nome (único), criado_em. Mesmo conceito de `categorias`, mas pra
  serviços — tabela própria (não reaproveita `categorias`), mesmo padrão de "conceito parecido,
  tabela separada" já usado com `categorias_caixa`. Vem semeada com 6 categorias padrão (Pneus,
  Suspensão, Amortecedores, Freios, Alinhamento, Outros Serviços — migration `0030`).
- **`servicos`** (catálogo de serviços, análogo a `pecas` mas sem estoque/fiscal): id,
  codigo_interno (opcional), descricao, preco_padrao, categoria_id (FK categorias_servicos,
  opcional), ativo, criado_em. Vem semeado com ~17 serviços padrão sem preço (migration `0030`).
- **`fornecedores`** (compartilhado entre lojas, migration `0039`): id, nome, cnpj, telefone,
  email, cep/rua/numero/bairro/cidade/uf, ativo, criado_em. Mesmo padrão de `clientes`
  (endereço completo) mas sem veículos nem tipo pessoa física/jurídica — fornecedor é sempre
  tratado como uma única "razão social".
- **`pedidos_compra`** (por loja, migration `0039`): id, **numero** (int, sequencial **por loja**,
  trigger no insert, mesmo padrão de `ordens_servico.numero`), loja_id (FK lojas), fornecedor_id
  (FK fornecedores), status (`pendente`/`parcial`/`recebido`/`cancelado`), data_pedido, observacao,
  operador_id (FK operadores — quem criou), criado_em.
- **`pedidos_compra_itens`**: id, pedido_compra_id (FK, `on delete cascade`), peca_id (FK pecas),
  quantidade_pedida, preco_unitario (opcional), quantidade_recebida (default 0, soma conforme a
  usuária confirma recebimentos — pode ser parcial, em mais de uma vez). Sem `loja_id` próprio,
  herda via `pedido_compra_id` (mesmo padrão de `ordens_servico_itens`).
- **`cotacoes_pecas`** (compartilhado entre lojas, migration `0042`): id, peca_id (FK pecas),
  fornecedor_id (FK fornecedores), preco, criado_em. Tabela só de histórico — **não editável nem
  excluível pelo app**, sempre insert: toda vez que um Pedido de Compra é criado com preço numa
  peça, uma linha nova é gravada aqui sozinha (`lib/pedidosCompra.ts` → `criarPedido()`). Ver
  "Cotação de peças" na seção 7.
- **`depositos`** (migration `0041`): id, loja_id (FK lojas), nome, ativo, criado_em. Locais
  físicos de estoque dentro de uma loja (ex: "Depósito Principal", "Fundos") — gerenciado em
  Configurações (admin), igual padrão de `categorias`/`categorias_caixa` (sem exclusão de verdade,
  só inativar). Toda loja já nasce com um "Depósito Principal" sozinho (backfill na migration pras
  já existentes, `criarLoja()` pras novas), então quem usa um só lugar físico nunca precisa criar
  nada — só quem tiver mais de um depósito passa a escolher entre eles.
- **`estoque_movimentos`**: id, loja_id (FK lojas), deposito_id (FK depositos — em qual depósito
  aconteceu), peca_id (FK), tipo (`entrada`/`saida`),
  quantidade, motivo (`compra`/`venda`/`ajuste`/`uso_em_os`), referencia, criado_em. Fluxos que
  lançam movimentação sozinhos (baixa automática ao usar peça numa OS, entrada ao receber Pedido de
  Compra, importação de nota por foto) não perguntam "em qual depósito" pro operador — caem sempre
  no depósito padrão da loja (`buscarDepositoPadraoId()` em `lib/depositos.ts`); só os fluxos onde o
  operador ativamente escolhe (Movimentações → Nova movimentação, Contagem) pedem o depósito na
  tela. Decisão de escopo pra manter o v1 do Depósito enxuto — se um dia fizer falta escolher
  depósito também nesses fluxos automáticos, é extensão aditiva.
- **`ordens_servico`**: id, **numero** (int, sequencial **por loja** — 1, 2, 3..., atribuído
  sozinho por trigger no insert; é como a OS aparece pra usuária em todo o app, nunca o `id`), loja_id
  (FK lojas), cliente_id (FK), veiculo_id (FK, opcional), status
  (`em_andamento`/`concluida`/`faturada` — sem "aberta" desde a migration 0037; toda OS nova já
  nasce "em_andamento"), km_entrada, descricao_problema (rótulo "Observação"), forma_pagamento
  (texto livre — quando o faturamento é dividido em mais de uma forma, vira um resumo tipo "Pix +
  Cartão de crédito"), parcelas (int, default 1, preenchido no faturamento), data_abertura,
  data_fechamento, vendedor_id (FK **funcionarios**)/criado_por_id/atualizado_por_id (FK operadores
  — autoria de sistema).
- **`ordens_servico_itens`**: id, ordem_servico_id (FK), tipo (`peca`/`servico`), peca_id (FK
  opcional, só tipo peça), servico_id (FK opcional, só tipo serviço — item de serviço pode ficar
  sem servico_id quando for "avulso"), tecnico_id (FK **funcionarios**, opcional — técnico
  responsável por aquele item, diferente do vendedor/atendente que é da OS toda), descricao,
  quantidade, preco_unitario, desconto
- **`configuracoes_juros_parcelas`**: loja_id (FK lojas) + numero_parcelas (PK composta, 2 a 12),
  juros_percentual. Editável só pelo admin — define o juro (% sobre o total) cobrado quando o
  cliente parcela no cartão ao faturar uma OS. 1x é sempre à vista, sem juros.
- **`caixa_movimentos`**: id, loja_id (FK lojas), data, ordem_servico_id (FK opcional — **não é mais
  único** desde a migration 0037: uma OS faturada com pagamento dividido em mais de uma forma gera
  1 lançamento por forma usada), tipo (`entrada`/`saida`), forma_pagamento, valor, descricao,
  categoria_id (FK categorias_caixa, opcional)
- **`categorias_caixa`**: id, nome, tipo (`entrada`/`saida`), criado_em. Gerenciada em
  Configurações (admin), selecionável ao lançar um movimento manual no Caixa (ex: "Aluguel",
  "Sucata"). Tabela separada de `categorias` (que é só pra produtos) — o conceito é diferente.
- **`funcionarios`**: id, loja_id (FK lojas, **nullable** — única exceção, ver subseção
  "Multi-loja" acima), nome, cargo (texto livre, opcional), operador_id (FK operadores,
  opcional e único — presente quando esse funcionário também loga no sistema), ativo, criado_em.
  Cadastro leve pra quem não precisa logar mas precisa ser selecionável como técnico/vendedor.
  **Todo operador criado em Configurações ganha automaticamente um `funcionarios` espelhado**
  (trigger `sincroniza_funcionario_operador`). Campos ampliados (RH completo): documentos (cpf,
  rg, cnh_categoria, cnh_numero, data_nascimento, estado_civil, tipo_sanguineo), endereço/contato
  (cep, endereco, numero, bairro, cidade, estado, complemento, telefone, celular, email),
  cargo/admissão (pis, codigo_registro, cbo, salario, comissao, admissao, data_ferias) e
  família/filiação (pai, mae, naturalidade, sexo, conjuge_nome, conjuge_nascimento,
  data_casamento, conjuge_telefone, conjuge_celular). **Dados de saúde ficaram de fora** por
  escolha explícita (dado sensível, cuidado de LGPD).
- **`funcionario_filhos`**: id, funcionario_id (FK, `on delete cascade`), nome, data_nascimento
  (opcional), criado_em. `FuncionarioForm.tsx` salva a lista inteira de uma vez (substitui tudo).
- **`contagens_estoque`**: id, loja_id (FK lojas), deposito_id (FK depositos — a contagem física é
  sempre de um depósito específico), peca_id (FK), quantidade_contada,
  saldo_sistema, diferenca, observacao, operador_id (FK operadores), criado_em. Ao salvar com
  diferença, gera automaticamente um ajuste em `estoque_movimentos` (nesse mesmo depósito).
- **`configuracoes_garantia`**: 1 linha **por loja** (`loja_id` é a PK) com `texto` — template do
  texto de garantia, placeholders `{cliente}`/`{veiculo}`/`{itens}`/`{data}` substituídos na hora
  (`lib/garantiaTexto.ts`). Editável só pelo admin.
- **`notas_fiscais_arquivos`**: id, loja_id (FK lojas), tipo (`nfe`/`nfse`), competencia (date, 1º
  dia do mês), nome_arquivo, storage_path, ordem_servico_id (FK opcional), operador_id (FK
  operadores), criado_em, origem (`manual`/`automatica`, default `manual`),
  numero/chave_acesso/status (opcionais, preenchidos só quando `origem = automatica`, sem uso real
  ainda). O XML em si fica no **Supabase Storage**, bucket privado `notas-fiscais` (`storage_path`:
  `<tipo>/<ano>-<mes>/<uuid>-<nome original>`, **não segmentado por loja** — ver subseção
  "Multi-loja" acima).
- **`configuracoes_fiscais_loja`**: 1 linha **por loja** (`loja_id` é a PK) com cnpj, razao_social,
  nome_fantasia, inscricao_estadual, inscricao_municipal, regime_tributario, endereço da loja,
  telefone, email, focus_nfe_token, focus_nfe_ambiente (`homologacao`/`producao`). Reaproveitada
  pelo cabeçalho do documento de garantia. Desde a migration `0049` guarda também
  `competencia_aliquota_confirmada` e `aliquota_passo_a_passo`, do lembrete mensal da alíquota
  (ver "Aviso da alíquota do mês" na seção 7) — a primeira **não** é escrita pela tela de
  Configurações, só pelo botão "Já cadastrei" e pela NFS-e autorizada.
- **`operadores`**: id (= id do usuário no Supabase Auth), usuario (único **globalmente**, não por
  loja), nome, admin (bool), permissoes (`text[]` com as chaves de `MODULOS` em
  `src/types/operador.ts`), ativo, deve_trocar_senha (bool, default `false` — migration `0038`;
  marcado `true` quando um admin redefine a senha de alguém, obriga trocar antes de liberar o app,
  ver seção 7 "Login e permissões"), criado_em. Não tem `loja_id` — o acesso a loja(s) vem de
  `operador_lojas` (ver subseção "Multi-loja" acima). RLS de verdade baseada em login (ver seção 6).
- **`auditoria`** (migration `0040`): id, tabela (nome da tabela afetada), registro_id, acao
  (`atualizar`/`excluir`), operador_id (FK operadores — quem fez), dados_antes/dados_depois
  (jsonb, snapshot da linha inteira via `to_jsonb(old)`/`to_jsonb(new)`), criado_em. **Não é
  gravada pelo app** — uma função trigger (`registrar_auditoria()`, `security definer`) grava
  sozinha em `UPDATE`/`DELETE` das tabelas cobertas (ver lista no comentário da migration `0040`),
  então pega qualquer alteração não importa a origem (tela do app, SQL Editor manual, bug futuro).
  Leitura só pra admin (`operador_atual_e_admin()`); sem policy de insert pra ninguém — só a
  função (dona = quem rodou a migration) consegue gravar. Ver "Auditoria" na seção 7.
- **`contas_pagar`**: id, loja_id (FK lojas), descricao, valor, vencimento (date), categoria_id (FK
  categorias_caixa, opcional), recorrente (bool), status (`pendente`/`paga`), data_pagamento
  (opcional), caixa_movimento_id (FK, opcional — a Saída gerada ao marcar como paga), operador_id
  (FK operadores), criado_em. Marcar como paga gera automaticamente uma Saída em
  `caixa_movimentos` e, se `recorrente`, cria a próxima ocorrência (mesmo valor, +1 mês) sozinha.
  **"Desfazer pagamento"** (`desfazerPagamento()` em `lib/contasPagar.ts`) volta a conta pra
  pendente e apaga a Saída que tinha sido gerada.
- **`contas_receber`**: id, loja_id (FK lojas), cliente_id (FK clientes), ordem_servico_id (FK
  ordens_servico, opcional e único — 1 conta a receber por OS faturada), descricao, valor,
  vencimento (date, aqui é "previsão de recebimento"), status (`pendente`/`recebido`),
  data_recebimento (opcional), caixa_movimento_id (FK, opcional — a Entrada gerada ao marcar como
  recebido), operador_id (FK operadores), criado_em. Nasce de dois jeitos: (a) **automaticamente**,
  ao faturar uma OS (`FaturamentoCard.tsx`) escolhendo "A receber depois" em vez de "Recebido
  agora" — não lança Entrada no Caixa na hora, cria uma linha aqui, pendente; marcar como recebido
  (`ReceberContaModal.tsx`) é que gera a Entrada; (b) **à mão** (desde esta sessão), pelo botão
  "+ Nova conta" da própria tela (`ContaReceberForm.tsx`, mesmo padrão do Contas a Pagar), pra
  cobrança que não passou por OS nenhuma. **Detalhe que valeu conferir antes de construir (b)**: a
  tabela tem `constraint contas_receber_ordem_id_unique unique (ordem_servico_id)`, que à primeira
  vista pareceria impedir mais de uma conta manual (todas com `ordem_servico_id` nulo) — mas o
  Postgres não trata dois nulos como repetidos numa constraint `unique` comum (só com
  `nulls not distinct`, que não foi usado aqui), então cabem quantas contas avulsas forem precisas.
  **Não precisou de migration nova.** `cliente_id` continua obrigatório, então o formulário exige
  escolher o cliente.
- **`configuracoes_painel_inicio`**: 1 linha **por loja** (`loja_id` é a PK) com `cartoes`
  (`text[]`, até 3 chaves) — define quais indicadores aparecem nos cartões de tendência da tela
  Início. Ajuste por loja, editável só pelo admin. As 5 chaves possíveis ficam em
  `CARTAO_METRICA_LABEL` (`types/configuracao.ts`): vendas_mes, custos_mes, lucros_mes,
  ticket_medio_mes, contas_pagar_vencendo. Padrão atual: Vendas/Lucro/Ticket médio (Custos saiu do
  padrão por não ser legal mostrar "algo negativo" logo de cara).

Regras de negócio já implementadas: ao criar uma OS com item tipo peça, gera automaticamente uma
saída em `estoque_movimentos` (motivo `uso_em_os`). Ao faturar uma OS, gera automaticamente uma
entrada em `caixa_movimentos` com o valor total (já incluindo juros, se parcelado). Garantia dada
ao cliente (módulo "Garantias") **não tem tabela própria** — deriva de `ordens_servico_itens` +
`pecas.prazo_garantia_dias` + `ordens_servico.data_fechamento`. Ao confirmar o recebimento de um
Pedido de Compra (mesmo que parcial), gera automaticamente uma entrada em `estoque_movimentos`
(motivo `compra`) por item recebido, soma em `pedidos_compra_itens.quantidade_recebida`, e
recalcula sozinho o status do pedido (`parcial` até todo item bater a quantidade pedida, aí vira
`recebido`).

**Fora do Postgres** (Supabase Storage): bucket `notas-fiscais` (XMLs enviados manualmente).
**Fora do Postgres/Storage** (Edge Function): `ler-notas-fiscais`, ver seção 4 — não tem tabela
própria, o resultado só passa pela tela de revisão em memória antes de salvar em `pecas`.

## 6. Dívidas técnicas / pontos de atenção — IMPORTANTE

1. **Permissão por módulo checada só na interface, não em RLS por categoria** — um operador
   logado com permissão só de "Caixa", por exemplo, ainda consegue chamar a API do Supabase
   direto pra mexer em "Clientes" se tentar de propósito. RLS exige **login** pra tudo (fecha o
   acesso sem estar logado), mas não reforça por módulo. Fica pra uma etapa futura se o risco
   mudar (ex: sistema vendido pra terceiros, não só a própria loja).
2. **Autenticação**: Supabase Auth, login com usuário/senha (ver seção 3). **Redefinir senha de
   operador esquecida** já está implementado (Configurações → Operadores → "Redefinir senha",
   migration `0038` + Edge Function `redefinir-senha-operador` — ver "Login e permissões" na seção
   7 e o passo a passo de deploy na seção 9) — falta só ela rodar a migration e publicar a função
   no Supabase real, mesmo processo já feito uma vez pra `ler-notas-fiscais`. **Multi-loja**: a
   fundação já existe (1 projeto Supabase pode servir 2+ lojas, ver seção 5) — o que ainda não
   existe é um site externo de assinatura pra provisionar loja+admin automaticamente pra um
   cliente novo (continua manual, pelo painel do Supabase + tela de Configurações → Lojas).
   **Senha mínima trava em 6 caracteres, sem exceção**: já foi tentado reduzir pra 4 (pedido dela,
   pra digitar mais rápido no balcão) — não dá, o Supabase Auth barra isso mesmo pelo painel
   ("Must be greater or equal to 6"). Não sugerir de novo sem uma mudança de arquitetura de login
   (ex: PIN numérico em vez de senha via Supabase Auth) e sem ela pedir explicitamente.
3. **Uma chave secreta do Supabase (`sb_secret_...`) foi colada no chat pela usuária em algum
   momento**, por engano (só a `anon`/publishable era necessária). Não foi usada/armazenada no
   código. Vale sugerir que ela rotacione essa chave em Settings → API Keys do Supabase, se ainda
   não tiver feito.
4. **Testes automatizados — começando** (Vitest). Cobre principalmente **funções puras de cálculo**
   isoladas dos componentes durante a migração pro `react-hook-form` (juros/parcelas/split de
   pagamento em `schemas/faturamento.ts`, margem de peça em `schemas/peca.ts`, totais de OS/Pedido
   de Compra, saldo de estoque, cotação por fornecedor) — **não** testa componente React, tela,
   nem nada que dependa do Supabase (esse tipo de teste, de UI/integração, é bem mais trabalhoso de
   montar e não foi feito ainda). **298 testes**, todos passando — e, desde 11/09/2026, rodando
   nos **dois fusos** (`npm run test:fusos`), porque a máquina de teste usa UTC e é justamente em
   UTC que o pior bug de data deste projeto não aparece (item 48 desta seção). Um deles não testa
   conta nenhuma: `schemas/arquitetura.test.ts` varre `src/pages/` e reprova conta de dinheiro
   escrita dentro de tela (item 49). Achou e corrigiu de brinde um bug
   real de arredondamento de ponto flutuante em `calcularValorCobrado` (`100 * 1.1` podia sair
   `110.00000000000001` em vez de `110`) — e, na varredura de 02/09/2026 (itens 42 a 45), foi
   escrevendo teste pro comportamento esperado que os bugs de desconto na NFC-e apareceram, dois
   deles em lugares que a leitura do código já tinha passado batido.
   **Um teste de verdade fora desse padrão, nesta sessão**: a tela de conexão foi validada de ponta
   a ponta no **Electron real** (Playwright + `xvfb-run`, ver item 6 desta seção), inclusive o
   caminho de falha — e ali o sandbox ajuda em vez de atrapalhar, porque a ausência de rede pro
   Supabase reproduz naturalmente o cenário "a checagem reprovou". Não está no `npm test` (é script
   avulso), mas é o único jeito de pegar falha silenciosa de preload.
   **Exceção**: `lib/notaFiscalXmlFornecedor.test.ts` testa
   o parser de XML de verdade (precisa de `DOMParser`, uma API de navegador que o ambiente "node"
   padrão do Vitest não tem) — usa jsdom só nesse arquivo, via comentário `// @vitest-environment
   jsdom` no topo do arquivo (`jsdom` virou devDependency só pra isso; o resto dos testes continua
   no ambiente node simples, mais rápido).
5. **Assinatura de código do instalador**: o Windows/SmartScreen avisa "editor desconhecido" no
   instalador (normal sem certificado pago; não impede instalar, só exige "Mais informações →
   Executar assim mesmo"). Reconsiderar comprar um certificado se algum dia distribuir pra muitas
   lojas de terceiros.
6. **Ambiente de sandbox onde o Claude roda (nuvem) não consegue acessar `*.supabase.co`**
   (política de rede bloqueia, erro 403 do proxy). Testes de ponta a ponta contra o Supabase real
   **só podem ser feitos pela usuária, na máquina dela**. Do lado do sandbox, a validação possível
   é: `tsc -b`, `vite build`, `npm run lint`, e screenshots via Playwright + `xvfb-run` (Electron
   real, headless) com dados mockados via `page.route()` interceptando as chamadas REST do
   Supabase. **Pra bugs de caminho de asset**, servir o `dist/` por HTTP não é suficiente — mascara
   problemas de caminho absoluto que só aparecem de verdade com `file://`. Preferir sempre validar
   com o Electron real via `playwright._electron.launch({ executablePath:
   "node_modules/.bin/electron", args: ["dist-electron/main.js"] })` sob `xvfb-run -a`. **Chamadas
   a outros domínios reais também não funcionam no sandbox** (nem simulando um domínio "fake" via
   `.env` — o proxy do ambiente bloqueia a tentativa de tunnel) — pra validar telas que dependem de
   login/dados reais sem essa rede, uma alternativa que funcionou bem foi recriar a estrutura HTML
   isolada (sem app inteiro) reaproveitando o CSS já compilado do `dist/`, pra testes puramente
   visuais/CSS que não dependem de dado real.
   **Melhor que isso (descoberto numa sessão posterior): dá pra renderizar o componente React de
   verdade**, não uma imitação em HTML. Receita, pra qualquer componente que receba os dados por
   `props` (ou seja, que não chame o Supabase sozinho — todo `<Modulo>Form.tsx` do app se encaixa):
   criar um `preview-temp.tsx` que monta só esse componente com dados falsos (dentro de um
   `<MemoryRouter>`, senão `BotaoVoltar` quebra) + um `vite.preview.config.ts` mínimo (só
   `react()` + `tailwindcss()` + o alias `@`, **sem** os plugins de Electron), buildar com
   `npx vite build --config vite.preview.config.ts` e tirar screenshot com Playwright. Pega
   layout/contraste/estilo de verdade, com o CSS real do tema. **Duas pegadinhas que custaram duas
   tentativas em branco**: precisa de `base: "./"` no config (senão o asset sai com caminho
   absoluto e não carrega) e precisa **servir por HTTP**, não abrir via `file://` (o Chromium
   bloqueia `<script type="module">` em `file://` por CORS — e o sintoma é uma página branca **sem
   erro nenhum** no console, fácil de confundir com bug do componente). Apagar os arquivos
   temporários depois, não commitar.
   **Descoberto nesta sessão**: o sandbox já vem com um cluster **Postgres 16 local** instalado
   (`service postgresql start`, usuário `postgres` via `sudo -u postgres psql`) — dá pra validar
   migrations novas de verdade (não só ler o SQL): criar um banco de teste, aplicar um stub mínimo
   de `auth.users`/`auth.uid()`/`storage.buckets`/`storage.objects` (Supabase não existe num
   Postgres comum), rodar as migrations em sequência, inserir dados fake pra simular produção, e
   rodar as migrations novas **duas vezes** pra provar idempotência de verdade — muito mais
   confiável que revisão visual sozinha, e foi assim que um bug real de idempotência (`drop policy
   if exists` cobrindo só o nome antigo, ver item 12) foi pego antes de chegar nela. Além disso,
   `node_modules` não vem pré-instalado neste ambiente — rodar `npm install` (uns 20-30s) antes de
   `npm run build`/`npm run lint`, senão o `tsc` do sandbox cai num binário global desalinhado com
   a versão do projeto (erros estranhos tipo `TS5101` sobre `baseUrl` deprecated). Pra rodar
   Playwright fora do fluxo `npm run dev` normal (ex: só pra tirar um screenshot pontual), o pacote
   `playwright` já vem instalado **globalmente** neste ambiente
   (`/opt/node22/lib/node_modules/playwright`) mesmo sem estar no `package.json` do projeto — útil
   pra scripts avulsos de verificação visual sem mexer nas dependências do projeto.
7. **Vercel**: o repositório tem uma integração de deploy automático na Vercel conectada (de
   quando este repo era um site em Next.js, antes da reescrita como app Electron) — isso faz
   alguns PRs mostrarem um check falhando sem relação com o código. Não dá pra desconectar pelo
   código, só pelo painel da Vercel.
8. **Padrão de bug: fallback com `??` em vez de `||`** — `src/lib/supabase.ts` já teve um bug real
   assim (tela em branco: `.env` copiado do `.env.example` define variáveis como **string vazia**,
   não ausente, e `??` só troca `null`/`undefined`). Sempre usar `||` pra fallback de
   `import.meta.env.VITE_*`.
9. **Padrão de bug: caminho absoluto de asset quebra só no instalador** — `src="/..."` ou
   `url(/...)` funciona em `npm run dev` (Vite serve a partir de `/`) mas quebra no app empacotado
   (Electron carrega via `file://`, onde `/` tenta ler a raiz do disco). Usar sempre
   `import.meta.env.BASE_URL` em vez de caminho absoluto direto. Só aparece testando o instalador
   de verdade, o sandbox com servidor HTTP local não pega esse tipo de bug.
10. **Padrão de bug: campo de formulário "sem digitar"** — sem `color-scheme: light` declarado, o
    Chromium/Electron usa o tema do Windows pra decidir a cor do texto dentro de
    `input`/`select`/`textarea`; com Windows em modo escuro, o texto digitado fica branco sobre
    fundo claro (invisível, mas é digitado normalmente). Corrigido com `color-scheme: light` no
    `:root` de `globals.css`. Se um campo "não aceitar digitação" de novo, confirmar selecionando
    o texto com o mouse antes de investigar outra coisa.
11. **Padrão de bug: ação sem efeito visível (ex: "Excluir")** — sempre confirmar que a função tem
    `try/catch` chamando `setErro(mensagemDeErro(err))`. Sem isso, uma exclusão que falha (ex:
    registro com FK vinculada, bloqueada de propósito) parece "não fazer nada" — o erro real
    nunca aparece em lugar nenhum.
12. **Padrão de bug: migration "idempotente" que não é** — toda migration que reafirma
    "idempotente, seguro rodar de novo" precisa dropar o nome **final** do objeto (policy, etc.)
    antes de criar, não só o nome antigo que está substituindo. Sem isso, rodar a migration uma
    segunda vez trava com "already exists" a partir do primeiro objeto cuja versão nova já existia.
13. **Padrão de bug: `infinite recursion detected in policy` (`42P17`)** — sempre que uma RLS
    policy precisa checar uma condição na mesma tabela que ela protege (ex: "é admin?" consultando
    `operadores` dentro de uma policy de `operadores`), usar uma função `security definer`
    (roda com privilégio do dono da função, não reaciona a mesma policy), nunca uma subconsulta
    direta.
14. **Padrão de bug: CSS "sem camada" vence classe do Tailwind, mesmo com especificidade menor** —
    CSS puro escrito direto em `globals.css`, fora de qualquer `@layer`, tem prioridade **maior**
    que qualquer classe do Tailwind (que fica dentro de `@layer utilities`/`base`/etc.), **não
    importa a especificidade**. Reset "globais" (`*`, `body`, seletores soltos) precisam ficar
    dentro de `@layer base` pra não atropelar utilitários mais específicos — foi assim que a barra
    de rolagem customizada (ver seção 2) ficou duplicada com a nativa por uma sessão inteira.
15. **Padrão de bug: RLS sem policy pra uma operação específica falha *em silêncio*, sem erro** —
    uma tabela pode ter policy de `select`/`insert`/`update` e faltar a de `delete` (ou qualquer
    outra combinação) sem ninguém perceber, porque o Postgres não recusa o comando com uma
    mensagem — ele só filtra a zero linhas visíveis pra aquela operação. Do lado do app, um
    `.delete()` (ou `.update()`) que "roda sem erro" mas não muda nada é indistinguível de "deu
    certo" até alguém checar o banco direto. Encontrado assim: `lojas` tinha policy de update mas
    nunca teve uma de delete (migration 0031 só cobriu select/insert/update), então o botão
    "excluir loja" simplesmente não fazia nada — corrigido na migration 0037. **Lição**: toda vez
    que uma tabela ganha uma ação nova (excluir, reativar, etc.), conferir explicitamente se existe
    policy cobrindo *aquele comando exato* — não basta a tabela já ter RLS habilitada com outras
    policies.
16. **Padrão de bug: dropdown customizado com "seleciona no `onClick`" pode nunca disparar o
    clique** — o `Combobox.tsx` (select com busca, ver seção 4) fechava a lista de opções num
    `onBlur` do input, com `onMouseDown={preventDefault}` nos botões de opção só pra impedir que o
    clique tirasse o foco do input antes da hora. Na prática, o `blur` disparou de qualquer forma
    antes do `click` chegar a acontecer (o app roda dentro do Electron, onde o foco de janela se
    comporta diferente de um navegador comum) — a lista fechava e o botão da opção sumia do DOM
    *entre* o `mousedown` e o `click`, então o clique nunca tinha um elemento pra disparar em cima,
    e a seleção simplesmente não acontecia (sem erro nenhum, só "não fazia nada"). **Lição**: em
    qualquer dropdown customizado (não é só esse — vale pra qualquer coisa parecida no futuro), a
    seleção precisa acontecer no **próprio `onMouseDown`** do item (com `preventDefault()` pra não
    perder o foco), nunca separada num `onClick` posterior — `mousedown` sempre dispara antes de
    qualquer `blur` resultante da mesma interação, então a seleção fica imune a essa corrida.
17. **Reincidência do "campo sem digitar" (item 10), causa nova**: `globals.css` força
    `input, select, textarea { color: #fff }` fora de `@layer` (vira letra branca em todo campo do
    app, prioridade maior que qualquer classe Tailwind — mesma regra do item 14). Isso é correto na
    maioria das telas (cards escuros), mas `LinhaEdicaoLoja` (`LojasSection.tsx`) e
    `LinhaEdicaoDeposito` (`DepositosSection.tsx`) — as duas linhas de edição inline de Loja/Depósito
    — envolviam o formulário num `bg-white/10` (fundo **claro** translúcido, resquício do tema claro
    antigo que sobrou na migração pro tema escuro/neon). Letra branca forçada + fundo quase branco =
    texto invisível, tanto o valor já preenchido quanto o que a usuária digitava — ela relatou como
    "dá pra apagar, mas não dá pra escrever" (o apagar parecia funcionar porque o campo ficava
    "vazio" visualmente do mesmo jeito antes e depois; o digitar "não funcionava" porque o texto novo
    também nascia invisível). Corrigido trocando `bg-white/10` por `bg-black/20` nos dois
    componentes. **Lição**: qualquer fundo `bg-white/*` sobrando de layout antigo é suspeito nº 1
    quando um campo "não aceita digitação" — confirmado que não existe mais nenhum `bg-white/*`
    envolvendo `<input>`/`<select>`/`<textarea>` no restante do app (os `bg-white/*` que sobraram são
    hover de botão/aba/dropdown, sem input dentro, então seguros).

    **Terceira reincidência da mesma família, achada numa varredura sistemática (não por relato
    dela)**: os dois gráficos de Relações (`GraficoBarras.tsx`, `GraficoRadar.tsx`) desenhavam a
    caixinha de valor que aparece ao passar o mouse com `bg-sakura-purple-dark` + `text-white`.
    **A armadilha está no nome do token**: `sakura-purple-dark` era roxo escuro no tema claro
    antigo (letra branca em cima fazia todo sentido) e virou uma cor **clara** (`#e8d5e5`) na
    migração pro tema escuro — ou seja, virou branco sobre branco, contraste **1,39:1** contra o
    mínimo legível de 4,5:1 do WCAG. Corrigido pra `bg-sakura-pink-soft` (`#1a1018`) + borda sutil,
    subindo pra 18,56:1. **Lição maior que o bug**: `bg-white/*` não é o único suspeito — qualquer
    uso de `sakura-purple-dark` como **fundo** é candidato pelo mesmo motivo, e o nome do token
    ativamente engana quem lê o código. Por isso a varredura virou ferramenta permanente:
    **`npm run contraste`** (`scripts/varredura-contraste.mjs`) lê toda string de `className` do
    app e aponta combinação de fundo claro + letra clara (ou fundo escuro + letra escura). Rodar
    depois de qualquer mexida grande de estilo — hoje passa limpo. Ele não enxerga fundo e texto
    declarados em elementos diferentes, então continua valendo olhar a tela; serve pra pegar de
    graça o caso mais comum, que é fundo e cor na mesma classe.
18. **Padrão de bug: `process.env.npm_package_version` não existe no app empacotado** —
    `VersaoApp.tsx` (canto inferior direito, em toda tela) sempre dependeu dessa variável, que o npm
    só injeta quando o processo é lançado via `npm run ...`. No `.exe` instalado (aberto direto,
    sem `npm` por trás), ela nunca existiu — o número da versão nunca apareceu de verdade pra
    usuária, só passou despercebido até ela usar o instalador real pela primeira vez (antes disso,
    sempre rodava via `npm run dev`). **Corrigido** (`electron/main.ts` + `electron/preload.ts`):
    `main.ts` seta `process.env.SAKURA_APP_VERSION = app.getVersion()` (API do próprio Electron,
    funciona igual em dev e empacotado) antes de criar a janela, e o preload repassa essa variável
    pro app via `contextBridge`. **Cuidado testado e descartado**: a primeira tentativa de correção
    usou `createRequire(import.meta.url)` pra ler `package.json` direto do preload — parecia certo,
    mas quebrava em silêncio (o helper que o Vite gera pra resolver `import.meta.url` num preload
    empacotado como `.mjs` calcula a URL base errado nesse contexto, então o `require` relativo
    nunca achava o arquivo e o preload inteiro parava de rodar **antes** de chegar no
    `contextBridge.exposeInMainWorld` — nem `window.sakuraApp` existia mais). Só foi pego testando
    de verdade com Electron real (`playwright._electron.launch`, ver item 6 da seção 6) — leitura de
    código sozinha não teria achado. **Lição de teste**: `app.getVersion()` só lê a versão certa do
    `package.json` quando o Electron é apontado pra **raiz do app** (onde está o `package.json` com
    o campo `main`) — apontar direto pro arquivo `dist-electron/main.js` (em vez de `.` ou da pasta)
    faz o Electron cair no fallback e devolver a própria versão do Electron, não a do app; só
    descoberto comparando os dois jeitos de lançar o teste.
19. **Padrão de bug: `autoUpdater` roda "no escuro"** — `checkForUpdatesAndNotify()` nunca teve
    nenhum listener de evento, então sucesso, download e erro eram tudo invisível — sem log, sem
    mensagem, nada. Isso vira um problema real na hora de diagnosticar "por que não atualizou":
    nem dá pra abrir o DevTools do processo principal (onde o `autoUpdater` roda) pelo Console do
    renderer, que é uma **outra** parte do processo — e um app aberto por duplo clique não tem
    terminal nenhum visível pra pegar `console.log`. **Corrigido**: `electron/main.ts` agora escreve
    cada evento (`checking-for-update`, `update-available`, `update-not-available`,
    `download-progress`, `update-downloaded`, `error`) num arquivo de texto simples
    (`atualizacoes.log`, em `app.getPath("userData")` — no Windows, algo como
    `%APPDATA%\Sakura System - AutoCenter Edition\atualizacoes.log`) em vez de puxar uma
    dependência nova só pra log. Se um `v0.9.3` não tiver sido instalado sozinho na loja mesmo com
    o build publicado com sucesso no GitHub, esse arquivo (a partir da próxima versão que já tiver
    esse log) é o primeiro lugar pra olhar.
20. **Continuação do item 15 (`excluirLoja()`): faltavam 4 tabelas, não só `depositos`** — a
    correção da sessão anterior (que apaga `depositos` antes da loja) não foi suficiente na prática:
    testando a exclusão de uma loja de teste de verdade (a usuária tentando excluir a "Loja 2"),
    o erro genérico "ainda tem dados vinculados" continuou aparecendo mesmo depois de limpar todo
    dado de negócio e mover os funcionários pra outra loja. Causa: as 4 tabelas de configuração
    "1 linha por loja" da fundação multi-loja (`configuracoes_garantia`,
    `configuracoes_fiscais_loja`, `configuracoes_painel_inicio`, `configuracoes_juros_parcelas`,
    migration 0033) também referenciam `loja_id` sem `ON DELETE CASCADE` — toda loja sempre tem uma
    linha em cada uma (exceto `configuracoes_juros_parcelas`, só criada quando o admin configura um
    juro de verdade), então **qualquer exclusão de loja sempre bateria nesse mesmo bloqueio**, não
    só a de teste. Corrigido generalizando `excluirLoja()` pra apagar as 5 tabelas de configuração
    por loja (`depositos` + as 4 acima) antes de tentar apagar a loja em si — validado de ponta a
    ponta num Postgres local (mesmo cenário: loja com depósito + as 4 configs, exclusão bem
    sucedida sem erro de FK). **Lição**: ao corrigir um bug de "tabela X sem cascade bloqueando Y",
    conferir a lista **completa** de tabelas que referenciam Y do mesmo jeito, não só a que
    apareceu no primeiro relato — meio-corrigir um bug desses é pior que não mexer, porque parece
    resolvido até alguém testar de novo com dado real.
21. **Padrão de bug: auto-update via GitHub Releases não funciona com repositório privado** — a
    `v0.9.5` foi publicada com sucesso (release completa, com `.exe` e `latest.yml`), mas o app
    instalado (`v0.9.4`) não se atualizou sozinho, do mesmo jeito que já tinha acontecido da `v0.9.2`
    pra `v0.9.3`. Causa: o repositório `amigao` (hoje `sakura-system-ace`) era **privado**, e o
    `electron-updater` checa atualização baixando o `latest.yml` da release **sem nenhuma
    autenticação** — confirmado testando direto: `curl` no link de download da release dava **404**
    sem estar logado, exatamente como o app instalado tentaria acessar. Corrigido nesta sessão
    **tornando o repositório público** (Settings → General → "Change visibility") — depois da
    mudança, o mesmo link passou a responder **302** (redireciona pro arquivo) em vez de 404.
    **Alternativas descartadas**: embutir um token de acesso dentro do `.exe` pra continuar privado
    (rejeitado — qualquer pessoa consegue extrair esse token do instalador, dando acesso de leitura
    ao repositório inteiro pra quem tiver o instalador em mãos) e manter um repositório-espelho
    separado só com os binários (mais seguro que o token, mas mais complexo de manter; não usado
    porque não há segredo real dentro do repositório principal — chaves reais como
    `ANTHROPIC_API_KEY` e a chave `sb_secret_...` nunca ficaram commitadas, só a chave
    `anon`/publishable do Supabase, que é feita pra ser pública). **Lição**: `electron-updater` com
    provider `github` **exige repositório público** pra funcionar sem configuração extra — se um dia
    o repositório precisar voltar a ser privado (ex: código sensível de verdade), rever esse
    mecanismo de atualização antes, não depois de publicar uma tag.
22. **Repositório renomeado nesta sessão**: `amigao` → `sakura-system-ace` (pedido da usuária, nome
    antigo era resquício do projeto anterior em Next.js). O GitHub redireciona automaticamente o
    nome antigo pro novo por um tempo (não quebra na hora), mas `package.json` →
    `build.publish.repo` foi atualizado pro nome novo nesta sessão porque é usado ativamente toda
    vez que uma tag é publicada — deixar apontando pro nome antigo arriscaria depender do
    redirecionamento indefinidamente. **Se `git pull`/`git push` local parar de funcionar depois
    dessa mudança**, rodar `git remote set-url origin
    https://github.com/caranovavidanova/sakura-system-ace.git` no terminal.
23. **Continuação do item 15: operador sem loja vinculada trava "Inativar"/"Excluir" em silêncio** —
    mesma família de bug (RLS sem policy cobrindo o caso vira "botão não faz nada", sem erro).
    Editar/inativar/excluir um operador exige `operador_administra(id)`, que só é verdadeiro se
    quem está logado for admin de **alguma loja que o operador-alvo também tenha acesso**
    (`operador_lojas`, migration 0031). O "Operador Teste" (resíduo de antes da fundação
    multi-loja, só permissão de Início) nunca teve vínculo nenhum em `operador_lojas` — então
    nenhum admin, de nenhuma loja, conseguia mais administrá-lo: o clique em "Inativar" não dava
    erro nenhum, só não mudava nada (update filtrado a 0 linhas pela RLS). **Resolvido excluindo
    esse operador direto pelo painel do Supabase** (Authentication → Users → Delete user) — isso
    ignora a trava de loja (é ação de admin do próprio Supabase) e já arrasta a exclusão da linha
    em `operadores` sozinho, porque `operadores.id` referencia `auth.users(id) on delete cascade`.
    O `funcionarios` espelhado desse operador **não** é apagado junto (a FK
    `funcionarios.operador_id` é `on delete set null`, não cascade) — fica órfão, mas inofensivo;
    dá pra inativar normalmente pela tela de Funcionários, que não tem essa trava de loja. **Não
    foi feita nenhuma mudança de código** — a usuária decidiu não mexer na regra de RLS (o mesmo
    problema pode se repetir no futuro se um admin remover um operador de todas as lojas ao
    editá-lo, deixando-o "órfão" de novo; se isso voltar a acontecer, a solução é a mesma: excluir
    pelo painel do Supabase, não precisa de migration nem correção de RLS a menos que ela peça).
24. **"Importar por foto/PDF" falhava com erro genérico e sem causa visível** — a usuária reportou
    (print da loja de verdade) o erro "Edge Function returned a non-2xx status code" tentando ler
    uma foto `.jfif` de nota de peça. Duas correções aplicadas em `src/lib/iaNotaFiscal.ts`: (a)
    `arquivoParaConteudoNota()` mandava `arquivo.type` direto pra API do Claude sem checar se é um
    dos 4 valores aceitos (`image/jpeg`/`png`/`gif`/`webp`) — um `.jfif` no Windows pode reportar
    `image/pjpeg` ou string vazia, que a API rejeita; agora cai pro `image/jpeg` (compatível com o
    conteúdo real do arquivo) sempre que o tipo não é um dos aceitos nem `application/pdf`. (b)
    `lerNotasFiscais()` lançava só a mensagem genérica do `supabase-js` (`FunctionsHttpError`) sem
    ler o corpo da resposta, que já vinha com o motivo real (mesmo padrão do item 11 — erro
    engolido, ação parece "sem efeito"); agora lê `error.context.json()` antes de desistir.
    **Corrigido no código e já confirmado em parte na prática**: depois da `v0.9.6` chegar
    (auto-update), ela tentou de novo e, em vez do erro genérico de antes, apareceu a mensagem real
    vinda da Anthropic (`"Your credit balance is too low..."`, ver item 25) — prova de que a
    correção do item (b) funcionou (o motivo real agora aparece) e evidência forte de que o (a)
    também funcionou (o pedido chegou até a checagem de crédito da Anthropic, não voltou como
    "media_type inválido"). **Falta só confirmar a leitura de uma nota de verdade** depois que ela
    recarregar o crédito (item 25) — o mecanismo em si (chegar até a IA e ler a resposta) já está
    validado.
25. **Crédito da Anthropic pode acabar sem nenhum uso real no Sakura System, se a mesma chave for
    usada em outro projeto** — logo depois da `v0.9.6` chegar, o "Importar por foto" passou a
    falhar com o erro real da Anthropic: *"Your credit balance is too low to access the Anthropic
    API"*. A usuária tinha colocado US$ 5 de crédito, mas o saldo estava negativo (-US$ 0,06,
    recarga automática desligada) — foi consumido em outro uso da mesma chave da Anthropic, não
    pelo Sakura System. **Não é bug do sistema** — é só um lembrete de que a chave configurada no
    secret `ANTHROPIC_API_KEY` (Supabase → Edge Functions) é a mesma usada em qualquer outro
    projeto/teste que compartilhe essa conta da Anthropic; um consumo em outro lugar derruba o
    crédito do Sakura System sem aviso nenhum na hora. **Pendência em aberto**: ela ainda precisa
    recarregar o crédito (`console.anthropic.com` → Billing → "Comprar créditos") pra destravar o
    "Importar por foto" de novo — só isso falta pro item 24 acima ficar 100% confirmado. Se quiser
    evitar que isso se repita, dá pra criar uma chave separada só pro Sakura System (ideia
    oferecida, não pedida ainda).
26. **Padrão de bug: filtro client-side descarta linha parcialmente preenchida sem avisar** — em
    `ClienteForm.tsx`, a função que decide quais veículos salvar só mantinha um veículo se o campo
    Placa estivesse preenchido; um carro com Marca/Modelo já digitados mas Placa em branco era
    descartado no clique de "Salvar alterações" sem erro nenhum — parecia ter salvo, mas o veículo
    nunca chegava no banco. O motivo de existir era evitar salvar a linha 100% vazia que todo
    formulário de veículo nasce com; a correção foi trocar "tem placa?" por "tem **qualquer** campo
    preenchido?" (`veiculoTemAlgumDadoPreenchido()` em `schemas/cliente.ts`). **Lição**: um filtro
    client-side que decide "isso conta como preenchido?" olhando só pra UM campo é arriscado quando
    o formulário tem vários campos opcionais — testar o caso de preencher só os outros campos, não
    só o caso feliz de preencher tudo.
27. **Padrão de bug: `.value` de `input[type=date]` fica vazio até a data estar completa** — o
    seletor de data nativo do Chromium só preenche a propriedade `.value` em JS quando as 3
    "caixinhas" (dia/mês/ano) já formam uma data válida; no meio da digitação (ex: só o dia
    preenchido) `.value` já volta `""`, mesmo com algo visível na tela — e o navegador não deixa o
    Backspace apagar cruzando de uma caixinha pra outra (não tem API pra controlar isso). O hook
    novo desta sessão que faz Backspace/Delete limpar o campo de data inteiro
    (`useLimparDataAoApagar.ts`, ver seção 7) tinha um `if (!alvo.value) return` que parecia uma
    guarda inofensiva ("só limpar se tiver algo pra limpar"), mas na prática bloqueava o caso mais
    comum: corrigir um dígito errado ainda no meio de digitar a data. **Lição**: não confiar em
    `.value` pra saber se um campo de data "tem alguma coisa digitada" — só serve pra saber se tem
    uma data **completa e válida**.
28. **Padrão de bug: hidden input de `id` manda `""` (não `undefined`) pra um item novo de
    `useFieldArray`** — reportado pela usuária (print da loja de verdade): editar um cliente já
    existente e clicar "+ Adicionar veículo" pra incluir um carro novo dava
    `invalid input syntax for type uuid: ""` ao salvar, sem gravar nada. Causa: o item novo (sem
    `id` de banco ainda) tem um `<input type="hidden">` registrado pelo react-hook-form pro campo
    `id` (ver "Padrão de formulário" na seção 4 — todo item de lista dinâmica com `id` de banco
    precisa desse hidden input); como HTML não tem como um input "não ter valor", o formulário lê
    esse campo como string vazia `""`, não `undefined`. `atualizarCliente()`
    (`src/lib/clientes.ts`) mandava **todos** os veículos pro mesmo `upsert`, inclusive o novo com
    `id: ""` — o Postgres recusa string vazia numa coluna `uuid`. **Corrigido** separando os
    veículos em dois grupos antes de gravar: com `id` vão pro `upsert` de sempre (atualiza); sem
    `id` vão pra um `insert` à parte, sem a chave `id` no payload, deixando o banco gerar o UUID
    sozinho. **Lição**: em qualquer lista dinâmica (`useFieldArray`) com hidden input de `id` (ver
    seção 4), nunca mandar esse campo direto pra um `upsert` sem checar se é string vazia — vale
    conferir os outros módulos que usam esse mesmo padrão (Funcionários/filhos, Ordens de
    Serviço/itens, Pedidos de Compra/itens) se algum tiver o mesmo tipo de fluxo de "editar e
    adicionar item novo" via `upsert` batendo numa coluna `uuid`. **Corrigido no código, ainda não
    confirmado por ela rodando de novo na loja** (só o print do erro foi visto nesta sessão) — vale
    confirmar quando a próxima tag for publicada.
    **Continuação (sessão seguinte)**: a mesma correção tinha ficado incompleta — cobria só
    `atualizarCliente()` (editar cliente existente), não `criarCliente()` (cliente novo). Como o
    hidden input de `id` é registrado pra **todo** veículo do formulário, não só em edição, cadastrar
    um cliente **novo** já com um veículo preenchido caía no mesmo erro
    (`invalid input syntax for type uuid: ""`) — `criarCliente()` espalhava `...veiculo` (com
    `id: ""`) direto no `insert()`. A assinatura da função também estava com o tipo errado
    (`veiculos: NovoVeiculo[]`, sem `id`), mascarando o problema: o TypeScript não acusa erro porque
    `ClientesPage.tsx` passa uma variável já tipada `VeiculoFormulario[]` (com `id?: string`) pro
    parâmetro, e checagem de excesso de propriedade só vale pra literais de objeto, não variáveis.
    Corrigido montando o payload do insert campo a campo (mesmo padrão já usado no `insert` de
    veículos novos dentro de `atualizarCliente()`), e corrigido o tipo do parâmetro pra
    `VeiculoFormulario[]`, batendo com a realidade. Reportado pela usuária no chat (sem print, ela
    não conseguiu reproduzir de novo pra capturar — a caixa de veículo "ficou invisível" depois do
    erro, mas não achei nenhum `bg-white`/`bg-*` claro novo em `VeiculosFields.tsx`/`Combobox.tsx`
    que explicasse isso; pode ter sido só o estado visual truncado do próprio erro, vale confirmar
    se voltar a acontecer). Corrigido no código (PR #128, mesclado direto na `main`), **ainda não
    publicado em tag nem confirmado por ela rodando de novo**.
29. **Padrão de bug: `fetch()` direto na tela do Electron pra uma API externa dá "Failed to
    fetch"** — reportado pela usuária testando a emissão de NFS-e de verdade pela primeira vez
    (com o token de homologação): a tela mostrou só `Failed to fetch`, sem detalhe nenhum.
    Causa: a tela do app (processo **renderer** do Electron) é Chromium por baixo — se comporta
    como um navegador comum, inclusive respeitando CORS. APIs feitas pra ser chamadas de servidor
    pra servidor (como a do Focus NFe) normalmente não liberam CORS pra chamada direta de
    navegador, então o `fetch()` é bloqueado **antes** de qualquer resposta chegar — `Failed to
    fetch` é exatamente essa assinatura (diferente de um erro HTTP de verdade, que viria com
    status e corpo). **Corrigido** movendo a chamada de verdade pro **processo principal** do
    Electron (`electron/main.ts`, roda em Node.js — sem CORS, essa restrição é só de navegador),
    exposta pra tela via IPC: `ipcMain.handle("http:fetchComAuth", ...)` no principal,
    `window.sakuraApp.fetchComAuth(...)` repassado pelo preload (`contextBridge`/`ipcRenderer`), e
    `lib/focusNfe.ts` chama essa ponte em vez de `fetch()` direto. **Lição pra qualquer integração
    externa futura** (não só Focus NFe): se for chamar a API de terceiro **direto da tela** (não
    via Edge Function do Supabase, que já roda fora do navegador), primeiro confirmar se aquela
    API libera CORS pra navegador — a maioria das APIs fiscais/financeiras B2B não libera, porque
    são pensadas pra uso servidor-a-servidor. Nesses casos, IPC pro processo principal (esse mesmo
    padrão) é o jeito certo de contornar, não um workaround improvisado.
30. **Padrão de bug: tela "recarrega sozinha" ao voltar de alt-tab, perdendo o que estava sendo
    digitado** — reportado pela usuária (numa sessão posterior): dar alt-tab por só alguns
    segundos e voltar pro app fazia a mesma tela resetar sozinha. Não era o auto-updater (só
    checa uma vez na abertura do app e só instala ao fechar — não bate com "poucos segundos de
    alt-tab", e ela confirmou que é a mesma tela recarregando, não a tela de login voltando).
    Causa real: um comportamento do Chromium (base do Electron) chamado "window occlusion" — ele
    detecta quando a janela fica oculta atrás de outra, mesmo brevemente, e descarta/recarrega a
    página pra economizar recursos (pensado pra navegador com várias abas em segundo plano, não
    faz sentido pra um app desktop de uso o dia todo, sempre em primeiro plano). **Corrigido**
    desligando essa otimização em `electron/main.ts` via dois parâmetros do Chromium
    (`disable-backgrounding-occluded-windows`, `disable-renderer-backgrounding`, setados antes de
    `app.whenReady()`) + `backgroundThrottling: false` no `BrowserWindow`. **Lição de teste**: o
    bug em si é específico de Windows (a detecção de "occlusion" vem do DWM do próprio Windows) —
    não reproduz no sandbox Linux deste ambiente, só dá pra confirmar a correção de verdade
    testando alt-tab na loja. **Junto nesta mesma leva**: um auto-save de rascunho local (a cada
    30s, sem substituir o botão de Salvar) foi adicionado em `OrdemServicoForm.tsx`
    (`src/hooks/useRascunhoFormulario.ts`) como rede de segurança pra esse tipo de perda de
    progresso (e também serve pra fechamento repentino do programa, não só pra esse bug
    específico) — ver "Ordens de Serviço" na seção 7. **Nenhum dos dois foi confirmado por ela
    rodando de verdade ainda** (mesclado na `main`, sem tag publicada).
31. **Padrão de bug: item acrescentado numa OS já faturada deixa o total maior que o valor
    pago** — descoberto testando a NFC-e de verdade na `v0.9.13`: rejeição da SEFAZ *"Total dos
    pagamentos menor que o total da nota"*. Causa: faturar uma OS grava o pagamento no Caixa (ou
    Contas a Receber) com o total **daquele momento**, mas nada impedia continuar clicando
    "+ adicionar item" numa OS já faturada — o total da OS crescia, o valor já pago/lançado ficava
    pra trás, e a NFC-e (que soma os itens atuais) não batia mais com o pagamento (que ficou
    congelado no valor antigo). Não é só um problema de nota fiscal: mesmo sem emitir nada, isso já
    deixava peça baixada do estoque sem entrada correspondente no Caixa. **Decisão tomada com a
    usuária** (duas opções levantadas: tornar o faturamento editável, ou travar item pós-fatura) —
    optou pela trava, por ser bem mais simples e sem risco fiscal (editar faturamento exigiria
    desfazer/refazer Caixa/Contas a Receber, e se a nota já tivesse sido emitida, cancelar e
    reemitir na SEFAZ). **Corrigido**: o "+ adicionar item" some da tela (`ItensFields.tsx`) e a
    tentativa é bloqueada também no código (`OrdensServicoPage.tsx` → `handleSalvarEdicao`) quando
    `status === "faturada"` — precisando de mais peça/serviço depois de faturado, é OS nova. Só
    afeta OS já **faturada**; enquanto só "concluída" (fechou o serviço mas ainda não faturou)
    continua dando pra acrescentar item numa boa, porque o Caixa ainda nem foi gravado nessa hora.
    **Ponto trazido pela usuária junto**: como faturar virou definitivo pra sempre (não dá mais
    pra corrigir esquecendo um item), o botão "Confirmar faturamento" (`FaturamentoCard.tsx`) ganhou
    uma confirmação explícita (`confirm()`, mesmo padrão de exclusões/cancelamentos já usado no
    resto do app) avisando dessa consequência antes de faturar de verdade. **Publicado na
    `v0.9.14`** (build disparado direto pelo `workflow_dispatch` novo, ver "Empacotamento" na
    seção 7 — sem precisar da usuária mexer na tela do GitHub dessa vez).
32. **Padrão de bug: NFC-e de OS com peça E serviço juntos manda o pagamento cheio da OS, não só
    da parte de peça** — descoberto testando de novo na `v0.9.14`, depois de corrigir o item 31:
    rejeição da SEFAZ *"Ausência de troco quando o valor dos pagamentos informados for maior que o
    total da nota"*. Causa: o lançamento de Caixa (gerado ao faturar) cobre a OS **inteira** (peça +
    serviço), mas a NFC-e representa só a parte de peça — `buscarPagamentosParaNota()`
    (`EmitirNotaFiscalModal.tsx`) mandava o valor cheio do lançamento como se fosse só o pagamento
    da peça, então o total pago informado ficava maior que o total da nota sempre que a OS tinha os
    dois tipos de item juntos (só peça, sem serviço, nunca teve esse problema — só afeta OS mista).
    **Corrigido**: escala cada forma de pagamento proporcionalmente (`totalPecas / totalGeralOrdem`),
    com a última linha absorvendo a diferença de arredondamento pra soma bater exatamente com o
    total da nota (mesmo cuidado de arredondamento já usado em `calcularValorCobrado`, ver item 4 da
    seção 6). **Publicado na `v0.9.15`** (build disparado direto pelo `workflow_dispatch`, ver
    "Empacotamento" na seção 7) — ainda falta ela confirmar testando de novo se resolveu de
    verdade.
33. **Padrão de bug: a chave nova do Supabase (`sb_publishable_...`) não pode ir em
    `Authorization: Bearer`** — reportado por ela na primeira vez que usou a tela de conexão nova
    (`v0.9.16`, print da loja): "Testar conexão" acusava *"O endereço respondeu, mas a chave não foi
    aceita"* mesmo com a chave certa, colada do painel. Causa: `testarConexao()`
    (`src/lib/conexao.ts`) mandava a chave nos **dois** cabeçalhos, `apikey` e
    `Authorization: Bearer`. Isso funcionava com o formato **antigo** de chave anon (`eyJ...`, que
    é um JWT de verdade), mas o Supabase trocou pro formato novo `sb_publishable_...`, que é uma
    chave **opaca** — não é JWT, então usá-la como token de portador é recusado com 401. A própria
    documentação deles lista isso como erro comum. **Corrigido** mandando só `apikey`, que vale
    pros dois formatos. **Por que só a tela nova quebrou, e não o app inteiro**: o `supabase-js`
    também monta `Authorization: Bearer <chave>` quando não há sessão, mas o app praticamente não
    faz chamada REST antes do login (login vai pro `/auth/v1/`, que tolera), então nunca batia
    nesse caso — a tela de conexão foi o primeiro lugar a chamar `/rest/v1/` sem sessão.
    **Lição**: ao escrever qualquer checagem de credencial contra uma API, conferir em qual
    cabeçalho aquela credencial deve ir, em vez de mandar nos dois "por garantia" — mandar a mais
    pode ser o que causa a recusa. A tradução de código HTTP pra mensagem virou função pura
    (`mensagemDoTeste`) com teste, já que o sandbox não alcança `supabase.co` pra testar de ponta a
    ponta.

    **A correção acima NÃO resolveu — e o problema maior era outro (`v0.9.17`)**: com só `apikey`,
    o "Testar conexão" continuou reprovando a chave certa (print dela, já rodando a `v0.9.17`).
    Nunca foi possível confirmar por aqui qual era a causa exata, porque **o sandbox não alcança
    `supabase.co`** — ou seja, eu estava adivinhando o formato da requisição às cegas, duas vezes
    seguidas. **O erro de verdade não foi nenhuma das duas tentativas: foi ter feito uma checagem
    incerta virar pré-requisito pra salvar.** Enquanto `testarConexao()` reprovasse, o botão
    "Salvar e entrar" se recusava a gravar — então um palpite errado meu deixou a usuária
    **sem conseguir usar o sistema**, num computador onde a conexão estava certa o tempo todo.
    **Corrigido em duas frentes**: (a) o teste passou a usar o **próprio cliente do `supabase-js`**
    (`cliente.from("lojas").select("id").limit(1)`) em vez de montar a requisição à mão, então
    percorre exatamente o mesmo caminho que o app usa de verdade e não pode reprovar num detalhe
    de cabeçalho que só existia ali; (b) reprovar no teste **nunca mais impede de salvar** — a
    mensagem de erro passa a vir acompanhada de um botão "Salvar assim mesmo"
    (`ConexaoPage.tsx`), e há um limite de 10s na chamada pra não deixar o botão "Testando..."
    pendurado quando a URL está errada. **Lição que vale além deste bug**: uma validação sobre a
    qual não se tem certeza absoluta serve de **aviso, nunca de tranca** — ainda mais quando ela
    guarda a porta de entrada do sistema e o ambiente de desenvolvimento não consegue testá-la de
    verdade. Se a validação falhar, o pior caso tem que ser "a usuária segue em frente avisada",
    não "a usuária fica de fora". Testado no Electron real sob `xvfb`: o caminho de falha (que no
    sandbox acontece naturalmente, por não haver rede pro Supabase) mostra a saída, grava a
    conexão ao clicar nela, e o app destrava pro login.
34. **Padrão de bug: pegar "o dia" de um timestamp com `.slice(0, 10)` pega o dia em UTC, não no
    fuso local** — reportado pela usuária testando NFS-e em produção **à noite**: faturou uma OS
    de teste (cliente "Eduarda Cristina") e ela **sumiu da lista de Ordens de Serviço** logo depois
    de faturar — mas o lançamento apareceu certinho no Caixa Diário, confirmando que o faturamento
    funcionou, só a lista escondeu por engano. Causa: `data_abertura` vem do banco como timestamp
    em UTC; `OrdensServicoPage.tsx` e `LucratividadeSection.tsx` pegavam o "dia" pra comparar com o
    filtro de período fazendo `ordem.data_abertura.slice(0, 10)` — isso pega o dia **em UTC**. O
    filtro "Até" é calculado em hora **local** (`new Date().toLocaleDateString("sv-SE")`). No fuso
    do Brasil (UTC-3), qualquer horário local a partir de ~21h já é o dia seguinte em UTC — então
    uma OS faturada às 22h49, por exemplo, ficava com "dia" = amanhã em UTC, maior que o "Até: hoje"
    calculado em hora local, e caía fora do filtro (só as OS **faturadas** são filtradas por
    período — OS em aberto sempre aparecem, ver comentário no próprio código). **Corrigido**
    convertendo a data com `new Date(dataIso).toLocaleDateString("sv-SE")` antes de comparar —
    mesmo padrão que `DiarioSection.tsx` (Caixa Diário) já usava certo, e por isso o Caixa nunca
    teve esse sintoma. **Lição**: qualquer comparação de "dia" que mistura uma data vinda do banco
    (sempre UTC) com uma data calculada no navegador (sempre fuso local) é suspeita — sempre
    converter as duas pro mesmo fuso antes de comparar, nunca cortar a string do timestamp direto.
    Corrigido no código (PR mesclado), **ainda não confirmado por ela rodando de novo** — ela
    ainda está no meio do teste de NFS-e em produção quando isso foi encontrado.
35. **Padrão de bug: gráfico de Lucro contava só saída manual do Caixa como "Custos", nunca o
    custo de peça/serviço vendido** — reportado pela usuária: em Relações → Gráficos, "Lucro"
    aparecia com o mesmo valor de "Vendas". Causa: `GraficosSection.tsx` calculava "Custos" a
    partir dos lançamentos de **saída manual** no Caixa (aluguel, sucata etc.) — nunca olhava pro
    `preco_custo` da peça nem pro `custo` do serviço vendido em cada OS faturada. Sem nenhuma saída
    manual lançada no período, Custos ficava zerado e Lucro = Vendas sempre, mesmo período com
    vendas de verdade. **Corrigido**: passou a somar também o custo de aquisição de cada OS
    faturada (mesmo cálculo de `custoPorPeca`/`custoPorServico` já usado em
    `OrdensServicoPage.tsx` e `LucratividadeSection.tsx`), deduplicado por OS — importante porque
    uma OS com pagamento dividido em mais de uma forma gera vários `caixa_movimentos`, e contar o
    custo uma vez por lançamento (em vez de uma vez por OS) dobraria o valor. **Lição**: qualquer
    tela nova que precisar de "custo real" (não confundir com saída manual de Caixa, que é despesa
    operacional tipo aluguel) precisa ir buscar em `pecas.preco_custo`/`servicos.custo` via os itens
    da OS — não tem atalho genérico só olhando pro Caixa. `tsc -b`, lint e os 62 testes passando.

36. **Padrão de bug: cada migration é idempotente sozinha, mas a SEQUÊNCIA inteira não era** —
    variação mais sutil do item 12, achada ao gerar o arquivo de instalação única
    (`supabase/instalacao/instalacao-completa.sql`) e rodá-lo duas vezes no mesmo banco. Cada
    migration passava sozinha, mas 3 delas quebravam na reexecução da sequência inteira, todas com
    `column "id" of relation ... does not exist`: `0018`/`0024`/`0026` criam tabelas de
    configuração "singleton" (`id smallint primary key default 1`) e logo em seguida inserem a
    linha padrão usando `id` — só que a migration `0033`, **bem depois**, troca a PK dessas tabelas
    de `id` pra `loja_id` e derruba a coluna `id`. Na segunda passada, o `create table if not
    exists` pula (a tabela já existe, mas no formato NOVO) e o `insert` logo abaixo bate numa coluna
    que não existe mais. **Corrigido** envolvendo os 3 inserts numa guarda `do $$ ... if exists
    (select 1 from information_schema.columns where ... column_name = 'id') then ... end if`, que
    pula a linha padrão quando a tabela já virou "uma por loja" (a própria `0033` cria as linhas de
    cada loja). Validado rodando a instalação inteira **três vezes seguidas** num Postgres local,
    sem erro. **Lição**: "toda migration é idempotente" **não implica** "a sequência inteira é
    re-executável" — uma migration tardia que muda o formato de uma tabela pode invalidar a guarda
    de idempotência de uma migration anterior. Só aparece rodando a sequência completa duas vezes
    no mesmo banco, nunca revisando arquivo por arquivo.
37. **A instrução de criar o primeiro admin ficou desatualizada por 24 migrations, e quebra toda
    instalação nova** — o comentário de bootstrap no fim de `0007_operadores.sql` manda inserir só
    em `operadores`. Isso valia quando foi escrito, mas a migration `0031` (multi-loja) passou a
    exigir também uma linha em `operador_lojas` pra qualquer coisa por loja ficar visível. O
    backfill da `0031` só cobre operadores **que já existiam quando ela rodou** — num banco novo,
    criado do zero, não existe operador nenhum nesse momento, então o primeiro admin criado depois
    **nunca** ganha vínculo. **Comprovado num Postgres local** simulando o login desse admin
    (`set local role authenticated` + `request.jwt.claim.sub`): ele enxerga `depositos: 0`,
    `configuracoes_painel_inicio: 0`, `configuracoes_fiscais_loja: 0` — ou seja, entra no sistema e
    a loja aparece vazia/quebrada. Pior: cai no item 23 desta seção (operador sem loja não pode ser
    editado nem inativado por ninguém), então nem dá pra consertar pela tela — só apagando pelo
    painel do Supabase e refazendo. **Corrigido** adicionando o segundo `insert` ao comentário da
    `0007`, com o aviso do porquê, e documentando no checklist de instalação com destaque. **Lição
    maior**: comentário de bootstrap dentro de uma migration antiga **não é atualizado pelas
    migrations seguintes** — quando uma migration nova muda o que é preciso pra criar o primeiro
    usuário/registro de algo, procurar ativamente as instruções antigas que ficaram para trás.

38. **[RESOLVIDO em 28/08/2026 — ver item 40]** **O cartão "Lucros mês" da tela Início tem o
    MESMO bug do item 35, que só foi corrigido nos gráficos de Relações.**
    Encontrado por acaso ao gerar as imagens do site: com dados de demonstração plausíveis, o
    Início mostrava lucro de 91% sobre as vendas. `PainelPage.tsx` calcula
    `lucrosMes = vendasMes - custosMes`, onde `custosMes` soma **só os lançamentos de saída do
    Caixa** (aluguel, sucata, fornecedor pago) — nunca o `preco_custo` da peça nem o `custo` do
    serviço vendido em cada OS faturada. Ou seja, o número não é lucro: é
    "vendas − despesas operacionais lançadas à mão". Numa loja que não lança despesa manual
    nenhuma, o cartão mostra o **faturamento inteiro como se fosse lucro**. O item 35 corrigiu
    exatamente isso em `GraficosSection.tsx` (somando o custo de aquisição por OS faturada,
    deduplicado por OS — importante porque pagamento dividido gera vários `caixa_movimentos` pra
    mesma OS), mas `PainelPage.tsx` ficou pra trás. **Não corrigido nesta sessão** — foi só
    reportado pra ela, porque muda um número que ela olha todo dia e merece ser uma mudança
    separada, não escondida dentro do trabalho do site. **Lição que se repete**: ao corrigir um
    cálculo de negócio, procurar **todos** os lugares que fazem a mesma conta (mesma família dos
    itens 20 e 28) — `LucratividadeSection.tsx` também vale conferir junto quando isso for
    atacado.

39. **Campo que "para de aceitar digitação" e volta ao normal reiniciando o app — NÃO
    diagnosticado, mas agora tem como investigar.** Relatado por ela usando o sistema de verdade
    (28/08/2026): foi editar o CPF de um cliente, conseguiu **apagar** mas não conseguiu **digitar**
    — a mesma frase do item 17 desta seção, o que puxa naturalmente pra hipótese de "texto
    invisível". **Mas ela fechou e abriu o app e o problema sumiu sozinho — e isso muda o
    diagnóstico inteiro**: cor de texto não se conserta reiniciando, então não é CSS. Também não são
    os dois hooks globais de teclado (`useEnterParaProximoCampo` só trata Enter,
    `useLimparDataAoApagar` só `input[type=date]`), nem o `Combobox` (só mexe no próprio campo), nem
    o autosave de rascunho (só grava no localStorage). Sobra alguma coisa de **estado do app em
    execução** — o candidato mais provável é um erro de JavaScript solto que deixa parte da tela
    morta até a janela reiniciar. **Tentado reproduzir e não deu**: o `ClienteForm` foi renderizado
    de verdade com um cliente existente, primeiro no navegador e depois **dentro do Electron real**
    (`playwright._electron`, ver item 6) — apagar e redigitar o CPF funcionou nos dois, com letra
    branca sobre fundo escuro e nenhum `bg-white/*` por perto. **Nada foi "corrigido" às cegas**, de
    propósito: é exatamente o erro do item 33 (chutar duas vezes numa correção não testável).
    **O que foi feito**: o app passou a registrar erro de tela em arquivo —
    `%APPDATA%\Sakura System - AutoCenter Edition\erros.log`, mesmo espírito do `atualizacoes.log`
    do item 19 (`src/lib/registrarErros.ts` escuta `error` e `unhandledrejection` e manda pro
    processo principal gravar via IPC `log:erroDaTela`). Sem isso, um erro na tela do app instalado
    é 100% invisível: DevTools só abre em modo dev e um app aberto por duplo clique não tem terminal.
    **Se o sintoma voltar, o primeiro passo é pedir esse arquivo pra ela** — validado no Electron
    real (erro solto e promise rejeitada caíram no arquivo com data, mensagem e pilha).

40. **Três telas calculavam "lucro" de jeitos diferentes — e as três estavam erradas** (achado
    28/08/2026, ela pediu pra conferir os números olhando duas telas do sistema em uso real). É a
    conclusão da família dos itens 35 e 38: o mesmo erro reaparecendo em cada tela nova, porque
    cada uma refazia a conta por conta própria. Os três defeitos:
    - **Caixa Diário — "Lucro do dia" contava o lucro da OS uma vez por LANÇAMENTO.** Desde que o
      pagamento dividido existe (migration 0037), uma OS paga em duas formas gera dois
      `caixa_movimentos`; `totalLucro` somava `lucroDoMovimento(m)`, que devolve o lucro da **OS
      inteira**. No dia real dela: R$ 2.603,04 em vez de R$ 1.589,27 — o lucro da OS 3 (R$ 1.013,77)
      contado duas vezes. A coluna "Lucro" da tabela tinha o mesmo problema: repetia o valor cheio
      da OS em cada linha.
    - **Início — "Lucros mês" mostrava o faturamento como lucro** (é o item 38, que estava
      documentado e não corrigido): `custosMes` só somava saída manual do Caixa, nunca o
      `preco_custo` da peça nem o `custo` do serviço. Numa loja que não lança despesa à mão, o
      cartão mostrava Lucro = Vendas (no print dela: R$ 3.165,00 nos dois).
    - **Início — "Ticket médio" dividia por lançamento, não por OS.** `qtdTicket += 1` por
      movimento com `ordem_servico_id`: 3 OS em 4 lançamentos viravam média de R$ 791,25 em vez de
      R$ 1.055,00.
    **Corrigido de uma vez, com a conta num lugar só**: `src/schemas/metricasCaixa.ts` (funções
    puras testadas) — `resumirMovimentos()` devolve entradas, saídas, custo de aquisição
    (deduplicado por OS), lucro e ticket médio por ordem; `lucroPorMovimento()` reparte o lucro da
    OS entre os lançamentos dela, proporcional ao valor pago em cada um, pra a coluna fechar com o
    total; `custoDosItens()`/`mapaCustoPecas()`/`mapaCustoServicos()` são o cálculo de custo
    compartilhado. Caixa Diário, Início e Relações passaram a usar as mesmas funções — as três
    telas agora respondem o mesmo número pro mesmo período, que antes não acontecia.
    **Mudança de definição que vale saber**: "Lucro do dia" no Caixa agora também desconta as
    saídas lançadas à mão (aluguel, sucata), igual o gráfico de Relações já fazia — antes ignorava.
    **Lição (a mesma dos itens 20, 28 e 35, agora com solução estrutural)**: conta de negócio
    repetida em várias telas sempre diverge. Ao precisar de "lucro", "custo real" ou "ticket
    médio" numa tela nova, usar `schemas/metricasCaixa.ts` — não reescrever a conta ali.

41. **Campo numérico mudava de valor sozinho: a seta ↓ do teclado e a setinha do próprio campo**
    (31/08/2026). Ela achou uma peça com estoque de **1,99 UN** (amortecedor traseiro Ford Ka) e
    disse não ter digitado isso. A tela de Movimentações mostrou a origem exata: uma entrada de
    `1.99` com referência "Estoque inicial (cadastro do produto)" — ou seja, veio do campo "Qtde.
    estoque inicial", não de OS nem de importação. Causa: o Chromium trata **ArrowUp/ArrowDown**
    dentro de um `input[type=number]` como "somar/subtrair um step"; como o campo usa
    `step="0.01"`, um toque na seta pra baixo em cima de "2" deixa exatamente **1.99**. E a seta
    pra baixo é o gesto natural de quem quer descer a tela — dentro de um campo ela não rola a
    página, só mexe no número, sem aviso nenhum. A setinha minúscula do spinner, dentro do campo,
    faz o mesmo com um clique torto. **Corrigido** com `hooks/useNaoMexerNoNumeroSemDigitar.ts`
    (global em `App.tsx`, mesmo padrão do Enter/Backspace: bloqueia só as setas em campo numérico,
    digitação intacta) + CSS em `@layer base` escondendo os spinners. Vale pros 32 campos numéricos
    do app, não só a quantidade — o mesmo acidente num preço de venda mudaria 1 centavo sem deixar
    rastro em tela nenhuma.
    **Lição de método, que quase virou o terceiro chute do item 33**: a primeira hipótese foi a
    **rodinha do mouse** (o clássico "wheel muda input number"), e ela estava **errada** — testado
    no Electron real (Chromium 130), a rodinha não mexe mais no valor; o Chromium tirou esse
    comportamento. Só apareceu porque a hipótese foi testada antes de virar correção, e não depois.
    Testar cedo também evitou o inverso: o Chromium **141** avulso do sandbox e o **130** de dentro
    do Electron respondem diferente, então validar comportamento de campo nativo tem que ser no
    Electron do projeto, nunca num Chromium qualquer.

42. **Padrão de bug: `toISOString().slice(0, 10)` grava o dia em UTC, não o dia de quem está
    usando** (achado em 02/09/2026, numa varredura de cálculo pedida por ela). É o item 34 de
    novo, em **três lugares** que ninguém tinha olhado — e todos os três importam justo à noite,
    que é quando ela costuma mexer no sistema (das 21h em diante o UTC já virou amanhã, no fuso do
    Brasil):
    - `lib/notasFiscais.ts` — a **competência da nota fiscal emitida**. Uma nota emitida às 22h do
      dia 31 era arquivada no **mês seguinte**: some da divisão daquele mês na tela de Notas
      Fiscais (e do .zip do mês, ver seção 7), e chega errada pra contabilidade.
    - `lib/focusNfe.ts` — a **data de emissão** mandada pra Focus NFe. Documento fiscal saindo com
      a data de amanhã.
    - `lib/pedidosCompra.ts` — a data do pedido criado ao importar o XML do fornecedor.
    **Corrigido** com um helper único, `src/lib/datas.ts` (`hojeLocal()` / `diaLocal()`), testado
    inclusive com o fuso fixado em `America/Sao_Paulo` — a máquina de teste roda em UTC, onde esse
    erro **não aparece**, então sem fixar o fuso o teste passaria de qualquer jeito. **Lição**:
    `toISOString()` nunca serve pra saber "que dia é hoje" pro usuário; e um teste de fuso que não
    fixa o fuso não testa nada.
43. **Padrão de bug: "mesmo dia do mês que vem" com `new Date(ano, mes, dia)` transborda em vez de
    recusar** (mesma varredura). Em Contas a Pagar, a conta recorrente com vencimento em **29, 30
    ou 31** — que é justo onde caem aluguel e financiamento — pulava um mês inteiro: 31/01 virava
    "31 de fevereiro", que o JavaScript converte pra **03/03**. E não era só um mês perdido: a
    ocorrência seguinte já nascia dia 3, então o vencimento desandava pra sempre. **Corrigido**
    segurando o dia no último dia do mês de destino (31/01 → 28/02), com teste cobrindo ano
    bissexto e virada de ano. **Resíduo conhecido, aceito**: depois de segurar em fevereiro, o dia
    fica preso no 28 — voltar pro 31 exigiria guardar o dia original numa coluna nova. É bem menos
    grave que pular um mês, mas se um dia incomodar, é uma migration pequena.
44. **Padrão de bug: o desconto do item sumia na NFC-e — em três contas diferentes que faziam a
    mesma coisa** (mesma varredura). `montarItemNFCe()` calculava o valor do item como
    `quantidade × preço`, ignorando o `desconto` da linha da OS; o total dos produtos e a base do
    ICMS, calculados à parte no corpo da nota, faziam o mesmo. Consequência: numa OS com desconto
    em peça, a nota valia **mais do que o cliente pagou**, e como os pagamentos informados são
    rateados sobre o total da OS (que **já** desconta), a soma dos pagamentos ficava menor que o
    total da nota — a mesma família de rejeição da SEFAZ dos itens 31 e 32. **Corrigido** com uma
    função só (`valorLiquidoItem`) usada pelos três lugares. O desconto entra **abatido no preço
    unitário**, não num campo separado, porque a SEFAZ confere que "valor bruto = quantidade ×
    unitário" — e porque inventar nome de campo fiscal sem documentação é exatamente o que este
    projeto já decidiu não fazer (ver item 1 da seção 8). **Lição**: sempre que uma conta de
    dinheiro aparece em mais de um lugar, ela vai divergir — é a terceira vez que isso acontece
    aqui (itens 35, 40 e agora este).
45. **Dois erros menores da mesma varredura, corrigidos junto**: (a) o filtro de "este mês" dos
    cartões do Início comparava **só o dia do mês** (`getDate() <= hoje`) depois de checar que não
    era de antes do mês — então um lançamento de 1º de dezembro entrava no cartão de setembro;
    agora compara data inteira. (b) `calcularListaParcelas()` dividia o total pelo número de
    parcelas sem arredondar: R$100 em 3x virava "3x de R$ 33,33", que soma R$ 99,99 na frente do
    cliente. Agora a última parcela absorve a sobra, como faz a maquininha — mesma técnica que o
    rateio de pagamento da nota já usava.

46. **Varredura só da parte fiscal (02/09/2026)** — pedida logo depois da varredura de cálculo.
    Cinco defeitos corrigidos, todos do tipo "falha em silêncio":
    - **Alíquota do ISS em branco virava 0% na nota.** `montarCorpoNFSe()` mandava
      `aliquota_iss ?? 0` sem checar nada — diferente do código do município e do CNAE, que já
      tinham guarda. A prefeitura autorizaria a nota com ISS zerado e o problema só apareceria
      depois, com a contabilidade. Agora a emissão para antes, explicando o que falta.
    - **A `ref` da emissão sumia quando a espera vencia.** A emissão é assíncrona: o sistema manda
      a nota e fica consultando por ~30s. Estourando esse tempo, a mensagem antiga dizia "consulte
      de novo" — **sem dizer o quê**: a `ref` (o único jeito de achar a nota no painel da Focus
      NFe) só existia dentro daquela função e se perdia. Como a nota **pode ter saído autorizada**,
      o caminho natural seria clicar em emitir de novo e acabar com **duas notas válidas pra mesma
      venda**. Agora a `ref` aparece na mensagem, junto com o aviso de conferir antes de reemitir.
    - **Excluir uma nota autorizada não avisava nada.** O botão "Excluir" de Notas Fiscais tratava
      nota emitida pelo sistema como arquivo qualquer: apagava o registro e o XML, **sem desfazer
      nada na SEFAZ** — a nota continua valendo lá fora, o XML (guarda obrigatória de 5 anos) some,
      e a OS volta a aparecer como "falta nota", convidando a emitir a segunda. Agora, só nesse
      caso, a confirmação explica isso e aponta pro botão "Cancelar nota", que é o certo.
    - **Competência da nota emitida gravava o dia da emissão**, enquanto o upload manual grava
      sempre o dia 1º — dois formatos na mesma coluna. Normalizado (`primeiroDiaDoMesLocal()`).
    - **`valor_servicos` e `aliquota` da NFS-e iam como número sem arredondar** — são os únicos
      valores do corpo que não são texto com 2 casas, e soma de item em ponto flutuante pode
      produzir `90.00000000000001`, que iria assim pro XML.
    **Lição comum aos cinco**: a parte fiscal quase nunca falha com erro na tela — ela falha
    autorizando algo errado, ou perdendo o rastro de um documento que já existe lá fora. Ao mexer
    aqui, a pergunta útil não é "isso dá erro?", é "se isso estiver errado, alguém fica sabendo?".

47. **A importação de nota do fornecedor copiava o código de ICMS DELE pro cadastro da loja**
    (09/09/2026, reportado por ela com print). Emitir NFC-e passou a falhar com *"Rejeição:
    Informado CST para emissor do Simples Nacional (CRT=1 ou 4) [nItem:1]"*. Causa: quem é do
    Simples usa **CSOSN** (3 dígitos), quem é do regime normal usa **CST** (2 dígitos) — e tanto
    o "Importar XML de nota fiscal" quanto o "Importar por foto" gravavam em `pecas.cst_ou_csosn`
    o código que veio na nota do **fornecedor**. Fornecedor do regime normal manda CST, a peça
    nasce com um código que a nota dela nunca vai aceitar, e o erro só aparece semanas depois, na
    emissão.
    **Dois agravantes que fizeram isso custar caro**: (a) a mensagem da SEFAZ diz só o número do
    item (`[nItem:1]`), **nunca o nome da peça** — achar qual das peças da OS está errada é
    adivinhação; (b) o campo parecia preenchido, então não havia nada na tela sugerindo problema.
    **Corrigido em três frentes**, com a regra isolada em `src/schemas/tributacao.ts` (funções
    puras, 17 testes): as duas importações deixam de copiar o código do fornecedor quando ele não
    serve pro regime da loja (usam o CSOSN que a **própria loja** mais usa no cadastro dela, ou
    campo em branco — nunca um código inventado por aqui); e a tela de emissão passa a conferir
    antes de mandar, listando **o nome de cada peça** e o motivo. **É aviso, não trava** (mesma
    lição do item 33): a lista de códigos válidos envelhece com mudança de legislação, e barrar a
    emissão por causa de um palpite daqui seria pior que deixar a SEFAZ decidir.
    **Cuidado que apareceu no preview e vale pra qualquer tela nova**: o primeiro desenho colocava
    o campo de CSOSN **dentro** da faixa amarela de aviso (`bg-amber-50`, fundo claro) — e
    `globals.css` força `input { color: #fff }` fora de `@layer`, então o campo nasceu ilegível.
    É a família dos itens 14/17, e o `npm run contraste` **não pega** esse caso (fundo e texto
    ficam em elementos diferentes). Regra prática: **campo de formulário nunca vai dentro de uma
    faixa de aviso clara** — o aviso fica só com o texto, e o campo desce pro fundo escuro do card.

48. **As checagens deixaram de depender de alguém lembrar (11/09/2026).** Até aqui, `tsc`, lint,
    `npm test`, `npm run contraste` e "o `instalacao-completa.sql` está em dia?" eram rodados **à
    mão, sessão a sessão** — o que significa que cada sessão nova (sem memória da conversa
    anterior) podia simplesmente não rodar. Agora há um CI (`.github/workflows/ci.yml`) que roda as
    cinco em todo push e PR. Duas travas novas foram junto, e as duas nasceram de bug real:
    - **Regra de lint contra cortar o dia em UTC** (`eslint.config.js`,
      `no-restricted-syntax`). O bug dos itens 34 e 42 já voltou **quatro vezes** — a correção
      sempre foi trocar os lugares achados, o que nunca impediu o quinto. Agora
      `.toISOString().slice(...)` e cortar exatamente 10 caracteres reprovam o lint.
      **Cuidado ao mexer**: a regra proíbe o GESTO de cortar o dia, **não** o `toISOString()` em
      si — gravar um instante completo em UTC (`data_pagamento`, `data_fechamento`,
      `atualizado_em`) está certo e continua liberado. Proibir `toISOString` inteiro geraria ~10
      falsos positivos e ensinaria a espalhar `eslint-disable`, que é pior que não ter regra. As
      duas ÚNICAS exceções declaradas são `datas.test.ts` e `comissoes.test.ts`, que cortam o dia
      errado de propósito pra provar que o jeito errado erra.
    - **A suíte roda nos dois fusos** (`npm run test:fusos`,
      `scripts/testar-nos-dois-fusos.mjs`). A máquina de teste — aqui e no GitHub — usa UTC, e é
      justamente em UTC que esse bug **não aparece**. Antes, cada teste que se importava precisava
      lembrar de fixar o fuso na mão. **Não trocar por `TZ=x npm test` no `package.json`**: essa
      sintaxe não funciona no PowerShell do Windows, que é onde ela roda os comandos.
    **O que ainda depende dela**: deixar o CI como obrigatório pra mesclar (Settings → Branches)
    só **depois** de ver ele verde algumas vezes — travar o merge antes disso atrapalharia o fluxo
    de mesclar direto na `main`, que é decisão dela (seção 3).

49. **A mesma conta de centavo estava escrita 12 vezes — e uma delas estava errada (11/09/2026).**
    A varredura do guia de melhorias (TR-05.3) começou como uma conferência de tipo de coluna e
    achou três coisas encaixadas:
    - **A boa notícia primeiro**: nenhuma coluna de dinheiro do banco é `double precision` — o erro
      de ponto flutuante nunca entrou pelo armazenamento. Inventário completo na seção 5, pra
      ninguém precisar checar de novo.
    - **O bug**: `valorTotal`, em `faturarOrdem()` (`src/lib/ordensServico.ts`), somava os
      pagamentos com um `reduce` **sem arredondar**, e esse valor ia pro banco em Contas a Receber.
      Somar números **já arredondados** ainda deixa cauda (`0.1 + 0.2` dá `0.30000000000000004`), e
      a coluna `contas_receber.valor` era `numeric` sem casas declaradas, então guardava a cauda
      inteira — testado num Postgres local: `1234.5600000000002` foi gravado com as 13 casas. Não
      dava erro em lugar nenhum e não aparecia na tela (a exibição formata em 2 casas), que é
      exatamente o tipo de defeito que este projeto costuma descobrir tarde.
    - **A causa de fundo**: a expressão `Math.round(valor * 100) / 100` estava escrita **12 vezes
      em 7 arquivos**, sendo 4 delas funções privadas idênticas chamadas `arredondar`, copiadas de
      um arquivo pro outro. É a quarta vez que "conta de dinheiro repetida divergiu" neste projeto
      (itens 35, 40 e 44). Virou `src/schemas/dinheiro.ts` — `paraCentavos`, `deCentavos`,
      `arredondarCentavo` e `somar` —, usado pelos 7 arquivos.
    **Decisão deliberada: a aritmética NÃO mudou.** `arredondarCentavo` faz exatamente a mesma
    conta que já estava espalhada, inclusive o canto conhecido dela (1,005 vira 1,00, não 1,01,
    porque em binário 1,005 fica um fio abaixo da metade). Mudar a regra de arredondamento
    alteraria valor que sai em nota fiscal e em lançamento de caixa — isso é decisão dela, não
    efeito colateral de uma arrumação de código. Há um teste que **fixa** esse comportamento, pra
    que mudá-lo um dia seja escolha visível.
    **Trava pra não voltar**: `src/schemas/arquitetura.test.ts` varre `src/pages/` e reprova conta
    de dinheiro escrita dentro de tela. Ele pega as duas formas do item 40
    (`const lucro = vendas - custos` e `const ticketMedio = total / qtd`) e deixa passar tela que
    só **chama** a função pura. Foi calibrado contra o código real, não no papel: a primeira versão
    passou batido justo na forma mais comum do bug, e acusou dois falsos positivos porque a barra
    de um fecha-tag de JSX (`</td>`) parece uma divisão.
    **Duas telas estão na lista de dívida conhecida do teste**, com nome e sobrenome, porque já
    faziam conta de dinheiro antes dele existir: `relatorios/LucratividadeSection.tsx` (receita,
    custo e margem por item — já apontada no item 38 e nunca movida) e
    `estoque/RelatoriosEstoqueSection.tsx` (valor do estoque = saldo × preço de custo). Mover as
    duas é refatoração de tela (pede preview renderizado), não foi feito aqui. O teste garante que
    a lista **não cresce**, e reprova pedindo pra apagar a entrada se alguém mover a conta — assim
    ela encolhe em vez de envelhecer.
    **Uma conta saiu de dentro da tela nesta leva**: `jurosDasLinhas` (quanto os juros do cartão
    acrescentam no pagamento dividido) morava em `FaturamentoCard.tsx` e virou função pura testada
    em `schemas/faturamento.ts`.

50. **A varredura de segredo automática NÃO pega o tipo de credencial que vazou aqui
    (11/09/2026)** — e é importante não confundir as duas coisas. O CI agora roda `gitleaks`
    (`.gitleaks.toml`), com 3 regras próprias além das de fábrica, porque as de fábrica foram
    **testadas** contra os formatos deste projeto e deixavam passar justamente
    `sb_secret_...` (Supabase) e `sk-ant-...` (Anthropic) — as duas que ele de fato manuseia.
    **Mas**: varrer o histórico completo (414 commits) com as regras de fábrica devolveu
    *"no leaks found"*, mesmo o CSC da SEFAZ, o token do portal Giap e a senha da prefeitura
    estando lá. O motivo é simples e vale entender: essas três são **texto comum**, sem formato
    que as distinga de uma palavra qualquer. Nenhuma ferramenta pega. **Conclusão prática**: a
    varredura é uma rede pra chave de API; a proteção contra colar senha de portal é a regra no
    topo deste arquivo, e trocar as três credenciais continua sendo obrigatório.
    **Duas decisões de desenho, pra não serem "corrigidas" depois**: (a) o CI varre a árvore de
    arquivos **como ela está agora** (`--no-git`), não o histórico — uma checagem que nunca pode
    ficar verde (o histórico já carrega segredo, e reescrever histórico está proibido: quebraria o
    auto-update e invalidaria as releases) é uma checagem que todo mundo aprende a ignorar; (b) há
    um passo separado que reprova se um `.pfx`/`.p12`/`conexao.json` for versionado — certificado
    digital é a identidade fiscal da empresa, e o repositório é público.

51. **Classe do Tailwind vence CSS de `@layer base` — o lado inverso do item 14 (11/09/2026).**
    Ao dar foco de teclado ao app (`TR-02.2`), a regra `:focus-visible` foi escrita em
    `@layer base`, como manda o item 14. Só que existiam **78 `outline-none` espalhados em 37
    arquivos**, nos campos de formulário. Como classe do Tailwind, eles moram na camada
    `utilities`, que vence a `base` **não importa a especificidade** — ou seja, o anel de foco
    funcionaria em tudo, menos justo nos campos onde ele mais importa. Foram removidos (o
    `focus:border-sakura-purple` que acompanhava cada um ficou, agora como reforço).
    **Lição**: o item 14 diz que CSS fora de camada vence classe do Tailwind; o contrário também
    é verdade, e é o caso mais comum — ao escrever regra global em `@layer base`, procurar antes
    a classe utilitária que a anula.

    **Cuidado de portal, da mesma leva**: toda lista do app fica dentro de
    `overflow-hidden sakura-card`, então um menu suspenso posicionado ali dentro nasce
    **recortado**. E `position: fixed` **não** salva: o `backdrop-filter` do `sakura-card` vira
    bloco de contenção pra elemento fixo. Por isso o menu de `AcoesDaLinha.tsx` é renderizado num
    portal pro `<body>`. Vale pra qualquer coisa suspensa que venha a existir dentro de um card.

52. **`Number(undefined)` é `NaN`, e comparador que devolve `NaN` não ordena nada (11/09/2026).**
    O menu de ações novo ordena pra deixar o destrutivo por último — a garantia que o item
    `TR-02.1` inteiro existe pra dar. O comparador era
    `Number(a.tipo === "menu" && a.perigosa) - Number(...)`; quando `perigosa` vem `undefined`,
    aquele `&&` devolve `undefined` e `Number(undefined)` é **`NaN`**, não `0`. Comparador que
    devolve `NaN` faz o `sort` não reordenar nada, e o **"Excluir" nascia em primeiro no menu**,
    bem onde o dedo cai. Corrigido com `=== true`. **Lição de método, mais que de JavaScript**:
    isso passou pela leitura do código e foi pego pelo teste de tela, que conferia justamente a
    promessa do item ("o destrutivo é o último"). Quando uma mudança tem uma promessa em uma
    frase, essa frase vira teste.

53. **Três lições de uma mudança grande e chata (a escala tipográfica, 11/09/2026).** O item
    `TR-01.1` trocou 756 classes de tamanho de fonte em 89 arquivos. O trabalho em si foi
    mecânico; o que valeu aprender foi o resto:
    - **A premissa do guia estava errada, e só o código sabia disso.** Ele pedia tabela em 13px
      "porque estão em 11-12px". Conferido: **25 das 28 tabelas já usavam 14px** — obedecer teria
      ENCOLHIDO justo o que o item veio consertar. O guia é um bom cardápio, mas ele foi escrito a
      partir de PDF e documentação, não do código; quando ele der um número, conferir o número
      antes de aplicar.
    - **Uma mudança de tela quebrou uma FERRAMENTA do repositório, em silêncio.** O `TR-02.1`
      moveu "Cancelar nota" pra dentro do menu de três pontinhos — e o gerador do catálogo de
      telas (`site/ferramentas/gerar-catalogo-telas.mjs`), que clica nesse botão pelo texto,
      passou a falhar naquela cena. Nada no app quebrou, então nada avisou. Só apareceu ao rodar
      o gerador de novo, uma leva depois. **Lição**: ao mudar rótulo ou lugar de um botão,
      `grep` pelo texto dele em `site/ferramentas/` — é onde mora o único teste de tela que
      existe hoje.
    - **O gerador precisa de um `.env` na raiz, mesmo de mentira.** Sem ele, o app abre na tela de
      **conexão** em vez do login e **todas** as 54 cenas falham com timeout no botão de entrar —
      um sintoma que não sugere a causa em nada. O `.env` não é commitado, então toda máquina
      recém-clonada cai nisso. Já está escrito no topo do próprio gerador.
    **E o que de fato protege a escala não é este parágrafo**: é
    `src/schemas/tipografia.test.ts`, que reprova classe de tamanho crua em `src/` apontando
    arquivo e linha. Ele foi conferido plantando um `text-xs` de propósito pra vê-lo reprovar —
    teste de regra que nunca falhou na frente de alguém não prova nada (a primeira versão do teste
    de arquitetura, item 49, passou batido justo na forma mais comum do bug).

## 7. Estado atual por módulo (tudo confirmado rodando de verdade pela usuária, salvo indicação contrária)

**Escopo da v1 original** (100% completo): Clientes (+ veículo), Peças/Produtos (campos fiscais
completos), Estoque (entrada/saída, saldo), Ordens de Serviço, Caixa Diário, Relações,
Painel/Início.

**Ordem do menu lateral**: reorganizada a pedido da usuária, agrupando por fluxo de trabalho —
Início, Clientes, Ordens de Serviço, Estoque, Serviços, Caixa Diário, Contas a Pagar, Relações,
Garantias, Notas Fiscais, Funcionários (RH por último, de propósito — é cadastro usado bem menos
no dia a dia do balcão do que os módulos anteriores). Ver `MODULOS` em `src/types/operador.ts`.

**Enter avança pro próximo campo**: em qualquer formulário do app, apertar Enter move o foco pro
próximo campo em vez de tentar enviar o formulário — pensado pra quem trabalha só de teclado, sem
mouse (comum em balcão de loja). No último campo, Enter foca o botão de salvar/confirmar (mais um
Enter confirma). Implementado uma única vez, globalmente (`src/hooks/useEnterParaProximoCampo.ts`,
usado em `App.tsx`) — não precisa de nada especial em cada tela nova, funciona em qualquer
`<form>`. Campos de texto multilinha (`<textarea>`, ex: "Observação" da OS) continuam com Enter
normal (quebra de linha).

**Backspace limpa o campo de data inteiro** (nesta sessão): campos `type="date"` usam o seletor
nativo do Chromium, dividido em "caixinhas" (dia/mês/ano) que o navegador não deixa apagar
cruzando uma pra outra via JS — Backspace/Delete num campo de data agora limpa o campo inteiro,
deixando redigitar sem precisar do mouse. Implementado uma única vez, globalmente
(`src/hooks/useLimparDataAoApagar.ts`, mesmo padrão do Enter acima). Ver item 27 da seção 6 pro
bug corrigido no próprio fix (checar `.value` bloqueava o caso mais comum, corrigir um dígito
ainda no meio da digitação).

**Campo numérico só muda digitando** (31/08/2026): em qualquer campo de número do app, as setas
↑/↓ do teclado não somam nem subtraem mais, e as setinhas de spinner dentro do campo foram
escondidas — o valor só muda quando alguém escreve. Vale pros 32 campos numéricos (preço,
quantidade, desconto, juros, alíquota). Global, sem nada a fazer em tela nova
(`src/hooks/useNaoMexerNoNumeroSemDigitar.ts` + CSS em `globals.css`). Ver item 41 da seção 6 pro
estoque de "1,99 UN" que revelou isso.

**Foco de teclado visível em tudo** (11/09/2026, item `TR-02.2` do guia): até aqui o app não
desenhava foco nenhum — o anel padrão do Chromium é escuro e sumia no fundo quase preto. Num app
feito pra ser usado só de teclado no balcão, isso é armadilha: dava pra apertar Enter sem saber em
que campo se estava. Agora todo campo, botão e link mostra um anel ao ser alcançado pelo teclado.
São dois anéis sobrepostos (um escuro colado na borda, um claro 2px pra fora) pra funcionar tanto
sobre o card escuro quanto sobre a faixa amarela de aviso da emissão de nota. Regra única em
`@layer base` do `globals.css`, sem nada a fazer em tela nova. Ver item 51 da seção 6 pro motivo
de os 78 `outline-none` do app terem saído junto.

**Escala tipográfica** (11/09/2026, item `TR-01.1` do guia): o tamanho de fonte agora sai de uma
escala única no `@theme` do `globals.css`, com nome por **papel** e não por tamanho — `text-metrica`
(número grande de cartão), `text-titulo` (o `<h1>` da tela), `text-destaque` (valor que salta num
card), `text-subtitulo`, `text-corpo` (texto normal, 14px), `text-tabela` (tabela densa, 13px),
`text-rotulo` (rótulo/etiqueta, 13px) e `text-meta` (só metadado, 12px). Cada uma carrega a própria
altura de linha. Em tela nova, **escolher pelo papel do texto** — não voltar a `text-xs`/`text-sm`,
que `src/schemas/tipografia.test.ts` reprova apontando arquivo e linha.
**Nada encolheu nessa troca**: o menor texto do app subiu de 12 pra 13px e o de 10/11px pra 12px.
Duas coisas contra a intuição: a tabela **comum** usa `text-corpo` (14px), não `text-tabela` — o
guia supunha tabela em 11-12px, mas 25 das 28 já eram 14px, e baixar seria piorar; e `tabela` e
`rotulo` têm o mesmo tamanho de propósito, são o mesmo degrau com papéis diferentes.

**Ações de linha das listas** (11/09/2026, item `TR-02.1` do guia): em toda lista, o trio
`Editar Inativar Excluir` era três palavras coladas em texto de ~10px, com o destrutivo
encostado no anterior. Virou um padrão único (`components/AcoesDaLinha.tsx`): ícone de 32x32 com
8px de folga pro que é do dia a dia, e menu de três pontinhos pro que não dá pra desfazer — então
excluir um cliente passou a ser dois gestos, não um clique torto. Onde virar ícone seria
adivinhação ("Marcar como paga", "Receber", "Ver DANFE"), a palavra continua lá, num botão de
32px de altura. Vale em Clientes, Produtos, Serviços, Fornecedores, Pedidos de compra,
Funcionários, Contas a Pagar, Notas Fiscais e Operadores. **Ponto ainda em aberto com ela**:
"Editar" e "Inativar" viraram ícone (com o nome no balãozinho do mouse), que é o que o guia pedia
— se ela preferir a palavra escrita na linha, é troca de uma palavra por lista.

**Modal com foco preso** (11/09/2026, item `TR-02.3` do guia): o `Modal.tsx` — usado em
confirmação de dinheiro e de documento fiscal — deixava o Tab escapar pra tela de trás. Agora
prende o Tab, fecha no `Esc`, devolve o foco pro botão que abriu e marca o fundo como inerte. O
foco inicial cai sempre no ✕: num modal de cancelar nota, um Enter no automático fecha, nunca
confirma.

**Auto-save de rascunho** (estendido nesta sessão): os formulários longos guardam sozinhos uma
cópia local do que está digitado, a cada 30s — **não é um "salvar" de verdade** (não manda nada pro
banco nem substitui o botão Salvar), é rede de segurança pra quando o programa fecha de repente ou
a tela recarrega sozinha (ver item 30 da seção 6). Ao reabrir o mesmo registro, aparece a faixa
"Encontramos um rascunho não salvo... Restaurar?" (`components/AvisoRascunho.tsx`); salvar de
verdade descarta o rascunho. Cobre **Ordem de Serviço, Cliente, Funcionário, Produto e Pedido de
Compra** — os cinco formulários onde dá pra perder bastante digitação. Ligar num formulário novo
são duas linhas: o hook `useRascunho(chave, watch, reset)` (`src/hooks/useRascunhoFormulario.ts`)
mais o `<AvisoRascunho>`. **Cuidado embutido**: o autosave compara com o retrato de quando a tela
abriu e ignora formulário intocado — sem isso, só abrir uma tela e deixar 30s já criaria um
rascunho falso pra próxima abertura, o que em cinco telas viraria chateação.

- **Conexão com o banco (multi-empresa)** — construída nesta sessão e **confirmada funcionando de
  verdade por ela** (instalou a `v0.9.18` no notebook dela, colou URL + chave, entrou no sistema
  normalmente). Antes, a URL/chave do Supabase eram gravadas dentro do instalador (secrets
  do GitHub no `release.yml`), então **um instalador servia uma empresa só**. Agora cada computador
  escolhe a conexão na primeira abertura, numa tela própria (`pages/conexao/ConexaoPage.tsx`) que
  aparece no lugar do login enquanto não houver conexão salva; o valor fica guardado **só naquela
  máquina**, num `conexao.json` dentro da pasta de dados do app (no Windows, algo como
  `%APPDATA%\Sakura System - AutoCenter Edition\conexao.json`). A tela tem "Testar conexão" e
  também testa sozinha antes de salvar — salvar um endereço com erro de digitação deixaria o app
  numa tela de login que nunca funciona, sem explicação. Pra trocar depois, há um link discreto
  **na própria tela de login** (de propósito: se a conexão estiver errada ninguém entra, então o
  conserto não pode estar atrás do login, em Configurações).
  - **Decisão importante tomada junto**: os secrets `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY`
    foram **removidos do `release.yml`**, ou seja, o instalador não carrega mais a conexão de
    empresa nenhuma. O motivo é de segurança de dado, não de arquitetura: mantendo os secrets, o
    instalador entregue ao amigo do pai dela viria pré-preenchido com o banco da **Pneus Amigão** —
    um clique distraído e ele estaria vendo os dados dos clientes de outra empresa. Com eles fora,
    a tela nasce vazia pra todo mundo. Em `npm run dev` nada muda: o `.env` continua valendo, e a
    tela nem aparece (`import.meta.env.DEV` manda; ver `src/lib/conexao.ts`).
  - **Consequência prática pra loja que já usa (Pneus Amigão)**: na primeira abertura **depois** de
    atualizar pra versão que levar isso, o app vai pedir a conexão uma vez, com os campos vazios.
    Os valores são os de sempre — URL `https://rlgdjiowvnfzsedehyga.supabase.co` e a chave `anon`
    do painel do Supabase (Settings → API). É uma vez por computador, não toda abertura. **Avisar a
    usuária antes de publicar a tag**, pra ela não ser pega de surpresa (ou pro pai dela não ser).
  - **Como o valor chega na tela sem IPC assíncrono**: `electron/main.ts` lê o `conexao.json` na
    abertura e joga em `process.env.SAKURA_SUPABASE_URL`/`SAKURA_SUPABASE_ANON_KEY`; o preload
    repassa isso pro app via `contextBridge`. É de propósito o **mesmo mecanismo** já usado pela
    versão do app (`SAKURA_APP_VERSION`): o cliente do Supabase é criado assim que a tela carrega,
    antes de qualquer IPC conseguir responder, então o valor precisa estar disponível de forma
    síncrona — e ler arquivo direto de dentro do preload empacotado já falhou de um jeito
    silencioso antes (item 18 da seção 6). Salvar grava o arquivo e **recarrega a tela**, porque o
    cliente do Supabase é montado uma vez só.
  - **Testado de ponta a ponta no Electron de verdade** (Playwright + `xvfb-run`, apontando pra
    raiz do app), 11 verificações: preload roda inteiro, tela de conexão aparece no lugar do login
    quando não há conexão salva, salvar grava o arquivo com o conteúdo certo, e depois do reload a
    conexão chega na tela e o app passa pro login. Esse teste é o único jeito de pegar falha
    silenciosa de preload — leitura de código não pegaria.
- **Login e permissões**: usuário/senha (sem digitar e-mail), sessão não persiste entre aberturas
  do app (a pedido explícito — o programa fica aberto o dia todo, cada abertura pede login de
  novo). Menu lateral e rotas filtrados por permissão (`PermissaoRoute`/`AdminRoute`). Tela
  Configurações (admin) gerencia operadores com checkboxes de módulo. **Redefinir senha esquecida
  (nesta sessão)**: como o login não usa e-mail de verdade, o fluxo padrão de "esqueci minha
  senha" por e-mail do Supabase não funciona aqui — em vez disso, qualquer admin pode clicar
  "Redefinir senha" no card de outro operador (Configurações → Operadores), o sistema gera uma
  senha temporária (mostrada uma vez só, num modal, pra ele repassar por WhatsApp/pessoalmente) e
  marca que aquele operador precisa trocar a senha no próximo login — `TrocarSenhaPage.tsx`
  aparece no lugar do app normal até ele criar uma senha nova. Por trás, uma Edge Function nova
  (`redefinir-senha-operador`, mesmo padrão da `ler-notas-fiscais`: a service role key nunca sai
  do Supabase) confere de novo, do lado do servidor, que quem está chamando é realmente admin
  antes de mudar a senha de qualquer um. **Estado real do deploy incerto** — ver nota na seção 10
  sobre duas linhas de trabalho paralelas que aconteceram no mesmo período: uma versão bem mais
  simples desse mesmo recurso (admin define a senha nova direto, sem senha temporária) chegou a
  ser publicada por engano no Supabase real dela numa sessão separada. **Antes de considerar isso
  pronto, é preciso redeployar a Edge Function com o código atual** (passo a passo na seção 9) —
  mesmo que a função já exista publicada, o código de lá ainda pode ser o da versão simples.
  **Resolvido**: o login de dev `@sakura` já aparece renomeado como "Suporte" na lista de
  operadores, e o "Operador Teste" (`@teste`, resíduo sem uso real) foi **excluído de verdade**
  pelo painel do Supabase (Authentication → Users) — não só inativado. Ver item 23 da seção 6 pro
  detalhe do bug que impedia excluir/inativar esse operador pela tela do app (RLS bloqueando em
  silêncio por ele não ter loja vinculada) e por que a correção foi feita direto no Supabase, sem
  mudar código.
- **Clientes**: CRUD completo (**edição** adicionada nesta sessão — antes só criava/excluía) +
  múltiplos veículos por cliente, pessoa física/jurídica (rótulos de campo mudam conforme o tipo),
  aniversário do cliente no calendário do Início, tipo de veículo (ícone 2D por carroceria, pintado
  com a cor cadastrada) exibido na seção "Veículos no pátio". **Editar cliente preserva o `id` dos
  veículos já existentes** (`atualizarCliente` em `lib/clientes.ts` faz `upsert`, não
  apaga-e-recria como `funcionario_filhos`) — importante porque `ordens_servico.veiculo_id`
  referencia esse `id`; recriar do zero desconectaria OS antigas do veículo (a FK é `on delete set
  null`, então o dado não quebraria, mas o vínculo se perderia silenciosamente). **Formulário
  migrado nesta sessão** pro padrão `react-hook-form` + `zod` (segundo módulo, depois de
  Funcionários — ver "Padrão de formulário" na seção 4); comportamento pro usuário não mudou.
  **Numa sessão posterior**: corrigido um bug real onde um veículo com Marca/Modelo preenchidos
  mas Placa em branco era descartado em silêncio ao salvar (ver item 26 da seção 6); campo "Marca"
  agora sugere uma lista de ~80 montadoras via Combobox, mas aceita digitar qualquer coisa que não
  esteja na lista (`permitirLivre`, ver seção 4); "Modelo" continua texto livre sem sugestão (tem
  modelo demais no mundo pra listar, pedido explícito da usuária).
- **Estoque**: 4 abas — Produtos (cadastro completo com campos fiscais NCM/CFOP/CST-CSOSN/ICMS,
  categoria, garantia em dias, margem calculada nos dois sentidos), Movimentações (com filtro por
  produto e, **desde esta sessão**, campo/coluna de Depósito), Contagem (inventário físico, agora
  **por depósito** — mostra o saldo do sistema daquele depósito específico, não o total da loja —,
  gera ajuste automático na diferença), Relatórios (estoque físico-financeiro, saldo por situação,
  produtos sem movimentação — esses três continuam olhando pro saldo total da loja, somando todos
  os depósitos, sem mudança). **Depósito (novo nesta sessão)**: cadastro em Configurações → seção
  "Depósitos" (locais físicos de estoque, ex: "Depósito Principal", "Fundos" — ver seção 5/8); toda
  loja já nasce com um, então quem usa um só lugar físico não percebe diferença nenhuma no dia a
  dia — só quem criar um segundo depósito passa a escolher entre eles nas telas de Movimentações e
  Contagem. **`PecaForm.tsx` migrado nesta
  sessão** pro padrão `react-hook-form` + `zod` (terceiro módulo — ver "Padrão de formulário" na
  seção 4); **ganhou edição numa sessão posterior** (antes só cadastrava, nunca editava — precisou
  ser resolvido pra corrigir cadastro de peça com CST/CSOSN errado, ver item 1 da seção 8), mesmo
  padrão de edição já usado em Clientes. **Importar por foto/PDF**:
  botão ao lado de "+ Novo produto" (ícone de câmera, SVG) — lê uma ou mais fotos **ou PDFs** de
  nota fiscal (pode ser mais de uma nota junto) via Claude (Sonnet 5, saída estruturada) através
  da Edge Function `ler-notas-fiscais`, mostra uma tabela editável com os produtos identificados e
  cadastra em lote (`ImportarNotasFiscaisModal.tsx`). Chave da Anthropic fica só como secret da
  Edge Function. **Desde 09/09/2026, o CST/CSOSN lido na nota do fornecedor já entra corrigido
  pro padrão da loja** (a coluna continua editável), com aviso quando algum produto ficar sem um
  código que sirva — ver item 47 da seção 6.
- **Serviços**: catálogo simples (descrição, código opcional, preço padrão, **custo** — ex: mão de
  obra, usado pela aba Lucratividade —, categoria de serviço opcional), sem estoque/fiscal. Vem
  semeado com ~17 serviços padrão sem preço (organizados por categoria: Pneus, Suspensão,
  Amortecedores, Freios, Alinhamento, Outros Serviços), baseados numa ficha de orçamento de
  referência do ramo — ponto de partida, não os preços/serviços reais dela.
- **Fornecedores** (duas abas): "Cadastro" — nome/razão social, CNPJ, telefone, e-mail, endereço
  completo, ativo/inativo; compartilhado entre lojas (mesmo padrão de Clientes). "Pedidos de
  compra" — por loja, número sequencial (`numero`, mesmo padrão de OS), itens de peça com
  quantidade pedida + preço unitário, status (`pendente`/`parcial`/`recebido`/`cancelado`). Botão
  **"Receber"** abre uma conferência: a usuária confirma quanto chegou de cada item (pode ser
  parcial, em mais de uma vez) e o sistema já lança a entrada em Estoque → Movimentações sozinho
  (motivo "Compra"), soma na quantidade recebida do item, e recalcula o status do pedido inteiro.
  **Cotação de peças**: ao escolher a peça num item do pedido, aparece um resumo das cotações
  anteriores daquela peça por fornecedor (mais barato primeiro, com a data da última compra), com
  um botão "usar esse preço" que preenche o campo — sem tela própria, é gravado sozinho toda vez
  que um pedido é criado com preço numa peça (`PedidoCompraItemRow.tsx` + `lib/cotacoesPecas.ts`,
  histórico completo em `cotacoes_pecas`, nunca sobrescreve — ver seção 5). **Importar XML de nota
  fiscal (nova nesta sessão)**: botão "Importar XML de nota fiscal" ao lado de "+ Novo pedido" —
  lê o arquivo XML que o **fornecedor** emite (formato público/estável do governo, puro parsing
  com `DOMParser`, sem IA/Edge Function — não confundir com o "Importar por foto" de Estoque, que
  lê a nota **por foto/PDF via IA**, nem com a emissão de nota **pra o cliente**, ainda pendente,
  ver seção 8 item 1), acha o fornecedor pelo CNPJ (cria um novo automaticamente se não achar) e
  casa cada item com uma peça já cadastrada por código de barras/código interno (deixa escolher
  outra peça ou cadastrar nova pra quem não bateu), pede o depósito de destino uma vez só pro lote
  inteiro, e confirma criando um Pedido de Compra que já nasce **"Recebido"** (a nota já é a prova
  de que chegou) — com entrada em Estoque e cotação de cada item gravadas sozinhas
  (`ImportarNotaFiscalXmlModal.tsx` + `lib/notaFiscalXmlFornecedor.ts` +
  `lib/pedidosCompra.ts` → `importarNotaFiscalCompra()`). Terceiro e último dos três passos
  combinados com a usuária antes da emissão de nota fiscal (ver seção 8, item 5) — sem garantia do
  fornecedor na compra ainda (diferente da garantia ao cliente já implementada), sem ordem
  definida pra atacar isso. **Desde 09/09/2026 a importação não copia mais o código de ICMS do
  fornecedor pras peças novas** (era o que gerava nota rejeitada, ver item 47 da seção 6): quando
  o código do XML não serve pro regime da loja, aparece um aviso e um campo "CSOSN das peças
  novas", já preenchido com o código que a própria loja mais usa no cadastro dela.
- **Ordens de Serviço**: cada OS tem um número sequencial **por loja** (`numero`, 1/2/3...,
  atribuído por trigger no insert) — é como a OS é identificada em toda tela ("OS 12"), nunca mais
  o UUID cortado. Status simplificado pra só 3 etapas: **em_andamento** (nasce assim direto, sem
  "aberta" separada) → **concluída** → **faturada**. Form em duas colunas, reabre pra editar (só
  permite acrescentar itens, não editar/remover item já lançado — evita desfazer baixa de estoque).
  **Acrescentar item só funciona até a OS estar "faturada"** (numa sessão posterior, ver item 31 da
  seção 6) — depois de faturada, o "+ adicionar item" some e a peça/serviço esquecido vira uma OS
  nova; faturar (o botão "Confirmar faturamento") agora pede confirmação explícita antes, avisando
  que essa trava passa a valer.
  **Corrigir um item já lançado (08/09/2026, pedido dela usando o sistema: digitou R$120 num
  alinhamento que era R$60 e não tinha como consertar pela tela)**: cada linha de "Já lançados
  nesta OS" ganhou um "Editar" que abre ali mesmo os campos do item (tipo, peça/serviço,
  quantidade, preço, desconto, técnico) — `ItemExistenteRow.tsx`. É salvo na hora, item por item,
  **sem** passar pelo "Salvar alterações" da OS (que continua cuidando só dos campos de cima e dos
  itens novos). Três coisas que valem saber:
  - **O estoque se acerta sozinho.** A saída que o item original gerou continua valendo, então só
    a **diferença** é lançada (`diferencasDeEstoque()` em `lib/ordensServico.ts`, testada): mudou
    só o preço → nenhuma movimentação; quantidade subiu → saída da diferença (motivo "uso em OS");
    quantidade caiu, peça trocada ou peça virou serviço → entrada de volta (motivo "ajuste"). A
    referência sai como "OS 12 (correção de item)", pra dar pra achar em Movimentações.
  - **Trava em dois casos**, os dois com aviso na tela explicando: OS já **faturada** (o pagamento
    já entrou no Caixa com o total antigo — mesma razão do item 31 da seção 6) e OS que já tem
    **nota fiscal emitida** e não cancelada (corrigir aqui deixaria a nota diferente da OS). No
    segundo caso o caminho é cancelar a nota antes (Notas Fiscais → "Cancelar nota").
  - **Não tem "Remover"** — só editar. Um item lançado por engano ainda precisa ser transformado em
    outro item pela edição; excluir de vez não foi construído (não foi pedido, e teria a mesma
    conversa de estoque/nota). Fácil de acrescentar depois, se fizer falta.
  - **Não é auditado**: `ordens_servico_itens` não está na lista de tabelas cobertas pelo trigger
    de auditoria (migration `0040`, ver seção 5). Agora que dá pra mexer em valor de item, incluir
    essa tabela virou candidato natural — é uma migration pequena, no mesmo padrão, ainda **não
    feita**.

  **Aviso de código fiscal antes de emitir (09/09/2026)**: a aba Fechamento → "Emitir NFC-e"
  agora confere o CST/CSOSN de cada peça da nota contra o regime da loja **antes** de mandar, e
  lista pelo nome as que não servem ("BIEL SUSP GM DT ACO LD/LE — está com o CST 00, que é do
  regime normal — sua loja é Simples Nacional e usa CSOSN"). Substitui o `[nItem:1]` enigmático
  que a SEFAZ devolve. **Não bloqueia a emissão** — ver item 47 da seção 6.
  Não existe mais seletor manual de status no form — o cabeçalho mostra o status atual (badge) e,
  enquanto "em_andamento", um botão **"Encerrar OS"** que marca como concluída e já abre a tela de
  faturamento na sequência, num fluxo só. **`OrdemServicoForm.tsx` migrado nesta sessão** pro
  padrão `react-hook-form` + `zod` (quarto módulo — ver "Padrão de formulário" na seção 4);
  comportamento pro usuário não mudou (mesmos campos, mesma regra de só acrescentar item, não
  editar/remover o que já foi lançado). **Auto-save de rascunho local** (numa sessão posterior,
  `src/hooks/useRascunhoFormulario.ts`): salva uma cópia local do formulário a cada 30s enquanto
  ele está aberto (não é um "salvar" de verdade, não mexe no banco nem no botão de Salvar) — se a
  tela recarregar sozinha (ver item 30 da seção 6) ou o programa fechar de repente, reabrir a
  mesma OS mostra "Encontramos um rascunho não salvo... Restaurar?"; ao salvar com sucesso, o
  rascunho é descartado. **Estendido nesta sessão** pros outros formulários longos do app — ver
  "Auto-save de rascunho" logo no começo desta seção. Técnico por item + vendedor/atendente da OS (ambos listam
  `funcionarios`, não só operadores). Lista de OS tem filtro de período (De/Até) e busca por
  cliente/placa — OS em aberto sempre aparecem, não importa a data (só o histórico já faturado é
  filtrado por período, pra lista não crescer sem controle); colunas de Nº/Peças/Serviços/Total/Lucro
  por ordem; status com cor por etapa (Concluída em laranja, de propósito, pra chamar atenção de que
  falta faturar) — mesma cor no card "OS abertas" do Início. Faturamento (`FaturamentoCard.tsx`)
  calcula parcelas automaticamente conforme os juros configurados em Configurações, deixa **dividir
  o pagamento em mais de uma forma** (ex: metade Pix, metade cartão — cada forma vira seu próprio
  lançamento de Caixa, e a soma precisa bater com o total **dos itens** antes de confirmar), e deixa
  escolher entre "Recebido agora" (lança a Entrada no
  Caixa na hora, como sempre foi) ou "A receber depois" (não lança nada no Caixa ainda, cria uma
  pendência em Contas a Receber — ver módulo abaixo; aqui não dá pra dividir forma de pagamento,
  só ao receber depois). Aba "Fechamento" (só aparece com status concluída/faturada): botões "Emitir
  NFC-e"/"Emitir NFS-e" (nesta sessão — antes só mostravam preview do rascunho, agora abrem
  `EmitirNotaFiscalModal.tsx` e emitem de verdade via Focus NFe, aguardando a autorização da
  SEFAZ/prefeitura em polling — ver item 1 da seção 8 pro que ainda falta validar com uma emissão
  de teste real; assim que autorizada, o PDF/DANFE já carrega direto num preview embutido dentro
  do próprio modal — mesmo padrão de `iframe` já usado em "Ver garantia"/"Versão para o cliente" —
  com botões "Baixar PDF", "Imprimir" e "OK", em vez do antigo botão único "Ver DANFE" que abria
  numa aba separada; **já testado com emissão real de NFC-e e NFS-e em produção**, ver item 1 da
  seção 8) e "Ver garantia" (abre preview do documento completo — cabeçalho da loja, dados de
  cliente/veículo, itens, totais, forma de pagamento com parcelas reais, assinaturas — com opção de
  baixar HTML/imprimir via `iframe`).
  **Parcelar cartão dentro do pagamento dividido** (28/08/2026, pedido dela usando o sistema de
  verdade — **confirmado por ela funcionando na loja**): antes, marcar "dividir em mais de uma forma"
  travava tudo em 1x, então quem passava parte no cartão parcelado não tinha onde registrar. Agora
  **cada forma tem seu próprio número de parcelas** (o seletor só habilita no cartão de crédito;
  Pix/dinheiro/débito são sempre à vista), e o **juro incide só sobre a parte que passou no
  cartão**, não sobre a OS inteira — igual à maquininha. Consequência visível na tela: a soma das
  formas fecha com o total **dos itens** (valor combinado, sem juros) e o juro aparece somado à
  parte, na linha "Com os juros do cartão"; cada linha parcelada mostra o valor da parcela. Como
  `ordens_servico.parcelas` é um número só, o pagamento dividido grava o **maior** parcelamento
  usado (na prática, o do cartão). Sem migration. As contas viraram funções puras testadas em
  `schemas/faturamento.ts` (`calcularLinhasPagamento`, `somarLinhasCobradas`, `parcelasDaOrdem`).
  **Correção junto, que essa mudança destapava**: o rateio do pagamento na NFC-e
  (`buscarPagamentosParaNota`, ver item 32 da seção 6) dividia o total da nota pelo total da OS —
  com juros de cartão o que entra no Caixa é maior que o total dos itens, e uma linha podia estourar
  o total da nota deixando a última **negativa** (rejeição da SEFAZ). Passou a ratear pela **soma
  das formas de pagamento** (`ratearPagamentos`, função pura testada): resultado idêntico quando não
  há juros, sem negativo quando há.

  **"Finalizada" — a OS sabe de que nota ela precisa** (28/08/2026, pedido dela usando o sistema;
  **confirmado por ela funcionando na loja**): o sistema deduz, pelos itens, qual nota cada OS precisa —
  só peça → NFC-e, só serviço → NFS-e, os dois → as duas — e cruza com as notas já ligadas àquela
  OS. Consequências na tela: (a) na lista, uma OS faturada que ainda deve nota continua "Faturada"
  (agora em **azul**, porque ainda pede uma ação) com um "falta NFS-e" embaixo, e vira
  **"Finalizada"** (verde) quando todas as notas dela saíram; (b) na aba Fechamento, só aparece o
  botão da nota que aquela OS precisa (uma OS só de serviço não mostra mais "Emitir NFC-e", que
  daria erro de qualquer forma), com uma linha dizendo o que falta, e o botão de uma nota já
  emitida aparece como "NFC-e emitida ✓". **Nota cancelada volta a contar como pendente**, e nota
  enviada à mão (upload de XML vinculado à OS) conta como emitida igual às automáticas.
  **Sem migration e sem status novo no banco**: `ordens_servico.status` continua
  em_andamento/concluida/faturada — "Finalizada" é derivado na hora (`schemas/situacaoFiscal.ts`,
  funções puras testadas), mesma filosofia do módulo de Garantias. Derivar em vez de gravar também
  evita o status mentir se uma nota for cancelada depois. **Decisão dela junto**: não existe
  "OS sem nota" — toda OS vai ter nota emitida, então não foi criado nenhum jeito de marcar uma OS
  como dispensada de nota (se um dia fizer falta, é uma coluna nova + migration).

  **Dois ajustes de ergonomia na lista de itens** (mesma leva, mesmo motivo — uso real no balcão):
  o botão "+ adicionar item" saiu do cabeçalho e foi pro **rodapé da lista, alinhado à direita**
  (com a OS cheia de peça, subir a tela toda pra lançar mais uma era o que atrapalhava); e cada item
  passou a mostrar o **total da linha** (quantidade × preço − desconto) além do preço unitário, pra
  não haver confusão em par de peça (2x pneu, por exemplo).

- **Funcionários** (duas abas desde 03/09/2026): **"Cadastro"** — RH completo (documentos,
  endereço, cargo/admissão, família/filhos; o formulário em si tem as sub-abas "Dados
  gerais"/"Família"). Todo operador ganha um `funcionarios` espelhado automaticamente. E
  **"Comissões"** (02/09/2026, pedido do pai dela; morava em Relações até 03/09/2026, quando ela
  pediu pra mover pra cá).
  - **A página virou orquestrador de abas** (mesmo padrão de Fornecedores/Caixa): a lista + o
    formulário saíram pra `FuncionariosSection.tsx`, e `ComissoesSection.tsx` mudou de pasta junto.
    Os dados que só a aba Comissões usa (OS, peças, serviços, contas a receber — 4 consultas) só
    são buscados quando alguém abre essa aba, pra não deixar mais lenta a tela de quem só veio
    cadastrar funcionário.
  - **Regras, decididas com ela** (estão escritas também no topo de `src/schemas/comissoes.ts`):
    os **dois papéis** contam, separados — o **vendedor** da OS leva pela OS inteira que atendeu,
    o **técnico** só pelos itens que executou; a base é o **lucro** (venda − custo), na
    porcentagem de `funcionarios.comissao`; e só conta **OS faturada**, pela data do faturamento.
  - **Não precisou de migration** — `ordens_servico.vendedor_id`,
    `ordens_servico_itens.tecnico_id` e o campo "Comissão (%)" do cadastro já existiam.
  - Uma linha por funcionário (vendeu / lucro gerado / comissão a pagar); "Ver as OS" abre o
    detalhe separado por papel, listando cada OS que formou o número — é o que deixa o pai dela
    conferir de onde veio cada real em vez de confiar no total.
  - **A tela avisa quando o número merece desconfiança**: comissão vinda de OS faturada como "a
    receber depois" que o cliente ainda não pagou; item vendido **sem preço de custo cadastrado**
    (entra como lucro cheio e infla a comissão); funcionário sem porcentagem cadastrada; e OS sem
    vendedor / item sem técnico, que caem numa linha "Sem funcionário definido" no fim da lista em
    vez de sumirem caladas.
  - **Cuidado de conta que vale saber**: quem vendeu **e** executou a mesma OS aparece nos dois
    papéis, mas o lucro é contado **uma vez só** (somar os dois inflaria; pegar o maior perderia
    OS onde a pessoa só executou). Já a comissão soma os dois de propósito — são pagamentos
    diferentes, mesmo caindo pra mesma pessoa.
  - **Por que fica em Funcionários e não em Relações**: ficou em Relações quando nasceu (o número
    sai das OS, não do cadastro da pessoa), mas ela pediu pra mover em 03/09/2026 — na cabeça de
    quem usa, comissão é assunto de funcionário. Consequência de permissão: quem enxerga
    Funcionários passa a enxergar comissão. Sem novidade de verdade — o cadastro de funcionário já
    mostra salário e a porcentagem de comissão de cada um.
  **Formulário refatorado nesta sessão** pro padrão novo `react-hook-form` + `zod` (ver "Padrão de
  formulário" na seção 4) — primeiro do app nesse estilo, orquestrador caiu de 601 pra ~140 linhas,
  campos organizados em `campos/*Fields.tsx` por grupo. Comportamento pro usuário final não mudou
  em nada (mesmos campos, mesma validação de "Nome obrigatório").
- **Caixa Diário**: abas Diário (tudo — OS faturadas + manual) / Entradas / Saídas (só
  lançamentos manuais, com categoria opcional via `categorias_caixa`). Card de "Lucro do dia" +
  resumo por forma de recebimento. **Desde 28/08/2026 o "Lucro do dia" é confiável** (ver item 40
  da seção 6): conta o custo de cada OS uma vez só mesmo com pagamento dividido, inclui o custo do
  serviço (não só o da peça) e desconta as saídas lançadas à mão. A coluna "Lucro" da tabela
  reparte o lucro da OS entre os lançamentos dela, então a coluna fecha com o total.
- **Contas a Pagar**: contas mensais com vencimento (diferente de Entradas/Saídas manuais, que só
  registram dinheiro que já saiu). Marcar como paga gera Saída automática no Caixa; se recorrente,
  já cria a próxima ocorrência sozinha. **"Desfazer pagamento"** (portado nesta sessão de uma
  branch separada que trabalhou em paralelo — ver seção 10, já testado por ela de verdade): botão
  na lista "Pagas recentemente" — volta a conta pra pendente e remove a Saída gerada (se a conta
  era recorrente, a próxima
  ocorrência já criada continua existindo, pendente). **"Recorrente até" (nesta sessão)**: campo
  opcional que só aparece quando "Conta mensal recorrente" está marcado — em branco, continua
  recorrendo pra sempre (como sempre foi); preenchido com um mês, `pagarConta()` para de criar a
  próxima ocorrência depois dessa data (migration `0043`, já rodada por ela no Supabase real).
- **Contas a Receber**: espelha Contas a Pagar, mas do lado do que a loja tem a receber. Nasce
  automaticamente quando uma OS é faturada escolhendo "A receber depois" em vez de "Recebido
  agora" — pensado pra resolver o caso de faturar uma OS (serviço entregue/cobrado) sem o cliente
  ter pago tudo na hora. **Desde esta sessão também aceita cadastro manual** ("+ Nova conta", igual
  Contas a Pagar): cliente, descrição, valor e previsão de recebimento — pra cobrança que não
  passou por OS nenhuma. Marcar como recebido gera Entrada automática no Caixa (mesmo padrão do
  Contas a Pagar), venha a conta de qual dos dois jeitos for.
- **Notas Fiscais**: upload manual de XML (NFe/NFS-e) organizado por mês de competência
  (Supabase Storage), vínculo opcional com uma OS. **Baixar o mês inteiro (02/09/2026)**: cada
  faixa de mês tem um botão "Baixar XMLs do mês (N)" que junta os XMLs daquela competência num
  `.zip` só (`nfse-2026-08.zip`) — é o formato que a contabilidade pede, e evita clicar nota por
  nota. O `.zip` é montado sem biblioteca externa (`src/lib/zip.ts`, formato "stored", sem
  compressão: XML de nota é arquivo pequeno, comprimir não mudaria o tamanho de forma relevante).
  Cuidados cobertos por teste: nome repetido no mesmo mês vira `nota (2).xml` (senão o
  descompactador perde um dos dois), nome com acento sai certo no Windows, e o download é feito
  em lotes de 5 pra um mês cheio não disparar dezenas de requisições juntas. Botão "Versão para o cliente" interpreta o XML
  e monta um recibo HTML (não é o DANFE oficial, sem código de barras/QR code). **Botão "Cancelar
  nota" (nesta sessão)**: até aqui, cancelar uma nota emitida automaticamente (NFC-e/NFS-e via
  Focus NFe) só dava pra fazer direto no painel deles — as funções `cancelarNFCe`/`cancelarNFSe`
  já existiam em `lib/focusNfe.ts`, mas nenhuma tela chamava. Agora aparece um botão "Cancelar
  nota" na lista, só pra notas com `origem = "automatica"` e ainda `status = "autorizado"` — pede
  uma justificativa (mínimo 15 caracteres, exigido pela Focus NFe) num modal
  (`CancelarNotaModal.tsx`) antes de confirmar. Precisou de uma migration nova (`0046`) porque o
  `ref` que a Focus NFe usa pra identificar a nota (gerado na hora da emissão) nunca tinha sido
  salvo em lugar nenhum — sem ele, não tem como cancelar depois. **Validado**: `tsc -b`, lint e os
  59 testes passando; a migration foi testada num Postgres local, aplicada duas vezes seguidas pra
  confirmar idempotência. **Não dá pra testar a chamada de verdade à Focus NFe no sandbox** (sem
  acesso à rede) — só quando ela rodar a migration e testar na loja.
  **Botão "Ver DANFE" (11/09/2026, item `TR-11.1` do guia de melhorias)**: reabre o PDF de uma
  nota que o sistema emitiu — o pedido de balcão mais comum que existe (o cliente volta e pede a
  nota de novo). Antes, o PDF só existia dentro da janela de emissão: fechou, acabou, e a única
  saída era entrar no painel da Focus NFe. O PDF **não** fica guardado aqui (o que é salvo é o
  XML, que é o documento que a lei manda guardar 5 anos) — ele é pedido de volta pra Focus NFe
  pela `focus_nfe_ref` da migration `0046`, mostrado no mesmo `iframe` de sempre, com "Baixar PDF"
  e "Imprimir" (`VerDanfeModal.tsx`). O mesmo botão aparece na aba Fechamento da OS. Os dois casos
  em que não dá (nota enviada à mão pelo XML; nota emitida antes da `0046`, sem referência) viram
  **texto explicando o que fazer**, não erro cru — a regra é função pura testada
  (`schemas/danfe.ts`). Na lista, o rótulo é "Ver DANFE" na aba NFe e "Ver PDF" na de NFS-e
  (DANFE é nome de documento da NFe). **Não dá pra testar a chamada real à Focus NFe no sandbox**
  — só na loja.
- **Relações** (ex-"Relatórios", label mudou antes; agora também absorveu o módulo antigo
  "Lucratividade" — um módulo só, com abas): aba "Gráficos" — gráfico de barras (Vendas x Custos x
  Lucro, **Diário/Semanal/Mensal/Anual**) + radar comparando o período atual com o anterior, sem
  biblioteca externa de gráficos, paleta categórica própria (verde/laranja/violeta); aba
  "Lucratividade" — margem por peça/serviço, período filtrável. **O "Anual" entrou em 03/09/2026**
  (pedido dela): mostra 5 anos, e os cartões do topo ganharam um quarto, "Vendas este ano".
  **A aba "Comissões" saiu daqui em 03/09/2026** — foi pra dentro de Funcionários, a pedido dela
  (ver o módulo Funcionários logo abaixo).
- **Início — calendário mostra também os dias vizinhos** (31/08/2026, pedido dela): a grade tem
  **6 semanas fixas** (como a do Windows), então a sobra do mês anterior e os primeiros dias do mês
  **seguinte** aparecem sempre, em cinza apagado. Motivo: o calendário mostra só o mês corrente e
  não tem seta pra avançar — uma conta que vencesse dia 1º ficava invisível no dia 31, justamente
  quando ela mais precisava ser vista. Os eventos (feriado, aniversário, conta a vencer/vencida)
  passaram a ser montados pra **toda a grade visível**, não só pro mês, e a lista embaixo do
  calendário mostra `dd/mm` quando o evento é de outro mês. `components/MiniCalendario.tsx` recebe
  evento com `data` ISO (era só o número do dia); `lib/calendario.ts` guarda as duas funções puras
  (`diasDoCalendario`, `chaveData` — essa usa `toLocaleDateString("sv-SE")`, nunca `toISOString`,
  pelo motivo do item 34 da seção 6), com teste. **Ponto cego que continua**: o cartão "Contas a
  pagar vencendo" soma só o mês corrente (`PainelPage.tsx`), então no dia 31 ele pode mostrar
  R$ 0,00 com uma conta vencendo amanhã — não foi mexido, ela sabe.
- **Início**: 3 cartões de tendência personalizáveis (Configurações → "Cartões do Início", padrão
  Vendas/Lucro/Ticket médio, sem gráfico — só valor + seta; **"Lucros mês" e "Ticket médio" foram
  corrigidos em 28/08/2026** — o lucro passou a descontar o custo real de peça e serviço, e o
  ticket médio a dividir por OS e não por lançamento de Caixa; ver item 40 da seção 6. O número do
  lucro **caiu bastante** com a correção, porque antes mostrava o faturamento quase inteiro),
  calendário do mês com feriados
  nacionais + aniversário de cliente + contas a pagar vencendo/vencidas, seção "OS abertas" e
  "Veículos no pátio" (com ícone por tipo/cor).
  **Aviso da alíquota do mês (11/09/2026, item `TR-11.2` do guia de melhorias)**: no topo do
  Início, uma faixa avisa que a alíquota daquela competência precisa ser cadastrada no portal da
  prefeitura antes da primeira NFS-e do mês — com o passo a passo curto e um botão "Já cadastrei"
  que some com o aviso até o mês seguinte. Existe porque essa recusa é mensal, conhecida, com data
  e consequência certas (ver item 1 da seção 8), e já custou uma manhã. Três cuidados que valem
  saber: (a) o aviso **só aparece pra quem emite NFS-e** (loja com token da Focus NFe e inscrição
  municipal preenchidos) — quem não emite nunca vê; (b) **toda NFS-e autorizada no mês marca a
  competência sozinha** (se a prefeitura autorizou, a alíquota está cadastrada), então na prática
  ele só aparece antes da primeira nota — valendo só pras notas emitidas **depois** desse código
  existir, então no primeiro mês o aviso aparece mesmo com a alíquota já cadastrada, e o caminho é
  clicar em "Já cadastrei" uma vez; (c) o mesmo aviso aparece dentro da janela de emitir
  NFS-e, sem o botão — ali o que resolve é ir no portal. A regra é função pura testada
  (`schemas/aliquotaCompetencia.ts`), o texto do passo a passo é editável em Configurações →
  Dados fiscais (padrão: Araraquara/Giap), e a competência confirmada fica em
  `configuracoes_fiscais_loja` (migration `0049`).
- **Configurações** (admin): Operadores (sempre visível, com "+ Novo operador", e agora um
  multi-select de lojas dentro do form, só aparece com 2+ lojas cadastradas), Lojas (novo card,
  sempre visível — criar/editar nome-cidade-UF/inativar lojas; **excluir de verdade** também é
  possível, mas só funciona com a loja "vazia" — sem estoque/caixa/OS/funcionários vinculados; com
  dado de negócio, o app explica e sugere inativar em vez de excluir), e seções recolhíveis — Juros
  de parcelamento, Categorias de produto, Categorias de serviço, Categorias de caixa, Texto de
  garantia, Dados fiscais da loja, Cartões do Início (essas últimas 4, junto com Juros, agora são
  **por loja** — ver seção 5). Em "Dados fiscais da loja" há também, desde 11/09/2026, o campo
  "Como cadastrar a alíquota no portal da prefeitura" — texto livre que alimenta o aviso mensal do
  Início; em branco, vale o passo a passo de Araraquara que está no código.
- **Auditoria** (módulo novo nesta sessão, migration `0040` já rodada e testada por ela de
  verdade): admin-only, acesso via ícone novo no rodapé da Sidebar (ao lado da engrenagem de
  Configurações), não é permissão de operador comum nem entra em `MODULOS`. Lista quem editou ou
  excluiu o quê e quando, com filtro por tabela e por operador, e um "Ver detalhes" que mostra o
  registro inteiro antes/depois (ou só "antes" se foi exclusão) em JSON. Cobre só
  `UPDATE`/`DELETE` (não criação) num conjunto de tabelas sensíveis — ver lista completa na seção
  5, tabela `auditoria`. É gravado por trigger de banco, não pelo código do app — funciona mesmo
  se a alteração vier de outro lugar (SQL Editor manual, por exemplo).
- **Multi-loja** — já aplicada e testada de verdade no Supabase real da usuária (criou uma 2ª loja
  de teste pra validar o fluxo, o que revelou o bug corrigido na migration 0034 — essa loja de teste
  foi excluída nesta sessão, ver abaixo). 1 projeto Supabase serve 2+ lojas com um painel único (não
  instalações separadas). Catálogo compartilhado (clientes, peças, serviços, categorias);
  estoque/caixa/OS/contas a pagar/contas a receber/notas fiscais/funcionários/configurações
  separados por loja. Um operador pode ter acesso a 1 ou mais lojas (`operador_lojas`);
  `LojaSwitcher.tsx` na Sidebar deixa trocar de loja ativa, só aparece pra quem tem 2+. Detalhe
  completo do desenho na seção 5, subseção "Multi-loja". **Hoje só existe uma loja de verdade no
  Supabase real: "Pneus Amigão" (Araraquara)** — a "Loja 2" de teste (que tinha ficado com o UUID
  original/fixo da migration 0031, sem cidade preenchida — nome enganoso, não era a mais nova) foi
  excluída nesta sessão depois de limpar o dado de negócio vinculado e mover o funcionário
  "Administrador" pra "Pneus Amigão".
- **Empacotamento**: `electron-builder` (NSIS) + `electron-updater` configurados,
  `.github/workflows/release.yml` publica o instalador no GitHub Releases quando uma tag `v*` é
  enviada. **Decisão revista nesta sessão**: ela decidiu lançar na loja do pai dela mesmo sem a
  emissão de nota fiscal pronta, seguindo o plano original da fase 1 (seção 1) — nota fiscal
  continua sendo emitida por fora até a integração Focus NFe ficar pronta. **Quatro tags publicadas
  na mesma sessão**, cada uma corrigindo algo achado testando o lançamento de verdade:
  - `v0.9.2`: primeira versão publicada de verdade desde o início do projeto (a `v0.9.0` anterior
    estava bem desatualizada). Inclui os 4 bugs da revisão de código (ver seção 8) mais tudo
    construído nas sessões anteriores.
  - `v0.9.3`: corrige o texto invisível ao editar Loja/Depósito e atualiza o script de limpeza de
    dados de teste (ver itens 17 e a nota sobre `limpar-dados-de-teste.sql` na seção 9).
  - `v0.9.4`: corrige o número da versão nunca aparecendo no app instalado (`VersaoApp.tsx` sempre
    dependeu de `process.env.npm_package_version`, que só existe rodando via `npm run ...`) e
    adiciona log do `autoUpdater` em arquivo (ver itens 18 e 19).
  - `v0.9.5`: corrige `excluirLoja()` de vez — faltavam 4 tabelas de configuração além de
    `depositos` (ver item 20).
  - `v0.9.6`: corrige "Importar por foto/PDF" travando com erro genérico ao ler certos arquivos de
    imagem (ex: `.jfif`) — ver item 24 da seção 6. **Publicada** — desta vez sem terminal: ela
    estava longe do computador dela, então publicou direto pela tela do GitHub
    (`github.com/.../releases/new`, digitando a tag `v0.9.6` e clicando "Publish release") —
    confirmado que isso dispara o mesmo workflow de build que a tag por terminal, sem diferença
    nenhuma no resultado. **Novo aprendizado sobre tag**: uma tag já publicada não se move — depois
    de publicar a `v0.9.6`, mais dois ajustes pequenos foram feitos (menu nativo do Electron e
    badge de status na lista de OS, ver logo abaixo) e ela tentou "postar de novo na mesma
    versão 0.9.6", mas como a tag já existia isso não gerou build nova nenhuma — precisou virar
    `v0.9.7`. **Lição pra sessões futuras**: cada leva de mudança que precisa chegar até o app
    instalado exige um número de versão novo, nunca republicar a mesma tag.
  - `v0.9.7`: remove a barra de menu nativa do Electron (File/Edit/View/Window/Help, sem função
    nenhuma pro app, aparecia como uma faixa branca feia no topo mesmo em tela cheia —
    `Menu.setApplicationMenu(null)`) e corrige o badge de status da lista de Ordens de Serviço
    quebrando em duas linhas quando o rótulo tem mais de uma palavra (ex: "Em andamento") por
    faltar `whitespace-nowrap`. **Publicada** (build confirmada com sucesso no GitHub Actions) —
    ainda não confirmada visualmente por ela na loja.
  - `v0.9.8`: inclui as correções de uma sessão posterior — veículo sem placa não salvava, Marca
    do veículo com sugestão de montadoras, Backspace limpando campo de data inteiro, e "Recorrente
    até" em Contas a Pagar (itens 26/27 da seção 6). **Publicada pela tela do GitHub** (ela estava
    longe do terminal) e **já baixada por ela via auto-update, confirmado no chat**. **Pendência**:
    logo depois de publicar, ela reportou que o Backspace só limpava a data quando as 3 caixinhas já
    estavam completas — bug no próprio hook novo (`useLimparDataAoApagar.ts` checava `.value`, que
    fica vazio até a data estar completa, ver item 27 da seção 6). Corrigido e já mesclado na
    `main`, mas **ainda não publicado em nenhuma tag** — ela decidiu acumular com outras mudanças
    antes da próxima versão. Depois dessa correção, também mesclado na `main` sem tag ainda: erro
    `invalid input syntax for type uuid: ""` ao adicionar um veículo novo num cliente já existente
    (item 28 da seção 6) e a emissão de NFC-e/NFS-e via Focus NFe (item 1 da seção 8) — ela pediu
    explicitamente pra segurar a publicação e sair tudo junto como **`0.9.9`** (decisão registrada
    nesta sessão). Migration `0044` já rodada e confirmada por ela no Supabase real. **Também
    mesclado na `main` sem tag ainda, na mesma sessão da NFC-e/NFS-e**: código do município
    preenchido sozinho no cadastro de cliente (item novo em `clientes.codigo_municipio`, migration
    `0045`, **já rodada e confirmada por ela**), atalho "Fechamento" na lista de OS, e o fix de
    CORS que corrigia o "Failed to fetch" da primeira tentativa de emissão (ver item 1 da seção 8
    e item 29 da seção 6). **Antes de publicar essa tag**: ainda falta validar a emissão de
    verdade em homologação de ponta a ponta — NFS-e está barrada esperando a Focus NFe habilitar a
    empresa dela pra Araraquara (fora do nosso controle), e NFC-e ainda nem foi tentada (ver
    pendências detalhadas no item 1 da seção 8, é o próximo passo).
  - `v0.9.9`: publicou tudo isso — decidiu não esperar mais a validação completa da emissão fiscal
    (ver item 1 da seção 8 pro estado real: habilitação da Focus NFe resolvida depois desta tag,
    ainda com dois bloqueios abertos). **Publicada pela tela do GitHub** (ela estava longe do PC) —
    eu preparei o bump de versão (PR mesclado) mas **não consegui empurrar a tag/criar a release
    direto** (o ambiente onde rodo bloqueia `git push` de tag com erro 403 — parece trava de
    segurança proposital, não bug de proxy; nenhuma ferramenta de GitHub disponível aqui também
    permite criar tag/release diretamente). Ela publicou pela tela (mesmo fluxo de sempre quando
    está longe do terminal) e o build passou — instalador e `latest.yml` confirmados na release.
    **Lição pra sessões futuras**: publicar a tag/release final continua sendo sempre manual dela
    (terminal ou tela do GitHub), mesmo com acesso de push a branches/PRs.
  - `v0.9.10`: leva a edição de produto em Estoque (que corrigiu o CST/CSOSN, ver item 1 da seção
    8) e a correção do erro `invalid input syntax for type uuid` ao cadastrar um cliente **novo**
    já com veículo preenchido (reportado por ela no chat, sem print — a mesma causa do item 28 da
    seção 6, só que faltando cobrir `criarCliente()`, não só `atualizarCliente()`; ver item 28 pro
    detalhe completo). **Publicação teve um incidente real, resolvido na mesma sessão**: ela
    publicou pela tela do GitHub (longe do PC de novo) digitando a tag `v0.9.10`, mas o GitHub
    reaproveitou silenciosamente um **rascunho de release não publicado que já existia com esse
    mesmo nome de tag**, criado 4 dias antes por uma sessão anterior (target apontando pra um
    branch antigo, `claude/visual-adjustments-fiscal-grjker`, sem nenhuma das correções atuais) —
    o build começou a rodar em cima do commit errado. Eu cancelei o build a tempo (`workflow_run`
    ainda em andamento, nenhum instalador chegou a ser publicado) e orientei ela a apagar a release
    **e** a tag manualmente (são coisas separadas no GitHub — apagar a release pela lixeirinha não
    apaga a tag; foi preciso ir em `.../tags`, achar a `v0.9.10` e apagar por lá também) antes de
    recriar do zero, dessa vez conferindo que o campo "Target" da tela de criar release mostrava
    `main`. Build refeita, publicada certinho (`d1e1f17`, o commit real do bump de versão) —
    instalador + `latest.yml` confirmados na release. **Lição nova pra sessões futuras**: antes de
    orientar ela a criar uma release pela tela do GitHub, vale conferir por API
    (`get_release_by_tag`) se já existe uma release/rascunho com aquele nome de tag — se existir e
    o `target_commitish` não for `main`, é sinal de resíduo de sessão anterior, apagar antes dela
    tentar publicar em cima.
  - `v0.9.12`: **o mesmo incidente se repetiu numa sessão posterior, e a lição acima não foi
    suficiente pra evitar** — eu conferi por `get_release_by_tag` antes de orientar ela a publicar
    e recebi 404 (nenhuma release), mas ela publicou mesmo assim e o GitHub reaproveitou um
    **rascunho não publicado que já existia com esse nome de tag** (criado quase um mês antes,
    apontando pra uma branch antiga). **Causa raiz da lição anterior estar errada**:
    `get_release_by_tag` **não enxerga rascunhos não publicados** — só passa a existir pra essa
    consulta depois de publicado. Resolvido do mesmo jeito de sempre (apagar release + tag
    separadamente, recriar conferindo "Target"), mas dessa vez **recriar a tag com o mesmo nome que
    acabou de ser apagada não disparou o build de novo** (mais um comportamento estranho do GitHub,
    a tag ficou correta no repositório mas nenhum `workflow_run` novo apareceu, confirmado
    esperando e checando de novo várias vezes) — precisou pular pra `v0.9.13`, um nome de tag nunca
    usado antes, pra sair dessa situação. **Lição corrigida**: não existe hoje um jeito confiável de
    checar por API se uma tag vai colidir com um rascunho antes de publicar — `get_release_by_tag`
    (só releases publicadas) e `list_releases` (também não mostrou o rascunho na listagem, mesmo
    com push access) não pegam rascunho não publicado. Na prática, o mais seguro agora é: (a) se o
    nome da tag nunca foi usado antes no projeto, seguir normal; (b) se já existiu antes de qualquer
    forma (mesmo já apagada), considerar arriscado reusar o mesmo nome — preferir pular pro próximo
    número.
  - `v0.9.13`: leva a correção da alíquota de teste do IBS/CBS na NFC-e (rejeição SEFAZ 1026, ver
    item 1 da seção 8). **Publicação teve mais um episódio, dessa vez de infraestrutura pura, sem
    relação com rascunho de release**: o build da tag ficou preso em "queued" por mais de 20
    minutos sem nenhum job atribuído (`list_workflow_jobs` retornando `total_count: 0` o tempo
    todo), e `cancel_workflow_run` recusava com 409 ("Cannot cancel a workflow run that has not
    been queued yet") — sinal de instabilidade do lado do GitHub Actions (achei registro de um
    incidente parecido dias antes via busca na web, `githubstatus.com`). **Resolvido adicionando um
    gatilho manual** (`workflow_dispatch: {}` em `.github/workflows/release.yml`, além do
    `push: tags: v*` já existente) — com ele, dá pra rodar a Release direto por API/CLI apontando
    pro `ref` desejado, sem depender do webhook de push de tag (que é só o que ficou travado,
    disparar manualmente por `main` funcionou de primeira). **Detalhe de uso**: `workflow_dispatch`
    só fica disponível quando o próprio arquivo do workflow, na branch **default** (`main`), já
    declara esse gatilho — dispatch com `ref` apontando pra uma tag antiga (cujo arquivo não tem o
    gatilho ainda) falha com "Workflow does not have workflow_dispatch trigger"; rodar com
    `ref: main` funciona porque é lá que o gatilho foi declarado, e o `package.json` de `main` já
    está na versão certa de qualquer forma.
  - `v0.9.14`: leva a trava de item pós-fatura + confirmação ao faturar (ver item 31 da seção 6).
    **Publicada direto via `workflow_dispatch`** (rodado por aqui mesmo, `ref: main`) — primeira
    vez que uma tag/release nasceu sem a usuária precisar tocar na tela do GitHub, e sem nenhum
    atraso de fila dessa vez.
  - `v0.9.15`: leva a correção do pagamento da NFC-e em OS com peça e serviço juntos (ver item 32
    da seção 6). **Também publicada direto via `workflow_dispatch`** — a partir daqui esse já virou
    o jeito padrão de publicar (ver detalhe completo em "Gerar o instalador Windows e publicar uma
    versão nova", seção 9).
  - `v0.9.16`: a leva desta sessão — **tela de conexão com o banco** (o instalador deixa de
    carregar a conexão de empresa nenhuma, ver "Conexão com o banco (multi-empresa)" nesta seção),
    auto-save de rascunho em mais quatro formulários, correção do tooltip ilegível nos gráficos de
    Relações (item 17 da seção 6) e cadastro manual em Contas a Receber. Publicada via
    `workflow_dispatch`.
  - `v0.9.17`: primeira tentativa de corrigir o "Testar conexão" reprovando a chave certa — mandar
    a chave só no cabeçalho `apikey`, sem `Authorization: Bearer` (ver item 33 da seção 6).
    **Não resolveu** — ela testou e o erro continuou igual.
  - `v0.9.18`: a correção que importava — o teste de conexão **deixa de trancar a entrada no
    sistema** (ganha "Salvar assim mesmo" quando reprova) e passa a usar o próprio cliente do
    `supabase-js`, o mesmo caminho que o app usa de verdade. **Confirmada por ela**: instalou,
    colou URL + chave e entrou normalmente ("coloquei a chave e foiii"). Também já rodando no PC
    da loja, sem precisar avisar ninguém. Ver item 33 da seção 6 pra lição completa.
  - `v0.9.19`: leva o botão "Cancelar nota" fiscal (migration `0046`), o código CNAE na NFS-e
    (migration `0047`) e a correção do bug de fuso horário que fazia OS faturada à noite sumir da
    lista (item 34 da seção 6). Publicada via `workflow_dispatch`.
  - `v0.9.20`: corrige o recibo "Versão para o cliente" saindo em branco pra NFS-e de prefeituras
    estilo Giap (Araraquara incluída) — ver item 1 da seção 8. **Confirmada por ela** testando a
    NFS-e número 11: recibo saiu com os dados certos (número, emitente, chave, protocolo, link pro
    documento oficial). Publicada via `workflow_dispatch`.
  - `v0.9.22`: parcelar cartão dentro do pagamento dividido, "+ adicionar item" no rodapé da lista
    e total por item na OS (ver "Ordens de Serviço" nesta seção), mais a correção do rateio do
    pagamento na NFC-e que essa mudança destapava. **É a primeira tag com o instalador de nome
    fixo** (`SakuraSystem-Setup.exe`) — ou seja, é a partir dela que o link de download permanente
    do site passa a funcionar. Publicada via `workflow_dispatch`.

  - `v0.9.23`: a OS passa a reconhecer de que nota ela precisa e ganha o estado **"Finalizada"**
    (ver "Ordens de Serviço" nesta seção), e o app passa a gravar erro de tela em `erros.log`
    (ver item 39 da seção 6 — é o arquivo a pedir pra ela se o bug de "campo parou de aceitar
    digitação" voltar). Publicada via `workflow_dispatch`.

  - `v0.9.24`: corrige os três cálculos errados de lucro/ticket médio do Caixa Diário e do Início
    (ver item 40 da seção 6) — a conta virou uma função só, compartilhada pelas três telas que
    mostram lucro. Publicada via `workflow_dispatch`.

  - `v0.9.25`: campo numérico deixa de mudar de valor sozinho pelas setas ↑/↓ e pelo spinner (ver
    item 41 da seção 6) e o calendário do Início passa a mostrar os dias do mês vizinho, apagados
    (ver "Início — calendário" nesta seção). Publicada via `workflow_dispatch`.

  - `v0.9.26`: a leva acumulada de 02/09/2026 — **baixar os XMLs de um mês num `.zip` só**
    (Notas Fiscais), **aba Comissões** em Relações, e as **12 correções** das duas varreduras
    (7 de cálculo + 5 fiscais, itens 42 a 46 da seção 6). É a primeira versão em que a conta a
    pagar recorrente do dia 29/30/31 para de pular um mês, a nota emitida à noite para de cair na
    competência errada, e o desconto do item deixa de sumir na NFC-e. Publicada via
    `workflow_dispatch`.

  - `v0.9.27`: a leva de 03/09/2026 — **NFC-e no CNPJ do cliente pessoa jurídica** (item 1 da
    seção 8), período **Anual** nos gráficos de Relações, a aba **Comissões dentro de
    Funcionários** e o botão do calendário visível em todo campo de data. Publicada via
    `workflow_dispatch`, com o instalador e o `latest.yml` confirmados na release.

  - `v0.9.28`: **corrigir um item já lançado numa OS** (08/09/2026, pedido dela: digitou R$120 num
    alinhamento que era R$60 e não tinha conserto pela tela) — ver "Ordens de Serviço" na seção 7.
    Publicada via `workflow_dispatch` e **confirmada por ela usando na loja** (editou os dois itens
    e a OS fechou nos R$ 1.113,00 certos).

  - `v0.9.29`: leva o aviso que lista **pelo nome** a peça com CST/CSOSN incompatível com o
    regime da loja antes de emitir (no lugar do `[nItem:1]` da SEFAZ) e a correção que impede a
    importação de XML do fornecedor de copiar o código de ICMS dele pro cadastro da peça (item 47
    da seção 6). Ficou segurada a pedido dela de 10/09 a 11/09/2026 e foi publicada em 11/09 via
    `workflow_dispatch`, depois de ela confirmar — instalador e `latest.yml` confirmados na
    release. Chegou na máquina dela junto com a `v0.9.30` (ver abaixo).

  - `v0.9.30`: leva o botão **"Ver DANFE"** (reabrir o PDF de uma nota já emitida, em Notas
    Fiscais e na aba Fechamento da OS) e o **aviso da alíquota da competência** no Início — os
    itens `TR-11.1` e `TR-11.2` do guia de melhorias. Publicada via `workflow_dispatch` **depois**
    de ela rodar as migrations `0048` e `0049`, que era a ordem obrigatória (sem as colunas da
    `0049`, "Salvar dados fiscais" daria erro de coluna inexistente). **Instalada por ela no
    mesmo dia** ("pronto, instalado a nova versao") — o que ainda não foi testado em uso real é o
    "Ver DANFE" numa nota de verdade (a busca do PDF na Focus NFe é justamente o que não dá pra
    testar daqui) e o aviso da alíquota aparecendo no Início.

  **Cuidado que já custou um erro (28/08/2026)**: não confiar neste arquivo pra saber qual foi a
  última versão publicada — a `v0.9.21` foi publicada numa sessão que não atualizou esta lista, e
  numa sessão seguinte eu disse pra ela que a última era a `v0.9.20`, quando o app dela já rodava
  a `v0.9.21`. Antes de propor um número de versão, conferir a lista real de releases
  (`mcp__github__list_releases`), não a memória deste documento.

  Fluxo confirmado funcionando de ponta a ponta tanto pelo terminal (`git tag vX.Y.Z` + `git push
  origin vX.Y.Z`) quanto pela tela do GitHub (criar a release digitando a tag nova) — o GitHub
  Actions builda e publica o instalador sozinho nos dois casos (~5-10 min). A versão aparece
  pequena no canto inferior direito do app (`VersaoApp.tsx`) em toda tela, inclusive login —
  só passou a funcionar de verdade a partir da `v0.9.4`.
  **⚠️ MUDANÇA IMPORTANTE PRA PRÓXIMA TAG (28/08/2026)**: o instalador passou a ter **nome fixo**,
  `SakuraSystem-Setup.exe` (`build.artifactName` no `package.json`) — antes o nome carregava a
  versão (`Sakura-System---AutoCenter-Edition-Setup-0.9.21.exe`). Isso é o que permite o site
  apontar pra um endereço permanente (`/releases/latest/download/SakuraSystem-Setup.exe`) que
  sempre entrega a última versão, sem editar o site a cada lançamento. **É seguro pro
  auto-update** — o `latest.yml` guarda o nome do arquivo, então a versão nova aponta sozinha pro
  nome novo —, mas duas consequências valem lembrar: (a) o link de download do site **só funciona
  a partir da `v0.9.22`**, porque as releases já publicadas têm o nome antigo; (b) quem for
  conferir uma release nova pelo `get_release_by_tag` vai ver o nome novo, não o antigo — não é
  bug.

  **Auto-update confirmado funcionando de ponta a ponta** (validado por ela: app em `v0.9.4`
  aberto, fechou e abriu de novo, `v0.9.5` se instalou sozinha, sem baixar `.exe` manualmente). A
  causa de `v0.9.3`/`v0.9.4` nunca terem se instalado sozinhas não era timing/rede — era o
  repositório estar **privado** (`electron-updater` baixa o `latest.yml` sem autenticação, e um
  repo privado sempre devolve 404 pra isso). Corrigido tornando o repositório público e renomeando
  pra `sakura-system-ace` (detalhe completo e alternativas descartadas no item 21 da seção 6).
  **Confirmado de novo nesta sessão**: `v0.9.6` se instalou sozinha na loja logo depois de
  publicada (o "Importar por foto" passou a mostrar o erro real da Anthropic em vez do genérico de
  antes — só possível já rodando o código novo, ver item 24 da seção 6). Se
  parar de funcionar de novo, `%APPDATA%\Sakura System - AutoCenter Edition\atualizacoes.log`
  continua sendo o primeiro lugar pra olhar.

## 8. O que NÃO existe ainda (próximos passos possíveis)

1. **Parte fiscal — ✅ RESOLVIDA (27/08/2026)**: **NFC-e (peça) e NFS-e (serviço) emitem de ponta
   a ponta em produção**, as duas já testadas com sucesso de verdade. O histórico de como se chegou
   lá foi podado em 02/09/2026 (está no Git); o que uma sessão nova precisa saber é só isto:
   - **NFC-e**: CNPJ credenciado na SEFAZ-SP, CSC + ID Token de **produção** gerados e cadastrados
     na Focus NFe. Falta só o CSC/ID Token de **homologação** (servidor de teste da SEFAZ-SP nunca
     respondeu — `ERR_CONNECTION_TIMED_OUT` — não bloqueia nada, só serve pra testar sem gerar nota
     real; tentar de novo no portal `www.nfce.fazenda.sp.gov.br/NFCePortal/` → Gerenciar Cód
     Segurança → "ambiente de testes" quando precisar).
   - **NFS-e**: token da prefeitura de Araraquara (portal Giap) gerado e cadastrado, código CNAE da
     loja preenchido em Configurações → Dados fiscais. Sem pendência conhecida.
   - **CSOSN `'500'` — CONFIRMADO pela contabilidade (31/08/2026)**: era o único risco fiscal em
     aberto do cadastro de peças. A usuária tinha usado `'500'` por hábito do sistema antigo, sem
     validação; a contabilidade confirmou que é o código certo mesmo. Nada a mudar no catálogo, e a
     pergunta que estava pendente com a Rayana/Rafaela está respondida.
   - Token de **produção** da Focus NFe (NFC-e e NFS-e) já está configurado e em uso — não é mais
     "não colocar até validar", já foi validado.
   - **NFS-e — colisão de numeração de RPS — RESOLVIDA (31/08/2026)**: emitir NFS-e passou a
     falhar com *"O número de RPS 7 já existe"*. O Sakura System **não envia número de RPS nenhum**
     (o corpo de `montarCorpoNFSe()` tem prestador, tomador e serviço; a única coisa nossa é o
     `ref` interno `os<numero>-nfse-<timestamp>`, único e sem relação com o RPS) — quem controla
     esse contador é a Focus NFe. **Causa**: a numeração de RPS dessa empresa já tinha sido usada
     no passado pela contabilidade emitindo direto pelo portal (existe nota antiga com **RPS 78**),
     e a Focus NFe começou a contar **do 1** — as notas 10 a 14 saíram com RPS 2 a 6 e o 7 bateu
     num já usado. **Resolvido pelo suporte da Focus NFe (Jaciara Santana), que ajustou o contador
     pra 100** e informou que isso também dá pra fazer sozinha: Painel da API → menu **Documentos
     Fiscais**. Descartado no caminho: o número do RPS **não** vem do número da OS (a OS era a 4 e
     o erro falava em 7). **Vale pra qualquer loja nova que já emitia nota antes do Sakura System**
     — ver o passo (C) do playbook mais abaixo.
   - **⚠️ NFS-e — a alíquota da competência precisa ser cadastrada TODO MÊS no portal da
     prefeitura, ANTES da primeira nota do mês** (descoberto em 01/09/2026, na primeira nota de um
     mês novo). A emissão falha com *"Por gentileza, conclua o cadastro de todas as alíquotas
     referentes à competência vigente"* (chega com os acentos quebrados, mojibake do lado deles).
     **Não é código nosso** — a alíquota que o app manda (`configuracoes_fiscais_loja.aliquota_iss`,
     3%) está certa e sai no XML como `pAliqAplic 3.00`; o que falta é um cadastro no portal.
     **Desde 11/09/2026 o sistema avisa antes de falhar** (item `TR-11.2` do guia): o Início
     mostra a faixa com o passo a passo e o botão "Já cadastrei" enquanto a competência do mês não
     estiver confirmada, e a mesma faixa aparece dentro da janela de emitir NFS-e. Continua sendo
     tarefa dela no portal — o sistema só deixou de ficar calado sobre uma armadilha com data
     certa. Ver "Aviso da alíquota do mês" na seção 7.
     **Onde**: portal do Giap (site da prefeitura → Serviços Empresa → Nota Fiscal Eletrônica →
     Contribuintes, login `30016580`) → menu **Emissor/Consulta NFS-e** → tela **Cadastro de
     Alíquota**. Preencher Mês/Ano (ex: `09/2026`), Alíquota (`3`) e Atividade, e clicar
     **"Replicar Alíquota"** (é o botão de salvar dessa tela; o outro é "Voltar"). A empresa tem
     **três atividades** cadastradas — CNAE 452000100 (manutenção e reparação mecânica), 452000400
     (alinhamento e balanceamento) e 452000600 (borracharia) —, todas historicamente a 3%.
     **Detalhe não confirmado**: bastou cadastrar com a **primeira** atividade selecionada pra
     destravar; a nota seguinte era de *alinhamento* (a segunda atividade) e saiu normalmente — não
     ficou claro se o "Replicar Alíquota" cadastra as três de uma vez ou se o portal só exige uma.
     Conferir no "Relatório Alíquota" da própria tela quando acontecer de novo. **Cuidado ao mudar
     o valor**: a tela é uma declaração formal (a alíquota do Simples Nacional varia com o
     faturamento) — se a contabilidade mandar outro percentual, ele tem que ser trocado **também**
     em Configurações → Dados fiscais da loja, senão a nota sai com um valor e a prefeitura tem
     outro cadastrado.
   - **Duas observações do portal da prefeitura — respondidas pelo suporte da Focus NFe, as duas
     são com a prefeitura** (achadas investigando o RPS acima; nenhuma exige mudança no nosso
     código): (a) toda nota emitida pela API aparece no portal com **"Processado: Não"**, "Chave
     Acesso" vazia e um erro genérico (`{"details":"Error id ...","stack":""}`) — o suporte
     respondeu que **o retorno do webservice foi de sucesso na autorização**, então é etapa
     posterior, do lado da prefeitura (bate com o XML dessas notas trazer `cStat 100`, número,
     chave e assinatura do Município: a nota vale). (b) o XML sai com `cNBS 120013430` =
     *"Serviços de manutenção e reparação de foguetes e equipamentos aeroespaciais"* — o suporte
     confirmou que **veio da prefeitura**, justamente porque o código não é enviado no JSON; pra
     corrigir, é preciso conferir no portal da prefeitura qual código está configurado pra empresa.
     **Nenhuma das duas foi levada à prefeitura ainda.**
   - **O histórico completo dessa novela foi podado em 02/09/2026** (eram ~470 linhas de
     bloqueio-a-bloqueio já resolvido). O que valia guardar virou: o resumo acima, o **playbook**
     logo abaixo (que é a parte reaproveitável pra loja nova) e os itens 29 a 33 da seção 6. Se
     um dia precisar da arqueologia completa, ela está no histórico do Git deste arquivo.

   **A sequência de bloqueios que foi vencida, em uma linha cada** (só pra reconhecer o padrão se
   algo parecido voltar): `Failed to fetch` (CORS — resolvido chamando a Focus NFe pelo processo
   principal do Electron, item 29 da seção 6) → CNPJ vazio em Configurações → empresa não
   habilitada (é **self-service** no painel da Focus NFe: Empresas → Documentos Fiscais → ligar
   NFCe/NFSe) → CST errado pro Simples Nacional (era CSOSN; foi o que motivou construir a edição
   de produto) → grupo IBS/CBS faltando, depois com alíquota errada (as de teste de 2026 são
   fixadas por lei, ver playbook) → CNPJ não credenciado na SEFAZ-SP pra NFC-e (**quem credencia é
   o lojista**, com certificado digital, não a Focus NFe) → na NFS-e: "Lote RPS" (era instabilidade
   do ambiente de **homologação** da prefeitura — resolveu testando em produção) → autenticação com
   a prefeitura → CNAE faltando no envio.

   **Três coisas dessa fase que não são óbvias e podem voltar a morder:**
   1. **O "login da prefeitura" de Araraquara que a Focus NFe pede não é a senha de acesso ao
      portal** — é um **token** gerado dentro do portal Giap, em "Dados Cadastrais" (o menu só
      aparece depois de marcar como lido o comunicado pendente da prefeitura). O usuário continua
      sendo o número de inscrição.
   2. **O CSC e o ID Token da NFC-e são gerados no portal da SEFAZ-SP**
      (`www.nfce.fazenda.sp.gov.br/NFCePortal/` → Gerenciar Cód Segurança), com certificado
      digital, e **homologação e produção são pares separados**. Só o de produção existe hoje: o
      servidor de homologação da SEFAZ-SP nunca respondeu (`ERR_CONNECTION_TIMED_OUT`).
   3. **A hipótese do "Ambiente Nacional" de NFS-e já foi levantada e descartada** — a própria
      Focus NFe avisa que só vale pra empresa obrigada (ex: MEI), e a loja é Ltda no Simples. Não
      reabrir sem um fato novo.

   > ⚠️ **Credenciais que estavam copiadas aqui foram removidas em 02/09/2026** — este repositório
   > é **público** (foi aberto pra o auto-update funcionar, ver item 21 da seção 6), então o CSC da
   > SEFAZ, o token do portal Giap e o usuário/senha da prefeitura estavam à vista de qualquer um.
   > Tirar do arquivo **não basta**: eles continuam no histórico do Git, então o certo é
   > **regerar/trocar os três** (SEFAZ → Gerenciar Cód Segurança; portal Giap → Dados Cadastrais →
   > Gerar Token; e a senha do portal da prefeitura, com a contabilidade). Todos estão em uso hoje
   > no painel da Focus NFe, então trocar exige atualizar lá também. **Não colar credencial neste
   > arquivo de novo** — o lugar delas é o painel do serviço.

   ### O que ainda está frágil na parte fiscal (varredura de 02/09/2026)

   Nenhum destes é bug de código pra sair corrigindo — são limites conhecidos, e três deles
   dependem de confirmação de fora. Ficam aqui pra ninguém "descobrir" de novo:

   1. ✅ **NFC-e pra cliente pessoa jurídica — RESOLVIDO (03/09/2026)**. A nota saía como
      "consumidor não identificado" porque o corpo só tinha `cpf_destinatario`; faltava saber o
      nome exato do campo de CNPJ, que deliberadamente não foi chutado. **O suporte da Focus NFe
      confirmou**, e está implementado: pessoa jurídica vai com `cnpj_destinatario` **mais**
      `indicador_inscricao_estadual_destinatario` com o valor `"9"` (não contribuinte, que pode ou
      não ter IE) — e a **inscrição estadual do destinatário não deve ser enviada** nesse caso, de
      jeito nenhum. Fica tudo em `montarDestinatarioNFCe()` (`src/lib/focusNfe.ts`), com teste.
      **Ainda não emitida uma NFC-e de PJ de verdade** — o código está pronto e testado, mas a
      confirmação na SEFAZ só vem na primeira venda pra empresa.

      **Três coisas que vieram junto na mesma resposta e valem guardar:**
      - **O nome do destinatário é opcional na NFC-e** (pode ser omitido). O sistema manda mesmo
        assim quando tem cliente cadastrado — não atrapalha, e ajuda quem recebe a nota.
      - **Venda com entrega a domicílio exige o endereço completo do destinatário** (`<enderDest>`).
        O Sakura System **não manda endereço nenhum** na NFC-e hoje: como é venda de balcão
        (`presenca_comprador: "1"`), não se aplica. Se um dia a loja passar a entregar, isso vira
        campo obrigatório e precisa ser construído.
      - **Acima do limite da UF (em geral R$ 10.000,00) a SEFAZ exige a identificação completa do
        destinatário.** Uma NFC-e desse valor sem cliente identificado será recusada — hoje não há
        nenhuma trava no sistema avisando disso antes de emitir.

      **O que sobra de risco**: cliente PJ **sem CNPJ preenchido no cadastro**. Nesse caso a nota
      volta a sair como consumidor não identificado (mandar um CNPJ pela metade faria a SEFAZ
      recusar a nota inteira) — a tela de emissão avisa antes de mandar, pedindo pra cadastrar o
      CNPJ em Clientes.
   2. **CSOSN `500` é enviado sem os campos de ICMS-ST** (`vBCSTRet`/`vICMSSTRet` e afins, que o
      layout da NFe pede pra esse código) — e **a suposição antiga de que a Focus NFe completava
      isso sozinha está errada**. Perguntado no mesmo chamado de 03/09/2026, o suporte respondeu
      que *"a API não completa nem insere automaticamente informações fiscais ou tributárias que
      não tenham sido enviadas na requisição"*, e que a parametrização é responsabilidade do
      emitente, com apoio da contabilidade. **Na prática as notas continuam sendo autorizadas
      assim** (é o que roda em produção desde agosto), então **não sair mexendo às cegas** — mas
      isso deixou de ser "está tudo certo" e virou **pergunta pra contabilidade**: com CSOSN 500,
      essas peças deveriam estar levando valor de ICMS-ST retido? Se a resposta for sim, é mudança
      em `montarItemNFCe()` — e vale conferir as notas já emitidas. Se aparecer rejeição falando em
      substituição tributária, é aqui que se olha primeiro.
   3. **Não existe trava no banco contra duas notas do mesmo tipo pra mesma OS.** A proteção hoje é
      só de tela (o botão some quando a OS já tem a nota). Os dois caminhos que furam isso estão
      cobertos por aviso desde 02/09/2026 (a `ref` perdida e a exclusão de nota autorizada, item 46
      da seção 6), mas uma `unique (ordem_servico_id, tipo)` — considerando que nota cancelada
      precisa permitir reemissão — resolveria de vez. Não foi feito: exige migration e uma decisão
      sobre o caso da reemissão.
   4. **Os dados da loja em Configurações → "Dados fiscais" quase não vão pra nota.** Só o **CNPJ**
      é enviado (mais inscrição municipal, código do município, CNAE e alíquota na NFS-e). Razão
      social, inscrição estadual, endereço e regime tributário **não saem na nota** — a emitente de
      verdade é a empresa cadastrada no painel da Focus NFe. Esses campos aqui alimentam o
      **documento de garantia**, não a nota. Corrigir um endereço aqui e esperar que a nota mude é
      um engano fácil de cometer.
   5. **A `ref` da emissão não é guardada antes do envio.** Ela é gerada na hora
      (`os<numero>-<tipo>-<timestamp>`) e só vai pro banco depois que a nota volta autorizada. É
      por isso que o item 46 da seção 6 teve que se contentar em **mostrar** a `ref` quando a
      espera vence, em vez de recuperar sozinho. Guardar antes exigiria uma linha "em andamento" em
      `notas_fiscais_arquivos` (migration). O timestamp na `ref` é de propósito e **não deve virar
      fixo**: é ele que permite reemitir depois de cancelar uma nota.

   ### Playbook de habilitação fiscal por loja nova (lições da primeira)

   Escrito a pedido da usuária **enquanto a primeira loja ainda está travada**, justamente pra que
   toda essa descoberta na marra não precise ser refeita do zero na loja 2, 3... 30. A lição
   central é que os bloqueios encontrados **não são todos do mesmo tipo** — e só um dos três tipos
   some sozinho quando uma loja nova entra:

   **(A) Igual pra toda loja — já resolvido no código, custo zero por loja nova.** Formato do JSON
   da NFC-e/NFS-e (confirmado contra os exemplos oficiais do repo `FocusNFe/javascript`); os 10
   campos de IBS/CBS e as alíquotas de teste de 2026 (`cbs_aliquota = 0.90`,
   `ibs_uf_aliquota = 0.10`, `ibs_mun_aliquota = 0.00` — regra **nacional** fixada por lei, não
   decisão de contabilidade de nenhuma loja específica); o rateio proporcional do pagamento em OS
   com peça + serviço; a chamada via IPC do Electron pra fugir de CORS; e a exibição do erro real
   vindo da Focus NFe em vez de mensagem genérica. **Nada disso se repete por loja.**

   **(B) Muda por loja, mas é só preencher uma tela — minutos, self-service.** Em Configurações →
   "Dados fiscais da loja": CNPJ, razão social, inscrição estadual/municipal, regime tributário,
   endereço, telefone, token da Focus NFe, e (só pra NFS-e) código IBGE do município, item da lista
   de serviço LC 116, alíquota de ISS e código tributário do município. **Cuidado aprendido**: campo
   em branco aqui vira erro que *parece* bug do sistema — o `prestador.cnpj não informado` da
   primeira tentativa era só o CNPJ vazio nessa tela.

   **(C) Muda por loja e depende de terceiros — é o caro, e é onde a primeira loja está travada.**
   Nenhum desses é código; são cadastros que levam dias/semanas e passam por gente de fora:
   1. **Habilitar os documentos no painel da Focus NFe** — Empresas → (empresa) → Documentos
      Fiscais → ligar NFCe e NFSe. É **self-service** (o suporte deles não faz isso por você —
      resposta do Natan Coelho), mas ninguém adivinha que existe: custou um ticket pra descobrir.
   2. **Credenciar o CNPJ na SEFAZ do estado, pra NFC-e — e gerar CSC + ID token lá** (confirmado
      pelo suporte da Focus NFe, 26/08/2026, ver item 1 desta seção). São **três coisas** por loja,
      todas feitas pelo próprio lojista/contabilidade no portal da SEFAZ do estado, nenhuma delas
      feita pela Focus NFe: (a) o **credenciamento** do CNPJ pra NFC-e — e **homologação e produção
      são credenciamentos separados** (é a rejeição 245, "CNPJ Emitente não cadastrado"); (b) o
      **certificado digital** da empresa, que precisa existir e ser vinculado no painel da Focus
      NFe; (c) o **CSC e o ID token**, gerados na SEFAZ (um par pra homologação, outro pra
      produção) e informados no painel da Focus NFe. Em SP existe um portal próprio de NFC-e
      (`nfce.fazenda.sp.gov.br`), diferente do de NF-e/CT-e, e o acesso pede o certificado digital.
      **Varia por estado** — direto relevante pra fase 3, que sai de Araraquara/SP (ver seção 1).
      **É o passo mais pesado de todo o onboarding fiscal**: envolve certificado digital pago,
      portal de governo e, na prática, a contabilidade do cliente.
   3. **Conferir a numeração de RPS da empresa antes da primeira NFS-e** — se a loja já emitia
      nota de serviço antes (pela contabilidade, direto no portal do município), a numeração de RPS
      já andou, e a Focus NFe começa a contar do 1: as primeiras notas passam nos números livres e
      uma hora batem num já usado ("O número de RPS X já existe"). Resolve-se ajustando o contador
      pra bem acima do maior já usado (Painel da API → Documentos Fiscais, ou pedindo ao suporte).
      Aconteceu na primeira loja — ver item 1 desta seção.
   4. **Cadastrar a alíquota da competência todo mês** (pelo menos em Araraquara/Giap) — sem
      isso a primeira NFS-e do mês é recusada. É tarefa recorrente do lojista, não de instalação;
      passo a passo no item 1 desta seção.
   5. **Login/senha do portal da prefeitura, pra NFS-e** — Araraquara exigiu (veio da contabilidade
      da loja, não da Focus NFe). **Varia por município**, inclusive o fornecedor do sistema
      municipal (Araraquara usa "Giap") e o conceito de lote/RPS que ele impõe.
   6. **Confirmar CST/CSOSN com a contabilidade do cliente** — depende do regime tributário
      **daquela** empresa (Simples Nacional usa CSOSN, regime normal usa CST). A SEFAZ rejeita o
      código incompatível com o regime, mas **não** confere se é o código certo pro produto — ou
      seja, um cadastro errado passa na emissão e só aparece como problema fiscal depois.

   **Consequência estratégica (importante pro item 2 desta seção, o site de assinatura
   self-service)**: o bucket (C) é o que impede o sonho "loja nova assina no site e já emite nota
   sozinha". Assinar o sistema pode ser instantâneo; **emitir nota, não** — cada loja nova carrega
   um onboarding fiscal que envolve SEFAZ estadual, prefeitura e a contabilidade do próprio
   cliente. Duas implicações práticas pra quando essa hora chegar: (1) tratar "usar o sistema" e
   "emitir nota fiscal" como **duas etapas de ativação separadas** — a loja começa usando
   cadastro/OS/estoque/caixa no primeiro dia (exatamente como a Pneus Amigão fez, ver seção 3) e a
   emissão entra depois, quando o bucket (C) fechar; (2) esse onboarding precisa virar um
   **checklist operacional que a usuária (ou quem for vender) conduz junto com o cliente**, não uma
   redescoberta por loja — este playbook é o rascunho dele.

   **Ponto ainda em aberto que muda esse desenho**: se a arquitetura de **token compartilhado**
   (item 6 desta seção) for construída, o passo (B) deixa de ter "token da Focus NFe" por loja, e o
   passo (C.1) passa a ser feito pela usuária dentro da conta única dela, em vez de cada dono de
   loja mexer no painel da Focus NFe — reduz a fricção de (C), mas **não elimina** (C.2), (C.3) nem
   (C.4), que são cadastros no nome do CNPJ do cliente e não têm como ser feitos por outra empresa.
2. **Site externo de assinatura** que cria a primeira conta de cada loja
   automaticamente (hoje é manual, pelo painel do Supabase) continua pendente — combinado que fica
   pra quando pensarem na versão comercial.
3. **Logo oficial** — **decisão da usuária: não é prioridade agora**, continua com os SVGs feitos
   à mão (ver seção 2) até ela decidir trocar no futuro. Não sugerir/perguntar sobre isso de
   novo por conta própria; só retomar se ela trouxer o assunto.
4. Refinamentos possíveis no Início e demais módulos, conforme feedback da usuária.
5. **Módulo de Fornecedores — completo** (cadastro + Pedido de Compra + Receber pedido + Cotação +
   Importar XML, ver seção 7 "Fornecedores"). A usuária pediu pra completar, nessa ordem, três
   funcionalidades que um sistema de referência (S3Auto/Comsis) também costuma ter, antes de
   atacar a emissão de nota fiscal (item 1 desta seção) — **as três já estão prontas**:
   1. ✅ **Cadastro de Depósito** — **confirmado por ela funcionando de verdade** (rodou a
      migration `0041` e testou o cadastro), ver "Depósitos" na seção 7 e migration `0041` na
      seção 5.
   2. ✅ **Cotação de Peças por fornecedor** — ver "Cotação de peças" na seção 7 e migration
      `0042` na seção 5. **Migration `0042` já rodada e confirmada no Supabase real dela** — o
      histórico de preço por fornecedor já aparece nos Pedidos de Compra.
   3. ✅ **Importar XML de nota fiscal do fornecedor** — **construído nesta sessão**, ver a
      descrição completa em "Fornecedores" na seção 7. Não precisa de migration nova (só reaproveita
      tabelas já existentes: `pedidos_compra`, `fornecedores`, `pecas`, `cotacoes_pecas`,
      `estoque_movimentos`) — funciona assim que o código novo chegar na máquina dela
      (`git pull` + `npm install`), sem precisar rodar nada no SQL Editor.
   - Peças em Garantia **do fornecedor na compra** (diferente da garantia ao cliente já
     implementada) — não fazia parte da lista de 3 combinada com ela; sem ordem definida, fica
     pra quando ela sentir falta.
6. **Custo da IA (Anthropic) e da Focus NFe por loja, quando vender pra terceiros** — a usuária
   perguntou, ao configurar o "Importar por foto", se ela pagaria pelas leituras de todas as lojas
   que um dia usarem o Sakura System. **Resposta atual**: não — como cada loja tem seu próprio
   projeto Supabase, a Edge Function e o secret `ANTHROPIC_API_KEY` ficam dentro do projeto de
   cada loja, então cada uma cria sua própria conta na Anthropic e paga pelo próprio uso (mesmo
   modelo hoje também usado pro Focus NFe — cada loja assina o próprio plano). **Mas isso cria
   fricção**: pedir pra cada dono de autocenter (sem experiência técnica) criar conta na Anthropic
   e publicar uma Edge Function — ou criar conta na Focus NFe, escolher plano e colar token — é
   trabalho manual chato de repetir por loja, e destoa da visão de um site de assinatura estilo
   Netflix (100% self-service, ver item 2 abaixo). Quando a usuária estiver mais perto de vender
   pra outras lojas de verdade, vale reconsiderar um backend central pros dois casos (ela paga uma
   conta só de cada serviço, cobra o uso dentro da assinatura do sistema) — decidir com calma
   nessa hora, não agora que só a loja do pai dela usa.

   **Sobre a Focus NFe especificamente** (discutido nesta sessão, ainda sem decisão fechada — só
   direção): os próprios planos da Focus NFe (Start/Growth/Retail+, "para empresas com muitos
   CNPJs") parecem feitos exatamente pro caso de um software house/ERP emitir nota em nome de
   várias empresas clientes numa conta só — é o modelo usado por contadores e ERPs, não é
   gambiarra. Conta feita nesta sessão com o volume real que ela descreveu pras 30 lojas-alvo
   (~30 carros/dia em média, ~1.170 notas/mês/loja estimado): consolidar tudo numa conta Growth
   sairia ~14-19% da receita de R$1000/loja, contra ~20-24% mantendo 30 assinaturas Solo
   separadas — mais barato consolidado, e principalmente **mais profissional** (dono da loja nunca
   precisa saber que a Focus NFe existe, só usa o Sakura System).

   **CORREÇÃO IMPORTANTE (26/08/2026)**: uma suposição registrada aqui antes — de que "NFC-e muitos
   estados dispensam certificado do lojista via CSC do próprio software house, então dá pra
   automatizar de ponta a ponta" — **está errada, e foi desmentida pelo próprio suporte da Focus
   NFe** (ver item 1 desta seção). Pra NFC-e são necessários, **por CNPJ de loja**: certificado
   digital próprio + credenciamento na SEFAZ do estado + CSC e ID token gerados por lá (um par por
   ambiente). Nada disso a Focus NFe faz pelo cliente, e nada disso o token compartilhado resolve.
   **Consequência pro sonho do self-service**: consolidar numa conta só continua valendo pelo preço
   e por esconder a Focus NFe do dono da loja, mas **não elimina o onboarding fiscal por loja** —
   ele continua exigindo certificado digital pago, portal de governo e a contabilidade do cliente.
   Reforça a decisão já registrada no playbook do item 1: tratar "usar o sistema" e "emitir nota"
   como duas etapas de ativação separadas.

   **Ainda em aberto pra NFS-e** (essa parte não foi respondida): **varia por prefeitura** — algumas
   cidades pedem certificado digital da própria loja, outras só usuário/senha do portal municipal
   (Araraquara pediu usuário/senha, ver item 1). Antes de prometer automação 100% em qualquer
   cidade, confirmar com o suporte da Focus NFe: (a) se dá pra cadastrar CNPJ de cliente numa conta
   só sem ele precisar logar lá, e (b) o que muda de cidade pra cidade na NFS-e.

   **Concorrentes da Focus NFe checados nesta sessão** (Webmania, NFe.io — prints reais dos
   planos): nos planos públicos de autosserviço, ambos ficam **piores** que Focus NFe no volume
   considerado — Webmania cobra R$0,45/nota excedente (vs R$0,12 do Growth), e a NFe.io tem teto
   baixo de notas mesmo no maior plano público (5.000/mês pra NFC-e, 1.000/mês pra NFS-e — bem
   abaixo do que a operação em escala (30 lojas) precisaria). **Lição geral pra comparar qualquer
   provedor novo no futuro**: sempre conferir se o plano mais barato **tem API de integração** —
   nos dois casos, o plano de entrada mais barato **não tinha** (só emissão manual pelo painel
   deles ou por planilha), inútil pro Sakura System, que precisa emitir automaticamente. Preço
   negociado ("sob consulta") só faz sentido buscar **com volume real comprovado** (fase 2/3, não
   agora com 1 loja só) — sem histórico de uso, não tem alavancagem de negociação nenhuma.

   **Preço decidido pra fase 2 (3 lojas: Pneus Amigão + as 2 lojas do amigo do pai dela,
   confirmado que ele vai conhecer o sistema numa segunda-feira)**: **R$350/loja/mês**, calculado
   como o dobro do custo de infraestrutura por loja (fórmula da usuária: preço bruto = 2x custo,
   ~50% de margem por construção). Volume real dessas 3 lojas é bem menor que a média de 30
   carros/dia do mercado-alvo futuro — Pneus Amigão raramente passa de 4 carros/dia, as lojas do
   amigo não devem passar de 15/dia cada; a conta usou esses números com uma margem de crescimento
   de 30% aplicada por cima. Composição do custo mensal considerado (~R$521,30 pras 3 lojas
   juntas, ~R$173,77/loja):
   - Focus NFe (plano Start, até 3 CNPJs, consolidado numa conta só da usuária): R$113,90 base +
     excedente de nota ≈ R$256,30 total.
   - Supabase Pro (upgrade do Free considerado como reserva de segurança, não confirmado que já
     seja necessário no volume atual): ≈ R$145,00 (US$25).
   - IA/Anthropic ("Importar por foto"): ≈ R$10,00 (uso baixo, 1-3 centavos por leitura).
   - Assinatura Claude Pro da própria usuária (ferramenta de desenvolvimento, custo fixo que não
     escala com número de lojas — a fração por loja vai encolher conforme mais lojas entrarem):
     ≈ R$110,00 (faixa R$100-120).
   **Pré-requisito de código, ainda não construído**: pra esse número (Focus NFe consolidado numa
   conta só, invisível pro dono da loja) funcionar de verdade, falta trocar a arquitetura de
   "token por loja" (hoje, cada loja guarda o próprio token em `configuracoes_fiscais_loja`,
   chamado via IPC do Electron) por um **token compartilhado da usuária**, chamado através de uma
   Edge Function (nunca exposto ao app instalado — mesma regra já usada pro `ANTHROPIC_API_KEY`),
   com o CNPJ de cada loja identificando qual empresa está emitindo dentro da conta única. Sem essa
   mudança, cada loja precisaria da própria assinatura Focus NFe (mais caro e mais fricção — ver
   comparativo de custo com/sem token compartilhado nesta mesma sessão). **Ordem combinada**:
   primeiro terminar de validar a emissão de NFC-e na loja do pai dela (pendência já registrada no
   item 1 desta seção), só depois construir a arquitetura de token compartilhado — não é urgente
   pra demonstração de segunda-feira, que não depende de nota fiscal automatizada funcionando.

   **Referência de custo por escala** (calculado numa sessão seguinte, método reaproveitável):
   volume estimado = carros/dia × dias/mês × 1,5 (mistura peça+serviço por carro). Fórmula de
   preço da usuária: preço bruto = 2x custo → lucro = preço − custo = o próprio valor do custo
   (50% de margem por construção; "o dobro do custo" é o **preço**, não o lucro).

   | Cenário | Volume assumido | Plano Focus NFe | Custo total | Custo/loja | Preço (2x) |
   |---|---|---|---|---|---|
   | Pneus Amigão real (3 carros/dia, todo dia do mês) | 90 OS/mês, 135 notas/mês | Solo | R$358,40 | R$358,40 | R$716,80 |
   | 1 loja dimensionada certinho (30 carros/dia, 26 dias úteis) | 780 OS/mês, 1.170 notas/mês | Solo | R$461,90 | R$461,90 | R$923,80 |
   | 3 lojas fase 2 (4+15+15 carros/dia reais, +30% margem crescimento) | ~1.150 OS/mês, ~1.724 notas/mês | Start | R$521,30 | R$173,77 | **R$350,00** (decidido) |
   | 30 lojas (30 carros/dia média, sem margem extra) | 23.400 OS/mês, 35.100 notas/mês | Growth | R$5.626,00 | R$187,53 | R$375,07 |

   > ⚠️ **Corrigido em 10/09/2026**: a composição abaixo trata o Supabase Pro como custo **por
   > empresa**, e ele é cobrado **por organização** — US$25 com o 1º projeto incluso, e cada
   > projeto a mais a partir de US$10/mês. Onde estas linhas somam um Supabase Pro por empresa,
   > o número está alto. O resto do método (volume = carros/dia × dias × 1,5) continua valendo.

   Composição de custo fixo usada em cada linha (além do Focus NFe, que varia por volume):
   Supabase Pro ≈ R$145 (cenários 1 loja/Pneus Amigão/3 lojas) ou Pro + compute add-on "Large"
   ≈ R$756 (cenário 30 lojas, câmbio ~R$5,60/USD); Claude Pro ≈ R$110 (cenários menores) ou
   Claude Max 5x ≈ R$560 (cenário 30 lojas — confirmado nesta sessão: Max existe em 5x
   US$100/mês e 20x US$200/mês); IA/Anthropic ≈ R$10-30 conforme volume. **Custo por loja não
   cai de forma linear com a escala** — desce bastante de 1 pra 3 lojas (diluição dos custos
   fixos) e depois fica estável entre 3 e 30 (o que muda ali é o plano Focus NFe acompanhando
   CNPJs/volume, não uma economia de escala grande). Nenhum desses valores é decisão fechada
   exceto o R$350/loja da fase 2 — são referência de método pra recalcular rápido quando a hora
   chegar, sem precisar refazer a pesquisa de preço dos concorrentes do zero.
7. **Vibecodar em equipe** — a usuária pretende, no futuro (sem data definida ainda pro Sakura
   System em si — ver plano de teste concreto abaixo), trazer amigos pra ajudar no projeto como
   desenvolvedores, cada um provavelmente também operando via IA. Ainda não é hora de montar nada
   disso **no repositório do Sakura System** — só documentando o ponto de atenção já identificado
   pra quando a hora chegar: hoje existe **um projeto Supabase só** (produção, com dado real da
   loja do pai dela) e um único `.env` — se mais gente rodar `npm run dev` e testar coisas, estaria
   todo mundo mexendo direto no banco de verdade. **Primeiro passo prático quando for montar a
   equipe aqui**: criar um projeto Supabase de teste/staging separado (rodar as migrations
   `0001`-`0042` nele, mesmo processo já documentado na seção 9 pra "montar um projeto do zero")
   pra quem for novo no projeto testar sem risco. O resto do fluxo já usado hoje (branch → PR →
   merge, `PROJETO_STATUS.md` como memória compartilhada, `/code-review` antes de mesclar) já
   escala razoavelmente bem pra mais gente, sem precisar mudar nada estrutural. Também recebi de
   leitura um "prompt de contexto" gerado pelo Gemini, descrevendo uma estrutura de squads
   (Backend/Frontend/Testers) e uma arquitetura de API separada do Supabase — **ela confirmou que
   isso é só visão de longo prazo, não fato hoje**: a arquitetura continua "app fala direto com
   Supabase via RLS", sem backend próprio, e não deve mudar sem ela pedir explicitamente e decisão
   conjunta (ver seção 3, "não reabrir sem motivo forte").

   **Plano concreto de teste, decidido nesta sessão (fora do repositório `sakura-system-ace`)**: antes de trazer
   os amigos pro Sakura System de verdade, ela vai treinar o fluxo de equipe num **projeto separado
   e descartável** — um sistema de gestão pra um restaurante de comida japonesa de um conhecido do
   pai dela. Time: ela + 3 amigos programadores (4 no total, divididos entre backend/frontend, sem
   divisão exata definida ainda) + 1 "coletor de referência" (não programa — só junta cardápio,
   fotos e preços do restaurante num documento pros devs usarem, sem custo de IA). Plano contratado:
   **Claude Team, 4 assentos Standard, cobrança mensal** (R$138/assento = R$552/mês total — optou
   por mensal em vez de anual por ainda ser fase de teste, sem compromisso de 1 ano). Repositório
   GitHub, projeto Supabase e arquivo de contexto (tipo `PROJETO_STATUS.md`) desse projeto teste
   ainda não foram criados — ela recebeu um `.txt` com esse resumo pra colar como primeira mensagem
   quando abrir a sessão de IA desse projeto novo. **Isso é 100% separado do Sakura System — nenhum
   código, dado ou decisão de arquitetura desse teste deve vazar pra cá sem ela pedir.**
8. ✅ **Tela de configuração de conexão Supabase (multi-empresa)** — **construída nesta sessão**,
   ver "Conexão com o banco (multi-empresa)" na seção 7 pro funcionamento e pra pendência de
   publicação. Era o passo que travava a fase 2 (item 2 da seção 1): um amigo do pai dela vai
   comprar o sistema pras duas lojas dele, uma empresa diferente, que precisa de projeto Supabase
   próprio e isolado — e até aqui um instalador servia uma empresa só.

9. ✅ **Site de apresentação (`site/`) — CONSTRUÍDO, mas PARADO por decisão dela (28/08/2026)**.
   Página única em HTML/CSS puros com telas reais do sistema, pronta pra publicar na Vercel (3
   campos, passo a passo em `site/README.md`). **Ela disse explicitamente que não era prioridade
   ainda** — *"nem precisava ter feito site ainda... não vou mexer com isso agora"* — e pediu pra
   guardar tudo pra quando precisar. **Não retomar por conta própria**: só voltar a esse assunto
   se ela trouxer. O que fica pendente quando ela quiser publicar: apontar a Vercel pra pasta
   `site`, publicar uma `v0.9.22` (pra destravar o botão de download, ver "Empacotamento" na seção
   7) e decidir se entra um botão de WhatsApp (hoje o contato do site é só o e-mail dela; ela não
   chegou a passar um número).

Funcionalidades explicitamente **futuras** (não implementar sem pedido explícito, mas manter
arquitetura aberta): integração com maquininha de cartão (TEF), assistente de IA para estoque,
importador universal de dados de outros sistemas, versão mobile, outras edições do Sakura System
(ex: Supermarket Edition).

**Revisão de código** (`/code-review` nível `xhigh`, repositório inteiro): achou 4 bugs reais, todos
já corrigidos e validados (`buscarDepositoPadraoId()` sem depósito ativo, `excluirLoja()` incompleto
— ver item 20 da seção 6 pro detalhe completo —, `registrarCotacoes()` com preço 0 batendo no
`check (preco > 0)`, `ImportarNotaFiscalXmlModal.tsx` lendo XML sempre como UTF-8 mesmo quando o
prólogo declara ISO-8859-1). **Dívidas técnicas conhecidas, fora de escopo dessa revisão** (ficam
pra decidir com calma, não são bug): item 1 da seção 6 (permissão só checada na interface, sem RLS
por módulo) e item 4 (sem teste de UI/integração, só função pura).

**Estado geral**: o sistema está pronto pro uso real no dia a dia (cadastro, OS, estoque, caixa,
fornecedores etc.) — **e a emissão fiscal automática (NFC-e e NFS-e) já está funcionando em
produção** (ver item 1 desta seção), a última peça grande que faltava; a NFS-e já virou rotina
(notas 10 a 15 emitidas). Segue pendente o CSC/ID Token de **homologação** da NFC-e (não bloqueia
uso real, só testes) e, todo mês, o cadastro da alíquota da competência no portal da prefeitura
(item 1 desta seção — sem isso a primeira NFS-e do mês é recusada).

### Linha do tempo recente (o que cada sessão deixou pronto)

> Antes eram quatro relatórios longos de sessão, um embaixo do outro. Viraram esta tabela em
> 02/09/2026 — o que importa pra uma sessão nova é **o que está pronto hoje**, e isso já está nas
> seções 6, 7 e 8. Os relatórios completos estão no histórico do Git.

| Quando | O que saiu |
|---|---|
| 27/08 | **A parte fiscal fechou**: NFC-e e NFS-e emitiram em produção pela primeira vez (item 1 da seção 8). As OS de teste foram apagadas depois. |
| 28/08 (manhã) | Instalação de empresa nova num **arquivo SQL único** + checklist de venda (itens 36 e 37 da seção 6, seção 9). E o **site de apresentação** (`site/`), que ela pediu pra **guardar sem publicar** — ver item 9 da seção 8, não retomar sozinho. |
| 28/08 (tarde) | Leva de ajustes de uso real no balcão: parcelar cartão dentro do pagamento dividido, estado **"Finalizada"** da OS, "+ adicionar item" no rodapé, total por item, e a correção dos **três cálculos de lucro divergentes** (item 40 da seção 6). Tags `v0.9.21` a `v0.9.24`. |
| 31/08 | Campo numérico deixou de mudar sozinho pelas setas (item 41), calendário do Início passou a mostrar os dias do mês vizinho, e o **CSOSN `'500'` foi confirmado** pela contabilidade. Tag `v0.9.25`. |
| 01/09 | Primeira NFS-e de um mês novo revelou o **cadastro mensal de alíquota** exigido pela prefeitura (item 1 da seção 8) — tarefa recorrente, todo mês. |
| 02/09 | Baixar os XMLs de um mês num **`.zip` só**, a aba **Comissões**, e as **12 correções** das duas varreduras (itens 42 a 46 da seção 6). Tag `v0.9.26`. |
| 03/09 | Resposta do suporte da Focus NFe destravou a **NFC-e no CNPJ do cliente empresa**; período **Anual** em Relações; **Comissões** mudou pra dentro de Funcionários; botão do calendário visível. Tag `v0.9.27`, confirmada rodando na loja. |

**Duas lições de trabalho que saíram dessas sessões e continuam valendo** (as duas já estão na
seção 1, mas é aqui que costumam ser lidas): *intenção futura não é autorização pra começar agora*
— o site foi construído na hora errada; e **não confiar neste arquivo pra saber a última versão
publicada** — conferir a lista real de releases, porque uma tag saiu sem atualizar o documento e a
sessão seguinte informou a versão errada pra ela.


## 9. Como rodar / configurar (resumo)

```bash
git clone https://github.com/caranovavidanova/sakura-system-ace.git
cd sakura-system-ace
npm install
cp .env.example .env   # preencher com VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY (chave anon/publishable)
npm run dev            # abre o app Electron com hot reload + DevTools
```

Projeto Supabase da usuária: nome "Sakura System", ref `rlgdjiowvnfzsedehyga`, região São Paulo,
URL `https://rlgdjiowvnfzsedehyga.supabase.co`. **Migrations `0001` a `0043` já foram confirmadas
rodando sem erro nesse projeto** (incluindo a fundação multi-loja, as correções/módulos novos
`0034`-`0037`, `0038`/`0039`/`0040` — apesar do histórico confuso de duas sessões de trabalho
paralelas que rodaram nomes de migration conflitantes, ver seção 10, o resultado final já foi
confirmado funcionando de verdade por ela: Fornecedores com endereço completo, redefinir senha, e
Auditoria, todos testados na prática — `0041`, o cadastro de Depósito, também já rodada e testada
por ela — `0042`, Cotação de peças, rodada por ela numa sessão anterior, depois de um susto com a
query dando erro "relation pecas does not exist" por estar apontando pro projeto Supabase errado
no SQL Editor (rodando no projeto certo, funcionou de primeira) — e `0043`, "Recorrente até" em
Contas a Pagar, rodada e confirmada por ela numa sessão anterior). **`0044`** (campos novos em
`configuracoes_fiscais_loja` pra NFS-e — código do município, item da lista de serviço, alíquota
ISS, código tributário do município) e **`0045`** (`clientes.codigo_municipio`, pro tomador da
NFS-e) **também já foram rodadas e confirmadas no Supabase real dela**.

**Estado hoje: `0001` a `0049` estão TODAS aplicadas no Supabase real dela** — a `0048`
(precisão das colunas de valor) e a `0049` (lembrete da alíquota da competência) foram coladas por
ela no SQL Editor em 11/09/2026, as duas com "Success. No rows returned", e a `0049` **antes** da
tag `v0.9.30`, que é a ordem que essa migration exigia (sem as colunas dela, "Salvar dados
fiscais" daria erro de coluna inexistente no computador da loja). Nada pendente de SQL.
**Sobre `0047` e anteriores:** `0046` (`focus_nfe_ref` em
`notas_fiscais_arquivos`, pro botão "Cancelar nota") e `0047` (`codigo_cnae` em
`configuracoes_fiscais_loja`, pra NFS-e) foram criadas e já rodadas na mesma sessão — confirmado
funcionando (a NFS-e número 10/11 só autorizou depois da `0047` e do Código CNAE preenchido).

### Montar um projeto Supabase do zero (empresa nova / outro computador)

**O passo a passo completo está em `supabase/instalacao/INSTALAR-LOJA-NOVA.md`** — é o checklist
que a usuária segue de verdade ao vender pra um cliente novo. Não reescrever esse roteiro aqui;
esta seção só registra o essencial pra uma sessão entender o mecanismo.

**Banco**: colar **um arquivo só**, `supabase/instalacao/instalacao-completa.sql`, no SQL Editor
(New query → Run). Ele é gerado a partir das migrations por `npm run gerar-instalacao`
(`scripts/gerar-instalacao-completa.mjs`) e um teste do `npm test` reprova se estiver
desatualizado — ou seja, **criar uma migration nova sem regerar o arquivo quebra o `npm test`**,
de propósito.

Antes existia aqui a instrução de colar os ~47 arquivos de `supabase/migrations/` um por um, na
ordem. Isso foi abandonado porque pular um arquivo ou trocar a ordem **não dá erro na hora** — só
quebra depois, na tela do app, como um erro estranho difícil de ligar à instalação.

**Isso é só a parte do banco.** Uma empresa nova (não uma loja nova dentro da mesma empresa) ainda
precisa de: os dois passos manuais de Auth logo abaixo, o primeiro operador admin **com o vínculo
em `operador_lojas`** (ver item 37 da seção 6 — é o erro mais fácil de cometer nessa instalação),
e — no computador dela — digitar a URL/chave desse projeto na tela de conexão que aparece na
primeira abertura (ver "Conexão com o banco (multi-empresa)" na seção 7). Se a loja também for
emitir nota fiscal, some a isso o **playbook de habilitação fiscal** do item 1 da seção 8, que é a
parte demorada e depende de SEFAZ/prefeitura/contabilidade do cliente.

**Pra validar migration nova num Postgres local** (o ambiente de desenvolvimento tem um):
`supabase/scripts/stub-supabase-local.sql` cria os schemas `auth`/`storage` e as permissões que o
Supabase dá sozinho — inclusive as necessárias pra simular login e testar RLS de verdade
(`set local role authenticated` + `set local "request.jwt.claim.sub"`, dentro de uma transação,
senão o `set local` não pega e o teste roda como superusuário, que ignora RLS). Existe porque toda
sessão que precisava validar uma migration recriava esses mesmos stubs do zero.

### Reconciliação das migrations `0038`-`0040` (já concluída no Supabase real dela)

Registro histórico, caso um projeto Supabase novo (segunda loja, ou reinstalação) precise do mesmo
cuidado: `0038_deve_trocar_senha.sql`, `0039_fornecedores_pedidos_compra.sql` e
`0040_auditoria.sql` foram rodadas em sequência, a Edge Function `redefinir-senha-operador` foi
redeployada com o código atual, e as colunas de endereço de `fornecedores`
(`cep`/`rua`/`numero`/`bairro`/`cidade`/`uf`) foram conferidas no Table Editor — tudo certo. Num
banco novo do zero, basta seguir a ordem normal de "Montar um projeto Supabase do zero" acima.

Passos manuais únicos de configuração de Auth (documentados também dentro da migration
`0007_operadores.sql`):

1. **Desligar a confirmação por e-mail**: Authentication → Sign In / Providers — "Enable email
   provider" **ligado** (senão dá erro "Email logins are disabled") e "Confirm email"
   **desligado** (senão ninguém consegue entrar depois de criado, porque os e-mails são
   inventados e não existe caixa de entrada pra confirmar).
2. Criar o primeiro admin manualmente (Authentication → Users → Add user) e rodar o `insert` de
   exemplo comentado no final da migration `0007_operadores.sql`, colando o "User UID" gerado.

### Ativar o "Importar por foto" (leitura de nota fiscal por IA)

Não depende de migration — depende de publicar uma **Edge Function** no Supabase e configurar uma
chave de API. Feito pelo painel do Supabase, sem instalar nada no computador:

1. **Criar uma chave de API na Anthropic**: `console.anthropic.com` → conta própria (ela mesma
   paga o próprio uso — pra essa leitura, fica em torno de 1 a 3 centavos por peça lida) →
   Settings → API Keys → Create Key (copia a chave, começa com `sk-ant-...`).
2. **Publicar a função no Supabase**: painel do projeto → **Edge Functions** → **"Deploy a new
   function"** → **"Via Editor"** (não "Via CLI" nem "Via AI Assistant") → digitar o nome
   `ler-notas-fiscais` **no campo "Function name" antes de clicar em Deploy** (renomear depois
   **não** muda o endereço real — ver pegadinha abaixo) → apagar o código de exemplo que vem no
   editor e colar todo o conteúdo de `supabase/functions/ler-notas-fiscais/index.ts` → **Deploy
   function**.
3. **Configurar o secret**: na função criada, aba **Secrets** (ou Project Settings → Edge
   Functions → "Add new secret") → nome `ANTHROPIC_API_KEY`, valor a chave do passo 1.
4. Testar: **Estoque → Produtos → "Importar por foto/PDF"**.

**Se a função já estava publicada antes** (leitura só de fotos) e agora quer aceitar PDF também:
volta no passo 2 e cola o conteúdo **atualizado** de `supabase/functions/ler-notas-fiscais/index.ts`
por cima do código antigo (mesma função, só o código muda) — o app já manda arquivos com
`mediaType: "application/pdf"` quando o operador escolhe um PDF, mas só a versão nova da função
sabe montar o bloco de "documento" certo pro Claude; com a função antiga, um PDF simplesmente
falha na leitura.

**Pegadinha real encontrada configurando isso**: o campo "Name" da tela de configuração da função
**é só um apelido visual** — o aviso "Your slug and endpoint URL will remain the same" avisa que
renomear ali **não muda o endereço real** da função. Se deployar com um nome de exemplo (ex:
`smooth-api`) e só depois tentar renomear pra `ler-notas-fiscais`, a função fica com endereço
`smooth-api` mas nome de exibição `ler-notas-fiscais` — descasado do que o app chama via
`supabase.functions.invoke("ler-notas-fiscais", ...)`. **Correção**: apagar e recriar do zero,
digitando o nome certo **antes** do Deploy. Se acontecer de novo criando outra Edge Function,
conferir se o endereço nos exemplos de `curl`/CLI da tela de configurações bate com o nome
esperado, não confiar só no campo "Name".

### Ativar a redefinição de senha esquecida

Depois de rodar a migration `0038` (ver "Reconciliar migrations" acima), **é preciso (re)publicar
a Edge Function** — mesmo que uma função com esse nome já exista publicada, porque o código de lá
hoje é de uma versão mais simples (de uma sessão em paralelo). Não precisa de nenhum secret
configurado (só usa chaves que o Supabase já injeta sozinho em toda função), diferente da
`ler-notas-fiscais`.

1. **Publicar a função** (ou substituir o código de uma já existente): painel do projeto →
   **Edge Functions** → **"Deploy a new function"** →
   **"Via Editor"** → digitar `redefinir-senha-operador` **no campo "Function name" antes de
   clicar em Deploy** (mesma pegadinha da `ler-notas-fiscais`: renomear depois não muda o endereço
   real) → apagar o código de exemplo e colar todo o conteúdo de
   `supabase/functions/redefinir-senha-operador/index.ts` → **Deploy function**.
2. Testar: **Configurações → Operadores → "Redefinir senha"** num operador qualquer (não precisa
   ser ela mesma) — deve aparecer uma senha temporária num modal. Deslogar, entrar com essa senha
   temporária, e confirmar que a tela "Crie uma senha nova" aparece antes de liberar o resto do
   app.

### Ativar o módulo de Fornecedores

Depois de rodar a migration `0039` (ver "Reconciliar migrations" acima) — não precisa de Edge
Function nem secret nenhum aqui, é só testar:

1. Menu lateral → **Fornecedores** (aparece pra quem tem a permissão liberada, ou pra
   admin) → aba "Cadastro", criar um fornecedor de teste → aba "Pedidos de compra", criar um
   pedido com 1-2 itens de peça já cadastrada → "Receber" → confirmar quantidade → conferir que
   apareceu um lançamento novo em Estoque → Movimentações (motivo "Compra") e que o status do
   pedido mudou pra "Recebido".

### Ativar a trilha de auditoria

Só precisa da migration — sem Edge Function, sem secret.

1. **Rodar a migration**: SQL Editor do Supabase → abrir `supabase/migrations/0040_auditoria.sql`,
   copiar tudo, colar numa "New query" → Run.
2. Testar: edite ou exclua algo numa das telas cobertas (ex: editar um Cliente, editar um
   Operador, excluir um Fornecedor) → clique no ícone novo ao lado da engrenagem de Configurações
   (rodapé do menu lateral, só aparece pra admin) → deve aparecer o registro na lista, com "Ver
   detalhes" mostrando o que mudou.

### Gerar o instalador Windows e publicar uma versão nova

Builda automaticamente no GitHub e publica o instalador `.exe` pronto pra baixar — os apps já
instalados se atualizam sozinhos quando sai uma versão nova.

**Passo único (só na primeira vez, já feito)**: `github.com/caranovavidanova/sakura-system-ace` →
Settings → Actions → General → "Workflow permissions" → "Read and write permissions".

**Os secrets `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` não são mais usados pelo build** (desde
a sessão que construiu a tela de conexão, ver seção 7): o instalador não carrega mais a conexão de
empresa nenhuma dentro dele, cada computador escolhe a sua na primeira abertura. Podem continuar
cadastrados no GitHub sem problema — só não fazem mais efeito. **Não voltar a colocá-los no
`release.yml`** sem entender o motivo: embutidos, o instalador entregue a um cliente novo viria
apontando pro banco de dados de outra empresa.

**Toda vez que quiser publicar uma versão nova — jeito atual, preferido, sem a usuária precisar
mexer em nada** (descoberto e validado numa sessão que publicou `v0.9.13` a `v0.9.15` assim
seguidas, sem ela tocar no terminal nem na tela do GitHub nenhuma vez):

1. Atualizar o campo `"version"` do `package.json` (e rodar `npm install` só pra sincronizar o
   `package-lock.json`, que também carrega o número da versão) — commit, PR, merge direto na
   `main`, igual qualquer outra mudança (ver seção 3, fluxo de Git).
2. Depois do merge confirmado, disparar o build **direto por uma chamada de API**, sem precisar de
   `git tag`/`git push` nenhum: `mcp__github__actions_run_trigger` com `method: "run_workflow"`,
   `workflow_id: "release.yml"`, `ref: "main"`. Isso cria a tag/release sozinho (com o nome vindo
   do `"version"` do `package.json`, `v` na frente) e já builda em cima do commit certo.
3. Conferir com `mcp__github__get_release_by_tag` (`tag: "vX.Y.Z"`) até `assets` aparecer com o
   `.exe` e o `latest.yml` — leva uns 5-10 minutos.

**Por que esse é o jeito preferido agora, e não `git tag` + `git push`**: numa sessão do Claude
Code na nuvem (não é a máquina da usuária), `git push` de uma **tag** é bloqueado com erro 403 —
parece trava de segurança proposital do ambiente, não bug de proxy (mas `git push` de **branch**
normal, pra abrir PR, funciona numa boa — só tag é bloqueada). Isso sempre obrigou a usuária a
publicar manualmente pela tela do GitHub (`releases/new`), o que já causou **dois incidentes reais**
de rascunho de release antigo sendo reaproveitado silenciosamente por engano (ver "Empacotamento"
na seção 7, tags `v0.9.10` e `v0.9.12`) — a tela de criar release não distingue "nome de tag novo"
de "nome de tag que já existe como rascunho esquecido de semanas atrás". O gatilho manual
`workflow_dispatch` (adicionado ao `.github/workflows/release.yml` nesta mesma sessão, ao lado do
`push: tags: v*` que já existia) resolve os dois problemas de uma vez: não depende de `git push` de
tag (então funciona de dentro de uma sessão na nuvem) e não passa pela tela de criar release da
usuária (então não tem chance de colidir com rascunho nenhum).

**Detalhe de uso do `workflow_dispatch`**: só funciona disparando com `ref: "main"` — o GitHub só
permite `workflow_dispatch` a partir do arquivo do workflow que está na branch **default**
(`main`); tentar `ref` apontando pra uma tag antiga falha com "Workflow does not have
workflow_dispatch trigger" (porque o arquivo naquele commit antigo não tem esse gatilho ainda). Não
tem problema nenhum disparar sempre por `main` — o `package.json` de lá já está com a versão certa
assim que o passo 1 acima for mesclado.

**Se por algum motivo o `workflow_dispatch` não estiver disponível** (ex: outro repositório que
ainda não tem esse gatilho no workflow) ou se for a própria usuária publicando (ela não tem esse
bloqueio de `git push` de tag, roda numa máquina normal): os dois jeitos antigos continuam
funcionando —
```powershell
git checkout main
git pull origin main
git tag v0.1.4
git push origin v0.1.4
```
(tag tem que bater exatamente com o `"version"` do `package.json`) — ou publicar direto pela tela
do GitHub (`releases/new`, digitar a tag nova, "Publish release"). **Nesse segundo caso**, sempre
checar antes se o nome da tag já foi usado alguma vez no projeto (mesmo que a release tenha sido
apagada depois) — reusar um nome de tag é arriscado (rascunho antigo pode reaparecer, ou o GitHub
simplesmente não disparar o build de novo pra esse nome, ver os dois incidentes documentados na
seção 7); **não existe hoje um jeito confiável de checar isso por API** (`get_release_by_tag` e
`list_releases` não enxergam rascunho não publicado) — na dúvida, pular pro próximo número de
versão em vez de tentar reusar um nome antigo.

O instalador aparece em `github.com/caranovavidanova/sakura-system-ace/releases`. O
Windows/SmartScreen deve avisar "editor desconhecido" (normal sem certificado pago — "Mais
informações → Executar assim mesmo"). PCs já atualizados se atualizam sozinhos na próxima tag.

**Duas pegadinhas já corrigidas** (não devem mais acontecer, mas documentado caso reapareçam): (a)
por padrão o `electron-builder` publica a release como rascunho invisível — corrigido com
`"releaseType": "release"` no `publish` do `package.json`; (b) publicar sem antes atualizar
`"version"` no `package.json` faz o build atualizar a release **anterior** em vez de criar uma nova
(o nome da release vem do `package.json`, não da tag/gatilho usado) — por isso o passo 1 acima é
sempre antes de disparar o build, nunca depois.

## 10. Estado do Git

- Repositório: `caranovavidanova/sakura-system-ace` (era um projeto antigo "Pneus Amigão" em
  Next.js, completamente substituído; o nome do repositório era `amigao` e foi renomeado, além de
  **tornado público** — ver "Auto-update via GitHub Releases não funciona com repositório privado"
  logo abaixo). **Ser público tem uma consequência que já mordeu**: nada de credencial neste
  arquivo nem em qualquer outro commitado; o que já foi colado aqui precisa ser trocado, não só
  apagado (ver "Onde tudo parou", no fim deste arquivo). `main` é o Sakura System — um `git clone` simples
  já traz a versão certa, não precisa trocar de branch.
- **Fluxo de trabalho** (ver decisão na seção 3): cada sessão cria/reusa uma branch de trabalho
  designada pelo ambiente, commita, abre PR contra `main` e **já mergeia direto**, sem esperar
  aprovação manual — enquanto não existir uma v1.0 publicada. O histórico completo de PRs
  (descrição, o que mudou, quando foi confirmado) já fica registrado no próprio GitHub — não
  precisa duplicar aqui PR por PR; o que importa pra uma sessão nova é o **estado atual**, que
  está na seção 7.
- **Episódio "duas linhas de trabalho paralelas" (agosto de 2026)** — vale entender pra não
  repetir: na mesma janela de tempo, a usuária tinha (a) uma sessão de chat (esta) trabalhando
  direto no GitHub, que implementou uma versão simples de Fornecedores + redefinir senha (modal de
  admin) + desfazer pagamento, mesclou na `main` (PR #68) e pediu pra ela rodar a migration e
  publicar a Edge Function no Supabase real — e (b), **sem essa sessão saber**, um trabalho bem
  mais avançado feito **localmente no computador dela via Antigravity** (outra ferramenta de IA,
  fora do Claude Code): mesmo módulo de Fornecedores só que com Pedido de Compra, um módulo de
  Auditoria novo, testes automatizados (`vitest`), formulários inteiros migrados pro padrão
  `react-hook-form`+`zod`, e um design visual novo (tema escuro/neon). Esse trabalho nunca tinha
  sido commitado — só existia solto no computador dela. Quando ela tentou dar `git pull` pra pegar
  o que a sessão (a) tinha mesclado, o Git recusou (com razão) porque isso apagaria o trabalho (b)
  sem commit. Recuperado com `git stash -u` (nada foi perdido) e trazido pra uma branch própria
  (`antigravity-trabalho-local`, criada a partir do commit anterior à mescla da sessão (a), pra o
  `stash pop` encaixar sem conflito nenhum). A usuária decidiu que **o trabalho (b) — Antigravity —
  vira a base principal**; o "desfazer pagamento" (que só existia em (a)) foi portado por cima; os
  conflitos de merge entre as duas branches (`App.tsx`, `types/operador.ts`,
  `ConfiguracoesPage.tsx`, `PROJETO_STATUS.md`, e a migration simples de Fornecedores da sessão (a),
  removida por estar superada) foram resolvidos nesta sessão, sempre priorizando o lado do
  Antigravity. **Lição pra sessões futuras**: se o `git pull`/`git checkout` mostrar uma lista
  grande de arquivos modificados que a sessão não reconhece, é sinal de trabalho feito por fora do
  Claude Code (outra ferramenta, ou direto pela usuária) — nunca descartar, sempre perguntar e
  usar `git stash` antes de qualquer `pull`/`checkout` destrutivo.
- **Branch de trabalho**: `antigravity-trabalho-local` (mesclada na `main`) foi a branch daquela
  sessão específica do episódio acima — sessões seguintes já usam suas próprias branches
  designadas pelo ambiente (padrão: criar/reusar, commitar, abrir PR, mesclar direto), nada fixo.
- `package.json` em `"version": "0.9.30"` — publicada em 11/09/2026, com a `main` em dia e
  **nada esperando tag** (ver "Onde tudo parou", no fim deste arquivo). (Ver "Empacotamento" na seção 7 pro que cada tag trouxe e
  pro detalhe de publicação). O parágrafo abaixo é histórico de uma sessão anterior — a
  lista completa de tags publicadas depois dela, com o que cada uma corrigiu, está em
  "Empacotamento" na seção 7, não aqui). **Quatro tags publicadas de verdade naquela sessão**
  (`v0.9.2`, `v0.9.3`, `v0.9.4`, `v0.9.5` — ela sempre rodou `git tag vX.Y.Z` + `git push origin
  vX.Y.Z` no próprio terminal, o GitHub Actions buildou e publicou o instalador sozinho todas as
  vezes) — decisão tomada nesta sessão de **lançar na loja do pai dela mesmo sem a nota fiscal
  pronta** (fase 1 do plano de expansão, seção 1), em vez de esperar o Focus NFe primeiro como
  planejado antes. Cada tag corrigiu um bug achado testando o lançamento de verdade — ver lista
  completa em "Empacotamento" na seção 7. **Auto-update via `electron-updater` confirmado
  funcionando** — a causa de `v0.9.3` e `v0.9.4` não terem se instalado sozinhas era o repositório
  estar privado (ver item 21 da seção 6); depois de torná-lo público e renomeá-lo pra
  `sakura-system-ace` (item 22 da seção 6), ela fechou e abriu o app já em `v0.9.4` e a `v0.9.5` se
  instalou sozinha, sem precisar baixar o `.exe` manualmente.

## 11. Trabalhando de outro computador

O código (tudo commitado no GitHub) e o banco de dados (Supabase) já são 100% na nuvem — dá pra
continuar em qualquer computador com internet. Dois passos manuais em cada computador novo, porque
nunca ficam salvos no Git (por segurança):

```bash
git clone https://github.com/caranovavidanova/sakura-system-ace.git
cd sakura-system-ace
npm install
cp .env.example .env   # editar com VITE_SUPABASE_URL=https://rlgdjiowvnfzsedehyga.supabase.co
                        # e VITE_SUPABASE_ANON_KEY=<chave anon, em Settings -> API no Supabase>
npm run dev
```

### Onde parou em 02/09/2026 (histórico — o marco mais recente é o de 03/09, logo abaixo)

Três entregas, acumuladas a pedido dela e publicadas juntas na **`v0.9.26`** — ou seja, tudo
abaixo já chega na loja pelo auto-update.

1. **Baixar os XMLs de um mês num `.zip` só**, em Notas Fiscais (pedido dela, pra mandar pra
   contabilidade sem clicar nota por nota) — ver "Notas Fiscais" na seção 7.
2. **Aba Comissões** (pedido do pai dela: "onde cada funcionário vendeu") — nasceu dentro de
   Relações e foi movida pra Funcionários no dia seguinte, a pedido dela; regras e avisos estão em
   "Funcionários" na seção 7. Sem migration.
3. **Duas varreduras seguidas**, pedidas por ela — primeiro de cálculo em geral, depois só da
   parte fiscal. **Doze correções no total** (itens 42 a 46 da seção 6). Da varredura de cálculo,
   as três que mais importam no dia a dia:
   - **Conta a pagar recorrente que vence dia 29/30/31 pulava um mês inteiro** (31/01 ia direto pra
     03/03) e ainda desandava o dia pra sempre. É onde caem aluguel e financiamento.
   - **Nota fiscal emitida à noite era arquivada no mês seguinte** (e saía com a data de amanhã
     pra SEFAZ) — o mesmo bug de fuso do item 34, em três lugares novos.
   - **O desconto do item sumia na NFC-e**: a nota valia mais do que o cliente pagou, e a soma dos
     pagamentos não fechava com o total — rejeição na hora de emitir.

   E da varredura fiscal, as duas que podiam gerar **nota duplicada** (o pior estrago possível
   aqui): a `ref` da emissão sumia quando a espera pela SEFAZ vencia — mesmo com a nota podendo
   ter saído autorizada —, e excluir uma nota autorizada não avisava que ela continua valendo lá
   fora. Junto: alíquota do ISS em branco virava 0% na nota sem ninguém reclamar. O que **não** foi
   mexido, e por quê, está em "O que ainda está frágil na parte fiscal" (seção 8, item 1).

### Onde tudo parou (03/09/2026)

Tudo desta data já está **publicado na `v0.9.27`** e **confirmado por ela rodando na loja** ("tudo
certo" depois do auto-update). Foram duas frentes:

#### 1. A resposta do suporte da Focus NFe chegou

Ela mandou a mensagem que estava preparada e colou a resposta. Duas coisas saíram dali:

1. **NFC-e pra cliente pessoa jurídica está implementada** — `cnpj_destinatario` +
   `indicador_inscricao_estadual_destinatario: "9"`, sem inscrição estadual do destinatário. Ver o
   item 1 de "O que ainda está frágil na parte fiscal" (seção 8) pro detalhe, inclusive as duas
   exceções que o suporte levantou (entrega a domicílio e o limite de R$ 10 mil da UF) e o caso
   que continua saindo sem identificação: PJ sem CNPJ no cadastro.
2. **A suposição sobre o CSOSN 500 caiu** — a Focus NFe **não** completa campo fiscal que a gente
   não manda. Nada quebrou (as notas continuam sendo autorizadas), mas virou pergunta pra
   contabilidade, registrada no item 2 da mesma lista.

#### 2. Três ajustes de tela pedidos por ela

Vieram junto com três fotos da tela da loja, usando o sistema de verdade:

1. **Gráficos de Relações ganharam o período "Anual"** (5 anos), e os cartões do topo ganharam um
   quarto: "Vendas este ano".
2. **A aba Comissões saiu de Relações e foi pra dentro de Funcionários** — ver o módulo
   Funcionários na seção 7 pro desenho e pra consequência de permissão.
3. **O botão de abrir o calendário ficou visível** — era um quadradinho minúsculo dentro do campo
   de data; ganhou tamanho e fundo arredondado. Vale pra todo campo de data do app (é uma regra só
   no `globals.css`), não só o de Comissões onde ela reparou.

Conferidos renderizando os componentes de verdade (`GraficosSection` e `ComissoesSection`) com
dados falsos, pelo caminho de preview descrito no item 6 da seção 6 — não é só leitura de código.

### O que depende dela pra andar (03/09/2026)

Duas coisas esperando ação **fora do código** — nenhuma some sozinha, e nenhuma bloqueia o uso do
sistema hoje:

1. **Trocar três credenciais.** Este arquivo tinha CSC da SEFAZ, token do portal Giap e a senha do
   portal da prefeitura copiados — e **o repositório é público**. Foram removidos do texto, mas
   **continuam no histórico do Git**: o certo é regerar os três (passo a passo no item 1 da seção
   8) e atualizar no painel da Focus NFe. Enquanto não trocar, tratar como expostos.
2. **Perguntar pra contabilidade sobre o CSOSN 500**: com esse código, as peças deveriam levar
   valor de ICMS-ST retido na nota? Virou pergunta em 03/09/2026, quando a Focus NFe confirmou que
   **não** completa sozinha campo fiscal que a gente não manda (a suposição antiga era o
   contrário). As notas continuam sendo autorizadas assim desde agosto, então **não é urgente e
   não é pra mexer às cegas** — detalhe no item 2 de "O que ainda está frágil na parte fiscal"
   (seção 8).

E, todo mês, o de sempre: **cadastrar a alíquota da competência no portal da prefeitura** antes da
primeira NFS-e do mês (item 1 da seção 8) — sem isso a nota é recusada.

**O que ela pediu pra guardar pra "em breve"** (não retomar sozinho, ela sabe que existe):

1. **Crédito da Anthropic zerado** — o "Importar por foto/PDF" pode estar sem funcionar desde
   agosto (ver item 25 da seção 6). É a pendência mais provável de estar atrapalhando no dia a dia.
2. ✅ **Reabrir o PDF (DANFE) de uma nota já emitida — FEITO em 11/09/2026.** O botão "Ver
   DANFE" existe em Notas Fiscais e na aba Fechamento da OS (ver "Notas Fiscais" na seção 7).
   Falta só ela confirmar com uma nota de verdade — a chamada à Focus NFe não dá pra testar aqui.
3. **Cancelar nota deveria estornar estoque/Caixa?** — pergunta de design nunca respondida.
4. **Token Focus NFe compartilhado**, **botão de diagnóstico pra suporte** e o **risco de uma tag
   ruim atualizar todas as lojas de uma vez** — a fila já combinada.
5. Ponta solta pequena: confirmar se o "Testar conexão" da `v0.9.18` funciona de verdade (o app
   funciona de qualquer jeito, porque reprovar no teste não tranca mais ninguém — item 33 da
   seção 6).

**Dois pontos cegos conhecidos, que ela sabe e ficaram de fora de propósito**: o cartão "Contas a
pagar vencendo" do Início soma só o mês corrente (no dia 31 pode mostrar R$ 0,00 com conta vencendo
amanhã); e a conta recorrente, depois de segurar em fevereiro, fica presa no dia 28 (item 43 da
seção 6).

**Estado do código (fim de 03/09/2026)**: `main` em dia, nada esperando publicação — a `v0.9.27` é
a última tag e **ela confirmou que chegou na loja pelo auto-update e está tudo certo**.
`tsc`/`lint`/`npm run contraste` limpos e **149 testes** passando (eram 103 no começo de 02/09 —
quase todos os novos cobrem as contas de dinheiro e de data que estavam erradas, e agora o
destinatário da NFC-e).

### Onde tudo parou (08-09/09/2026)

**1. Corrigir um item já lançado numa OS** — publicado na **`v0.9.28`** e **confirmado por ela
usando na loja**: ela digitou R$120 num alinhamento e num balanceamento que eram R$60, editou
pela tela nova e a OS fechou nos R$ 1.113,00 certos. A lista "Já lançados nesta OS" nunca tinha
tido edição — o único conserto antes era abrir outra OS ou mexer no banco à mão. Desenho
completo, travas e o que ficou de fora: "Ordens de Serviço", seção 7.

**2. O código de ICMS do fornecedor virava o código da peça dela** — descoberto logo em seguida,
quando a NFC-e dessa mesma OS foi recusada com *"Informado CST para emissor do Simples Nacional
[nItem:1]"*. Não tinha relação com a edição: a peça estava cadastrada com um **CST** (regime
normal) porque a importação de nota do fornecedor copiava o código dele direto pro cadastro. Ela
corrigiu a peça à mão e emitiu; o conserto de código veio depois — item 47 da seção 6 tem a
história inteira, inclusive a armadilha de contraste que apareceu no preview.

### Guia de plataformas, custos e telas (10/09/2026, mais tarde no mesmo dia)

**Nada do aplicativo mudou nesta parte da sessão** — a pendência da `v0.9.29` continua exatamente
como está descrita na seção seguinte, que é a que importa ler primeiro.

Ela pediu um documento em PDF, para uma **meta "imaginária" de 10 lojas**: quais plataformas
sustentam o projeto, quanto custa hoje, quanto custaria com 10 lojas — e, junto, uma imagem de
**todas** as telas do sistema com uma explicação de cada uma. O cenário de 10 lojas foi definido
por ela: **4 empresas** (uma com 1 loja, duas com 2 e uma com 5), ou seja 4 projetos Supabase e
10 CNPJs emitindo nota.

**O documento foi entregue como arquivo, não commitado** (41 páginas, 6,3 MB — binário grande não
tem por que entrar no repositório). Se precisar de novo, é só refazer: o texto ficou em
`conteudo.mjs` e a montagem em `montar.mjs`, ambos gerados na hora, fora do repositório.

#### O que ficou no repositório

A ferramenta que já existia para gerar as 5 imagens do site foi estendida para fotografar as **54
telas** do sistema (formulários, abas, janelas de confirmação e as seções recolhíveis de
Configurações — tudo que só aparece depois de clicar em alguma coisa). Ver a descrição de
`site/ferramentas/` na seção 4.

**Está numa branch, não na `main`**: `claude/cool-lamport-uzyh8w`, commitada e enviada, **sem PR
aberto** — diferente do fluxo de sempre da seção 3 (abrir PR e mesclar direto), porque nesta
sessão não houve pedido para abrir PR. **Se ninguém mesclar, esse trabalho fica parado nessa
branch.**

Duas armadilhas que apareceram construindo isso, já resolvidas dentro do gerador, mas que valem
para qualquer teste automatizado de tela no futuro:

1. **Navegar duas vezes para o mesmo endereço não remonta a tela** — muda só o `#`, então o
   formulário aberto na cena anterior continuava aberto na foto seguinte. A solução foi passar por
   uma rota neutra antes de abrir a rota alvo.
2. **O botão das seções recolhíveis contém o título *e* a descrição**, então não casa por texto
   exato — precisa casar por trecho.

Os dados de demonstração (`dados-demo.mjs`) ganharam as tabelas que faltavam — fornecedores,
pedidos de compra, cotações, contas a receber, notas fiscais, auditoria, contagens, configurações
e funcionários completos — e as OS passaram a ter **vendedor e técnico preenchidos**, sem o que a
aba Comissões aparecia vazia.

> **Ideia registrada, não pedida:** essa ferramenta é meio caminho para o teste de tela que falta
> no projeto (item 4 da seção 6 — hoje só há teste de função pura). Ela já abre o app de verdade
> com dados controlados; faltaria comparar o resultado em vez de só fotografar.

#### Os números que saíram (e o quanto confiar neles)

| Cenário | Custo/mês | Por loja |
|---|---|---|
| Hoje (1 loja, Pneus Amigão) | R$ 213,40 | R$ 213,40 |
| 10 lojas, **uma conta só** na Focus NFe | R$ 953,50 | **R$ 95,35** |
| 10 lojas, uma assinatura Focus NFe por empresa | R$ 1.604,50 | R$ 160,45 |

Premissa de volume: 10 carros/dia por loja, 26 dias úteis → ~2.600 OS/mês e ~3.900 notas/mês.
Câmbio US$ 1 = R$ 5,10.

**Três coisas que valem mais que os números:**

1. **A conta única na Focus NFe vale ~R$ 650/mês** nesse cenário. É o argumento financeiro para a
   mudança de "token por loja" para "token compartilhado" que já estava registrada como pendência
   (item 6 da seção 8) — antes ela era justificada por conforto e aparência; agora tem preço.
2. **O custo por loja despenca de R$ 213 para R$ 95** ao sair de 1 para 10 lojas, só por diluição
   de custo fixo. Contra o preço de R$ 350/loja decidido para a fase 2, a margem sobe de 50% para
   ~73%.
3. **O gargalo continua não sendo dinheiro nem código** — é o credenciamento fiscal de cada CNPJ
   novo (certificado digital, SEFAZ, prefeitura, alíquota mensal), que depende da contabilidade do
   cliente e varia por estado e município. O playbook do item 1 da seção 8 continua sendo a peça
   central para crescer, e a recomendação de tratar "usar o sistema" e "emitir nota" como duas
   ativações separadas ficou reforçada.

> ⚠️ **Onde os números são frágeis:** os preços do **Supabase** e da **API da Anthropic** foram
> conferidos nesta sessão. Os da **Focus NFe não** — o site deles é bloqueado pela rede do
> ambiente onde eu rodo, então os valores usados continuam sendo os do levantamento de agosto de
> 2026. Antes de fechar qualquer conta, conferir em `focusnfe.com.br/precos`.

#### O que o sistema precisaria para aguentar 10 lojas

Levantado no documento; nada disso foi construído. Em ordem de peso, os três primeiros são os que
mais importam antes da terceira empresa:

1. **Token da Focus NFe compartilhado** (já era pendência conhecida — agora com preço).
2. **Publicar versão nova em etapas.** Hoje uma tag atualiza **todas** as lojas ao mesmo tempo,
   automaticamente. Com uma loja isso é ótimo; com dez lojas de terceiros, uma versão ruim vira
   dez telefonemas simultâneos. Já estava na fila combinada dela ("risco de uma tag ruim atualizar
   todas as lojas de uma vez") e este levantamento reforçou.
3. **Backup do banco** — consequência de sair do plano grátis do Supabase (ver a linha corrigida
   na seção 3).
4. Botão de diagnóstico para suporte (já estava na fila dela) e algum aviso de que uma loja
   **parou** de emitir nota — hoje só se descobre quando ligam.
5. RLS por módulo (item 1 da seção 6) e teste de tela (item 4) — as duas dívidas conhecidas que
   mudam de gravidade quando o sistema roda na loja dos outros.

### Onde parou em 10/09/2026 (histórico — o marco mais recente é o de 11/09, no fim do arquivo)

> A `v0.9.29` que esta seção dá como pendente **foi publicada em 11/09/2026**, com o "sim" dela.

**A `v0.9.29` está pronta pra sair e NÃO foi publicada, por decisão dela.** A correção do item 2
de "Onde tudo parou (08-09/09/2026)" — o código de ICMS do fornecedor virando o código da peça —
já está mesclada na `main`, validada (`tsc`/lint/contraste limpos, 176 testes passando na época)
e com as duas telas conferidas por preview renderizado — só falta a tag. Ela pediu pra segurar:
*"ainda nao, deixa pendente, atualiza o projeto status, volto em outra sessao"*.

**Quando ela retomar, o primeiro passo é perguntar se é pra publicar** — e, se sim, seguir "Gerar
o instalador Windows e publicar uma versão nova" (seção 9): subir o `package.json` pra `0.9.29`,
PR, merge, `workflow_dispatch` com `ref: "main"`. **Não publicar sozinho.** Enquanto isso, o
computador da loja continua na `v0.9.28`, ou seja: **a edição de item já está lá, mas o aviso de
código fiscal e a correção da importação ainda não.**

**Uma ponta solta, não bloqueia nada:**

1. **Auditoria não cobre `ordens_servico_itens`** — agora que dá pra mexer em valor de item, essa
   tabela virou candidata natural ao trigger da migration `0040`. Migration pequena, no mesmo
   padrão, **oferecida e não pedida** (exigiria ela rodar SQL no Supabase, e a edição funciona sem
   isso).

**✅ O resto do cadastro de peças foi conferido e está limpo (10/09/2026).** A dúvida era se outras
peças importadas antes da correção também estariam com CST guardado, prontas pra recusar uma nota
na primeira venda. Ela rodou no SQL Editor:

```sql
select descricao, cst_ou_csosn
from pecas
where ativo and (cst_ou_csosn is null or length(trim(cst_ou_csosn)) <> 3);
```

**Zero linhas** — toda peça ativa está com um CSOSN de 3 dígitos. A `BIEL SUSP GM DT ACO LD/LE`
era a única, e já foi corrigida à mão. **Não reabrir esse assunto**; a consulta fica aqui só como
receita, caso um dia entre peça de fornecedor novo por uma versão antiga do app (`pecas` é
compartilhada entre lojas, então ela cobre o cadastro inteiro de uma vez).

### Onde parou em 11/09/2026, de manhã (histórico — o marco mais recente está no fim do arquivo)

> A `v0.9.29` que esta seção dá como pendente **foi publicada** mais tarde no mesmo dia, com o
> "sim" dela. A migration `0048` continua pendente. O resto desta seção segue valendo como
> registro do que foi feito na Etapa 1 do guia.

#### O que aquela sessão fez

Ela trouxe um **guia de melhorias** — que a partir de 11/09/2026 está **commitado na raiz do
repositório, em `MELHORIAS.md`**, pra a próxima sessão não depender de ela anexar de novo. Ele
**não** é carregado sozinho (não entrou nos `@imports` do `CLAUDE.md`): são 227 KB, e gastar isso
de contexto em toda sessão atrapalharia mais que ajudaria — abrir só quando ela citar um item pelo
código ou pedir sugestão de próximo passo. Foi gerado fora daqui, a partir do
`PROJETO_STATUS.md`, do PDF das 54 telas e de uma pesquisa de mercado/acessibilidade, e traz 12
eixos transversais, as 54 telas uma a uma, 15 funcionalidades novas e um roteiro em 5 etapas. **É um
cardápio, não ordem de execução.** Ela escolheu a **Etapa 1 — "fundação barata que protege tudo o
resto"**, que são cinco itens curtos cujo objetivo é parar de deixar erro conhecido voltar.
Os cinco saíram, e o detalhe técnico de cada um está nos **itens 48, 49 e 50 da seção 6**:

- **CI** (`TR-07.1`) — as cinco checagens que antes eram rodadas à mão agora rodam em todo push e
  PR. Item 48.
- **Trava de fuso** (`TR-05.5`) — regra de lint contra cortar o dia de um timestamp em UTC, mais a
  suíte rodando nos dois fusos. Item 48.
- **Teste de arquitetura** (`TR-06.2`) — reprova conta de dinheiro escrita dentro de tela. Item 49.
- **Tipos de coluna de dinheiro** (`TR-05.3`) — auditoria feita, **um bug real encontrado e
  corrigido**, migration `0048`. Item 49.
- **Varredura de segredo** (`TR-04.7`) — `gitleaks` no CI com regras próprias, `.gitignore`
  fechado pra certificado digital, e a regra "nenhuma credencial neste arquivo" promovida pro topo
  deste documento. Item 50.

Junto disso, a branch `claude/cool-lamport-uzyh8w` (o gerador do catálogo das 54 telas, parada sem
PR desde 10/09) foi mesclada — PR #226. Dois itens do guia dependiam dela pra existir.

#### O achado que vale contar

A auditoria de tipo de coluna começou como uma conferência chata e **achou um bug de dinheiro de
verdade**: ao faturar uma OS escolhendo "a receber depois", o valor gravado em Contas a Receber
vinha de uma soma sem arredondamento, e a coluna aceitava qualquer número de casas decimais — um
`1234.5600000000002` era gravado com as 13 casas. Não dava erro, não aparecia na tela (a exibição
formata em 2 casas). Corrigido nos dois lados: a soma agora fecha no centavo, e a coluna passa a
arredondar sozinha. Detalhe completo no item 49 da seção 6.

Descobriu também que a **mesma** expressão de arredondamento estava copiada **12 vezes em 7
arquivos** — a quarta ocorrência do padrão "conta de dinheiro repetida acaba divergindo" (itens 35,
40 e 44). Virou `src/schemas/dinheiro.ts`, com a aritmética **idêntica** de propósito: mudar regra
de arredondamento altera valor de nota fiscal, e isso é decisão dela.

#### Estado do código

`main` em dia. `tsc`, lint e `npm run contraste` limpos, e **275 testes** passando **nos dois
fusos** (eram 176 num fuso só). A sequência inteira de migrations foi rodada três vezes num
Postgres local, do zero, sem erro.

#### O que dependia dela naquele momento (a lista atualizada está no fim do arquivo)

1. ✅ **Dizer se publica a `v0.9.29`** — disse que sim mais tarde no mesmo dia; publicada.
2. **Rodar a migration `0048`** no SQL Editor (seção 9).
3. **Marcar o CI como obrigatório pra mesclar**, em Settings → Branches — mas só **depois** de ver
   ele verde algumas vezes, pra não travar o fluxo de mesclar direto na `main`. Item 48.
4. **As três credenciais expostas continuam para trocar** (CSC da SEFAZ, token do portal Giap,
   senha do portal da prefeitura). A varredura nova **não** substitui isso: ela pega chave de API
   com formato reconhecível, e nenhuma das três tem formato — item 50 explica por quê. Continua
   sendo uma tarde dela, e cada dia que passa é um dia a mais com os três no histórico público.
5. E, todo mês, o de sempre: **cadastrar a alíquota da competência no portal da prefeitura** antes
   da primeira NFS-e do mês (item 1 da seção 8).

#### Da Etapa 1 do guia, o que ficou de fora por escolha

O guia sugeria, dentro do `TR-05.3`, passar **toda** conta intermediária de dinheiro pra centavos
inteiros, reescrevendo `faturamento.ts`, `metricasCaixa.ts` e `comissoes.ts`. **Não foi feito**, e
não por falta de tempo: é refatoração grande no código financeiramente mais sensível do projeto,
para um ganho que hoje é teórico — essas funções já arredondam em cada borda, e a partir da `0048`
as colunas também. A recomendação registrada é só fazer isso se aparecer uma divergência real, com
o caso concreto na mão. Se ela quiser fazer de qualquer forma, é uma sessão inteira, não um item
curto.

### Onde parou em 11/09/2026, à tarde (histórico — o marco mais recente está no FIM do arquivo)

> Esta seção era o "leia primeiro" até o fim daquele dia. A frase "nada pendente do meu lado"
> valia só naquele momento — depois dela saíram quatro itens da Etapa 2 que **não foram
> publicados em tag**. O estado de verdade está no último marco, no fim do arquivo.

**Naquele momento: nada pendente do meu lado nem do banco. Duas tags publicadas, esperando só o
teste dela na loja.**

1. ✅ **`v0.9.29` publicada** — aviso de código fiscal pelo nome da peça + correção da importação
   de XML do fornecedor.
2. ✅ **Migrations `0048` e `0049` rodadas por ela** no SQL Editor, as duas com "Success. No rows
   returned" — e a `0049` **antes** da tag, que era a ordem obrigatória. Nada pendente de SQL:
   `0001` a `0049` estão todas aplicadas.
3. ✅ **`v0.9.30` publicada e INSTALADA por ela** no mesmo dia ("pronto, instalado a nova
   versao") — "Ver DANFE" e aviso da alíquota do mês.

**O que falta é confirmação de uso real**, não código — e é só isso que sobrou desta sessão:

- **Abrir o "Ver DANFE" numa nota de verdade** (Notas Fiscais → uma nota emitida pelo sistema, ou
  OS → aba Fechamento). É a única parte que não dá pra testar daqui: a busca do PDF fala com a
  Focus NFe, e este ambiente não alcança rede externa. Se der errado, **a mensagem na tela já diz
  o motivo** — e o primeiro lugar pra olhar é se o token da Focus NFe está preenchido em
  Configurações → Dados fiscais.
- **O aviso da alíquota no Início — ele APARECE agora, e isso está certo.** A coluna
  `competencia_aliquota_confirmada` nasce vazia com a migration `0049`, e o "se cala sozinho
  depois de uma NFS-e autorizada" só vale pras notas emitidas **daqui pra frente** — as de
  setembro saíram antes desse código existir. Então, na primeira abertura depois de atualizar, o
  aviso de setembro está lá mesmo com a alíquota já cadastrada no portal. O caminho é clicar em
  **"Já cadastrei"** (é verdade: ela cadastrou em 01/09) e ele some até 1º de outubro. **Não
  tratar isso como bug** — é só o primeiro mês, que começa sem histórico.

#### O que esta sessão fez

Dois itens da **Etapa 2** do guia de melhorias (`MELHORIAS.md`), escolhidos por ela — os dois da
área fiscal, que é onde o balcão mais sente:

- **`TR-11.1` — "Ver DANFE" de uma nota já emitida.** Era o item nº 2 da lista dela de "guardar
  pra em breve", desde 03/09. O PDF da nota só existia dentro da janela de emissão: fechou,
  acabou, e reabrir só entrando no painel da Focus NFe — sendo que o cliente voltar e pedir a nota
  de novo é o pedido mais comum que existe num balcão. Agora tem botão em Notas Fiscais e na aba
  Fechamento da OS. Detalhe em "Notas Fiscais", seção 7.
- **`TR-11.2` — aviso da alíquota da competência.** Toda primeira NFS-e do mês é recusada até a
  alíquota daquele mês ser cadastrada no portal da prefeitura — armadilha mensal, conhecida, com
  data e consequência certas, que já custou uma manhã. O Início passou a avisar antes, com o passo
  a passo e um botão "Já cadastrei". Detalhe em "Início", seção 7. Precisou da migration `0049`.

#### Duas decisões que valem mais que o código

1. **O PDF da nota continua NÃO sendo guardado aqui.** O que o sistema guarda é o XML — que é o
   documento que a lei manda guardar por 5 anos. O "Ver DANFE" pede o PDF de volta pra Focus NFe
   pela referência da migration `0046`. Guardar o PDF também seria duplicar arquivo, gastar
   Storage e criar uma segunda fonte de verdade pra mesma nota.
2. **O aviso da alíquota se cala sozinho quando a prefeitura autoriza uma NFS-e no mês.** Se ela
   autorizou, a alíquota está cadastrada — continuar avisando seria barulho, e aviso que vira
   barulho é aviso que a pessoa aprende a ignorar. O botão "Já cadastrei" existe pro caso de ela
   cadastrar antes de emitir a primeira nota, que é justamente o caminho certo.

#### O que NÃO dá pra confirmar daqui

As duas funcionalidades conversam com a Focus NFe/prefeitura, e o ambiente onde eu rodo não
alcança rede externa (item 6 da seção 6). Então: a regra de quando dá/não dá reabrir o PDF está
testada, as duas telas foram conferidas **renderizadas de verdade** (inclusive o caminho de
falha), mas **a busca do PDF em si e o comportamento com a prefeitura só ela confirma na loja** —
depois de rodar as migrations e receber a `v0.9.30`.

#### Estado do código

`main` em dia, `v0.9.29` publicada. `tsc`, lint e `npm run contraste` limpos; **296 testes**
passando **nos dois fusos** (eram 275). A instalação completa foi rodada três vezes do zero num
Postgres local e a `0049` sozinha duas vezes num banco com dado plantado.

#### O que depende dela agora

1. **Confirmar em uso real** o "Ver DANFE" numa nota de verdade (o aviso da alíquota, pelo
   motivo acima, só se testa de verdade em 1º de outubro). A instalação da `v0.9.30` já está
   confirmada.
3. **Marcar o CI como obrigatório pra mesclar** (Settings → Branches), só depois de vê-lo verde
   algumas vezes — item 48 da seção 6.
4. **As três credenciais expostas continuam para trocar** (CSC da SEFAZ, token do portal Giap,
   senha do portal da prefeitura) — item 50 da seção 6.
5. E, todo mês, o de sempre: **cadastrar a alíquota da competência no portal da prefeitura** antes
   da primeira NFS-e do mês — que agora, pelo menos, o sistema lembra.

### ⏸ O ponto exato onde parou (11/09/2026, fim do dia) — LEIA ISTO PRIMEIRO

**Os três itens `P0` da Etapa 2 do guia saíram e estão na `main`. Nada foi publicado em tag** —
o computador da loja segue na `v0.9.30`, então nada disso chegou lá ainda. **Perguntar a ela se é
pra publicar** antes de mexer em versão (ver "Gerar o instalador Windows", seção 9).

Os três são de ergonomia de balcão, e o fio comum é o mesmo: o app foi desenhado pra ser usado só
de teclado, e faltava a outra metade disso.

1. **`TR-02.2` — foco de teclado visível** em todo campo, botão e link (PR #233).
2. **`TR-02.3` — foco preso dentro do modal**, com `Esc`, devolução do foco e fundo inerte
   (PR #233).
3. **`TR-02.1` — alvos de clique de 32px nas listas**, com o "Excluir" saindo da linha pra um
   menu de três pontinhos (PR #234).

O que cada um faz está em "Estado atual por módulo" (seção 7, no começo, junto dos outros
comportamentos globais); o que se aprendeu está nos itens **51 e 52** da seção 6.

**Uma pergunta aberta pra ela**, que é decisão de gosto e não de código: "Editar" e "Inativar"
viraram **ícone** nas listas (com o nome aparecendo no balãozinho do mouse), que é o que o guia
pedia. Se ela achar melhor manter a **palavra escrita** na linha, é trocar uma palavra por lista.
Vale mostrar uma tela pra ela antes de publicar tag.

**Como foi validado**: além de `tsc`, lint, os 296 testes nos dois fusos e o `npm run contraste`,
as duas mudanças foram dirigidas **no Electron real** (Playwright + `xvfb`, renderizando os
componentes de verdade) — 13 verificações no foco/modal e 14 nas ações de linha. Foi esse teste
que pegou o bug do item 52, que a leitura do código tinha deixado passar.

**O que continua pendente é o mesmo de antes** (a lista logo acima): confirmar o "Ver DANFE" numa
nota de verdade, marcar o CI como obrigatório, trocar as três credenciais expostas e cadastrar a
alíquota da competência todo mês.

**Também saiu, logo depois dos três**: `TR-01.1` — a **escala tipográfica** (PR #236). O tamanho
de fonte deixou de ser escolhido tela a tela: 756 classes cruas em 89 arquivos viraram tokens com
nome por papel, e o menor texto do app subiu de 12 pra 13px (nada encolheu). O que cada token
significa está em "Estado atual por módulo"; as três lições, no item **53** da seção 6 — entre
elas, que **a premissa do guia estava errada** sobre o tamanho das tabelas, e que o `TR-02.1`
tinha quebrado em silêncio o gerador do catálogo de telas.

**Da Etapa 2, ainda não foram feitos**: `TR-01.3` (auditoria de contraste WCAG), `TL-04` (cartões
e calendário do Início), `TL-08` (cadastrar cliente sem sair da OS), `TL-11`/`TL-12` (estoque
mínimo e campos fiscais), `TL-27` (categoria obrigatória no caixa) e `FN-03` (WhatsApp). Ela
escolhe o próximo pelo código do item — não sair fazendo a lista inteira.
