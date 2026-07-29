# Sakura System — AutoCenter Edition — Estado do Projeto

> Este arquivo existe para que qualquer sessão futura (eu, sem memória da conversa) consiga
> entender o projeto e continuar exatamente de onde parou. Sempre que uma funcionalidade nova
> for concluída e validada pelo usuário, **atualize este arquivo** (não deixe ele ficar desatualizado).

## 1. Quem é o usuário e como trabalhar com ele

- Sem experiência prévia em programação. **Explicar decisões técnicas em linguagem simples**, sem
  assumir conhecimento de jargão.
- Antes de decisões estruturais importantes (arquitetura, bibliotecas, modelagem de dados),
  **apresentar opções + recomendação e esperar confirmação** — não decidir sozinho.
- Construir em **etapas pequenas e testáveis**. Mostrar funcionando antes de avançar.
- O usuário testa em uma máquina Windows local (terminal integrado do VS Code / PowerShell). Ele
  copia e cola os comandos que eu forneço — eu não tenho acesso à máquina dele.
- E-mail: caranovavidanova@gmail.com.
- **Sempre que eu aprender uma preferência de trabalho nova** (pedida explicitamente ou percebida ao
  longo da conversa), **documentar aqui no PROJETO_STATUS.md** — não só nas decisões técnicas da
  seção 3, mas qualquer coisa sobre *como* o usuário quer que eu trabalhe. Sessões futuras não têm
  memória da conversa, só deste arquivo.
- **Este arquivo carrega sozinho em toda sessão nova** — `CLAUDE.md` importa `AGENTS.md` e
  `PROJETO_STATUS.md` (`@AGENTS.md` / `@PROJETO_STATUS.md`), então não é preciso o usuário colar ou
  anexar este arquivo de novo pra eu ter esse contexto. Basta abrir uma sessão nova apontando pro
  repositório `caranovavidanova/amigao` (ex: Claude Code on the web, `claude` no terminal dentro da
  pasta do projeto, etc).

## 2. O que é o projeto

**Sakura System** é uma linha de sistemas de gestão empresarial por nicho. Esta é a primeira edição:
**SSACE — Sakura System AutoCenter Edition**, para autocenters/borracharias. Referência de mercado:
S3Auto (Comsis) — um ERP tradicional e funcional, mas com UX densa/datada. O diferencial do SSACE é
UX simples e moderna, mantendo as funções essenciais de um ERP de autocenter.

Depois do SSACE validado, a ideia é criar outras edições (ex: Supermarket Edition), reaproveitando a
base arquitetural.

### Identidade visual

- Paleta: rosa `#FFC9F3`, roxo `#B38DAC`, cinza `#C7C7C7` (implementada em
  `src/styles/globals.css` como `--color-sakura-*`, com variantes de contraste
  `sakura-purple-dark` e `sakura-pink-soft` criadas para acessibilidade).
- Estilo: painel visual e acolhedor, navegação lateral por módulos, bastante espaçamento (oposto
  da densidade de ERP tradicional). Os indicadores tipo velocímetro/gauge do rascunho inicial não
  vingaram — foram trocados por cartões de tendência com sparkline (ver seção 7, redesenho do Início).
- **Estilo "glassmorphism" (nesta sessão)**: o app inteiro passou a usar blocos arredondados e
  translúcidos (`sakura-card` em `src/styles/globals.css`, com `backdrop-filter: blur`) flutuando
  sobre um fundo rosa com brilho difuso (`sakura-shell-bg`) — a pedido do usuário, que mandou prints
  de referência (cartões de vidro fosco tipo iOS/dashboard "bento grid"). O tom dos blocos é bem mais
  branco/claro que o rosa saturado do fundo **de propósito** — pra se destacar por cor, não só pelo
  efeito de blur. Ver seção 7 pro detalhe de onde foi aplicado.
- **Logo**: `public/sakura-icon.svg` (flor sozinha, usada como favicon/ícone da janela — continua
  com a flor) e `public/sakura-logo.svg` (usado no menu lateral via `src/components/Logo.tsx`).
  **A pedido do usuário, `sakura-logo.svg` NÃO tem mais a flor** — só o wordmark "Sakura System" /
  "by Sakura Corp" em itálico serifado, com fonte maior aproveitando o espaço que a flor ocupava
  (viewBox `0 0 620 170`, texto começando perto da margem esquerda). A flor só aparece no ícone da
  janela/favicon (`sakura-icon.svg`), não mais no menu lateral. Ambos os arquivos foram desenhados
  à mão em SVG (gradientes + `<text>` de verdade), **não** são a arte oficial do usuário.
  - **Pendência**: o usuário tem um arquivo SVG "oficial" da logo (gerado por um traçador de
    imagem, tipo VTracer) com a flor + texto desenhados como ~200 `<path>` vetoriais em vez de
    `<text>`. Ele tentou colar esse arquivo direto no chat duas vezes; na primeira veio cortado
    (arquivo grande demais pro limite de uma mensagem), na segunda veio completo mas **copiar à
    mão path por path não é confiável nessa escala** — na tentativa dessa sessão, sumiram pedaços
    de letras ("Sakura System" virou "Sal u a System"). **Não tente transcrever esse SVG via
    chat de novo.** Peça pro usuário mandar como **arquivo anexado** (upload/drag-and-drop) em vez
    de colar o código — só assim dá pra ler o arquivo com fidelidade total (via `Read` tool) sem
    risco de erro de transcrição.

## 3. Decisões técnicas já tomadas (não reabrir sem motivo forte)

| Decisão | Escolha | Por quê |
|---|---|---|
| Tipo de app | Desktop (Windows) via Electron | Definido pelo usuário desde o início |
| Frontend | React + Vite + TypeScript (não Next.js) | Perguntado ao usuário explicitamente — Next.js é para apps com servidor; Electron não precisa disso |
| Empacotamento Electron | `vite-plugin-electron` + `vite-plugin-electron-renderer` | Um único `vite.config.ts` builda renderer + main + preload com hot reload |
| Estilo | Tailwind CSS v4 (`@tailwindcss/vite`, config via `@theme` no CSS) | Rapidez para manter a paleta consistente |
| Dados | Supabase (Postgres em nuvem) | Decisão do usuário — pensando em app mobile futuro, multi-loja, e emissão fiscal (que exige internet de qualquer forma) |
| Roteamento | `react-router-dom` com `HashRouter` | Electron carrega arquivo local (`file://`); `HashRouter` evita problemas de rota que `BrowserRouter` teria |
| Versionamento | SemVer + `CHANGELOG.md` | Pedido explícito do usuário — só "lançar" versão quando testado e funcionando |
| Lint | ESLint 9 flat config (`eslint.config.js`) só com `rules-of-hooks` + `exhaustive-deps` | `eslint-plugin-react-hooks` v7 traz um conjunto de regras experimentais (derivadas do React Compiler) que reprovariam o padrão "fetch on mount" usado em todas as páginas; optamos por só as duas regras clássicas |
| Autenticação | Supabase Auth (e-mail/senha), mas o operador só digita **usuário** — o app monta `usuario@sakura.local` por baixo dos panos | Pedido explícito do usuário (login rápido, sem digitar e-mail). Ver seção 6 pra detalhes/limitações |
| Permissões por módulo | Checadas **na interface do app**, não reforçadas em RLS por categoria | Decisão explícita do usuário nesta sessão — mais rápido de construir, resolve o problema real (organizar telas por operador); ver seção 6 pro trade-off de segurança |
| RLS das tabelas de negócio | Exige **login** (`auth.uid() is not null`), mas não reforça permissão por módulo | Usuário escolheu entre 3 opções apresentadas (só login / login + por módulo / deixar como estava) — ver item 1 da seção 6. Fecha o buraco de acesso sem login; reforço por módulo fica pra depois se o risco mudar |
| Fluxo de Git **enquanto não existir uma v1.0 oficial publicada** | Sempre mergear as mudanças **direto em `main`** ao final de cada tarefa (não deixar PR aberto esperando aprovação manual) | Pedido explícito do usuário ("sempre já inclui tudo na main... já que não tem uma versão oficial publicada ainda"). Ainda assim abrir PR faz parte do processo — só que ele já é mergeado pela própria sessão em vez de ficar esperando. **Sempre informar no chat, em português simples, os comandos exatos e onde rodar cada um** (terminal do Windows vs. SQL Editor do Supabase) depois do merge. Revisitar essa decisão quando existir uma v1.0 publicada de verdade. |
| Ir pra produção sem emissão fiscal pronta | Usuária pode instalar e usar o sistema na borracharia **agora** (cadastro, OS, estoque, caixa) e continuar emitindo nota fiscal por fora até a emissão automática ficar pronta | Escolhida entre 2 opções apresentadas nesta sessão — desbloqueia o uso real na loja sem esperar o projeto de integração fiscal (grande, depende de escolher provedor + certificado digital) |
| Empacotamento do instalador Windows | Instalador simples (NSIS) + **atualização automática via GitHub Releases** (`electron-builder` + `electron-updater`, já preparados nesta sessão) | Escolhida entre 2 opções apresentadas nesta sessão — evita ter que reinstalar manualmente em cada loja toda vez que sair uma versão nova |

## 4. Estrutura de pastas

```
amigao/                        (raiz do repositório GitHub: caranovavidanova/amigao)
├── electron/main.ts            # processo principal (janela, autoUpdater, abre DevTools em modo dev)
├── electron/preload.ts         # bridge (hoje só expõe versão do app)
├── src/
│   ├── main.tsx, App.tsx       # entrada React + rotas (App.tsx decide Login vs. app conforme sessão)
│   ├── contexts/AuthContext.tsx # sessão do Supabase Auth + perfil do operador logado (hook useAuth)
│   ├── components/             # Sidebar.tsx, Logo.tsx, Sparkline.tsx, MiniCalendario.tsx, PermissaoRoute.tsx (guarda de rota por permissão), Modal.tsx (modal genérico reutilizável, usado pelos previews de NFe/NFS-e/Garantia)
│   ├── lib/                    # supabase.ts + um arquivo por entidade (clientes.ts, pecas.ts, servicos.ts, estoque.ts, ordensServico.ts, caixa.ts, operadores.ts, funcionarios.ts, auth.ts, errors.ts, categorias.ts, categoriasCaixa.ts, contagens.ts, garantias.ts) + feriados.ts (feriados nacionais, com Páscoa calculada) + configuracoes.ts (juros de parcelamento + texto de garantia) + garantiaTexto.ts (substitui {cliente}/{veiculo}/{itens}/{data} no template de garantia por dados reais da OS)
│   ├── pages/<modulo>/          # uma pasta por módulo: painel, clientes, estoque, servicos, ordens-servico, funcionarios, caixa, relatorios, lucratividade, garantias, login, configuracoes
│   │   └── cada pasta tem: <Modulo>Page.tsx (lista) + <Modulo>Form.tsx (formulário)
│   │       — exceção: pages/estoque/ não tem mais "Peças" como módulo separado (ver seção 7);
│   │       EstoquePage.tsx tem 4 abas: "Produtos" (ProdutosSection.tsx + PecaForm.tsx),
│   │       "Movimentações" (MovimentacoesSection.tsx + MovimentoForm.tsx), "Contagem"
│   │       (ContagemSection.tsx — inventário físico, ver seção 7) e "Relatórios"
│   │       (RelatoriosEstoqueSection.tsx — estoque físico-financeiro/saldo por situação/sem
│   │       movimentação, ver seção 7). pages/garantias/GarantiasPage.tsx é só lista (sem form —
│   │       lê ordens_servico_itens + pecas.prazo_garantia_dias, não tem tabela própria).
│   │       pages/servicos/ é o catálogo de serviços (só lista + form, sem abas). pages/ordens-servico/
│   │       ganhou FaturamentoCard.tsx (tela de faturamento com forma de pagamento + parcelas
│   │       calculadas, ver seção 7 — SimulacaoParcelas.tsx existiu por uma sessão e foi removido, não
│   │       vingou). pages/configuracoes/ ganhou JurosParcelasSection.tsx (config de juros por
│   │       parcela), CategoriasSection.tsx (CRUD de categorias de produto, ver seção 7),
│   │       CategoriasCaixaSection.tsx (CRUD de categorias de entrada/saída do Caixa, ver seção 7) e
│       TextoGarantiaSection.tsx (template do texto de garantia, ver seção 7). pages/funcionarios/
│       é um módulo novo (FuncionariosPage.tsx + FuncionarioForm.tsx, sem abas, padrão Editar/
│       Inativar — ver seção 7). pages/caixa/ ganhou abas: CaixaPage.tsx virou só o orquestrador
│       (abas + carregamento), com DiarioSection.tsx (comportamento antigo, agora isolado),
│       EntradaSaidaSection.tsx (reusado tanto pra aba "Entradas" quanto "Saídas", parametrizado
│       por `tipo`) — ver seção 7
│   ├── styles/globals.css      # paleta Sakura System (Tailwind v4 @theme)
│   └── types/                  # um arquivo por entidade (cliente.ts, peca.ts, servico.ts, estoque.ts, os.ts, caixa.ts, operador.ts, funcionario.ts, categoria.ts, categoriaCaixa.ts, contagem.ts) + configuracao.ts (JurosParcela)
├── supabase/migrations/         # SQL numerado sequencialmente (0001 a 0021), todas idempotentes (seguro rodar de novo)
├── build/icon.png               # ícone do app (1024x1024, gerado a partir de public/sakura-icon.svg) usado pelo electron-builder
├── .github/workflows/release.yml # builda + publica o instalador Windows no GitHub Releases quando uma tag "v*" é enviada (ver seção 9)
├── eslint.config.js             # flat config do ESLint 9
├── CHANGELOG.md                 # ainda tudo em "[Não lançado]" — v1.0.0 NÃO foi tagueada (usuário pediu pra esperar)
└── .env (local, não commitado)  # VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY (chave "anon"/publishable)
```

**Padrão de código estabelecido** (seguir em módulos novos):

- Cada entidade tem: `types/<entidade>.ts` (interfaces + tipo `Novo<Entidade>`), `lib/<entidade>.ts`
  (funções `listar`, `criar`, `excluir` usando o client `supabase`), `pages/<modulo>/<Modulo>Page.tsx`
  (lista + estado de carregamento/erro) e `<Modulo>Form.tsx` (formulário controlado).
- Erros do Supabase **não são `instanceof Error`** — sempre usar `mensagemDeErro()` de
  `src/lib/errors.ts` para exibir a mensagem real (não o `instanceof Error ? ... : "erro genérico"`).
- **Nunca usar `window.prompt()`** — Electron não suporta. `alert()` e `confirm()` funcionam bem.
- Toda tabela nova precisa de RLS + policy (ver seção 6 sobre a dívida técnica de segurança).
- Ao criar valores default a partir de variáveis de ambiente (`import.meta.env.VITE_*`), usar `||`
  e não `??` para o fallback — o Vite injeta variáveis ausentes como **string vazia**, não
  `undefined`, e `??` só substitui `null`/`undefined` (ver bug corrigido na seção 6).

**Skill `/gerar-modulo`** (`.claude/skills/gerar-modulo/SKILL.md`, criada nesta sessão): automatiza a
criação de um módulo novo inteiro (migration + types + lib + página + form + registro em `MODULOS`/
`App.tsx`) seguindo esse padrão de código. Uso: digitar `/gerar-modulo <Nome do módulo>` (ex:
`/gerar-modulo Fornecedores`). Ela pergunta os campos da entidade antes de codar se o usuário não
detalhar. Preferir essa skill a fazer o andaime manualmente sempre que o pedido for "módulo/cadastro
novo" — é mais rápido e não esquece nenhum passo (RLS, permissão, rota).

## 5. Modelagem de dados (Supabase / Postgres) — como está hoje

- **`clientes`**: id, nome (rótulo na tela vira "Razão social" quando `tipo_pessoa` é jurídica, mesmo
  campo), tipo_pessoa (`fisica`/`juridica`, default `fisica` — migration 0021; rótulo do campo
  cpf_cnpj também muda pra "CPF" ou "CNPJ" na tela conforme esse valor), cpf_cnpj, telefone, email,
  cep, rua, numero, bairro, cidade, uf, data_nascimento (migration 0009 — usada pro calendário do
  Início marcar aniversário do mês), criado_em
- **`veiculos`**: id, cliente_id (FK), placa, marca, modelo, ano, cor, km_atual, criado_em
- **`pecas`**: id, codigo_interno (exibido como "Referência" na tela), codigo_barras, descricao,
  marca, modelo, aplicacao, unidade, preco_custo, preco_venda, ncm, cest, cfop_padrao, origem,
  cst_ou_csosn, aliquota_icms, categoria_id (FK categorias, opcional — migration 0016),
  prazo_garantia_dias (int, opcional — migration 0016, usado pelo módulo Garantias), ativo, criado_em
  (campos codigo_barras/marca/modelo/aplicacao/cest/origem são da migration 0010). **Margem % não é
  salva no banco** — é só calculada na tela a partir de `preco_custo`/`preco_venda`, pra não duplicar
  um dado que já dá pra derivar dos outros dois.
- **`categorias`** (migration 0016): id, nome (único), criado_em. Gerenciada em Configurações
  (`CategoriasSection.tsx`, admin), selecionável no cadastro de produto. Simples de propósito — não
  tem hierarquia nem campos extras.
- **`servicos`** (migration 0011 — catálogo de serviços, análogo a `pecas` mas sem estoque): id,
  codigo_interno (opcional), descricao, preco_padrao, ativo, criado_em
- **`estoque_movimentos`**: id, peca_id (FK), tipo (`entrada`/`saida`), quantidade, motivo
  (`compra`/`venda`/`ajuste`/`uso_em_os`), referencia, criado_em
- **`ordens_servico`**: id, cliente_id (FK), veiculo_id (FK, opcional), status
  (`aberta`/`em_andamento`/`concluida`/`faturada`), km_entrada, descricao_problema (rótulo na tela é
  "Observação", mesmo campo), forma_pagamento, parcelas (int, default 1 — migration 0013, preenchido
  no faturamento), data_abertura, data_fechamento. Campos da migration 0012: previsao_entrega,
  data_retorno (timestamptz, opcionais — "Prazos" na tela), vendedor_id (FK **funcionarios**, desde a
  migration 0019 — era FK operadores antes, ver item novo abaixo)/criado_por_id/atualizado_por_id
  (FK operadores — autoria de sistema, isso continua). **Os três campos de checklist do veículo
  (direção hidráulica/ar condicionado/direção elétrica) da migration 0012 foram removidos na migration
  0013** — o usuário pediu pra tirar, não vingou.
- **`ordens_servico_itens`**: id, ordem_servico_id (FK), tipo (`peca`/`servico`), peca_id (FK opcional,
  só para tipo peça), servico_id (FK opcional, só para tipo serviço — migration 0012; item de serviço
  pode ficar sem servico_id quando for "avulso", digitado na hora em vez de vir do catálogo),
  tecnico_id (FK **funcionarios**, opcional — migration 0013 criou apontando pra operadores, migration
  0019 repontou pra funcionarios, técnico responsável por aquele item especificamente, diferente do
  vendedor/atendente que é da OS toda), descricao, quantidade, preco_unitario, desconto
- **`configuracoes_juros_parcelas`** (migration 0013): numero_parcelas (PK, 2 a 12), juros_percentual.
  Editável só pelo admin em Configurações — define quanto de juros (% sobre o total) é cobrado quando
  o cliente parcela no cartão de crédito ao faturar uma OS. 1x é sempre à vista, sem juros, não tem
  linha aqui.
- **`caixa_movimentos`**: id, data, ordem_servico_id (FK opcional, único — 1 lançamento por OS
  faturada), tipo (`entrada`/`saida`), forma_pagamento, valor, descricao, categoria_id (FK
  categorias_caixa, opcional — migration 0020, usado pelas abas "Entradas"/"Saídas" do Caixa)
- **`categorias_caixa`** (migration 0020): id, nome, tipo (`entrada`/`saida`), criado_em. Gerenciada
  em Configurações (`CategoriasCaixaSection.tsx`, admin), selecionável ao lançar um movimento manual
  no Caixa. Ex: "Aluguel"/"Mercado"/"Limpeza" (saída) ou "Sucata" (entrada). Não tem relação com
  `categorias` (que é só pra produtos) — tabela separada porque o conceito é diferente (tipo
  entrada/saída em vez de agrupar produto).
- **`funcionarios`** (migration 0019): id, nome, cargo (texto livre, opcional), operador_id (FK
  operadores, opcional e único — presente quando esse funcionário também tem login no sistema),
  ativo, criado_em. Cadastro leve pra gente que não precisa logar no sistema mas precisa ser
  selecionável como técnico (peça/serviço na OS) ou vendedor/atendente (OS toda). **Todo operador
  criado em Configurações ganha automaticamente um `funcionarios` espelhado** (nome/status
  sincronizados via trigger `sincroniza_funcionario_operador`), então o seletor de técnico/vendedor
  sempre junta quem loga e quem não loga sem exigir cadastro duplicado. Gerenciado no módulo
  "Funcionários" (`FuncionariosPage.tsx`, padrão Editar/Inativar — sem excluir de verdade, porque
  pode estar referenciado em OS antigas).
- **`contagens_estoque`** (migration 0017): id, peca_id (FK), quantidade_contada, saldo_sistema
  (o que o sistema calculava no momento), diferenca, observacao, operador_id (FK operadores),
  criado_em. Histórico de contagens de inventário físico — ao salvar uma contagem com diferença, o
  app gera automaticamente um lançamento de ajuste em `estoque_movimentos` (mesmo padrão do "Qtde.
  estoque inicial" do cadastro de produto).
- **`configuracoes_garantia`** (migration 0018): tabela "singleton" (1 linha só, `id` fixo em 1) com
  `texto` — template do texto de garantia usado pelos botões "Imprimir garantia"/"Baixar garantia" na
  aba Fechamento da OS, com placeholders `{cliente}`/`{veiculo}`/`{itens}`/`{data}` substituídos na
  hora (`lib/garantiaTexto.ts`). Editável só pelo admin em Configurações
  (`TextoGarantiaSection.tsx`).
- **`operadores`**: id (= id do usuário no Supabase Auth), usuario (único), nome, admin (bool),
  permissoes (`text[]` com as chaves de `MODULOS` em `src/types/operador.ts`: painel, clientes,
  estoque, servicos, ordens_servico, caixa, relatorios, lucratividade, garantias), ativo, criado_em.
  Única tabela com RLS de verdade (baseada em login) — ver seção 6.

Regra de negócio já implementada: ao criar uma OS com item tipo peça, gera automaticamente uma
saída em `estoque_movimentos` (motivo `uso_em_os`). Ao faturar uma OS, gera automaticamente uma
entrada em `caixa_movimentos` com o valor total da OS. Garantia dada ao cliente na venda (módulo
"Garantias") **não tem tabela própria** — é calculada juntando `ordens_servico_itens` (tipo peça) +
`pecas.prazo_garantia_dias` + `ordens_servico.data_fechamento` (vencimento = fechamento + prazo).

## 6. Dívidas técnicas / pontos de atenção — IMPORTANTE

1. ~~RLS aberto nas tabelas de negócio~~ — **corrigido nesta sessão** (migration `0015_rls_exige_login.sql`):
   todas as tabelas de negócio (clientes, veículos, peças, estoque, serviços, OS, caixa, juros de
   parcelamento) agora exigem uma sessão autenticada (`auth.uid() is not null`) pra ler ou escrever —
   sem estar logado, nem com a chave `anon` dá mais pra acessar os dados direto pela API. **Permissão
   por módulo continua checada só na interface** (não no banco) — decisão explícita do usuário nesta
   sessão, ao escolher entre três opções apresentadas: (a) só exigir login [escolhida], (b) exigir
   login + reforçar por módulo no banco também, (c) deixar como estava. A opção (b) ficou pra uma
   etapa futura se o risco mudar (ex: sistema vendido pra terceiros, não só famílias de confiança) —
   um operador logado com permissão só de "Caixa", por exemplo, hoje ainda consegue chamar a API do
   Supabase direto pra mexer em "Clientes" se tentar de propósito; o que já não é mais possível é
   fazer isso **sem estar logado**.
2. **Autenticação implementada nesta sessão** (Supabase Auth, login com usuário/senha — ver seção 3 e
   7 pros detalhes). Ainda faltam: (a) **redefinir senha de operador esquecida** — hoje não tem como
   o admin resetar a senha de outro operador pelo app (só criar; `supabase.auth.signUp` não permite
   isso do lado cliente sem expor a chave secreta) — precisaria de uma Supabase Edge Function com a
   service role key, ainda não construída; (b) **multi-loja** — arquitetura continua de loja única
   (ver decisão na seção 3 dessa mesma conversa/sessão).
3. **Uma chave secreta do Supabase (`sb_secret_...`) foi colada no chat pelo usuário em algum
   momento**, por engano (só a `anon`/publishable era necessária). Não foi usada/armazenada no
   código em nenhuma sessão. Vale considerar sugerir ao usuário que rotacione essa chave em
   Settings → API Keys do Supabase, se isso ainda não tiver sido feito. (Nesta sessão o usuário só
   colou a chave `anon`, que é pública por design — sem problema.)
4. **Sem testes automatizados** (nenhum framework de teste configurado ainda).
5. ~~App nunca foi empacotado de verdade~~ — **configurado nesta sessão** (ver seção 7): `package.json`
   ganhou a seção `"build"` (ícone, `appId`, instalador NSIS) e um workflow do GitHub Actions
   (`.github/workflows/release.yml`) builda e publica o instalador automaticamente quando uma tag
   `v*` é enviada. **Ainda falta**: assinatura de código (o Windows/SmartScreen vai avisar "editor
   desconhecido" no instalador — normal pra quem não tem um certificado de assinatura pago; não
   impede a instalação, só exige clicar em "Mais informações → Executar assim mesmo"). Rotacionar essa
   decisão se algum dia quiserem distribuir pra muitas lojas de terceiros (aí vale considerar comprar
   um certificado de assinatura de código).
6. ~~`electron-updater` sem servidor de atualização configurado~~ — **resolvido nesta sessão**: o
   `publish` do `electron-builder` aponta pro GitHub Releases deste repositório, então toda vez que uma
   tag nova é publicada (ver tutorial na seção 9), os apps já instalados nas lojas baixam e aplicam a
   atualização sozinhos (`autoUpdater.checkForUpdatesAndNotify()`, já chamado em `electron/main.ts`
   desde antes, agora com um feed de verdade pra consultar).
7. **Ambiente de sandbox onde o Claude roda (nuvem) não consegue acessar `*.supabase.co`** — política
   de rede bloqueia (confirmado, erro 403 do proxy da própria plataforma). Isso significa que testes
   de ponta a ponta contra o Supabase real **só podem ser feitos pelo usuário, na máquina dele**. Do
   lado do sandbox, a validação possível é: `tsc --noEmit`, `vite build`, `npm run lint`, e
   screenshots via Playwright + `xvfb-run` (Electron real, headless) renderizando a UI — com dados
   mockados via `page.route()` interceptando as chamadas REST do Supabase, ou com `.env` ausente
   para ver os estados vazios/aviso. **Pra bugs de caminho de asset (imagens, ícones)**, testar servindo
   o `dist/` por HTTP (`python3 -m http.server`) não é suficiente — mascara problemas de caminho
   absoluto que só aparecem de verdade com `file://` (ver item 10 abaixo). Preferir sempre validar
   com o Electron real via `playwright._electron.launch({ executablePath:
   "node_modules/.bin/electron", args: ["dist-electron/main.js"] })` sob `xvfb-run -a`.
8. **Havia um bug real de tela em branco**: `src/lib/supabase.ts` usava `??` para dar fallback num
   endereço de teste quando as variáveis de ambiente não estivessem definidas — mas um `.env`
   copiado de `.env.example` define as variáveis como **string vazia**, não ausente, e `??` não
   troca strings vazias. Resultado: `createClient("")` lançava `supabaseUrl is required` antes do
   React desenhar qualquer coisa. **Corrigido** trocando para `||`. Se esse erro voltar a aparecer
   em qualquer lugar do código, é o mesmo padrão de bug.
9. **Vercel**: o repositório tem uma integração de deploy automático na Vercel conectada (deixada de
   quando este repo era um site, antes da reescrita como app Electron). Isso faz o PR #2 (GitHub)
   mostrar um check falhando que **não tem relação com o código** — um app desktop Electron não
   roda hospedado numa plataforma de deploy web. Não dá pra desconectar isso pelo código; só pelo
   painel da Vercel. Perguntei ao usuário se quer que eu oriente a remoção; ainda sem resposta.
10. **Havia um bug real de logo/imagens quebradas só no instalador de verdade** (não aparecia no
    `npm run dev`): imagens referenciadas com caminho absoluto (`/sakura-logo.svg`,
    `/sakura-login-bg.svg`) funcionam em modo dev porque o Vite serve tudo a partir de `/`, mas
    quebram no app empacotado porque o Electron carrega o `index.html` via `file://`, onde um caminho
    começando com `/` tenta ler a partir da **raiz do disco**, não da pasta do app. Só foi descoberto
    testando o instalador de verdade (v0.1.0) — o sandbox não tinha pego, porque os testes anteriores
    rodavam com um servidor HTTP local, que mascara esse problema. **Corrigido**: `vite.config.ts`
    ganhou `base: "./"` (caminhos relativos no build) e as referências em `Logo.tsx`/`LoginPage.tsx`
    passaram a usar `import.meta.env.BASE_URL` em vez do caminho absoluto direto. Validado rodando o
    Electron de verdade (não só o navegador) via `xvfb-run` + `playwright._electron`. **Se aparecer
    imagem quebrada só no instalador (nunca no `npm run dev`), é esse mesmo padrão de bug** — procurar
    por `src="/` ou `url(/` direto no código (fora de `import`/`public/`) em vez de
    `import.meta.env.BASE_URL`.
11. **Havia um bug real de campos de formulário "sem digitar"**: nenhum lugar do código declarava
    `color-scheme`, então o Chromium/Electron usava o tema do **Windows** (claro/escuro) pra decidir a
    cor padrão do texto dentro de `<input>`/`<select>`/`<textarea>` — com o Windows em modo escuro, o
    texto digitado saía **branco sobre fundo claro** (invisível, mas era digitado normalmente; parecia
    que o campo não aceitava nada). Só foi descoberto testando no instalador de verdade da v0.1.1 — o
    sandbox roda em modo claro, não reproduzia. **Corrigido**: `globals.css` ganhou `color-scheme:
    light` no `:root` (impede o navegador de re-temizar os campos pro escuro) e uma regra `color`
    explícita pra `input`/`select`/`textarea`, como reforço. Validado simulando `colorScheme: 'dark'`
    no Playwright. **Se algum campo "não aceitar digitação" de novo, é provável que seja o mesmo
    padrão** (texto sendo digitado mas invisível) — confirmar selecionando o texto do campo com o
    mouse antes de investigar outra coisa.
12. **Bug real de "Excluir" sem efeito visível em Clientes**: `handleExcluir` em `ClientesPage.tsx`
    chamava `excluirCliente()` sem `try/catch` — quando a exclusão falhava (ex: cliente com Ordem de
    Serviço vinculada, que a migration 0005 bloqueia com `on delete restrict` de propósito, pra não
    perder histórico), o erro não aparecia em lugar nenhum, dando a impressão de que o botão não fazia
    nada. `ProdutosSection.tsx` e `ServicosPage.tsx` já tratavam isso certinho — só Clientes tinha
    ficado pra trás. **Corrigido**: adicionado `try/catch` com `setErro()`, igual ao padrão das outras
    duas telas, mais uma mensagem amigável específica pro caso de OS vinculada (em vez do erro cru do
    Postgres). **Se um botão de "Excluir"/ação parecer não fazer nada em alguma tela nova, confirmar
    que a função tem `try/catch` chamando `setErro(mensagemDeErro(err))` — é fácil esquecer.**
13. **Bug real de migration não idempotente, achado pela usuária rodando de verdade**: a migration
    `0015_rls_exige_login.sql` dropava a policy **antiga** (`..._acesso_temporario`) antes de criar a
    nova (`..._acesso_autenticados`), mas nunca dropava a policy **nova** antes de recriá-la. Rodar a
    migration uma segunda vez (ex: depois de uma tentativa que falhou no meio, ou por engano) dava
    `ERROR: 42710: policy "..._acesso_autenticados" for table "..." already exists` a partir da
    primeira tabela cuja policy nova já existia — travando o resto do script. **Corrigido**
    adicionando `drop policy if exists "..._acesso_autenticados" on ...` antes de cada `create policy`
    nas 9 tabelas do arquivo. **Esse é o padrão a seguir em toda migration que reafirma "idempotente,
    seguro rodar de novo" no comentário**: sempre dropar o nome **final** da policy antes de criar,
    não só o nome antigo que ela está substituindo (as migrations 0016/0017, escritas do zero já
    seguindo esse padrão, não tinham esse problema).

## 7. O que já está pronto e validado (pelo usuário, rodando de verdade)

Todos os itens abaixo foram testados pelo usuário na máquina dele e confirmados funcionando:

1. ✅ Cadastro de Clientes (+ veículo)
2. ✅ Cadastro de Peças/Produtos (com campos fiscais NCM/CFOP/CST-CSOSN/ICMS)
3. ✅ Estoque (entrada/saída, saldo calculado)
4. ✅ Ordens de Serviço (cliente + veículo + itens de peça/serviço, baixa automática de estoque)
5. ✅ Caixa Diário (manual + automático via faturamento de OS) — **reorganizado** nesta sessão:
   agora mostra um card de "Lucro do dia", um resumo de totais por forma de recebimento (dinheiro,
   cartão, PIX...) e a tabela principal ganhou colunas de Origem (OS ou lançamento manual), Cliente
   e Lucro por lançamento, sem repetir informação — inspirado numa tela de um sistema concorrente
   que o usuário mostrou (que tinha a informação certa, mas espalhada e repetitiva).
6. ✅ Relatórios (comparativo diário/semanal/mensal)
7. ✅ Lucratividade (margem por peça/serviço, período filtrável)
8. ✅ Painel de Controle (gauges de faturamento e margem, fila de atendimento)

**Isso fecha 100% do escopo da v1 definido pelo usuário no início do projeto.** A v1.0.0 ainda não
foi formalmente "lançada" (tag/versão) — o usuário preferiu continuar em desenvolvimento antes de
fechar a versão.

**✅ Confirmado pelo usuário nesta sessão, rodando de verdade:**

- **Conexão real com o Supabase funcionando** — Painel de Controle mostrando dados reais (não mais
  o aviso "não configurado"), sem erros no console. Levou algumas idas e vindas por causa de erros
  de digitação no `.env` (ver dica de suporte abaixo) — no fim funcionou com a URL
  `https://rlgdjiowvnfzsedehyga.supabase.co` + chave anon/publishable.
- Correção da tela em branco (item 8 da seção 6).
- DevTools abre automaticamente em modo dev (`mainWindow.webContents.openDevTools()` quando há
  `VITE_DEV_SERVER_URL`) — facilita o usuário mandar prints de erro daqui pra frente. **Foi essa
  ferramenta que permitiu diagnosticar tanto o bug da tela branca quanto os erros de `.env` abaixo.**
- `npm run lint` funcionando (estava completamente quebrado — faltava `eslint.config.js` e os
  pacotes de lint do React nunca tinham sido instalados).
- Reorganização do Caixa Diário (item 5 acima).
- Logo do menu lateral sem a flor (só o wordmark, maior) — ver seção 2.

**Dica de suporte para a próxima vez que o usuário mexer no `.env`:** ele erra na edição manual com
uma certa frequência (não é falta de atenção, é só a curva de aprendizado normal de quem não
programa). Dois erros já vistos: (1) editar o `.env` errado porque o VS Code estava com uma pasta
"container" aberta e havia uma pasta `amigao` duplicada dentro dela — sempre confirme o caminho
com `pwd`/o prompt do terminal antes de editar; (2) colar o valor por cima do nome da variável sem
apagar o que já estava lá, duplicando o `VITE_SUPABASE_URL=VITE_SUPABASE_URL=...`. **A forma mais
confiável de corrigir remotamente (sem depender do editor)** é pedir pra rodar no mesmo terminal
que roda `npm run dev`:
```powershell
@"
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
"@ | Set-Content .env -Encoding utf8
```
e sempre confirmar com `Get-Content .env` antes de reiniciar o app — o Vite só lê o `.env` quando o
servidor inicia, não recarrega sozinho, então depois de editar sempre precisa `Ctrl+C` + `npm run dev`
de novo.
- Migrations idempotentes (`drop policy if exists` antes de cada `create policy`).

**⏳ Implementado e mergeado em `main` nesta sessão (PR [#4](https://github.com/caranovavidanova/amigao/pull/4)), ainda sem confirmação do usuário rodando com Supabase real** — validado no sandbox via `npm run build`, `npm run lint` e screenshots Playwright com dados simulados (sandbox não acessa `*.supabase.co`, ver item 7 da seção 6):

- **Múltiplos veículos por cliente**: `ClienteForm.tsx` agora tem uma lista de veículos (não mais
  um único), com botão "+ Adicionar veículo" e "Remover" por item. Só salva os que tiverem placa.
- **Correção de bug de rolagem**: o container raiz (`App.tsx`) não tinha altura travada na tela
  (`min-h-screen` sem `overflow-hidden`), então a página inteira rolava junto — inclusive o menu
  lateral e a logo, que sumiam da tela ao rolar um formulário grande. Corrigido travando a altura
  em `h-screen overflow-hidden` no container e deixando só o `<main>` rolar
  (`overflow-y-auto`); a `<Sidebar>` ficou `h-full shrink-0`. Se esse tipo de bug voltar em algum
  lugar novo do app (nova tela cheia, modal etc.), é o mesmo padrão: cheque se o elemento que
  deveria ficar fixo está dentro de um container sem altura travada.
- **"Estoque" virou uma categoria única**, absorvendo o que antes era o módulo separado "Peças" — a
  pedido do usuário, inspirado nos menus de um sistema de referência (S3Auto/Comsis) que ele usa
  na borracharia da família. O menu lateral só tem "Estoque"; dentro, duas abas:
  - **Produtos** (era a página "Peças"): cadastro de peças/produtos, agora com coluna de **estoque
    atual** (saldo calculado a partir de `estoque_movimentos`) e coluna de **Status** (Ativo/Inativo,
    com botão Inativar/Reativar — usa o campo `ativo` que já existia na tabela `pecas` desde o
    início, só não tinha UI pra ele ainda).
  - **Movimentações** (era a página "Estoque"): registrar entrada/saída + histórico, agora com um
    filtro "Produto" no histórico (mostra todas ou só as movimentações de um produto específico).
  - Do menu de referência (prints que o usuário mandou), **cherry-picked** só o que cabia sem mudar
    o modelo de dados. **Não implementado ainda** (fica pra próxima decisão, ver seção 8): Cadastro
    de Depósito (múltiplos locais de estoque), Entrada via NFe (importação de XML), Pedido de
    Compra / Cotações de fornecedor, Peças em Garantia, atualização de preço em massa por grupo,
    conceito de "grupo/categoria de produto" (o "Transferir produtos de categoria" do menu de
    referência) — todos exigiriam tabelas novas ou mudanças de schema, então precisam ser decididos
    com o usuário antes (ver seção 1: decisões estruturais não se decide sozinho).

**✅ Confirmado pelo usuário nesta sessão, rodando de verdade (login + permissões):**

- **Login com usuário e senha** (não e-mail — ver decisão na seção 3): tela nova (`LoginPage.tsx`),
  usa Supabase Auth por baixo (e-mail interno `usuario@sakura.local`, nunca exibido).
  **Sessão NÃO persiste entre aberturas do app** (`persistSession: false` em `src/lib/supabase.ts`)
  — a pedido explícito do usuário: o programa fica aberto o dia todo, então cada abertura deve pedir
  login de novo (diferente do padrão comum de "lembrar login"). Continua logado normalmente enquanto
  o app está aberto e em uso; só some ao fechar/reabrir ou clicar em "Sair".
- **Tabela `operadores`** (migration `0007_operadores.sql`) guarda nome, usuário, se é admin, e quais
  módulos cada um acessa (`permissoes`, um array com as chaves de `MODULOS`).
- **Tela "Configurações"** (só aparece pra quem é admin): lista de operadores em cards (com badges
  dos módulos liberados), botão "+ Novo operador" (usuário, nome, senha, admin ou checkboxes por
  módulo) e "Editar"/"Inativar" por operador. Criar um operador novo usa um client Supabase **isolado**
  (`persistSession: false`) só pra não trocar a sessão de quem está logado no momento — sem isso, o
  `supabase.auth.signUp()` do operador novo derrubaria a sessão do admin que está cadastrando.
- **Menu lateral filtrado por permissão**: só aparecem os módulos que o operador tem acesso (admin vê
  tudo); operador sem nenhum módulo liberado vê um aviso em vez de menu vazio. Cada rota (`App.tsx`)
  é protegida por um componente `PermissaoRoute`/`AdminRoute` que bloqueia navegação direta por URL
  pra um módulo sem permissão (mostra aviso, não deixa passar). Testado com um operador de permissão
  limitada (só Clientes + Caixa): menu e rotas batem certinho com o que foi liberado.
- **Achado e corrigido durante os próprios testes desta sessão**: um operador sem permissão de
  "Painel de Controle" caía numa tela de "sem permissão" logo depois de logar (porque `/` exigia a
  permissão `painel`). Corrigido: `/` agora redireciona pro primeiro módulo que o operador realmente
  acessa.

**🐛 Bug real encontrado e corrigido testando com o Supabase de verdade do usuário**: a policy de
escrita de `operadores` (migration 0007) checava se quem estava logado era admin consultando a
própria tabela `operadores` dentro da policy — isso faz o Postgres reavaliar a mesma policy dentro
da subconsulta, entrando em loop (`infinite recursion detected in policy for relation "operadores"`,
erro 500 em qualquer select/insert na tabela — foi isso que fez o login "funcionar" mas o app não
carregar as permissões, mostrando "nenhum módulo liberado" mesmo com o operador cadastrado certo).
**Corrigido** na migration `0008_operadores_fix_rls_recursiva.sql`: a verificação de admin agora
passa por uma função `security definer` (`operador_atual_e_admin()`), que roda com privilégio do
dono da função e não reaciona a mesma policy — padrão recomendado do Postgres/Supabase pra esse
caso. **Se esse erro (`42P17`, "infinite recursion detected in policy") aparecer de novo em alguma
tabela nova que tenha RLS consultando a própria tabela, é o mesmo padrão de bug** — sempre que uma
policy precisar checar uma condição na mesma tabela que ela protege, usar uma função
`security definer`, nunca uma subconsulta direta.

**Passos manuais únicos no painel do Supabase pra ligar o login** (documentados também dentro da
migration `0007_operadores.sql` — útil de repetir quando conectarem outra loja num projeto Supabase
novo):

1. Rodar as migrations `0007_operadores.sql` e `0008_operadores_fix_rls_recursiva.sql` (SQL Editor
   do Supabase, nessa ordem).
2. **Desligar a confirmação por e-mail**: Authentication → Sign In / Providers → **duas opções
   diferentes, as duas precisam estar do jeito certo**: "Enable email provider" **ligado** (senão dá
   erro "Email logins are disabled") e "Confirm email" **desligado** (senão ninguém consegue entrar
   depois de criado, porque os e-mails são inventados e não existe caixa de entrada pra confirmar).
3. Criar o primeiro admin manualmente (Authentication → Users → Add user) e rodar o `insert` de
   exemplo que está comentado no final da migration 0007, colando o "User UID" gerado.

**⏳ Implementado e mergeado em `main` nesta sessão (PR [#8](https://github.com/caranovavidanova/amigao/pull/8)), ainda sem
confirmação do usuário rodando com Supabase real** — o usuário mandou um rascunho desenhado à mão
em cima de uma screenshot do "Painel de Controle" pedindo esse redesenho, e duas imagens de
referência de estilo (dashboard escuro "Helios Investments" e um card de login em vidro fosco sobre
foto de paisagem). Validado no sandbox via `npm run build`, `npm run lint`, `tsc -b` e screenshots
Playwright com dados simulados via `page.route()` interceptando as chamadas REST/Auth do Supabase
(sandbox não acessa `*.supabase.co`, ver item 7 da seção 6):

- **"Painel de Controle" virou "Início"** — só o texto exibido (label em `MODULOS`, título da
  página); a chave interna de permissão continua `painel`, então operadores já cadastrados não
  precisam ser reconfigurados.
- **Página Início redesenhada**: os dois gauges (velocímetro) deram lugar a três cartões de
  tendência do mês — **Vendas mês**, **Custos mês** e **Lucros mês** — cada um com um mini-gráfico
  de linha (`components/Sparkline.tsx`, SVG puro, sem biblioteca de gráficos) somando os lançamentos
  de `caixa_movimentos` por dia (entradas = vendas, saídas = custos — decisão explícita do usuário
  nesta sessão de manter simples, sem tentar separar custo de peça vendida) e um link "Ver mais"
  pra Relatórios. A antiga "Fila de atendimento" virou a seção **"OS abertas"** (mesma tabela,
  só renomeada). O componente `Gauge.tsx` foi removido por ter ficado sem nenhum uso.
- **Calendário do mês no Início** (`components/MiniCalendario.tsx`): mostra o mês atual com
  marcação de **feriados nacionais** (`lib/feriados.ts` — datas fixas + as três móveis calculadas a
  partir do domingo de Páscoa via algoritmo de Meeus/Jones/Butcher: Carnaval, Sexta-feira Santa,
  Corpus Christi; conferido manualmente pros feriados de 2026) e de **aniversário de cliente no
  mês** (compara mês/dia de `clientes.data_nascimento` com o mês corrente, ignora o ano). Isso
  exigiu um campo novo: `data_nascimento` (date, opcional) em `clientes` — migration
  `0009_clientes_data_nascimento.sql` — e um campo de data no `ClienteForm.tsx`.
- **Tela de Login redesenhada**: cartão em vidro fosco (`backdrop-blur`, fundo semitransparente,
  cantos bem arredondados) sobre uma imagem de fundo floral, no estilo do card de login de
  referência que o usuário mandou. **A foto de flor de cerejeira que o usuário queria usar de fundo
  veio colada direto no chat (não como arquivo anexado)** — pelo mesmo motivo já documentado na
  seção 2 sobre a logo oficial (risco real de não reproduzir o arquivo original com fidelidade a
  partir do que é só colado/renderizado na conversa), não dava pra salvar essa foto como um asset
  de verdade. O usuário topou, como alternativa, um fundo recriado à mão: `public/sakura-login-bg.svg`
  (ilustração vetorial de galho de sakura com flores, gerada por script Python embutindo os
  `<ellipse>`/`<circle>` das pétalas, não é a foto real). **Pendência**: se o usuário mandar a foto
  de verdade como anexo/drag-and-drop (não colada), é só trocar a `background-image` do
  `LoginPage.tsx` pra apontar pro arquivo real dentro de `public/`.
- **Cadastro de Produto (aba Estoque → Produtos) ampliado**, a pedido do usuário depois de mandar
  um print do cadastro de peça de um sistema de referência (S3Auto/Comsis): novos campos **Código
  de barras, Marca, Modelo, Aplicação, C.E.S.T. e Origem da mercadoria** (migration
  `0010_pecas_campos_cadastro_completo.sql`); "Código interno" passou a ser exibido como
  **"Referência"** (mesmo campo, só o rótulo mudou). Viraram **obrigatórios** no formulário (mas
  não em nível de banco, mesmo padrão dos campos fiscais que já existiam): Descrição, NCM, C.E.S.T,
  CFOP, Origem, CST/CSOSN e Unidade — `CST` e `CSOSN` continuam sendo **um campo só** (decisão
  explícita do usuário nesta sessão: na prática só um se aplica dependendo do regime tributário da
  loja). **Margem % com cálculo nos dois sentidos**: preencher a margem calcula automaticamente o
  Preço final (markup sobre o custo — decisão explícita do usuário: preço = custo × (1 +
  margem/100)); editar o Preço final direto também funciona e recalcula a margem exibida pra manter
  os dois campos coerentes. A margem em si **não é salva no banco** (é derivada de
  `preco_custo`/`preco_venda` só na tela). Um novo campo **"Qtde. estoque inicial"** no cadastro
  cria automaticamente um lançamento de entrada em `estoque_movimentos` (motivo `ajuste`) junto com
  o produto, decisão explícita do usuário pra não precisar ir na aba Movimentações lançar o estoque
  inicial manualmente depois.

**✅ Confirmado pelo usuário nesta sessão, rodando de verdade (catálogo de Serviços + primeira versão
do redesenho da OS)** — PR [#10](https://github.com/caranovavidanova/amigao/pull/10), mergeado em
`main` depois de o usuário rodar as migrations 0011/0012 e testar. O usuário mandou um print da tela
de OS de um sistema de referência (S3Auto/Comsis) pedindo (1) um catálogo de Serviços e (2) a tela de
OS reorganizada nesse estilo mais denso/tudo-em-uma-tela, porém com a cara do Sakura System:

- **Módulo "Serviços"** (`servicos` — migration 0011): catálogo de serviços com descrição, código
  opcional e preço padrão — mesmo padrão de tela de Produtos, só que sem estoque/campos fiscais.
  Permissão própria (`servicos` em `MODULOS`) e item no menu lateral, entre Estoque e Ordens de Serviço.
- **Item de OS tipo "serviço" escolhe do catálogo** (`ItemOSRow.tsx`) — autopreenche descrição e preço,
  igual peça já fazia. Mantido um "Serviço avulso (digitar abaixo)" pra lançar algo que não está
  cadastrado.
- **Tela de Ordem de Serviço redesenhada** (`OrdemServicoForm.tsx`) em duas colunas, estilo Sakura. O
  mesmo componente serve tanto pra abrir uma OS nova quanto pra reabrir/editar uma já existente
  (clicando na linha da tabela) — antes só dava pra criar e faturar.
  - **Simplificação que continua valendo**: editar uma OS existente só permite alterar os campos do
    cabeçalho e **acrescentar** itens novos — não dá pra editar ou remover um item já lançado (evita
    ter que desfazer a baixa de estoque que o item já gerou).
  - **"Visualizado por" da referência não foi implementado** (exigiria rastrear presença em tempo
    real) — só "criado por"/"alterado por" (autoria real) foram feitos, com vendedor_id/criado_por_id/
    atualizado_por_id (FK operadores, migration 0012).
  - **Botões "Emitir NFe"/"Emitir NFS-e"**: placeholder (mostram aviso que falta escolher o provedor
    fiscal — pendência do item 1 da seção 8) — não emitem nada de verdade ainda.

**✅ Confirmado pelo usuário nesta sessão, rodando de verdade (migration 0013)** — mergeado
**direto em `main`** por decisão de fluxo desta sessão (ver seção 3: sem deixar PR aberto enquanto não
existir uma v1.0 publicada). Validado no sandbox via `npm run build`, `npm run lint`, `tsc -b` e
screenshots Playwright com dados simulados (sandbox não acessa `*.supabase.co`, ver item 7 da seção 6):

- **Checklist do veículo removido** — não vingou, tirado da tela e do banco (migration 0013 derruba as
  3 colunas que a 0012 tinha criado).
- **"Problema relatado" virou "Observação"** — só o rótulo mudou (mesmo campo `descricao_problema`).
- **Técnico por item**: cada linha de peça/serviço na OS agora tem um seletor de **Técnico**
  (`tecnico_id` em `ordens_servico_itens`, FK operadores) — diferente do "Vendedor/atendente" que é da
  OS inteira; um mecânico específico pode ser atribuído a cada serviço.
- **Simulação de parcelas removida** (`SimulacaoParcelas.tsx` apagado) — substituída pelo item abaixo.
- **Tela de faturamento nova** (`FaturamentoCard.tsx`, abre ao clicar "Faturar" na lista de OS):
  escolhe forma de pagamento e, se for cartão de crédito, quantidade de parcelas (1x a 12x). As
  parcelas (vencimento mensal + valor) são **calculadas automaticamente** a partir dos juros
  configurados pelo admin — não tem mais campo de juros digitado na hora. **O valor efetivamente
  lançado no Caixa Diário já inclui os juros** quando parcelado (não é só informativo como a simulação
  antiga era) — decisão desta sessão: se o juro é cobrado do cliente, o Caixa precisa refletir o valor
  real recebido, não o valor "de tabela" da OS.
- **Configurações → "Juros de parcelamento"** (`JurosParcelasSection.tsx`, tabela nova
  `configuracoes_juros_parcelas`): admin define um % de juros **por quantidade de parcelas** (2x a
  12x, 1x é sempre à vista sem juros) — decisão explícita do usuário nesta sessão (perguntei se seria
  uma taxa mensal única ou uma taxa por quantidade de parcelas; ele escolheu a segunda, mais fiel ao
  que maquininha de cartão costuma oferecer).

**✅ Confirmado pelo usuário nesta sessão, rodando de verdade (migration 0014)** — mergeado via PR
[#11](https://github.com/caranovavidanova/amigao/pull/11), a pedido do usuário em cima de um print da
tela de OS. Validado no sandbox via `npm run build`, `npm run lint`, `tsc -b` e screenshots Playwright
com dados simulados (sandbox não acessa `*.supabase.co`, ver item 7 da seção 6):

- **Card "Prazos" removido** (não vingou) — os campos `previsao_entrega`/`data_retorno` foram tirados
  da tela **e do banco** (migration 0014, `drop column`) a pedido explícito do usuário ("remova os
  campos completamente").
- **Botões "Emitir NFe"/"Emitir NFS-e" saíram do formulário principal da OS** e foram pra uma aba nova,
  **"Fechamento"** (`FechamentoTab.tsx`), que só aparece quando a OS abre já com status **Concluída ou
  Faturada** (`STATUS_COM_FECHAMENTO` em `OrdemServicoForm.tsx`) — decisão desta sessão diante de duas
  opções apresentadas ao usuário (ele não respondeu explicitamente, então segui com a mais permissiva:
  aparece assim que o serviço termina, não só depois de faturar; fácil de restringir só pra "Faturada"
  depois se ele preferir). A aba "Detalhes" (formulário de sempre) só aparece ao lado dela quando a OS
  já tem fechamento disponível — OS aberta/em andamento continua com uma tela só, sem abas.
  - A aba de Fechamento mostra um resumo (cliente, veículo, datas de abertura/fechamento, itens e
    total) + os botões de nota fiscal + dois botões novos, **"Imprimir garantia"** e **"Baixar
    garantia"** — por enquanto **placeholder** (mesmo padrão do NFe/NFS-e: mostram aviso de "ainda não
    disponível"), porque o texto/modelo da garantia ainda não foi definido.

**⏳ Implementado e mergeado direto em `main` nesta sessão (redesenho visual "glassmorphism" do app
inteiro), ainda sem confirmação do usuário rodando de verdade** — pedido do usuário, que mandou prints
de referência (cartões de vidro fosco flutuando, estilo iOS/dashboard "bento grid") e screenshots do
próprio app indicando quais partes deveriam virar "blocos". Validado no sandbox via `npm run build`,
`npm run lint`, `tsc -b` e screenshots Playwright com dados simulados (sandbox não acessa
`*.supabase.co`, ver item 7 da seção 6). Mudança é **só CSS/classes React, nenhuma migration**:

- **Duas classes novas em `src/styles/globals.css`** (Tailwind v4 `@utility`, então funcionam como
  qualquer classe utilitária): `sakura-shell-bg` (fundo rosa com brilho difuso, `background-attachment:
  fixed`, aplicado no container raiz do app em `App.tsx`) e `sakura-card` (bloco arredondado —
  `border-radius` grande, gradiente quase branco com um toque de roxo no canto, `backdrop-filter: blur`,
  sombra suave). O tom do bloco é **bem mais claro** que o fundo rosa saturado de propósito — o usuário
  pediu explicitamente que o bloco se destacasse do fundo **por cor**, não só pelo efeito de blur.
- **`sakura-card` aplicado em todo o app** — substituiu o antigo padrão `rounded-2xl border
  border-sakura-gray/30 bg-white` (e variantes) em praticamente todas as telas: Sidebar, os três
  cartões de tendência do Início, a tabela "OS abertas", o `MiniCalendario`, e todos os cards/formulários/
  tabelas de Clientes, Estoque, Serviços, Ordens de Serviço (form + `FechamentoTab`), Caixa, Relatórios,
  Lucratividade e Configurações. A tela de Login **não foi mexida** — já tinha seu próprio estilo de
  vidro fosco com fundo floral próprio, feito numa sessão anterior, e não fazia parte dos prints que o
  usuário mandou.
- **Sidebar** (`src/components/Sidebar.tsx`): virou ela mesma um bloco flutuante (`sakura-card`), com
  espaço/gap em volta em vez de ficar colada nas bordas da janela (`App.tsx` ganhou `gap-4 p-4` no
  container raiz). O item de menu **"Configurações" (texto) virou um ícone de engrenagem** ao lado do
  nome do operador, no rodapé da barra lateral — só aparece pra quem é admin (mesma regra de antes,
  só mudou de lugar/formato). O ícone é um SVG desenhado à mão (sem adicionar biblioteca de ícones
  nova como dependência), inspirado no ícone "settings" do Feather Icons.
- **"Ver mais" consolidado**: os três cartões de tendência do Início (Vendas/Custos/Lucros mês) tinham
  cada um seu próprio link "Ver mais →", todos indo pro mesmo lugar (Relatórios) — virou **um único
  botão** ("Ver relatórios completos →") centralizado abaixo dos três cartões, em vez de repetir o link
  três vezes.
- **Pendências que ficaram de fora de propósito** (nenhuma foi pedida pelo usuário, mas valem nota
  pra próxima sessão): a cor dos **botões** (ex: "+ Novo cliente", que usa `bg-sakura-purple` sólido)
  não foi ajustada — como é uma cor da mesma família do novo fundo rosa, o contraste ficou um pouco
  mais fraco do que era sobre o fundo branco antigo; se o usuário achar os botões "sumindo" no fundo
  novo, é candidato a ajuste futuro. A tela de Login também poderia ganhar o mesmo tom de `sakura-card`
  se o usuário quiser unificar tudo, mas não foi pedido.

**✅ Decidido nesta sessão: a usuária pode começar a usar o sistema na borracharia AGORA**, mesmo sem
a emissão automática de nota fiscal pronta — ela continua emitindo nota por fora (do jeito que já faz
hoje) até essa parte ficar pronta. Isso desbloqueou dois passos que só faziam sentido com essa decisão
tomada:

- **Ordem do menu lateral ajustada**: "Ordens de Serviço" subiu pra logo depois de "Clientes" (era
  depois de "Estoque"/"Serviços") — reflete melhor o fluxo real de atendimento (cliente chega → abre
  OS), em vez de ordem alfabética/técnica. Mudança de uma linha em `MODULOS`
  (`src/types/operador.ts`) — fácil de reordenar de novo se o usuário não gostar, ele disse que "dá
  pra decidir uma ordem depois".
- **Empacotamento e atualização automática configurados** (ver seção 6, itens 5 e 6, e tutorial na
  seção 9): `package.json` ganhou a seção `"build"` do `electron-builder` (ícone gerado a partir de
  `public/sakura-icon.svg`, instalador NSIS do Windows) e `.github/workflows/release.yml` builda e
  publica automaticamente no GitHub Releases quando uma tag `v*` é enviada — os apps instalados nas
  lojas se atualizam sozinhos depois (`electron-updater`, que já estava chamado no código mas sem
  destino configurado). **Ainda falta o usuário fazer os dois passos únicos no site do GitHub**
  (secrets do repositório + permissão de escrita das Actions) **e publicar a primeira tag** pra gerar
  o primeiro instalador de verdade — tutorial completo na seção 9. Não dá pra testar esse fluxo
  completo no sandbox (build de instalador Windows precisa rodar num runner Windows de verdade, que é
  exatamente o que o GitHub Actions fornece) — só validei que `package.json`/`release.yml` estão com
  sintaxe correta e que `npm run build`/`lint`/`tsc -b` continuam passando.

**⏳ Implementado e mergeado direto em `main` nesta sessão (correções pós-instalador v0.1.1 + botão
"voltar"), ainda sem confirmação do usuário rodando de verdade**. Validado no sandbox via `npm run
build`, `npm run lint`, `tsc -b` e screenshots Playwright (sandbox não acessa `*.supabase.co`, ver
item 7 da seção 6):

- **Dois bugs reais achados testando o instalador v0.1.1 de verdade** — ver itens 11 e 12 da seção 6
  pro detalhe técnico completo:
  - Campos de formulário "sem digitar": era texto **invisível** (branco sobre fundo claro) quando o
    Windows está em modo escuro, por falta de `color-scheme: light` declarado. Corrigido em
    `globals.css`.
  - Botão "Excluir" de Clientes sem efeito nenhum: a exclusão **estava falhando de verdade** (cliente
    com Ordem de Serviço vinculada, bloqueado de propósito pra não perder histórico), mas o erro não
    aparecia em lugar nenhum. Corrigido com `try/catch` + mensagem amigável, igual ao padrão já usado
    em Estoque/Serviços.
- **Botão "voltar" (seta pra esquerda, estilo vidro)** — pedido do usuário, com prints de referência
  do próprio estilo do app. Componente novo `src/components/BotaoVoltar.tsx` (SVG desenhado à mão,
  sem biblioteca de ícones) + classe nova `sakura-icon-button` em `globals.css` (círculo de vidro com
  efeito de hover — levanta e aumenta levemente ao passar o mouse). Aplicado em:
  - **Todas as telas de lista** (Clientes, Estoque, Serviços, Ordens de Serviço, Caixa, Relatórios,
    Lucratividade, Configurações — Início ficou de fora, por ser a tela inicial) — nesse caso o botão
    volta pra rota anterior no histórico do navegador (`navigate(-1)`).
  - **Todos os formulários de cadastro** (Cliente, Peça/Produto, Movimentação de estoque, Serviço,
    Lançamento de caixa, Operador, Ordem de Serviço, Faturamento) — nesse caso o botão chama o mesmo
    callback do botão "Cancelar" que já existia (fecha o formulário e volta pra lista, em vez de mudar
    de rota) — por isso `BotaoVoltar` aceita uma prop `onClick` opcional pra sobrescrever o padrão.

**⏳ Implementado e mergeado em `main` nesta sessão (PR [#22](https://github.com/caranovavidanova/amigao/pull/22)), ainda sem confirmação do usuário rodando com Supabase real** — 4 dos itens do menu de Estoque do sistema de referência (S3Auto/Comsis) que estavam na lista de "ainda não avaliados" (ver seção 8, antiga lista do item 5), escolhidos pelo usuário entre os que não dependem de Fornecedores/Depósito. Validado no sandbox via `npx tsc -b`, `npm run build`, `npm run lint` e screenshots Playwright com dados simulados via `page.route()` (sandbox não acessa `*.supabase.co`, ver item 7 da seção 6):

- **Categorias de produto** (migration 0016, tabela `categorias`): usuário escolheu **tabela própria**
  em vez de campo de texto livre (evita duplicar categoria por erro de digitação, permite renomear em
  massa). Gerenciada em Configurações (`CategoriasSection.tsx`, admin-only, mesmo padrão visual do
  `JurosParcelasSection.tsx`) e selecionável no cadastro de produto (`PecaForm.tsx`); coluna
  "Categoria" nova na lista de produtos (`ProdutosSection.tsx`).
- **Relatórios de estoque**: 4ª aba "Relatórios" em `EstoquePage.tsx`
  (`RelatoriosEstoqueSection.tsx`) — estoque físico-financeiro (soma de saldo × preço de custo),
  saldo por situação (positivo/negativo/zerado, com filtro) e produtos ativos sem nenhuma
  movimentação registrada. Tudo derivado de `pecas` + `estoque_movimentos` na tela, **sem tabela
  nova**.
- **Garantias**: usuário escolheu rastrear a **garantia dada ao cliente na venda** (não a garantia do
  fornecedor na compra, já que o módulo de Fornecedores ainda não existe). Campo novo "Garantia
  (dias)" no cadastro de produto (`prazo_garantia_dias`, migration 0016) + módulo novo "Garantias"
  (`garantias` em `MODULOS`, rota `/garantias`, item no menu lateral) que lista peças vendidas com
  prazo de garantia definido, calculando o vencimento a partir da data de fechamento da OS e
  classificando "Dentro do prazo"/"Vencida". **Sem tabela nova** — deriva de `ordens_servico_itens`
  join `pecas`/`ordens_servico` (`lib/garantias.ts`).
- **Contagem/Inventário físico** (migration 0017, tabela `contagens_estoque`): 3ª aba "Contagem" em
  `EstoquePage.tsx` (`ContagemSection.tsx`) — escolhe um produto, mostra o saldo que o sistema
  calcula, o operador digita a quantidade contada fisicamente, e a diferença (se houver) gera
  automaticamente um lançamento de ajuste em `estoque_movimentos` (mesmo padrão do "Qtde. estoque
  inicial" do cadastro de produto). Histórico de contagens listado abaixo do formulário.
- **Itens do mesmo menu que o usuário optou por NÃO fazer agora** (continuam na lista do item 5 da
  seção 8): Fornecedores/Pedido de Compra, Entrada via NFe, Cadastro de Depósito.

**⏳ Implementado e mergeado em `main` nesta sessão (PR [#27](https://github.com/caranovavidanova/amigao/pull/27)), ainda sem confirmação da usuária rodando com Supabase real** — texto de garantia configurável, resolvendo o item 3 da seção 8.1 (confirmado nesta mesma sessão: texto configurável, não multi-loja). Validado no sandbox via `npx tsc -b`, `npm run build`, `npm run lint` e screenshots Playwright com dados simulados, incluindo clicar de verdade em "Baixar garantia" e conferir que não lança erro no console (sandbox não acessa `*.supabase.co`, ver item 7 da seção 6):

- **Tabela `configuracoes_garantia`** (migration 0018) — "singleton" (1 linha só), com um texto
  padrão semeado na própria migration. Editável em Configurações → "Texto de garantia"
  (`TextoGarantiaSection.tsx`, admin-only, mesmo padrão visual das outras seções de config).
- **Placeholders substituídos automaticamente** (`lib/garantiaTexto.ts`): `{cliente}`, `{veiculo}`,
  `{itens}` (lista de peças/serviços da OS) e `{data}` (data de fechamento).
- **Botões "Imprimir garantia"/"Baixar garantia" na aba Fechamento da OS** (`FechamentoTab.tsx`) —
  deixaram de ser placeholder:
  - **Baixar**: gera um arquivo `.txt` na hora (via `Blob` + link temporário), sem precisar de
    biblioteca de PDF nem de nenhuma dependência nova.
  - **Imprimir**: chama `window.print()` do próprio Electron. Pra imprimir só o texto da garantia (e
    não a tela inteira do app), o texto renderizado fica numa área escondida
    (`.apenas-impressao` em `globals.css`) que só aparece via `@media print` — o CSS esconde todo o
    resto da página (`body * { visibility: hidden }`) e revela só essa área durante a impressão.
    **Esse é o padrão a seguir se algum dia precisar imprimir outra coisa** (ex: OS, orçamento):
    reaproveitar a classe `.apenas-impressao` em vez de abrir uma janela nova (`window.open` não tem
    handler configurado no `electron/main.ts`, então ficaria bloqueado por padrão).
  - Se o admin ainda não configurou nenhum texto (ex: migration 0018 não rodada ainda), os botões
    mostram um aviso pedindo pra configurar em Configurações, em vez de travar.

**⏳ Implementado e mergeado em `main` nesta sessão (PR [#28](https://github.com/caranovavidanova/amigao/pull/28)), ainda sem confirmação da usuária rodando com Supabase real** — pré-visualização antes de emitir NFe/NFS-e ou baixar/imprimir a garantia, a pedido explícito da usuária ("queria que as telas de NF e garantia tivesse um preview antes de baixar emitir"). Validado no sandbox via `npx tsc -b`, `npm run build`, `npm run lint` e screenshots Playwright, incluindo clicar de verdade em "Baixar .txt" dentro do preview sem erro no console (sandbox não acessa `*.supabase.co`, ver item 7 da seção 6):

- **`src/components/Modal.tsx`** — modal genérico novo (fundo escurecido, `sakura-card` centralizado, fecha
  clicando fora ou no ✕), reutilizável por qualquer tela que precisar de um popup no futuro.
- **Nota fiscal**: os botões "Emitir NFe"/"Emitir NFS-e" agora abrem um preview com cliente, veículo,
  itens e total (mesmos dados já mostrados na aba, só reorganizados como um "rascunho" de nota) mais um
  aviso de que a emissão de verdade ainda depende de escolher o provedor fiscal e cadastrar os dados
  fiscais da loja — não há mais o `alert()` cru de antes.
- **Garantia**: os dois botões "Imprimir garantia"/"Baixar garantia" viraram **um botão só** ("Ver
  garantia") que abre o preview com o texto já formatado (placeholders substituídos); os botões
  "Baixar .txt" e "Imprimir" ficam dentro do preview, então a usuária sempre vê o texto antes de agir.

**⏳ Implementado nesta sessão (módulo Funcionários + abas Entradas/Saídas no Caixa), ainda sem
confirmação da usuária rodando com Supabase real** — pedido direto da usuária: (1) vincular técnicos
a peças/serviços na OS e cadastrar "outros funcionários", (2) lançar saídas não convencionais (aluguel,
mercado, limpeza) e (3) lançar entradas não convencionais (ex: venda de sucata). Duas decisões
estruturais foram apresentadas com opções + recomendação antes de codar (ver seção 1) — a usuária
escolheu as duas opções recomendadas. Validado no sandbox via `npx tsc -b`, `npm run build`,
`npm run lint` e screenshots Playwright com dados simulados via `page.route()` interceptando as
chamadas REST/Auth do Supabase, incluindo abrir os três formulários novos e navegar pelas três abas
do Caixa sem erro no console (sandbox não acessa `*.supabase.co`, ver item 7 da seção 6):

- **Módulo "Funcionários" novo** (migration 0019, tabela `funcionarios` — ver seção 5 pro modelo
  completo): cadastro leve (nome + cargo, sem usuário/senha) pra gente que não precisa logar no
  sistema mas precisa aparecer como técnico ou vendedor/atendente numa OS. Todo operador (quem loga)
  ganha automaticamente um `funcionarios` espelhado por um gatilho no banco — o cadastro de operador
  em Configurações não mudou em nada, o espelho é automático e invisível pra usuária.
- **Seletores de "Técnico" (por item da OS) e "Vendedor/atendente" (da OS toda) passaram a listar
  funcionários, não mais só operadores** — `ItemOSRow.tsx` e `OrdemServicoForm.tsx` trocaram a prop
  `operadores` por `funcionarios`. `tecnico_id` (em `ordens_servico_itens`) e `vendedor_id` (em
  `ordens_servico`) foram repontados de `operadores(id)` pra `funcionarios(id)` pela migration 0019,
  com backfill automático dos dados já existentes (nenhuma OS antiga perde a informação de quem foi o
  técnico/vendedor). `criado_por_id`/`atualizado_por_id` continuam apontando pra `operadores` —
  esses são sobre quem mexeu no sistema (auditoria), não sobre quem prestou o serviço.
- **Categorias de caixa novas** (migration 0020, tabela `categorias_caixa` — ver seção 5): admin
  cadastra categorias de entrada (ex: Sucata) ou saída (ex: Aluguel, Mercado, Limpeza) em
  Configurações (`CategoriasCaixaSection.tsx`), e qualquer lançamento manual do Caixa pode escolher
  uma (opcional).
- **Caixa Diário ganhou abas**: "Diário" (comportamento de sempre, sem mudança nenhuma pra usuária),
  "Entradas" e "Saídas" (novas) — mostram só os lançamentos manuais (não inclui faturamento de OS,
  que já aparece na aba Diário) daquele tipo, com total por categoria e um formulário de "+ Nova
  entrada"/"+ Nova saída" com o tipo já travado. Essas duas abas ficam **dentro** do Caixa Diário, não
  viraram módulos separados — decisão explícita da usuária entre duas opções apresentadas, pra não
  duplicar onde o dinheiro é controlado (ver seção 1).

**⏳ Implementado nesta sessão (pessoa física/jurídica no cadastro de Cliente), ainda sem confirmação
da usuária rodando com Supabase real** — pedido direto da usuária. Migration `0021_clientes_tipo_pessoa.sql`
adiciona `tipo_pessoa` (`fisica`/`juridica`, default `fisica` pra não quebrar clientes já cadastrados).
`ClienteForm.tsx` ganhou dois rádios "Pessoa física"/"Pessoa jurídica" no topo do cadastro — trocar a
opção muda o rótulo dos campos "Nome completo"/"CPF" para "Razão social"/"CNPJ" (mesmos campos por
trás, só o rótulo e o `tipo_pessoa` mudam). Não mexeu na lista de clientes nem no cadastro de edição
(esse módulo não tem edição, só criar/excluir, ver `ClientesPage.tsx`). Validado via `npx tsc -b`,
`npm run build`, `npm run lint` e screenshot Playwright alternando entre as duas opções (sandbox não
acessa `*.supabase.co`, ver item 7 da seção 6).

## 8.1 Respondido nesta sessão — 3 perguntas fiscais/garantia da sessão anterior

As 3 perguntas abaixo (que bloqueavam avançar na parte fiscal e na garantia) **já foram respondidas
pela usuária nesta sessão**:

1. **Cidade/UF da borracharia**: **Araraquara** (assumindo SP — é a Araraquara mais conhecida do
   Brasil; ainda não confirmado explicitamente pela usuária, vale confirmar se aparecer alguma
   Araraquara de outro estado). Com isso já dá pra pesquisar/recomendar provedor de NFS-e (Focus NFe,
   eNotas, PlugNotas etc.) — **pesquisa ainda não feita**, é o próximo passo antes de codar a emissão
   fiscal (ver item 1 da seção 8).
2. **Certificado digital A1 no CNPJ**: usuária respondeu **"não sei"** — precisa verificar isso antes
   de a emissão fiscal funcionar de verdade (é pré-requisito pra qualquer provedor). Perguntar de novo
   quando for a hora de configurar o provedor escolhido.
3. **Escopo do "modelo de garantia editável"**: **confirmado** — é um texto configurável (editável em
   Configurações, com campos tipo {cliente}/{veículo}/{itens}/{data}), não multi-loja. **Implementado
   nesta mesma sessão** (ver seção 7, PR #27) — os botões "Imprimir garantia"/"Baixar garantia" na
   aba Fechamento da OS não são mais placeholder.

**Instalador Windows**: a usuária pediu pra publicar a v0.1.2 nesta sessão (não ficou mais pendente).
`package.json` já foi atualizado pra `"version": "0.1.2"` e mergeado em `main` — falta só ela rodar
`git tag v0.1.2 && git push origin v0.1.2` (ver tutorial na seção 9) pra disparar o build no GitHub
Actions. Essa versão inclui: correções da v0.1.1 (texto invisível em modo escuro, exclusão de cliente
silenciosa), botão "voltar", e Categorias/Relatórios de estoque/Garantias/Contagem (PR #22) + a
correção da migration 0015 (PR #24).

## 8. O que NÃO existe ainda (próximos passos possíveis)

Ordem de prioridade sugerida pelo próprio documento inicial do usuário:

1. **Parte fiscal (prioridade alta, NÃO bloqueia o uso na loja — ver decisão na seção 7)**: emissão
   de NFC-e (peças, padrão estadual/SEFAZ) e NFS-e (serviço, padrão municipal — varia por cidade).
   Estratégia definida: integrar com um provedor intermediário (Focus NFe, eNotas, PlugNotas ou
   similar) em vez de implementar comunicação direta com SEFAZ/prefeituras. **Ainda não escolhido
   qual provedor** — depende da cidade/UF da loja (NFS-e) e se já existe certificado digital A1 pro
   CNPJ — perguntas em aberto na seção 8.1. Isso é uma decisão que precisa ser apresentada ao usuário
   antes de codar. A tela de Ordem de Serviço já tem os botões "Emitir NFe"/"Emitir NFS-e" (ver seção
   7), mas por enquanto são só placeholder — passam a emitir de verdade quando essa decisão for
   tomada. Também falta modelar os **dados fiscais da própria loja** (CNPJ, razão social, IE, IM,
   regime tributário, endereço) — hoje não existe nenhuma tabela/tela pra isso, é pré-requisito pra
   emitir qualquer nota.
2. ~~Autenticação / login de usuário~~ — **construído nesta sessão** (ver seção 7): login com
   usuário/senha + permissões por módulo, checadas na interface. O que ficou de fora e ainda é
   próximo passo possível: reforçar em RLS por categoria (trade-off aceito por ora, ver seção 6.1),
   admin redefinir senha de operador esquecida (precisaria de Edge Function), e o **site externo de
   assinatura** que cria a primeira conta de cada loja automaticamente (hoje isso é manual, pelo
   painel do Supabase — ver seção 7) — combinado que fica pra quando pensarem na versão comercial.
3. **Logo oficial** — pegar o arquivo `.svg` real do usuário como **anexo** (não colado no chat) e
   aplicar no lugar dos SVGs feitos à mão (ver seção 2).
4. Refinamentos possíveis no Painel de Controle e demais módulos, conforme feedback do usuário.
5. **Itens do menu de estoque do sistema de referência (S3Auto/Comsis) ainda não avaliados/decididos**
   — usuário mandou prints do menu "Estoque" e "Relações" de um sistema básico que a família usa na
   borracharia. A categoria em si (seção 7), Categorias de produto, Relatórios adicionais, Garantia
   (dada ao cliente) e Contagem/Inventário físico **já foram implementados** (PR #22, ver seção 7).
   Restam os itens que dependem de Fornecedores/multi-local, ainda **precisam de decisão do usuário
   antes de codar** (apresentar opções + recomendação, não decidir sozinho — ver seção 1):
   - Pedido de Compra / Cotações de Peças por fornecedor (implica cadastro de Fornecedor)
   - Entrada de Produtos via NFe (importação de XML de nota fiscal do fornecedor)
   - Cadastro de Depósito (múltiplos locais físicos de estoque)
   - Peças em Garantia **do fornecedor na compra** (diferente da garantia ao cliente já implementada
     — essa depende do módulo de Fornecedores ainda não construído)

Funcionalidades explicitamente **futuras** (não implementar sem pedido explícito, mas manter
arquitetura aberta): integração com maquininha de cartão (TEF), assistente de IA para estoque,
importador universal de dados de outros sistemas, versão mobile, outras edições do Sakura System
(ex: Supermarket Edition).

## 9. Como rodar localmente (resumo)

```bash
npm install
cp .env.example .env   # preencher com VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY (chave anon/publishable)
npm run dev            # abre o app Electron com hot reload + DevTools
```

Projeto Supabase do usuário: nome "Sakura System", ref `rlgdjiowvnfzsedehyga`, região São Paulo.
URL do projeto: `https://rlgdjiowvnfzsedehyga.supabase.co`. Migrations em
`supabase/migrations/*.sql` (0001 a 0021) — as de 0001 a 0015 já foram confirmadas rodando sem erro
pela usuária nesse projeto (a 0015 precisou de uma correção nesta sessão — ver item 13 da seção 6 —
antes de rodar limpo). **As migrations 0016 a 0021 ainda precisam ser rodadas** — ver tutoriais
abaixo (0016/0017/0018 no primeiro tutorial, 0019/0020 — Funcionários e categorias de Caixa — no
segundo, mais recente). Todas são seguras de rodar de novo (idempotentes) caso precise reconectar ou
usar outro projeto Supabase do zero.

*(O tutorial de como pegar e testar as versões dos PRs #4/#6/#8/#10/#11 — múltiplos veículos, login,
redesenho do Início/Login, cadastro de produto completo, Serviços + redesenho da OS, migrations
0013/0014 — foi removido daqui porque já está tudo confirmado funcionando pelo usuário, ver seção 7.
Sessões passadas ficam registradas na seção 10.)*

### Tutorial: pegar a versão nova (migrations 0015 a 0018) e rodar

1. Feche o app se estiver aberto.
2. No terminal, dentro da pasta `sakura-system-autocenter`:
   ```powershell
   git checkout main
   git pull origin main
   ```
3. **Rode as migrations novas no Supabase, nessa ordem** (SQL Editor do Supabase — abra cada
   arquivo no VS Code, copie todo o conteúdo, cole numa "New query" e clique em "Run"):
   - `supabase/migrations/0015_rls_exige_login.sql` — fecha o acesso sem login nas tabelas de
     negócio (ver item 1 da seção 6). **Se já rodou essa antes e deu erro de "política já existe",
     já foi corrigido — é só rodar de novo, o arquivo atual já está certo.**
   - `supabase/migrations/0016_categorias_e_garantia.sql` — cria a tabela `categorias` e os campos
     `categoria_id`/`prazo_garantia_dias` em `pecas` (usados pelas telas novas de Categorias e
     Garantias).
   - `supabase/migrations/0017_contagens_estoque.sql` — cria a tabela `contagens_estoque` (usada
     pela aba nova "Contagem" em Estoque).
   - `supabase/migrations/0018_configuracoes_garantia.sql` — cria a tabela `configuracoes_garantia`
     (texto de garantia editável, usado pelos botões "Imprimir garantia"/"Baixar garantia" na aba
     Fechamento da OS).
4. `npm install && npm run dev`.
5. O que testar:
   - Tudo deve continuar funcionando **normalmente enquanto você estiver logado** (Clientes, Estoque,
     OS, Caixa etc.) — a migration 0015 só bloqueia quem tenta acessar os dados **sem** estar logado.
   - **Estoque → Produtos**: cadastrar/editar um produto agora tem um campo "Categoria" (crie
     categorias em Configurações → "Categorias de produto" primeiro) e um campo "Garantia (dias)".
   - **Estoque → Contagem** (aba nova): escolher um produto, digitar a quantidade contada e salvar —
     confira que o saldo do produto em "Produtos" muda quando há diferença.
   - **Estoque → Relatórios** (aba nova): confira os números de estoque físico-financeiro e os
     filtros de saldo positivo/negativo/zerado.
   - **Garantias** (item novo no menu lateral): só aparece depois de vender (faturar uma OS) uma
     peça que tenha "Garantia (dias)" preenchida no cadastro.
   - **Configurações → "Texto de garantia"**: edite o texto e salve.
   - **Ordem de Serviço concluída/faturada → aba Fechamento**: clique em "Baixar garantia" (deve
     baixar um `.txt`) e "Imprimir garantia" (deve abrir a caixa de impressão do Windows só com o
     texto da garantia, não a tela inteira do app).

Se der algum erro, me manda o print do DevTools que eu ajudo a resolver.

### Tutorial: pegar a versão nova (migrations 0019 a 0021 — Funcionários, Entradas/Saídas e tipo de cliente) e rodar

1. Feche o app se estiver aberto.
2. No terminal, dentro da pasta `sakura-system-autocenter`:
   ```powershell
   git checkout main
   git pull origin main
   ```
3. **Rode as migrations novas no Supabase, nessa ordem** (SQL Editor do Supabase — abra cada
   arquivo no VS Code, copie todo o conteúdo, cole numa "New query" e clique em "Run"):
   - `supabase/migrations/0019_funcionarios.sql` — cria a tabela `funcionarios` e move os campos
     de técnico (na peça/serviço da OS) e vendedor/atendente (da OS) pra apontar pra ela em vez de
     `operadores`. **Não perde nenhum dado**: a migration copia automaticamente o técnico/vendedor
     que já estava preenchido nas OS existentes.
   - `supabase/migrations/0020_categorias_caixa.sql` — cria a tabela `categorias_caixa` (categorias
     de entrada/saída do Caixa) e o campo `categoria_id` em `caixa_movimentos`.
   - `supabase/migrations/0021_clientes_tipo_pessoa.sql` — cria o campo `tipo_pessoa` em `clientes`
     (default `fisica`, não muda nenhum cliente já cadastrado).
4. `npm install && npm run dev`.
5. O que testar:
   - **Funcionários** (item novo no menu lateral): cadastre um funcionário sem marcar nada de
     login (ex: "João, Mecânico") e confira que ele aparece na lista junto com os operadores que já
     existiam (esses aparecem automaticamente, com a coluna "Login" preenchida).
   - **Ordens de Serviço → Nova OS**: no seletor "Técnico" de cada peça/serviço e no "Vendedor/
     atendente", confira que aparecem tanto os operadores quanto os funcionários novos sem login.
   - **Configurações → "Categorias de caixa"**: cadastre uma categoria de saída (ex: "Aluguel") e
     uma de entrada (ex: "Sucata").
   - **Caixa Diário → aba "Saídas"**: clique em "+ Nova saída", escolha a categoria "Aluguel" e
     salve — confira que aparece na lista da aba e não aparece misturada na aba "Diário" fora do dia
     de hoje.
   - **Caixa Diário → aba "Entradas"**: mesma coisa, com a categoria "Sucata".
   - **Caixa Diário → aba "Diário"**: confira que continua mostrando tudo (OS faturadas + lançamentos
     manuais) igual antes, sem nada quebrado.
   - **Clientes → Novo cliente**: confira os rádios "Pessoa física"/"Pessoa jurídica" no topo do
     formulário — ao trocar para jurídica, os campos "Nome completo"/"CPF" viram "Razão social"/"CNPJ".

Se der algum erro, me manda o print do DevTools que eu ajudo a resolver.

### Tutorial: gerar o instalador Windows e publicar uma versão (pra usar na borracharia)

Configurado nesta sessão: builda automaticamente no GitHub (não precisa instalar nada extra no seu
PC) e publica o instalador `.exe` pronto pra baixar — os apps já instalados em cada loja se atualizam
sozinhos quando sai uma versão nova.

**Passo único (só na primeira vez, configuração do repositório no site do GitHub):**

1. Em `github.com/caranovavidanova/amigao` → **Settings** → **Secrets and variables** → **Actions** →
   botão **"New repository secret"** — criar duas:
   - Nome `VITE_SUPABASE_URL`, valor `https://rlgdjiowvnfzsedehyga.supabase.co`
   - Nome `VITE_SUPABASE_ANON_KEY`, valor a chave anon/publishable do Supabase (a mesma do seu `.env`)
2. Ainda em **Settings** → **Actions** → **General** → seção **"Workflow permissions"** → marcar
   **"Read and write permissions"** → **Save**.

**Toda vez que quiser publicar uma versão nova** (inclusive a primeira, pra já ter um instalador pra
levar pro PC da borracharia):

1. **Peça pra mim (Claude) atualizar o campo `"version"` do `package.json`** pro número da versão
   nova primeiro, numa mensagem separada — ex: "atualiza a versão pra 0.1.2 e publica". Isso é
   importante: o nome da release no GitHub vem desse campo, **não** da tag do Git — se esquecer
   desse passo, o `electron-builder` continua achando que está construindo a versão anterior e
   atualiza a release errada em vez de criar uma nova (foi exatamente isso que aconteceu tentando a
   v0.1.1 nesta sessão — ver bug documentado abaixo).
2. Depois que eu confirmar que atualizei e mergeei, no terminal:
   ```powershell
   git checkout main
   git pull origin main
   git tag v0.1.2
   git push origin v0.1.2
   ```
   (o número da tag precisa ser **exatamente igual** ao que ficou em `"version"` no `package.json`.)

Isso dispara o build automaticamente no GitHub — demora uns 5 a 10 minutos. Quando terminar, o
instalador aparece em `github.com/caranovavidanova/amigao/releases` — baixe o arquivo `.exe` de lá e
rode no PC da borracharia (o Windows/SmartScreen deve avisar "editor desconhecido"; é normal sem
certificado de assinatura pago — clique em "Mais informações" → "Executar assim mesmo"). Da próxima
vez que você publicar uma tag nova, esse mesmo PC vai se atualizar sozinho, sem precisar reinstalar.

**🐛 Achado e corrigido testando a v0.1.0 de verdade nesta sessão**: por padrão o `electron-builder`
publica a release do GitHub como **rascunho (Draft)** — ela builda certinho, mas fica invisível/
indisponível até alguém clicar manualmente em "Publish release" no site do GitHub. Isso quebraria a
atualização automática (o `electron-updater` só enxerga releases publicadas, não rascunhos).
**Corrigido** adicionando `"releaseType": "release"` na configuração `publish` do `package.json` — a
partir da tag seguinte (a v0.1.0 precisou ser publicada manualmente essa vez só), as próximas já saem
publicadas direto, sem esse passo manual.

**🐛 Segundo bug achado testando a v0.1.1 nesta mesma sessão**: publicar uma tag `v0.1.1` sem antes
atualizar o campo `"version"` do `package.json` (que continuava `"0.1.0"`) fez o `electron-builder`
**atualizar a release "0.1.0" já existente** (trocando os arquivos internamente) em vez de criar uma
release "0.1.1" nova — porque o nome da release que ele publica no GitHub vem do `"version"` do
`package.json`, não da tag do Git que disparou o build. Isso confundiu bastante o processo (a tag
`v0.1.1` existia e apontava pro commit certo, mas nenhuma release "0.1.1" aparecia). **Regra daqui pra
frente**: sempre atualizar `"version"` no `package.json` pro mesmo número da tag **antes** de publicar
— documentado no tutorial acima como passo 1.

## 10. Estado do Git

- Repositório: `caranovavidanova/amigao` (era um projeto antigo chamado "Pneus Amigão" em Next.js —
  foi **completamente substituído** a pedido explícito do usuário; ver commit `853a8cc`).
- **`main` agora É o Sakura System** — nesta sessão, a branch `claude/sakura-autocenter-status-m6sio5`
  (histórico completo do Sakura System + fix do `AGENTS.md` + este arquivo atualizado) foi mergeada
  em `main` a pedido do usuário, especificamente para permitir clonar o projeto em outro computador
  (ex: PC do trabalho) sem precisar trocar de branch — um `git clone` simples já traz a versão
  certa. O PR [#2](https://github.com/caranovavidanova/amigao/pull/2) (`qjzqab` → `main`) foi
  fechado por já estar contido nesse merge.
- Branches antigas que **não** precisam mais ser usadas (mantidas só por histórico, seguro ignorar
  ou apagar): `claude/sakura-system-autocenter-qjzqab`, `claude/sakura-system-autocenter-cyfuwh`,
  `claude/software-visual-identity-cjr8f6` (essa mantinha a marca "Pneus Amigão", PR #1 fechado sem
  merge).
- **Sessões futuras**: pode trabalhar direto a partir de `main` — não é mais necessário conferir
  divergência entre branches antes de começar.
- `package.json` ainda em `"version": "0.1.0"`, sem tags Git de release.
- PR [#4](https://github.com/caranovavidanova/amigao/pull/4) (múltiplos veículos + fix de rolagem +
  Estoque como categoria única, ver seção 7) foi mergeado em `main` nesta sessão, a pedido explícito
  do usuário ("pode deixar pra por na main quando terminar a categoria do estoque") — autorização
  dada *antes* de o usuário rodar essas mudanças na máquina dele. Ele ainda não confirmou rodando de
  verdade; se aparecer algum problema ao testar, é código já em `main`, não numa branch separada.
- PR [#6](https://github.com/caranovavidanova/amigao/pull/6) (login com usuário/senha + permissões
  por operador, ver seção 7) foi mergeado em `main` nesta sessão, **depois** de o usuário testar de
  verdade com o Supabase dele (criar admin, logar, cadastrar operador limitado, conferir sidebar
  filtrada, confirmar que reabrir o app pede login de novo) e pedir explicitamente pra abrir e
  mergear o PR.
- PR [#8](https://github.com/caranovavidanova/amigao/pull/8) (`claude/sakura-autocenter-status-4pek1l`
  → `main`): redesenho do Início (cartões de tendência + calendário), do Login (vidro fosco + fundo
  floral) e cadastro de produto completo (campos novos + margem automática), ver seção 7. **Mergeado
  em `main` nesta sessão, a pedido explícito do usuário** ("faz tudinho na main"), *antes* de o
  usuário rodar essas mudanças com o Supabase dele — inclui duas migrations (0009 e 0010) que ainda
  precisam ser rodadas manualmente no Supabase, ver o tutorial na seção 9. Se aparecer algum
  problema ao testar, é código já em `main`, não numa branch separada.
- PR [#10](https://github.com/caranovavidanova/amigao/pull/10) (`claude/new-session-mufqk9` → `main`):
  módulo Serviços + redesenho da tela de Ordem de Serviço, ver seção 7. **Mergeado nesta sessão**,
  depois de o usuário rodar as migrations 0011/0012 e testar de verdade.
- **Mudança de fluxo a partir daqui** (ver decisão na seção 3): o usuário pediu pra, enquanto não
  existir uma v1.0 publicada, sempre mergear direto em `main` sem deixar PR aberto esperando
  aprovação. O commit dos ajustes seguintes (checklist removido, técnico por item, faturamento com
  parcelas calculadas, config de juros — migration 0013, ver seção 7) foi **mergeado direto em `main`
  nesta mesma sessão**, sem passar por PR. Se precisar achar esse commit específico depois, procurar
  por "técnico" ou "parcelas" no `git log` de `main`.
- PR [#11](https://github.com/caranovavidanova/amigao/pull/11) (`claude/caranovavidanova-amigao-kad1fu`
  → `main`): card "Prazos" removido, nota fiscal + garantia movidos pra aba "Fechamento", migration
  0014 — ver seção 7. Desenvolvida numa branch nomeada (este ambiente de sessão exige um branch antes
  do merge, diferente das sessões anteriores que commitavam direto em `main`) e **mergeada nesta mesma
  sessão**, seguindo a decisão da seção 3 de não deixar PR esperando aprovação manual. Confirmada pelo
  usuário rodando de verdade (migration 0014 executada no Supabase).
- **A partir daqui, sessões neste ambiente devem seguir o mesmo padrão**: criar/reusar a branch
  `claude/caranovavidanova-amigao-kad1fu`, commitar, abrir PR e mergear direto — sem deixar PR
  esperando aprovação manual (mesma decisão da seção 3), só que passando por PR em vez de commit
  direto em `main` (restrição do orquestrador desta sessão, não uma mudança de decisão do usuário).
- **Sessão longa nesta mesma branch, PRs #12 a #20** (todos mergeados nesta sessão, mesmo padrão de
  branch → PR → merge direto, ver seção 7 pro detalhe de cada um): RLS exigindo login (migration 0015,
  PR #13), redesenho "glassmorphism" do app inteiro (PR #14), empacotamento do instalador Windows +
  atualização automática configurados (PR #15), correção de release ficando como rascunho (PR #16),
  correção de logo/imagens quebradas no instalador de verdade — caminho relativo (PR #17), correção de
  `"version"` do `package.json` fora de sincronia com a tag publicada (PR #18), correção de texto
  invisível em modo escuro do Windows + exclusão de cliente silenciosa (PR #19), botão "voltar" em
  vidro em todas as telas/formulários (PR #20). **v0.1.1 foi a única versão do instalador publicada e
  testada de verdade pela usuária até agora** — os PRs #19 e #20 (correções + botão voltar) ainda não
  viraram uma versão nova de propósito, a pedido dela antes de trocar de sessão (ver seção 8.1).
- PR [#22](https://github.com/caranovavidanova/amigao/pull/22) (`claude/project-context-pk6m3h` →
  `main`): Categorias de produto, Relatórios de estoque, Garantias e Contagem/Inventário físico —
  4 itens do menu de Estoque do sistema de referência escolhidos pelo usuário nesta sessão, ver
  seção 7. Migrations 0016 e 0017. Mergeado nesta mesma sessão.
- PR [#23](https://github.com/caranovavidanova/amigao/pull/23): atualização de documentação
  (PROJETO_STATUS.md) referente ao PR #22.
- PR [#24](https://github.com/caranovavidanova/amigao/pull/24): correção da migration 0015 não
  idempotente — achado pela usuária rodando de verdade (erro "política já existe" ao repetir a
  execução), ver item 13 da seção 6.
- PR [#25](https://github.com/caranovavidanova/amigao/pull/25): documentação — registra as 3
  respostas fiscais/garantia da usuária (seção 8.1) e a confirmação de que a 0015 corrigida rodou
  sem erro.
- PR [#26](https://github.com/caranovavidanova/amigao/pull/26): `"version"` do `package.json` subiu
  pra `0.1.2` + `CHANGELOG.md` atualizado, a pedido da usuária pra publicar o próximo instalador.
- PR [#27](https://github.com/caranovavidanova/amigao/pull/27): texto de garantia configurável
  (migration 0018, `TextoGarantiaSection.tsx`, botões "Imprimir/Baixar garantia" na aba Fechamento
  da OS deixaram de ser placeholder) — ver seção 7. Mergeado nesta mesma sessão, ainda sem
  confirmação da usuária rodando com Supabase real (migrations 0016/0017/0018 pendentes de rodar —
  ver tutorial na seção 9).
- PR [#28](https://github.com/caranovavidanova/amigao/pull/28): preview antes de emitir NFe/NFS-e
  ou baixar/imprimir garantia (`Modal.tsx` novo, `FechamentoTab.tsx`) — ver seção 7. Mergeado nesta
  mesma sessão, sem mudança de schema.
- **Tag `v0.1.2` ainda NÃO publicada** — a usuária pediu pra publicar o instalador ("upa o
  instalador") nesta sessão, mas o ambiente de sandbox onde o Claude roda **não tem permissão de
  push direto pra `main`/tags no GitHub** (só pra branches de feature via PR — deu erro `403` ao
  tentar `git push origin v0.1.2`). `package.json` já está em `"version": "0.1.2"` e tudo mergeado
  em `main` (PRs #19 a #28: correções pós-v0.1.1, botão voltar, Categorias/Relatórios de
  estoque/Garantias/Contagem, correção da migration 0015, texto de garantia configurável, preview de
  NF/garantia) — **falta só a usuária rodar no terminal dela**: `git checkout main && git pull
  origin main && git tag v0.1.2 && git push origin v0.1.2` (ver tutorial na seção 9). **Sessões
  futuras: não tentar dar `git push` de tags/direto em `main` a partir do sandbox — vai falhar com
  403 da mesma forma; esse passo é sempre da usuária.**

## 11. Ambiente local do usuário (Windows) — pasta reorganizada e limpa nesta sessão

O usuário tinha (no Windows, em `Desktop`) uma pasta `amigao` (clone antigo do "Pneus Amigão",
branch `main`, com `.git` próprio) contendo **dentro dela** uma segunda pasta também chamada
`amigao` (clone separado, com o Sakura System de verdade). Isso causava confusão de qual `.env`
editar (mesmo problema já registrado na dica de suporte da seção 7). **Totalmente resolvido nesta
sessão** — não precisa repetir esse processo em sessões futuras:

- A pasta interna (com o Sakura System) foi renomeada para `sakura-system-autocenter` e movida pra
  `C:\Users\usuario\Desktop\sakura-system-autocenter` — **essa é a pasta certa a partir de agora**,
  com `.env` configurado e funcionando (testado pelo usuário, Painel de Controle mostrando dados
  reais).
- A pasta antiga (clone do `main` desatualizado) foi renomeada para `amigao_ANTIGO_apagar` como
  backup, confirmado que não tinha nenhuma alteração não salva (`git status` limpo, tudo já no
  GitHub) e **já foi excluída pelo usuário**.
- **Achado à parte, já corrigido**: o `.env.local` da pasta antiga tinha credenciais de um projeto
  Supabase totalmente diferente (`nahbbhewpqmedzorhtgo`, prefixo `NEXT_PUBLIC_`, resquício do
  Next.js antigo) e uma `GEMINI_API_KEY`. Nunca foi commitado (está no `.gitignore`), mas ficou
  exposto no chat desta sessão — **o usuário já rotacionou essa chave do Gemini**, não precisa
  avisar de novo.

## 12. Trabalhando de outro computador

O código (tudo que está commitado e no GitHub) e o banco de dados (Supabase) já são 100% na nuvem —
dá pra continuar em qualquer computador com internet. Dois passos manuais em cada computador novo,
porque nunca ficam salvos no Git (por segurança):

```bash
git clone https://github.com/caranovavidanova/amigao.git
cd amigao
npm install
cp .env.example .env   # editar com VITE_SUPABASE_URL=https://rlgdjiowvnfzsedehyga.supabase.co
                        # e VITE_SUPABASE_ANON_KEY=<chave anon, em Settings -> API no Supabase>
npm run dev
```
