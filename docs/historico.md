# Histórico: estado do Git e os marcos "onde parou" antigos

> Parte da memória do projeto. O índice é o `PROJETO_STATUS.md` (carrega sozinho em toda sessão);
> este arquivo só é aberto quando o assunto pede. Os números de seção e de item citados aqui
> ("item 33 da seção 6") continuam valendo: a seção 6 é `docs/licoes.md`, a 5 é `docs/banco.md`,
> a 7 é `docs/modulos.md`, a 8 é `docs/pendencias-e-futuro.md` e a 9 é `docs/operacao.md`.

## 10. Estado do Git

- **Repositório**: `sakura-corp/sakura-system-ace`, **público**, desde 29/09/2026 (transferido da
  conta pessoal dela; o endereço antigo `caranovavidanova/sakura-system-ace` redireciona). Antes
  chamava `amigao` e era um site em Next.js, substituído por completo. Ficou público porque o
  atualizador baixa as versões sem login (item 21 da seção 6); por isso nada de credencial em
  arquivo nenhum, e o que já vazou tem de ser **trocado**, não só apagado.
- **Fluxo**: cada sessão trabalha na branch que o ambiente designa, abre PR contra a `main` e, se
  quem trabalha é ela, **mescla direto** (seção 3 do `PROJETO_STATUS.md`). Os PRs guardam o
  detalhe de cada mudança; aqui fica só o que ajuda uma sessão nova.
- **Versão e banco**: conferir sempre nas releases do GitHub (a tabela de versões está em
  "Empacotamento", seção 7). Em 30/09/2026: `v0.9.47` publicada e liberada; banco na `0064`.
- **Lição do episódio "duas linhas de trabalho paralelas" (agosto de 2026)**: enquanto uma sessão
  do Claude mesclava Fornecedores simples na `main`, ela tinha no próprio PC, sem commit, um
  trabalho bem maior feito com outra ferramenta de IA (Antigravity: Fornecedores com Pedido de
  Compra, Auditoria, testes, formulários em `react-hook-form` + `zod` e o tema escuro/neon). O
  `git pull` recusou, com razão, e o trabalho foi salvo com `git stash -u` e virou a base
  principal. **Regra**: se um `git pull`/`checkout` mostrar muitos arquivos modificados que a
  sessão não reconhece, é trabalho feito por fora. Nunca descartar: perguntar e usar `git stash`
  antes de qualquer comando que possa apagar.

## Marcos antigos, do mais novo pro mais velho

Cada bloco é o "Onde parou" de uma sessão, como estava quando ela terminou: **os status dentro
deles envelhecem** ("falta", "ainda não"). O que continua valendo foi levado pros arquivos de
`docs/`; o que depende dela está em "O que depende dela", na seção 8. Na dúvida, vale o arquivo de
`docs/`, não o marco.

### Onde parou em 29-30/09/2026: organização `sakura-corp`, travas, senhas e o plano do painel

Mesma sessão do comparativo com o Anexar e do exemplo de DRE (esse bloco foi pro topo de
`docs/historico.md`). **Estado do código** no fim: `main` na **`v0.9.47`** (**publicada e liberada**
pra todas as lojas em 29/09), banco na **`0064`**.

#### Decidido por ela (29/09)
- **Organização `sakura-corp` no GitHub**, criada por ela (pertence à conta pessoal dela até
  existir CNPJ), com o app do Claude instalado em todos os repositórios. **O `sakura-system-ace`
  foi transferido pra lá**: o endereço agora é `sakura-corp/sakura-system-ace`, e o antigo
  (`caranovavidanova/sakura-system-ace`) redireciona. Conferido: o `latest.yml` pelo endereço
  antigo responde `301` pro novo.
- **Ficam na conta pessoal**: `caranovavidanova/ssace-backups` e `caranovavidanova/sakura-corp`
  (o privado). **Cuidado com o nome**: a organização `sakura-corp` e o repositório privado
  `sakura-corp` são coisas diferentes. Se o privado for pra organização um dia, **antes** desligar
  a leitura dos membros (senão todo membro lê preço, margem e sócios).
- **Nunca criar na conta pessoal dela um repositório chamado `sakura-system-ace`**: isso quebra o
  redirecionamento, que é por onde os programas instalados procuram atualização até receberem a
  versão com o endereço novo.
- **Gustavo** (tem Claude Pro) entra como colaborador do `sakura-system-ace` pra construir o
  painel da equipe, no PC dele e com os tokens dele. **O acordo provisório não é pré-requisito**
  (isso muda a ordem do marco de 28/09).
- **O painel mora dentro do `sakura-system-ace`**: pasta `painel/`, manual em `docs/painel.md`.
  Isso substitui o repositório separado `sakura-painel` do marco de 28/09. Formato: página web
  React + Vite, tarefas nas **issues do GitHub** com uma etiqueta por leva, login pelo GitHub.
  **1ª versão**: a lista de tarefas da leva e quem está com cada uma.
- O `EQUIPE.md` do privado ainda descreve o `sakura-painel` separado: corrigir quando o privado
  estiver na sessão.

#### Próximos passos, na ordem dela
1. **Trocar o endereço no programa** (`package.json` → `build.publish`, e o endereço reserva em
   `scripts/liberar-versao.mjs`) → versão no canal de teste → ela testa no PC da casa dela →
   liberar pro Balcão. Se algum dos dois não atualizar sozinho, reinstalar à mão.
   **FEITO (29/09)**: a **`v0.9.47`** (só a troca de endereço) foi publicada, o PC da casa dela
   **atualizou sozinho** (então o redirecionamento do endereço antigo funciona pro canal de teste
   também) e ela foi **liberada pra todas as lojas** a pedido dela. **Falta só confirmar** que o
   Balcão chegou na `0.9.47` na próxima vez que o programa for aberto na loja; se não chegar,
   reinstalar à mão pelo link `releases/latest/download/SakuraSystem-Setup.exe` do endereço novo.
2. **Travas**: cofre (environment) `backup` só pra `main`; cofre `lojas` só pra `main` + aprovação
   dela, pros workflows "Liberar versão" e "Atualizar bancos"; `main` só por PR com aprovação (ela
   isenta); só ela cria tag `v*`. **Risco que fica**: quem tem escrita consegue editar uma release
   publicada na mão. Isso fica protegido só pela regra na memória.
   **Os dois cofres: FEITOS (30/09)**, ver "As senhas" abaixo. **Regra 1, `main protegida`: FEITA
   (30/09)**: ruleset na branch padrão, PR obrigatório com 1 aprovação (cai com commit novo, e a do
   último push tem que ser de outra pessoa), sem apagar nem force push; **Repository admin isento
   (Always allow)**. **Regra 2**: o Release passou pelo cofre `lojas` (aprovação dela) e **perdeu o
   gatilho de push de tag**, só "Run workflow" na `main` (PR #342); e o ruleset de tag **`versões`**
   foi criado (`v*`: bloqueia mudar, apagar e force push, não criar; Repository admin isento).
   **PASSO 2 COMPLETO (30/09).** O merge do #342, sem aprovação, confirmou a isenção dela.
   **O risco que fica é maior do que o anotado acima** (achado em 30/09): quem tem escrita no
   repositório consegue, com um workflow modificado **na própria branch**, usar o token automático
   do Actions (`contents: write`) pra **publicar, liberar ou trocar arquivo** de uma versão. As
   travas dos workflows oficiais não alcançam isso; os **secrets dos cofres, sim** (só `main`),
   então banco e backup ficam protegidos de verdade. Por isso "só ela cria tag `v*`" não dá pra ser
   uma regra de tag que bloqueia criação: quem cria a tag é o próprio Release, com esse token, e o
   GitHub não deixa isentá-lo. **Ela aprovou (30/09)** a regra de tag só pra mudar e apagar `v*`, e
   o Release pelo cofre `lojas`. **Decidido por
   ela (30/09)**: aceitar o risco por enquanto; a trava de verdade (as versões num **repositório
   separado, onde colaborador não escreve**, o mesmo "repositório só de versões" de fechar o código)
   fica **pra depois**. Cuidado barato sugerido: o Balcão no canal normal.
3. **Memória**: o trecho "quando quem está trabalhando não é a Sofia" (abre PR e **não mescla**,
   não publica nem libera, não mexe no banco) + `docs/painel.md` + as issues da leva 0.
   **Parte 1 FEITA (30/09)**: é a seção 0, no topo deste arquivo, revisada por ela. Escopo de quem
   não é ela, por enquanto: **só o painel** ("depois todos vão mexer no sistema").
   **Parte 2 FEITA (30/09)**: `docs/painel.md`. Decidido por ela nesta parte: **Cloudflare** (página
   + login, plano grátis; não Supabase), **login pelo GitHub já na 1ª versão** (GitHub App da
   organização, só membros da `sakura-corp`), e nas tarefas **a pessoa pega uma livre, uma por
   vez**. Depois, também decidido: o Claude deles **guia passo a passo, com calma**, em tudo que não
   for programar (virou regra da seção 0); a pessoa só diz *"quero fazer a tarefa #N"* e o Claude
   explica antes de começar; a próxima tarefa só começa depois da anterior **aprovada** ("Depende
   de"); aviso no fim de cada tarefa **pelo GitHub e pelo WhatsApp** (mensagem que o Claude
   escreve); e o "Fim de uma leva". Tudo no `docs/painel.md`.
   **Parte 3 FEITA (30/09, à tarde)**: com o "ok" dela, a etiqueta `leva-0` e as **6 issues
   #350 a #355** foram criadas, bem guiadas, com a visão dela (autogestão, design parecido com o
   do Claude, contador, **tempo real** com webhook + Durable Object da Cloudflare, financeiro/DRE
   depois e fora do GitHub). O caminho da leva e "O que a Sofia faz" estão no `docs/painel.md`.
   A **mensagem do primeiro dia** (o texto que quem entra cola como primeira mensagem no Claude
   Code do PC, aprovado por ela) mora no `docs/painel.md`, seção "Primeiro dia". O Gustavo usa
   **Windows** (ela disse: não precisa perguntar), e ela **não precisa** de mensagem de WhatsApp
   pra mandar pra ele ("já tá tudo esclarecido"). O rascunho temporário foi apagado.
4. **Convidar o Gustavo**: pra organização `sakura-corp` (membro, que é o que deixa entrar no
   painel) e com escrita no `sakura-system-ace`. Falta o usuário dele no GitHub. Depois do
   convite, ele começa pela mensagem do "Primeiro dia" do `docs/painel.md`.

#### Deixar o `sakura-system-ace` privado: decidido que FICA PÚBLICO por enquanto (29/09)
Ela pediu isso no meio do passo 1. Apresentei três caminhos (A: privado com o plano Team, uns
US$ 4 por pessoa/mês; B: privado no gratuito, com o Gustavo trabalhando por fork; C: fechar mais
pra frente) e **ela escolheu C: "sem custo a mais no momento"**. O repositório continua público; a
hora de fechar é junto com o CNPJ ou antes do primeiro cliente, e a decisão volta pra ela. O que
fechar vai exigir, pra não refazer a conta:
- **Atualização**: o atualizador baixa o `latest.yml` sem login, então com o código privado as
  versões precisam morar num **repositório público só de versões** na organização (só o instalador
  e o `latest.yml`, sem código). O workflow Release passa a publicar lá com um token dela restrito
  a esse repositório. A versão de transição sai **nos dois lugares**; só depois de o PC da casa e
  o Balcão estarem nela o código vira privado (item 21 de `docs/licoes.md`: rever o mecanismo
  **antes** de fechar, não depois).
- **Minutos do Actions**: repositório público não paga. Privado no plano gratuito tem uma cota por
  mês (eram 2.000 minutos; conferir na tela de cobrança). Medido em 29/09: cada rodada do CI gasta
  **~12 minutos cobráveis** (5 tarefas), e foram **83 rodadas em 3 dias** (cada PR roda duas vezes,
  no `push` e no `pull_request`). Nesse ritmo passa da cota.
- **As travas do passo 2**: pelo que eu sei dos planos (não deu pra abrir a documentação do GitHub
  desta sessão, conferir), regra de branch/tag e cofre (environment) em repositório **privado**
  pedem o plano **Team**, e "aprovação obrigatória" num cofre privado pede o Enterprise. No
  gratuito, fechar o código tira as travas justamente quando o Gustavo entra.
- **O que fechar NÃO resolve**: o que já vazou no histórico (CSC, token do Giap, senha do portal)
  continua precisando ser trocado, e uma cópia (fork) feita enquanto era público continua pública.

#### Em aberto
- O usuário do Gustavo no GitHub.
- **As senhas (secrets) do GitHub e os cofres: FEITO (29-30/09)**. Ela não tinha guardado os
  valores e pegou todos de novo, **um por um, no Bitwarden** (pasta "Sakura System"): os 8
  secrets + a `chave-do-backup.txt` inteira (Anotação, com "resolicitar senha principal"). Tokens
  **novos**: R2 `backup-ssace-github` e GitHub fine-grained `backup-ssace-30-09-2026`; a senha do
  banco foi **resetada**. Criados os cofres **`backup`** (8 secrets, só `main`, sem aprovação) e
  **`lojas`** (só o `BACKUP_EMPRESAS`, só `main`, **aprovação dela obrigatória**); os workflows
  passaram a usá-los (PR #339). **Testado**: backup verde lendo do cofre, e "Atualizar bancos" em
  `ensaiar` parou em "Waiting", ela aprovou, e passou (Pneus Amigão na `0064`, em dia). Depois
  ela apagou os secrets soltos do repositório, o token R2 antigo (`backup-ssace`, 18/09) e o token
  antigo do GitHub, e o backup rodou verde de novo, **nos dois destinos**, sem eles (30/09 01:23
  UTC). No caminho: três erros de montagem do `BACKUP_EMPRESAS` e uma correção no job (PR #337,
  item 67 de `docs/licoes.md`). **A partir de agora**: todo "Liberar versão" e "Atualizar bancos"
  para em "Waiting" até ela clicar em "Review deployments" → `lojas` → "Approve and deploy",
  inclusive quando eu disparo por API. **Trocar o `BACKUP_EMPRESAS` é trocar nos dois cofres.**

#### Continua valendo do marco de 28/09 (em `docs/historico.md`)
Os testes que faltavam na loja, os três ajustes pendentes (modais com fundo vazando, status da nota
na lista, texto velho em Notas Fiscais) e as datas de outubro (CNPJ, Focus Solo → Start, fatura da
Focus em 10/10, alíquota de 10/2026 no portal em 1º/10).

### Onde parou em 29/09/2026: comparativo com o concorrente e o exemplo de DRE

Sessão de documentação, **sem código de app**. O marco anterior (28/09: testes na loja, os três
ajustes pendentes, a preparação do painel da equipe) está em `docs/historico.md`, e **tudo o que
ele deixou em aberto continua valendo**.

**Estado do código**: não mudou. `main` na **`v0.9.46`** (publicada e liberada), banco na **`0064`**.

- **Comparativo com o Anexar** (`docs/comparativo-anexar.md`): ela mandou 8 prints do site do
  concorrente. Dos 56 recursos que eles anunciam, temos 12, temos em parte 10 e faltam 34. Os que
  mais pesam: orçamento (`FN-01`), checklist com fotos e assinatura (`FN-02`), agenda (`FN-05`),
  devolução (`FN-08`), DRE, curva ABC, fluxo de caixa projetado e o app de celular. **É lista de
  consulta, não plano**: nada é pra construir antes de ela pedir.
- **Exemplo de DRE** (no privado, `sakura-corp`, pasta `dre/`): a explicação de DRE que o pai dela
  escreveu, os números dos prints transcritos e os 2 PDFs. **Os números são de uma das lojas do
  pai dela, tirados do sistema daquela loja: só exemplo de como um DRE funciona, sem relação com
  o SSACE nem com a Pneus Amigão.** Serve de modelo quando o SSACE ganhar o DRE (a seção 4 do
  `dre/README.md` lista o que faltaria: taxa da maquininha, grupos de despesa etc.).

#### Por onde a próxima sessão começa
Igual ao marco de 28/09 (em `docs/historico.md`): perguntar dos testes que faltavam na loja e
juntar com os três ajustes pendentes (modais com fundo vazando, status da nota na lista, texto
velho em Notas Fiscais); depois, o painel da equipe; e as datas de outubro (CNPJ, Focus
Solo → Start, fatura da Focus em 10/10, alíquota de 10/2026 no portal em 1º/10).

### Onde parou em 28/09/2026: testes na loja e preparação do painel da equipe

Sessão de conversa, **sem código de app**. O marco anterior (27/09, à noite: levas, horas, Team,
domínio, e-mail `contato@sakuracorp.com.br` pronto, CNPJ em outubro, custos) está em
`docs/historico.md`; o detalhe privado (equipe, custos, empresa) no `sakura-corp`, em `EQUIPE.md`,
`EMPRESA.md`, `PRECOS-E-CUSTOS.md` e `ACORDO-PROVISORIO.md` (adicionar à sessão quando o assunto for
equipe ou empresa).

**Estado do código**: não mudou. `main` na **`v0.9.46`** (publicada e liberada), banco na **`0064`**.

#### Testes na loja (28/09)
- **Feitos**: o computador da loja aparece como **"Balcão"**, na `0.9.46`, no **canal de teste**.
  O outro da lista (`DESKTOP-PKJ2A3B`, `0.9.44`, teste) deve ser o da casa dela: ela vai abrir o
  programa lá, confirmar e dar um apelido (se o dela tiver outro nome, esse pode ser esquecido).
  **NFS-e emitida e cancelada pelo porteiro** (número 22, aparece "cancelada") → **a parte 2 do
  `TR-04.2` está liberada** (a migration que apaga a cópia antiga do token; só quando ela pedir).
- **Faltavam**: venda de balcão com o leitor, ficha do veículo, Fechamento do Caixa, "Registrar
  pagamento" de comissão, trava do desconto, pagar/desfazer conta, faturar OS (recebido agora e a
  receber). Ela ia juntar o que achar estranho (fotos) pra resolver tudo de uma vez **quando o
  limite de uso dela resetar**.

#### Três ajustes que ela pediu e deixou PENDENTES (não fazer antes de ela pedir)
- **Modais com o fundo vazando**: o texto da tela de trás aparece através do pop-up (ela viu no
  "Nota fiscal" de Notas Fiscais; vale pros outros). Causa: o `Modal` (`src/components/Modal.tsx`)
  usa o `sakura-card`, vidro translúcido (`rgba(20,15,20,0.35)` + blur), sobre uma sobreposição de
  só `bg-black/40`. Caminho provável: painel opaco e sobreposição mais escura; os dois modais com
  sobreposição própria (`ImportarNotaFiscalXmlModal`, `ImportarNotasFiscaisModal`) também. Conferir
  contraste (`npm run contraste` + varredura nas telas) e olhar renderizado.
- **Status da nota na própria lista** de Notas Fiscais (`ArquivosSection.tsx`): "cancelada" só
  aparece dentro do modal. Mostrar o `status` numa coluna ou selo na linha.
- **Texto desatualizado no topo de Notas Fiscais** (`NotasFiscaisPage.tsx`): ainda diz que "a
  emissão automática ainda não existe".

#### O painel da equipe: preparação (nada criado ainda)
Um amigo que já tem o Claude Pro vai começar o painel antes do Team. Ordem combinada (detalhe no
`EQUIPE.md` do `sakura-corp`): **acordo provisório assinado** (rascunho pronto, faltam três
respostas dela) → **planejar a leva 0** com ela (proposta: 1ª versão = lista de tarefas da leva e
quem está com cada uma, lendo do GitHub) → ela cria a **organização `sakura-corp` no GitHub**
(recomendado em vez de conta nova) e, dentro dela, o repositório privado **`sakura-painel`** → eu
ligo o repositório à sessão e escrevo o manual (`CLAUDE.md`) e as tarefas → convite ao amigo
(falta o usuário do GitHub dele). **O `sakura-system-ace` NÃO muda de endereço por enquanto**: os
programas instalados buscam as atualizações em `caranovavidanova/sakura-system-ace`; mudar exige um
plano próprio (junto com a decisão de "fechar o código"). E-mails da equipe: um por pessoa no Zoho
grátis (faltam os nomes); no GitHub, quem já tem conta adiciona o e-mail da Sakura na conta que já
tem, sem criar outra.

#### Por onde a próxima sessão começa
1. **Perguntar como foram os testes que faltavam** e juntar o que ela trouxe com os três ajustes
   pendentes. Bug da loja é pra fazer na hora (quando ela pedir).
2. **O painel**: pegar as três respostas do acordo e gerar o PDF; fechar a leva 0; seguir a ordem
   acima conforme ela for criando a organização e o repositório.
3. **Continua valendo do marco anterior**: Claude Team antes do primeiro cliente (a data é dela);
   **abrir o CNPJ no começo de outubro** (confirmar com ela); trocar a **Focus do Solo pro Start**
   antes do CNPJ da primeira loja nova; primeira fatura da Focus em **10/10**; perguntar à
   contabilidade da Pneus Amigão sobre a migração do Simples pro Ambiente Nacional da NFS-e em
   **1º/11** (se valer, é fato novo pro item 3 do playbook em `docs/pendencias-e-futuro.md`).

Com data: **1º/10/2026**, a alíquota de 10/2026 no portal da prefeitura.

### Onde parou em 27/09/2026, à noite: como a equipe vai trabalhar, domínio, e-mail e custos

Conversa de alinhamento, **sem código de app**. O plano de equipe inteiro, os custos e as
pendências da empresa estão no repositório **privado** `caranovavidanova/sakura-corp`, em
`EQUIPE.md` (adicionar à sessão quando o assunto for equipe). Aqui fica só o que uma sessão do
SSACE precisa saber.

**Decidido por ela:**
- **Linha de produção por levas**: ela planeja comigo → as tarefas saem juntas numa leva → cada
  um faz a sua e solta no canal de teste → a leva **congela**, todos testam → **eu escrevo o
  relatório** → **ela aprova** → banco e Liberar. Bug de loja não espera a leva.
- **As tarefas nascem nas conversas dela comigo** e moram no GitHub (onde os Claudes trabalham).
  Pegar só tarefa sem dono, pôr o nome antes de começar, um PR por tarefa.
- **Trabalho medido em horas por semana** (estimativa por tarefa), não em dinheiro.
- **Primeiro projeto da equipe**: uma interface própria de organização (lê o GitHub, não o
  substitui), planejada por ela comigo e programada pelos amigos em tarefas. Vem antes de vender.
- **"Estruturar a base"** = ter lucro estável no SSACE antes de investir tempo e dinheiro em
  outro projeto. Não abrir produto novo antes disso.
- **Quando os amigos entrarem, muda a regra de mesclar da seção 3** pra eles: PR entra com CI
  verde + revisão de um colega; a aprovação dela fica no relatório da leva. Pra ela, continua
  igual.
- **Amigos sem acesso** ao banco de verdade da Pneus Amigão e ao `sakura-corp`, por enquanto.
- **Claude Team** (4 lugares comuns, por mês), **antes do primeiro cliente** (a data é dela),
  assinado com **`contato@sakuracorp.com.br`**. O domínio `sakuracorp.com.br` foi registrado
  hoje no registro.br, e o **e-mail ficou pronto e testado** no Zoho Mail (plano grátis).
- **Abrir o CNPJ no começo de outubro** (recomendado; ela pareceu de acordo, confirmar): a
  Pneus Amigão passa a ser cliente pagante em outubro e precisa de nota de serviço. Detalhe da
  contabilidade, custos e prazos no `sakura-corp` (`EMPRESA.md` e `PRECOS-E-CUSTOS.md`).
- **O leitor de nota por IA fica fora das primeiras versões** pras lojas novas (tabela de
  decisões em `docs/decisoes.md`).
- Apresentação **"Como a Sakura vai trabalhar"** (12 slides) feita e enviada ao grupo:
  `https://claude.ai/artifact/4UL1gjKV6r1S1JrjrxY5SQ`.

**Estado do código**: não mudou. `main` na **`v0.9.46`** (publicada e liberada), banco na **`0064`**.

#### Por onde a próxima sessão começa

1. **Testes de segunda (28/09) na loja** (a lista está no marco "27/09/2026, de manhã", em
   `docs/historico.md`). **Já feitos**: o computador da loja aparece como **"Balcão"**, na
   `0.9.46`, no **canal de teste**; o outro da lista (`DESKTOP-PKJ2A3B`, `0.9.44`, teste) deve ser
   o computador da casa dela (ela vai confirmar abrindo o programa lá, e dar um apelido); **NFS-e
   emitida e cancelada pelo porteiro** (número 22, aparece "cancelada") → **a parte 2 do
   `TR-04.2` está liberada** (a migration que apaga a cópia antiga do token; só fazer quando ela
   pedir). **Faltavam**: venda de balcão com o leitor, ficha do veículo, Fechamento do Caixa e o
   resto da `v0.9.42`/`0.9.43`. Perguntar como foram. Bug da loja é pra fazer na hora.
   **Três ajustes que ela pediu e deixou pendentes** (28/09):
   - **Modais com o fundo vazando**: o texto da tela de trás aparece através do pop-up e atrapalha
     a leitura (ela viu no "Nota fiscal" de Notas Fiscais, e disse que vale pros outros). Causa:
     o `Modal` (`src/components/Modal.tsx`) usa o `sakura-card`, que é vidro translúcido
     (`rgba(20,15,20,0.35)` + blur), sobre uma sobreposição de só `bg-black/40`. Caminho
     provável: painel do modal opaco e sobreposição mais escura; os dois modais que têm
     sobreposição própria (`ImportarNotaFiscalXmlModal`, `ImportarNotasFiscaisModal`) também.
     Conferir contraste (`npm run contraste` e a varredura nas telas) e olhar renderizado.
   - **Status da nota na própria lista** de Notas Fiscais (`ArquivosSection.tsx`): hoje
     "cancelada" só aparece dentro do modal da nota. Mostrar o `status` (autorizada, cancelada,
     etc.) numa coluna ou selo na linha.
   - **Texto desatualizado no topo de Notas Fiscais** (`NotasFiscaisPage.tsx`): ainda diz que "a
     emissão automática ainda não existe". Ela existe desde a Focus NFe.
2. **Se o e-mail do Zoho não ficou pronto**, ajudar com prints: verificar o TXT, criar o e-mail,
   e as linhas MX, SPF e DKIM no registro.br ("Configurar endereçamento" → zona DNS → "Nova
   entrada"; o campo Nome em branco é o próprio domínio, e não aceita `@`).
3. **Quando o Team estiver perto**: primeiro as pendências da empresa que ela deixou pra essa
   hora (no `sakura-corp`, começando pelo acordo de que o código é da empresa). Depois, planejar a
   interface com ela (a leva 0) e escrever o `docs/equipe.md` com as regras pros Claudes da
   equipe. **Onde a interface mora já está decidido** (repositório privado novo, mesma base do
   SSACE, Supabase numa conta nova com o e-mail da Sakura; detalhe no `EQUIPE.md`). Não começar
   antes de ela pedir.

4. **Focus NFe: trocar do plano Solo pro Start antes de cadastrar o CNPJ da primeira loja
   nova** (o Solo aceita 1 CNPJ só). A primeira fatura da Focus deve vencer em 10/10.
5. **Perguntar à contabilidade da Pneus Amigão** se a migração das empresas do Simples pro
   Ambiente Nacional da NFS-e, adiada pra **1º/11/2026** (citada pelo suporte da Focus em
   26/08), vale pra loja. Se valer, é um fato novo pro item 3 do playbook fiscal em
   `docs/pendencias-e-futuro.md`, que tinha descartado essa hipótese.

Com data: **1º/10/2026**, a alíquota de 10/2026 no portal da prefeitura.

### Onde parou em 27/09/2026, à tarde: organização pra venda e pro trabalho em equipe

Conversa de alinhamento, sem código de app. Ela vai abrir a empresa e chamar 3 amigos pra
vibecodar junto. O que ficou:
- **Assuntos da empresa** (sócios, porcentagens, abertura do CNPJ, contador, contrato com as lojas,
  preço) passaram a morar no repositório **privado** `caranovavidanova/sakura-corp`, criado por ela
  e preenchido em 27/09/2026: `EMPRESA.md` (tudo que foi decidido) e `PRECOS-E-CUSTOS.md` (os
  trechos de preço tirados daqui). Tem `CLAUDE.md` próprio: adicionado à sessão, carrega o
  `EMPRESA.md` sozinho.
- **Contrato com as lojas: de adesão** (termos aceitos pela loja, só o nome da empresa aparece).
  Ideia anotada, não pedida: o SSACE mostrar os termos no primeiro login do admin e gravar o aceite.
- **Este arquivo foi dividido** no índice + `docs/` (ver a tabela acima).
- **Fechar o código do SSACE** (repositório privado + um público só com instaladores): **pendente,
  decisão dela pra depois** — custo de minutos de CI e uma sessão de trabalho.
- **Próximos temas combinados** (ela quer ir aos poucos): 2) como codar em grupo; 3) a "linha de
  produção" de atualizações e projetos novos.

### Onde parou em 27/09/2026, de manhã: ficha do veículo

**Saiu a ficha do veículo** (item `FN-04` do guia, P1), num domingo. Ela disse "vamos continuar"
e avisou: **"os testes faço todos no PC da loja na segunda-feira"** (28/09/2026). Entre as
opções (ficha do veículo, sugestão de compra, clientes que sumiram, permissão nas OS), escolheu a
recomendada.

**Estado: publicada e LIBERADA na `v0.9.46`, SEM migration.** O banco continua na `0064`.
Perguntada "publique e libere a 0.9.46 pra ficha entrar no teste de segunda?", ela respondeu
"pode publicar" — e foi feito os dois, porque o computador da loja está no canal normal e só
publicar não chegaria lá. Conferido de fora: o endereço "mais recente" responde `0.9.46` e o
instalador bate com o `latest.yml`. **A loja recebe a ficha na próxima vez que o programa for
fechado e aberto.** Se precisar voltar atrás: rodar o Liberar com `v0.9.45` (seção 9).

#### O que saiu, em uma linha cada

- **A tela** `/veiculos/:id`: dono, KM mais recente e rodagem estimada, total faturado, visitas,
  peças na garantia e o histórico de OS. Detalhe em "Ficha do veículo", seção 7.
- **Onde abre**: a placa virou botão em Clientes, na lista de OS e em Garantias
  (`components/LinkPlaca.tsx`).
- **As contas** em `schemas/fichaVeiculo.ts` e `schemas/garantia.ts`, testadas; `diasEntre` em
  `lib/datas.ts`.
- **Garantias** passou a usar a mesma conta de vencimento — e a garantia vale o último dia
  inteiro (antes vencia no mesmo horário da venda).

#### Como foi conferido

- **801 testes** nos dois fusos (eram 769), `tsc`, lint, `npm run contraste`, e a varredura de
  contraste nas **60 telas** (uma cena nova, `06b-ficha-veiculo`) sem reprovação nova.
- **Nove mutações** no código novo (ordem da linha do tempo, "Abrir OS" sem conferir loja ou
  permissão, placa sem `stopPropagation`, total com OS não faturada, KM "maior" em vez de "mais
  recente", garantia vencendo no último dia, rodagem com KM que desceu, visita duplicada) —
  todas vermelhas.
- A tela olhada no app de verdade, com os dados de exemplo (o Gol `RTA-4B71` ganhou duas
  passagens antigas em `dados-demo.mjs`, pra ficha ter linha do tempo).

**O que não dá pra conferir daqui**: o Supabase de verdade (a consulta das OS do carro com os
itens e o prazo de garantia da peça).

#### Segunda-feira, 28/09/2026, no PC da loja — a lista dela

Ela vai testar tudo de uma vez. O que está esperando teste de verdade:
1. **Venda de balcão** (`v0.9.45`): uma venda com o leitor de código de barras, a NFC-e dela e o
   caixa do dia batendo.
2. **Computadores desta empresa**: conferir que o computador da loja apareceu (com `0.9.45`) e
   dar o apelido "Balcão".
3. **Marcar o computador da loja como Teste** (Configurações → "Atualizações deste computador").
4. **O que a `v0.9.42`/`v0.9.43` trouxeram**: aba Fechamento do Caixa, "Registrar pagamento" de
   comissão, a trava do desconto maior que o item, pagar e desfazer o pagamento de uma conta,
   faturar uma OS (recebido agora e a receber depois).
5. **Emitir e cancelar uma nota pelo porteiro** — libera a parte 2 do `TR-04.2`.
6. **A ficha do veículo** (`v0.9.46`, já liberada): abrir pela placa em Clientes, na lista de
   OS e em Garantias; conferir que o histórico e as peças na garantia batem com o que ela sabe do
   carro. É a única parte que fala com o Supabase de verdade e não deu pra testar daqui.

**E na conferência do item 2, o computador da loja deve aparecer com `0.9.46`** (não mais
`0.9.45`), se o programa foi fechado e aberto depois da liberação.

E, com data: **1º/10/2026**, a alíquota de 10/2026 no portal da prefeitura.

#### Estado do código

`main` em dia com a **`v0.9.46`** (publicada e liberada); banco na **`0064`**. Nada pendente de
SQL nem de publicação. `tsc`, lint e contraste limpos; **801 testes** nos dois fusos; matriz de
RLS em 760 células (não mudou).

#### Por onde a próxima sessão começa

Ela fechou esta sessão com *"te chamo numa próxima sessão, para alinharmos algumas coisas"* —
ou seja, **a próxima sessão começa por uma conversa de alinhamento, puxada por ela**. Não chegar
propondo trabalho novo: ouvir o que ela quer alinhar primeiro.

1. Perguntar como foram os testes de segunda na loja (a lista acima) e resolver o que aparecer —
   bug relatado da loja é pra fazer na hora.
2. Se ela quiser seguir o guia: o **lembrete de revisão** (`FN-06`) é o passo natural depois da
   ficha — a rodagem média já existe (`rodagemEstimada`). Pede migration e uma decisão dela
   (o "não avisar este cliente" e o tom das mensagens). Os outros sem migration: **sugestão de
   compra** (`FN-07`) e **clientes que sumiram** (`FN-11`).

### Onde parou em 26-27/09/2026

**Saiu a venda de balcão** (item `FN-09` do guia, P0), no sábado à noite. Ela disse "vamos
continuar, como é sábado ainda, nada do PC da loja por enquanto" e escolheu, entre as opções, a
venda de balcão — e, na decisão que o guia manda levar, o **cliente "Consumidor" fixo** em vez de
tornar o cliente opcional.

**Estado: migration `0064` APLICADA (banco na `0064`) e `v0.9.45` PUBLICADA E LIBERADA pra
todas as lojas.** Ela disse "pode rodar no banco e publicar": o botão ensaiou ("✅ passaria") e
aplicou (Pneus Amigão `0063` → `0064`); depois a `v0.9.45` saiu no canal de teste, com os três
arquivos na release e o `latest.yml` por último. Em 27/09/2026 ela disse **"libera"**: o Liberar
rodou verde, e conferido de fora o endereço "mais recente" que as lojas usam responde `0.9.45`,
com o instalador baixado de lá batendo na impressão digital com o `latest.yml`. **A loja recebe
a venda de balcão na próxima vez que o programa for fechado e aberto.**

#### O que saiu, em uma linha cada

- **Migration `0064`**: `ordens_servico.tipo` (`os`/`venda_balcao`) e o cliente fixo
  "Consumidor". O número é o mesmo contador das OS. Entrada completa na seção 5.
- **A tela**: "+ Venda de balcão" em Ordens de Serviço — leitor de código de barras, peças,
  pagamento (o mesmo da OS) e a NFC-e abrindo sozinha no fim. Detalhe em "Venda de balcão", seção 7.
- **A lista**: abas "Ordens de serviço" / "Vendas de balcão".
- **Os números**: a venda entra em vendas, custo, lucro e comissão, e **sai do ticket médio**.
- **A NFC-e do Consumidor nunca leva documento**, mesmo com CPF gravado nele.
- **Falha pela metade**: antes do pagamento, a venda é desfeita; no pagamento, a venda fica e a
  tela manda faturar a que existe (nunca registrar de novo).

#### Como foi conferido

- A `0064` num Postgres local: instalação inteira três vezes do zero, e ela sozinha duas vezes
  num banco no estado `0063` com dado. `testar-venda-balcao.sql` (as duas metades) com três
  mutações, todas vermelhas. Os 11 testes de migration, a matriz de RLS (760 células, sem
  mudança) e o teste do botão de atualizar bancos, todos num Postgres de verdade.
- **769 testes** nos dois fusos (eram 727), `tsc`, lint e contraste. Os novos: as contas da venda
  (`schemas/vendaBalcao.test.ts`), a gravação com as falhas pela metade
  (`lib/vendaBalcao.test.ts`), a tela (`VendaBalcaoForm.test.tsx`, 9 casos — inclusive o Enter do
  leitor com o atalho global ligado), o Consumidor na NFC-e e o ticket médio. **Sete mutações**
  no código novo, todas vermelhas — uma delas só depois de consertar o teste (item 77 da seção 6).
- A varredura de contraste nas telas (agora **59**, com quatro cenas novas da venda) sem nenhuma
  reprovação nova, as telas olhadas uma a uma, e o teste do Electron de verdade (31 checagens).

**O que não dá pra conferir daqui**: o Supabase de verdade, a NFC-e de verdade (a Focus NFe) e o
leitor de código de barras de verdade.

#### O que falta, e é dela (na ordem)

1. ~~Aplicar a `0064`~~ e ~~publicar a `0.9.45`~~ — feitos em 26/09/2026, fim da noite.
2. ~~Liberar a `v0.9.45` pras lojas~~ — feito em 27/09/2026.
3. **Na loja**: fazer uma venda de balcão de verdade com o leitor, emitir a
   NFC-e dela e conferir o caixa do dia. **É o único teste que falta**, e é também o primeiro
   teste real do leitor de código de barras neste sistema.

#### Pontos que valem ela saber (não são decisão pendente, são consequência)

- **Comissão**: o vendedor de uma venda de balcão leva comissão sobre ela, como numa OS (é o
  mesmo campo "vendedor"). Se a loja não paga comissão de balcão, é só deixar a venda "Sem
  vendedor" — ou pedir pra mudar a regra.
- **O número pula nas OS**: com uma venda no meio, a lista de OS vai de "OS 16" pra "OS 18". É o
  preço do número nunca repetir na loja.
- **O "Consumidor" não aparece em Clientes**, de propósito — ninguém consegue editá-lo por engano.

#### Tudo que está pendente, numa lista só (atualizada em 26/09/2026, fim da noite)

**Da venda de balcão**: testar na loja (o passo 3 acima) — já liberada.

**Com data**: **1º/10/2026** — cadastrar a alíquota de 10/2026 no portal da prefeitura, antes da
primeira NFS-e do mês (o Início lembra).

**Na loja do pai dela, quando ela tiver acesso ao computador de lá** (nada mudou desde o marco
logo abaixo): conferir que o computador da loja apareceu em "Computadores desta empresa" e dar o
apelido; marcar o computador da loja como Teste; conferir o que a `v0.9.42`/`v0.9.43` trouxeram;
e emitir e cancelar uma nota pelo porteiro (libera a parte 2 do `TR-04.2`).

**Sem prazo, fora do código**: o valor da fase 2; o `ANTES-DA-PRIMEIRA-VENDA.md` com advogado ou
contabilidade; trocar as três credenciais expostas; a pergunta do CSOSN 500/ICMS-ST; o formato do
CNPJ com letras na Focus NFe; atualizar o Electron; marcar o CI como obrigatório.

#### Estado do código

`main` em dia com a **`v0.9.45`** (publicada e liberada); banco dela na
**`0064`**. `tsc`, lint e
contraste limpos; **769 testes** nos dois fusos; matriz de RLS em 760 células; 11 testes de
migration passando.

#### Por onde a próxima sessão começa

Perguntar se a venda de balcão já foi usada na loja — com o leitor de código de barras e a
NFC-e dela — e se o caixa do dia bateu. Se ela quiser seguir o guia, o que sobra de P0/P1 com mais valor no
balcão: **ficha do veículo** (`FN-04`, sem migration — base do lembrete de revisão `FN-06`),
**sugestão de compra** (`FN-07`, sem migration) e o **lote 4 do `TR-04.1`** (Ordens de Serviço).

### Onde parou em 26/09/2026, à noite

**Saiu a "versão de cada computador"** — a proposta do marco logo abaixo ("o que falta pra
conferir é saber em que versão cada computador está"), escolhida por ela entre as opções quando
disse "vamos continuar com codagem". Junto, a pendência do Ubuntu (19/10) resolvida.

**Estado: TUDO FEITO no mesmo dia.** Ela disse "pode fazer" e, perguntada, escolheu "liberar
já": a `0063` entrou pelo botão (ensaio → aplicação, banco na **`0063`**) e a **`v0.9.44`** saiu
publicada e liberada pra todas as lojas. Nada pendente de SQL nem de publicação.

#### O que saiu, em uma linha cada

- **Migration `0063`**: a tabela `computadores` e as funções `registrar_computador()` (qualquer
  operador ativo grava a linha do computador em que está, sem poder ler a lista) e
  `definir_apelido_computador()` (só admin). Ver a entrada na seção 5.
- **O programa**: cada computador cria um número próprio na primeira abertura
  (`computador.json`) e, a cada login, conta ao banco versão, canal, sistema, loja e quem entrou.
  Nunca trava o login; em `npm run dev` não registra.
- **Configurações → "Computadores desta empresa"** (só admin): versão, canal, loja, última vez e
  por quem; apelido e "esquecer". Detalhe em "Estado atual por módulo" (seção 7).
- **O botão de atualizar os bancos espera os atrasados**: migration com
  `-- versao-minima-do-programa: X` no cabeçalho só entra quando nenhum computador em uso está
  abaixo de X — com a caixinha "aplicar mesmo com computadores atrasados" pra quando ela souber
  que não há risco. A `0062` ganhou essa linha (0.9.43) como exemplo. Passo a passo na seção 9.
- **Backup e botão presos em `ubuntu-24.04`** (em vez de `ubuntu-latest`), antes de o GitHub
  trocar pro 26 em 19/10/2026.

#### Como foi conferido

- A `0063` num Postgres local: instalação inteira três vezes do zero, ela sozinha duas vezes num
  banco no estado `0062` com dado. `testar-computadores.sql` (as duas metades) com **doze
  mutações**, todas vermelhas — uma só depois de consertar o teste (item 76 da seção 6).
- Matriz de RLS: **760 células** (a tabela nova entrou, com as duas lacunas declaradas), e uma
  mutação (leitura aberta) acusada nas células certas.
- O Electron de verdade (`npm run test:electron`, agora **31 checagens**): a identidade é a mesma
  a cada pedido, fica no disco, e com o arquivo estragado nasce outra válida — e a mutação "não
  gravar o arquivo" ficou vermelha em três checagens.
- O botão: 13 testes novos com `psql` de mentira (seis mutações) e o passo 8 do teste de
  integração, com Postgres de verdade.
- `tsc`, lint, contraste; **727 testes** nos dois fusos; os 10 testes de migration; a seção nova
  vista renderizada no app de verdade (com os dados de exemplo) e na varredura de contraste.

**O que não dá pra conferir daqui**: o Supabase de verdade e um Windows de verdade (o nome da
máquina que aparece é o que o Windows dá).

#### O que falta, e é dela

1. ~~Aplicar a `0063`~~ e ~~publicar e liberar a `0.9.44`~~ — feitos em 26/09/2026, à noite.
2. **Depois de a loja abrir a versão nova** (o programa atualiza quando é fechado e aberto de
   novo): conferir em Configurações → "Computadores desta empresa" que o computador da loja
   apareceu, com `0.9.44` — e dar um apelido pra ele ("Balcão"). **É o único teste de verdade
   desta leva**: o registro fala com o Supabase e com o Windows, e nenhum dos dois dá pra
   conferir daqui. **Se o computador NÃO aparecer depois de alguém entrar nele**, conferir nele:
   (a) o canto inferior direito diz `0.9.44`? (b) alguém fez login DEPOIS de o programa
   atualizar? (c) aparece a faixa de banco desatualizado? **Não adianta pedir o `erros.log`**:
   a falha do registro vai só pro console (`console.warn` em `lib/computadores.ts`), que no app
   instalado ninguém vê — é o preço de ele nunca atrapalhar o login. Só a falha de criar o
   `computador.json` (no processo principal) vai pro `erros.log`. Se isso virar problema de
   verdade, o conserto pequeno é mandar essa falha também pro `erros.log`.
   **Metade já confirmada (26/09/2026, à noite)**: o computador DELA apareceu sozinho, logo
   depois de atualizar — `0.9.44`, canal de teste, marcado "este computador", loja e operador
   certos (print dela). Ou seja, o caminho inteiro funciona no Supabase e no Windows de verdade;
   o que falta é só o da loja, que depende de a loja abrir a versão nova.
3. **Opcional**: dar um apelido pro computador dela na mesma tela (hoje aparece como
   "DESKTOP-PKJ2A3B"), pra lista continuar legível quando tiver mais computadores.

#### Tudo que está pendente, numa lista só (conferida em 26/09/2026, à noite)

Os marcos mais antigos repetem partes disto; **esta é a lista que vale**. Nenhum item bloqueia o
uso do sistema, e nada está pendente de código, SQL ou publicação.

**Com data:**
- **1º/10/2026**: cadastrar a alíquota de 10/2026 no portal da prefeitura, antes da primeira
  NFS-e do mês (o Início lembra).

**Na loja do pai dela, quando ela tiver acesso ao computador de lá:**
- Conferir que o computador da loja apareceu na lista (item 2 acima) e dar o apelido "Balcão".
- **Marcar o computador da loja como Teste** (Configurações → "Atualizações deste computador").
  Até isso, versão publicada e não liberada não chega na loja.
- Conferir o que a `v0.9.42` e a `v0.9.43` trouxeram: aba Fechamento do Caixa, "Registrar
  pagamento" de comissão, a trava do desconto maior que o item, pagar e desfazer o pagamento de
  uma conta, e faturar uma OS (recebido agora e a receber depois).
- **Emitir e cancelar uma nota pelo porteiro** — é o que libera a parte 2 do `TR-04.2` (apagar a
  cópia antiga do token da Focus NFe).

**Decisões e tarefas fora do código, sem prazo:**
- O **valor da fase 2** (ver o repositório privado `sakura-corp`).
- Levar o `ANTES-DA-PRIMEIRA-VENDA.md` a advogado ou contabilidade (contrato com cláusula de
  dados) — antes da primeira loja de terceiro.
- Trocar as três credenciais expostas no histórico público (CSC da SEFAZ, token do portal Giap,
  senha do portal da prefeitura).
- Perguntar à contabilidade sobre o CSOSN 500 e o ICMS-ST; e à Focus NFe, o formato do CNPJ
  com letras.
- Decidir sobre atualizar o Electron (a linha 33 não recebe mais correção de segurança).
- Marcar o CI como obrigatório pra mesclar (Settings → Branches).

**Saíram da lista** (aparecem como pendentes em marcos antigos, mas estão resolvidos): publicar o
"Importar por foto" desligado (foi na `v0.9.42`), a verificação em duas etapas do GitHub (feita
em 26/09) e fixar o Ubuntu do backup (feito em 26/09, à noite).

#### Estado do código

`main` em dia com a **`v0.9.44`** (publicada e liberada), banco dela na **`0063`**. `tsc`, lint e
contraste limpos; **727 testes** nos dois fusos; matriz de RLS em **760 células**; os 10 testes de
migration passando no CI.

#### Por onde a próxima sessão começa

Ela fechou esta sessão com *"atualiza o projeto status, volto em outra sessão"*. Nada ficou
pela metade. Então: perguntar se o computador da loja já apareceu em Configurações →
"Computadores desta empresa" (o dela já apareceu em 26/09/2026) e, se a sessão cair depois de
1º/10, se a alíquota do mês foi cadastrada. Se ela quiser seguir o guia depois disso, as
opções de 26/09 continuam de pé:
**venda de balcão sem OS** (`FN-09`, P0 — com a decisão "cliente opcional na OS ou cliente fixo
'Consumidor'"), **ficha do veículo** (`FN-04`, sem migration) e **permissão nas Ordens de
Serviço** (`TR-04.1`, lote 4 — ganho menor que os anteriores, porque quase todo módulo lê as OS).

### Onde parou em 26/09/2026, à tarde

**Saíram os lotes 2 e 3 da permissão por módulo (`TR-04.1`, etapa 2): Contas a Pagar, Contas
a Receber e o Caixa passam a ser protegidos pelo BANCO** (migrations `0061` e `0062`). Ela
decidiu, entre as opções (26/09/2026): proteger as três; no Início, mostrar "—" no cartão de
quem não tem o módulo; e Relações continua lendo o Caixa inteiro. Ela também disse "resolvemos
essas outras coisas depois" sobre as pendências do marco anterior — ver "O que ficou pra
depois", logo abaixo.

**Estado: TUDO FEITO em 26/09/2026.** A `v0.9.43` foi publicada e liberada, e a `0061`+`0062`
foram aplicadas pelo botão (Pneus Amigão `0060` → `0062`, sem erro). **Nada pendente de SQL nem
de publicação.**

#### ⚠️ A ordem — desta vez é AO CONTRÁRIO do de sempre

1. ✅ **Primeiro a versão** (`0.9.43`): publicada **e liberada** em 26/09/2026.
2. ⏭️ **Esperar os computadores da loja abrirem a versão nova** — **pulado de propósito**: era
   fim de semana, ela não tinha acesso ao PC da loja, e conferiu em Configurações → Operadores
   que não existe na loja ninguém do único perfil afetado (não admin, com Contas a Pagar/Receber
   e sem Caixa). Sem esse perfil, a `v0.9.42` funciona igual com o banco novo.
3. ✅ **Depois o banco**: botão "Atualizar o banco de todas as empresas" → `ensaiar` ("✅
   passaria") → `aplicar` ("✅ atualizado", ficou em `0062`), em 26/09/2026.

**Por quê** (medido num Postgres local, não suposto): a `v0.9.42` grava no Caixa pedindo a linha
de volta. Com a `0062` rodada e a `v0.9.42` ainda instalada, **quem não tem o Caixa e paga ou
recebe uma conta leva erro de permissão**, e "desfazer pagamento" deixaria a saída órfã no Caixa.
A `0.9.43` funciona com o banco antigo. **Admin não é afetado nos dois casos**, e faturar OS
funciona nas duas versões. Entre o passo 1 e o 3, a faixa "banco desatualizado" aparece — é
aviso, nada quebra.

#### O que foi feito, em uma linha cada

- **Contas a Pagar** (`0061`): os quatro comandos exigem o módulo.
- **Contas a Receber** (`0061`): os quatro exigem o módulo, com duas portas estreitas — quem tem
  **Ordens de Serviço** cria a conta **de uma OS da mesma loja** (o faturamento "a receber
  depois"), e quem tem **Funcionários** lê (a aba Comissões).
- **Caixa** (`0062`): os quatro exigem o módulo, com quatro portas estreitas — **Relações** lê
  tudo; **OS** lê só os lançamentos de OS e lança a entrada da OS; **Contas a Pagar** lança a
  saída e apaga só a da própria conta; **Contas a Receber** lança a entrada. Detalhe na seção 5.
- **No app, pro Caixa**: lançar não pede mais a linha de volta (id gerado antes), e "desfazer
  pagamento" apaga a saída **antes** de voltar a conta pra pendente.
- **Início**: quem não tem Contas a Pagar vê "—" no cartão de contas; quem não tem **nem Caixa nem
  Relações** vê "—" nos quatro de dinheiro (Vendas, Custos, Lucro, Ticket médio). Nos dois casos
  o programa nem pede o dado ao banco. O botão "Ver relações completas" só aparece pra quem tem
  Relações. Conferido com a tela de verdade.
- **Mensagem em português** quando o banco recusa uma gravação por permissão.

#### Como foi conferido

- Instalação inteira três vezes do zero; cada migration sozinha duas vezes; a `0062` também num
  banco no estado `0061` com dado plantado.
- `testar-contas-permissao.sql` (28 checagens) e `testar-caixa-permissao.sql` (35 checagens,
  sete perfis) — as duas metades. **20 mutações** no total, todas vermelhas; duas só depois de
  corrigir o próprio teste (itens 73 e 74 da seção 6).
- Matriz de RLS (740 células), os 9 testes de migration e o do botão de atualizar os bancos, num
  Postgres de verdade.
- `tsc`, lint, contraste; **688 testes** nos dois fusos — inclusive `src/lib/caixa.test.ts`, que
  trava as duas mudanças do app (conferido quebrando cada uma).
- Desempenho com 20 mil linhas por loja: contas 77–78 → 80–81 ms; Caixa 76 → 76–77 ms — este
  **depois** de trocar um `exists` por função, porque a primeira versão ligava o JIT e ia a
  110 ms (item 75 da seção 6).

**O que não dá pra conferir daqui**: o Supabase de verdade. Depois de rodar e publicar, vale
conferir na loja: (a) um operador **sem** Contas a Pagar vê "—" no cartão; (b) um operador **não
admin** com Ordens de Serviço fatura uma OS (recebido agora e a receber depois) normalmente;
(c) a aba Comissões continua avisando de OS não paga; (d) pagar e desfazer o pagamento de uma
conta; (e) emitir uma NFC-e (o rateio do pagamento lê o Caixa). Pra todo admin, nada muda.

#### O que falta do `TR-04.1`, e o que precisa dela

As três tabelas que sobram — **Ordens de Serviço, Peças/Estoque e Clientes** — são lidas por
muitas telas; o mapa está no item 1 da seção 6. Cada uma pede duas decisões dela antes de
começar: **o que o Início mostra pra quem não tem o módulo** e **qual janela estreita cada
tabela precisa**. Um cuidado novo: a lista do Caixa (e o lucro dela, e Relações) lê a OS e o
cliente por `join` — fechar `ordens_servico` ou `clientes` sem janela zera o lucro do Caixa pra
quem tem só Caixa. Sugestão de ordem: Ordens de Serviço, depois Peças/Estoque e, por último,
Clientes (é o que mais tela lê, e é o dado pessoal que mais importa proteger).

#### O que ficou pra depois (ela disse "resolvemos essas outras coisas depois")

- ✅ **Verificação em duas etapas do GitHub — FEITA por ela em 26/09/2026**, antes do prazo de
  03/10. Não lembrar mais.
- Conferir na loja o que a `v0.9.42` trouxe (Fechamento de caixa, Registrar pagamento de
  comissão, a trava do desconto).
- Emitir e cancelar uma nota pelo porteiro (libera a parte 2 do `TR-04.2`).
- **1º/10/2026**: a alíquota de 10/2026 no portal da prefeitura, antes da primeira NFS-e do mês.
- ~~Fixar `runs-on: ubuntu-24.04` no backup antes de 19/10~~ — feito em 26/09/2026, à noite
  (no backup e no botão de atualizar os bancos).
- E o resto da lista do marco anterior (valor da fase 2, marcar a loja como Teste, credenciais,
  contrato, CSOSN 500, Electron, CI obrigatório).

#### A dúvida dela: com muitas lojas, vamos ter que esperar todos atualizarem?

Resposta dada (26/09/2026): **não como regra.** A imensa maioria das migrations só acrescenta e
roda antes da versão, sem esperar ninguém. Só migration que **aperta** algo que a versão velha
usava (como a `0062`) pede espera — e aí o certo é esperar um prazo (a versão nova entra quando o
programa é fechado, então ~1 a 2 dias úteis depois de liberada) e **conferir**. O que falta pra
conferir é saber em que versão cada computador está, e isso hoje **não existe**. Proposta feita,
**não pedida ainda**: o programa registra no banco, a cada login, "computador, versão, visto por
último", e o botão de atualizar os bancos recusa uma migration que exige versão mínima enquanto
houver computador ativo abaixo dela. Vale construir **antes** da primeira loja de outra empresa.

#### A alíquota mensal da NFS-e: responsabilidade da contabilidade de cada empresa

Decisão dela (26/09/2026), depois de perguntar se ia ter que cadastrar "de todas as lojas
manualmente": é cadastro no **portal da prefeitura**, por CNPJ, sem API — então fica com **a
contabilidade de cada empresa**. O sistema continua só **lembrando**. Como o lembrete funciona de
verdade (conferido no código, `schemas/aliquotaCompetencia.ts`), pra ninguém descrever errado:
- **não é uma notificação no dia 1º** — é a faixa no topo do Início, que aparece **a partir do
  dia 1º e fica o mês inteiro** até alguém clicar "Já cadastrei" ou sair uma NFS-e autorizada
  naquele mês;
- **só aparece em loja que emite NFS-e** (token da Focus NFe + inscrição municipal preenchidos);
- **quem vê é quem abre o Início na loja, não a contabilidade.** Por isso, em loja de terceiro,
  o texto da faixa pode ser trocado em Configurações → Dados fiscais → "Como cadastrar a alíquota
  no portal da prefeitura", pra algo como "avise a contabilidade (nome/telefone) pra cadastrar a
  alíquota do mês". Sem código novo.
Ainda vale ela testar em **1º/10** se o "Replicar Alíquota" do portal cadastra vários meses de
uma vez.

#### Por onde a próxima sessão começa

1. Nada pendente de SQL nem de publicação (banco na `0062`, `v0.9.43` liberada).
2. Na segunda (28/09), quando a loja abrir: conferir na loja o que a `0.9.43` e a `0.9.42`
   trouxeram (lista em "Como foi conferido" e no marco anterior).
3. Se ela quiser seguir o guia: o próximo lote do `TR-04.1` (Ordens de Serviço), apresentando
   antes as duas decisões acima — e, antes da primeira loja de outra empresa, o registro de
   versão por computador.

### Onde parou em 25/09/2026, última leva

**Ela disse "pode fazer com força, sem pedir permissão" e depois "continua" — e saíram cinco
coisas. As três migrations entraram pelo botão novo (banco na `0060`) e tudo saiu na `v0.9.42`,
PUBLICADA E LIBERADA pra todas as lojas em 25/09/2026, a pedido dela** ("2" — publicar e já
liberar). Nada pendente: sem SQL, sem tag esperando. A `main` está à frente da `v0.9.41` com
tudo isto **mais** o "Importar por foto" desligado do marco logo abaixo. Nenhuma tag foi criada
(não publicar sem ela pedir).

#### ✅ As migrations 0058, 0059 e 0060 já foram rodadas — pelo botão novo

No mesmo dia, ela rodou o botão "Atualizar o banco de todas as empresas" (item 11 da seção 8)
pela primeira vez de verdade: **ensaio** (Pneus Amigão em `0057`, faltando as três, "✅
passaria") e depois **aplicação** ("✅ atualizado", ficou em `0060`). **Nenhum aviso** apareceu,
o que quer dizer que as 17 travas da `0060` foram todas criadas — o banco dela não tinha nenhum
dado que elas recusariam.

**Consequência**: a ordem "primeiro o banco, depois a versão" foi cumprida, e a `v0.9.42` saiu
publicada e liberada logo depois — conferida de fora: o endereço "mais recente" responde
`0.9.42`, e o instalador baixado tem a mesma impressão digital que o `latest.yml` anuncia.

**Se um dia uma trava sair "NÃO criada"** (numa empresa nova, por exemplo): o botão mostra o
aviso na tabela, nada é alterado, e o que fazer com o dado é decisão dela. Depois de corrigido,
colar a `0060` de novo no SQL Editor daquele banco (o botão não reroda migration já registrada).

#### O que saiu (PRs 297 a 300)

| PR | O que é | Migration |
|---|---|---|
| 297 | **Botão "Atualizar o banco de todas as empresas"** (item 11 da seção 8) — ensaia desfazendo, aplica uma migration por transação, trava de tempo de 15s | — |
| 298 | **Fechamento de caixa do dia** (`TR-06.4`) — aba Fechamento no Caixa, quebra/sobra viram lançamento, desfazer só de admin | `0058` |
| 299 | **Comissão paga registrada e congelada** (`TL-46.1`) — retrato das OS, aviso quando uma OS paga é editada depois, recibo | `0059` |
| 300 | **Travas de dado impossível** (`TR-05.1`) — 17 `check`, cada um só criado se o dado deixar; frase em português pra cada. **E os testes de cada migration rodando no CI** (`npm run test:sql`) — antes, só à mão | `0060` |

**Etapa 3 do guia: 6 de 7.** O que sobrou é o `TR-05.2` (uma nota por OS por tipo), **adiado
com motivo**: o índice sozinho recusaria gravar o XML de uma nota que já vale na SEFAZ. O desenho
certo (linha "processando" antes de enviar) mexe no porteiro, que ainda não foi exercitado em
produção — item 3 de "O que ainda está frágil na parte fiscal", seção 8.

**Um achado novo, registrado e não mexido**: o código fiscal só entende CNPJ de dígitos, e a
Receita emite CNPJ com letras desde julho de 2026 — item 6 da mesma lista. Depende de perguntar
à Focus NFe o formato. **Pesa na fase 2**: loja aberta de julho pra cá já nasce com CNPJ assim.

#### O que confirmar em uso real, depois da versão nova

Nada disto dá pra testar daqui (o sandbox não alcança o Supabase de verdade):
1. **Caixa → Fechamento**: contar a gaveta de um dia, fechar, ver a "Quebra/Sobra de caixa" no
   Diário, e (como admin) desfazer.
2. **Funcionários → Comissões → "Registrar pagamento"**: registrar, abrir o recibo, e conferir
   que o período pago mostra "✓ R$ X em dd/mm".
3. **Uma trava**: tentar dar num item de OS um desconto maior que o item — a tela tem que
   explicar em português, sem gravar nada.

#### Estado do código

`main` em dia com a **`v0.9.42`** (publicada e liberada), banco dela na **`0060`** — nada pendente.
`tsc`, lint e `npm run contraste` limpos; **677 testes** nos dois fusos (eram 612); matriz de RLS
em **740 células**; os **7 testes de migration** passando no CI, cada um num banco limpo.

#### Pendências (a lista do marco abaixo, atualizada)

- **Dela**: ~~rodar `0058`–`0060` pelo botão~~ e ~~publicar~~ (os dois feitos, 25/09/2026, na
  `v0.9.42`) → **conferir na loja** o que está em "O que confirmar em uso real", logo acima →
  emitir e cancelar uma nota pelo porteiro (libera a parte 2 do `TR-04.2`).
- **1º/10/2026**: a alíquota de 10/2026 no portal da prefeitura, antes da primeira NFS-e do mês.
- ✅ **2FA na conta do GitHub — FEITO por ela em 26/09/2026**, antes do prazo de 03/10/2026
  (a faixa amarela avisava que, sem isso, a conta ficaria restrita — e é por ela que passam
  publicar, liberar, o botão de atualizar os bancos e o backup). Não lembrar mais.
- **Aviso técnico do GitHub, pra olhar depois de 19/10/2026** (apareceu no rodapé das rodadas do
  botão, 25/09/2026): a máquina `ubuntu-latest` que roda o CI, o backup e os botões passa pra
  **Ubuntu 26** em 19/10/2026 (e o Node 20 das actions `checkout@v4`/`setup-node@v4` já está sendo
  trocado pelo 24 — isso só gera o aviso, não quebra nada). **O que pode quebrar é o backup**:
  `backup-banco.yml` instala o `postgresql-client-17` do repositório do Postgres pelo codinome da
  versão do Ubuntu (`$(lsb_release -cs)-pgdg`), e um Ubuntu recém-lançado pode ainda não ter esse
  repositório. Se a rodada das 3h ficar vermelha depois de 19/10, é isso — o conserto é fixar
  `runs-on: ubuntu-24.04` no job do backup (e, se precisar, no do botão de atualizar os bancos).
  ✅ **Resolvido em 26/09/2026, à noite**: backup e botão de atualizar os bancos presos em
  `ubuntu-24.04`. O CI (`ci.yml`) continua em `ubuntu-latest`, de propósito — ele instala o
  `postgresql-client` do próprio Ubuntu, sem codinome, e não depende disso. Se ele ficar
  vermelho logo depois de 19/10 sem mudança de código, é a troca de máquina: fixar
  `ubuntu-24.04` nele também.
- **Continua valendo do marco abaixo**: valor da fase 2, marcar o computador da loja como Teste,
  trocar as três credenciais expostas, o contrato com a cláusula de dados, a pergunta do CSOSN
  500, a decisão sobre o Electron e marcar o CI como obrigatório.
- **Nova pergunta pra Focus NFe**: o formato do CNPJ alfanumérico na API.
- **O que dá pra fazer sem ela, daqui**: praticamente nada que valha — o resto da Etapa 4 (RLS
  por módulo nas outras tabelas, parte 2 do porteiro) depende de decisão ou de teste real dela,
  e a Etapa 5 é da fase 3.

#### Por onde a próxima sessão começa

Ela fechou esta sessão com *"atualiza o projeto status, volto em outra sessão"*. Nada ficou
pendente de código, SQL ou publicação: `main` em dia com a `v0.9.42`, banco na `0060`. Então:

1. ~~Lembrar do 2FA do GitHub~~ — feito por ela em 26/09/2026.
2. **Perguntar se a `v0.9.42` chegou na loja** e se ela conferiu as três coisas de "O que
   confirmar em uso real" (Fechamento de caixa, Registrar pagamento de comissão, a trava do
   desconto). É a primeira versão que leva as abas novas pra loja de verdade.
3. **Perguntar se já emitiu e cancelou uma nota pelo porteiro** — é o que libera a parte 2 do
   `TR-04.2` (apagar a cópia antiga do token), um dos poucos itens de código que dependem só
   disso.
4. Depois disso, ela escolhe o próximo pelo código do item no `MELHORIAS.md`, como sempre. Os
   que sobram de peso são as etapas 2 e 3 do `TR-04.1` (permissão por módulo nas outras
   tabelas), que precisam da decisão dela tabela por tabela, e o `TR-05.2`, que espera o porteiro
   ser exercitado em produção.

### Onde parou em 25/09/2026, fim da noite

**A apresentação comercial em slides saiu (pronta pra ela mandar ao pai), o "Importar por foto"
foi desligado, e a fase 2 ganhou cenário, conta de preço e plano — sem valor decidido ainda.** O
marco logo abaixo (o porteiro da Focus NFe) **continua valendo inteiro** — nada do que ele pede
foi resolvido nesta leva. As três subseções do fim deste marco ("Fase 2", "O que o app precisa" e
"Pendências, em uma lista só") são as que respondem "onde estamos?".

#### A apresentação

O pai dela pediu uma apresentação pra oferecer o sistema aos amigos donos de autocenter. Saiu em
duas etapas, as duas pedidas por ela:

1. **Levantamento** do que o sistema oferece: `apresentacao/levantamento-do-sistema.md`, em 12
   blocos, cada item marcado como já usado na loja (✅), pronto mas ainda não usado na loja (🆕),
   ou com porém (⚠️). É a matéria-prima; vale atualizar quando a apresentação mudar.
2. **O deck**: 17 slides, "Sakura System — Apresentação", artifact **privado dela** no claude.ai
   (`https://claude.ai/artifact/Qgrq6KjoAJigmSXHouXien`) — só ela abre, até compartilhar pelo
   menu Share. Cada slide tem nas anotações um roteiro de fala pro pai dela.

**As quatro regras dela pra esse material, e valem pra qualquer versão futura**: formal, em
slides, **sem preço**, **sem citar a Pneus Amigão pelo nome** (vira "uma autocenter em
operação") e **sem citar o "Importar por foto"**. E uma quinta, de 25/09/2026: **sem a flor de
cerejeira** na capa e no encerramento — ela tirou de propósito. Os dois slides foram refeitos
sem ela (versão 26 do deck): texto alinhado à esquerda na margem de 128px, como os outros slides,
e o rodapé à direita.

**O deck só promete o que é verdade HOJE** (conferido slide a slide em 25/09/2026, versão 27).
Duas frases foram suavizadas por isso: no slide 14, "Atualizações automáticas" dizia "já testadas
em operação", mas nenhum computador estava no canal de teste e a `v0.9.41` foi liberada direto —
virou "sem reinstalar nada". **E fica assim, por decisão dela** (*"não precisa prometer isso
na apresentação"*, 25/09/2026): não recolocar "já testadas em operação" no deck, nem quando o
computador da loja for marcado como Teste. Com isso o deck ficou pronto pra ela mandar pro pai. No
slide 16, a habilitação fiscal "leva alguns dias" virou "pode levar algumas semanas", que foi o
que aconteceu na loja do pai dela. E o quadro "Sem contratos paralelos" (slide 14) só vale
enquanto a Focus NFe, o Supabase e o resto continuarem na conta dela (decisão de 28/08/2026,
seção 3) — se isso mudar, o quadro muda junto.

**Pra que serve, nas palavras dela**: *"é só pra eu salvar e enviar pros compradores"*. Ou seja, o
deck vai sair do claude.ai — ela baixa (PDF ou PowerPoint) ou compartilha o link pelo Share.

**O último slide ("encerramento") saiu SEM contato, por decisão dela** (*"por enquanto não vou
colocar meu contato nesse slide"*, 25/09/2026). A linha provisória
`[Nome do contato] · [WhatsApp] · [e-mail]` foi apagada (versão 24 do deck), junto com a frase das
anotações que dizia "os contatos estão aqui na tela" — assim o deck pode sair sem colchetes. O
slide ficou com "Sakura System · AutoCenter Edition" e "Obrigado.". **Não recolocar contato por
conta própria**; se ela quiser depois, é uma linha no slide `encerramento`.

**As telas dos slides são do app de verdade, com os dados de exemplo** (a loja inventada "Auto
Center Modelo"). Duas pegadinhas das ferramentas de tela que apareceram fotografando, e valem pra
qualquer foto futura: (a) o banco de mentira **não filtra** as notas fiscais por OS, então o
fechamento de uma OS mostra "Ver DANFE" repetido — é dado de exemplo, não bug do app; (b) o Caixa
Diário de **hoje** sai com lucro igual à venda e sem cliente, então não serve de vitrine.
**Refazer as fotos** (se a tela mudar): `apresentacao/fotografar-telas-dos-slides.mjs`, com o
`.env` de mentira e o vite das ferramentas no ar — o uso está no topo do arquivo. Depois é subir
as fotos novas pro deck e trocar o `src` das imagens.

#### "Importar por foto/PDF" desligado

Pedido dela junto com a apresentação: o crédito da IA existe, mas ela quer o recurso desligado
por enquanto e decidir depois. O botão sumiu da tela; o código ficou todo (ver o módulo Estoque,
seção 7, pra como religar). A cena dele saiu da lista de telas, que agora tem **53**, não 54.

**Não foi publicado em versão nenhuma, por decisão dela** (*"não é pra publicar"*, 25/09/2026) —
enquanto não sair uma tag, o botão continua aparecendo nos computadores das lojas. Sem migration.
**Não publicar sozinho**: quando ela voltar, perguntar, e lembrar que publicar e liberar são dois
passos (seção 9). A `main` está **uma leva à frente da `v0.9.41`** só por isso.

Conferido: `tsc`, lint, os 612 testes, as 53 telas percorridas sem falha, e a CI da `main` verde
depois do merge (inclusive o job de contraste nas telas, que era o que a cena tirada podia
quebrar).

**Por onde a próxima sessão começa**: ela disse *"continuamos isso em breve"*. Os pontos em
aberto são se/quando publicar o "Importar por foto" desligado e o **valor da fase 2** (ver "Fase
2" logo abaixo). O contato do último slide foi resolvido: fica sem. A lista completa do que falta
está em "Pendências, em uma lista só", no fim deste marco.

#### Planejado pra depois: atualizar o banco de todas as empresas de uma vez

Numa conversa sobre entrar mais lojas (cenário: uma empresa com 2 lojas e uma com 1, além da do
pai dela), ela perguntou se dava pra não colar cada migration em cada banco. **Deu num plano, não
em código**: um botão no GitHub que aplica em todos os bancos só o que falta, com um modo de
ensaio que roda e desfaz. Ela pediu pra registrar *"pra fazermos isso depois"* — está no **item 11
da seção 8**, com o desenho, as armadilhas e como testar. **Não começar sozinho**; o momento
certo é antes da primeira empresa nova ser instalada.

#### Fase 2: o cenário, o preço e o contrato — *movido pro repositório privado `sakura-corp` (27/09/2026)*

#### O que o app precisa pra essas lojas (conversado em 25/09/2026)

- **Pra começar a usar: nada de código.** O instalador serve qualquer empresa, e cada empresa
  segue o `INSTALAR-LOJA-NOVA.md` (conferido: já inclui o porteiro e o canal de atualização). A
  empresa de 2 lojas é **um banco só**, com a 2ª loja criada em Configurações → Lojas; o
  isolamento entre as duas lojas já é feito no banco, não só na tela.
- **Parte fiscal, por CNPJ** — a lenta, e depende de gente de fora (playbook no item 1 da seção
  8). Recomendação dada: usar OS, estoque e caixa no primeiro dia, nota fiscal depois.
- **Recomendado ANTES da primeira loja de terceiro**: (a) permissão por módulo nas tabelas que
  faltam (etapas 2 e 3 do `TR-04.1`) — o maior item, e precisa dela decidindo tabela por tabela;
  (b) a parte 2 do porteiro, depois de ela emitir e cancelar uma nota; (c) marcar os
  computadores como Teste (o dela já está; falta o da loja); (d) a decisão sobre o Electron; (e) o
  contrato com a cláusula de dados.
- **Com 3 bancos**: o botão de atualizar todos os bancos (item 11 da seção 8) passa a valer; e o
  backup ganha 2 blocos no `BACKUP_EMPRESAS` (a empresa de 2 lojas é um bloco só).
- **O que um dono de 2 lojas deve pedir, e não existe**: ver as duas lojas somadas, transferir
  peça entre elas, preço diferente por loja (seção 5, "Fora de escopo"). Esperar ele pedir.

#### Pendências, em uma lista só (conferida com ela em 25/09/2026)

Ela perguntou "o que está pendente, certo?" — a lista combinada:

**Grandes:**
1. **Slides pro pai** — ✅ prontos pra mandar (sem contato, sem flor, frases conferidas contra o
   sistema de hoje). Falta só ela baixar em PDF/PowerPoint ou compartilhar pelo Share.
2. **Terminar o guia** — Etapa 3: 4 itens, todos com migration, e dois pedem uma consulta no
   banco real antes. Etapa 4: a parte 2 do `TR-04.2` e as etapas 2 e 3 do `TR-04.1`. Etapa 5: 15
   itens, sem pressa.
3. **Adequar pra lojas novas** — em boa parte **é** a Etapa 4, mais o botão de atualizar os bancos
   e, opcional, as três lacunas de multi-loja acima.

**Pequenas, que dependem só dela:**
- Decidir o **valor da fase 2**.
- Publicar ou não a versão com o "Importar por foto" desligado.
- Emitir e cancelar uma nota pelo porteiro (libera a parte 2 do `TR-04.2`).
- Marcar o computador da loja do pai como Teste — *"não vou conseguir marcar hoje"*.
- **1º/10/2026: cadastrar a alíquota de 10/2026 no portal da prefeitura** antes da primeira NFS-e
  do mês.
- Sem prazo: trocar as três credenciais expostas, o contrato com a cláusula de dados, a pergunta
  do CSOSN 500 pra contabilidade, a decisão sobre o Electron e marcar o CI como obrigatório.

### Onde parou em 25/09/2026, à noite

**Saiu o `TR-04.2`, parte 1 de 2 — o token da Focus NFe deixou de ir pro computador de cada
operador.** Último item da Etapa 4 que faltava começar. Ela disse "continua pro próximo passo", e
escolheu, entre as opções, o **jeito recomendado**: um porteiro no Supabase que só **repassa** a
nota que o programa monta (sem reescrever a montagem), o token guardado **por loja numa tabela
só de escrita** (não num secret da função), e em **duas versões**.

**Estado: `v0.9.41` publicada E LIBERADA pra todas as lojas** (ela pediu "libera direto"). Os dois passos dela vieram
antes, como tinha que ser — a `0057` rodada (depois de uma primeira colagem cortada, ver a
pegadinha na seção 9) e a Edge Function `focus-nfe` publicada, as duas em 25/09/2026. A release
saiu inteira (instalador, `.blockmap` e `latest.yml` por último), marcada como pré-lançamento.
A recomendação dada a ela era marcar antes só o computador dela como Teste e testar ali; ela
preferiu liberar direto, então **o primeiro teste real do porteiro acontece na loja**. Se a
emissão falhar lá, a mensagem na tela diz o motivo (ver "Se aparecer..." em "Ativar o porteiro
da Focus NFe", seção 9); se for grave, voltar = rodar o Liberar com `v0.9.40`, que ainda emite
pela coluna antiga — é exatamente por isso que a parte 2 espera.
O passo a passo pra ela está na seção 9, "Ativar o porteiro da Focus NFe".
**Não publicar nem liberar sem ela pedir.**

#### O problema, em uma frase

O token emite e cancela nota no CNPJ da loja, e qualquer operador logado — balconista incluído —
conseguia ler pela API, com a chave que está no computador dele. Nas mãos erradas ele não vaza
dado: produz nota falsa ou cancela nota verdadeira.

#### Como ficou, em uma linha cada

- **Cofre**: `segredos_fiscais_loja`, sem policy nenhuma — nem o admin lê. Só admin da loja
  **grava**, por `definir_token_focus_nfe()`; a tela só pergunta "tem token?".
- **Porteiro**: `supabase/functions/focus-nfe/index.ts`. Confere permissão (como o operador),
  **CNPJ da nota igual ao da loja**, nota registrada antes de cancelar, e segue só o endereço de
  arquivo que a própria Focus NFe devolveu. O ambiente vem do cadastro, não do pedido.
- **Programa**: `lib/focusNfe.ts` monta a nota como sempre (teste-ouro passou sem mudar um byte) e
  pede ao porteiro. `buscarConfiguracaoFiscal()` lista as colunas uma a uma — um `select("*")`
  traria de volta a cópia antiga do token (item 71 da seção 6).
- **Configurações → Dados fiscais**: "✓ Já existe um token cadastrado" e um campo só pra trocar.

#### Como foi conferido

- Num Postgres local: instalação completa **três vezes do zero**; a `0057` **duas vezes** num banco
  no estado `0056` com token plantado (copiou certo, e a segunda passada não passou por cima de um
  token trocado depois).
- `supabase/scripts/testar-porteiro-focus-nfe.sql`, 17 checagens, e **nove mutações** — cada uma
  ficou vermelha no ponto certo (inclusive a policy de leitura plantada no cofre).
- **Matriz de RLS**: 700 células, com o cofre e as quatro lacunas declaradas.
- **O porteiro no Vitest**, com um `fetch` de mentira no lugar do Supabase e da Focus NFe: 36
  testes, **nove mutações**. Uma sobreviveu na primeira rodada — justo o token vazando numa
  mensagem de erro —, e o teste foi ampliado até pegar (item 71 da seção 6).
- **O caminho do programa até o porteiro**: 11 testes, cinco mutações.
- `tsc`, lint, contraste; **612 testes** nos dois fusos; `test:electron` (27); as 54 telas do
  catálogo geradas sem falha, e a de Dados fiscais olhada.

**O que NÃO dá pra conferir daqui**: o porteiro rodando no Supabase de verdade e falando com a
Focus NFe de verdade — este ambiente não alcança nenhum dos dois. A primeira emissão depois dos
três passos é o teste real, e é por isso que a parte 2 espera por ela.

#### A parte 2 (não feita, e com condição)

Uma migration nova (a próxima livre — a `0058` virou o fechamento de caixa) que apaga a cópia antiga do token em `configuracoes_fiscais_loja`, e a
retirada da ponte `http:fetchComAuth` do Electron (ficou sem uso). **Só depois de ela emitir uma
nota E cancelar uma nota de verdade pelo porteiro** — até lá, voltar pra `v0.9.40` precisa
continuar emitindo. Até a parte 2, o token segue legível na coluna antiga: **a proteção só fica
completa com ela**.

#### O que depende dela agora

1. ~~Rodar a `0057`, publicar o porteiro, publicar e liberar a `v0.9.41`~~ — tudo feito em
   25/09/2026.
2. Depois de a versão chegar: emitir uma nota e cancelar uma — e avisar, pra sair a parte 2.
3. Marcar as duas máquinas como Teste (pendência do `TR-09.1`, sem pressa) — **a dela foi
   marcada em 25/09/2026; falta a da loja do pai dela**.
4. O de sempre, nenhum bloqueando o uso: trocar as três credenciais expostas, marcar o CI como
   obrigatório pra mesclar, decidir sobre atualizar o Electron, e a alíquota mensal no portal.

#### Etapa 4: 12 de 12 começados

Todos os itens da etapa já saíram pelo menos em parte. Fecham de vez com a **parte 2 do
`TR-04.2`** (depende da emissão real acima) e as **etapas 2 e 3 do `TR-04.1`** nas tabelas que
sobraram (a `0056` fez só RH) — essas precisam de decisão dela antes de começar, tabela por tabela.

O que está abaixo é o marco anterior.

### Onde parou em 25/09/2026, à tarde

**Saiu o `TR-09.1` — canal de teste antes de atualizar todas as lojas.** Décimo primeiro item da
Etapa 4; falta um (o `TR-04.2`, mais as etapas 2 e 3 do `TR-04.1`). Ela disse "continuar", e este
era o próximo da ordem combinada (do mais simples pro mais complexo).

**Estado: publicado e LIBERADO na `v0.9.40`**, a pedido dela ("se tiver como, pode publicar").
Sem migration nenhuma — o banco dela continua na `0056`. **Nada esperando SQL nem publicação.**

#### O problema que isso resolve, em uma frase

Até aqui, publicar uma versão atualizava **todas** as lojas no mesmo minuto. Com uma loja só, isso
é ótimo; com as lojas do amigo do pai dela entrando, uma versão ruim vira vários telefonemas ao
mesmo tempo, em loja de outra empresa. Agora toda versão nasce no **canal de teste** (o computador
dela e o da Pneus Amigão) e só chega no resto quando ela **liberar**.

#### Como ficou, em uma linha cada

- **Publicar** (o workflow Release de sempre) cria a release como **pré-lançamento** no GitHub.
- **Liberar** é um workflow novo, "Liberar versão para todas as lojas", rodado na mão com a
  versão digitada. Ele confere a release inteira antes de mexer (instalador, `latest.yml`, e a
  impressão digital de um batendo com o outro) e confere de fora depois. **Voltar atrás é o mesmo
  botão**, com a versão boa anterior. Passo a passo pra ela na seção 9.
- **Cada computador escolhe o canal** em Configurações → "Atualizações deste computador" (só
  admin). O padrão é normal.

O detalhe está em "Canal de atualização" (seção 7) e o que se aprendeu, no item 70 da seção 6 —
principalmente que `autoUpdater.channel`, o nome óbvio, **liga `allowDowngrade` sozinho**, e que
a receita do guia (copiar `latest.yml` entre canais) não funciona com o provedor GitHub.

#### A primeira versão com canal (a `v0.9.40`) — já resolvida

**Nenhum computador estava no canal de teste** — os dois que deveriam estar (o dela e o da
Pneus Amigão) rodavam a `v0.9.39`, que nem sabe que canal existe e só enxerga versão liberada.
Então a `v0.9.40` foi **publicada e liberada no mesmo minuto**, e isso serviu de primeira rodada
de verdade dos dois workflows — que é justamente o que o critério de aceite do item pedia:
1. **Release**: publicou como pré-lançamento e conferiu de fora — *"Canal de teste: v0.9.40.
   Todas as lojas continuam em v0.9.39."* Ou seja: a marca pegou, e **publicar não atualizou
   ninguém**.
2. **Liberar**: *"Conferido: v0.9.40 tem o instalador e o anúncio, e a impressão digital bate"*
   → *"v0.9.40 liberada para todas as lojas"* → *"Conferido de fora: o GitHub responde v0.9.40
   para todas as lojas."* Menos de um minuto de ponta a ponta.

**O que falta, e é dela**: depois de a `v0.9.40` chegar nas duas máquinas, em cada uma,
Configurações → "Atualizações deste computador" → **Teste** → Salvar. A partir da `v0.9.41`,
vale o fluxo de dois passos. **Não é urgente**: com todo computador no canal normal, o sistema se
comporta como sempre, só que cada versão precisa ser liberada pra chegar. Passa a importar no dia
em que a primeira loja de outra empresa for instalada.

**E uma consequência que vale lembrar em toda sessão daqui pra frente**: enquanto as duas
máquinas não estiverem em Teste, **publicar sem liberar não entrega a versão pra loja**. Desde
25/09/2026 o computador dela está em Teste, então uma versão publicada chega nele; a loja do pai
dela só recebe depois do Liberar, até ser marcada também. Se ela pedir "publica", perguntar se é
pra liberar junto — ou marcar a máquina da loja antes.

#### Como foi conferido

- **O `electron-updater` instalado (6.8.9) rodando de verdade** contra um GitHub de mentira, nos
  cenários que importam: normal não vê o pré-lançamento, teste vê, depois de liberar os dois
  veem, voltar atrás devolve o normal à versão boa, e publicação pela metade não instala nada.
  Se uma atualização da biblioteca mudar a regra, esse teste fica vermelho.
- **O Liberar**, com um `gh` de mentira: o caminho feliz, voltar atrás (na ordem certa — a boa
  vira "a mais recente" **antes** de a ruim sair), e **oito recusas**, cada uma provando que
  recusar é não mexer em nada: versão que não existe, rascunho, sem `latest.yml` (o caso da
  `v0.9.38`), sem instalador, instalador vazio, anúncio de outra versão, anúncio de outro arquivo,
  e instalador cortado (impressão digital não bate).
- **O trecho novo do Release**, com `gh` e `curl` de mentira, nos quatro cenários: publicou no
  teste, a marca não pegou (fica vermelho), rede caiu (só aviso), release já liberada.
- **Sete mutações** — cada trava quebrada de propósito ficou vermelha no teste certo.
- **O Electron de verdade** (`npm run test:electron`, agora 27 checagens): a escolha feita na tela
  chega no disco, canal inventado é recusado sem estragar o arquivo, o diagnóstico mostra o canal,
  e o atualizador é configurado com o canal gravado — rodado partindo de "normal" e de "teste".
- A seção nova de Configurações **renderizada** nos três estados, com o CSS real do tema.
- `tsc`, lint, `npm run contraste` limpos; **565 testes** nos dois fusos (eram 529).

**O que não dava pra conferir daqui era o GitHub em si** — esta sessão não alcança `github.com`
(nem pra ler o feed de releases). Por isso o Release e o Liberar conferem **de fora**, pelo mesmo
endereço que o app usa. A primeira rodada de verdade (acima) passou nas duas conferências.

**O que ainda NÃO foi visto de verdade**: um computador no canal de teste recebendo um
pré-lançamento. Isso só acontece na `v0.9.41`, depois de ela marcar as máquinas — o comportamento
da biblioteca está provado pelo teste que roda o código dela, mas a primeira vez numa máquina
real vale conferir no `atualizacoes.log` (linha "Abrindo no canal de atualização: teste").

#### O que depende dela agora

1. **Marcar as duas máquinas como Teste**, quando a `v0.9.40` chegar nelas (sem pressa, ver
   acima).
2. O de sempre, nenhum bloqueando o uso: trocar as três credenciais expostas, marcar o CI como
   obrigatório pra mesclar, decidir sobre atualizar o Electron, e a alíquota mensal no portal.

#### Etapa 4: 11 de 12

Falta o `TR-04.2` (token da Focus NFe numa Edge Function, `E3`) — o último da etapa — mais as
**etapas 2 e 3 do `TR-04.1`** nas tabelas que sobraram (a `0056` fez só RH). Vale confirmar com
ela antes de começar qualquer um.

O que está abaixo é o marco anterior.

### Onde parou em 18-25/09/2026

**Saiu o `TR-04.3` — dado de RH só pra quem tem o módulo.** Décimo item da Etapa 4; faltam
dois. **Nada pendente: sem SQL esperando, sem tag esperando.** O código foi escrito em
18/09/2026 e ficou parado esperando o SQL; em **25/09/2026** ela rodou a migration `0056`
("Success. No rows returned") e a **`v0.9.39`** foi publicada logo depois — nessa ordem, que
era a obrigatória aqui.

#### O problema que isso resolve, em uma frase

`funcionarios` guarda salário, comissão, CPF, RG, CNH, filiação e nome do cônjuge, e
`funcionario_filhos` guarda nome e nascimento de criança. A **tela** escondia tudo isso de quem
não tem a permissão "Funcionários"; o **banco** não escondia nada — qualquer operador logado
podia pedir a tabela inteira pela API, com a chave que está no computador dele. Salário de
colega circulando na loja é briga na hora; CPF e filiação é dado de terceiro sob a LGPD. Agora
o banco recusa.

#### O que NÃO mudou, de propósito

Todo mundo que abre uma OS precisa escolher técnico e vendedor, e precisa ver o nome do técnico
num item já lançado — **inclusive o balconista que não tem o módulo**. Então `nome` continua
público: ele sai por uma view nova (`funcionarios_publico`), que entrega id, nome, cargo e mais
nada. Uma trava que também impedisse o balconista de abrir OS não seria segurança, seria
sistema quebrado — e é por isso que o teste confere as duas metades.

#### Três coisas que só apareceram medindo

O detalhe está no item 69 da seção 6; em uma linha cada:

- **A receita do guia estava errada.** Ele manda usar a view com `security_invoker = true`, e
  medido num Postgres: nessa configuração ela devolve **zero** linha, porque obedece à RLS da
  tabela base. O experimento custou dois minutos e evitou um desenho inteiro construído errado.
- **A view que atravessa a RLS abre dois buracos silenciosos.** Sem o filtro de loja escrito
  dentro dela, entrega o cadastro de todas as lojas; e sem o `revoke`, dá pra **escrever** na
  tabela base por dentro dela. Medido: tirando só o `revoke`, a matriz de RLS acusa 11 células
  — inclusive o **anônimo** conseguindo inserir.
- **`join` embutido em tabela fechada não dá erro, devolve `null`.** A lista de OS trazia o
  nome do técnico assim; fechar a tabela teria apagado o "técnico: Fulano" da tela e da
  garantia do balconista, calado. Os nomes passaram a vir da view, costurados no app.

#### Como foi conferido

- Num Postgres local: instalação inteira rodada **três vezes do zero**, a `0056` sozinha duas
  vezes num banco no estado `0055` com dado plantado.
- `supabase/scripts/testar-rh-permissao.sql` — 11 checagens, as duas metades. **Cada uma foi
  conferida quebrando o código de propósito**: cinco mutações (tirar a permissão da policy,
  tirar o filtro de loja da view, tirar o `revoke`, deixar o salário escapar pra view, e
  trancar demais) ficaram vermelhas na checagem certa.
- A **matriz de RLS** passou a sondar views também — 680 células, e a view do TR-04.3 é o caso
  que mais importa, porque view não reage a RLS. Duas mutações foram rodadas contra ela e
  acusaram as células certas.
- As **54 telas** do catálogo geradas de novo sem nenhuma falha, e as duas que importam foram
  olhadas: o Vendedor da OS continua vindo preenchido e o "técnico: Anderson Lima" continua
  aparecendo no Fechamento.
- `tsc`, lint, `npm run contraste` limpos; **529 testes** passando nos dois fusos.

#### A ordem que essa leva exigia (cumprida em 25/09/2026)

A migration **antes** da tag, como sempre — e aqui por um motivo específico: a tela de OS passa
a ler a view `funcionarios_publico`, que só existe depois da `0056`. Com a versão nova chegando
primeiro, o seletor de técnico e vendedor procuraria uma view inexistente.
**O contrário era seguro**, e é o que dava folga: rodar a migration antes não mudava nada pra
quem estava usando o app velho, porque quem usa o módulo Funcionários é admin ou tem a
permissão.

#### O que depende dela agora

Nada desta leva. Continua valendo o de sempre, nenhum deles bloqueando o uso do sistema:
**trocar as três credenciais expostas** no histórico público, **marcar o CI como obrigatório
pra mesclar**, **decidir sobre atualizar o Electron** (a linha 33 não recebe mais correção de
segurança), e **cadastrar a alíquota da competência** no portal da prefeitura todo mês.

#### O que confirmar em uso real, depois que a versão nova chegar

Nada disso dá pra testar daqui.

1. **Abrir uma OS e conferir que o seletor de técnico e o de vendedor continuam preenchidos**,
   e que o "técnico: Fulano" aparece num item já lançado. É a metade da promessa que pode
   quebrar sem ninguém perceber.
2. **A tela de Funcionários continua completa** pra ela (é admin, então nada muda).
3. Se quiser ver a trava funcionando: criar um operador de teste **sem** a permissão
   Funcionários e conferir que ele monta OS normalmente.

#### Etapa 4: 10 de 12

Faltam `TR-04.2` (token da Focus NFe na Edge Function) e `TR-09.1` (canal de teste antes de
atualizar todas as lojas) — mais as **etapas 2 e 3 do `TR-04.1`**, que agora deixaram de ser
teóricas: a `0056` é a primeira tabela, e o caminho pras outras está aberto e medido. Pela
ordem de esforço que a última sessão combinou, **o próximo é o `TR-09.1`** (`E2`), e o
`TR-04.2` (`E3`) fecha a etapa. Vale confirmar com ela antes de começar.

O que está abaixo é o marco anterior.

### Onde parou em 18/09/2026, de manhã

**Saiu o `TR-12.1` — o backup próprio do banco.** Nono item da Etapa 4; faltam três.
Nada disso é versão nova do app: não mexe numa linha do que roda na loja, então **não houve
tag** e o computador dela continua na `v0.9.38`. O banco continua na `0055`.

#### O que existe agora

Todo dia às 3 da manhã um robô do GitHub tira uma cópia do banco de **cada empresa** e guarda
**em dois lugares fora do Supabase**: o repositório privado `caranovavidanova/ssace-backups`
(como anexo de release) e o Cloudflare R2. Ficam **30 diárias + a primeira de cada um dos
últimos 12 meses**.

**Por que isso, se o Supabase já faz backup:** o plano Pro guarda os **últimos 7 dias**. Parece
bastante até o problema ser descoberto na segunda semana — e aí não existe mais de onde voltar.

**O que vai dentro de cada cópia, e por quê:** o `schema public` inteiro **com as permissões**
(sem elas o banco volta com os dados certos e sem as travas de segurança, e nada denuncia isso);
`auth.users`, primeiro no arquivo (`operadores.id` aponta pra lá); e **os XMLs das notas
fiscais**, que não ficam no banco e são o documento que a lei manda guardar 5 anos.

**A chave que abre não está no GitHub.** Lá só existe a pública, que fecha o cadeado. Abrir é só
com o `chave-do-backup.txt`, que ela gerou no PC dela (`C:\age`) e copiou pro Google Drive. Se o
destino do backup vazar um dia, o arquivo continua ilegível — **e se ela perder esse arquivo, as
cópias antigas viram lixo.** Não existe recuperação; é esse o ponto.

#### Está rodando de verdade, e ela abriu a cópia com as próprias mãos

**A rodada boa saiu assim**, com tudo dentro:

```
banco.sql: 3702 linhas
chave de pneus-amigao: papel = service_role
buckets de pneus-amigao: notas-fiscais
XMLs de nota fiscal: 18 de 18 baixados
pneus-amigao-2026-09-18.age: 48K
Todas as cópias do dia 2026-09-18 foram guardadas.
```

Antes disso, o ciclo tinha sido exercitado num Postgres local — instalar o sistema pelo
`instalacao-completa.sql`, plantar dado, tirar a cópia **com os mesmos comandos do workflow**,
cifrar, abrir com a chave e restaurar num banco vazio. As 13 tabelas bateram, o dado sobreviveu,
e vieram junto 45 policies de RLS, 264 permissões e 48 funções — essa última conferência é a que
ninguém lembra de fazer, e é a que separa "restaurou" de "restaurou com o banco aberto".

**Foram seis rodadas até essa, e as lições estão nos itens 67 e 68 da seção 6.** Vale ler as duas
antes de mexer aqui — principalmente a **68**, porque ela é sobre um sintoma que aponta com
confiança pro lugar errado: `Bucket not found` custou três rodadas caçando bucket e chave, quando
a causa era o secret `BACKUP_EMPRESAS` não ser um JSON válido (com ele ilegível, o endereço e a
chave saíam vazios).

**E a parte que o guia insiste, ela fez**: baixou a cópia do repositório privado, abriu com o
`age.exe` e a chave dela, descompactou e conferiu — 238.896 bytes, **3.702 linhas, o mesmo número
que o servidor tinha reportado ao gerar**. Depois limpou o descompactado, que era o passo que
importava não esquecer (o `banco.sql` aberto é o cadastro de clientes em texto puro). Ou seja: o
backup não está testado só por mim — está testado por quem vai precisar dele às 9 da manhã de
uma terça.

**O que sobra pra ela, uma vez por mês**: olhar se as rodadas estão verdes e abrir uma cópia.
Cinco minutos, o roteiro está no fim do `RESTAURAR-BACKUP.md`.

#### O que ela montou do lado dos serviços

Tudo nesta sessão: a chave do `age` (guardada em `C:\age` e no Google Drive), o repositório
privado `ssace-backups`, o token do GitHub, a conta Cloudflare com o bucket `ssace-backups`, e
os **8 secrets**. O passo a passo completo está na seção 9, em "Backup do banco".

#### Etapa 4: 9 de 12 (na data deste marco — o `TR-04.3` saiu no mesmo dia, ver acima)

Faltam `TR-04.3` (dado de RH), `TR-04.2` (token da Focus NFe na Edge Function) e `TR-09.1`
(canal de teste antes de atualizar todas as lojas) — mais as **etapas 2 e 3 do `TR-04.1`**, que
precisam da decisão dela antes de começar.

**A ordem combinada nesta sessão é do mais simples pro mais complexo**, pelo esforço que o
próprio guia marca: `TR-12.1` (feito) → `TR-04.3` (`E1`) → `TR-09.1` (`E2`) → `TR-04.2` (`E3`).
Então **o próximo é o `TR-04.3`** — tirar salário, CPF, RG e CNH de funcionário do alcance de
quem não tem o módulo. Vale confirmar com ela antes de começar, porque ele é, na prática, a
primeira tabela da etapa 2 do `TR-04.1`.

O que está abaixo é o marco anterior.

### Onde parou em 17/09/2026

**Nada pendente: sem SQL esperando, sem tag esperando.** O banco dela está na `0055` e a
**`v0.9.38`** é a última versão publicada — ela mandou publicar no fim da sessão ("tomamos a
decisão mais tarde, pode publicar", sobre a decisão do Electron logo abaixo).
Dois itens saíram neste dia: o `TR-12.2`, que não gerou versão nova porque não mexeu numa linha
de código, e o `TR-04.6`, que gerou a `v0.9.38`.

**E um terceiro assunto, que não estava no plano: publicar a `v0.9.38` deu errado três vezes e
quebrou o canal de atualização de todas as lojas por algumas horas.** O instalador subiu inteiro
e íntegro nas três, mas o `latest.yml` — o arquivo que avisa o app instalado de que existe versão
nova — nunca subiu, e a release mais recente ficou anunciando uma versão que o app não conseguia
enxergar. Nada foi corrompido e nenhuma loja perdeu dado; o que parou foi só a atualização
automática, com cada computador seguindo normal na versão que já tinha. O conserto está no
`release.yml` (o `electron-builder` só builda; quem publica é o `gh`, arquivo por arquivo, com o
`latest.yml` por último) e o caso inteiro, com as lições, está no **item 66 da seção 6**.
**Resolvido no mesmo dia, na própria `v0.9.38`**: o build novo publicou os três arquivos em 2
minutos e a conferência de ponta a ponta passou (o instalador baixado do endereço que o app usa
bate com a impressão digital que o `latest.yml` anuncia). **Não há nada a fazer do lado dela** —
a atualização automática volta sozinha na próxima abertura do programa.

#### O que saiu nesta leva: `TR-12.2` — contrato e papéis de LGPD

Ela pediu "o passo mais curto que falta na Etapa 4", e é este — o único item da etapa que não é
código e não depende de ela rodar nada no Supabase. O que ele resolve é uma pergunta que hoje não
tem resposta escrita: pela decisão de 28/08/2026, **toda a infraestrutura fica nas contas dela**
(Supabase, Anthropic, Focus NFe), então na LGPD a **loja é controladora** dos dados dos clientes
dela e **ela é operadora**. Enquanto quem usa é a borracharia do pai dela, isso é combinado de
família; na primeira loja de terceiro, vira contrato.

O texto ficou em **`ANTES-DA-PRIMEIRA-VENDA.md`**, na raiz: uma página em linguagem simples com
as duas palavras que resolvem a conversa, os **seis pontos** que a cláusula de tratamento de
dados precisa ter, e o **registro de operações de tratamento** já rascunhado com o que é verdade
hoje (que dado, de quem, pra quê, onde fica, por quanto tempo). Registrado também como **item 10
da seção 8**, como pendência da fase 2.

**Três decisões que valem saber, se alguém for mexer nisso:**

- **Virou arquivo no repositório, não resposta no chat**, porque o chat não sobrevive à sessão e
  este é um assunto que só vai ser usado meses depois, na hora da venda.
- **Nada foi prometido além do que o sistema faz.** O ponto de segurança da cláusula lista o que
  existe de verdade — banco separado por empresa, permissão por operador, trilha de auditoria,
  cópia de segurança automática — e nada mais. Prometer em contrato o que o código não faz é
  pior que não ter contrato.
- **Não escrever contrato por ela, e não afirmar nada como aconselhamento jurídico.** O arquivo
  abre dizendo isso, e o valor do item (nas palavras do próprio guia) é ela saber que a pergunta
  existe, não ter a resposta pronta.

#### E, no mesmo dia: `TR-04.6` — endurecer o Electron

Segundo item da sessão. É uma auditoria de segurança do **programa em si** — a parte do sistema
que roda fora da tela e tem acesso à máquina de quem usa. Não muda nada do que ela vê; o que
muda é o tamanho do estrago possível se um dia entrar coisa envenenada pela tela.

O que saiu está em "Segurança do app em si" (seção 7); o que se aprendeu, no item 65 da seção 6.
O checklist foi percorrido item a item e **dois pontos não foram feitos como o guia pedia** — os
dois de propósito, e é o que mais importa registrar:

- **A chavinha de integridade do `app.asar` ficou de fora.** Ela é a que confere se o programa
  instalado foi adulterado. Só funciona quando o empacotador grava o hash do asar junto no
  executável, e o electron-builder 25 (o que este projeto usa) não faz isso — ligá-la sozinha
  produziria um **instalador que não abre**, e o estrago apareceria na loja, depois do
  auto-update. Fica possível ao subir o electron-builder pra 26, que é decisão dela.
- **O Electron NÃO foi atualizado**, e este é o achado desconfortável da auditoria: o projeto
  está na linha **33**, e as que ainda recebem correção de segurança hoje são a **42, 43 e 44**.
  Ou seja, o Chromium que desenha as telas não recebe mais correção. Subir isso é mexer no
  Chromium, que **já mudou comportamento de campo de formulário neste projeto** (item 41 da
  seção 6: a mesma tela responde diferente no Chromium 130 e no 141) — então não é coisa pra
  fazer junto com outras mudanças, às cegas, sem teste na loja. O que foi entregue no lugar é o
  **aviso**: `npm run checar-versao-electron` roda sozinho uma vez por mês e reprova só quando a
  linha em uso sai do suporte. **Ele está vermelho hoje, e isso está certo** — é o fato, não um
  defeito do aviso. Ver "O que depende dela agora", logo abaixo.

**Etapa 4: 8 de 12.** Faltam: `TR-04.3` dado de RH · `TR-04.2` token da Focus NFe na Edge
Function · `TR-12.1` backup próprio e testado · `TR-09.1` canal de teste antes de atualizar todas
as lojas — mais as **etapas 2 e 3 do `TR-04.1`**, que são o trabalho grande (as policies, tabela
por tabela) e **precisam da decisão dela antes de começar**.

**O primeiro passo da próxima sessão é perguntar qual item do `MELHORIAS.md` entra** — não há
nada esperando publicação nem SQL. Se ela pedir sugestão de próximo item, os dois naturais são o
`TR-12.1` (cópia de segurança própria e **testada** — hoje a do Supabase existe mas nunca foi
restaurada pra valer) e o `TR-09.1` (canal de teste, pra uma tag ruim não chegar nas três lojas
no mesmo minuto). A etapa 2 do `TR-04.1` continua sendo a maior, e continua dependendo da
decisão dela — ver "Por onde uma sessão nova começa", no marco de 13/09 mais abaixo.

**O que depende dela agora** (nada bloqueia o uso do sistema):

1. **Levar o `ANTES-DA-PRIMEIRA-VENDA.md` a um advogado ou à contabilidade** e sair com um
   contrato de prestação de serviço com cláusula de tratamento de dados. A hora certa é **antes**
   da primeira loja de terceiro — a fase 2 (as duas lojas do amigo do pai dela) está no horizonte.
2. **Trocar as três credenciais expostas** no histórico público (CSC da SEFAZ, token do portal
   Giap, senha do portal da prefeitura) — item 50 da seção 6 explica por que a varredura
   automática **não** substitui isso.
3. **Decidir sobre atualizar o Electron** — o programa está numa versão que **não recebe mais
   correção de segurança** (linha 33; as atuais são 42 a 44). Não dá pra fazer por conta
   própria: muda o Chromium que desenha as telas, e isso já mudou comportamento de campo de
   formulário neste projeto. O caminho proposto é subir **uma linha por vez**, rodar
   `npm run test:electron`, e publicar cada uma **sozinha**, sem outras mudanças junto — assim,
   se algo estranhar na loja, só existe uma causa possível. É trabalho de umas quantas sessões,
   e precisa dela testando na loja entre uma e outra.
4. **Marcar o CI como obrigatório pra mesclar** (Settings → Branches), agora que ele já foi visto
   verde muitas vezes.
5. **Todo mês**: cadastrar a alíquota da competência no portal da prefeitura antes da primeira
   NFS-e do mês — que agora, pelo menos, o sistema lembra.

**O que confirmar com ela em uso real** (nada disso dá pra testar daqui, e nada mudou desde
15/09): que a faixa de banco desatualizado **não** aparece (o banco dela está em dia); a tela de
**Diagnóstico** (`v0.9.36`, ainda não vista por ela); e a **Auditoria ampliada** (`v0.9.35` — o
filtro Ação, a linha "Criou", e o antes/depois ao editar o preço de um item de OS).

**Estado do código**: `main` **em dia com a `v0.9.38`** e banco dela na `0055` — nada esperando
tag nem SQL. `tsc`, lint e `npm run contraste` limpos; **510 testes** passando nos dois fusos (o
número não mudou: o que entrou nesta leva é o processo principal do Electron, e o teste disso é o
`npm run test:electron`, que roda fora do `npm test` — 22 checagens, todas passando, agora com
job próprio no CI).

O que está abaixo é o marco anterior.

### Onde parou em 15/09/2026

**Nada pendente: sem SQL esperando, sem tag esperando.** O banco dela está na `0055` (ela rodou
em 15/09, com "Success. No rows returned") e a **`v0.9.37`** foi publicada logo depois — a ordem
certa —, com o instalador e o `latest.yml` confirmados na release.

#### O que saiu nesta leva: `TR-05.7` — o app avisa quando o banco está atrasado

O sexto item da Etapa 4. O problema que ele resolve é uma dor real e já vivida: o auto-update
chega em todas as lojas no mesmo minuto, mas a migration é manual, um projeto Supabase por vez —
e quando as duas coisas saem de sincronia (a `0046`/`0047` já ficaram "não rodadas" por um tempo),
o que aparece é `column ... does not exist` numa tela qualquer. Erro que não diz o que houve, não
diz o que fazer, e parece defeito de quem estava usando.

Agora o banco guarda em que versão está (`schema_versao`, migration `0055`), o app compara na
abertura e, se estiverem diferentes, uma faixa no topo diz o que aconteceu e **qual arquivo falta
rodar**. Detalhe completo em "Aviso de banco desatualizado", seção 7. Quatro decisões que valem
saber, todas já escritas lá: aparece pra qualquer operador (quem topa com o erro é o balcão);
nunca bloqueia; queda de rede não vira aviso; e a versão do banco passou a entrar no Diagnóstico
e no resumo do WhatsApp — que era a ponta solta deixada pelo `TR-08.1`.

**A regra nova que vale pra sempre**: toda migration daqui pra frente termina registrando a
própria versão (`insert into schema_versao (versao) values (N) on conflict do nothing;`). Sem
isso o aviso mente, dizendo que um banco em dia está atrasado — então o `npm test` reprova quem
esquecer, e essa trava foi conferida plantando o esquecimento de propósito (inclusive o engano
mais provável, que é copiar a linha da migration anterior com o número dela).

#### Como foi validado

Nada disso foi só lido. Num Postgres local: a instalação inteira rodada **três vezes do zero**, a
`0055` sozinha **duas vezes** num banco no estado `0054`, e a RLS conferida trocando de papel — o
operador logado lê, o anônimo não vê nada, e nem insert nem delete passam (`42501`). A matriz de
RLS subiu de 640 pra **660 células** com a tabela nova.

E o caminho inteiro — consulta → regra → faixa na tela — foi exercitado **no app de verdade**,
com o banco de mentira das ferramentas de tela, nos quatro cenários que importam: banco em dia
(faixa não aparece), banco atrás (aparece, com o número certo), banco anterior à `0055`, sem a
tabela (aparece), e **rede caída (não aparece)** — esse último é o que impede o app de acusar a
usuária toda vez que a internet oscilar.

**Um efeito colateral que quase passou batido**: o banco de mentira das ferramentas de tela não
conhecia a tabela nova, então a faixa apareceria nas 54 telas do catálogo e nas imagens do site.
O `dados-demo.mjs` passou a responder a versão **lendo a constante do próprio código**, em vez de
copiá-la — copiar só adiaria o problema pra próxima migration.

> Desatualizado de propósito, é registro do dia: o `TR-12.2` (contrato e papéis) saiu em
> 17/09/2026, então hoje são **7 de 12** e faltam cinco. A lista de verdade está no marco de
> 17/09, logo acima.

**Etapa 4: 6 de 12.** Faltam: `TR-04.3` dado de RH · `TR-04.2` token da Focus NFe na Edge
Function · `TR-12.1` backup · `TR-09.1` canal de teste · `TR-04.6` endurecer o Electron ·
`TR-12.2` contrato e papéis — mais as **etapas 2 e 3 do `TR-04.1`**, que precisam da decisão dela
antes de começar.

**O primeiro passo da próxima sessão é perguntar qual item do `MELHORIAS.md` entra** — não há
nada esperando publicação nem SQL. Se ela pedir sugestão, ver "Por onde uma sessão nova começa",
no marco de 13/09 mais abaixo.

**O que confirmar com ela em uso real** (nada disso dá pra testar daqui):

1. **Que a faixa do banco desatualizado NÃO aparece** — ela rodou a `0055` antes da tag, então o
   banco está em dia e a faixa deve ficar invisível. Se aparecer mesmo assim, é bug e vale o
   print. (Ela só voltaria a aparecer no dia em que uma versão nova chegar antes do SQL — que é
   justamente pra isso que ela existe.)
2. **A tela de Diagnóstico** (`v0.9.36`, ainda não vista por ela): o ícone no rodapé do menu
   lateral, ao lado da engrenagem, visível pra qualquer operador. Agora mostra também a versão do
   banco.
3. **A Auditoria ampliada** (`v0.9.35`): se aparece o filtro **Ação**; se cadastrar um cliente
   vira uma linha "Criou"; e se editar o preço de um item de OS aparece com o antes/depois — esse
   último é o buraco que o item veio fechar.

**Estado do código**: `main` em dia com a `v0.9.37`, banco dela na `0055` — nada esperando tag
nem SQL. `tsc`, lint, `npm run contraste` e `npm run contraste:telas`
limpos; **510 testes** passando nos dois fusos (eram 495 em 13/09) e a matriz de RLS batendo
660 de 660 (`npm run test:rls`, só no CI e em Postgres local — não roda no Windows).

O que está abaixo é o marco anterior.

### Onde parou em 13/09/2026, mais cedo

**A Etapa 4 do guia começou.** Ela escolheu (entre fechar a Etapa 3 e começar a 4) a **Etapa 4** —
a que o guia trata como **pré-requisito da venda**: *"nenhuma loja de terceiro deveria entrar
antes desta etapa fechar"*. Pesa agora porque a fase 2 (as duas lojas do amigo do pai dela) está
no horizonte. São 12 itens; saíram **três inteiros e o primeiro terço de um quarto**.

**Estado: publicado na `v0.9.35`, e o banco dela está na `0054`.** Ela rodou as duas migrations
e mandou publicar ("rodei, se tiver q publicar algo pode publicar") — a ordem obrigatória da
`0053` foi cumprida: SQL primeiro, tag depois. Nada esperando SQL nem tag.

**O quarto item (`TR-07.3`, a matriz de RLS) saiu DEPOIS da `v0.9.35` e NÃO precisa de tag
nenhuma**: é ferramenta de teste, não muda uma linha do que roda no computador da loja.


#### O que saiu

1. **`TR-04.9` — a auditoria passou a cobrir o que escapava** (migration `0053`). O buraco mais
   grave era `ordens_servico_itens`: desde a `v0.9.28` dá pra corrigir o **valor** de um item de
   OS pela tela, e isso não deixava rastro nenhum — era a ponta solta anotada desde 10/09. Agora
   **criação** também é auditada, mais cinco tabelas entraram, e o token da Focus NFe sai
   **mascarado** (sem isso, auditar os dados fiscais transformaria a própria trilha no lugar novo
   onde o segredo fica legível). Detalhe em "Auditoria", seção 7.
2. **`TR-09.2` — como voltar uma versão** (só documento, em "Voltar uma versão", seção 9). O fato
   que muda o procedimento inteiro: **o `electron-updater` só anda pra frente**, então apagar a
   release ruim NÃO desfaz nada em computador que já atualizou — desfazer de verdade é publicar
   uma versão NOVA com o código da antiga. Junto veio uma regra de trabalho adotada aqui:
   **migration nunca tira nem renomeia coluna em uso na mesma versão que passa a usar a nova** —
   sempre em duas versões. É o que mantém o código antigo funcionando em cima do banco novo, e
   portanto o que torna o rollback possível.
3. **`TR-04.1`, etapa 1 de 3 — a função de permissão por módulo** (migration `0054`). **Nenhuma
   policy usa ela ainda e rodar a migration não muda comportamento nenhum**, de propósito: aplicar
   as policies é mudança de arquitetura de segurança e o próprio guia manda alinhar com ela antes.
   Ver item 1 da seção 6 pro que ela precisa saber antes de aprovar a etapa 2.
4. **`TR-07.3` — a matriz de RLS** (`npm run test:rls`, pasta `supabase/testes-rls/`). Monta um
   banco descartável do zero, simula **cinco papéis** — admin das duas lojas, admin só da loja A,
   balconista só-Caixa, o operador **sem loja nenhuma** (o caso do §6 item 23) e ninguém logado —
   e confere as **640 combinações** de tabela × comando × papel contra um arquivo declarado.
   Três coisas que valem saber:
   - **A parte que se revisa é o `expectativas.csv`**, e cada número é "quantas linhas este papel
     consegue mexer". É por isso que o item existe: mudança de segurança passa a aparecer **no
     diff do PR**, em números, em vez de sumir dentro de uma migration.
   - **Ele também caça o furo que não tem cara de furo**: comando sem policy nenhuma. Isso não dá
     erro, filtra a zero linhas e do lado do app parece "deu certo" — foi assim que o botão
     "excluir loja" passou meses sem fazer nada (§6 item 15). As três lacunas que existem de
     propósito (a trilha de auditoria não aceita escrita de ninguém) estão **declaradas por
     escrito** em `lacunas-de-proposito.csv`.
   - **Isto é o que faltava pra etapa 3 do `TR-04.1`.** O guia é explícito: "nenhuma policy entra
     sem um teste automatizado que prove o bloqueio". A matriz já fotografou o comportamento de
     hoje, então, quando a etapa 2 for feita, o que mudou fica visível célula a célula.
   Nada disso roda no Windows (precisa de Postgres e `psql`) — é do CI, onde ganhou job próprio
   com um Postgres de serviço. O `npm test` de todo dia não mudou.


#### Coisas que só apareceram testando, e que o guia não previa

As duas primeiras estão no commit e no cabeçalho da migration `0053`; ficam aqui porque são o
tipo de coisa que se redescobre do zero:


- **Três das cinco tabelas novas não têm coluna `id`** — `configuracoes_fiscais_loja` teve o `id`
  derrubado pela `0033`, e duas têm PK composta. A função da `0040` gravava `new.id` fixo, então
  teria estourado. A coluna-chave virou argumento do trigger.
- **A FK `auditoria.operador_id` precisou sair.** Com criação auditada, todo operador passa a ter
  linha na trilha — e a FK faria a exclusão de operador pelo painel do Supabase falhar, que é
  justamente o caminho documentado no item 23 da seção 6. **`on delete set null` não resolve**: a
  linha é gravada DEPOIS da exclusão, então um admin que exclui a própria conta estoura na FK
  (testado, não suposto). O "quem" passou a ser gravado junto com o fato (`operador_nome`), que é
  como registro histórico deve funcionar de qualquer forma.

E da matriz de RLS saíram mais três, todas no **item 63 da seção 6**, que é onde vale ler o
detalhe. Em uma linha cada: `session_replication_role = replica` desliga gatilho e chave
estrangeira **sem** desligar RLS (é o que torna a sonda de DELETE possível); o erro **42501 chega
por dois motivos opostos** — a RLS recusando, ou falta de `GRANT` —, e tratar os dois igual faria
o teste passar pelo motivo errado; e a checagem de "comando sem policy" **não achava lacuna
nenhuma em banco nenhum**, porque o apelido `cmd` era engolido por uma coluna de mesmo nome em
`pg_policies`.

#### Como isso foi validado (e o que continua sem validação)


Num Postgres local: a instalação inteira rodada **três vezes do zero**, cada migration sozinha
**duas vezes** num banco no estado `0052` com dado plantado, e dois scripts de teste novos
(`supabase/scripts/testar-auditoria.sql`, 7 checagens; `testar-permissao-modulo.sql`, 5 perfis).
**Os dois foram conferidos quebrando o código de propósito** pra vê-los ficar vermelhos — quebrar
a máscara de segredo e a coluna-chave no primeiro, e uma função que sempre diz "sim" no segundo.
É a lição do item 53 da seção 6: teste de regra que nunca falhou na frente de alguém não prova
nada.

A matriz de RLS teve o mesmo tratamento, e mereceu: ela bateu **640 de 640 na primeira rodada de
verdade**, e "acertou tudo de primeira" é motivo pra desconfiar do instrumento (§6 item 58), não
pra comemorar. As **sete** checagens dela foram conferidas uma a uma quebrando o código de
propósito — furo de RLS numa tabela por loja, policy de DELETE sumindo (o bug real do item 15),
sonda com coluna errada, tabela nova sem sonda, tabela nova sem linha nas expectativas, `GRANT`
faltando, e expectativa falando de tabela que não existe. Todas ficaram vermelhas; a árvore limpa
voltou a ficar verde.


**O que continua sem validação, e não dá pra validar daqui**: nada disso rodou contra o Supabase
de verdade (este ambiente não alcança `supabase.co`). As migrations foram aceitas sem erro por
ela, mas **o comportamento na tela ainda não foi visto**. Quando a `v0.9.35` chegar pelo
auto-update, o que vale conferir em Auditoria é: se aparece o filtro **Ação** novo; se cadastrar
um cliente vira uma linha "Criou"; e se editar o preço de um item de OS aparece com o
antes/depois — esse último é o buraco que o item veio fechar.

#### O que falta da Etapa 4 (9 dos 12, na data deste marco)

> Desatualizado de propósito, é registro do dia: o `TR-08.1` (diagnóstico) saiu depois, na
> `v0.9.36`. A lista de verdade está no marco do fim do arquivo — hoje são **7**.

`TR-04.3` dado de RH · `TR-04.2` token da Focus NFe na Edge Function ·
`TR-12.1` backup próprio e testado · `TR-09.1` canal de teste · `TR-08.1` diagnóstico ·

`TR-04.6` endurecer o Electron · `TR-05.7` versão do esquema · `TR-12.2` contrato e papéis —
mais as **etapas 2 e 3 do `TR-04.1`**, que são o trabalho grande (as policies, tabela por tabela,
com teste que prova o bloqueio) e **precisam da decisão dela antes de começar**.

Três desses já apareciam soltos na fila dela por outro caminho: token da Focus NFe compartilhado,
botão de diagnóstico, e o risco de uma tag ruim atualizar todas as lojas de uma vez.

#### Estado do código

`main` **uma leva à frente da `v0.9.35`** — a matriz de RLS —, e o banco dela na `0054`. **Nada
esperando SQL, e nada esperando tag**: a matriz é ferramenta de teste, não muda o que roda na
loja, então a próxima tag só sai quando houver mudança de app pra levar junto.
`tsc`, lint e `npm run contraste` limpos; **482 testes** passando nos dois fusos (o número não
mudou: o que entrou nesta leva é SQL e ferramenta, e os testes disso são os três scripts que
rodam num Postgres local, fora do `npm test` — `testar-auditoria.sql`,
`testar-permissao-modulo.sql` e `npm run test:rls`).


O que depende dela continua sendo o de sempre, além das duas migrations: trocar as três
credenciais expostas, marcar o CI como obrigatório pra mesclar, e o cadastro mensal da alíquota no
portal da prefeitura.

#### Por onde uma sessão nova começa

**Perguntar qual item entra** — não há nada pendente de publicação nem de SQL. Se ela pedir
sugestão, o próximo natural é a **etapa 2 do `TR-04.1`** (aplicar as policies, tabela por tabela),
mas ela **precisa da decisão dela antes de começar**: vale apresentar a consequência — permissão
errada no cadastro de um operador deixa de esconder o menu e passa a abrir tela vazia, e RLS falha
em silêncio (item 15 da seção 6) — em vez de só começar. O que mudou de 13/09 pra cá é que a
ferramenta que prova o bloqueio já está pronta (a matriz de RLS), então a etapa 2 deixou de ser
"mexer na segurança no escuro": cada policy nova aparece como diff no `expectativas.csv`.


E vale perguntar se ela já viu a Auditoria funcionando depois do auto-update (a lista logo acima),
porque é a única parte desta leva que aparece na tela.
### Onde parou em 12/09/2026, fim do dia

**Estado: tudo desta leva está publicado na `v0.9.34`** e chega na loja pelo auto-update. Ela
mandou publicar no fim da sessão ("publica, deixe o projeto status efetivamente atualizado e até a
próxima sessão").

**Nenhuma migration** — o banco dela continua na `0052`, nada de SQL pendente. Ela perguntou isso
explicitamente antes de publicar, e a resposta foi conferida contra o repositório (`git diff` de
`supabase/` entre a `v0.9.33` e a `main`: vazio), não contra a memória. **Por isso esta foi a
primeira tag em quatro sem ordem a cumprir** — a `v0.9.30`, a `v0.9.32` e a `v0.9.33` todas
exigiram migration rodada ANTES.

#### O que essas três levas trouxeram

1. **A borda dos campos de formulário** (dívida de contraste do `TR-01.3`) — a decisão que estava
   adiada foi tomada por ela, olhando duas imagens, e aplicada: de 1,15:1 pra 3,13:1. Detalhe na
   seção "A borda dos campos de formulário", logo acima. **É a única das três que ela enxerga na
   tela** — as outras duas são rede de segurança.
2. **`TR-06.1` — testes de propriedade no rateio.** Mil casos gerados acharam **três defeitos
   reais** em duas funções que repartem dinheiro, um deles alcançável com uma OS plausível
   (R$ 900 de mão de obra + R$ 0,05 de peça em três formas de pagamento mandava −R$ 0,01 pra
   nota, que é rejeição na emissão). Item 60 da seção 6.
3. **`TR-06.3` + `TR-07.2` — o corpo da nota virou arquivo versionado, e os cinco formulários de
   dinheiro ganharam teste de tela.** Itens 61 e 62 da seção 6. São 42 testes de tela novos, e
   cada um foi conferido quebrando o código de propósito pra ver o teste ficar vermelho.

#### O que falta da Etapa 3 — e por que parou aqui

Os **4 itens restantes dependem dela**, não de mim, e é por isso que a leva terminou:

- **`TR-05.1` (constraints de valor) e `TR-05.2` (uma nota por OS por tipo)** — os dois precisam
  de migration **e** de uma consulta rodada antes no Supabase real dela, pra saber se já existe
  linha que a constraint recusaria. Se existir, é conversa com ela (o que fazer com o dado
  antigo), nunca decisão minha.
- **`TR-06.4` (fechamento de caixa do dia)** e **`TL-46.1` (travar comissão já paga)** — os dois
  pedem migration e tela nova.

**Um limite conhecido ficou de fora de propósito** (está no item 60): `valorLiquidoItem` fica
negativo quando o desconto do item é maior que a linha. Não foi posto um limite em zero, porque
isso faria a nota sair com um valor que não corresponde à OS — o conserto certo é justamente a
constraint do `TR-05.1`.

#### O que confirmar quando ela voltar

Nada disso bloqueia o uso do sistema, e nada dá pra testar daqui.

1. **Que a `v0.9.34` chegou** pelo auto-update, e que **a borda dos campos** ficou do jeito que ela
   escolheu na imagem — é a única mudança desta leva que aparece na tela. As outras duas são rede
   de segurança: só se percebe que existem no dia em que elas impedem um erro.
2. Continua valendo o que ficou pendente da `v0.9.33`: a **busca por código de barras** na lista
   de Produtos e os **três botões de WhatsApp** (principalmente se o telefone cadastrado abre a
   conversa certa, que é a única parte que depende de dado real dela).

#### Estado do código

`main` **em dia com a `v0.9.34`**, e o banco dela na `0052` — nada esperando tag nem SQL.
`tsc`, lint, `npm run contraste` e `npm run contraste:telas` limpos; **482 testes** passando nos
dois fusos (eram 407 de manhã, 369 em 11/09, 149 no começo de setembro).

O que depende dela continua sendo o de sempre, na lista de 11/09: trocar as três credenciais
expostas, marcar o CI como obrigatório pra mesclar, e o cadastro mensal da alíquota no portal da
prefeitura.

#### Por onde uma sessão nova começa

**Perguntar a ela qual item do `MELHORIAS.md` entra** — ela escolhe pelo código (ex: "faz o
TR-05.1"), e o guia **não** carrega sozinho (são 227 KB; abrir só quando ela citar um item ou
pedir sugestão).

Se ela pedir sugestão, as duas respostas honestas são:

- **Fechar a Etapa 3** (4 itens). Todos pedem migration, e os dois de constraint (`TR-05.1` e
  `TR-05.2`) pedem **antes** uma consulta rodada por ela no Supabase real, pra saber se já existe
  linha que a constraint recusaria — se existir, o que fazer com o dado antigo é decisão dela.
- **Começar a Etapa 4** (12 itens, nenhum feito), que o guia trata como **pré-requisito da
  venda**: *"nenhuma loja de terceiro deveria entrar antes desta etapa fechar"*. Isso pesa agora
  porque a fase 2 (as duas lojas do amigo do pai dela) está no horizonte, e três desses doze já
  apareciam soltos na fila dela por outro caminho — token da Focus NFe compartilhado, botão de
  diagnóstico, e o risco de uma tag ruim atualizar todas as lojas de uma vez.

### Onde parou em 12/09/2026, de manhã

**A Etapa 2 do guia de melhorias FECHOU.** Eram quatro itens e todos saíram nesta sessão:
`TL-11` (estoque mínimo), `TL-12` (campos fiscais explicados e bloco de pneu), `FN-03`
(WhatsApp) e `TR-01.3` (a auditoria de contraste que nunca tinha sido feita).

**Estado: tudo publicado na `v0.9.33`** — esta leva mais o `TL-08` de 11/09, que tinha ficado sem
tag. Ela rodou as migrations `0051` e `0052` **antes** da tag, que era a ordem obrigatória, e o
banco dela está na `0052`. Nada pendente de SQL, nada esperando publicação.

**O que ainda não foi visto rodando na loja**: nada desta leva. Vale conferir, quando o
auto-update chegar, a busca por código de barras na lista de Produtos (é a que mais muda o dia a
dia do balcão) e os três botões de WhatsApp — principalmente se o telefone cadastrado abre a
conversa certa, que é a única parte que depende de dado real dela.

#### O que cada item entregou

O detalhe está na seção 7 (Estoque → Produtos e cadastro de produto; e o bloco **WhatsApp**). Em
uma linha cada:

1. **`TL-11`** — a lista de Produtos passou a responder "o que preciso comprar?": estoque mínimo
   por peça, filtro "Precisa comprar", saldo com semântica (negativo é **erro de lançamento**, não
   pouco estoque), busca que aceita o leitor de código de barras e coluna de margem.
2. **`TL-12`** — cada campo fiscal ganhou um "?" dizendo **de onde tirar o valor**, o CST/CSOSN já
   nasce com o código que a loja mais usa, a unidade virou lista fechada, o preço abaixo do custo
   avisa, e apareceu o bloco de pneu (medida, índice de carga/velocidade, DOT).
3. **`FN-03`** — botões de WhatsApp em Contas a Receber ("Cobrar"), na lista de OS ("Avisar") e em
   Pedidos de compra ("Enviar"), com textos editáveis em Configurações.
4. **`TR-01.3`** — `npm run contraste:telas`: abre o app de verdade, percorre as 54 telas e mede a
   cor que a pessoa **realmente enxerga**. Entrou no CI, como job próprio.

#### O que a auditoria de contraste achou

Ela percorreu as 54 telas e reprovou **87 combinações**. Duas eram erro claro e **foram
corrigidas na hora**:

- **"Ver garantia" em 2,91:1** — letra branca sobre o rosa neon, o pior texto do app. A cor da
  marca não mudou (é o que o item proíbe); o que mudou foi a letra em cima dela, que passou a ser
  o fundo escuro do app. Sobe pra ~7:1.
- **"Remover"/mensagens de erro em vermelho ESCURO sobre card escuro** (4,13:1) — a sobra do tema
  claro antigo que o próprio status já suspeitava existir (itens 14 e 17 da seção 6) e que o
  `npm run contraste` não pega, porque fundo e letra ficam em elementos diferentes. Achada por
  **medição**, não por relato.

**As outras 85 não foram tocadas na hora, de propósito** — o item TR-01.3 é explícito em "corrija
só o que ela aprovar, não saia trocando cor da paleta sozinho", e todas mudam a cara do app. Elas
ficaram catalogadas por **causa** em `scripts/divida-de-contraste.mjs`, o que deixa a checagem
verde sem deixar entrar coisa nova:

| Decisão dela | Quantas | Pior caso | Mínimo | Situação |
|---|---|---|---|---|
| **Borda dos campos de formulário** | 51 | 1,15:1 | 3:1 | ✅ **resolvida — ela aprovou clarear** |
| **Botão roxo com letra branca** | 24 | 4,48:1 | 4,5:1 | continua em aberto |
| **Texto roxo usado como link** | 9 | 4,14:1 | 4,5:1 | continua em aberto |
| **Dias do mês vizinho no calendário** | 1 | 2,56:1 | 4,5:1 | deliberada, fica como está |

> ✅ **A borda dos campos foi resolvida (12/09/2026).** Era a mais importante das quatro e a única
> que dava pra sentir usando: a caixa que diz onde o campo começa e termina quase não existia.
> Ela escolheu, olhando um comparativo em imagem, a versão **discreta**. Detalhe em "A borda dos
> campos de formulário", logo abaixo. As três de baixo continuam esperando decisão — **não mexer
> nelas por conta própria**, e não refazer a auditoria pra "descobrir" de novo.

As duas do meio (botão roxo e texto roxo) estão a **dois centésimos** do mínimo — corrigir exige
mexer no roxo da marca, que o item proíbe, ou engrossar a letra dos botões. E a última é
deliberada: os dias do mês vizinho são apagados de propósito, pra não competirem com o mês
corrente; clarear resolve o número e estraga a ideia.

#### A borda dos campos de formulário (12/09/2026, decisão dela)

Era o achado mais forte da auditoria de contraste e a única das quatro dívidas que dá pra sentir
usando: a borda que delimita cada campo compunha **1,15:1** contra o vidro do card, quase
invisível — bem abaixo dos 3:1 que a WCAG pede pra contorno de componente.

**Como foi decidido**: não por número, por imagem. Foram geradas fotos da mesma tela (cadastro de
cliente) com a borda atual e duas versões mais claras, e ela escolheu a **discreta**. Vale repetir
o padrão em qualquer mudança de aparência — foi assim também no `TR-02.1` (ícone x palavra nas
ações da linha).

**O que mudou**: nasceu o token `--color-sakura-borda-campo` (branco a 35%) em `globals.css`, e
ele substituiu `border-sakura-gray/40` nos campos. Resultado medido: **3,13:1**, e a varredura das
54 telas não acha mais nenhum campo abaixo de 3:1 — a entrada `borda-de-campo` saiu da lista de
dívida.

**Três cuidados que valem saber, se alguém for mexer nisso de novo:**

- **É um token próprio, não o `sakura-gray`.** O mesmo cinza também desenha borda de tabela, de
  card e de `iframe`; mexer nele mudaria tudo isso junto. Foi conferido: as outras opacidades
  (`/20`, `/25`, `/30`) estão só em `<tr>`, `<div>` e `<iframe>` — **nenhum campo** —, então o
  `/40` era exatamente o conjunto certo.
- **Os 5 botões que usavam a mesma classe ficaram como estavam.** O que ela aprovou foi a borda
  dos *campos*; botão é outra decisão, e a dívida do botão roxo continua aberta logo acima.
- **Não dava pra resolver com uma regra em `@layer base`** — os campos carregam a borda como
  classe do Tailwind, que vence `@layer base` não importa a especificidade (é o item 51 da seção
  6). Por isso a troca foi na classe de cada campo, e não numa regra global.

**E faltou um pedaço na primeira passada**: as telas de **login, conexão e troca de senha** usam
outra classe (`border-white/10`, sobre `bg-black/40`) e continuaram reprovando em 1,22:1 depois da
troca. Só apareceram porque a varredura foi rodada de novo — leitura de código não teria pego.
É a lição do item 20 da seção 6 outra vez: ao corrigir "classe X está errada", conferir a lista
**completa** de lugares com o mesmo problema, não só os que apareceram primeiro.

#### Duas armadilhas que esta varredura revelou (e que valem além dela)

Estão nos itens **58 e 59** da seção 6, e as duas são sobre desconfiar do próprio instrumento:

- **A primeira versão relatou 183 reprovações, todas exatamente 1:1, e nenhuma era verdadeira** —
  a cor era lida com uma regex procurando `rgb(...)`, e o Tailwind v4 entrega `oklab(...)` em
  toda cor com opacidade. Número redondo demais, repetido demais, em lugares demais: desconfie do
  medidor antes da tela.
- **"Passou aqui" não vale nada quando o passe dependeu da rodada anterior** — com o servidor
  aquecido as 54 telas passavam; a frio, 36 falhavam. E, com a porta já ocupada por um servidor
  esquecido, a varredura media as telas servidas por um estranho sem avisar. As duas coisas foram
  corrigidas na ferramenta.

### Onde parou em 11/09/2026

**Estado: `v0.9.32` é a última tag publicada, o banco dela está na `0050` (nada de SQL pendente),
e a `main` está UMA leva à frente — o `TL-08`, mesclado e esperando ela decidir se publica (ver
"Leva 5", no fim desta seção).** Foi um dia longo, com cinco levas de trabalho — o resumo de cada
uma está logo abaixo, e o que sobrou pra ela (nada que bloqueie o uso do sistema) está no fim
desta seção.

> As cinco levas deste dia foram escolhidas por ela **pelo código do item**, no guia de melhorias
> (`MELHORIAS.md`, na raiz do repositório). Ele **não** carrega sozinho em sessão nova, de
> propósito: são 227 KB. Abrir só quando ela citar um item ou pedir sugestão de próximo passo —
> e, ao abrir, **conferir a premissa do item contra o código antes de aplicar** (ver item 53 da
> seção 6: um item do guia pediu uma mudança que teria PIORADO o que ele veio consertar).

#### Leva 1 — Etapa 1 do guia: a fundação que impede erro conhecido de voltar

Cinco itens curtos, todos de mecanismo e não de tela. O detalhe técnico está nos **itens 48, 49 e
50 da seção 6**; em uma linha cada:

- **CI** (`TR-07.1`) — `tsc`, lint, testes, contraste e "o SQL de instalação está em dia?" agora
  rodam em todo push e PR, em vez de dependerem de a sessão lembrar de rodar.
- **Trava de fuso** (`TR-05.5`) — regra de lint contra cortar o dia de um timestamp em UTC (o bug
  já tinha voltado quatro vezes), e a suíte rodando nos **dois fusos**.
- **Teste de arquitetura** (`TR-06.2`) — reprova conta de dinheiro escrita dentro de tela.
- **Tipos de coluna de dinheiro** (`TR-05.3`) — a auditoria achou **um bug de verdade**: o valor
  que ia pra Contas a Receber ao faturar vinha de uma soma sem arredondar, e a coluna guardava a
  cauda inteira (`1234.5600000000002`). Corrigido nos dois lados — migration `0048` + a conta de
  centavo num arquivo só (`schemas/dinheiro.ts`, que substituiu a mesma expressão copiada 12
  vezes em 7 arquivos).
- **Varredura de segredo** (`TR-04.7`) — `gitleaks` no CI, com 3 regras próprias porque as de
  fábrica deixavam passar justamente os formatos que este projeto manuseia.

**Do `TR-05.3` ficou de fora, por escolha:** passar **toda** conta intermediária de dinheiro pra
centavos inteiros, reescrevendo `faturamento.ts`, `metricasCaixa.ts` e `comissoes.ts`. É
refatoração grande no código financeiramente mais sensível do projeto, para um ganho hoje teórico
(essas funções já arredondam em cada borda, e desde a `0048` as colunas também). Só fazer se
aparecer uma divergência real, com o caso concreto na mão — e aí é uma sessão inteira, não um item
curto.

#### Leva 2 — os dois itens fiscais (`v0.9.29` e `v0.9.30`)

- **`TR-11.1` — "Ver DANFE"**: reabrir o PDF de uma nota já emitida, em Notas Fiscais e na aba
  Fechamento da OS. O cliente voltar e pedir a nota de novo é o pedido de balcão mais comum que
  existe, e antes o PDF só existia dentro da janela de emissão. Detalhe em "Notas Fiscais",
  seção 7. **Decisão que vale saber**: o PDF continua **não** sendo guardado aqui — o que a lei
  manda guardar 5 anos é o XML, e o PDF é pedido de volta pra Focus NFe pela `focus_nfe_ref`.
- **`TR-11.2` — aviso da alíquota da competência** no Início, com o passo a passo e o botão "Já
  cadastrei". Existe porque essa recusa da prefeitura é mensal, conhecida, com data certa, e já
  custou uma manhã. Detalhe em "Início", seção 7. Precisou da migration `0049`. **Decisão**: o
  aviso se cala sozinho quando uma NFS-e do mês é autorizada — se a prefeitura autorizou, a
  alíquota está cadastrada, e aviso que vira barulho é aviso que a pessoa aprende a ignorar.

#### Leva 3 — Etapa 2: acessibilidade, tipografia e o Início (`v0.9.31`)

Os três primeiros têm um fio comum: o app foi desenhado pra ser usado **só de teclado** no balcão,
e faltava a outra metade disso.

1. **`TR-02.2` — foco de teclado visível** em todo campo, botão e link. Antes não se desenhava
   foco nenhum, então dava pra apertar Enter sem saber em que campo se estava.
2. **`TR-02.3` — foco preso dentro do modal**, com `Esc`, devolução do foco e fundo inerte.
3. **`TR-02.1` — alvos de clique de 32px nas listas**, com o "Excluir" saindo da linha pra um menu
   de três pontinhos: excluir um cliente virou dois gestos, não um clique torto.
4. **`TR-01.1` — escala tipográfica** com nome por papel (`text-metrica`, `text-corpo`,
   `text-rotulo`…): 756 classes cruas em 89 arquivos. **Nada encolheu** — o menor texto do app
   subiu de 12 pra 13px.
5. **`TL-04` — cartões e calendário do Início**: "Contas a pagar vencendo" passou a olhar 15 dias
   corridos em vez do mês (era o ponto cego do dia 31); prejuízo virou vermelho com seta e sinal,
   inclusive no Caixa Diário; a seta "›" que não indicava nada virou a variação real contra a
   mesma fatia do mês anterior; cada cartão ganhou um "?" com a definição em uma frase; OS aberta
   e carro no pátio passaram a dizer "há 6 dias", em amarelo a partir de 3; e o calendário ganhou
   as setas ‹ › pra andar de mês.

O que cada um faz está em "Estado atual por módulo" (seção 7); o que se aprendeu, nos **itens 51 a
54 da seção 6**. Do `TL-04` ficou de fora, de propósito, só o item P2 (mais opções de cartão: OS
abertas, contas a receber vencidas, peças abaixo do mínimo).

**Uma pergunta que estava aberta e foi respondida**: "Editar" e "Inativar" viraram **ícone** nas
listas — ela viu a tela de Clientes renderizada e escolheu manter assim. Não reabrir.

#### Leva 4 — `TL-27`: categoria obrigatória no caixa (`v0.9.32`)

Item escolhido por ela. A prova do problema estava na própria tela de Saídas: "Por categoria —
Sem categoria: R$ 31.000,00", o mês inteiro de despesa num balde só. Como a categoria era
opcional, ninguém preenchia, e o relatório por categoria não existia na prática.

O que cada parte faz está em "Caixa Diário" (seção 7); o que se aprendeu, nos **itens 55 e 56 da
seção 6**. Em uma linha cada:

1. A categoria passou a ser **obrigatória no formulário manual** — só no formulário, não na
   coluna: o faturamento de OS continua entrando sem categoria, e o histórico não é recusado
   pelo banco.
2. **Migration `0050`** semeia a categoria "Outros" pros dois tipos, porque `categorias_caixa`
   nunca foi semeada e um banco novo tem zero categorias — sem isso a regra nova viraria tranca.
3. **O passado foi consertado junto**: faixa dizendo quantos lançamentos estão sem categoria e
   quanto somam, e um painel que categoriza em lote. Era a parte que o item insistia, e sem ela
   o relatório continuaria errado pra sempre.

**Publicada na `v0.9.32`**, e na ordem certa: ela rodou a migration `0050` no SQL Editor
("Success. No rows returned") e **só então** a tag saiu — mesma disciplina usada na `v0.9.30` com
a `0049`. O que ainda não foi visto é o recurso rodando na loja: se a faixa "N lançamentos antigos
estão sem categoria" aparece com o número certo, e se a categorização em lote grava de verdade
(o `update` fala com o Supabase, que este ambiente não alcança).

#### O que apareceu no caminho e NÃO foi mexido

Há vermelho escuro (`text-red-600`/`text-red-700`) usado **sobre card escuro** em vários lugares —
a coluna de saída do Caixa Diário e as mensagens de erro embaixo dos campos de formulário são os
dois casos claros. É sobra do tema claro antigo, e o `npm run contraste` não pega porque fundo e
letra ficam em elementos diferentes (mesma limitação do item 17 da seção 6). São **92 ocorrências**
de vermelho escuro no app, quase todas legítimas (`bg-red-50` + `text-red-700` juntos) — separar as
legítimas das ilegíveis é exatamente o trabalho do `TR-01.3`, e meio-arrumar seria pior que não
mexer.

#### O que depende dela agora

**Nada está bloqueado esperando decisão dela.** O que sobra é confirmação de uso real e tarefa
fora do código.

**Confirmar em uso real** (nada disso dá pra testar daqui):

0. **A categoria obrigatória no caixa (`v0.9.32`)** — lançar uma saída e ver que o campo Categoria
   agora é exigido, e que a faixa "N lançamentos antigos estão sem categoria, somando R$ X" aparece
   com o número certo nas abas Entradas/Saídas. **O teste que mais importa é o botão "Categorizar
   agora"**: escolher as categorias (ou usar "aplicar a todos que estão em branco") e salvar — é a
   única parte que fala com o Supabase de verdade, e por isso a única que não deu pra provar daqui.
   Depois de salvar, o bloco "Por categoria" deve parar de ter a linha "Sem categoria".

1. **Que a `v0.9.31` chegou na loja** pelo auto-update, e que o sistema continua se comportando —
   é a leva que mais mexeu na aparência de todas as telas (tamanho de letra, ações das listas,
   foco). Se algo parecer estranho, `%APPDATA%\Sakura System - AutoCenter Edition\erros.log` é o
   primeiro lugar pra olhar (item 39 da seção 6).
2. **O "Ver DANFE" numa nota de verdade** — a busca do PDF fala com a Focus NFe, e este ambiente
   não alcança rede externa. Se der errado, a mensagem na tela já diz o motivo; o primeiro lugar a
   conferir é se o token da Focus NFe está preenchido em Configurações → Dados fiscais.
3. **O aviso da alíquota no Início — ele APARECE agora, e isso está certo.** A coluna
   `competencia_aliquota_confirmada` nasce vazia, e o "se cala sozinho depois de uma NFS-e
   autorizada" só vale pras notas emitidas **daqui pra frente** — as de setembro saíram antes desse
   código existir. O caminho é clicar em **"Já cadastrei"** uma vez (é verdade: ela cadastrou em
   01/09) e ele some até 1º de outubro. **Não tratar como bug** — é só o primeiro mês, que começa
   sem histórico.

**Tarefas fora do código**, nenhuma some sozinha e nenhuma bloqueia o uso do sistema:

4. **Marcar o CI como obrigatório pra mesclar** (Settings → Branches), agora que ele já foi visto
   verde várias vezes — item 48 da seção 6.
5. **Trocar as três credenciais expostas** (CSC da SEFAZ, token do portal Giap, senha do portal da
   prefeitura). A varredura automática **não** substitui isso: ela pega chave de API com formato
   reconhecível, e nenhuma das três tem formato — item 50 da seção 6 explica por quê. Cada dia que
   passa é um dia a mais com as três no histórico público.
6. **Todo mês: cadastrar a alíquota da competência no portal da prefeitura** antes da primeira
   NFS-e do mês (item 1 da seção 8) — que agora, pelo menos, o sistema lembra.

#### O que ela já pediu pra guardar pra "em breve" (não retomar sozinho)

A lista continua a mesma de 03/09 (ver "O que depende dela pra andar", mais acima): crédito da
Anthropic zerado travando o "Importar por foto"; se cancelar nota deveria estornar estoque/Caixa
(pergunta de design nunca respondida); token da Focus NFe compartilhado; botão de diagnóstico pra
suporte; e o risco de uma tag ruim atualizar todas as lojas de uma vez.

#### Leva 5 — `TL-08`: cadastrar cliente e veículo sem sair da OS

Item escolhido por ela, depois das quatro levas acima. O que ele resolve e como está desenhado
ficam em "Ordens de Serviço" (seção 7); a lição, no item 57 da seção 6. Em uma linha cada:

1. **"+ Cadastrar cliente novo" / "+ Cadastrar veículo novo"** dentro do próprio campo, com um
   modal enxuto que devolve o registro já escolhido — o gesto mais comum do balcão deixou de
   exigir abandonar a OS pela metade.
2. Veículo preenchido sozinho quando o cliente só tem um; **KM da última passagem** como
   referência (com "usar") e aviso quando o digitado é menor; **total fixo no rodapé**; **saldo
   em estoque** e **peça sem preço de custo** avisados na hora do lançamento.
3. **Nada disso tranca o salvar** — são todos aviso. Sem migration.

**Não publicada em tag.** Está mesclada na `main` e é a única coisa à frente da `v0.9.32`.
**Quando ela retomar, o primeiro passo é perguntar se é pra publicar** — e, se sim, seguir
"Gerar o instalador Windows e publicar uma versão nova" (seção 9): subir o `package.json` pra
`0.9.33`, PR, merge, `workflow_dispatch` com `ref: "main"`. Não publicar sozinho.

#### O que falta do guia inteiro (levantado em 11/09/2026 — não precisa refazer a conta)

Ela perguntou "o que falta do guia?" e a resposta foi levantada do `MELHORIAS.md` de verdade, item
por item. **Fica registrado aqui pra uma sessão nova não gastar meia hora redescobrindo** — e vale
até alguém mexer no guia ou fechar mais itens.

O guia tem **130 itens**. O roteiro da Parte 4 escolhe **51** deles e organiza em 5 etapas; os
outros **79 ficam fora do roteiro** — e isso não é descuido: são todos P1/P2 e melhoria de tela a
tela. **Nenhum P0 do guia ficou fora do roteiro.**

| Etapa | Feito | Falta |
|---|---|---|
| **1** — fundação que impede erro conhecido de voltar | 5 de 5 ✅ | — |
| **2** — o que dói hoje, no balcão | 13 de 13 ✅ | — |
| **3** — confiança nos números | 3 de 7 | **4** (ver 12/09 no fim do arquivo) |
| **4** — antes da segunda empresa | 7 de 12 | **5** (ver o marco mais recente, no fim do arquivo) |

| **5** — escala e produto | 0 de 15 | **15** |

**A Etapa 2 fechou em 12/09/2026** com os quatro que faltavam: `TR-01.3` (a auditoria de
contraste que nunca tinha sido feita), `TL-11` + `TL-12` (estoque mínimo e campos fiscais
explicados, migrations `0051`) e `FN-03` (WhatsApp, migration `0052`). O `TL-27` e o `TL-08`
tinham saído da lista em 11/09/2026.

**Duas sobras conhecidas, deixadas de fora de propósito** (nenhuma é P0): do `TL-11`, a foto da
peça; do `TL-12`, a foto e a ficha de aplicação. As duas pedem armazenamento de imagem, que é
assunto maior que o item.

**Duas etapas mudam de peso por causa da venda, e vale dizer em voz alta:**

- **Etapa 3 (7 itens, 3 feitos)** é a que o guia descreve como *"fecha a área com o pior
  histórico do projeto"* — e ele tem razão: já foram **cinco** divergências de conta de dinheiro
  aqui (itens 35, 40, 44 e 49 da seção 6). Saíram em 12/09/2026 os três que não dependiam de rodar
  SQL: testes de propriedade no rateio (`TR-06.1`), teste-ouro do corpo da nota (`TR-06.3`) e
  teste de tela nos cinco formulários de dinheiro (`TR-07.2`). **Os 4 que faltam dependem dela**:
  constraints no banco (inclusive "uma nota por OS por tipo", que hoje só é protegido pela tela —
  ver item 3 de "O que ainda está frágil na parte fiscal"), fechamento de caixa do dia e travar
  comissão já paga — todos pedem migration, e os dois de constraint pedem antes uma consulta no
  Supabase real dela.
- **Etapa 4 (12 itens, 5 feitos desde então) é tratada pelo guia como pré-requisito da venda**:
  *"Nenhuma loja de terceiro deveria entrar antes desta etapa fechar. Não por perfeccionismo:
  porque cada item aqui é uma coisa que, dando errado com dado de outra empresa, não tem conserto
  pela tela."* São RLS por módulo, backup de verdade, canal de teste antes de atualizar todas as
  lojas de uma vez, como voltar uma versão, botão de diagnóstico, o token da Focus NFe fora do
  alcance do operador, e contrato/papéis de LGPD. **Isso importa agora**: a fase 2 (as duas lojas
  do amigo do pai dela, seção 1) está no horizonte, e três desses doze já apareciam soltos na fila
  dela por outros caminhos (token compartilhado, diagnóstico, risco de uma tag ruim atualizar todo
  mundo).

**Da Etapa 0 do guia, uma coisa continua aberta**: as duas primeiras (publicar a `v0.9.29`,
mesclar a branch do gerador de telas) foram resolvidas em 11/09/2026; **trocar as três credenciais
expostas** no histórico público não — não é código, é uma tarde dela (ver item 5 de "O que depende
dela agora").

**Como esse levantamento foi feito**, se precisar refazer depois de fechar mais itens: varrer os
títulos ``### `CODIGO` `` do `MELHORIAS.md` (as famílias são `TR-`, `TL-` e `FN-`; a prioridade
vem no próprio título, `**P0 · E2**`, exceto nas telas, que trazem a prioridade em cada sub-item)
e cruzar com a lista de feitos. Duas telas contam como feitas **com uma sobra**: `TL-04` e `TL-08`
tiveram o sub-item P2 deixado de fora de propósito (mais opções de cartão no Início; "repetir a
última OS deste veículo").

**Ela escolhe o próximo pelo código do item — não sair fazendo a lista inteira.**

#### Estado do código

`main` **uma leva à frente da `v0.9.32`** (o `TL-08`, esperando ela decidir se publica) e sem SQL
pendente — o banco dela está na `0050`. `tsc`, lint e `npm run contraste` limpos; **369 testes**
passando nos dois fusos (eram 149 no começo de setembro). As 54 telas do catálogo
(`site/ferramentas/gerar-catalogo-telas.mjs`) geradas de novo sem nenhuma falha — vale rodar esse
gerador depois de qualquer mexida grande de tela, é o único teste de tela que existe hoje, e ele
já quebrou em silêncio uma vez (item 53 da seção 6).


### Onde parou em 10/09/2026

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

### Onde parou em 08-09/09/2026

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

### Onde parou em 03/09/2026

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

### Onde parou em 02/09/2026

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

