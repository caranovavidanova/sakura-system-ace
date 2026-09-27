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
  pro repositório `caranovavidanova/sakura-system-ace`.


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

## 4. Onde parou (o marco mais recente — os anteriores estão em `docs/historico.md`)


### 27/09/2026, à noite: como a equipe vai trabalhar (temas 2 e 3), domínio, e-mail e custos da empresa

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

1. **Perguntar como foram os testes de segunda (28/09) na loja**. A lista (venda de balcão,
   computadores da empresa, canal de teste, Fechamento do Caixa, porteiro da Focus NFe, ficha do
   veículo) está no marco "27/09/2026, de manhã", em `docs/historico.md`. Bug da loja é pra
   fazer na hora.
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
