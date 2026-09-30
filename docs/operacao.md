# Operação: rodar, instalar, publicar, backup

> Parte da memória do projeto. O índice é o `PROJETO_STATUS.md` (carrega sozinho em toda sessão);
> este arquivo só é aberto quando o assunto pede. Os números de seção e de item citados aqui
> ("item 33 da seção 6") continuam valendo: a seção 6 é `docs/licoes.md`, a 5 é `docs/banco.md`,
> a 7 é `docs/modulos.md`, a 8 é `docs/pendencias-e-futuro.md` e a 9 é `docs/operacao.md`.

## 9. Como rodar / configurar (resumo)

```bash
git clone https://github.com/sakura-corp/sakura-system-ace.git
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
Contas a Pagar, rodada e confirmada por ela numa sessão anterior). **`0044`** (campos novos em
`configuracoes_fiscais_loja` pra NFS-e — código do município, item da lista de serviço, alíquota
ISS, código tributário do município) e **`0045`** (`clientes.codigo_municipio`, pro tomador da
NFS-e) **também já foram rodadas e confirmadas no Supabase real dela**.

**Estado em 26/09/2026, fim da noite: `0001` a `0064` estão aplicadas no Supabase real dela.**
A `0064` (venda de balcão) entrou pelo botão — ensaio ("✅ passaria") e depois aplicação,
`0063` → `0064` —, **antes** da `v0.9.45`, na ordem de sempre. Nada pendente de SQL.

**Estado em 26/09/2026, noite: `0001` a `0063` estão aplicadas no Supabase real dela.** A `0063`
(computadores) entrou pelo botão — ensaio e depois aplicação, `0062` → `0063` —, **antes** da
`v0.9.44`, na ordem de sempre. Foi também a primeira rodada do botão no `ubuntu-24.04` fixado:
o `psql` 17 instalou normal. Nada pendente de SQL.

**Estado até 26/09/2026, tarde: `0001` a `0062` estão aplicadas no Supabase real dela** — a `0061` (contas só com
o módulo) e a `0062` (Caixa só com o módulo) entraram em 26/09/2026 pelo botão, **depois** da
`v0.9.43` liberada (a `0062` inverte a ordem de sempre — ver a entrada dela na seção 5). Nada
pendente de SQL. As três anteriores
(`0058` fechamento de caixa, `0059` comissão paga, `0060` travas de dado) foram as primeiras a
entrar **pelo botão "Atualizar o banco de todas as empresas"** (seção 9), em 25/09/2026 — ensaio
e depois aplicação, sem colar nada no SQL Editor. É esse o jeito de rodar migration daqui pra
frente.

**Estado até a `0057`:** A `0057` (o cofre do token da Focus NFe, item TR-04.2) foi rodada por ela em 25/09/2026, e
a Edge Function `focus-nfe` publicada no mesmo dia — as duas **antes** da tag `v0.9.41`, que era a
ordem obrigatória (a versão nova só emite nota pelo porteiro).
**Pegadinha que apareceu rodando a `0057`**: a primeira colagem chegou **cortada na linha 100**
(de 196) e o Postgres recusou com `unterminated dollar-quoted string` — nada foi aplicado, porque
erro de sintaxe barra o comando inteiro. A causa foi copiar da pré-visualização do arquivo na
conversa, que mostra só o começo. **Pra migration ou Edge Function longa, mandar o link
`raw.githubusercontent.com/...` e pedir pra ela conferir a última linha antes do Run.**
Histórico: A `0056` (dado de RH só com o módulo, item TR-04.3) foi rodada por ela em 25/09/2026,
**antes** da tag `v0.9.39` — a ordem que essa migration exigia, porque a tela de OS passa a ler
uma view que só existe depois dela. (O contrário, a migration antes da versão nova, era seguro:
o app velho continuava funcionando igual.)
Histórico: A `0055` (`schema_versao`, item TR-05.7) foi rodada por ela em 15/09/2026, **antes** da tag
`v0.9.37`. Diferente das anteriores, esta não seria armadilha se a ordem invertesse: com o app
novo e o SQL não rodado, o próprio app mostra a faixa dizendo que falta rodar a `0055` — que é
justamente o que a migration existe pra fazer. Ainda assim, o certo continua sendo o SQL primeiro.

A `0053` (auditoria completa) e a `0054` (função de permissão por módulo) foram rodadas por
ela em 13/09/2026, **antes** da tag `v0.9.35` — a ordem que a `0053` exigia, e a mesma disciplina
já cumprida com a `0049`/`v0.9.30`, a `0050`/`v0.9.32` e a `0051`+`0052`/`v0.9.33`. As duas últimas (`0051`, estoque mínimo e bloco de pneu; `0052`, as tabelas do WhatsApp)
foram rodadas por ela em 12/09/2026, **antes** da tag `v0.9.33` — a ordem que elas exigiam, a
mesma disciplina já cumprida com a `0049`/`v0.9.30` e a `0050`/`v0.9.32`.
Histórico das anteriores: a `0048`
(precisão das colunas de valor) e a `0049` (lembrete da alíquota da competência) foram coladas por
ela no SQL Editor em 11/09/2026, as duas com "Success. No rows returned", e a `0049` **antes** da
tag `v0.9.30`, que é a ordem que essa migration exigia (sem as colunas dela, "Salvar dados
fiscais" daria erro de coluna inexistente no computador da loja).
**A `0050`** (semeia a categoria "Outros" de caixa, pro item TL-27) **foi rodada em 11/09/2026**,
com "Success. No rows returned", **antes** da tag `v0.9.32` — que era a ordem obrigatória dela.
**Sobre `0047` e anteriores:** `0046` (`focus_nfe_ref` em
`notas_fiscais_arquivos`, pro botão "Cancelar nota") e `0047` (`codigo_cnae` em
`configuracoes_fiscais_loja`, pra NFS-e) foram criadas e já rodadas na mesma sessão — confirmado
funcionando (a NFS-e número 10/11 só autorizou depois da `0047` e do Código CNAE preenchido).

### Montar um projeto Supabase do zero (empresa nova / outro computador)

**O passo a passo completo está em `supabase/instalacao/INSTALAR-LOJA-NOVA.md`** — é o checklist
que a usuária segue de verdade ao vender pra um cliente novo. Não reescrever esse roteiro aqui;
esta seção só registra o essencial pra uma sessão entender o mecanismo.

**Banco**: colar **um arquivo só**, `supabase/instalacao/instalacao-completa.sql`, no SQL Editor
(New query → Run). Ele é gerado a partir das migrations por `npm run gerar-instalacao`
(`scripts/gerar-instalacao-completa.mjs`) e um teste do `npm test` reprova se estiver
desatualizado — ou seja, **criar uma migration nova sem regerar o arquivo quebra o `npm test`**,
de propósito.

Antes existia aqui a instrução de colar os ~47 arquivos de `supabase/migrations/` um por um, na
ordem. Isso foi abandonado porque pular um arquivo ou trocar a ordem **não dá erro na hora** — só
quebra depois, na tela do app, como um erro estranho difícil de ligar à instalação.

**Isso é só a parte do banco.** Uma empresa nova (não uma loja nova dentro da mesma empresa) ainda
precisa de: os dois passos manuais de Auth logo abaixo, o primeiro operador admin **com o vínculo
em `operador_lojas`** (ver item 37 da seção 6 — é o erro mais fácil de cometer nessa instalação),
e — no computador dela — digitar a URL/chave desse projeto na tela de conexão que aparece na
primeira abertura (ver "Conexão com o banco (multi-empresa)" na seção 7). Se a loja também for
emitir nota fiscal, some a isso o **playbook de habilitação fiscal** do item 1 da seção 8, que é a
parte demorada e depende de SEFAZ/prefeitura/contabilidade do cliente.

**Pra validar migration nova num Postgres local** (o ambiente de desenvolvimento tem um):
`supabase/scripts/stub-supabase-local.sql` cria os schemas `auth`/`storage` e as permissões que o
Supabase dá sozinho — inclusive as necessárias pra simular login e testar RLS de verdade
(`set local role authenticated` + `set local "request.jwt.claim.sub"`, dentro de uma transação,
senão o `set local` não pega e o teste roda como superusuário, que ignora RLS). Existe porque toda
sessão que precisava validar uma migration recriava esses mesmos stubs do zero.

**E toda migration que mexa em policy tem que passar na matriz de RLS** (item `TR-07.3`), que faz
esse mesmo trabalho por conta própria e confere 760 combinações de tabela × comando × papel:

```bash
service postgresql start
sudo -u postgres psql -c "alter user postgres password 'postgres'"
npm run test:rls
```

Ela monta um banco descartável do zero e o apaga no fim; no CI roda sozinha, num job com Postgres
de serviço. **No Windows não roda** (precisa de Postgres e `psql` instalados) — não é problema, é
suíte de CI. Ver `supabase/testes-rls/README.md`.

**E a migration que promete alguma coisa ganha um `supabase/scripts/testar-*.sql`**, que roda
sozinho no CI desde 25/09/2026 (`npm run test:sql`, mesmo Postgres). Duas regras pro script novo:
terminar com `raise notice 'TODAS AS CHECAGENS PASSARAM'` (sem a frase, o runner reprova — teste
que não tem como dizer que passou não prova nada) e testar as **duas metades**, o que a migration
recusa e o que ela ainda precisa deixar passar. Até então esses scripts só rodavam à mão, pela
sessão que escreveu a migration — uma migration nova que quebrasse a promessa de uma antiga
passaria calada. Conferido plantando uma policy de leitura no cofre da Focus NFe: o teste do
porteiro ficou vermelho, e os outros seis, verdes.


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

### Ativar o porteiro da Focus NFe (item TR-04.2)

O token da Focus NFe deixa de ir pro computador de cada operador: passa a morar num cofre do
banco, e quem usa é um "porteiro" no Supabase. **São três passos, e a ordem importa** — se a
versão nova do programa chegar na loja antes dos dois primeiros, a emissão de nota para (com uma
mensagem dizendo o que falta, mas para).

1. **Rodar a migration** (2 minutos): SQL Editor do Supabase → New query → colar todo o conteúdo
   de `supabase/migrations/0057_cofre_token_focus_nfe.sql` → **Run**. Tem que aparecer
   "Success. No rows returned". **Ela copia sozinha o token que já está cadastrado** — ninguém
   precisa colar de novo.
2. **Publicar o porteiro** (3 minutos): **Edge Functions** → **Deploy a new function** →
   **Via Editor** → digitar `focus-nfe` **no campo do nome ANTES de clicar em Deploy** (a mesma
   pegadinha das outras duas: renomear depois não muda o endereço) → apagar o exemplo, colar todo
   o conteúdo de `supabase/functions/focus-nfe/index.ts` → **Deploy function**.
   **Não precisa de secret nenhum** — o token vem do cofre, e as chaves do Supabase ele recebe
   sozinho.
3. **Só depois disso, a versão nova** (`v0.9.41`). Como nenhum computador está marcado como Teste
   ainda, ela precisa ser **publicada e liberada** — ou, melhor, marcar antes o computador dela e
   o da Pneus Amigão como Teste (Configurações → "Atualizações deste computador").

**Como conferir que deu certo**, já na versão nova:
- Configurações → Dados fiscais da loja: aparece "✓ Já existe um token cadastrado", e o campo do
  token está vazio. É o certo.
- Emitir uma nota numa OS de verdade, e reabrir o PDF dela em Notas Fiscais → "Ver DANFE".

**Se aparecer...**
- "falta publicar o porteiro" → o passo 2 não foi feito (ou o nome saiu diferente de `focus-nfe`).
- "Token do Focus NFe não configurado" → o passo 1 não foi feito, ou a loja nunca teve token: cole
  em Configurações → Dados fiscais.
- "Você não tem permissão..." → aquele operador não tem o módulo Ordens de Serviço nem Notas
  Fiscais (pra cancelar, precisa de Notas Fiscais).

**Depois — a parte 2 (ainda não feita).** Até aqui, a cópia antiga do token continua na tabela de
configurações, legível como sempre foi: é o que deixa voltar pra `v0.9.40` sem parar a emissão, se
a versão nova sair ruim. A parte 2 é uma migration que apaga essa cópia, e ela só deve ser feita
**depois de uma nota emitida e uma nota cancelada de verdade pelo porteiro** — a prova de que o
caminho novo funciona nos dois sentidos.

### Backup do banco (item TR-12.1)

Todo dia às 3 da manhã, o job `.github/workflows/backup-banco.yml` tira uma cópia do banco de
**cada empresa** e guarda **em dois lugares fora do Supabase**, cifrada: o repositório privado
`caranovavidanova/ssace-backups` (como anexo de release) e o Cloudflare R2. Ficam **30 diárias +
a primeira de cada um dos últimos 12 meses**.

**Pra que serve, se o Supabase já faz backup**: o plano Pro guarda os **últimos 7 dias**. Passando
disso, não existe de onde voltar.

**Como restaurar, e o que fazer em cada tipo de problema**: `RESTAURAR-BACKUP.md`, na raiz. A
primeira tabela de lá manda **não** usar backup na maioria dos casos — "apaguei uma OS sem querer"
se resolve na tela de Auditoria, em minutos.

#### Os 8 secrets: no cofre `backup` (Settings → Environments → `backup`)

**Desde 30/09/2026 eles moram em cofres (environments), não soltos no repositório.** O cofre
`backup` só abre pra `main`, sem aprovação (o backup das 3h roda sozinho). O cofre `lojas` só
abre pra `main` **e espera a aprovação dela**: é o do "Liberar versão" e do "Atualizar o banco",
e guarda uma cópia do `BACKUP_EMPRESAS`. Motivo: com gente de fora escrevendo no repositório,
um secret solto pode ser lido por um workflow rodado a partir da branch de qualquer um. **Trocar
o `BACKUP_EMPRESAS` é trocar nos dois cofres.** Os valores de todos estão no Bitwarden dela,
pasta "Sakura System".


| Nome | O que é |
|---|---|
| `BACKUP_CHAVE_PUBLICA` | a chave **pública** do `age` (`age1...`). Só fecha o cadeado |
| `BACKUP_REPO` | `caranovavidanova/ssace-backups` |
| `BACKUP_REPO_TOKEN` | token fine-grained do GitHub, **Contents: Read and write**, só nesse repositório, sem validade |
| `R2_ENDPOINT` | `https://<account id>.r2.cloudflarestorage.com` (sem o nome do bucket no fim) |
| `R2_BUCKET` | `ssace-backups` |
| `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` | do token R2 (**Object Read & Write**, só nesse bucket, TTL Forever) |
| `BACKUP_EMPRESAS` | a lista de empresas, modelo abaixo |

#### O modelo do `BACKUP_EMPRESAS`

```json
[
  {
    "nome": "pneus-amigao",
    "banco": "postgresql://postgres.<ref>:<senha>@aws-0-sa-east-1.pooler.supabase.com:5432/postgres",
    "supabase_url": "https://<ref>.supabase.co",
    "service_role_key": "<a chave service_role, NÃO a anon>"
  }
]
```

**Empresa nova = mais um bloco nessa lista**, nos dois cofres (`backup` e `lojas`). Nada de mexer no workflow.

Cinco armadilhas, todas já vividas (§6 item 67):

1. **A conexão tem que ser a do "Session pooler"**, não a "Direct" (IPv6, que o runner não tem)
   nem a "Transaction" (não aguenta o `pg_dump`). Fica em Settings → Database → Connection string.
2. **Senha do banco só com letras e números.** Símbolo (`@`, `#`, `/`) quebra a linha de conexão, e
   o erro que aparece depois não fala em senha. Esqueceu a senha? "Reset database password" na
   mesma tela — **não derruba o sistema da loja**, que entra pela chave `anon`.
3. **A `service_role` e a `anon` são as duas um JWT começando com `eyJ`.** Trocar uma pela outra
   faz o Storage responder "Bucket not found", que aponta pro lugar errado. O job confere isso
   sozinho e avisa.
4. **A caixa de editar um secret no GitHub aparece SEMPRE VAZIA** — ele nunca mostra o que está
   guardado. Editar ali é digitar tudo de novo; colar só um pedaço substitui a lista inteira. Já
   aconteceu. Monte o texto no Bloco de Notas e cole pronto.
5. **O `supabase_url` é só `https://<código>.supabase.co`, sem nada depois, nem barra**
   (29/09/2026). Com um pedaço a mais no fim (o `/rest/v1/` que a tela "Data API" mostra, ou
   só uma `/`), o pedido do Storage cai na API REST e volta `PGRST125 "Invalid path specified
   in request URL"`, que não fala em endereço. Desde então o job tira as barras do fim e corta
   um `/rest/v1` sozinho (esse com aviso). O código é o mesmo que aparece na linha do `banco`,
   depois de `postgres.`.

#### Conferir de vez em quando (5 minutos por mês)

1. Actions → **Backup do banco** → as últimas rodadas estão verdes?
2. Uma vez por mês, baixar a cópia mais recente e **abrir** (parte 1 do `RESTAURAR-BACKUP.md`).

Se uma rodada falhar, o GitHub manda e-mail sozinho. **E-mail de falha de backup não é spam** — é
o único aviso que existe.

### Atualizar o banco de todas as empresas

Um botão no GitHub que roda, no banco de **cada empresa**, as migrations que ainda faltam — no
lugar de colar cada arquivo no SQL Editor de cada projeto Supabase. Usa a mesma lista do backup
(o secret `BACKUP_EMPRESAS`, a cópia do cofre `lojas`), então empresa que está no backup está
aqui também.

**Pra rodar** (uns 2 minutos, pelo navegador):
1. `github.com/sakura-corp/sakura-system-ace` → aba **Actions**.
2. Na lista da esquerda: **"Atualizar o banco de todas as empresas"**.
3. **"Run workflow"** → no campo "modo", deixe **`ensaiar`** → botão verde **"Run workflow"**.
   A rodada fica parada, amarela, em **"Waiting"**: clique nela → **"Review deployments"** →
   marque **`lojas`** → **"Approve and deploy"**. Toda rodada deste botão pede isso, até o ensaio.
4. Espere a bolinha ficar verde e clique nela: aparece uma tabela com cada empresa, em que
   versão o banco está, o que falta e se passaria. **O ensaio não muda nada** — ele roda e desfaz.
5. Estando tudo "✅ passaria": rode de novo, agora com o modo **`aplicar`**. No fim a tabela
   mostra em que versão cada banco ficou.

**Se aparecer ❌**:
- **"não tem a tabela schema_versao"** → aquele banco está antes da `0055`. Rode à mão no SQL
  Editor dele, em ordem, as migrations que faltam até a `0055`. Daí em diante o botão cuida.
- **"parou na 00NN: ..."** → aquela migration não passa naquele banco, quase sempre por causa de
  algum dado dele. Nada foi mudado em banco nenhum. Mande o print — é conversa, não é pra forçar.
- **"lock timeout"** → a tabela estava ocupada pela loja naquele instante. Nada mudou; rode de
  novo mais tarde (de noite é o melhor horário).
- **"MAIS NOVO que a última migration deste código"** → o botão foi rodado de uma branch que não
  é a `main`. Em "Use workflow from", escolha `main`.
- **Empresa que não aparece na tabela** → falta o bloco dela no `BACKUP_EMPRESAS` do cofre `lojas`.

**Se aparecer ⏸ "passaria, mas espera N computador(es)"** (desde a `0063`): alguma migration que
falta só funciona com o programa numa versão mínima, e aquele computador, usado nos últimos 30
dias, ainda está numa mais antiga. A tabela embaixo diz qual é e quando foi visto. Três saídas:
- **Esperar**: o computador se atualiza sozinho quando o programa é fechado e aberto de novo
  (e só recebe versão liberada, a menos que esteja no canal de teste). Rode o ensaio de novo
  depois.
- **O computador não existe mais**: Configurações → "Computadores desta empresa" → ⋯ → "Esquecer
  este computador". Ele sai da conta.
- **Você sabe que ele não será afetado** (como em 26/09, quando ninguém na loja tinha o perfil
  que a `0062` quebrava): rode o `aplicar` marcando **"aplicar mesmo com computadores
  atrasados"**. O resumo registra que foi assim.

**A ordem de sempre continua valendo**: primeiro o banco (este botão), depois a versão nova do
programa. E **aplicar só depois de ensaiar** — o `aplicar` ensaia sozinho de novo antes de mexer,
mas ver a tabela do ensaio antes é o que dá tempo de perguntar.

### Gerar o instalador Windows e publicar uma versão nova

Builda automaticamente no GitHub e publica o instalador `.exe` pronto pra baixar. **Desde o
`TR-09.1`, publicar põe a versão só no canal de teste** — as outras lojas recebem quando ela for
liberada (ver "Liberar uma versão para todas as lojas", logo abaixo).

**Passo único (só na primeira vez, já feito)**: `github.com/sakura-corp/sakura-system-ace` →
Settings → Actions → General → "Workflow permissions" → "Read and write permissions".

**Os secrets `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` não são mais usados pelo build** (desde
a sessão que construiu a tela de conexão, ver seção 7): o instalador não carrega mais a conexão de
empresa nenhuma dentro dele, cada computador escolhe a sua na primeira abertura. Podem continuar
cadastrados no GitHub sem problema — só não fazem mais efeito. **Não voltar a colocá-los no
`release.yml`** sem entender o motivo: embutidos, o instalador entregue a um cliente novo viria
apontando pro banco de dados de outra empresa.

**Toda vez que quiser publicar uma versão nova — jeito atual, preferido, sem a usuária precisar
mexer em nada** (descoberto e validado numa sessão que publicou `v0.9.13` a `v0.9.15` assim
seguidas, sem ela tocar no terminal nem na tela do GitHub nenhuma vez):

1. Atualizar o campo `"version"` do `package.json` (e rodar `npm install` só pra sincronizar o
   `package-lock.json`, que também carrega o número da versão) — commit, PR, merge direto na
   `main`, igual qualquer outra mudança (ver seção 3, fluxo de Git).
2. Depois do merge confirmado, disparar o build **direto por uma chamada de API**, sem precisar de
   `git tag`/`git push` nenhum: `mcp__github__actions_run_trigger` com `method: "run_workflow"`,
   `workflow_id: "release.yml"`, `ref: "main"`. Isso cria a tag/release sozinho (com o nome vindo
   do `"version"` do `package.json`, `v` na frente) e já builda em cima do commit certo.
3. Conferir com `mcp__github__get_release_by_tag` (`tag: "vX.Y.Z"`) até `assets` aparecer com o
   `.exe` e o `latest.yml` — leva uns 5-10 minutos. A release aparece com `prerelease: true`:
   **é o certo**, é o canal de teste.
4. Quando for pra todas as lojas: rodar o **Liberar** (seção logo abaixo) — por API é
   `mcp__github__actions_run_trigger` com `workflow_id: "liberar-versao.yml"`, `ref: "main"` e
   `inputs: { "versao": "vX.Y.Z" }`. **Não liberar sem ela pedir**: decidir que uma versão já
   rodou o bastante no teste é justamente a decisão que o canal existe pra devolver a ela.
   Desde 30/09/2026 a rodada fica esperando **a aprovação dela no GitHub** (cofre `lojas`), mesmo
   disparada por API: avisar que ela precisa clicar em "Review deployments" → "Approve and deploy".

**Por que esse é o jeito preferido agora, e não `git tag` + `git push`**: numa sessão do Claude
Code na nuvem (não é a máquina da usuária), `git push` de uma **tag** é bloqueado com erro 403 —
parece trava de segurança proposital do ambiente, não bug de proxy (mas `git push` de **branch**
normal, pra abrir PR, funciona numa boa — só tag é bloqueada). Isso sempre obrigou a usuária a
publicar manualmente pela tela do GitHub (`releases/new`), o que já causou **dois incidentes reais**
de rascunho de release antigo sendo reaproveitado silenciosamente por engano (ver "Empacotamento"
na seção 7, tags `v0.9.10` e `v0.9.12`) — a tela de criar release não distingue "nome de tag novo"
de "nome de tag que já existe como rascunho esquecido de semanas atrás". O gatilho manual
`workflow_dispatch` (adicionado ao `.github/workflows/release.yml` nesta mesma sessão, ao lado do
`push: tags: v*` que já existia) resolve os dois problemas de uma vez: não depende de `git push` de
tag (então funciona de dentro de uma sessão na nuvem) e não passa pela tela de criar release da
usuária (então não tem chance de colidir com rascunho nenhum).

**Detalhe de uso do `workflow_dispatch`**: só funciona disparando com `ref: "main"` — o GitHub só
permite `workflow_dispatch` a partir do arquivo do workflow que está na branch **default**
(`main`); tentar `ref` apontando pra uma tag antiga falha com "Workflow does not have
workflow_dispatch trigger" (porque o arquivo naquele commit antigo não tem esse gatilho ainda). Não
tem problema nenhum disparar sempre por `main` — o `package.json` de lá já está com a versão certa
assim que o passo 1 acima for mesclado.

**Desde 30/09/2026, esse é o ÚNICO jeito de publicar.** O Release não dispara mais por `git push`
de tag nem pela tela `releases/new`: a tag nasce dentro do workflow. E a rodada **para em
"Waiting" até ela aprovar** (cofre `lojas`: "Review deployments" → `lojas` → "Approve and
deploy"), mesmo disparada por API — avisar a ela. Motivo: qualquer pessoa com escrita no
repositório pode enviar uma tag, e publicar põe a versão nos computadores do canal de teste,
que podem ser de loja. A regra de tag do repositório (Settings → Rules, "versões") bloqueia
**mudar e apagar** `v*`, mas não **criar**, porque quem cria é o próprio workflow, com o token
automático, e o GitHub não deixa isentá-lo. (Os jeitos antigos, `git tag` + `git push` e
`releases/new`, ficaram no histórico do Git deste arquivo; não voltar a eles sem rever isso.)

O instalador aparece em `github.com/sakura-corp/sakura-system-ace/releases`. O
Windows/SmartScreen deve avisar "editor desconhecido" (normal sem certificado pago — "Mais
informações → Executar assim mesmo"). PCs já atualizados se atualizam sozinhos na próxima tag.

**Duas pegadinhas já corrigidas** (não devem mais acontecer, mas documentado caso reapareçam): (a)
por padrão o `electron-builder` publica a release como rascunho invisível — corrigido com
`"releaseType": "release"` no `publish` do `package.json`; (b) publicar sem antes atualizar
`"version"` no `package.json` faz o build atualizar a release **anterior** em vez de criar uma nova
(o nome da release vem do `package.json`, não da tag/gatilho usado) — por isso o passo 1 acima é
sempre antes de disparar o build, nunca depois.

**Como o workflow publica, desde 17/09/2026 (mudou — e o motivo importa)**: o
`electron-builder` roda com `--publish never`, ou seja, **só builda**. Quem publica é um passo
separado, com o `gh`, subindo **arquivo por arquivo**, com até 3 tentativas cada e conferindo o
tamanho do que ficou publicado — e o `latest.yml` **por último**, só depois de o instalador estar
publicado e conferido. Antes disso, quem publicava era o publicador embutido do electron-builder,
e ele deixou a `v0.9.38` pela metade: instalador publicado, `latest.yml` não, canal de atualização
de todas as lojas quebrado (item 66 da seção 6). **A ordem não é detalhe de implementação, é a
trava**: o `latest.yml` é o anúncio, o instalador é o que ele promete — anunciar antes seria pior
que o que aconteceu. Ao mexer nesse passo, não inverter, e não juntar tudo num comando só.

**Se um build de Release falhar, NÃO concluir que nada foi publicado.** Conferir o que ficou na
release (`mcp__github__get_release_by_tag`) antes de qualquer coisa: precisa ter
`SakuraSystem-Setup.exe` **e** `latest.yml`. Faltando o `latest.yml`, o canal de atualização está
quebrado pra todas as lojas mesmo com a release parecendo normal na tela do GitHub — o sintoma é
`releases/latest/download/latest.yml` devolvendo 404. O conserto é **rodar o workflow de novo na
mesma tag** (o passo de publicação completa o que faltar numa release que já existe, sem criar
outra e sem queimar número de versão). **Não** dá pra consertar por API de dentro de uma sessão
do Claude Code: mexer em release e subir arquivo são as duas coisas recusadas por este ambiente.

### Liberar uma versão para todas as lojas (item TR-09.1)

Toda versão nova nasce no **canal de teste**: só os computadores marcados como teste a recebem
sozinhos. As outras lojas continuam na versão anterior até você **liberar**. Liberar não refaz
nada — é a mesma versão, o mesmo instalador; só muda quem pode receber.

**Quem fica em qual canal** (Configurações → "Atualizações deste computador", só admin):
- **Teste**: o seu computador e o da Pneus Amigão.
- **Normal**: todo o resto. Computador novo já nasce assim — não precisa mexer.

**Pra liberar** (uns 2 minutos, pelo navegador — não precisa de terminal):
1. Abra `github.com/sakura-corp/sakura-system-ace` → aba **Actions**.
2. Na lista da esquerda, clique em **"Liberar versão para todas as lojas"**.
3. À direita, clique em **"Run workflow"**, escreva a versão (ex: `v0.9.40`) e clique no botão
   verde **"Run workflow"**. A rodada fica parada em **"Waiting"**: clique nela → **"Review
   deployments"** → marque **`lojas`** → **"Approve and deploy"**.
4. Espere a bolinha ficar verde (1 a 3 minutos). Clicando nela, aparece "✅ v0.9.40 liberada
   para todas as lojas". As lojas recebem na próxima vez que abrirem o programa.

**Se ficar vermelho, nada foi liberado** (a não ser que a mensagem diga o contrário). Antes de
mexer em qualquer coisa ele confere que a versão está inteira — tem o instalador, tem o
`latest.yml`, e a impressão digital de um bate com a que o outro promete. É exatamente o que teria
barrado o estrago da `v0.9.38` (item 66 da seção 6). A mensagem diz o que faltou; quase sempre o
conserto é rodar o workflow **Release** de novo naquela versão e depois liberar de novo.

**Quando liberar**: quando a versão tiver rodado uns dias nos computadores de teste sem ninguém
reclamar. Se for correção urgente pra todo mundo, dá pra publicar e liberar em seguida — só que
aí o canal de teste não protegeu nada, e vale saber disso.

**Voltar atrás é o mesmo botão**: rode o Liberar com a versão **boa anterior**. Ela volta a ser a
versão de todas as lojas, e as mais novas voltam pro teste. Isso impede que a versão ruim chegue
em mais alguém — mas quem já tinha atualizado fica nela (o atualizador nunca instala versão mais
velha); pra esses, o conserto é uma versão nova, ver "Voltar uma versão" logo abaixo.

**Uma versão pode ficar no teste pra sempre**, e está tudo bem: se a `v0.9.41` saiu com problema
e a `v0.9.42` corrige, libera-se direto a `v0.9.42`. As lojas normais pulam da liberada anterior
pra ela.

### Voltar uma versão (quando a que saiu está ruim)

> **Escrito em 13/09/2026, ainda NÃO ensaiado numa release de verdade.** Ensaiar significa
> publicar uma versão de mentira e voltar atrás dela com o computador dela de fora do processo —
> decisão dela, e o certo é ensaiar num dia calmo, não descobrir se funciona no dia do incêndio.

**A primeira coisa a entender, porque muda tudo: o `electron-updater` só anda pra frente.** Ele
compara o número da versão instalada com o da release mais nova e só baixa se for maior
(`allowDowngrade` não está ligado, e ligar seria pior — passaria a aceitar rebaixar sozinho).
Ou seja: **apagar a release ruim não desfaz nada em computador que já atualizou.** Apagar só
impede quem ainda não pegou.

Por isso o procedimento tem duas metades, e a segunda é a que resolve de verdade.

**Metade 1 — estancar (os computadores que ainda não atualizaram).** Desde o `TR-09.1` (25/09/2026)
isto quase sempre já está feito sozinho: versão nova nasce no **canal de teste**, então uma versão
ruim normalmente só chegou no computador dela e no da Pneus Amigão — é pra isso que o canal
existe. Se ela chegou a ser **liberada**, o caminho é rodar o **Liberar com a versão boa
anterior** (seção logo acima): ela volta a ser a de todas as lojas, e a ruim volta pro teste.

Apagar a release ruim (`releases` → a release → 🗑) **e a tag** (são coisas separadas no GitHub:
`.../tags`, achar a tag, apagar por lá também — ver os incidentes das tags `v0.9.10` e `v0.9.12`
na seção 7) continua existindo, e é o que tira a versão ruim **também do canal de teste**. Só
que apaga o registro dela, então fica pro caso de a versão ser perigosa de verdade.

**Metade 2 — desfazer (os computadores que já atualizaram) — "voltar pra frente".** Não existe
rebaixar; o que existe é **publicar uma versão NOVA com o código da antiga**. Se a `v0.9.35`
saiu ruim e a `v0.9.34` era boa:

```powershell
git checkout main
git pull origin main
git revert --no-commit <hash-inicial>..<hash-final>   # desfaz o que a v0.9.35 trouxe
# ou, pra voltar a árvore inteira ao estado da boa:
#   git checkout v0.9.34 -- .
```

Depois: subir o `package.json` pra `0.9.36`, PR, merge, e disparar o build como sempre
(`workflow_dispatch` com `ref: "main"`). A loja recebe a `0.9.36` sozinha pelo auto-update, e
ela é, por dentro, a `0.9.34` que funcionava. **Nunca republicar o número que já saiu** — é o
mesmo motivo de sempre: número de versão que já circulou não se reusa.

**Metade 2, caminho de emergência (uma máquina só, sem esperar build).** Baixar o instalador da
versão boa direto pela release dela — `github.com/sakura-corp/sakura-system-ace/releases`,
abrir a release antiga e pegar o `.exe` — e instalar por cima. Não precisa desinstalar antes.
**O `conexao.json` NÃO se perde**: ele mora em `%APPDATA%\Sakura System - AutoCenter Edition\`,
fora da pasta do programa, e o desinstalador não mexe em dado de aplicativo. O `erros.log` e o
`atualizacoes.log` moram lá também e sobrevivem junto. **Cuidado**: a partir da `v0.9.22` o
instalador tem nome fixo (`SakuraSystem-Setup.exe`) — releases anteriores a essa têm o nome
antigo, com o número dentro.

**E o banco NÃO volta junto.** Essa é a parte que mais assusta e a mais simples de resolver:
migration que já rodou continua rodada, e não existe "desfazer migration" neste projeto. Se a
versão ruim trouxe migration, o código antigo vai voltar a rodar **em cima do banco novo**. Isso
funciona sem drama desde que a migration só tenha **acrescentado** coisa — e é exatamente por
isso que existe a regra abaixo.

> ### Regra: migration nunca tira nem renomeia coluna em uso na mesma versão que passa a usar a nova
>
> Adotada em 13/09/2026, e é o que torna o rollback possível. Toda troca de coluna vira **duas
> versões**:
>
> - **v1** — acrescenta a coluna nova e passa a escrever **nas duas**, lendo a que fizer sentido.
>   A coluna velha continua lá, cheia e correta.
> - **v2** — só depois de **todas as lojas atualizadas**, remove a velha.
>
> Entre as duas, voltar uma versão é seguro: o código antigo acha a coluna dele no lugar. Se v1
> já tivesse removido a velha, voltar atrás significaria um app procurando uma coluna que não
> existe mais — e o sintoma seria tela de erro no balcão, não uma mensagem clara.
>
> As 53 migrations até aqui já são só aditivas na prática, com uma exceção que ilustra bem o
> ponto: a `0033` derrubou a coluna `id` das tabelas de configuração ao trocar a chave por
> `loja_id`. Aquilo foi feito de uma vez, sem versão de transição — e é por isso que hoje
> reexecutar a sequência inteira precisa de guarda em três migrations anteriores (seção 6, item
> 36). Deu certo porque só existia uma loja e uma máquina; com dez lojas não daria.


## 11. Trabalhando de outro computador

O código (tudo commitado no GitHub) e o banco de dados (Supabase) já são 100% na nuvem — dá pra
continuar em qualquer computador com internet. Dois passos manuais em cada computador novo, porque
nunca ficam salvos no Git (por segurança):

```bash
git clone https://github.com/sakura-corp/sakura-system-ace.git
cd sakura-system-ace
npm install
cp .env.example .env   # editar com VITE_SUPABASE_URL=https://rlgdjiowvnfzsedehyga.supabase.co
                        # e VITE_SUPABASE_ANON_KEY=<chave anon, em Settings -> API no Supabase>
npm run dev
```

