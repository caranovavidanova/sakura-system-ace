# Sakura System — AutoCenter Edition — Índice do projeto

> ## ⛔ NENHUMA CREDENCIAL, E NADA PESSOAL OU DE PREÇO, NESTE REPOSITÓRIO
>
> O repositório é **público** (precisa ser, pro auto-update funcionar — `docs/licoes.md`, item 21).
> Tudo que está aqui qualquer pessoa lê, e apagar depois não resolve: fica no histórico do Git.
> - **Senha, token, chave, CSC, certificado**: o lugar é o painel do próprio serviço. O CSC da SEFAZ,
>   o token do Giap e a senha do portal da prefeitura já vazaram por aqui e precisam ser trocados.
> - **Assuntos da empresa e pessoais** (sócios e porcentagens, abertura do CNPJ, preço, custo por
>   loja, margem, plano de equipe): vão no repositório **privado** `caranovavidanova/sakura-corp`.
>   Uma loja cliente não pode ler a margem dela aqui. Não é carregado sozinho: quando o assunto for
>   empresa, sócios ou preço, adicionar esse repositório à sessão (`add_repo`) e ler lá.

## Como esta memória funciona (reorganizada em 27/09/2026)

Este arquivo é **o índice**: carrega sozinho em toda sessão (`CLAUDE.md` importa ele), então precisa
continuar **pequeno** (~20 KB). Antes ele tinha 650 KB e gastava ~180 mil tokens só pra abrir uma
sessão. O resto mora em `docs/` e **só é aberto quando o assunto pede**:

| Arquivo | O que tem | Abrir quando |
|---|---|---|
| `docs/decisoes.md` | o que é o projeto, plano de expansão (fases 1-3), identidade visual, **tabela de decisões técnicas** (antiga seção 2 e 3) | antes de qualquer decisão estrutural |
| `docs/estrutura.md` | pastas, padrão de código, **padrão de formulário** (react-hook-form + zod) (antiga seção 4) | antes de criar arquivo/módulo novo |
| `docs/banco.md` | as migrations `0001`-`0064`, cada tabela, multi-loja, RLS (antiga seção 5) | antes de mexer em banco/migration |
| `docs/licoes.md` | as dívidas técnicas e os 77 **padrões de bug** já vividos (antiga seção 6) | ao investigar bug, e antes de mexer em área sensível |
| `docs/modulos.md` | estado de cada tela/módulo hoje (antiga seção 7) | antes de mexer num módulo |
| `docs/pendencias-e-futuro.md` | o que não existe, parte fiscal (playbook por loja nova), linha do tempo (antiga seção 8) | ao planejar próximo passo |
| `docs/operacao.md` | rodar, instalar empresa nova, **publicar/liberar versão**, backup, atualizar bancos, voltar versão (antigas seções 9 e 11) | ao publicar, rodar migration ou instalar loja |
| `docs/historico.md` | estado do Git e todos os marcos "onde parou" antigos (antiga seção 10) | quase nunca |
| `docs/comparativo-anexar.md` | o que o concorrente Anexar anuncia × o que temos, e o que falta (29/09/2026) | ao planejar funcionalidade nova ou falar de venda |
| `MELHORIAS.md` | o guia de melhorias (TR-/TL-/FN-), 227 KB | só quando ela citar um item |

**Referências antigas continuam valendo**: código e documentos citam "item 33 da seção 6" — a seção 6
é `docs/licoes.md`, a 5 é `docs/banco.md`, a 7 é `docs/modulos.md`, a 8 é `docs/pendencias-e-futuro.md`,
a 9 é `docs/operacao.md`. A numeração dos itens não mudou.

**Como manter**: ao fim de cada sessão, **substituir** o bloco "Onde parou" lá embaixo pelo novo e
mover o antigo pro topo dos marcos em `docs/historico.md`. Detalhe de módulo, migration ou bug novo
vai pro arquivo de `docs/` certo, nunca aqui. Se este índice passar de ~30 KB, é hora de enxugar.

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
- Nome: **Sofia** (conta do GitHub `caranovavidanova`). E-mail: caranovavidanova@gmail.com.
  **Nunca presumir o nome dela por outra fonte**: em 29/09 uma sessão chamou ela de "Carol" por
  engano, porque esse nome apareceu no plano que ela mandou.
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
- **Conversa de alinhamento: ela revisa antes de eu documentar** (27/09/2026). Em conversa de
  planejamento, ela prefere que eu junte no fim o que foi decidido, o que está aberto e o que vou
  anotar, e ela confirma antes. O que ela mandar "deixar na gaveta" é anotado como adiado, não
  como decidido.
- **Sempre que eu aprender uma preferência de trabalho nova**, documentar aqui — não só nas
  decisões técnicas da seção 3, mas qualquer coisa sobre *como* ela quer que eu trabalhe. Sessões
  futuras não têm memória da conversa, só deste arquivo.
- **Este arquivo carrega sozinho em toda sessão nova** — `CLAUDE.md` importa `AGENTS.md` e
  `PROJETO_STATUS.md` (`@AGENTS.md` / `@PROJETO_STATUS.md`), então não é preciso a usuária colar
  ou anexar este arquivo de novo pra eu ter esse contexto. Basta abrir uma sessão nova apontando
  pro repositório `sakura-corp/sakura-system-ace` (era `caranovavidanova/sakura-system-ace` até
  29/09/2026; o endereço antigo redireciona).


## 2. O projeto em um parágrafo

**Sakura Corp** é a empresa (ainda só um nome) por trás do **Sakura System**, uma linha de sistemas
de gestão por nicho. O primeiro é o **SSACE — Sakura System AutoCenter Edition**, pra
autocenters/borracharias: app desktop Windows (Electron + React + Vite + TypeScript + Tailwind v4),
dados no Supabase (um projeto por empresa cliente; uma empresa pode ter várias lojas). Rodando de
verdade na borracharia do pai dela ("Pneus Amigão", Araraquara), com NFC-e e NFS-e em produção via
Focus NFe. Fase atual: preparar a venda pra outras empresas (fase 2). Detalhe em `docs/decisoes.md`.

## 3. Regras que valem em toda sessão (o resto está em `docs/decisoes.md` e `docs/estrutura.md`)

- **Git**: branch de trabalho → PR → **mesclar direto na `main`**, sem esperar aprovação (até existir
  uma v1.0). Depois, dizer a ela em português simples o que mudou e o que ela precisa fazer.
- **Migration nova**: idempotente (dropar o nome **final** do objeto antes de criar); termina com
  `insert into schema_versao (versao) values (N) on conflict do nothing;`; sobe
  `VERSAO_ESQUEMA_ESPERADA`; rodar `npm run gerar-instalacao`; ganha um
  `supabase/scripts/testar-*.sql` (termina em `TODAS AS CHECAGENS PASSARAM`) e entra na matriz de
  RLS se mexer em policy. Nunca tirar/renomear coluna em uso na mesma versão que passa a usar a nova.
- **Ordem de subir**: migration **antes** da versão, pelo botão "Atualizar o banco de todas as
  empresas" (ensaiar, depois aplicar). Exceção: migration que declara
  `-- versao-minima-do-programa: X`. Passo a passo em `docs/operacao.md`.
- **Publicar ≠ liberar**: versão nasce no canal de teste; só chega nas lojas pelo workflow
  "Liberar versão para todas as lojas". Não publicar nem liberar sem ela pedir.
- **Antes de dizer qual é a última versão**, conferir as releases reais no GitHub — este arquivo já
  errou isso.
- **Código**: erro do Supabase → `mensagemDeErro()`; nunca `window.prompt()`; fallback de
  `import.meta.env` com `||`, nunca `??`; conta de dinheiro nunca dentro de tela (`src/schemas/`);
  dia de calendário com `hojeLocal()`/`diaLocal()`, nunca `toISOString().slice`.
- **Validar antes de mesclar**: `npm run typecheck`/`lint`/`test:fusos`/`contraste`; tela mexida →
  olhar renderizada; mudança de Electron → `npm run test:electron`. Teste só prova o que se viu
  ele reprovar (quebrar de propósito).
- **Validação incerta é aviso, nunca tranca** (`docs/licoes.md`, item 33).
- **Endereço**: `sakura-corp/sakura-system-ace` desde 29/09/2026. **Nunca criar um repositório
  `sakura-system-ace` na conta pessoal dela** (quebra o redirecionamento do endereço antigo).

## 4. Onde parou (o marco mais recente — os anteriores estão em `docs/historico.md`)



### 29/09/2026, continuação: o repositório foi pra organização `sakura-corp`, e o plano do painel

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
4. **Convidar o Gustavo.**

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
