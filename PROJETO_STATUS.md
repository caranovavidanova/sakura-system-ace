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
- O usuário testa em uma máquina Windows local, usando **VS Code** (terminal integrado, geralmente
  PowerShell). Ele copia e cola os comandos que eu forneço — eu não tenho acesso à máquina dele.
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
- Logo: flor de sakura estilizada em `public/sakura-icon.svg` (placeholder simples — a logo real
  com "Sakura System" + "by Sakura Corp" ainda não foi fornecida como arquivo de imagem).

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

## 4. Estrutura de pastas

```
amigao/                        (raiz do repositório GitHub: caranovavidanova/amigao)
├── electron/main.ts            # processo principal (janela, autoUpdater)
├── electron/preload.ts         # bridge (hoje só expõe versão do app)
├── src/
│   ├── main.tsx, App.tsx       # entrada React + rotas
│   ├── components/             # Sidebar.tsx, Gauge.tsx (reutilizáveis)
│   ├── lib/                    # supabase.ts + um arquivo por entidade (clientes.ts, pecas.ts, estoque.ts, ordensServico.ts, caixa.ts, errors.ts)
│   ├── pages/<modulo>/          # uma pasta por módulo: painel, clientes, pecas, estoque, ordens-servico, caixa, relatorios, lucratividade
│   │   └── cada pasta tem: <Modulo>Page.tsx (lista) + <Modulo>Form.tsx (formulário)
│   ├── styles/globals.css      # paleta Sakura System (Tailwind v4 @theme)
│   └── types/                  # um arquivo por entidade (cliente.ts, peca.ts, estoque.ts, os.ts, caixa.ts)
├── supabase/migrations/         # SQL numerado sequencialmente (0001 a 0006 até agora)
├── CHANGELOG.md                 # ainda tudo em "[Não lançado]" — v1.0.0 NÃO foi tagueada (usuário pediu pra esperar)
└── .env (local, não commitado)  # VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY (chave "publishable")
```

**Padrão de código estabelecido** (seguir em módulos novos):
- Cada entidade tem: `types/<entidade>.ts` (interfaces + tipo `Novo<Entidade>`), `lib/<entidade>.ts`
  (funções `listar`, `criar`, `excluir` usando o client `supabase`), `pages/<modulo>/<Modulo>Page.tsx`
  (lista + estado de carregamento/erro) e `<Modulo>Form.tsx` (formulário controlado).
- Erros do Supabase **não são `instanceof Error`** — sempre usar `mensagemDeErro()` de
  `src/lib/errors.ts` para exibir a mensagem real (não o `instanceof Error ? ... : "erro genérico"`).
- **Nunca usar `window.prompt()`** — Electron não suporta. `alert()` e `confirm()` funcionam bem.
- Toda tabela nova precisa de RLS + policy (ver seção 6 sobre a dívida técnica de segurança).

## 5. Modelagem de dados (Supabase / Postgres) — como está hoje

- **`clientes`**: id, nome, cpf_cnpj, telefone, email, cep, rua, numero, bairro, cidade, uf, criado_em
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

Regra de negócio já implementada: ao criar uma OS com item tipo peça, gera automaticamente uma
saída em `estoque_movimentos` (motivo `uso_em_os`). Ao faturar uma OS, gera automaticamente uma
entrada em `caixa_movimentos` com o valor total da OS.

## 6. Dívidas técnicas / pontos de atenção — IMPORTANTE

1. **RLS totalmente aberto.** Todas as tabelas têm uma policy `for all using (true) with check
   (true)` — ou seja, **qualquer pessoa com a chave pública (que vai dentro do app instalado) tem
   acesso total de leitura/escrita**. Isso foi uma decisão consciente e temporária porque o sistema
   ainda não tem login de usuário. **Antes de considerar o sistema pronto para uso real em produção,
   isso precisa ser substituído** por policies que verificam autenticação (e futuramente
   multi-loja/tenant). Não tratar isso como "só depois" indefinidamente.
2. **Sem autenticação nenhuma.** Não há tela de login, não há conceito de usuário/permissão no
   sistema. Qualquer pessoa que abrir o app tem acesso a tudo.
3. **Uma chave secreta do Supabase (`sb_secret_...`) foi colada no chat pelo usuário em algum
   momento**, por engano (só a `publishable` era necessária). Não foi usada/armazenada no código.
   Vale considerar sugerir ao usuário que rotacione essa chave em Settings → API Keys do Supabase,
   se isso ainda não tiver sido feito.
4. **Sem testes automatizados** (nenhum framework de teste configurado ainda).
5. **App nunca foi empacotado de verdade** (`npm run electron:build` / instalador `.exe`) — só
   testado em modo dev (`npm run dev`). O ícone/instalador do Windows, ícone da aplicação,
   assinatura de código, etc. ainda não foram configurados em `electron-builder`.
6. **`electron-updater` está chamado no código** (`electron/main.ts`) mas não há nenhum servidor de
   atualização/publish configurado (ex: GitHub Releases) — vai falhar silenciosamente ou não fazer
   nada até isso ser configurado.
7. **Ambiente de sandbox onde o Claude roda (nuvem) não consegue acessar `*.supabase.co`** — política
   de rede bloqueia (confirmado, erro 403 do proxy). Isso significa que testes de ponta a ponta contra
   o Supabase real **só podem ser feitos pelo usuário, na máquina dele**. Do lado do sandbox, a
   validação possível é: `tsc --noEmit`, `vite build`, e screenshots via Playwright renderizando a UI
   (com dados mockados ou com `.env` ausente para ver estados vazios).

## 7. O que já está pronto e validado (pelo usuário, rodando de verdade)

Todos os itens abaixo foram testados pelo usuário na máquina dele e confirmados funcionando:

1. ✅ Cadastro de Clientes (+ veículo)
2. ✅ Cadastro de Peças/Produtos (com campos fiscais NCM/CFOP/CST-CSOSN/ICMS)
3. ✅ Estoque (entrada/saída, saldo calculado)
4. ✅ Ordens de Serviço (cliente + veículo + itens de peça/serviço, baixa automática de estoque)
5. ✅ Caixa Diário (manual + automático via faturamento de OS)
6. ✅ Relatórios (comparativo diário/semanal/mensal)
7. ✅ Lucratividade (margem por peça/serviço, período filtrável)
8. ✅ Painel de Controle (gauges de faturamento e margem, fila de atendimento)

**Isso fecha 100% do escopo da v1 definido pelo usuário no início do projeto.** A v1.0.0 ainda não
foi formalmente "lançada" (tag/versão) — perguntei e o usuário preferiu continuar em desenvolvimento
antes de fechar a versão.

## 8. O que NÃO existe ainda (próximos passos possíveis)

Ordem de prioridade sugerida pelo próprio documento inicial do usuário:

1. **Parte fiscal (prioridade alta)**: emissão de NFC-e (peças, padrão estadual/SEFAZ) e NFS-e
   (serviço, padrão municipal — varia por cidade). Estratégia definida: integrar com um provedor
   intermediário (Focus NFe, eNotas, PlugNotas ou similar) em vez de implementar comunicação direta
   com SEFAZ/prefeituras. **Ainda não escolhido qual provedor** — depende de qual cobre o município
   da loja para NFS-e. Isso é uma decisão que precisa ser apresentada ao usuário antes de codar.
2. **Autenticação / login de usuário** — pré-requisito para resolver a dívida técnica do RLS aberto
   (seção 6.1) e para multi-loja no futuro.
3. Refinamentos possíveis no Painel de Controle, conforme feedback do usuário.

Funcionalidades explicitamente **futuras** (não implementar sem pedido explícito, mas manter
arquitetura aberta): integração com maquininha de cartão (TEF), assistente de IA para estoque,
importador universal de dados de outros sistemas, versão mobile, outras edições do Sakura System
(ex: Supermarket Edition).

## 9. Como rodar localmente (resumo)

```bash
npm install
cp .env.example .env   # preencher com VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY (chave publishable)
npm run dev            # abre o app Electron com hot reload
```

Migrations em `supabase/migrations/*.sql` (0001 a 0006) precisam ser rodadas em ordem no SQL Editor
do projeto Supabase do usuário (projeto chamado "Sakura System", ref `rlgdjiowvnfzsedehyga`, região
São Paulo) — todas já foram aplicadas e confirmadas funcionando pelo usuário até este ponto.

## 10. Estado do Git

- Repositório: `caranovavidanova/amigao` (era um projeto antigo chamado "Pneus Amigão" em Next.js —
  foi **completamente substituído** a pedido explícito do usuário; ver commit `853a8cc`).
- Branch de trabalho: `claude/sakura-system-autocenter-cyfuwh` (todo o histórico do Sakura System
  está aqui). Nenhum PR foi aberto ainda; nenhum merge para `main` foi feito.
- `package.json` ainda em `"version": "0.1.0"`, sem tags Git de release.
