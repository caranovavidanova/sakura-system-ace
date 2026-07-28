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
- Estilo: painel visual e acolhedor, cards com indicadores tipo velocímetro/gauge, navegação
  lateral por módulos, bastante espaçamento (oposto da densidade de ERP tradicional).
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

## 4. Estrutura de pastas

```
amigao/                        (raiz do repositório GitHub: caranovavidanova/amigao)
├── electron/main.ts            # processo principal (janela, autoUpdater, abre DevTools em modo dev)
├── electron/preload.ts         # bridge (hoje só expõe versão do app)
├── src/
│   ├── main.tsx, App.tsx       # entrada React + rotas (App.tsx decide Login vs. app conforme sessão)
│   ├── contexts/AuthContext.tsx # sessão do Supabase Auth + perfil do operador logado (hook useAuth)
│   ├── components/             # Sidebar.tsx, Logo.tsx, Sparkline.tsx, MiniCalendario.tsx, PermissaoRoute.tsx (guarda de rota por permissão)
│   ├── lib/                    # supabase.ts + um arquivo por entidade (clientes.ts, pecas.ts, estoque.ts, ordensServico.ts, caixa.ts, operadores.ts, auth.ts, errors.ts) + feriados.ts (feriados nacionais, com Páscoa calculada)
│   ├── pages/<modulo>/          # uma pasta por módulo: painel, clientes, estoque, ordens-servico, caixa, relatorios, lucratividade, login, configuracoes
│   │   └── cada pasta tem: <Modulo>Page.tsx (lista) + <Modulo>Form.tsx (formulário)
│   │       — exceção: pages/estoque/ não tem mais "Peças" como módulo separado (ver seção 7);
│   │       EstoquePage.tsx tem abas "Produtos" (ProdutosSection.tsx + PecaForm.tsx) e
│   │       "Movimentações" (MovimentacoesSection.tsx + MovimentoForm.tsx)
│   ├── styles/globals.css      # paleta Sakura System (Tailwind v4 @theme)
│   └── types/                  # um arquivo por entidade (cliente.ts, peca.ts, estoque.ts, os.ts, caixa.ts, operador.ts)
├── supabase/migrations/         # SQL numerado sequencialmente (0001 a 0009), todas idempotentes (seguro rodar de novo)
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

## 5. Modelagem de dados (Supabase / Postgres) — como está hoje

- **`clientes`**: id, nome, cpf_cnpj, telefone, email, cep, rua, numero, bairro, cidade, uf,
  data_nascimento (migration 0009 — usada pro calendário do Início marcar aniversário do mês), criado_em
- **`veiculos`**: id, cliente_id (FK), placa, marca, modelo, ano, cor, km_atual, criado_em
- **`pecas`**: id, codigo_interno, descricao, unidade, preco_custo, preco_venda, ncm, cfop_padrao,
  cst_ou_csosn, aliquota_icms, ativo, criado_em
- **`estoque_movimentos`**: id, peca_id (FK), tipo (`entrada`/`saida`), quantidade, motivo
  (`compra`/`venda`/`ajuste`/`uso_em_os`), referencia, criado_em
- **`ordens_servico`**: id, cliente_id (FK), veiculo_id (FK, opcional), status
  (`aberta`/`em_andamento`/`concluida`/`faturada`), km_entrada, descricao_problema, forma_pagamento,
  data_abertura, data_fechamento
- **`ordens_servico_itens`**: id, ordem_servico_id (FK), tipo (`peca`/`servico`), peca_id (FK opcional,
  só para tipo peça), descricao, quantidade, preco_unitario, desconto
- **`caixa_movimentos`**: id, data, ordem_servico_id (FK opcional, único — 1 lançamento por OS
  faturada), tipo (`entrada`/`saida`), forma_pagamento, valor, descricao
- **`operadores`**: id (= id do usuário no Supabase Auth), usuario (único), nome, admin (bool),
  permissoes (`text[]` com as chaves de `MODULOS` em `src/types/operador.ts`: painel, clientes,
  estoque, ordens_servico, caixa, relatorios, lucratividade), ativo, criado_em. Única tabela com RLS
  de verdade (baseada em login) — ver seção 6.

Regra de negócio já implementada: ao criar uma OS com item tipo peça, gera automaticamente uma
saída em `estoque_movimentos` (motivo `uso_em_os`). Ao faturar uma OS, gera automaticamente uma
entrada em `caixa_movimentos` com o valor total da OS.

## 6. Dívidas técnicas / pontos de atenção — IMPORTANTE

1. **RLS ainda aberto nas tabelas de negócio** (clientes, veículos, peças, estoque, OS, caixa — todas
   com `for all using (true) with check (true)`). Isso **não mudou** com a chegada do login: foi uma
   decisão explícita desta sessão (ver seção 3) manter a permissão só na interface, não em RLS por
   categoria, por ser mais rápido de construir e resolver o problema real do usuário (organizar o que
   cada operador vê). Consequência real: **qualquer pessoa com a chave `anon`** (que vai dentro do
   app instalado) ainda consegue ler/escrever essas tabelas direto pela API do Supabase, sem passar
   pela tela de login — a autenticação hoje protege a experiência dentro do app, não o banco em si.
   A única tabela com RLS de verdade é `operadores` (ver item 2). Se em algum momento o risco mudar
   (ex: sistema for vendido pra terceiros, não só famílias de confiança), vale revisitar essa decisão.
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
5. **App nunca foi empacotado de verdade** (`npm run electron:build` / instalador `.exe`) — só
   testado em modo dev (`npm run dev`). O ícone/instalador do Windows, ícone da aplicação,
   assinatura de código, etc. ainda não foram configurados em `electron-builder` (não existe seção
   `"build"` no `package.json`).
6. **`electron-updater` está chamado no código** (`electron/main.ts`) mas não há nenhum servidor de
   atualização/publish configurado (ex: GitHub Releases) — vai falhar silenciosamente ou não fazer
   nada até isso ser configurado.
7. **Ambiente de sandbox onde o Claude roda (nuvem) não consegue acessar `*.supabase.co`** — política
   de rede bloqueia (confirmado, erro 403 do proxy da própria plataforma). Isso significa que testes
   de ponta a ponta contra o Supabase real **só podem ser feitos pelo usuário, na máquina dele**. Do
   lado do sandbox, a validação possível é: `tsc --noEmit`, `vite build`, `npm run lint`, e
   screenshots via Playwright + `xvfb-run` (Electron real, headless) renderizando a UI — com dados
   mockados via `page.route()` interceptando as chamadas REST do Supabase, ou com `.env` ausente
   para ver os estados vazios/aviso.
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

**⏳ Implementado nesta sessão (branch `claude/sakura-autocenter-status-4pek1l`), ainda sem
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

## 8. O que NÃO existe ainda (próximos passos possíveis)

Ordem de prioridade sugerida pelo próprio documento inicial do usuário:

1. **Parte fiscal (prioridade alta)**: emissão de NFC-e (peças, padrão estadual/SEFAZ) e NFS-e
   (serviço, padrão municipal — varia por cidade). Estratégia definida: integrar com um provedor
   intermediário (Focus NFe, eNotas, PlugNotas ou similar) em vez de implementar comunicação direta
   com SEFAZ/prefeituras. **Ainda não escolhido qual provedor** — depende de qual cobre o município
   da loja para NFS-e. Isso é uma decisão que precisa ser apresentada ao usuário antes de codar.
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
   borracharia; a categoria em si já foi absorvida (ver seção 7), mas os itens abaixo exigem
   modelagem de dados nova e **precisam de decisão do usuário antes de codar** (apresentar opções +
   recomendação, não decidir sozinho — ver seção 1):
   - Pedido de Compra / Cotações de Peças por fornecedor (implica cadastro de Fornecedor)
   - Entrada de Produtos via NFe (importação de XML de nota fiscal do fornecedor)
   - Cadastro de Depósito (múltiplos locais físicos de estoque)
   - Peças em Garantia (rastreamento de garantia por peça/fornecedor)
   - Contagem/Inventário físico (conciliação entre estoque contado e sistema)
   - Grupo/Categoria de produto (permitiria "atualizar preço por grupo", "zerar estoque por grupo",
     relatórios por categoria — hoje `pecas` não tem esse campo)
   - Relatórios adicionais do menu "Relações": estoque físico-financeiro, produtos não
     vendidos/comprados, estoque positivo/negativo/zerado — a maioria dá pra derivar dos dados que já
     existem (`pecas` + `estoque_movimentos`), sem mudança de schema, então são candidatos mais
     simples de priorizar primeiro dentro desta lista.

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
`supabase/migrations/*.sql` (0001 a 0006) — segundo a sessão anterior, já foram todas aplicadas e
confirmadas funcionando pelo usuário nesse projeto. Mesmo assim, agora são seguras de rodar de novo
(idempotentes) caso precise reconectar ou usar outro projeto Supabase do zero.

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
  → `main`): redesenho do Início (cartões de tendência + calendário) e do Login (vidro fosco + fundo
  floral), ver seção 7. Aberto a pedido do usuário nesta sessão — ainda não mergeado, usuário ainda
  não rodou essas mudanças com o Supabase dele.

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
