# Sakura System — AutoCenter Edition — Estado do Projeto

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
> prefira a data (o rodapé "Onde tudo parou" no fim da seção 8 é o marco mais recente) ou o número
> da versão publicada. Vale uma limpeza dessas expressões quando sobrar tempo.

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
- Checkbox/rádio usam `accent-color` na paleta do app; ícone do calendário em `input[type=date]`
  tem filtro de cor pro tom roxo. **Não mexido de propósito**: a seta do `<select>` continua
  nativa (os ~15 selects do app têm paddings variados, arriscaria desalinhar sem conferir cada um
  visualmente).
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
| Plano do Supabase por empresa cliente (28/08/2026) | **Pro desde a primeira venda** (~R$145/mês por empresa, já dentro da conta do R$350/loja) | O plano grátis não guarda cópia de segurança automática — perder o dado de uma loja de terceiro seria muito pior que esse custo. O grátis também tem teto baixo de projetos por organização e pausa sozinho após dias sem uso |
| Instalação de empresa nova | Um arquivo SQL único (`supabase/instalacao/instalacao-completa.sql`, gerado por `npm run gerar-instalacao`) + o checklist `supabase/instalacao/INSTALAR-LOJA-NOVA.md` | Colar as ~47 migrations uma por uma era o maior risco operacional da venda: pular uma ou trocar a ordem não dá erro na hora, só quebra depois na tela do app. Ver itens 36 e 37 da seção 6 |
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
│   │                             # de rolagem 100% customizada, ver seção 2), LojaSwitcher.tsx
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
│   │   funcionarios/   # FuncionarioForm.tsx (orquestrador enxuto, ~140 linhas) com abas "Dados
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
│   │                   # custo de serviço também, não só de peça)
│   ├── schemas/                  # esquemas zod de validação de formulário + funções de mapeamento
│   │                             # form↔banco (ex: funcionario.ts — paraValoresFormulario,
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
├── supabase/migrations/          # SQL numerado sequencialmente (0001 a 0047), todas idempotentes
├── supabase/instalacao/          # instalacao-completa.sql (as 47 migrations concatenadas num
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
├── build/icon.png                # ícone do app (1024x1024, gerado a partir de public/sakura-icon.svg)
├── scripts/gerar-instalacao-completa.mjs # `npm run gerar-instalacao` — regera
│                                  # supabase/instalacao/instalacao-completa.sql a partir das
│                                  # migrations. Rodar SEMPRE que criar uma migration nova; o
│                                  # `npm test` reprova se o arquivo estiver desatualizado
│                                  # (scripts/gerar-instalacao-completa.test.ts)
├── scripts/varredura-contraste.mjs # `npm run contraste` — procura combinação de fundo/letra
│                                  # ilegível nas classes do app (sobra do tema claro antigo), ver
│                                  # item 17 da seção 6
├── .github/workflows/release.yml # builda + publica o instalador Windows no GitHub Releases quando uma tag "v*" é enviada
│                                  # (NÃO embute mais a conexão do Supabase — ver seção 7)
├── eslint.config.js              # flat config do ESLint 9
├── vitest.config.ts              # config de teste separado do vite.config.ts de propósito (não
│                                  # carrega os plugins do Electron, que não fazem sentido numa
│                                  # rodada de teste unitário puro) — `npm test` roda uma vez,
│                                  # `npm run test:watch` fica observando arquivo mudar. Testes
│                                  # ficam ao lado do arquivo testado (`<arquivo>.test.ts`), não
│                                  # numa pasta `__tests__` separada.
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
  pelo cabeçalho do documento de garantia.
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
   montar e não foi feito ainda). **59 testes**, todos passando. Achou e corrigiu de brinde um bug
   real de arredondamento de ponto flutuante em `calcularValorCobrado` (`100 * 1.1` podia sair
   `110.00000000000001` em vez de `110`).
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
  Edge Function.
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
  definida pra atacar isso.
- **Ordens de Serviço**: cada OS tem um número sequencial **por loja** (`numero`, 1/2/3...,
  atribuído por trigger no insert) — é como a OS é identificada em toda tela ("OS 12"), nunca mais
  o UUID cortado. Status simplificado pra só 3 etapas: **em_andamento** (nasce assim direto, sem
  "aberta" separada) → **concluída** → **faturada**. Form em duas colunas, reabre pra editar (só
  permite acrescentar itens, não editar/remover item já lançado — evita desfazer baixa de estoque).
  **Acrescentar item só funciona até a OS estar "faturada"** (numa sessão posterior, ver item 31 da
  seção 6) — depois de faturada, o "+ adicionar item" some e a peça/serviço esquecido vira uma OS
  nova; faturar (o botão "Confirmar faturamento") agora pede confirmação explícita antes, avisando
  que essa trava passa a valer.
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
  lançamento de Caixa, soma precisa bater com o total antes de confirmar; parcelamento só é
  permitido quando é uma forma só), e deixa escolher entre "Recebido agora" (lança a Entrada no
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
- **Funcionários**: cadastro RH completo (documentos, endereço, cargo/admissão, família/filhos,
  abas "Dados gerais"/"Família"). Todo operador ganha um `funcionarios` espelhado automaticamente.
  **Formulário refatorado nesta sessão** pro padrão novo `react-hook-form` + `zod` (ver "Padrão de
  formulário" na seção 4) — primeiro do app nesse estilo, orquestrador caiu de 601 pra ~140 linhas,
  campos organizados em `campos/*Fields.tsx` por grupo. Comportamento pro usuário final não mudou
  em nada (mesmos campos, mesma validação de "Nome obrigatório").
- **Caixa Diário**: abas Diário (tudo — OS faturadas + manual) / Entradas / Saídas (só
  lançamentos manuais, com categoria opcional via `categorias_caixa`). Card de "Lucro do dia" +
  resumo por forma de recebimento.
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
  (Supabase Storage), vínculo opcional com uma OS. Botão "Versão para o cliente" interpreta o XML
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
- **Relações** (ex-"Relatórios", label mudou antes; agora também absorveu o módulo antigo
  "Lucratividade" — um módulo só, com abas): aba "Gráficos" — gráfico de barras (Vendas x Custos x
  Lucro, Diário/Semanal/Mensal) + radar comparando o período atual com o anterior, sem biblioteca
  externa de gráficos, paleta categórica própria (verde/laranja/violeta); aba "Lucratividade" —
  margem por peça/serviço, período filtrável.
- **Início**: 3 cartões de tendência personalizáveis (Configurações → "Cartões do Início", padrão
  Vendas/Lucro/Ticket médio, sem gráfico — só valor + seta), calendário do mês com feriados
  nacionais + aniversário de cliente + contas a pagar vencendo/vencidas, seção "OS abertas" e
  "Veículos no pátio" (com ícone por tipo/cor).
- **Configurações** (admin): Operadores (sempre visível, com "+ Novo operador", e agora um
  multi-select de lojas dentro do form, só aparece com 2+ lojas cadastradas), Lojas (novo card,
  sempre visível — criar/editar nome-cidade-UF/inativar lojas; **excluir de verdade** também é
  possível, mas só funciona com a loja "vazia" — sem estoque/caixa/OS/funcionários vinculados; com
  dado de negócio, o app explica e sugere inativar em vez de excluir), e seções recolhíveis — Juros
  de parcelamento, Categorias de produto, Categorias de serviço, Categorias de caixa, Texto de
  garantia, Dados fiscais da loja, Cartões do Início (essas últimas 4, junto com Juros, agora são
  **por loja** — ver seção 5).
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
  Fluxo confirmado funcionando de ponta a ponta tanto pelo terminal (`git tag vX.Y.Z` + `git push
  origin vX.Y.Z`) quanto pela tela do GitHub (criar a release digitando a tag nova) — o GitHub
  Actions builda e publica o instalador sozinho nos dois casos (~5-10 min). A versão aparece
  pequena no canto inferior direito do app (`VersaoApp.tsx`) em toda tela, inclusive login —
  só passou a funcionar de verdade a partir da `v0.9.4`.
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

1. **Parte fiscal — ✅ RESOLVIDA (27/08/2026), NÃO precisa ler o histórico abaixo pra saber o
   estado atual**: **NFC-e (peça) e NFS-e (serviço) emitem de ponta a ponta em produção**, as duas
   já testadas com sucesso de verdade. O que uma sessão nova precisa saber, sem arqueologia:
   - **NFC-e**: CNPJ credenciado na SEFAZ-SP, CSC + ID Token de **produção** gerados e cadastrados
     na Focus NFe. Falta só o CSC/ID Token de **homologação** (servidor de teste da SEFAZ-SP nunca
     respondeu — `ERR_CONNECTION_TIMED_OUT` — não bloqueia nada, só serve pra testar sem gerar nota
     real; tentar de novo no portal `www.nfce.fazenda.sp.gov.br/NFCePortal/` → Gerenciar Cód
     Segurança → "ambiente de testes" quando precisar).
   - **NFS-e**: token da prefeitura de Araraquara (portal Giap) gerado e cadastrado, código CNAE da
     loja preenchido em Configurações → Dados fiscais. Sem pendência conhecida.
   - **Risco em aberto, não bloqueante**: o CSOSN `'500'` usado no cadastro de peças (Simples
     Nacional) foi um valor de hábito da usuária, nunca confirmado pela contabilidade como correto
     pra todo produto — vale revisar o catálogo antes de emitir em volume real (ver bloco "CST" mais
     abaixo pro contexto completo).
   - Token de **produção** da Focus NFe (NFC-e e NFS-e) já está configurado e em uso — não é mais
     "não colocar até validar", já foi validado.
   - Tudo daqui pra baixo (o resto deste item 1) é o **histórico de como se chegou até aqui** —
     útil se algo quebrar e for preciso entender uma decisão passada, mas não é leitura obrigatória
     pra continuar o projeto. Candidato a ser resumido/podado numa limpeza futura do arquivo.

   **Assinado nesta sessão** — a usuária criou a conta pelo celular
   (estava fora de casa) e me passou o **token de homologação** (via print de tela, achado em
   Painel API → Empresas → editar a empresa → "Token Homologação"). **A emissão de verdade foi
   implementada nesta sessão** (`emitirNFCe()`/`emitirNFSe()` em `lib/focusNfe.ts`, substituindo a
   "casca" que só tinha auth/URL por ambiente) — o formato do corpo da requisição foi confirmado
   contra os exemplos oficiais do repositório `github.com/FocusNFe/javascript` (não foi
   "chutado"), já que `doc.focusnfe.com.br` continua bloqueado pra acesso automatizado neste
   ambiente. Fluxo completo: `EmitirNotaFiscalModal.tsx`, aberto pelos botões "Emitir
   NFC-e"/"Emitir NFS-e" na aba Fechamento da OS (que antes só mostravam uma pré-visualização) —
   emite, espera a SEFAZ/prefeitura autorizar (a emissão é assíncrona, o app consulta em polling
   por até ~30s), baixa o XML que a Focus NFe hospeda e grava na mesma tabela/Storage das notas
   enviadas manualmente (`notas_fiscais_arquivos`, `origem="automatica"` — reaproveita a tela de
   Notas Fiscais já existente). NFS-e precisa de 4 dados novos por loja (código IBGE do município,
   item da lista de serviço LC 116 — padrão `"14.01"`, cobre "manutenção e conservação de
   veículos" —, alíquota do ISS, código tributário do município se a prefeitura exigir) —
   migration `0044` (**já rodada e confirmada por ela no Supabase real**), campos em Configurações
   → "Dados fiscais da loja"; o código do município do **cliente** (tomador da NFS-e) é pedido na
   hora da emissão, não fica salvo em lugar nenhum.
   **Testado por ela nesta sessão, em homologação, pela primeira vez — três achados, nessa
   ordem**:
   1. `Failed to fetch` logo na primeira tentativa (NFS-e) — bug real de arquitetura, **corrigido**:
      `fetch()` direto da tela do Electron é bloqueado por CORS (a API do Focus NFe não libera
      chamada de navegador, só servidor-a-servidor). Corrigido roteando a chamada pelo processo
      principal do Electron via IPC (`electron/main.ts` → `http:fetchComAuth`, repassado por
      `electron/preload.ts` → `window.sakuraApp.fetchComAuth`, usado em `lib/focusNfe.ts`). Ver
      item 29 da seção 6 pro detalhe completo — lição válida pra qualquer integração externa
      futura chamada direto da tela, não só Focus NFe.
   2. Depois do fix acima, próximo erro: `Parâmetros "prestador.cnpj" ou "prestador.cpf" não
      informados` — **não era bug**, o campo CNPJ em Configurações → "Dados fiscais da loja"
      (a seção de cima, não a de NFS-e) estava vazio. Ela preencheu (`66.217.744/0001-70`) e
      salvou.
   3. Próximo erro, ainda tentando NFS-e: `Empresa ainda não habilitada para emissão de NFSe, por
      favor contate o suporte técnico` — **também não é bug do sistema**, é a própria Focus NFe
      avisando que a empresa dela ainda não tem NFS-e liberada na plataforma deles pra Araraquara
      (diferente da NFC-e, que segue um padrão nacional único da SEFAZ, a NFS-e depende de
      credenciamento específico por município do lado da Focus NFe).
   **Atualização de uma sessão posterior**: a conta da Focus NFe estava em **modo teste
   grátis** e bateu no limite de emissões de teste (mensagem de falta de crédito ao tentar
   emitir) — ela **assinou o plano pago** (contrato 265740, confirmado ativo no painel "Minha
   Conta" da Focus NFe, emitente CNPJ 66.217.744/0001-70 "Amigao Pneus e Servicos Automotivos
   Ltda"). Testando **NFC-e** pela primeira vez depois da assinatura (em homologação, mesmo
   `npm run dev` — essa parte do código ainda não foi publicada em nenhuma tag), veio o mesmo
   tipo de erro que já era conhecido só da NFS-e: **"Empresa ainda não habilitada para emissão
   de NFCe, por favor contate o suporte técnico"** — ou seja, **as duas** (NFC-e e NFS-e) estão
   travadas no mesmo ponto agora, não só a NFS-e como se pensava antes. Confirmado que não é bug
   do sistema: o modal mostra a mensagem de erro real vinda da própria Focus NFe (mesmo padrão de
   sempre — nunca esconder o erro real, ver item 11/24 da seção 6), e a assinatura paga por si só
   não habilita a emissão — é um cadastro à parte que a Focus NFe faz olhando CNPJ/UF/município.

   **Atualização de uma sessão ainda mais recente — habilitação resolvida, dois bloqueios novos e
   mais específicos encontrados**: ela abriu um chamado de suporte da Focus NFe (não é o chat, é
   "Novo suporte" dentro do próprio painel) pedindo a habilitação das duas — a resposta do suporte
   (Natan Coelho) explicou que a habilitação **não é feita pelo suporte**, é self-service: painel
   da Focus NFe → **Empresas → (a empresa) → Documentos Fiscais** → tem uma lista (NFe, NFCe,
   NFCom, DCe, NFSe, CTe, MDFe etc.) e cada uma tem um interruptor pra ligar. Ela achou a tela,
   ligou **NFCe** e **NFSe** (ficaram com a bolinha laranja, diferente das outras cinza/desligadas)
   — **confirmado que resolveu o erro de "empresa não habilitada"** nas duas. Testando de novo,
   apareceram dois erros **novos e diferentes**, um pra cada tipo de nota — não são mais o mesmo
   bloqueio, são dois problemas reais e separados:
   - **NFC-e — CST/CSOSN — RESOLVIDO**: rejeição da SEFAZ *"Informado CST para emissor do Simples
     Nacional (CRT=1 ou 4)"* no item testado (peça "PNEU 175/70R14-ROVELLO RHP-A68", código interno
     `7`). Não era bug do sistema: a loja é Simples Nacional, que exige código **CSOSN** no campo
     de tributação da peça (não **CST**, que é só pra regime normal) — o cadastro dessa peça
     específica estava com o código errado pro regime. **Descoberto no caminho**: `Estoque →
     Produtos` nunca teve edição, só cadastro — sem isso não dava nem pra corrigir esse campo pela
     tela. **Construído nesta sessão**: edição de produto (mesmo padrão já usado em Clientes —
     `paraValoresFormulario`/`atualizarPeca`/botão "Editar" na lista; o campo "Qtde. estoque
     inicial" some ao editar, ajuste de estoque continua só por Movimentações/Contagem) — já
     mesclado na `main`, ainda **não publicado em tag** (pra usar a tela é preciso `npm run dev`).
     **Correção do dado em si já foi feita direto no banco** (ela não estava no PC, então rodou um
     `update` no SQL Editor do Supabase em vez de esperar poder usar a tela nova): a usuária usou o
     CSOSN `'500'` ("ICMS cobrado anteriormente por substituição") por ser o que ela sempre digitava
     no sistema antigo de cabeça — **não foi confirmado com a Rafaela/contabilidade**, é só um valor
     de hábito, não uma validação fiscal de verdade. **Confirmado que resolveu o erro da SEFAZ**
     (que só rejeita CST/CSOSN incompatível com o regime, não confere se é o código correto pra
     aquele produto específico): o próximo teste já não repetiu esse erro, passou pro bloqueio
     seguinte (IBS/CBS, abaixo). **Risco em aberto**: `'500'` é o CSOSN certo só quando o produto
     tem ICMS-ST de verdade — pode não ser o código certo pra toda peça do catálogo; vale confirmar
     com a contabilidade caso apareça alguma rejeição fiscal diferente no futuro, ou revisar o
     cadastro das outras peças antes de emitir nota de produção pra valer.
   - **NFS-e — login da prefeitura — ainda pendente**: erro *"É necessário configurar a senha
     desta empresa neste município."* — Araraquara exige login/senha do **sistema da própria
     prefeitura** pra emitir nota de serviço (tem um campo "Login prefeitura" na mesma tela de
     Documentos Fiscais → NFSe, que ela deixou em branco). Não é algo que a Focus NFe fornece.
     **Pergunta enviada pra contabilidade** (Lucrare, contato Rafaela Forti) perguntando se eles já
     têm esse login cadastrado pra essa empresa — **aguardando resposta**.
   - **NFC-e — IBS/CBS — RESOLVIDO (implementado numa sessão posterior)**: depois de
     corrigir o CSOSN, apareceu rejeição **diferente** tentando emitir de novo: *"Rejeição: Grupo
     IBS/CBS não informado [nItem: 1]"* (rejeição SEFAZ nº 1115). É a **Reforma Tributária** (os
     impostos novos IBS/CBS entrando em vigor a par do ICMS/ISS antigo) — não é bug, é exigência
     fiscal nova que o código desta sessão não tinha motivo de já cobrir. **Decisão tomada**: não
     implementar o formato do campo sem confirmação oficial — risco fiscal real de mandar dado
     errado. **Ticket de suporte respondido numa sessão posterior** (Lucas F Cano, suporte Focus
     NFe) — confirmou os **nomes exatos dos campos** que precisam ser enviados no item da NFC-e:
     `ibs_cbs_situacao_tributaria` (CST do IBS/CBS), `ibs_cbs_classificacao_tributaria` (cClassTrib
     — Classificação Tributária, ligada a um artigo da LC 214/2025), `ibs_cbs_base_calculo`,
     `cbs_aliquota`, `cbs_valor`, `ibs_uf_aliquota`, `ibs_uf_valor`, `ibs_mun_aliquota`,
     `ibs_mun_valor`, `ibs_valor_total`. **Mas a resposta também deixou claro**: *"a definição
     fiscal e tributária da operação não faz parte do escopo do nosso suporte"* — ou seja, a Focus
     NFe confirmou **quais campos** existem, não **quais valores/códigos** usar (isso depende do
     enquadramento tributário da loja e é decisão de contabilidade, não técnica). **Ainda não deu
     pra confirmar isso com o sandbox**: os links de documentação que eles mandaram
     (`campos.focusnfe.com.br`, `focusnfe.com.br/guides/reforma-tributaria`) continuam bloqueados
     pro ambiente onde rodo (mesma limitação de sempre, ver item 6 da seção 6) — tentei também
     nfe.io, tributos.io e blog.tecnospeed.com.br via busca na web, todos bloqueados igual; só
     consegui confirmar o *significado* de `ibs_cbs_situacao_tributaria`/`ibs_cbs_classificacao_
     tributaria` (CST e cClassTrib) por snippet de busca, não o conteúdo completo das páginas.
     **Resposta da contabilidade (Lucrare, via Rafaela Forti, encaminhando a orientação da
     Rayana)**: tabela com os 10 campos e o valor pra usar em 2026 (fase de transição) — CST
     `ibs_cbs_situacao_tributaria = "000"` (tributação integral), cClassTrib
     `ibs_cbs_classificacao_tributaria = "000001"` (situação plenamente tributada),
     `ibs_cbs_base_calculo` = valor normal da operação (mesmo valor bruto do item), e as 3 alíquotas
     (`cbs_aliquota`/`ibs_uf_aliquota`/`ibs_mun_aliquota`) e os 4 valores
     (`cbs_valor`/`ibs_uf_valor`/`ibs_mun_valor`/`ibs_valor_total`) todos zerados (`0,00%`/`R$0,00`)
     — confirma que em 2026 ainda não se cobra de verdade, mas os campos precisam ser **enviados
     explicitamente com zero**, não omitidos. **Implementado** em `montarItemNFCe()`
     (`src/lib/focusNfe.ts`, perto de `icms_modalidade_base_calculo`) e nos tipos correspondentes em
     `src/types/focusNfe.ts` (`ItemNFCe`) — `tsc -b`, `npm run lint` e os 55 testes automatizados
     passando.

     **Testado de verdade na `v0.9.11`**: a rejeição nº 1115 ("Grupo IBS/CBS não informado")
     realmente sumiu, confirmando que os campos certos estavam sendo mandados — mas apareceu uma
     rejeição **nova e mais específica**: *"Rejeição: Alíquota do IBS da UF inválida [nItem: 1]"*.
     **Pesquisado com sucesso via busca na web nesta sessão** (a busca funcionou desta vez, mesmo
     com `focusnfe.com.br` continuando bloqueado pra fetch direto — só pra `WebSearch`, não pra
     `WebFetch`): essa é a rejeição SEFAZ **nº 1026**, documentada de forma consistente por vários
     fornecedores de software fiscal (Sankhya, Bling, Treeunfe, TOTVS, Tecnospeed, FazendaNota,
     CRCMS) — a Nota Técnica NFe 2025.002/LC 214/2025 fixa **alíquotas de teste obrigatórias** pro
     período de transição de 2026, **diferente de zero**: `ibs_uf_aliquota` tem que ser
     **exatamente 0,1%** (rejeição 1026 se não for), `cbs_aliquota` **exatamente 0,9%** (rejeição
     1037), e só o `ibs_mun_aliquota` continua **0%** (rejeição 1036 se não for). São alíquotas
     **simbólicas** — compensadas com PIS/Cofins/ICMS/ISS já cobrados, sem aumento real de imposto
     pro cliente — mas a SEFAZ recusa a nota se o valor exato não bater, mesmo sendo só um teste.
     Ou seja: a orientação da contabilidade (tudo zerado) valia pro *código/CST* (confirmado certo,
     não mudou) mas não pro *valor numérico* dessas duas alíquotas específicas — isso é uma regra
     nacional fixada por lei pra 2026, igual pra qualquer empresa, não uma decisão específica da
     loja que precisasse de confirmação da contabilidade. **Corrigido** em `montarItemNFCe()`:
     `cbs_aliquota = "0.90"`, `ibs_uf_aliquota = "0.10"` (mantendo `ibs_mun_aliquota = "0.00"`), com
     `cbs_valor`/`ibs_uf_valor`/`ibs_valor_total` calculados a partir do valor bruto do item —
     `tsc -b`, `npm run lint` e os 55 testes passando. **Ainda não testado com uma emissão de teste
     real** (resolve a rejeição 1026 na teoria — falta confirmar tentando emitir de novo depois que
     ela publicar essa correção numa tag nova). Só cobre NFC-e — NFS-e não tem grupo IBS/CBS no
     formato usado hoje, não precisou de mudança equivalente lá.
   - **NFC-e — CNPJ Emitente não cadastrado — bloqueio novo, fora do nosso código (26/08/2026)**:
     testando de novo (ainda em homologação), a rejeição de IBS/CBS não apareceu mais (sinal de que
     a correção da alíquota de teste, item acima, funcionou), mas surgiu uma **rejeição diferente**:
     *"Rejeição: CNPJ Emitente não cadastrado"* (print da loja de verdade). **Pesquisado via busca
     na web nesta sessão** — é a rejeição SEFAZ nº 245, bem documentada por vários fornecedores de
     software fiscal (Bling, Oobj, Sankhya, Omie, TagPlus, Conta Azul, Tecnospeed, Treeunfe,
     Webmania, eNotas). Não é bug de código — os ambientes de **homologação e produção são cadastros
     separados** na SEFAZ: mesmo com o CNPJ normal/ativo em produção, ele precisa de um
     credenciamento **próprio** pra poder emitir nota de teste em homologação, e isso não é algo que
     a Focus NFe resolve sozinha nem que dá pra corrigir editando código do Sakura System. Causas
     mais prováveis, nessa ordem: (1) o CNPJ da loja (`66.217.744/0001-70`) ainda não tem esse
     credenciamento de homologação feito junto à SEFAZ-SP; (2) menos provável, já que o CNPJ já foi
     confirmado certo antes (ver bloqueio do CSOSN) — algum erro de digitação/cadastro. **Próximo
     passo sugerido**: perguntar pro suporte da Focus NFe (mesmo canal "Novo suporte" já usado pros
     outros bloqueios) se o CNPJ da empresa está credenciado no ambiente de homologação da SEFAZ-SP
     pra NFC-e — se não estiver, perguntar como pedir esse credenciamento (pode ser algo que a
     própria Focus NFe processa, ou pode exigir contato direto com a SEFAZ/contabilidade). **Ainda
     não investigado a fundo nem resolvido** — só identificado e documentado nesta sessão.

     **Pesquisado mais a fundo, mesma sessão**: a SEFAZ-SP tem um **credenciamento de NFC-e
     separado** (portal próprio, `nfce.fazenda.sp.gov.br`, diferente do credenciamento de NF-e/CT-e)
     — segundo fontes de mercado (Jettax, TagPlus, Webmania), se o estabelecimento não foi
     credenciado automaticamente ("de ofício") pela Secretaria, existe uma opção *"Credenciar só em
     Homologação"* nesse portal pra liberar testes. **Detalhe que pode ser um bloqueio novo em cima
     desse**: o acesso a esse portal da SEFAZ normalmente pede **certificado digital** — mas isso não
     necessariamente contradiz o que já sabíamos (muitos estados, possivelmente incluindo SP, dispensam
     o certificado **do lojista** pra emitir NFC-e no dia a dia via CSC do software house, ver item 6
     da seção 8 — a questão é se esse mesmo CSC também cobre o *credenciamento inicial*, ou se esse
     passo específico exige certificado mesmo). **Não confirmado, só levantado por busca na web** —
     mesma cautela de sempre: não afirmar isso como certeza sem confirmar direto com a Focus NFe.
     **Mensagem preparada nesta sessão** (ainda não enviada — pra ela mandar pro suporte da Focus
     NFe, mesmo canal "Novo suporte"):
     > Estou testando a emissão de NFC-e em ambiente de homologação pra minha empresa, CNPJ
     > 66.217.744/0001-70 (Amigao Pneus e Servicos Automotivos Ltda), e recebo sempre o erro
     > "Rejeição: CNPJ Emitente não cadastrado". Já habilitei a opção "NFCe" em Documentos Fiscais
     > aqui no painel de vocês, então não deve ser isso que falta. Minhas perguntas: (1) o CNPJ
     > 66.217.744/0001-70 está credenciado junto à SEFAZ-SP pra emissão de NFC-e no ambiente de
     > homologação? (2) Se não estiver, como faço esse credenciamento — é algo que a Focus NFe
     > processa automaticamente, ou preciso fazer diretamente no portal da SEFAZ-SP
     > (nfce.fazenda.sp.gov.br)? (3) Esse credenciamento exige certificado digital da empresa? Se
     > sim, é obrigatório mesmo emitindo pelo CSC de vocês (que entendo dispensar certificado
     > próprio do lojista pra emissão do dia a dia)?

     **RESPONDIDO pelo suporte da Focus NFe (Danilo Gabriel Lopes, 26/08/2026)** — resposta clara,
     que fecha o diagnóstico e derruba uma suposição minha antiga:
     1. A rejeição 245 vem **direto da SEFAZ**, quando o emitente ainda não tem credenciamento pra
        NFC-e **no ambiente usado** (homologação ou produção — são separados, como já suspeitávamos).
     2. **A Focus NFe não faz esse credenciamento.** É o próprio emitente, direto na SEFAZ do
        estado dele. Eles sugerem pedir ajuda à contabilidade.
     3. **Precisa de CSC E certificado digital — os dois.** Isso **derruba a suposição registrada
        no item 6 desta seção** de que muitos estados dispensariam o certificado do lojista pra
        NFC-e via CSC do software house: pelo menos em SP, e pela boca da própria Focus NFe, não
        dispensa. Ver a correção anotada lá.
     4. **O certificado digital já está corretamente vinculado** no cadastro da empresa deles
        (ele conferiu) — ou seja, esse pedaço já está pronto, é o único que já estava.
     5. Falta a loja **gerar o ID token e o CSC direto na SEFAZ-SP**, tanto o de homologação quanto
        o de produção, e informar os dois no Painel da API da Focus NFe.
     Feito isso, segundo ele, a empresa fica apta a emitir. **Próximo passo é 100% dela/da
     contabilidade** (portal da SEFAZ-SP, com certificado digital) — não há nada a mudar no código
     do Sakura System por causa disso.

     **Pedido enviado à contabilidade (Lucrare/Rafaela) em 26/08/2026**, junto com o print da
     resposta do Danilo, pedindo que eles (a) credenciem o CNPJ pra NFC-e na SEFAZ-SP nos dois
     ambientes e (b) gerem o CSC e o ID Token de homologação **e** de produção. **Aguardando os
     quatro códigos** — quando chegarem, é só cadastrar no painel da Focus NFe (passo dela, não de
     código) e tentar emitir de novo. **Preferência dela sobre esse tipo de mensagem, aprendida
     aqui**: mensagem pra terceiro (contabilidade, suporte) deve ser **curta e informal**, sem
     recapitular todo o contexto técnico — se existe um print/e-mail que já explica, ele carrega a
     parte técnica e a mensagem fica só "preciso de ajuda com isso / o print explica / vocês fazem
     pra mim? / preciso receber X de volta". A primeira versão que escrevi foi rejeitada por ser
     longa e formal demais.
   - Token de **produção** (a assinatura já é paga, então ela tem os dois) só deve ir pra
     Configurações quando a emissão em homologação estiver validada de ponta a ponta — NFC-e (por
     causa do IBS/CBS) e NFS-e (por causa do login da prefeitura) ainda não estão.

   **A contabilidade não respondeu — ela mesma fez o credenciamento (mesma sessão do sucesso da
   NFS-e)**: com a NFS-e resolvida, ela decidiu tentar o credenciamento de NFC-e sozinha em vez de
   continuar esperando. Ela tinha em mãos o **certificado digital A1** da empresa (arquivo `.pfx`,
   "AMIGAO PNEUS S. Amigao7@ .pfx"). Passo a passo que funcionou: (1) instalou o certificado no
   Windows (duplo-clique no `.pfx` → Assistente de Importação de Certificados → "Usuário Atual");
   (2) o link direto `nfce.fazenda.sp.gov.br` deu `ERR_CONNECTION_RESET` em dois navegadores
   diferentes (Brave e Edge) — não era problema de navegador, era o endereço: o certo é
   `www.nfce.fazenda.sp.gov.br/NFCePortal/` (achado via busca na web, já que o domínio puro não
   funciona); (3) o portal reconheceu o certificado sozinho e já mostrou a empresa (CNPJ
   66.217.744/0001-70, "Ativo" no CADESP) na tela **Credenciamento → Credenciamento Voluntário**;
   (4) marcou o rádio da empresa, preencheu "Dados do Responsável" com o nome do pai dela (dono de
   fato da empresa, decisão dela — não os dados dela mesma) e o e-mail da contabilidade
   (`contabilidadedelucrare@gmail.com`); (5) clicou **"Solicitar Credenciamento"**. **Funcionou de
   primeira**: a coluna "Data Credenciamento" passou a mostrar `27/08/2026` e o botão virou
   "Solicitar Descredenciamento" (confirma ativo). **CNPJ credenciado pra NFC-e na SEFAZ-SP.**

   **CSC/ID Token gerados na sequência, mesma sessão**: o menu lateral do mesmo portal tem
   **"Gerenciar Cód Segurança"**, com duas opções — "com validade jurídica" (produção) e "ambiente
   de testes" (homologação). O de **homologação** (`homologacao.nfce.fazenda.sp.gov.br`) nunca
   carregou — `ERR_CONNECTION_TIMED_OUT` repetido, em navegadores diferentes, mesmo padrão de
   instabilidade de ambiente de teste do governo já visto com a NFS-e (ver mais abaixo). O de
   **produção** carregou de primeira e gerou o par direto (botão "Novo Cód Segurança"):
   **ID Cód Segurança `000001`**, **CSC `56345e25-ce08-40e6-bf64-a95404bf17e6`** (citados aqui como
   registro do que foi usado, mesma ressalva de segurança do token do Giap — convém trocar se este
   arquivo circular fora do controle dela). Cadastrado no painel da Focus NFe (Empresas → Amigão
   Pneus → Documentos Fiscais → NFCe, campos CSC/ID Token) — sem token de homologação até
   conseguir gerar o CSC de lá.

   **🎉 NFC-e EMITIDA COM SUCESSO EM PRODUÇÃO** — primeiro teste (peça "CIL RD TR", preço da linha
   editado pra R$2,00) deu erro "Código CSC não configurado" (CSC ainda não tinha sido salvo no
   painel da Focus NFe naquele momento); depois de salvar, **número 1** autorizou, com DANFE
   completo (chave de acesso, QR, forma de pagamento) exibido no modal. É a primeira NFC-e emitida
   pelo Sakura System de ponta a ponta. **Junto com a NFS-e (item acima), as duas notas fiscais do
   sistema estão funcionando em produção** — fecha a parte fiscal que era o item pendente há mais
   tempo no projeto (ver seção 8, resumo geral). Nota de teste, será cancelada com o botão
   "Cancelar nota" e a OS de teste limpa com um script SQL (mesmo padrão dos anteriores).
   **CSC/ID Token de homologação continuam pendentes** — não bloqueia uso real, só testes futuros
   em ambiente de teste; tentar de novo quando o servidor da SEFAZ-SP voltar a responder.

   **Estado atualizado numa sessão posterior**: a Rafaela/Lucrare respondeu o login da prefeitura
   de Araraquara (usuário `30016580`, senha `1234`) — a usuária preencheu no painel da Focus NFe
   (Empresas → Documentos Fiscais → NFSe → "Login prefeitura") e testou de novo. O erro genérico
   `"erro_autorizacao"` sumiu (confirma que a correção do item acima — ler `resposta.erros`, não só
   `mensagem_sefaz`/`mensagem` — funcionou: agora aparece o motivo real). **Bloqueio novo,
   diferente**: *"Lote RPS não pode ser nulo"* — Araraquara usa o conceito de "lote de RPS"
   (agrupamento de notas, padrão ABRASF comum em várias prefeituras) e a Focus NFe está recusando
   por faltar algo relacionado a isso. **Pesquisado nesta sessão** (mesma limitação de sempre —
   `focusnfe.com.br` bloqueado pro sandbox, só busca na web): não achei o nome exato do campo;
   encontrei indício de que, em várias cidades, emitir por API exige a empresa estar **credenciada
   no regime de lote junto à prefeitura** primeiro (não é só um campo JSON que falta enviar) — não
   quis arriscar inventar um valor sem confirmação, mesma cautela já usada com o IBS/CBS. **Ticket
   de suporte já aberto na Focus NFe pela usuária** perguntando se a empresa está credenciada nesse
   regime e que campo de lote/RPS falta enviar. **Resposta do suporte (Gustavo Peres, numa sessão
   posterior)**: não confirmou credenciamento nem nome de campo — a hipótese dele foi que pode ser
   **instabilidade no ambiente de homologação**, e pediu pra ela tentar emitir em **produção** pra
   ver se funciona lá. **Decisão da usuária: esperar mais informação antes de testar em produção**
   (não vale a pena arriscar gerar uma NFS-e real só pra validar isso agora) — segue **aguardando**,
   sem teste novo por enquanto. Se decidir aceitar a sugestão dele no futuro, lembrar que testar em
   produção significa nota fiscal de verdade (não simulada) e exige trocar o token de homologação
   pelo de produção em Configurações → Dados fiscais da loja antes. **Bug cosmético
   encontrado junto**: a mensagem desse erro aparece com acentuação quebrada ("Lote RPS nÃ£o pode
   ser nulo" em vez de "não") — o padrão exato desse tipo de mojibake (bytes UTF-8 corretos lidos
   como Latin-1) é consistente com a mensagem já chegando corrompida **do lado da Focus NFe ou da
   prefeitura**, não do nosso código (`lib/focusNfe.ts` já decodifica a resposta como UTF-8
   corretamente) — não mexido, sem confirmação de que a causa é mesmo nossa.

   **Testado de novo na `v0.9.11`** (ainda em homologação, não em produção): o mesmo erro "Lote RPS
   não pode ser nulo" continua aparecendo, sem mudança — esperado, já que nada mudou no código da
   NFS-e desde a última tentativa. **Pesquisado de novo nesta sessão** (a busca na web funcionou
   desta vez, embora `focusnfe.com.br` continue bloqueado pra abrir a página): achei que o padrão
   ABRASF (usado por várias prefeituras) tem uma rejeição parecida, "E88 — Número de lote não
   informado", e que a Focus NFe **tem uma página de guia específica pra Araraquara**
   (`focusnfe.com.br/guides/nfse/municipios-integrados/araraquara-sp/`) que provavelmente documenta
   o campo certo — mas não consegui abrir (bloqueada, mesma limitação de sempre). **Ainda não deu
   pra confirmar o nome exato do campo** — mesma cautela de não implementar um valor chutado em
   dado fiscal. **Próximo passo mais direto**: pedir pra ela (ou pro suporte da Focus NFe) abrir
   essa página específica do guia de Araraquara e copiar o trecho sobre "lote"/"RPS", em vez de
   esperar mais respostas genéricas de ticket.

   **Ela abriu a página e mandou print (mesma sessão)** — achado importante, muda a direção da
   investigação: **o JSON de exemplo da Focus NFe pra Araraquara não tem nenhum campo de "lote" em
   lugar nenhum** (nem no exemplo, nem na tabela "Campos Importantes" — só CPF/CNPJ do tomador,
   endereço do tomador, item da lista de serviço, código CNAE são obrigatórios). Ou seja: não é um
   campo que falta a gente mandar no corpo da requisição — o conceito de "lote" pertence ao sistema
   municipal antigo (ABRASF/RPS), do lado do fornecedor da prefeitura (aparece como "Provedor: Giap"
   na página). **Mas apareceu um aviso mais relevante ainda**: *"Empresas MEI e optantes pelo
   Simples Nacional possuem prazos definidos para deixar de emitir utilizando este ambiente
   municipal. Consulte a obrigatoriedade de emissão no Ambiente Nacional."* — a loja é Simples
   Nacional, então é bem possível que o caminho certo não seja "achar o campo de lote que falta",
   e sim **migrar pro "Ambiente Nacional"** (o novo sistema nacional de NFS-e, que nem usa o
   conceito de lote/RPS — isso explicaria o erro sumir de vez, não só ser contornado). **Mensagem
   preparada nesta sessão** (formato checklist, a pedido da usuária, mesmo padrão já usado com a
   Rayana) pra ela mandar pro suporte da Focus NFe perguntando: (1) se a empresa já deveria estar
   emitindo pelo Ambiente Nacional em vez do municipal de Araraquara; (2) se sim, como migrar no
   painel deles; (3) se não for isso, o que falta pra resolver o "Lote RPS" no ambiente municipal
   mesmo. **Ainda não enviada** — aguardando ela mandar e o suporte responder.

   **Hipótese do "Ambiente Nacional" descartada nesta sessão** (antes de mandar a mensagem acima,
   ela achou o interruptor direto no painel — Serviços → Pneus Amigao → "Ambiente da NFSe Nacional -
   Homologação" — e tentou ligar): ao tentar, a própria Focus NFe mostrou um aviso que **fecha essa
   hipótese**: *"Este município não usa o emissor do ambiente nacional para todas as empresas. Se
   você não é uma empresa obrigada a emitir pelo ambiente nacional, a emissão via NFSe Nacional não
   irá funcionar... Se você tem certeza que sua empresa é obrigada a emitir no ambiente nacional ao
   invés do ambiente do município (por exemplo, se sua empresa é MEI), você deve digitar 'eu aceito'
   no campo abaixo."* A empresa (Amigao Pneus e Serviços Automotivos **Ltda**, CNPJ
   `66.217.744/0001-70`) **não é MEI** — é Simples Nacional, mas registrada como Ltda, não como
   Microempreendedor Individual — então não se encaixa na exceção que obrigaria/permitiria usar o
   Ambiente Nacional. **Orientada a cancelar a janela, sem digitar "eu aceito"** — confirmar isso
   às cegas arriscaria emitir pelo ambiente errado (mesmo em homologação, não é um comportamento
   que queremos validar). **Volta a valer o plano original**: mandar a mensagem-checklist já
   preparada (pergunta 1/2/3 acima) pro suporte da Focus NFe — a pergunta (1) já está
   respondida-por-elas-mesmas como "não" (não é MEI, não se encaixa), então a mensagem pode ser
   simplificada pra focar direto na (3): o que falta pro "Lote RPS" no ambiente municipal mesmo.

   **Mensagem enviada (26/08/2026) — ticket `#238770` na Focus NFe**, título *"Empresa Simples
   Nacional em Araraquara — preciso migrar pro Ambiente Nacional?"*. Ela cobriu as duas pontas numa
   mensagem só: se a empresa precisa migrar pro Ambiente Nacional (e como fazer isso no painel
   deles), **ou**, se não for o caso, o que exatamente falta pra resolver o "Lote RPS não pode ser
   nulo" no ambiente municipal mesmo.

   **Respondido (Hélio Marques, suporte Focus NFe)**: **não tem relação com a migração pro Simples
   Nacional** (que teve a data adiada pra 1º de novembro — ou seja, mesmo se a empresa fosse
   obrigada a migrar um dia, ainda não é agora). A hipótese deles é **instabilidade do ambiente de
   homologação da prefeitura** — o mesmo tipo de suspeita que o Gustavo Peres (outro atendente) já
   tinha levantado numa sessão anterior, agora reforçada por um segundo atendente independente.
   Sugestão deles: fazer um **teste de baixo valor em produção, cancelando a nota logo em
   seguida**, já que "o ambiente de homologação das prefeituras nem sempre está funcional".
   **Não é diagnóstico de um campo faltando** — é a Focus NFe dizendo que não há mais nada pra
   ajustar do lado deles/nosso, e que o jeito de confirmar é testar fora da homologação.
   **Ela decidiu tentar** (nesta sessão). Passo a passo combinado: (1) trocar o "Ambiente" pra
   Produção em Configurações → Dados fiscais da loja, colando o token de produção (esse campo é
   único pra loja toda — também deixa a NFC-e "em produção", mas ela continua travada no mesmo erro
   de sempre, "CNPJ Emitente não cadastrado", então sem risco de emitir NFC-e real sem querer); (2)
   escolher/criar uma OS de teste com valor baixo, com item de **serviço**, status concluída, e usar
   "Emitir NFS-e" na aba Fechamento; (3) se autorizar, **cancelar direto no painel da Focus NFe**
   (o Sakura System ainda não tem botão de cancelar nota — `cancelarNFCe`/`cancelarNFSe` existem em
   `lib/focusNfe.ts`, mas nenhuma tela chama essas funções ainda); (4) se quiser tirar a OS de teste
   do próprio Sakura System depois (não é obrigatório, é só arrumação), preparado nesta sessão
   `supabase/scripts/excluir-os-teste-nfse-producao.sql` — mesmo padrão do
   `excluir-os-teste-eduarda.sql`, só precisa trocar o número da OS antes de rodar.

   **Testado em produção nesta sessão — erro diferente, é progresso**: o erro mudou de "Lote RPS
   não pode ser nulo" (homologação) pra **"Erro de autenticação na comunicação com a Prefeitura."**
   (produção). Não é bug do Sakura System — essa mensagem vem pronta da Focus NFe
   (`resposta.mensagem_sefaz`, só exibida por `EmitirNotaFiscalModal.tsx`, sem lógica nossa no
   meio). Pesquisado via busca na web: essa mensagem indica que a Focus NFe tentou logar no sistema
   da prefeitura (Araraquara usa o "Giap") com o login/senha configurado no painel deles
   (Documentos Fiscais → NFSe → "Login prefeitura", preenchido numa sessão anterior com o usuário
   `30016580`/senha `1234` que a contabilidade passou) e a prefeitura **recusou essa credencial** —
   diferente do erro anterior ("é necessário configurar a senha desta empresa neste município"),
   que era só a ausência de qualquer login cadastrado. **Hipótese mais provável**: o login/senha
   que a contabilidade passou pode valer só pra homologação, não pra produção (municípios costumam
   ter portais/cadastros separados pros dois ambientes) — precisa confirmar com a contabilidade ou
   com o suporte da Focus NFe se esse é o caso, e se sim, pedir o login/senha de **produção**
   especificamente. **Pergunta enviada pro suporte da Focus NFe.**

   **Respondido (Gustavo Peres, suporte Focus NFe)** — a hipótese do login/senha de homologação vs.
   produção **não era o problema real**. Pra Araraquara, o campo "senha" (painel Focus NFe →
   Empresas → Documentos Fiscais → NFSe) **não é uma senha escolhida livremente** — precisa ser um
   **token gerado direto no portal da própria prefeitura** (Araraquara usa o "Giap"), no menu
   "Dados Cadastrais" desse portal. O usuário/senha `30016580`/`1234` que a contabilidade passou
   antes não é isso — o suporte deu uma referência específica de Araraquara:
   `focusnfe.com.br/guides/nfse/municipios-integrados/araraquara-sp/`. **Próximo passo**: alguém
   com acesso ao portal da prefeitura de Araraquara (provavelmente a contabilidade, Rafaela/Lucrare
   — é o mesmo tipo de acesso que já geraram usuário/senha antes) precisa entrar lá, achar "Dados
   Cadastrais" e gerar esse token, depois colar no campo "senha" da Focus NFe (substituindo o que
   está lá agora).

   **Feito nesta sessão — e ela mesma conseguiu, sem precisar da contabilidade**: o login
   `30016580`/`1234` que a contabilidade tinha passado antes **não era pra colar direto na Focus
   NFe** — era o login pra **entrar no próprio portal da prefeitura** (`araraquara.giap.com.br`,
   sistema "Giap", acessado por Serviços Empresa → Nota Fiscal Eletrônica → Contribuintes no site
   oficial `araraquara.sp.gov.br`). Ela entrou com esse login normalmente. Duas pegadinhas no
   caminho: (a) a tela avisava que a opção "Emitir NFS-e" ficaria escondida até confirmar a leitura
   de um "comunicado pendente" — era uma dúvida antiga que a contabilidade tinha mandado pra
   prefeitura perguntando se Araraquara já migrou pro Padrão Nacional de NFS-e ou ainda usa o
   sistema próprio (Giap); só precisou abrir/marcar como lida pra destravar o menu, sem precisar
   responder nada; (b) o menu "Dados Cadastrais" (mencionado pela Focus NFe) só apareceu no menu
   lateral **depois** dessa confirmação — antes disso nem aparecia. Dentro de "Dados Cadastrais" já
   existia um **Token** pronto, gerado (`RKTKVCWNJUO72X6Y8Z7TWT3VILSNAGZ2` — citado aqui só como
   registro do que foi usado, não é segredo de alto risco tipo senha de banco, mas ainda assim
   convém trocar se algum dia este arquivo circular fora do controle dela). Ela copiou esse token
   (sem clicar em "Gerar Token", que geraria um novo e invalidaria esse) e colou no campo "senha"
   da Focus NFe, mantendo o usuário `30016580`. **Confirmado que resolveu**: o próximo teste não
   repetiu mais o erro de autenticação.

   **Bloqueio seguinte, já resolvido no código (mesma sessão)**: passada a autenticação, a nota foi
   rejeitada com *"Preencher a tag cnae e envie novamente"* — a Focus NFe documenta `codigo_cnae`
   como campo obrigatório do objeto `servico` da NFS-e (vem do Cartão CNPJ da empresa, "Atividade
   econômica principal"), que o Sakura System nunca pediu nem mandava. **Corrigido**: migration
   `0047` (coluna `codigo_cnae` em `configuracoes_fiscais_loja`), campo novo "Código CNAE" em
   Configurações → Dados fiscais → "Emissão de NFS-e", `montarCorpoNFSe()` manda o campo e
   `emitirNFSe()` valida que está preenchido antes de tentar emitir (mesmo padrão do
   `codigo_municipio`). **Validado**: `tsc -b`, lint, os 59 testes (fixture + asserção nova) e a
   migration num Postgres local, aplicada duas vezes pra confirmar idempotência. `codigo_cnae` é
   normalizado pra só dígitos antes de mandar pra Focus NFe (mesmo padrão de CNPJ/CPF/CEP), então
   aceita digitar com ou sem pontuação.

   **🎉 NFS-e EMITIDA COM SUCESSO EM PRODUÇÃO** — ela rodou as migrations `0046`/`0047`, preencheu
   o Código CNAE (`4520-0/01`, coincidiu com o exemplo já usado na UI/testes) e publicou a
   `v0.9.19` com tudo isso. Testou de novo na OS de teste (cliente "Eduarda Cristina") e a NFS-e
   autorizou — **número 10**, XML já salvo em Notas Fiscais. É a primeira NFS-e de verdade emitida
   pelo Sakura System de ponta a ponta (formulário → Focus NFe → prefeitura → autorizada). Fecha
   a cadeia inteira de bloqueios desta sessão: Lote RPS (era instabilidade de homologação,
   contornado testando em produção) → autenticação com a prefeitura (resolvido gerando o token no
   portal Giap) → CNAE faltando (corrigido no código). **Por ser nota de teste, ela vai cancelar**
   — usando o botão "Cancelar nota" construído nesta mesma sessão (primeiro uso real dele).
   **NFC-e (peça) continua bloqueada** — separado, esperando a contabilidade credenciar o CNPJ na
   SEFAZ-SP (ver bloco de NFC-e nesta seção).

   **Bug encontrado e corrigido na sequência, mesma sessão**: o botão "Versão para o cliente" saiu
   com tudo em branco (número, itens, total) pra essa NFS-e — o XML que a Focus NFe hospeda pra
   Araraquara não é o "corpo" completo da nota (com itens/valores), é só uma **confirmação de
   emissão** do sistema Giap: número da nota/RPS/lote, código de verificação, CNPJ do prestador e
   um **link pro documento oficial completo**, hospedado no próprio site da prefeitura. O
   interpretador de XML (`lib/notaFiscalXml.ts`) só conhecia o layout Nacional de NFS-e. **Corrigido**
   com `interpretarConfirmacaoGiap()`, que reconhece esse formato e monta o recibo com os dados
   disponíveis + o link "Ver documento oficial completo" em vez de uma tabela vazia. Publicado na
   `v0.9.20` e **já confirmado por ela** — testou com a NFS-e número 11 e o recibo saiu certo
   (número, emitente, chave de verificação, protocolo, link). `tsc -b`, lint e os 62 testes
   automatizados (3 novos cobrindo esse formato) passando.

   Sobre o IBS/CBS e o CSOSN: a usuária mandou a pergunta combinada pra Rafaela (CSOSN `'500'`
   nunca validado + os 10 campos do IBS/CBS que a Focus NFe exige). **Resposta da Rafaela**: ela
   não respondeu as perguntas diretamente, disse que vai pedir pra uma colega, **Rayana**, ligar ou
   mandar mensagem pra explicar certinho. **Preparada nesta sessão** (ainda não enviada — é pra
   usar na ligação/conversa com a Rayana, formato de checklist objetivo em vez de mensagem corrida,
   a pedido da usuária) uma lista específica com:
   - Pergunta 1 (CSOSN): pra uma venda comum de peça (Simples Nacional), o CSOSN certo é `'500'`
     mesmo ou depende do produto/situação? **Ainda sem resposta.**
   - Pergunta 2 (IBS/CBS): uma tabela com os 10 campos exigidos pela Focus NFe — **respondida numa
     sessão posterior** (Rafaela encaminhou a tabela da Rayana) e **já implementada em código**, ver
     o item "NFC-e — IBS/CBS — RESOLVIDO" logo acima.

   **Como retomar na próxima sessão**: a hipótese do Ambiente Nacional **já foi descartada** (ver
   bloco logo acima — a própria Focus NFe confirmou que a empresa não se encaixa, por não ser MEI).
   O ticket `#238770` **já foi respondido** (ver bloco acima) — não é mais "aguardando resposta", é
   "aguardando decisão da usuária" sobre testar em produção ou não. Confirmar se: (a) ela decidiu
   tentar o teste de baixo valor em produção (e, se sim, como foi — resolveu o "Lote RPS" ou não) ou
   se prefere continuar insistindo em homologação; se um dia surgir um campo específico faltando, é
   só ajustar `montarCorpoNFSe()` em `src/lib/focusNfe.ts` conforme indicado; (b) a Rayana/Rafaela já respondeu a Pergunta 1 (CSOSN `'500'`) — se sim e o
   código certo for diferente, corrigir o cadastro da peça de teste (código interno `7`) e revisar
   as demais peças do catálogo antes de emitir de produção pra valer. O campo de IBS/CBS
   (Pergunta 2) já está implementado, incluindo a correção do valor exato das alíquotas de teste de
   2026 (rejeição 1026) — a rejeição de IBS/CBS já sumiu testando de novo, confirmando que resolveu;
   (c) o **novo bloqueio de NFC-e** achado numa sessão posterior — rejeição "CNPJ Emitente não
   cadastrado" (SEFAZ nº 245, ver bloqueio logo acima) — já foi levado pro suporte da Focus NFe, e
   se sim, o que responderam sobre o credenciamento de homologação do CNPJ da loja.
   **`supabase/scripts/excluir-os-teste-eduarda.sql` já foi rodado nesta sessão** — não por ter
   terminado de testar, mas porque a OS de teste antiga ("Eduarda Cristina", reusada em cada
   tentativa de emissão) tinha ficado contaminada de vez pelo bug do item 31 da seção 6 (item
   acrescentado depois de faturada), sem mais servir pra validar NFC-e. O cadastro do cliente
   "Eduarda Cristina" continua existindo (o script só apaga a OS, não o cliente/veículo) — ela criou
   uma **OS de teste nova** nesse mesmo cliente, já com peça e serviço juntos, e foi testando essa
   nova OS que apareceu o bug do item 32 da seção 6 (pagamento cheio da OS mandado como se fosse só
   da peça). Testes seguem nessa OS nova depois que a próxima tag (com a correção do item 32) sair.

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
   3. **Login/senha do portal da prefeitura, pra NFS-e** — Araraquara exigiu (veio da contabilidade
      da loja, não da Focus NFe). **Varia por município**, inclusive o fornecedor do sistema
      municipal (Araraquara usa "Giap") e o conceito de lote/RPS que ele impõe.
   4. **Confirmar CST/CSOSN com a contabilidade do cliente** — depende do regime tributário
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
produção** (ver item 1 desta seção), a última peça grande que faltava. Ainda vale rodar mais
algumas emissões reais antes de considerar 100% validado (só um teste de cada até agora), e
segue pendente o CSC/ID Token de **homologação** da NFC-e (não bloqueia uso real).

### Onde tudo parou ao fim desta sessão (27/08/2026)

**A parte fiscal fechou nesta sessão** — as duas notas (NFC-e e NFS-e) emitem de ponta a ponta em
produção:

| Assunto | Onde parou |
|---|---|
| **NFC-e** (peça) | ✅ **FUNCIONANDO** — credenciamento na SEFAZ-SP feito por ela mesma (certificado digital A1), CSC/ID Token de produção gerados, primeira nota (número 1) autorizada. Nota de teste, já cancelada. |
| **NFS-e** (serviço) | ✅ **FUNCIONANDO** — token da prefeitura gerado por ela no portal Giap, código CNAE configurado, notas (números 10 e 11) autorizadas. Ambas de teste, já canceladas. |

Depois de confirmar as duas, ela pediu pra limpar o rastro: as 4 OS de teste (números 2-5, cliente
"Eduarda Cristina") foram apagadas junto com tudo que geraram (estoque, Caixa, Contas a Receber,
arquivos de nota) via SQL direto — mesmo padrão dos scripts de limpeza já usados antes. Confirmado
por ela que sumiu tudo da tela. O cadastro do cliente/veículo continua existindo.

**O que ainda falta, sem bloquear uso real**:
- **CSC/ID Token de homologação da NFC-e** — o servidor de homologação da SEFAZ-SP nunca respondeu
  (`ERR_CONNECTION_TIMED_OUT` em navegadores diferentes); só o de produção foi gerado. Tentar de
  novo quando o servidor deles voltar, se algum dia precisar testar em homologação de novo.
- **CSOSN das peças do catálogo** — ainda não confirmado com a contabilidade se `'500'` é o código
  certo pra toda peça, ou só pra quem tem ICMS-ST de verdade (ver item 1 da seção 8). Baixo risco
  imediato (SEFAZ só rejeita incompatibilidade com o regime, não o código errado pro produto), mas
  vale revisar antes de emitir em volume.
- **Sugestão de feature registrada, não decidida**: cancelar uma nota deveria também estornar
  estoque/Caixa automaticamente? Ver tarefa sugerida `task_22e069e2` — precisa de uma decisão de
  design antes de implementar (cancelar a nota ≠ sempre desfazer a venda inteira).

**Ponta solta pequena, não confirmada**: não ficou claro se ela chegou a usar o botão "Testar
conexão" com sucesso na `v0.9.18`, ou se entrou pelo "Salvar assim mesmo". Se foi o segundo, a
checagem ainda está errada (só não trava mais ninguém) e vale investigar quando houver folga — mas
não é urgente, porque o app funciona de qualquer jeito.

### Onde tudo parou ao fim desta sessão (28/08/2026)

Sessão de **preparação pra vender pra terceiros** (fase 2 do plano da seção 1 — o amigo do pai
dela, com 2 lojas). Nenhuma funcionalidade nova pro usuário final: o assunto foi a "esteira" de
entregar e sustentar o sistema numa loja que não é a do pai dela.

**Três decisões dela, já registradas na tabela da seção 3:**
1. **Todos os custos ficam na conta dela** (Supabase, Anthropic, Focus NFe). O dono da loja não
   cria conta em serviço nenhum e nunca vê que eles existem.
2. **Supabase Pro desde a primeira venda**, por causa do backup automático.
3. **Primeira coisa a construir**: o arquivo único de instalação + o checklist (feito nesta
   sessão). O resto continua na fila.

**O que foi construído**: `supabase/instalacao/instalacao-completa.sql` (as 47 migrations num
arquivo só, gerado por `npm run gerar-instalacao`, com teste que reprova se ficar desatualizado),
`supabase/instalacao/INSTALAR-LOJA-NOVA.md` (o checklist de venda/instalação) e
`supabase/scripts/stub-supabase-local.sql` (stub reaproveitável pra validar migrations e RLS num
Postgres local).

**Dois bugs reais achados no caminho, os dois só visíveis instalando do zero** — ver itens 36 e 37
da seção 6. O segundo é o mais sério: a instrução de criar o primeiro admin (comentário na
migration `0007`) estava desatualizada desde a `0031`, e sem o `insert` em `operador_lojas` **toda
instalação nova nasceria com a loja aparecendo vazia**, sem conserto pela tela. Os dois corrigidos
e validados num Postgres local.

**Fila combinada, na ordem, não começada**:
1. **Token Focus NFe compartilhado** (uma conta só dela, invisível pro dono da loja) — é o
   pré-requisito da conta de R$350/loja. Ver item 6 da seção 8. Combinado que só depois da emissão
   estar bem rodada na loja do pai dela.
2. **Botão de diagnóstico pra suporte** no app (copia versão/loja/último erro pro cliente mandar no
   WhatsApp) — hoje ela não tem como enxergar problema de loja remota.
3. **Risco conhecido, sem solução ainda**: publicar uma tag ruim atualiza **todas as lojas de uma
   vez, sozinho**. Com 1 loja o risco é dela; com 3 de terceiros, vira telefonema. Não foi decidido
   nada — por ora vale o hábito de testar antes e não publicar em dia de movimento.

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

**Estado hoje: `0001` a `0047` estão todas aplicadas no projeto dela.** `0046` (`focus_nfe_ref` em
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
  Next.js, completamente substituído; e o próprio nome do repositório era `amigao` até esta sessão —
  renomeado pra `sakura-system-ace` e **tornado público**, ver "Auto-update via GitHub Releases não
  funciona com repositório privado" logo abaixo). `main` é o Sakura System — um `git clone` simples
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
- `package.json` em `"version": "0.9.18"` (ver "Empacotamento" na seção 7 pro que essa tag trouxe e
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
git clone https://github.com/caranovavidanova/amigao.git
cd amigao
npm install
cp .env.example .env   # editar com VITE_SUPABASE_URL=https://rlgdjiowvnfzsedehyga.supabase.co
                        # e VITE_SUPABASE_ANON_KEY=<chave anon, em Settings -> API no Supabase>
npm run dev
```
