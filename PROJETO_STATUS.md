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

### 27/09/2026, manhã: ficha do veículo

**Saiu a ficha do veículo** (item `FN-04` do guia, P1), num domingo. Ela disse "vamos continuar"
e avisou: **"os testes faço todos no PC da loja na segunda-feira"** (28/09/2026). Entre as
opções (ficha do veículo, sugestão de compra, clientes que sumiram, permissão nas OS), escolheu a
recomendada.

**Estado: mesclada na `main`, SEM tag e SEM migration.** O banco continua na `0064` e a última
versão publicada e liberada continua sendo a `v0.9.45`. **Não publicar sem ela pedir** — se ela
quiser a ficha no teste de segunda, é publicar a `0.9.46` e liberar (o computador da loja ainda
está no canal normal, então só publicar não chega lá).

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
6. **A ficha do veículo** — só se ela mandar publicar antes.

E, com data: **1º/10/2026**, a alíquota de 10/2026 no portal da prefeitura.

#### Estado do código

`main` **uma leva à frente da `v0.9.45`** (a ficha do veículo); banco na **`0064`**. `tsc`, lint
e contraste limpos; **801 testes** nos dois fusos; matriz de RLS em 760 células (não mudou).

#### Por onde a próxima sessão começa

1. Perguntar como foram os testes de segunda na loja (a lista acima) e resolver o que aparecer —
   bug relatado da loja é pra fazer na hora.
2. Perguntar se é pra publicar a ficha do veículo (`0.9.46`), se ainda não foi.
3. Se ela quiser seguir o guia: o **lembrete de revisão** (`FN-06`) é o passo natural depois da
   ficha — a rodagem média já existe (`rodagemEstimada`). Pede migration e uma decisão dela
   (o "não avisar este cliente" e o tom das mensagens). Os outros sem migration: **sugestão de
   compra** (`FN-07`) e **clientes que sumiram** (`FN-11`).


### 27/09/2026, à tarde: organização pra venda e pro trabalho em equipe

Conversa de alinhamento, sem código de app. Ela vai abrir a empresa e chamar 3 amigos pra
vibecodar junto. O que ficou:
- **Assuntos da empresa** (sócios, porcentagens, abertura do CNPJ, contador, contrato com as lojas,
  preço) passaram a morar no repositório **privado** `caranovavidanova/sakura-corp`. Esta sessão não
  tinha permissão pra criar repositório — **ela cria** (github.com/new, privado, com README) e a
  próxima sessão adiciona (`add_repo`) e sobe as anotações. Até lá, o que foi conversado está só no
  chat daquela sessão e no histórico do Git deste arquivo (os trechos de preço tirados daqui).
- **Contrato com as lojas: de adesão** (termos aceitos pela loja, só o nome da empresa aparece).
  Ideia anotada, não pedida: o SSACE mostrar os termos no primeiro login do admin e gravar o aceite.
- **Este arquivo foi dividido** no índice + `docs/` (ver a tabela acima).
- **Fechar o código do SSACE** (repositório privado + um público só com instaladores): **pendente,
  decisão dela pra depois** — custo de minutos de CI e uma sessão de trabalho.
- **Próximos temas combinados** (ela quer ir aos poucos): 2) como codar em grupo; 3) a "linha de
  produção" de atualizações e projetos novos.
