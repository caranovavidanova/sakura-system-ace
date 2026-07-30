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
  pro repositório `caranovavidanova/amigao`.

## 2. O que é o projeto

**Sakura System** é uma linha de sistemas de gestão empresarial por nicho. Esta é a primeira
edição: **SSACE — Sakura System AutoCenter Edition**, para autocenters/borracharias. Referência de
mercado: S3Auto (Comsis) — um ERP tradicional e funcional, mas com UX densa/datada. O diferencial
do SSACE é UX simples e moderna, mantendo as funções essenciais de um ERP de autocenter. Depois do
SSACE validado, a ideia é criar outras edições (ex: Supermarket Edition), reaproveitando a base
arquitetural.

### Identidade visual — como está hoje

- Paleta: rosa `#FFC9F3`, roxo `#B38DAC`, cinza `#C7C7C7` (`src/styles/globals.css`, tokens
  `--color-sakura-*`). `sakura-purple-dark` e `sakura-muted` (`#6b5d68`) são as variantes de
  contraste usadas em texto — **nunca usar `text-sakura-gray` como texto** (contraste ~1.5:1,
  reprova WCAG; serve só como borda/fundo sutil) **nem opacidade `/60` ou menor** em cima de
  `sakura-card` — usar `sakura-muted` (secundário) ou `sakura-purple-dark` (primário).
- Estilo "glassmorphism": blocos arredondados translúcidos (`sakura-card`, com
  `backdrop-filter: blur`) flutuando sobre um fundo rosa com brilho difuso (`sakura-shell-bg`),
  aplicado em praticamente toda tela do app (exceto Login, que tem seu próprio vidro fosco sobre
  fundo floral). Cartões de tendência do Início não usam mais gráfico/sparkline — só valor grande
  + seta `›`, com um leve glow interno por métrica (ver seção 7).
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

## 4. Estrutura de pastas

```
amigao/                        (raiz do repositório GitHub: caranovavidanova/amigao)
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
│   │                             # de rolagem 100% customizada, ver seção 2)
│   ├── lib/                     # supabase.ts + um arquivo por entidade (clientes.ts, pecas.ts,
│   │                             # servicos.ts, estoque.ts, ordensServico.ts, caixa.ts,
│   │                             # operadores.ts, funcionarios.ts, notasFiscais.ts, auth.ts,
│   │                             # errors.ts, categorias.ts, categoriasCaixa.ts, contagens.ts,
│   │                             # garantias.ts, contasPagar.ts) + feriados.ts (feriados
│   │                             # nacionais, Páscoa calculada) + configuracoes.ts (juros de
│   │                             # parcelamento + texto de garantia + dados fiscais da loja) +
│   │                             # garantiaTexto.ts + garantiaDocumento.ts (HTML da garantia) +
│   │                             # notaFiscalXml.ts (recibo HTML "versão para o cliente" a partir
│   │                             # do XML) + focusNfe.ts (casca da integração Focus NFe, emissão
│   │                             # ainda não implementada) + corVeiculo.ts (nome de cor em
│   │                             # português → hex aproximado) + origemMercadoria.ts (lista de
│   │                             # códigos de origem da mercadoria, 0 a 8) + iaNotaFiscal.ts
│   │                             # (chama a Edge Function de leitura de nota fiscal por foto)
│   ├── pages/<modulo>/           # uma pasta por módulo: painel, clientes, estoque, servicos,
│   │                             # ordens-servico, funcionarios, caixa, contas-pagar, relatorios
│   │                             # (rota /relatorios, label "Relações"), lucratividade, garantias,
│   │                             # notas-fiscais, login, configuracoes. Cada pasta tem
│   │                             # <Modulo>Page.tsx (lista) + <Modulo>Form.tsx (formulário), com
│   │                             # exceções:
│   │   estoque/       # EstoquePage.tsx com 4 abas: Produtos (ProdutosSection.tsx + PecaForm.tsx +
│   │                   # ImportarNotasFiscaisModal.tsx — leitura por foto), Movimentações
│   │                   # (MovimentacoesSection.tsx + MovimentoForm.tsx), Contagem
│   │                   # (ContagemSection.tsx — inventário físico), Relatórios
│   │                   # (RelatoriosEstoqueSection.tsx). Sem módulo "Peças" separado.
│   │   garantias/      # GarantiasPage.tsx é só lista (deriva de ordens_servico_itens +
│   │                   # pecas.prazo_garantia_dias, sem tabela própria)
│   │   servicos/       # catálogo de serviços, só lista + form, sem abas
│   │   ordens-servico/ # OrdemServicoForm.tsx (form principal) + FaturamentoCard.tsx (faturamento
│   │                   # com parcelas calculadas) + FechamentoTab.tsx (NFC-e/NFS-e + garantia,
│   │                   # só aparece com status concluída/faturada) + GarantiaVisualModal.tsx
│   │   configuracoes/  # JurosParcelasSection.tsx, CategoriasSection.tsx, CategoriasCaixaSection.tsx,
│   │                   # TextoGarantiaSection.tsx, DadosFiscaisSection.tsx, CartoesInicioSection.tsx
│   │                   # (todas dentro de SecaoRecolhivel, exceto Operadores que é sempre visível)
│   │   funcionarios/   # FuncionarioForm.tsx com abas "Dados gerais" e "Família"
│   │   caixa/          # CaixaPage.tsx (orquestrador de abas) + DiarioSection.tsx +
│   │                   # EntradaSaidaSection.tsx (reusado por Entradas/Saídas, parametrizado por tipo)
│   │   notas-fiscais/  # NotasFiscaisPage.tsx com abas NFe/NFS-e + ArquivosSection.tsx +
│   │                   # NotaFiscalVisualModal.tsx (recibo "versão para o cliente")
│   │   contas-pagar/   # ContasPagarPage.tsx + ContaPagarForm.tsx + PagarContaModal.tsx
│   ├── styles/globals.css       # paleta Sakura System (Tailwind v4 @theme)
│   └── types/                    # um arquivo por entidade + configuracao.ts (JurosParcela,
│                                  # ConfiguracaoGarantia, ConfiguracaoFiscalLoja) +
│                                  # itemNotaFiscal.ts (item extraído da leitura por IA)
├── supabase/migrations/          # SQL numerado sequencialmente (0001 a 0027), todas idempotentes
├── supabase/functions/           # Edge Functions (Deno) — ler-notas-fiscais/index.ts (única até
│                                  # agora): lê fotos de nota fiscal via Claude/Anthropic e devolve
│                                  # os produtos estruturados. A ANTHROPIC_API_KEY fica só como
│                                  # secret dessa função no Supabase, nunca no app instalado.
├── build/icon.png                # ícone do app (1024x1024, gerado a partir de public/sakura-icon.svg)
├── .github/workflows/release.yml # builda + publica o instalador Windows no GitHub Releases quando uma tag "v*" é enviada
├── eslint.config.js              # flat config do ESLint 9
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

**Skill `/gerar-modulo`** (`.claude/skills/gerar-modulo/SKILL.md`): automatiza a criação de um
módulo novo inteiro (migration + types + lib + página + form + registro em `MODULOS`/`App.tsx`)
seguindo esse padrão de código. Uso: `/gerar-modulo <Nome do módulo>`. Preferir essa skill a fazer
o andaime manualmente sempre que o pedido for "módulo/cadastro novo".

## 5. Modelagem de dados (Supabase / Postgres) — como está hoje

Migrations `0001` a `0027` em `supabase/migrations/`, todas confirmadas rodando sem erro no
projeto Supabase da usuária (ref `rlgdjiowvnfzsedehyga`). Todas idempotentes — seguro rodar de
novo caso precise reconectar ou montar outro projeto Supabase do zero (ver seção 9).

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
  no cadastro de produto. Sem hierarquia nem campos extras, de propósito.
- **`servicos`** (catálogo de serviços, análogo a `pecas` mas sem estoque): id, codigo_interno
  (opcional), descricao, preco_padrao, ativo, criado_em
- **`estoque_movimentos`**: id, peca_id (FK), tipo (`entrada`/`saida`), quantidade, motivo
  (`compra`/`venda`/`ajuste`/`uso_em_os`), referencia, criado_em
- **`ordens_servico`**: id, cliente_id (FK), veiculo_id (FK, opcional), status
  (`aberta`/`em_andamento`/`concluida`/`faturada`), km_entrada, descricao_problema (rótulo
  "Observação"), forma_pagamento, parcelas (int, default 1, preenchido no faturamento),
  data_abertura, data_fechamento, vendedor_id (FK **funcionarios**)/criado_por_id/atualizado_por_id
  (FK operadores — autoria de sistema).
- **`ordens_servico_itens`**: id, ordem_servico_id (FK), tipo (`peca`/`servico`), peca_id (FK
  opcional, só tipo peça), servico_id (FK opcional, só tipo serviço — item de serviço pode ficar
  sem servico_id quando for "avulso"), tecnico_id (FK **funcionarios**, opcional — técnico
  responsável por aquele item, diferente do vendedor/atendente que é da OS toda), descricao,
  quantidade, preco_unitario, desconto
- **`configuracoes_juros_parcelas`**: numero_parcelas (PK, 2 a 12), juros_percentual. Editável só
  pelo admin — define o juro (% sobre o total) cobrado quando o cliente parcela no cartão ao
  faturar uma OS. 1x é sempre à vista, sem juros.
- **`caixa_movimentos`**: id, data, ordem_servico_id (FK opcional, único — 1 lançamento por OS
  faturada), tipo (`entrada`/`saida`), forma_pagamento, valor, descricao, categoria_id (FK
  categorias_caixa, opcional)
- **`categorias_caixa`**: id, nome, tipo (`entrada`/`saida`), criado_em. Gerenciada em
  Configurações (admin), selecionável ao lançar um movimento manual no Caixa (ex: "Aluguel",
  "Sucata"). Tabela separada de `categorias` (que é só pra produtos) — o conceito é diferente.
- **`funcionarios`**: id, nome, cargo (texto livre, opcional), operador_id (FK operadores,
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
- **`contagens_estoque`**: id, peca_id (FK), quantidade_contada, saldo_sistema, diferenca,
  observacao, operador_id (FK operadores), criado_em. Ao salvar com diferença, gera
  automaticamente um ajuste em `estoque_movimentos`.
- **`configuracoes_garantia`**: "singleton" (1 linha, `id` fixo em 1) com `texto` — template do
  texto de garantia, placeholders `{cliente}`/`{veiculo}`/`{itens}`/`{data}` substituídos na hora
  (`lib/garantiaTexto.ts`). Editável só pelo admin.
- **`notas_fiscais_arquivos`**: id, tipo (`nfe`/`nfse`), competencia (date, 1º dia do mês),
  nome_arquivo, storage_path, ordem_servico_id (FK opcional), operador_id (FK operadores),
  criado_em, origem (`manual`/`automatica`, default `manual`), numero/chave_acesso/status
  (opcionais, preenchidos só quando `origem = automatica`, sem uso real ainda). O XML em si fica
  no **Supabase Storage**, bucket privado `notas-fiscais` (`storage_path`:
  `<tipo>/<ano>-<mes>/<uuid>-<nome original>`).
- **`configuracoes_fiscais_loja`**: "singleton" com cnpj, razao_social, nome_fantasia,
  inscricao_estadual, inscricao_municipal, regime_tributario, endereço da loja, telefone, email,
  focus_nfe_token, focus_nfe_ambiente (`homologacao`/`producao`). Reaproveitada pelo cabeçalho do
  documento de garantia.
- **`operadores`**: id (= id do usuário no Supabase Auth), usuario (único), nome, admin (bool),
  permissoes (`text[]` com as chaves de `MODULOS` em `src/types/operador.ts`), ativo, criado_em.
  Única tabela com RLS de verdade baseada em login (ver seção 6).
- **`contas_pagar`**: id, descricao, valor, vencimento (date), categoria_id (FK
  categorias_caixa, opcional), recorrente (bool), status (`pendente`/`paga`), data_pagamento
  (opcional), caixa_movimento_id (FK, opcional — a Saída gerada ao marcar como paga), operador_id
  (FK operadores), criado_em. Marcar como paga gera automaticamente uma Saída em
  `caixa_movimentos` e, se `recorrente`, cria a próxima ocorrência (mesmo valor, +1 mês) sozinha.
  **Sem "desfazer pagamento"** pelo app ainda.
- **`configuracoes_painel_inicio`**: "singleton" com `cartoes` (`text[]`, até 3 chaves) — define
  quais indicadores aparecem nos cartões de tendência da tela Início. Ajuste único pra loja
  inteira, editável só pelo admin. As 5 chaves possíveis ficam em `CARTAO_METRICA_LABEL`
  (`types/configuracao.ts`): vendas_mes, custos_mes, lucros_mes, ticket_medio_mes,
  contas_pagar_vencendo. Padrão atual: Vendas/Lucro/Ticket médio (Custos saiu do padrão por não
  ser legal mostrar "algo negativo" logo de cara).

Regras de negócio já implementadas: ao criar uma OS com item tipo peça, gera automaticamente uma
saída em `estoque_movimentos` (motivo `uso_em_os`). Ao faturar uma OS, gera automaticamente uma
entrada em `caixa_movimentos` com o valor total (já incluindo juros, se parcelado). Garantia dada
ao cliente (módulo "Garantias") **não tem tabela própria** — deriva de `ordens_servico_itens` +
`pecas.prazo_garantia_dias` + `ordens_servico.data_fechamento`.

**Fora do Postgres** (Supabase Storage): bucket `notas-fiscais` (XMLs enviados manualmente).
**Fora do Postgres/Storage** (Edge Function): `ler-notas-fiscais`, ver seção 4 — não tem tabela
própria, o resultado só passa pela tela de revisão em memória antes de salvar em `pecas`.

## 6. Dívidas técnicas / pontos de atenção — IMPORTANTE

1. **Permissão por módulo checada só na interface, não em RLS por categoria** — um operador
   logado com permissão só de "Caixa", por exemplo, ainda consegue chamar a API do Supabase
   direto pra mexer em "Clientes" se tentar de propósito. RLS exige **login** pra tudo (fecha o
   acesso sem estar logado), mas não reforça por módulo. Fica pra uma etapa futura se o risco
   mudar (ex: sistema vendido pra terceiros, não só a própria loja).
2. **Autenticação**: Supabase Auth, login com usuário/senha (ver seção 3). Ainda faltam: (a)
   **redefinir senha de operador esquecida** — hoje não tem como o admin resetar a senha de outro
   operador pelo app (precisaria de uma Edge Function com a service role key, ainda não
   construída); (b) **multi-loja** — arquitetura continua de loja única (cada loja = 1 projeto
   Supabase próprio).
3. **Uma chave secreta do Supabase (`sb_secret_...`) foi colada no chat pela usuária em algum
   momento**, por engano (só a `anon`/publishable era necessária). Não foi usada/armazenada no
   código. Vale sugerir que ela rotacione essa chave em Settings → API Keys do Supabase, se ainda
   não tiver feito.
4. **Sem testes automatizados** (nenhum framework de teste configurado ainda).
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

## 7. Estado atual por módulo (tudo confirmado rodando de verdade pela usuária, salvo indicação contrária)

**Escopo da v1 original** (100% completo): Clientes (+ veículo), Peças/Produtos (campos fiscais
completos), Estoque (entrada/saída, saldo), Ordens de Serviço, Caixa Diário, Relatórios,
Lucratividade, Painel/Início.

- **Login e permissões**: usuário/senha (sem digitar e-mail), sessão não persiste entre aberturas
  do app (a pedido explícito — o programa fica aberto o dia todo, cada abertura pede login de
  novo). Menu lateral e rotas filtrados por permissão (`PermissaoRoute`/`AdminRoute`). Tela
  Configurações (admin) gerencia operadores com checkboxes de módulo.
- **Clientes**: CRUD + múltiplos veículos por cliente, pessoa física/jurídica (rótulos de
  campo mudam conforme o tipo), aniversário do cliente no calendário do Início, tipo de veículo
  (ícone 2D por carroceria, pintado com a cor cadastrada) exibido na seção "Veículos no pátio".
- **Estoque**: 4 abas — Produtos (cadastro completo com campos fiscais NCM/CFOP/CST-CSOSN/ICMS,
  categoria, garantia em dias, margem calculada nos dois sentidos), Movimentações (com filtro por
  produto), Contagem (inventário físico, gera ajuste automático na diferença), Relatórios (estoque
  físico-financeiro, saldo por situação, produtos sem movimentação). **Importar por foto**: botão
  "📷 Importar por foto" ao lado de "+ Novo produto" — lê uma ou mais fotos de nota fiscal (pode
  ser mais de uma nota junto) via Claude (Sonnet 5, saída estruturada) através da Edge Function
  `ler-notas-fiscais`, mostra uma tabela editável com os produtos identificados e cadastra em lote
  (`ImportarNotasFiscaisModal.tsx`). Chave da Anthropic fica só como secret da Edge Function.
- **Serviços**: catálogo simples (descrição, código opcional, preço padrão), sem estoque/fiscal.
- **Ordens de Serviço**: form em duas colunas, reabre pra editar (só permite acrescentar itens,
  não editar/remover item já lançado — evita desfazer baixa de estoque). Técnico por item +
  vendedor/atendente da OS (ambos listam `funcionarios`, não só operadores). Faturamento
  (`FaturamentoCard.tsx`) calcula parcelas automaticamente conforme os juros configurados em
  Configurações; o valor lançado no Caixa já inclui os juros. Aba "Fechamento" (só aparece com
  status concluída/faturada): botões "Emitir NFC-e"/"Emitir NFS-e" (ainda placeholder, com
  preview do rascunho — emissão de verdade depende do Focus NFe, ver seção 8) e "Ver garantia"
  (abre preview do documento completo — cabeçalho da loja, dados de cliente/veículo, itens,
  totais, forma de pagamento com parcelas reais, assinaturas — com opção de baixar HTML/imprimir
  via `iframe`).
- **Funcionários**: cadastro RH completo (documentos, endereço, cargo/admissão, família/filhos,
  abas "Dados gerais"/"Família"). Todo operador ganha um `funcionarios` espelhado automaticamente.
- **Caixa Diário**: abas Diário (tudo — OS faturadas + manual) / Entradas / Saídas (só
  lançamentos manuais, com categoria opcional via `categorias_caixa`). Card de "Lucro do dia" +
  resumo por forma de recebimento.
- **Contas a Pagar**: contas mensais com vencimento (diferente de Entradas/Saídas manuais, que só
  registram dinheiro que já saiu). Marcar como paga gera Saída automática no Caixa; se recorrente,
  já cria a próxima ocorrência sozinha. Sem "desfazer pagamento" pelo app ainda.
- **Notas Fiscais**: upload manual de XML (NFe/NFS-e) organizado por mês de competência
  (Supabase Storage), vínculo opcional com uma OS. Botão "Versão para o cliente" interpreta o XML
  e monta um recibo HTML (não é o DANFE oficial, sem código de barras/QR code).
- **Relações** (ex-"Relatórios", só o label mudou): gráfico de barras (Vendas x Custos x Lucro,
  Diário/Semanal/Mensal) + radar comparando o período atual com o anterior, sem biblioteca externa
  de gráficos. Paleta categórica própria (verde/laranja/violeta), diferente das cores do Início.
- **Lucratividade**: margem por peça/serviço, período filtrável.
- **Início**: 3 cartões de tendência personalizáveis (Configurações → "Cartões do Início", padrão
  Vendas/Lucro/Ticket médio, sem gráfico — só valor + seta), calendário do mês com feriados
  nacionais + aniversário de cliente + contas a pagar vencendo/vencidas, seção "OS abertas" e
  "Veículos no pátio" (com ícone por tipo/cor).
- **Configurações** (admin): Operadores (sempre visível, com "+ Novo operador"), e seções
  recolhíveis — Juros de parcelamento, Categorias de produto, Categorias de caixa, Texto de
  garantia, Dados fiscais da loja, Cartões do Início.
- **Empacotamento**: `electron-builder` (NSIS) + `electron-updater` configurados,
  `.github/workflows/release.yml` publica o instalador no GitHub Releases quando uma tag `v*` é
  enviada. **Versão atual: `0.1.3`** (tag publicada e instalador baixado pela usuária) — **mas
  muita coisa foi implementada depois da v0.1.3** (Funcionários RH completo, Contas a Pagar,
  Notas Fiscais, Relações com gráficos, cartões personalizáveis, veículos no pátio, scrollbar
  customizada, Importar por foto...) **sem nenhuma tag nova publicada ainda** — se a próxima
  sessão for sobre lançar uma versão nova, é bom já avisar que tem bastante coisa acumulada desde
  a 0.1.3.

## 8. O que NÃO existe ainda (próximos passos possíveis)

1. **Parte fiscal (prioridade alta, NÃO bloqueia o uso na loja)**: emissão de NFC-e (peças) e
   NFS-e (serviço). **Provedor escolhido: Focus NFe, plano básico** — usuária ainda não assinou,
   pediu pra deixar o código "semi pronto" antes. Já feito: modelagem dos dados fiscais da loja
   (`configuracoes_fiscais_loja`) + tela em Configurações + a "casca" da integração HTTP
   (`lib/focusNfe.ts` — auth, URLs por ambiente). **Ainda falta**: a função de emissão de verdade
   (`emitirNFCe()`) — não foi possível confirmar o formato exato do corpo da requisição (CFOP/NCM/
   ICMS por item) contra a documentação oficial do Focus NFe a partir deste ambiente
   (`doc.focusnfe.com.br` bloqueou acesso automatizado, 403); precisa de um token real de
   homologação pra validar contra a API de verdade — **não implementar chutando os nomes dos
   campos**.
2. **Redefinir senha de operador esquecida** (precisaria de Edge Function com service role key) e
   **site externo de assinatura** que cria a primeira conta de cada loja automaticamente (hoje é
   manual, pelo painel do Supabase) — combinado que fica pra quando pensarem na versão comercial.
3. **Logo oficial** — pegar o arquivo `.svg` real da usuária como **anexo** (não colado no chat) e
   aplicar no lugar dos SVGs feitos à mão (ver seção 2 pras duas pendências de upload já vistas).
4. Refinamentos possíveis no Início e demais módulos, conforme feedback da usuária.
5. **Itens do menu de estoque de um sistema de referência (S3Auto/Comsis) ainda não avaliados** —
   dependem de Fornecedores/multi-local, precisam de decisão da usuária antes de codar (opções +
   recomendação, ver seção 1):
   - Pedido de Compra / Cotações de Peças por fornecedor (implica cadastro de Fornecedor)
   - Entrada de Produtos via NFe (importação de XML de nota fiscal do **fornecedor**, diferente do
     "Importar por foto" que já existe — aquele é leitura de foto por IA, esse seria importação de
     um XML estruturado de verdade)
   - Cadastro de Depósito (múltiplos locais físicos de estoque)
   - Peças em Garantia **do fornecedor na compra** (diferente da garantia ao cliente já
     implementada — depende do módulo de Fornecedores ainda não construído)
6. **Sistema de notificação de conta a vencer** — a usuária mencionou a ideia, mas confirmou que é
   pra depois. `contas_pagar` já tem o campo `vencimento` pronto pra isso. Nenhuma decisão de como
   notificar (dentro do app? e-mail? Windows notification?) foi tomada — apresentar opções antes
   de codar.
7. **"Desfazer pagamento" de uma conta paga** (módulo Contas a Pagar) — hoje não existe pelo app;
   se marcar uma conta como paga por engano, precisa corrigir direto no Supabase.
8. **Custo da IA (Anthropic) por loja, quando vender pra terceiros** — a usuária perguntou, ao
   configurar o "Importar por foto", se ela pagaria pelas leituras de todas as lojas que um dia
   usarem o Sakura System. **Resposta atual**: não — como cada loja tem seu próprio projeto
   Supabase, a Edge Function e o secret `ANTHROPIC_API_KEY` ficam dentro do projeto de cada loja,
   então cada uma cria sua própria conta na Anthropic e paga pelo próprio uso (mesmo modelo já
   aceito pro Focus NFe). **Mas isso cria fricção**: pedir pra cada dono de autocenter (sem
   experiência técnica) criar conta na Anthropic e publicar uma Edge Function é um trabalho manual
   chato de repetir por loja. Quando a usuária estiver mais perto de vender pra outras lojas de
   verdade, vale reconsiderar um backend central (ela paga uma conta só, cobra o uso de IA dentro
   da assinatura do sistema) — decidir com calma nessa hora, não agora que só a loja dela usa.

Funcionalidades explicitamente **futuras** (não implementar sem pedido explícito, mas manter
arquitetura aberta): integração com maquininha de cartão (TEF), assistente de IA para estoque,
importador universal de dados de outros sistemas, versão mobile, outras edições do Sakura System
(ex: Supermarket Edition).

**Prioridade da próxima sessão**: em aberto — a usuária ainda não decidiu se prefere avançar na
parte fiscal, fechar a logo oficial, ou outra coisa. Perguntar no início da sessão em vez de
presumir.

## 9. Como rodar / configurar (resumo)

```bash
git clone https://github.com/caranovavidanova/amigao.git
cd amigao
npm install
cp .env.example .env   # preencher com VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY (chave anon/publishable)
npm run dev            # abre o app Electron com hot reload + DevTools
```

Projeto Supabase da usuária: nome "Sakura System", ref `rlgdjiowvnfzsedehyga`, região São Paulo,
URL `https://rlgdjiowvnfzsedehyga.supabase.co`. Todas as migrations `0001` a `0027` já foram
confirmadas rodando sem erro nesse projeto.

### Montar um projeto Supabase do zero (loja nova / outro computador)

Rodar, **nessa ordem**, todo o conteúdo de cada arquivo em `supabase/migrations/*.sql` (SQL
Editor do Supabase — abrir cada um, copiar tudo, colar numa "New query", clicar "Run") — de `0001`
até `0027`. Todas são idempotentes.

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
4. Testar: **Estoque → Produtos → "📷 Importar por foto"**.

**Pegadinha real encontrada configurando isso**: o campo "Name" da tela de configuração da função
**é só um apelido visual** — o aviso "Your slug and endpoint URL will remain the same" avisa que
renomear ali **não muda o endereço real** da função. Se deployar com um nome de exemplo (ex:
`smooth-api`) e só depois tentar renomear pra `ler-notas-fiscais`, a função fica com endereço
`smooth-api` mas nome de exibição `ler-notas-fiscais` — descasado do que o app chama via
`supabase.functions.invoke("ler-notas-fiscais", ...)`. **Correção**: apagar e recriar do zero,
digitando o nome certo **antes** do Deploy. Se acontecer de novo criando outra Edge Function,
conferir se o endereço nos exemplos de `curl`/CLI da tela de configurações bate com o nome
esperado, não confiar só no campo "Name".

### Gerar o instalador Windows e publicar uma versão nova

Builda automaticamente no GitHub e publica o instalador `.exe` pronto pra baixar — os apps já
instalados se atualizam sozinhos quando sai uma versão nova.

**Passo único (só na primeira vez, já feito)**: `github.com/caranovavidanova/amigao` → Settings →
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
em `github.com/caranovavidanova/amigao/releases`. O Windows/SmartScreen deve avisar "editor
desconhecido" (normal sem certificado pago — "Mais informações → Executar assim mesmo"). PCs já
atualizados se atualizam sozinhos na próxima tag.

**Duas pegadinhas já corrigidas** (não devem mais acontecer, mas documentado caso reapareçam): (a)
por padrão o `electron-builder` publica a release como rascunho invisível — corrigido com
`"releaseType": "release"` no `publish` do `package.json`; (b) publicar uma tag sem antes
atualizar `"version"` no `package.json` faz o build atualizar a release **anterior** em vez de
criar uma nova (o nome da release vem do `package.json`, não da tag) — por isso o passo 1 acima é
sempre antes da tag, nunca depois.

## 10. Estado do Git

- Repositório: `caranovavidanova/amigao` (era um projeto antigo "Pneus Amigão" em Next.js,
  completamente substituído). `main` é o Sakura System — um `git clone` simples já traz a versão
  certa, não precisa trocar de branch.
- **Fluxo de trabalho** (ver decisão na seção 3): cada sessão cria/reusa uma branch de trabalho
  designada pelo ambiente, commita, abre PR contra `main` e **já mergeia direto**, sem esperar
  aprovação manual — enquanto não existir uma v1.0 publicada. O histórico completo de PRs
  (descrição, o que mudou, quando foi confirmado) já fica registrado no próprio GitHub — não
  precisa duplicar aqui PR por PR; o que importa pra uma sessão nova é o **estado atual**, que
  está na seção 7.
- **Branch de trabalho atual desta sessão**: `claude/1-0-quase-pronta-fcqe6d`.
- `package.json` em `"version": "0.1.3"` — tag `v0.1.3` publicada e instalador baixado pela
  usuária, mas **sem confirmação de ter rodado/testado o instalador de verdade** (só o
  download/build funcionou). Bastante coisa foi implementada depois dessa tag sem nova versão
  publicada ainda (ver aviso no fim da seção 7).

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
