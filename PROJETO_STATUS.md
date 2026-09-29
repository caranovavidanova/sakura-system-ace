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


### 28/09/2026: testes na loja e preparação do painel da equipe

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
