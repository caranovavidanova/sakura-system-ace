# Sakura System — AutoCenter Edition — Estado do Projeto

> Este arquivo existe para que qualquer sessão futura (eu, sem memória da conversa) consiga
> entender o projeto e continuar exatamente de onde parou. Sempre que uma funcionalidade nova
> for concluída e validada pela usuária, **atualize este arquivo** (não deixe ele ficar
> desatualizado) — e de vez em quando **limpe o que não serve mais** (tutoriais de migration já
> confirmada, narrativa de sessão que virou só histórico sem lição nenhuma). Prefira reescrever a
> seção 7 como "estado atual por módulo" em vez de empilhar mais um parágrafo por PR — o que
> importa pra uma sessão nova é o que está pronto **hoje**, não a arqueologia de como chegou lá.

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
   (`v0.9.5` → `v0.9.6` sozinho, ver item 21 da seção 6). **Assinou o Focus NFe** (ver item 1 da
   seção 8 pro estado atual da emissão fiscal) — até a emissão automática estar validada de ponta
   a ponta, nota fiscal continua sendo emitida por fora do sistema.
2. **Expandir pra mais 2-3 lojas de conhecidos do pai dela, também em Araraquara** — ainda como
   teste, validar como o sistema se comporta crescendo pra fora de uma loja só, antes de pensar
   grande. Como essas lojas são de donos diferentes (não é a mesma empresa do pai dela), o modelo
   esperado é cada uma com seu próprio projeto Supabase — diferente da fundação **multi-loja** já
   construída (que é pra **uma empresa com várias lojas**, não várias empresas diferentes). Não
   assumir automaticamente qual modelo usar aqui sem confirmar com ela quando chegar a hora.
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
| Chave da IA (leitura de nota fiscal por foto) | Fica só como secret de uma Supabase Edge Function — nunca no app Electron instalado | Cada loja (projeto Supabase próprio) paga pela própria conta Anthropic, sem expor a chave a quem tem acesso ao computador. Ver seção 7 e item 8 da seção 8 |
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
│   │                             # usado hoje só na Marca do veículo, ver seção 7 "Clientes")
│   ├── hooks/useEnterParaProximoCampo.ts  # Enter avança pro próximo campo em qualquer <form>
│   │                             # do app (em vez de tentar submeter) — aplicado uma única vez,
│   │                             # globalmente, em App.tsx + useLimparDataAoApagar.ts (nesta
│   │                             # sessão — Backspace/Delete num campo de data limpa o campo
│   │                             # inteiro em vez de não fazer nada, mesmo padrão de aplicação
│   │                             # global em App.tsx; ver item 27 da seção 6)
│   ├── lib/                     # supabase.ts + um arquivo por entidade (clientes.ts, pecas.ts,
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
│   │   contas-receber/ # ContasReceberPage.tsx + ReceberContaModal.tsx (sem form de criação manual
│   │                   # — só nasce automaticamente ao faturar uma OS escolhendo "a receber")
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
├── supabase/migrations/          # SQL numerado sequencialmente (0001 a 0036), todas idempotentes
├── supabase/scripts/             # SQL de uso único, NÃO faz parte da sequência de migrations —
│                                  # limpar-dados-de-teste.sql (apaga dados de negócio de teste,
│                                  # preserva login/config; ver seção 5)
├── supabase/functions/           # Edge Functions (Deno) — ler-notas-fiscais/index.ts: lê fotos ou
│                                  # PDFs de nota fiscal via Claude/Anthropic e devolve os produtos
│                                  # estruturados (a ANTHROPIC_API_KEY fica só como secret dessa
│                                  # função no Supabase, nunca no app instalado); e
│                                  # redefinir-senha-operador/index.ts (nesta sessão): admin gera
│                                  # senha temporária pra outro operador — usa a service role key
│                                  # (só o Supabase injeta sozinha, sem secret manual pra
│                                  # configurar), ver "Login e permissões" na seção 7.
├── build/icon.png                # ícone do app (1024x1024, gerado a partir de public/sakura-icon.svg)
├── .github/workflows/release.yml # builda + publica o instalador Windows no GitHub Releases quando uma tag "v*" é enviada
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
  recebido), operador_id (FK operadores), criado_em. **Nasce só automaticamente**: ao faturar uma OS
  (`FaturamentoCard.tsx`) escolhendo "A receber depois" em vez de "Recebido agora", não lança Entrada
  no Caixa na hora — cria uma linha aqui, pendente; marcar como recebido (`ReceberContaModal.tsx`)
  é que gera a Entrada. **Sem cadastro manual** pelo app ainda (diferente de Contas a Pagar, que tem
  "+ Nova conta") — se um dia precisar de conta a receber sem OS por trás, adicionar isso é aditivo.
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
   montar e não foi feito ainda). 45 testes, todos passando. Achou e corrigiu de brinde um bug real
   de arredondamento de ponto flutuante em `calcularValorCobrado` (`100 * 1.1` podia sair
   `110.00000000000001` em vez de `110`). **Exceção**: `lib/notaFiscalXmlFornecedor.test.ts` testa
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
  seção 4); ainda só cria produto, não edita (não mudou nesta migração — só existia criação antes
  também). **Importar por foto/PDF**:
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
  Não existe mais seletor manual de status no form — o cabeçalho mostra o status atual (badge) e,
  enquanto "em_andamento", um botão **"Encerrar OS"** que marca como concluída e já abre a tela de
  faturamento na sequência, num fluxo só. **`OrdemServicoForm.tsx` migrado nesta sessão** pro
  padrão `react-hook-form` + `zod` (quarto módulo — ver "Padrão de formulário" na seção 4);
  comportamento pro usuário não mudou (mesmos campos, mesma regra de só acrescentar item, não
  editar/remover o que já foi lançado). Técnico por item + vendedor/atendente da OS (ambos listam
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
  de teste real) e "Ver garantia" (abre preview do documento completo — cabeçalho da loja, dados de
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
- **Contas a Receber**: espelha Contas a Pagar, mas do lado do que a loja tem a receber. Sem
  cadastro manual — nasce automaticamente quando uma OS é faturada escolhendo "A receber depois" em
  vez de "Recebido agora". Marcar como recebido gera Entrada automática no Caixa (mesmo padrão do
  Contas a Pagar). Pensado pra resolver o caso de faturar uma OS (serviço entregue/cobrado) sem o
  cliente ter pago tudo na hora.
- **Notas Fiscais**: upload manual de XML (NFe/NFS-e) organizado por mês de competência
  (Supabase Storage), vínculo opcional com uma OS. Botão "Versão para o cliente" interpreta o XML
  e monta um recibo HTML (não é o DANFE oficial, sem código de barras/QR code).
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

1. **Parte fiscal (NÃO bloqueia o uso na loja)**: emissão de NFC-e (peças) e NFS-e (serviço) via
   Focus NFe, plano básico. **Assinado nesta sessão** — a usuária criou a conta pelo celular
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
   **Pendências reais, em aberto — retomar numa sessão futura**:
   - **NFS-e**: ela precisa **contatar o suporte da Focus NFe** (chat/WhatsApp no painel deles)
     pedindo pra habilitar a emissão de NFS-e pra Araraquara/SP na empresa dela. Sem isso, não dá
     pra validar o formato da resposta da NFS-e (ainda é melhor esforço, não confirmado — ver
     acima).
   - **NFC-e**: ainda **não foi testada de verdade** — a sessão foi pausada logo depois do
     terceiro erro (NFS-e), antes dela tentar "Emitir NFC-e" numa OS com peça faturada. É o
     próximo passo natural (não depende do suporte da Focus NFe, deve funcionar independente da
     NFS-e). **Primeira coisa a fazer numa sessão futura sobre esse assunto.**
   - Token de **produção** (a assinatura já é paga, então ela tem os dois) só deve ir pra
     Configurações quando a emissão em homologação estiver validada de ponta a ponta — NFC-e e
     NFS-e ainda não estão.
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
   precisa saber que a Focus NFe existe, só usa o Sakura System). **Ponto em aberto, não verificado
   ainda** (o site de documentação da Focus NFe fica bloqueado no ambiente sandbox, não dá pra
   confirmar por aqui): pra emitir nota normalmente é preciso certificado digital vinculado ao
   CNPJ — NFC-e (peça) muitos estados dispensam certificado do lojista via CSC do próprio software
   house, então dá pra automatizar de ponta a ponta; **NFS-e (serviço) varia por prefeitura** —
   algumas cidades pedem certificado digital da própria loja, outras só usuário/senha do portal
   municipal (mesma variável de ICMS/ISS por estado/município já citada na seção 1, fase 3). Antes
   de prometer automação 100% em qualquer cidade, confirmar direto com o suporte da Focus NFe: (a)
   se dá pra cadastrar CNPJ de cliente numa conta só sem ele precisar logar lá, e (b) o que muda de
   cidade pra cidade na NFS-e.

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
fornecedores etc.) — o único módulo que falta é a emissão de nota fiscal (item 1 desta seção), que
não bloqueia o uso, só é emitida por fora enquanto isso.

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
Contas a Pagar, rodada e confirmada por ela nesta sessão). **`0044`** (campos novos em
`configuracoes_fiscais_loja` pra NFS-e — código do município, item da lista de serviço, alíquota
ISS, código tributário do município), criada nesta sessão, validada num Postgres local e **já
confirmada rodando no Supabase real dela** — falta só ela preencher esses campos novos em
Configurações → "Dados fiscais da loja" antes de testar a emissão de NFS-e (a de NFC-e não
depende dela).

### Montar um projeto Supabase do zero (loja nova / outro computador)

Rodar, **nessa ordem**, todo o conteúdo de cada arquivo em `supabase/migrations/*.sql` (SQL
Editor do Supabase — abrir cada um, copiar tudo, colar numa "New query", clicar "Run") — de `0001`
até `0044`. Todas são idempotentes.

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

**Passo único (só na primeira vez, já feito)**: `github.com/caranovavidanova/sakura-system-ace` → Settings →
Secrets and variables → Actions → criar `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`; e Settings
→ Actions → General → "Workflow permissions" → "Read and write permissions".

**Toda vez que quiser publicar uma versão nova**:

1. Peça pra eu atualizar o campo `"version"` do `package.json` pro número novo primeiro, numa
   mensagem separada — ex: "atualiza a versão pra 0.1.4 e publica". **Importante**: o nome da
   release no GitHub vem desse campo, **não** da tag do Git — sem esse passo, o `electron-builder`
   atualiza a release errada em vez de criar uma nova.
2. Depois que eu confirmar que atualizei e mergeei, no terminal:
   ```powershell
   git checkout main
   git pull origin main
   git tag v0.1.4
   git push origin v0.1.4
   ```
   (o número da tag precisa ser **exatamente igual** ao `"version"` do `package.json`.)

Isso dispara o build automaticamente no GitHub — demora uns 5 a 10 minutos. O instalador aparece
em `github.com/caranovavidanova/sakura-system-ace/releases`. O Windows/SmartScreen deve avisar "editor
desconhecido" (normal sem certificado pago — "Mais informações → Executar assim mesmo"). PCs já
atualizados se atualizam sozinhos na próxima tag.

**Duas pegadinhas já corrigidas** (não devem mais acontecer, mas documentado caso reapareçam): (a)
por padrão o `electron-builder` publica a release como rascunho invisível — corrigido com
`"releaseType": "release"` no `publish` do `package.json`; (b) publicar uma tag sem antes
atualizar `"version"` no `package.json` faz o build atualizar a release **anterior** em vez de
criar uma nova (o nome da release vem do `package.json`, não da tag) — por isso o passo 1 acima é
sempre antes da tag, nunca depois.

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
- `package.json` em `"version": "0.9.8"` (o parágrafo abaixo é histórico de uma sessão anterior — a
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
