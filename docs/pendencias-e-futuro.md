# O que não existe ainda e próximos passos

> Parte da memória do projeto. O índice é o `PROJETO_STATUS.md` (carrega sozinho em toda sessão);
> este arquivo só é aberto quando o assunto pede. Os números de seção e de item citados aqui
> ("item 33 da seção 6") continuam valendo: a seção 6 é `docs/licoes.md`, a 5 é `docs/banco.md`,
> a 7 é `docs/modulos.md`, a 8 é `docs/pendencias-e-futuro.md` e a 9 é `docs/operacao.md`.

## 8. O que NÃO existe ainda (próximos passos possíveis)

1. **Parte fiscal — ✅ RESOLVIDA (27/08/2026)**: **NFC-e (peça) e NFS-e (serviço) emitem de ponta
   a ponta em produção**, as duas já testadas com sucesso de verdade. O histórico de como se chegou
   lá foi podado em 02/09/2026 (está no Git); o que uma sessão nova precisa saber é só isto:
   - **NFC-e**: CNPJ credenciado na SEFAZ-SP, CSC + ID Token de **produção** gerados e cadastrados
     na Focus NFe. Falta só o CSC/ID Token de **homologação** (servidor de teste da SEFAZ-SP nunca
     respondeu — `ERR_CONNECTION_TIMED_OUT` — não bloqueia nada, só serve pra testar sem gerar nota
     real; tentar de novo no portal `www.nfce.fazenda.sp.gov.br/NFCePortal/` → Gerenciar Cód
     Segurança → "ambiente de testes" quando precisar).
   - **NFS-e**: token da prefeitura de Araraquara (portal Giap) gerado e cadastrado, código CNAE da
     loja preenchido em Configurações → Dados fiscais. Sem pendência conhecida.
   - **CSOSN `'500'` — CONFIRMADO pela contabilidade (31/08/2026)**: era o único risco fiscal em
     aberto do cadastro de peças. A usuária tinha usado `'500'` por hábito do sistema antigo, sem
     validação; a contabilidade confirmou que é o código certo mesmo. Nada a mudar no catálogo, e a
     pergunta que estava pendente com a Rayana/Rafaela está respondida.
   - Token de **produção** da Focus NFe (NFC-e e NFS-e) já está configurado e em uso — não é mais
     "não colocar até validar", já foi validado.
   - **NFS-e — colisão de numeração de RPS — RESOLVIDA (31/08/2026)**: emitir NFS-e passou a
     falhar com *"O número de RPS 7 já existe"*. O Sakura System **não envia número de RPS nenhum**
     (o corpo de `montarCorpoNFSe()` tem prestador, tomador e serviço; a única coisa nossa é o
     `ref` interno `os<numero>-nfse-<timestamp>`, único e sem relação com o RPS) — quem controla
     esse contador é a Focus NFe. **Causa**: a numeração de RPS dessa empresa já tinha sido usada
     no passado pela contabilidade emitindo direto pelo portal (existe nota antiga com **RPS 78**),
     e a Focus NFe começou a contar **do 1** — as notas 10 a 14 saíram com RPS 2 a 6 e o 7 bateu
     num já usado. **Resolvido pelo suporte da Focus NFe (Jaciara Santana), que ajustou o contador
     pra 100** e informou que isso também dá pra fazer sozinha: Painel da API → menu **Documentos
     Fiscais**. Descartado no caminho: o número do RPS **não** vem do número da OS (a OS era a 4 e
     o erro falava em 7). **Vale pra qualquer loja nova que já emitia nota antes do Sakura System**
     — ver o passo (C) do playbook mais abaixo.
   - **⚠️ NFS-e — a alíquota da competência precisa ser cadastrada TODO MÊS no portal da
     prefeitura, ANTES da primeira nota do mês** (descoberto em 01/09/2026, na primeira nota de um
     mês novo). A emissão falha com *"Por gentileza, conclua o cadastro de todas as alíquotas
     referentes à competência vigente"* (chega com os acentos quebrados, mojibake do lado deles).
     **Não é código nosso** — a alíquota que o app manda (`configuracoes_fiscais_loja.aliquota_iss`,
     3%) está certa e sai no XML como `pAliqAplic 3.00`; o que falta é um cadastro no portal.
     **Desde 11/09/2026 o sistema avisa antes de falhar** (item `TR-11.2` do guia): o Início
     mostra a faixa com o passo a passo e o botão "Já cadastrei" enquanto a competência do mês não
     estiver confirmada, e a mesma faixa aparece dentro da janela de emitir NFS-e. Continua sendo
     tarefa dela no portal — o sistema só deixou de ficar calado sobre uma armadilha com data
     certa. Ver "Aviso da alíquota do mês" na seção 7.
     **Onde**: portal do Giap (site da prefeitura → Serviços Empresa → Nota Fiscal Eletrônica →
     Contribuintes, login `30016580`) → menu **Emissor/Consulta NFS-e** → tela **Cadastro de
     Alíquota**. Preencher Mês/Ano (ex: `09/2026`), Alíquota (`3`) e Atividade, e clicar
     **"Replicar Alíquota"** (é o botão de salvar dessa tela; o outro é "Voltar"). A empresa tem
     **três atividades** cadastradas — CNAE 452000100 (manutenção e reparação mecânica), 452000400
     (alinhamento e balanceamento) e 452000600 (borracharia) —, todas historicamente a 3%.
     **Detalhe não confirmado**: bastou cadastrar com a **primeira** atividade selecionada pra
     destravar; a nota seguinte era de *alinhamento* (a segunda atividade) e saiu normalmente — não
     ficou claro se o "Replicar Alíquota" cadastra as três de uma vez ou se o portal só exige uma.
     Conferir no "Relatório Alíquota" da própria tela quando acontecer de novo. **Cuidado ao mudar
     o valor**: a tela é uma declaração formal (a alíquota do Simples Nacional varia com o
     faturamento) — se a contabilidade mandar outro percentual, ele tem que ser trocado **também**
     em Configurações → Dados fiscais da loja, senão a nota sai com um valor e a prefeitura tem
     outro cadastrado.
   - **Duas observações do portal da prefeitura — respondidas pelo suporte da Focus NFe, as duas
     são com a prefeitura** (achadas investigando o RPS acima; nenhuma exige mudança no nosso
     código): (a) toda nota emitida pela API aparece no portal com **"Processado: Não"**, "Chave
     Acesso" vazia e um erro genérico (`{"details":"Error id ...","stack":""}`) — o suporte
     respondeu que **o retorno do webservice foi de sucesso na autorização**, então é etapa
     posterior, do lado da prefeitura (bate com o XML dessas notas trazer `cStat 100`, número,
     chave e assinatura do Município: a nota vale). (b) o XML sai com `cNBS 120013430` =
     *"Serviços de manutenção e reparação de foguetes e equipamentos aeroespaciais"* — o suporte
     confirmou que **veio da prefeitura**, justamente porque o código não é enviado no JSON; pra
     corrigir, é preciso conferir no portal da prefeitura qual código está configurado pra empresa.
     **Nenhuma das duas foi levada à prefeitura ainda.**
   - **O histórico completo dessa novela foi podado em 02/09/2026** (eram ~470 linhas de
     bloqueio-a-bloqueio já resolvido). O que valia guardar virou: o resumo acima, o **playbook**
     logo abaixo (que é a parte reaproveitável pra loja nova) e os itens 29 a 33 da seção 6. Se
     um dia precisar da arqueologia completa, ela está no histórico do Git deste arquivo.

   **A sequência de bloqueios que foi vencida, em uma linha cada** (só pra reconhecer o padrão se
   algo parecido voltar): `Failed to fetch` (CORS — resolvido chamando a Focus NFe pelo processo
   principal do Electron, item 29 da seção 6) → CNPJ vazio em Configurações → empresa não
   habilitada (é **self-service** no painel da Focus NFe: Empresas → Documentos Fiscais → ligar
   NFCe/NFSe) → CST errado pro Simples Nacional (era CSOSN; foi o que motivou construir a edição
   de produto) → grupo IBS/CBS faltando, depois com alíquota errada (as de teste de 2026 são
   fixadas por lei, ver playbook) → CNPJ não credenciado na SEFAZ-SP pra NFC-e (**quem credencia é
   o lojista**, com certificado digital, não a Focus NFe) → na NFS-e: "Lote RPS" (era instabilidade
   do ambiente de **homologação** da prefeitura — resolveu testando em produção) → autenticação com
   a prefeitura → CNAE faltando no envio.

   **Três coisas dessa fase que não são óbvias e podem voltar a morder:**
   1. **O "login da prefeitura" de Araraquara que a Focus NFe pede não é a senha de acesso ao
      portal** — é um **token** gerado dentro do portal Giap, em "Dados Cadastrais" (o menu só
      aparece depois de marcar como lido o comunicado pendente da prefeitura). O usuário continua
      sendo o número de inscrição.
   2. **O CSC e o ID Token da NFC-e são gerados no portal da SEFAZ-SP**
      (`www.nfce.fazenda.sp.gov.br/NFCePortal/` → Gerenciar Cód Segurança), com certificado
      digital, e **homologação e produção são pares separados**. Só o de produção existe hoje: o
      servidor de homologação da SEFAZ-SP nunca respondeu (`ERR_CONNECTION_TIMED_OUT`).
   3. **A hipótese do "Ambiente Nacional" de NFS-e já foi levantada e descartada** — a própria
      Focus NFe avisa que só vale pra empresa obrigada (ex: MEI), e a loja é Ltda no Simples. Não
      reabrir sem um fato novo.

   > ⚠️ **Credenciais que estavam copiadas aqui foram removidas em 02/09/2026** — este repositório
   > é **público** (foi aberto pra o auto-update funcionar, ver item 21 da seção 6), então o CSC da
   > SEFAZ, o token do portal Giap e o usuário/senha da prefeitura estavam à vista de qualquer um.
   > Tirar do arquivo **não basta**: eles continuam no histórico do Git, então o certo é
   > **regerar/trocar os três** (SEFAZ → Gerenciar Cód Segurança; portal Giap → Dados Cadastrais →
   > Gerar Token; e a senha do portal da prefeitura, com a contabilidade). Todos estão em uso hoje
   > no painel da Focus NFe, então trocar exige atualizar lá também. **Não colar credencial neste
   > arquivo de novo** — o lugar delas é o painel do serviço.

   ### O que ainda está frágil na parte fiscal (varredura de 02/09/2026)

   Nenhum destes é bug de código pra sair corrigindo — são limites conhecidos, e três deles
   dependem de confirmação de fora. Ficam aqui pra ninguém "descobrir" de novo:

   1. ✅ **NFC-e pra cliente pessoa jurídica — RESOLVIDO (03/09/2026)**. A nota saía como
      "consumidor não identificado" porque o corpo só tinha `cpf_destinatario`; faltava saber o
      nome exato do campo de CNPJ, que deliberadamente não foi chutado. **O suporte da Focus NFe
      confirmou**, e está implementado: pessoa jurídica vai com `cnpj_destinatario` **mais**
      `indicador_inscricao_estadual_destinatario` com o valor `"9"` (não contribuinte, que pode ou
      não ter IE) — e a **inscrição estadual do destinatário não deve ser enviada** nesse caso, de
      jeito nenhum. Fica tudo em `montarDestinatarioNFCe()` (`src/lib/focusNfe.ts`), com teste.
      **Ainda não emitida uma NFC-e de PJ de verdade** — o código está pronto e testado, mas a
      confirmação na SEFAZ só vem na primeira venda pra empresa.

      **Três coisas que vieram junto na mesma resposta e valem guardar:**
      - **O nome do destinatário é opcional na NFC-e** (pode ser omitido). O sistema manda mesmo
        assim quando tem cliente cadastrado — não atrapalha, e ajuda quem recebe a nota.
      - **Venda com entrega a domicílio exige o endereço completo do destinatário** (`<enderDest>`).
        O Sakura System **não manda endereço nenhum** na NFC-e hoje: como é venda de balcão
        (`presenca_comprador: "1"`), não se aplica. Se um dia a loja passar a entregar, isso vira
        campo obrigatório e precisa ser construído.
      - **Acima do limite da UF (em geral R$ 10.000,00) a SEFAZ exige a identificação completa do
        destinatário.** Uma NFC-e desse valor sem cliente identificado será recusada — hoje não há
        nenhuma trava no sistema avisando disso antes de emitir.

      **O que sobra de risco**: cliente PJ **sem CNPJ preenchido no cadastro**. Nesse caso a nota
      volta a sair como consumidor não identificado (mandar um CNPJ pela metade faria a SEFAZ
      recusar a nota inteira) — a tela de emissão avisa antes de mandar, pedindo pra cadastrar o
      CNPJ em Clientes.
   2. **CSOSN `500` é enviado sem os campos de ICMS-ST** (`vBCSTRet`/`vICMSSTRet` e afins, que o
      layout da NFe pede pra esse código) — e **a suposição antiga de que a Focus NFe completava
      isso sozinha está errada**. Perguntado no mesmo chamado de 03/09/2026, o suporte respondeu
      que *"a API não completa nem insere automaticamente informações fiscais ou tributárias que
      não tenham sido enviadas na requisição"*, e que a parametrização é responsabilidade do
      emitente, com apoio da contabilidade. **Na prática as notas continuam sendo autorizadas
      assim** (é o que roda em produção desde agosto), então **não sair mexendo às cegas** — mas
      isso deixou de ser "está tudo certo" e virou **pergunta pra contabilidade**: com CSOSN 500,
      essas peças deveriam estar levando valor de ICMS-ST retido? Se a resposta for sim, é mudança
      em `montarItemNFCe()` — e vale conferir as notas já emitidas. Se aparecer rejeição falando em
      substituição tributária, é aqui que se olha primeiro.
   3. **Não existe trava no banco contra duas notas do mesmo tipo pra mesma OS.** A proteção hoje é
      só de tela (o botão some quando a OS já tem a nota). Os dois caminhos que furam isso estão
      cobertos por aviso desde 02/09/2026 (a `ref` perdida e a exclusão de nota autorizada, item 46
      da seção 6), mas uma `unique (ordem_servico_id, tipo)` — considerando que nota cancelada
      precisa permitir reemissão — resolveria de vez. Não foi feito: exige migration e uma decisão
      sobre o caso da reemissão.
      **Revisto em 25/09/2026 (item `TR-05.2`), e adiado de novo, com motivo**: o índice único
      sozinho seria **pior** que nada. O registro da nota só é gravado **depois** que a SEFAZ
      autoriza — então, no caso exato que ele deveria pegar (uma segunda nota autorizada pra mesma
      OS), o banco recusaria **gravar o XML de uma nota que já vale lá fora**, e o documento que a
      lei manda guardar 5 anos se perderia. O desenho certo é o do item 5 logo abaixo: gravar uma
      linha "processando" **antes** de enviar e o índice valer sobre ela. Isso mexe no fluxo de
      emissão e no porteiro, que ainda nem foi exercitado em produção — fica pra depois da parte 2
      do `TR-04.2`.
   4. **Os dados da loja em Configurações → "Dados fiscais" quase não vão pra nota.** Só o **CNPJ**
      é enviado (mais inscrição municipal, código do município, CNAE e alíquota na NFS-e). Razão
      social, inscrição estadual, endereço e regime tributário **não saem na nota** — a emitente de
      verdade é a empresa cadastrada no painel da Focus NFe. Esses campos aqui alimentam o
      **documento de garantia**, não a nota. Corrigir um endereço aqui e esperar que a nota mude é
      um engano fácil de cometer.
   5. **A `ref` da emissão não é guardada antes do envio.** Ela é gerada na hora
      (`os<numero>-<tipo>-<timestamp>`) e só vai pro banco depois que a nota volta autorizada. É
      por isso que o item 46 da seção 6 teve que se contentar em **mostrar** a `ref` quando a
      espera vence, em vez de recuperar sozinho. Guardar antes exigiria uma linha "em andamento" em
      `notas_fiscais_arquivos` (migration). O timestamp na `ref` é de propósito e **não deve virar
      fixo**: é ele que permite reemitir depois de cancelar uma nota.
   6. **CNPJ alfanumérico — o código fiscal só entende dígitos** (achado em 25/09/2026, ao
      escrever as travas da `0060`). A Receita emite CNPJ com letras desde julho de 2026. O
      cadastro já aceita (a trava da `0060` conta letras e números), mas a montagem da nota tira
      tudo que não é dígito: `src/lib/focusNfe.ts` (destinatário da NFC-e, emitente, tomador e
      prestador da NFS-e), a conferência de CNPJ do porteiro
      (`supabase/functions/focus-nfe/index.ts`, função que limpa o documento), a validação de
      "CNPJ completo" antes de emitir (`EmitirNotaFiscalModal.tsx`) e o casamento de fornecedor
      na importação de XML (`src/lib/notaFiscalXmlFornecedor.ts`). Com uma empresa dessas, a nota
      sairia com o CNPJ mutilado — ou o porteiro recusaria, dizendo que o CNPJ não é da loja.
      **Não foi mexido às cegas**: antes, confirmar com o suporte da Focus NFe o formato que a API
      espera (com ou sem as letras em maiúscula, com ou sem pontuação). **Pesa na fase 2** — uma
      loja aberta de julho pra cá já nasce com CNPJ assim.

   ### Playbook de habilitação fiscal por loja nova (lições da primeira)

   Escrito a pedido da usuária **enquanto a primeira loja ainda está travada**, justamente pra que
   toda essa descoberta na marra não precise ser refeita do zero na loja 2, 3... 30. A lição
   central é que os bloqueios encontrados **não são todos do mesmo tipo** — e só um dos três tipos
   some sozinho quando uma loja nova entra:

   **(A) Igual pra toda loja — já resolvido no código, custo zero por loja nova.** Formato do JSON
   da NFC-e/NFS-e (confirmado contra os exemplos oficiais do repo `FocusNFe/javascript`); os 10
   campos de IBS/CBS e as alíquotas de teste de 2026 (`cbs_aliquota = 0.90`,
   `ibs_uf_aliquota = 0.10`, `ibs_mun_aliquota = 0.00` — regra **nacional** fixada por lei, não
   decisão de contabilidade de nenhuma loja específica); o rateio proporcional do pagamento em OS
   com peça + serviço; a chamada via IPC do Electron pra fugir de CORS; e a exibição do erro real
   vindo da Focus NFe em vez de mensagem genérica. **Nada disso se repete por loja.**

   **(B) Muda por loja, mas é só preencher uma tela — minutos, self-service.** Em Configurações →
   "Dados fiscais da loja": CNPJ, razão social, inscrição estadual/municipal, regime tributário,
   endereço, telefone, token da Focus NFe, e (só pra NFS-e) código IBGE do município, item da lista
   de serviço LC 116, alíquota de ISS e código tributário do município. **Cuidado aprendido**: campo
   em branco aqui vira erro que *parece* bug do sistema — o `prestador.cnpj não informado` da
   primeira tentativa era só o CNPJ vazio nessa tela.

   **(C) Muda por loja e depende de terceiros — é o caro, e é onde a primeira loja está travada.**
   Nenhum desses é código; são cadastros que levam dias/semanas e passam por gente de fora:
   1. **Habilitar os documentos no painel da Focus NFe** — Empresas → (empresa) → Documentos
      Fiscais → ligar NFCe e NFSe. É **self-service** (o suporte deles não faz isso por você —
      resposta do Natan Coelho), mas ninguém adivinha que existe: custou um ticket pra descobrir.
   2. **Credenciar o CNPJ na SEFAZ do estado, pra NFC-e — e gerar CSC + ID token lá** (confirmado
      pelo suporte da Focus NFe, 26/08/2026, ver item 1 desta seção). São **três coisas** por loja,
      todas feitas pelo próprio lojista/contabilidade no portal da SEFAZ do estado, nenhuma delas
      feita pela Focus NFe: (a) o **credenciamento** do CNPJ pra NFC-e — e **homologação e produção
      são credenciamentos separados** (é a rejeição 245, "CNPJ Emitente não cadastrado"); (b) o
      **certificado digital** da empresa, que precisa existir e ser vinculado no painel da Focus
      NFe; (c) o **CSC e o ID token**, gerados na SEFAZ (um par pra homologação, outro pra
      produção) e informados no painel da Focus NFe. Em SP existe um portal próprio de NFC-e
      (`nfce.fazenda.sp.gov.br`), diferente do de NF-e/CT-e, e o acesso pede o certificado digital.
      **Varia por estado** — direto relevante pra fase 3, que sai de Araraquara/SP (ver seção 1).
      **É o passo mais pesado de todo o onboarding fiscal**: envolve certificado digital pago,
      portal de governo e, na prática, a contabilidade do cliente.
   3. **Conferir a numeração de RPS da empresa antes da primeira NFS-e** — se a loja já emitia
      nota de serviço antes (pela contabilidade, direto no portal do município), a numeração de RPS
      já andou, e a Focus NFe começa a contar do 1: as primeiras notas passam nos números livres e
      uma hora batem num já usado ("O número de RPS X já existe"). Resolve-se ajustando o contador
      pra bem acima do maior já usado (Painel da API → Documentos Fiscais, ou pedindo ao suporte).
      Aconteceu na primeira loja — ver item 1 desta seção.
   4. **Cadastrar a alíquota da competência todo mês** (pelo menos em Araraquara/Giap) — sem
      isso a primeira NFS-e do mês é recusada. É tarefa recorrente do lojista, não de instalação;
      passo a passo no item 1 desta seção.
   5. **Login/senha do portal da prefeitura, pra NFS-e** — Araraquara exigiu (veio da contabilidade
      da loja, não da Focus NFe). **Varia por município**, inclusive o fornecedor do sistema
      municipal (Araraquara usa "Giap") e o conceito de lote/RPS que ele impõe.
   6. **Confirmar CST/CSOSN com a contabilidade do cliente** — depende do regime tributário
      **daquela** empresa (Simples Nacional usa CSOSN, regime normal usa CST). A SEFAZ rejeita o
      código incompatível com o regime, mas **não** confere se é o código certo pro produto — ou
      seja, um cadastro errado passa na emissão e só aparece como problema fiscal depois.

   **Consequência estratégica (importante pro item 2 desta seção, o site de assinatura
   self-service)**: o bucket (C) é o que impede o sonho "loja nova assina no site e já emite nota
   sozinha". Assinar o sistema pode ser instantâneo; **emitir nota, não** — cada loja nova carrega
   um onboarding fiscal que envolve SEFAZ estadual, prefeitura e a contabilidade do próprio
   cliente. Duas implicações práticas pra quando essa hora chegar: (1) tratar "usar o sistema" e
   "emitir nota fiscal" como **duas etapas de ativação separadas** — a loja começa usando
   cadastro/OS/estoque/caixa no primeiro dia (exatamente como a Pneus Amigão fez, ver seção 3) e a
   emissão entra depois, quando o bucket (C) fechar; (2) esse onboarding precisa virar um
   **checklist operacional que a usuária (ou quem for vender) conduz junto com o cliente**, não uma
   redescoberta por loja — este playbook é o rascunho dele.

   **Ponto ainda em aberto que muda esse desenho**: se a arquitetura de **token compartilhado**
   (item 6 desta seção) for construída, o passo (B) deixa de ter "token da Focus NFe" por loja, e o
   passo (C.1) passa a ser feito pela usuária dentro da conta única dela, em vez de cada dono de
   loja mexer no painel da Focus NFe — reduz a fricção de (C), mas **não elimina** (C.2), (C.3) nem
   (C.4), que são cadastros no nome do CNPJ do cliente e não têm como ser feitos por outra empresa.
2. **Site externo de assinatura** que cria a primeira conta de cada loja
   automaticamente (hoje é manual, pelo painel do Supabase) continua pendente — combinado que fica
   pra quando pensarem na versão comercial.
3. **Logo oficial** — **decisão da usuária: não é prioridade agora**, continua com os SVGs feitos
   à mão (ver seção 2) até ela decidir trocar no futuro. Não sugerir/perguntar sobre isso de
   novo por conta própria; só retomar se ela trouxer o assunto.
4. Refinamentos possíveis no Início e demais módulos, conforme feedback da usuária.
5. **Módulo de Fornecedores — completo** (cadastro + Pedido de Compra + Receber pedido + Cotação +
   Importar XML, ver seção 7 "Fornecedores"). A usuária pediu pra completar, nessa ordem, três
   funcionalidades que um sistema de referência (S3Auto/Comsis) também costuma ter, antes de
   atacar a emissão de nota fiscal (item 1 desta seção) — **as três já estão prontas**:
   1. ✅ **Cadastro de Depósito** — **confirmado por ela funcionando de verdade** (rodou a
      migration `0041` e testou o cadastro), ver "Depósitos" na seção 7 e migration `0041` na
      seção 5.
   2. ✅ **Cotação de Peças por fornecedor** — ver "Cotação de peças" na seção 7 e migration
      `0042` na seção 5. **Migration `0042` já rodada e confirmada no Supabase real dela** — o
      histórico de preço por fornecedor já aparece nos Pedidos de Compra.
   3. ✅ **Importar XML de nota fiscal do fornecedor** — **construído nesta sessão**, ver a
      descrição completa em "Fornecedores" na seção 7. Não precisa de migration nova (só reaproveita
      tabelas já existentes: `pedidos_compra`, `fornecedores`, `pecas`, `cotacoes_pecas`,
      `estoque_movimentos`) — funciona assim que o código novo chegar na máquina dela
      (`git pull` + `npm install`), sem precisar rodar nada no SQL Editor.
   - Peças em Garantia **do fornecedor na compra** (diferente da garantia ao cliente já
     implementada) — não fazia parte da lista de 3 combinada com ela; sem ordem definida, fica
     pra quando ela sentir falta.
6. *(Custos por loja, preço e o plano de trabalho em equipe foram para o repositório privado `caranovavidanova/sakura-corp`, em 27/09/2026.)*

8. ✅ **Tela de configuração de conexão Supabase (multi-empresa)** — **construída nesta sessão**,
   ver "Conexão com o banco (multi-empresa)" na seção 7 pro funcionamento e pra pendência de
   publicação. Era o passo que travava a fase 2 (item 2 da seção 1): um amigo do pai dela vai
   comprar o sistema pras duas lojas dele, uma empresa diferente, que precisa de projeto Supabase
   próprio e isolado — e até aqui um instalador servia uma empresa só.

9. ✅ **Site de apresentação (`site/`) — CONSTRUÍDO, mas PARADO por decisão dela (28/08/2026)**.
   Página única em HTML/CSS puros com telas reais do sistema, pronta pra publicar na Vercel (3
   campos, passo a passo em `site/README.md`). **Ela disse explicitamente que não era prioridade
   ainda** — *"nem precisava ter feito site ainda... não vou mexer com isso agora"* — e pediu pra
   guardar tudo pra quando precisar. **Não retomar por conta própria**: só voltar a esse assunto
   se ela trouxer. O que fica pendente quando ela quiser publicar: apontar a Vercel pra pasta
   `site`, publicar uma `v0.9.22` (pra destravar o botão de download, ver "Empacotamento" na seção
   7) e decidir se entra um botão de WhatsApp (hoje o contato do site é só o e-mail dela; ela não
   chegou a passar um número).

10. **⚠️ PENDÊNCIA DA FASE 2 — contrato e papéis de LGPD, antes da primeira venda pra terceiro**
    (item `TR-12.2` do guia, escrito em 17/09/2026). Não é tarefa de código, e é por isso que ela
    não sai sozinha: **ela precisa levar isso a um advogado ou à contabilidade dela.** O texto em
    linguagem simples, de uma página, está em **`ANTES-DA-PRIMEIRA-VENDA.md`** na raiz do
    repositório — os seis pontos que a cláusula de tratamento de dados precisa ter e o registro
    de operações de tratamento já rascunhado com o que é verdade hoje.
    **Por que existe**: pela decisão de 28/08/2026, toda a infraestrutura fica nas contas dela
    (Supabase, Anthropic, Focus NFe), então na LGPD **a loja é controladora** dos dados dos
    clientes dela e **ela é operadora**. Enquanto quem usa é a borracharia do pai dela, isso é
    combinado de família; na primeira loja de terceiro, vira contrato — e é o tipo de coisa que
    ninguém resolve depois do incidente. **Não escrever contrato por ela e não afirmar nada como
    aconselhamento jurídico** (o próprio arquivo abre dizendo isso).
    O ponto mais fácil de esquecer, dos seis: **o que acontece quando o contrato acaba** — cópia
    dos dados pra loja, exclusão do resto, e em quantos dias cada coisa.

11. ✅ **Botão "Atualizar o banco de todas as empresas" — CONSTRUÍDO em 25/09/2026** (planejado
    na mesma data, construído na sessão seguinte, quando ela disse "pode fazer com força, sem
    pedir permissão"). **Rodado de verdade pela primeira vez no mesmo dia, e funcionou**: ela
    ensaiou (Pneus Amigão em `0057`, faltando `0058`/`0059`/`0060`, "✅ passaria") e depois
    aplicou ("✅ atualizado", ficou em `0060`), sem nenhum aviso de migration. O passo a passo
    está na seção 9, em "Atualizar o banco de todas as empresas".
    **O problema**: cada empresa tem o próprio projeto Supabase, e migration era colada à mão no
    SQL Editor de cada um. Com 3 bancos, cada migration nova vira 3 colagens — e esquecer um banco
    só aparece como a faixa de "banco desatualizado" (seção 7) naquela empresa.
    **Como ficou** (`.github/workflows/atualizar-bancos.yml` + `scripts/atualizar-bancos.mjs`):
    - **Só roda na mão**, a partir da `main`. Reaproveita o secret **`BACKUP_EMPRESAS`** (os campos
      `nome` e `banco`) — nenhum secret novo, e empresa que entra no backup entra no botão junto.
    - Pra cada banco, lê `max(versao)` de `schema_versao` (tabela da `0055`); **sem a tabela,
      recusa e explica**. Pendentes = as migrations do repositório com número maior, em **ordem
      numérica** (nunca alfabética).
    - **`ensaiar`** (o padrão): roda as pendentes de verdade numa transação e **desfaz** — pega
      até o erro que só existe por causa do dado daquela loja. **`aplicar`**: ensaia em TODOS
      primeiro e, se qualquer ensaio falhar, **não aplica em nenhum**; passando, aplica banco por
      banco na ordem da lista (Pneus Amigão primeiro, como canário), **cada migration na própria
      transação**, e **para no primeiro erro**. No fim, **confere de novo** a versão de cada banco.
    - **Trava de tempo de 15s** (`lock_timeout`) em toda migration: se a tabela estiver ocupada
      pela loja, a migration desiste em 15 segundos em vez de ficar esperando — esperar é o que
      congela a tela da loja, porque toda consulta nova entra na fila atrás do `alter table`.
    - Recusa rodar se achar banco **mais novo** que o código (sinal de branch antiga).
    - `concurrency` no mesmo grupo do backup: os dois nunca mexem no mesmo banco ao mesmo tempo.
    - O resultado sai em português, numa tabela, na página da própria rodada — e os avisos que
      uma migration quiser mostrar (`raise notice`) aparecem lá também.
    **Como foi conferido**: 19 testes com `psql` de mentira (`scripts/atualizar-bancos.test.ts`)
    e um teste contra **Postgres de verdade** (`npm run test:atualizar-bancos`, 22 conferências,
    roda no CI junto da matriz de RLS): três bancos montados com as migrations **reais** em
    versões diferentes, um com dado que faz a migration de teste falhar, um anterior à `0055`, e
    uma "loja" segurando a tabela de clientes. **Quatro mutações** ficaram vermelhas: ensaio que
    grava, aplicação sem transação, aplicar mesmo com ensaio ruim, e sem trava de tempo. A última
    **passou no teste de integração na primeira versão** (o ensaio esbarrava na trava antes e
    escondia a da aplicação) — foi preciso uma conferência a mais, direto no script de aplicação.
    **O que NÃO dá pra conferir daqui**: o Supabase de verdade. A primeira rodada real tem que
    ser em modo `ensaiar`.
    **Por que não os outros caminhos** (descartados no planejamento): a CLI do Supabase tem um
    histórico próprio que não conhece as migrations já rodadas; um script no PC dela exigiria a
    senha dos bancos e o Postgres no Windows; e o **app se atualizar sozinho ao abrir** é
    proibido — exigiria a senha principal do banco dentro do instalador, em cada computador.
    **Ideia pra depois, não pedida**: o Release conferir, antes de publicar, que nenhum banco
    está atrás da última migration.
    **Desde 26/09/2026 (migration `0063`) o botão também espera os computadores atrasados**:
    migration que declara `-- versao-minima-do-programa: X` no cabeçalho só é aplicada quando
    nenhum computador em uso (visto nos últimos 30 dias, na tabela `computadores`) está abaixo de
    X. Com algum atrasado, o ensaio mostra "⏸ passaria, mas espera N computador(es)" com o nome,
    a versão e quando cada um foi visto, e o aplicar não mexe em banco nenhum — a menos que a
    caixinha **"aplicar mesmo com computadores atrasados"** esteja marcada. Banco que ainda não
    registra computadores (antes da `0063`) ou que não viu nenhum em 30 dias: segue, avisando que
    não deu pra conferir. Não conseguir PERGUNTAR (erro na consulta) segura, como um ensaio que
    falhou. É a resposta à dúvida dela de 26/09 ("com muitas lojas, vamos ter que esperar todos
    atualizarem?"): só a migration que declara precisa esperar, e agora o botão sabe quem.
    Conferido com 13 testes de `psql` de mentira (seis mutações, todas vermelhas) e no teste de
    integração com Postgres de verdade (passo 8).

12. **Repositório só de versões (a trava de verdade das versões, e o primeiro passo pra fechar o
    código)** — combinado em 30/09/2026 pra **depois**. As versões (instalador + `latest.yml`)
    passam a ser publicadas num repositório público separado, onde colaborador não escreve, com um
    token dela guardado no cofre `lojas`. Fecha o furo do item 78 da seção 6 e é o pré-requisito
    pra deixar o `sakura-system-ace` privado. A transição e os custos estão no marco de 29-30/09 do
    `docs/historico.md`. **Cuidado barato até lá**: o Balcão no canal normal, pra versão de teste
    só chegar no PC dela.
13. **Painel da equipe** (`docs/painel.md`) — a **leva 0** foi criada em 30/09/2026 (issues #350 a
    #355): o painel no ar, login, a leva com contador e tempo real. Depois: a **leva 1** (a linha
    de produção completa: botão de pegar tarefa, fases da leva, horas por pessoa, relatório e
    aprovação) e o **financeiro com DRE**, que precisa de um banco privado (nunca no GitHub). O
    exemplo de DRE está no repositório privado (`dre/`).

Funcionalidades explicitamente **futuras** (não implementar sem pedido explícito, mas manter
arquitetura aberta): integração com maquininha de cartão (TEF), assistente de IA para estoque,
importador universal de dados de outros sistemas, versão mobile, outras edições do Sakura System
(ex: Supermarket Edition).

**Revisão de código** (`/code-review` nível `xhigh`, repositório inteiro): achou 4 bugs reais, todos
já corrigidos e validados (`buscarDepositoPadraoId()` sem depósito ativo, `excluirLoja()` incompleto
— ver item 20 da seção 6 pro detalhe completo —, `registrarCotacoes()` com preço 0 batendo no
`check (preco > 0)`, `ImportarNotaFiscalXmlModal.tsx` lendo XML sempre como UTF-8 mesmo quando o
prólogo declara ISO-8859-1). **Dívidas técnicas conhecidas, fora de escopo dessa revisão** (ficam
pra decidir com calma, não são bug): item 1 da seção 6 (permissão só checada na interface, sem RLS
por módulo) e item 4 (sem teste de UI/integração, só função pura).

**Estado geral**: o sistema está pronto pro uso real no dia a dia (cadastro, OS, estoque, caixa,
fornecedores etc.) — **e a emissão fiscal automática (NFC-e e NFS-e) já está funcionando em
produção** (ver item 1 desta seção), a última peça grande que faltava; a NFS-e já virou rotina
(notas 10 a 15 emitidas). Segue pendente o CSC/ID Token de **homologação** da NFC-e (não bloqueia
uso real, só testes) e, todo mês, o cadastro da alíquota da competência no portal da prefeitura
(item 1 desta seção — sem isso a primeira NFS-e do mês é recusada).

### Linha do tempo recente (o que cada sessão deixou pronto)

> Antes eram quatro relatórios longos de sessão, um embaixo do outro. Viraram esta tabela em
> 02/09/2026 — o que importa pra uma sessão nova é **o que está pronto hoje**, e isso já está nas
> seções 6, 7 e 8. Os relatórios completos estão no histórico do Git.

| Quando | O que saiu |
|---|---|
| 27/08 | **A parte fiscal fechou**: NFC-e e NFS-e emitiram em produção pela primeira vez (item 1 da seção 8). As OS de teste foram apagadas depois. |
| 28/08 (manhã) | Instalação de empresa nova num **arquivo SQL único** + checklist de venda (itens 36 e 37 da seção 6, seção 9). E o **site de apresentação** (`site/`), que ela pediu pra **guardar sem publicar** — ver item 9 da seção 8, não retomar sozinho. |
| 28/08 (tarde) | Leva de ajustes de uso real no balcão: parcelar cartão dentro do pagamento dividido, estado **"Finalizada"** da OS, "+ adicionar item" no rodapé, total por item, e a correção dos **três cálculos de lucro divergentes** (item 40 da seção 6). Tags `v0.9.21` a `v0.9.24`. |
| 31/08 | Campo numérico deixou de mudar sozinho pelas setas (item 41), calendário do Início passou a mostrar os dias do mês vizinho, e o **CSOSN `'500'` foi confirmado** pela contabilidade. Tag `v0.9.25`. |
| 01/09 | Primeira NFS-e de um mês novo revelou o **cadastro mensal de alíquota** exigido pela prefeitura (item 1 da seção 8) — tarefa recorrente, todo mês. |
| 02/09 | Baixar os XMLs de um mês num **`.zip` só**, a aba **Comissões**, e as **12 correções** das duas varreduras (itens 42 a 46 da seção 6). Tag `v0.9.26`. |
| 03/09 | Resposta do suporte da Focus NFe destravou a **NFC-e no CNPJ do cliente empresa**; período **Anual** em Relações; **Comissões** mudou pra dentro de Funcionários; botão do calendário visível. Tag `v0.9.27`, confirmada rodando na loja. |
| 08-11/09 | **Etapas 1 e 2 do guia de melhorias, inteiras** — CI, travas de fuso e de arquitetura, os dois itens fiscais (Ver DANFE, aviso da alíquota), acessibilidade/tipografia, cartões do Início, categoria obrigatória no caixa, e cadastrar cliente/veículo sem sair da OS. Tags `v0.9.28` a `v0.9.32`. |
| 12/09 | Fecha a Etapa 2 (estoque mínimo, campos fiscais explicados, WhatsApp, auditoria de contraste — tag `v0.9.33`) e saem **3 dos 7 itens da Etapa 3**: borda dos campos, correções de rateio, teste-ouro da nota e teste de tela nos formulários de dinheiro. Tag `v0.9.34`, **sem migration**. |
| 15/09 | A **tela de Diagnóstico** (`TR-08.1`) e o `ErrorBoundary` (metade do `TR-08.3`) — o que o operador do balcão manda quando liga pedindo socorro, sem senha nem chave dentro. Tag `v0.9.36`, **sem migration**. E, na mesma data, o **`TR-05.7`**: o banco passa a dizer em que versão está (migration `0055`, rodada por ela) e o app avisa em português qual arquivo falta rodar, em vez de estourar "column does not exist" numa tela qualquer. Tag `v0.9.37`. Etapa 4 em 6 de 12. |
| 17/09 | Dois itens da Etapa 4. `TR-12.2` — **contrato e papéis de LGPD** (`ANTES-DA-PRIMEIRA-VENDA.md`), registrado como pendência da fase 2: não é código, é uma tarde dela com advogado ou contabilidade. E `TR-04.6` — **endurecer o Electron**: política de segurança de conteúdo, a ponte da Focus NFe fechada nos dois endereços dela, todo pedido da tela conferido, nada navegando pra fora, as chavinhas gravadas no executável, e um teste que abre o app de verdade (`npm run test:electron`). **Sem migration**; a leva do `TR-04.6` saiu na tag `v0.9.38`. Etapa 4 em 8 de 12. |
| 18/09 (manhã) | `TR-12.1` — o **backup próprio do banco**, cifrado e em dois lugares fora do Supabase, rodando todo dia às 3h. Ela abriu uma cópia com as próprias mãos pra conferir. Não mexe no app, então **sem tag**. Etapa 4 em 9 de 12. |
| 18/09 (tarde) | `TR-04.3` — **dado de RH só pra quem tem o módulo** (migration `0056`): salário, CPF, RG, CNH e filhos deixam de ser escondidos só pela tela e passam a ser recusados pelo banco, sem tirar do balconista o que ele precisa pra montar uma OS. É a **primeira tabela da etapa 2 do `TR-04.1`**. Etapa 4 em 10 de 12. |
| 25/09 | Ela rodou a migration `0056` e a leva acima saiu na tag **`v0.9.39`** — a ordem obrigatória cumprida (SQL primeiro, porque a tela de OS passa a ler uma view que só existe depois dela). |
| 25/09 (noite) | `TR-04.2`, **parte 1 de 2** — o token da Focus NFe sai do computador: vai pra um cofre no banco (migration `0057`) e quem usa é o **porteiro**, a Edge Function `focus-nfe`, que confere quem pede e o CNPJ da nota antes de repassar. Ela rodou a `0057` e publicou a função; saiu na **`v0.9.41`**, **publicada e liberada** a pedido dela. Etapa 4 em 12 de 12 começados. |
| 25/09 (fim da noite) | A **apresentação comercial** em slides (pronta pra ela mandar ao pai) e o **"Importar por foto" desligado**, sem tag, a pedido dela. E conversa de fase 2: cenário de 2 empresas novas (uma com 2 lojas), **preço em aberto**, cuidados de contrato, e o plano do **botão de atualizar todos os bancos** (item 11 da seção 8). Computador dela marcado como Teste. |
| 25/09 (última leva) | Com "pode fazer com força": o **botão de atualizar os bancos**, o **fechamento de caixa do dia** (`TR-06.4`), a **comissão paga congelada** (`TL-46.1`), as **travas de dado impossível** (`TR-05.1`) e os **testes de migration no CI**. Migrations `0058`–`0060` rodadas **pelo botão**, na primeira rodada de verdade dele (banco na `0060`), e tudo saiu na **`v0.9.42`**, publicada e liberada. Etapa 3 em 6 de 7. |
| 25/09 (tarde) | `TR-09.1` — **canal de teste**: versão nova nasce como pré-lançamento e só chega no resto das lojas pelo workflow "Liberar versão para todas as lojas". Cada computador escolhe o canal em Configurações. **Sem migration.** Saiu na **`v0.9.40`**, publicada e liberada no mesmo minuto (a primeira rodada de verdade do Liberar). Etapa 4 em 11 de 12. |
| 26/09 | **TR-04.1, lote 2**: Contas a Pagar e Contas a Receber protegidas no banco (migration `0061`), com as duas portas estreitas (faturar OS, aba Comissões) e o Início mostrando "—" pra quem não tem o módulo. |
| 26/09 (noite) | **A versão de cada computador** (migration `0063`): cada computador se registra no banco a cada login, o admin vê a lista em Configurações, e o botão de atualizar os bancos passa a esperar os computadores atrasados quando uma migration declara versão mínima. Junto, backup e botão presos no Ubuntu 24.04 antes da troca de 19/10. A `0063` entrou pelo botão (banco na **`0063`**) e o programa saiu na **`v0.9.44`**, publicada e liberada no mesmo dia. |
| 27/09 | **Ficha do veículo** (item `FN-04`, sem migration): a história de um carro por placa — dono, KM mais recente e rodagem estimada, total faturado, visitas, peças na garantia e todas as OS. Abre pela placa em Clientes, OS e Garantias. Saiu na **`v0.9.46`**, publicada e liberada no mesmo dia. |
| 26/09 (fim da noite) | **Venda de balcão** (item `FN-09`, migration `0064`): vender peça pra quem não deixa o carro, numa tela só, com leitor de código de barras, pagamento e NFC-e; cliente "Consumidor" fixo pra quem não se identifica (escolha dela), mesmo contador de número das OS, aba própria na lista e fora do ticket médio. Com o "pode" dela: a `0064` entrou pelo botão (banco na **`0064`**) e a **`v0.9.45`** saiu publicada no canal de teste — e foi **liberada pras lojas em 27/09**. |
| 26/09 (tarde) | **TR-04.1, lote 3**: o Caixa protegido no banco (migration `0062`), com portas estreitas pra Relações, OS e as duas contas, e os cartões de dinheiro do Início mostrando "—" pra quem não tem Caixa nem Relações. Saíram na **`v0.9.43`** (publicada e liberada **antes** da migration, de propósito) e a `0061`+`0062` foram aplicadas pelo botão no mesmo dia — banco na **`0062`**. |
| 13/09 | Começa a **Etapa 4**, a que o guia trata como pré-requisito da venda: auditoria cobrindo criação e mais cinco tabelas (`TR-04.9`), o procedimento de voltar uma versão (`TR-09.2`) e a função de permissão por módulo (`TR-04.1`, etapa 1 de 3). Migrations `0053`/`0054` rodadas por ela e tag `v0.9.35` publicada. Depois da tag, sem precisar de outra: a **matriz de RLS** (`TR-07.3`), que confere 640 combinações de tabela × comando × papel e é o que faltava pra etapa 2 do `TR-04.1` deixar de ser feita no escuro. |
| 29-30/09 | Repositório transferido pra organização **`sakura-corp`** (`v0.9.47` só troca o endereço do atualizador; liberada). Senhas das automações refeitas e guardadas no Bitwarden; **cofres** `backup` e `lojas`, rulesets `main protegida` e `versões`; Release, Liberar e Atualizar bancos com aprovação dela. Memória com a seção 0 (quem não é a Sofia) e o **manual do painel**; leva 0 criada (#350 a #355). |


**Duas lições de trabalho que saíram dessas sessões e continuam valendo** (as duas já estão na
seção 1, mas é aqui que costumam ser lidas): *intenção futura não é autorização pra começar agora*
— o site foi construído na hora errada; e **não confiar neste arquivo pra saber a última versão
publicada** — conferir a lista real de releases, porque uma tag saiu sem atualizar o documento e a
sessão seguinte informou a versão errada pra ela.


