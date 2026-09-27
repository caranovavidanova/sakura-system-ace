# Estrutura de pastas e padrões de código

> Parte da memória do projeto. O índice é o `PROJETO_STATUS.md` (carrega sozinho em toda sessão);
> este arquivo só é aberto quando o assunto pede. Os números de seção e de item citados aqui
> ("item 33 da seção 6") continuam valendo: a seção 6 é `docs/licoes.md`, a 5 é `docs/banco.md`,
> a 7 é `docs/modulos.md`, a 8 é `docs/pendencias-e-futuro.md` e a 9 é `docs/operacao.md`.

## 4. Estrutura de pastas

```
amigao/                        (raiz do repositório GitHub: caranovavidanova/sakura-system-ace —
                                 renomeado nesta sessão, era "amigao"; a pasta local pode continuar
                                 se chamando "amigao" sem problema, é só o nome no GitHub que mudou)
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
│   │                             # veículo, pintado com a cor cadastrada), LinkPlaca.tsx (a placa
│   │                             # como botão que abre a ficha do veículo — em Clientes, na lista
│   │                             # de OS e em Garantias; FN-04), AreaRolavel.tsx (barra
│   │                             # de rolagem 100% customizada, ver seção 2), AcoesDaLinha.tsx
│   │                             # (ações de linha de lista: botão de ícone de 32x32 pro que é
│   │                             # do dia a dia + menu de três pontinhos pro que não dá pra
│   │                             # desfazer — ver item 51 da seção 6), LojaSwitcher.tsx
│   │                             # (seletor de loja ativa, só aparece com 2+ lojas — fica no
│   │                             # rodapé da Sidebar), Valor.tsx (valor em dinheiro com o
│   │                             # negativo parecendo negativo — cor, seta e sinal; exporta
│   │                             # também <Variacao>, o "+12% vs. mês passado" dos cartões do
│   │                             # Início — ver item 54 da seção 6), Explicacao.tsx (o "?" que
│   │                             # explica um número em uma frase, em portal pro <body> como o
│   │                             # menu de ações), AvisoVersaoBanco.tsx
│                             # (a faixa "o programa foi atualizado, mas o banco desta empresa
│                             # ainda não", com o nome do arquivo que falta rodar — aviso, nunca
│                             # tranca), ErrorBoundary.tsx (em volta das rotas em
│   │                             # App.tsx — erro de renderização virava janela em branco, agora
│   │                             # vira "Alguma coisa quebrou nesta tela" com saída pro Início e
│   │                             # pro Diagnóstico, e vai pro erros.log com a pilha de
│   │                             # componentes), VersaoApp.tsx (mostra a versão do app,
│   │                             # pequena, no canto inferior direito, lendo
│   │                             # window.sakuraApp.version exposto pelo preload), Combobox.tsx
│   │                             # (select com busca por digitação — abre mostrando a lista
│   │                             # inteira, mas deixa filtrar digitando; usado em todo select do
│   │                             # app cuja lista vem de dado dinâmico — peça, serviço, cliente,
│   │                             # veículo, técnico/vendedor, categoria etc. — ver seção 6 sobre o
│   │                             # bug de clique já corrigido nele; ganhou a opção `permitirLivre`
│   │                             # nesta sessão — quando ligada, aceita digitar um valor que não
│   │                             # está na lista de sugestões em vez de exigir escolher uma opção,
│   │                             # usado hoje só na Marca do veículo, ver seção 7 "Clientes"),
│   │                             # AvisoRascunho.tsx (faixa "restaurar rascunho não salvo?", usada
│   │                             # por todo formulário com auto-save — ver hooks abaixo),
│   │                             # BotaoWhatsapp.tsx (abre a conversa no WhatsApp com a mensagem
│   │                             # já escrita — usado em Contas a Receber, na lista de OS e em
│   │                             # Pedidos de compra; ver "WhatsApp" na seção 7)
│   ├── hooks/useSituacaoDoEsquema.ts  # compara a versão do banco com a que esta build espera,
│   │                             # uma vez por abertura (TR-05.7) — alimenta a faixa de aviso
│   ├── hooks/useEnterParaProximoCampo.ts  # Enter avança pro próximo campo em qualquer <form>
│   │                             # do app (em vez de tentar submeter) — aplicado uma única vez,
│   │                             # globalmente, em App.tsx + useLimparDataAoApagar.ts (nesta
│   │                             # sessão — Backspace/Delete num campo de data limpa o campo
│   │                             # inteiro em vez de não fazer nada, mesmo padrão de aplicação
│   │                             # global em App.tsx; ver item 27 da seção 6)
│   │                             # + useRascunhoFormulario.ts (auto-save local a cada 30s; o hook
│   │                             # `useRascunho` junta autosave + restaurar/descartar, usado por
│   │                             # OS, Cliente, Funcionário, Produto e Pedido de Compra)
│   ├── lib/                     # supabase.ts + conexao.ts (decide com qual Supabase/empresa este
│   │                             # computador fala — ver "Conexão com o banco" na seção 7)
│   │                             # + datas.ts (hojeLocal()/diaLocal() — o dia no fuso de quem usa,
│   │                             # nunca toISOString(), que é UTC; ver itens 34 e 42 da seção 6)
│   │                             # + zip.ts (monta .zip sem biblioteca externa, usado pra baixar
│   │                             # os XMLs de um mês de uma vez — ver "Notas Fiscais" na seção 7,
│   │                             # e o pacote da tela de Diagnóstico)
│   │                             # + diagnostico.ts (coleta o que a tela de Diagnóstico mostra:
│   │                             # as três checagens ao vivo, com tempo de cada uma, e os dois
│   │                             # registros em disco; a parte sem efeito colateral fica em
│   │                             # schemas/diagnostico.ts) + download.ts (salvarComoDownload,
│   │                             # compartilhado por notasFiscais.ts e pelo Diagnóstico)
│   │                             # + schemaVersao.ts (pergunta ao banco em que versão ele está,
│   │                             # e sabe diferenciar "banco antigo" de "sem rede" — item TR-05.7)
│   │                             # + registrarErros.ts (escuta erro de tela e manda gravar no
│   │                             # erros.log via IPC, com rota/usuário/loja/versão junto — ver
│   │                             # item 39 da seção 6)
│   │                             # + um arquivo por entidade (clientes.ts, pecas.ts,
│   │                             # servicos.ts, estoque.ts, ordensServico.ts, caixa.ts,
│   │                             # operadores.ts, funcionarios.ts (duas listas: `listarFuncionarios`
│                             # lê a tabela e exige o módulo; `listarFuncionariosPublico` lê a
│                             # view `funcionarios_publico`, que é o que os seletores da OS usam
│                             # — ver TR-04.3 na seção 5), notasFiscais.ts, auth.ts,
│   │                             # errors.ts (mensagemDeErro + a frase em português de cada
│   │                             # trava `ck_` do banco, MENSAGEM_DA_TRAVA), categorias.ts, categoriasCaixa.ts, categoriasServico.ts,
│   │                             # contagens.ts, garantias.ts, contasPagar.ts, lojas.ts, depositos.ts
│   │                             # (locais físicos de estoque dentro de uma loja — mesmo padrão CRUD
│   │                             # de lojas.ts, mas sem exclusão de verdade; expõe também
│   │                             # buscarDepositoPadraoId(), usada por lib/estoque.ts e por qualquer
│   │                             # fluxo que baixa/dá entrada em estoque sozinho sem perguntar "em
│   │                             # qual depósito" pro operador, ver seção 5) — lojas.ts e todo lib de
│   │                             # tabela per-loja recebem `lojaId` explícito nas funções de
│   │                             # listar/criar) + feriados.ts (feriados
│   │                             # nacionais, Páscoa calculada) + configuracoes.ts (juros de
│   │                             # parcelamento + texto de garantia + dados fiscais da loja, agora
│   │                             # uma linha por loja, filtradas por `lojaId`) +
│   │                             # garantiaTexto.ts + garantiaDocumento.ts (HTML da garantia) +
│   │                             # notaFiscalXml.ts (recibo HTML "versão para o cliente" a partir
│   │                             # do XML) + focusNfe.ts (integração com o Focus NFe — emissão
│   │                             # de NFC-e/NFS-e, ver seção 8 item 1; MONTA a nota aqui e pede
│   │                             # ao porteiro `focus-nfe` pra repassar — desde o TR-04.2 não
│   │                             # vê token nenhum) + corVeiculo.ts (nome de cor em
│   │                             # português → hex aproximado) + origemMercadoria.ts (lista de
│   │                             # códigos de origem da mercadoria, 0 a 8) + iaNotaFiscal.ts
│   │                             # (chama a Edge Function de leitura de nota fiscal por foto) +
│   │                             # + whatsapp.ts (abre a conversa no WhatsApp pela ponte do
│   │                             # Electron, com a URL conferida) + modelosWhatsapp.ts (os textos
│   │                             # editáveis por loja e o registro de que a mensagem foi ABERTA)
│   │                             # + computadores.ts (migration 0063: registra ESTE computador no
│   │                             # banco a cada login — nunca lança erro nem trava o login — e
│   │                             # lista/apelida/esquece os computadores pro admin)
│   │                             # + veiculos.ts (a ficha do veículo: o carro, o dono e TODAS as
│   │                             # OS dele, de todas as lojas que a RLS deixa ver — FN-04)
│   │                             # fornecedores.ts + pedidosCompra.ts + cotacoesPecas.ts (histórico
│   │                             # de preço por fornecedor, ver "Cotação de peças" na seção 7) +
│   │                             # notaFiscalXmlFornecedor.ts (lê o XML de NFe que o fornecedor
│   │                             # emite pra loja — puro parsing com `DOMParser`, sem IA nem Edge
│   │                             # Function, é formato público/estável do governo — usado pelo
│   │                             # "Importar XML de nota fiscal" em Pedidos de Compra, ver seção
│   │                             # 7; módulo de Fornecedores) +
│   │                             # auditoria.ts (só leitura — `listarAuditoria`, filtra por
│   │                             # tabela/ação/operador; a escrita é 100% via trigger de banco, ver
│   │                             # seção 5) + marcasVeiculo.ts (nesta sessão — lista estática de
│   │                             # ~80 montadoras, usada só como sugestão no Combobox de Marca do
│   │                             # veículo, ver seção 7 "Clientes")
│   ├── pages/<modulo>/           # uma pasta por módulo: painel, clientes, estoque, fornecedores,
│   │                             # servicos, ordens-servico, caixa, contas-pagar, relatorios (rota
│   │                             # /relatorios, label "Relações" — abas Gráficos/Lucratividade,
│   │                             # absorveu o antigo módulo "Lucratividade"), garantias,
│   │                             # notas-fiscais, funcionarios, auditoria (admin-only, sem entrada
│   │                             # em MODULOS — acesso via ícone no rodapé da Sidebar, igual
│   │                             # Configurações, não é permissão de operador comum), login,
│   │                             # diagnostico (só DiagnosticoPage.tsx — visível pra QUALQUER
│   │                             # operador, ícone no rodapé da Sidebar ao lado de Configurações;
│   │                             # ver "Diagnóstico" na seção 7),
│   │                             # conexao (só ConexaoPage.tsx — tela de conectar ao banco da
│   │                             # empresa, aparece no lugar do login enquanto não há conexão
│   │                             # salva; sem permissão nem rota, é decidida em App.tsx),
│   │                             # configuracoes. Cada pasta tem
│   │                             # <Modulo>Page.tsx (lista) + <Modulo>Form.tsx (formulário), com
│   │                             # exceções:
│   │   login/          # LoginPage.tsx + TrocarSenhaPage.tsx (nesta sessão — tela cheia,
│   │                   # bloqueante, aparece no lugar do app normal quando
│   │                   # `operador.deve_trocar_senha` é true; ver "Login e permissões" na seção 7)
│   │   clientes/       # ClienteForm.tsx (orquestrador, ~100 linhas) + campos/ (DadosClienteFields,
│   │                   # EnderecoFields, VeiculosFields — este último usa useFieldArray, com um
│   │                   # `<input type="hidden">` pro `id` do veículo existente, ver seção 4).
│   │                   # **Segundo módulo migrado** pro padrão `react-hook-form` + `zod`.
│   │   estoque/       # EstoquePage.tsx com 4 abas: Produtos (ProdutosSection.tsx + PecaForm.tsx —
│   │                   # orquestrador, ~80 linhas, terceiro módulo migrado pro padrão
│   │                   # react-hook-form + zod — + campos/ com DadosCadastraisFields,
│   │                   # TributosFields (cada campo fiscal com um "?" explicando de onde tirar o
│   │                   # valor, e o CST/CSOSN já sugerido com o código que a loja mais usa),
│   │                   # PrecosFields (custo/margem%/preço final calculados entre si, ver
│   │                   # schemas/peca.ts; avisa quando o preço fica abaixo do custo) e PneuFields
│   │                   # (medida, índice de carga/velocidade e DOT — só aparece quando a categoria
│   │                   # escolhida é a de Pneus) + ImportarNotasFiscaisModal.tsx — leitura por
│   │                   # foto), Movimentações (MovimentacoesSection.tsx + MovimentoForm.tsx),
│   │                   # Contagem (ContagemSection.tsx — inventário físico), Relatórios
│   │                   # (RelatoriosEstoqueSection.tsx). Sem módulo "Peças" separado.
│   │   fornecedores/   # FornecedoresPage.tsx (orquestrador de abas) com abas "Cadastro"
│   │                   # (FornecedoresSection.tsx + FornecedorForm.tsx, igual padrão
│   │                   # Clientes/Serviços) e "Pedidos de compra" (PedidosCompraSection.tsx +
│   │                   # PedidoCompraForm.tsx — itens via useFieldArray, igual OS — +
│   │                   # PedidoCompraItemRow.tsx, mesmo espírito do ItemOSRow.tsx: mostra as
│   │                   # cotações anteriores daquela peça por fornecedor ao escolher a peça, com
│   │                   # botão "usar esse preço" — + ReceberPedidoModal.tsx +
│   │                   # ImportarNotaFiscalXmlModal.tsx — lê o XML da nota fiscal do fornecedor e
│   │                   # já cria um pedido "recebido" com entrada de estoque e cotação, ver seção
│   │                   # 7)
│   │   garantias/      # GarantiasPage.tsx é só lista (deriva de ordens_servico_itens +
│   │                   # pecas.prazo_garantia_dias, sem tabela própria)
│   │   veiculos/       # FichaVeiculoPage.tsx — a ficha do veículo, rota /veiculos/:id, só
│   │                   # leitura (FN-04). Sem entrada no menu: abre pela placa
│   │   servicos/       # catálogo de serviços, só lista + form (com categoria via
│   │                   # categorias_servicos), sem abas
│   │   ordens-servico/ # OrdemServicoForm.tsx (orquestrador, ~240 linhas — quarto módulo migrado
│   │                   # pro padrão react-hook-form + zod, ver "Padrão de formulário" na seção 4)
│   │                   # + campos/ (DetalhesFields, ItensFields — usa useFieldArray pros itens
│   │                   # novos da OS, itens já lançados continuam só leitura) + ItemOSRow.tsx
│   │                   # (linha de peça/serviço — trocar peça/serviço auto-preenche descrição e
│   │                   # preço, select fica controlado via watch/setValue em vez de register, ver
│   │                   # seção 4) + FaturamentoCard.tsx (faturamento com parcelas calculadas, ainda
│   │                   # não migrado) + FechamentoTab.tsx (NFC-e/NFS-e + garantia, só aparece com
│   │                   # status concluída/faturada) + GarantiaVisualModal.tsx
│   │                   # + VendaBalcaoForm.tsx (a venda de balcão — leitor de código de barras,
│   │                   # peças, pagamento com o mesmo FaturamentoCard; FN-09, migration 0064)
│   │                   # + VendaBalcaoDetalhe.tsx (uma venda já registrada: fechamento + Faturar)
│   │   configuracoes/  # JurosParcelasSection.tsx, CategoriasSection.tsx, CategoriasCaixaSection.tsx,
│   │                   # CategoriasServicoSection.tsx, TextoGarantiaSection.tsx,
│   │                   # ModelosWhatsappSection.tsx (os textos que o sistema abre no WhatsApp),
│   │                   # DadosFiscaisSection.tsx, CartoesInicioSection.tsx (todas dentro de
│   │                   # SecaoRecolhivel e recebem `lojaId` — dado por loja agora);
│   │                   # AtualizacoesComputadorSection.tsx (a exceção: NÃO mora no banco — é o
│   │                   # canal de atualização DESTE computador, item TR-09.1);
│   │                   # ComputadoresSection.tsx (em que versão está cada computador da
│   │                   # empresa — lê a tabela `computadores`, migration 0063); LojasSection.tsx
│   │                   # (criar/inativar lojas, sempre visível, mesmo padrão do card Operadores);
│   │                   # OperadorForm.tsx ganhou multi-select de lojas (só aparece com 2+ lojas)
│   │   funcionarios/   # FuncionariosPage.tsx (orquestrador de abas Cadastro/Comissões) +
│   │                   # FuncionariosSection.tsx (lista + formulário) + ComissoesSection.tsx
│   │                   # (comissão por funcionário, veio de relatorios/ em 03/09/2026 — ver
│   │                   # seção 7) + FuncionarioForm.tsx (orquestrador enxuto, ~140 linhas) com abas "Dados
│   │                   # gerais" e "Família" + campos/ (um componente por grupo de campos:
│   │                   # IdentificacaoFields, DocumentosFields, EnderecoFields, ContatoFields,
│   │                   # CargoAdmissaoFields, FiliacaoFields, ConjugeFields, FilhosFields — este
│   │                   # último usa useFieldArray do react-hook-form pra lista dinâmica de filhos
│   │                   # — + FormCompartilhado.tsx com Secao/Campo/inputClasse reaproveitados).
│   │                   # **Primeiro módulo migrado pro padrão novo de formulário** (react-hook-form
│   │                   # + zod, ver "Padrão de formulário" logo abaixo) — referência pra migrar os
│   │                   # demais formulários do app quando for a vez deles.
│   │   caixa/          # CaixaPage.tsx (orquestrador de abas) + DiarioSection.tsx +
│   │                   # EntradaSaidaSection.tsx (reusado por Entradas/Saídas, parametrizado por tipo)
│   │   notas-fiscais/  # NotasFiscaisPage.tsx com abas NFe/NFS-e + ArquivosSection.tsx +
│   │                   # NotaFiscalVisualModal.tsx (recibo "versão para o cliente")
│   │   contas-pagar/   # ContasPagarPage.tsx + ContaPagarForm.tsx + PagarContaModal.tsx
│   │   contas-receber/ # ContasReceberPage.tsx + ReceberContaModal.tsx + ContaReceberForm.tsx
│   │                   # (nasce sozinha ao faturar uma OS escolhendo "a receber", e desde esta
│   │                   # sessão também dá pra lançar à mão, igual Contas a Pagar)
│   │   relatorios/     # RelatoriosPage.tsx (orquestrador de abas) + GraficosSection.tsx (barras +
│   │                   # radar, ex-conteúdo do antigo módulo "Relatórios") + LucratividadeSection.tsx
│   │                   # (margem por peça/serviço, ex-módulo "Lucratividade" separado, agora conta o
│   │                   # custo de serviço também, não só de peça). A aba Comissões morava aqui e
│   │                   # foi pra funcionarios/ em 03/09/2026.
│   ├── schemas/                  # esquemas zod de validação de formulário + funções de mapeamento
│   │                             # form↔banco, e as contas de dinheiro como funções puras
│   │                             # testáveis (metricasCaixa.ts — lucro/custo/ticket médio
│   │                             # compartilhados; faturamento.ts — juros/parcelas/rateio;
│   │                             # comissoes.ts — comissão por vendedor e por técnico;
│   │                             # painelInicio.ts — as contas da tela Início: janela dos
│   │                             # cartões, comparação com a mesma fatia do mês anterior,
│   │                             # contas a vencer nos próximos 15 dias e idade de uma OS;
│   │                             # dinheiro.ts — paraCentavos/deCentavos/arredondarCentavo/somar
│   │                             # + formatarMoeda,
│   │                             # as contas de centavo num lugar só: a MESMA expressão de
│   │                             # arredondamento estava copiada 12 vezes em 7 arquivos, ver
│   │                             # item 49 da seção 6) + arquitetura.test.ts (não testa conta
│   │                             # nenhuma — varre src/pages/ e reprova conta de dinheiro escrita
│   │                             # dentro de uma tela, item 49)
│   │                             # estoque.ts — o que o saldo de uma peça está dizendo
│   │                             # (negativo/zerado/abaixo do mínimo) e a busca da lista de
│   │                             # Produtos, inclusive o casamento exato de código de barras;
│   │                             # canalAtualizacao.ts — por qual canal este computador
│   │                             # recebe versão nova e como isso vira `allowPrerelease`; o
│   │                             # teste roda o GitHubProvider DE VERDADE do electron-updater
│   │                             # contra um GitHub de mentira (item TR-09.1);
│   │                             # identidadeComputador.ts — o `computador.json` de cada
│   │                             # máquina (sem import nenhum: roda também no main.ts);
│   │                             # computadores.ts — versão comparada como número, "em uso"
│   │                             # (30 dias) e quem está numa versão mais antiga (0063);
│   │                             # fichaVeiculo.ts — as contas da ficha do veículo (KM mais
│   │                             # recente, rodagem média ESTIMADA, visitas, total faturado,
│   │                             # peças na garantia; FN-04) + garantia.ts (o vencimento da
│   │                             # garantia, em dia de calendário — usado pela ficha E pela tela
│   │                             # de Garantias, pra as duas darem o mesmo dia);
│   │                             # vendaBalcao.ts — a venda de balcão: incluir peça (o
│   │                             # leitor soma na mesma linha), o Enter da busca, total,
│   │                             # "a receber" só com cliente de verdade (FN-09);
│   │                             # whatsapp.ts — telefone no formato do wa.me, marcadores das
│   │                             # mensagens e os textos padrão;
│   │                             # diagnostico.ts — mascararSegredos (esconde a chave deste
│   │                             # computador e mais cinco formatos conhecidos), o resumo pro
│   │                             # WhatsApp (que NÃO leva linha de registro nenhuma) e o
│   │                             # relatório do .zip, tudo função pura testada — ver
│   │                             # "Diagnóstico" na seção 7
│   │                             # (ex: funcionario.ts — paraValoresFormulario,
│   │                             # paraNovoFuncionario, paraFilhosPreenchidos). Pasta nova —
│   │                             # `funcionario.ts`, `cliente.ts`, `peca.ts` até agora (este último
│   │                             # também guarda o cálculo custo↔margem%↔preço final) — ver
│   │                             # "Padrão de formulário" abaixo.
│   ├── styles/globals.css       # paleta Sakura System (Tailwind v4 @theme)
│   └── types/                    # um arquivo por entidade + loja.ts (Loja, NovaLoja) +
│                                  # configuracao.ts (JurosParcela, ConfiguracaoGarantia,
│                                  # ConfiguracaoFiscalLoja — todas com `loja_id` no lugar do antigo
│                                  # `id: 1`, ver seção 5) + itemNotaFiscal.ts (item extraído da
│                                  # leitura por IA) + cotacaoPeca.ts (histórico de preço por
│                                  # fornecedor, sem `loja_id` — compartilhado, ver seção 7) +
│                                  # notaFiscalXmlFornecedor.ts (item extraído do XML de NFe do
│                                  # fornecedor — não confundir com itemNotaFiscal.ts, que é o
│                                  # item da leitura por foto/IA)
├── supabase/migrations/          # SQL numerado sequencialmente (0001 a 0064), todas idempotentes
├── supabase/instalacao/          # instalacao-completa.sql (as 54 migrations concatenadas num
│                                  # arquivo só, pra instalar empresa nova colando UMA vez — GERADO
│                                  # por `npm run gerar-instalacao`, não editar à mão) +
│                                  # INSTALAR-LOJA-NOVA.md (o checklist que ela segue de verdade ao
│                                  # vender: banco, Auth, primeiro admin, app, configuração inicial,
│                                  # e o que costuma dar errado). Ver seção 9
├── supabase/scripts/             # SQL de uso único, NÃO faz parte da sequência de migrations —
│                                  # stub-supabase-local.sql (cria os schemas auth/storage e as
│                                  # permissões que o Supabase dá sozinho, pra validar migrations e
│                                  # testar RLS num Postgres local — NUNCA rodar no Supabase real) +
│                                  # testar-auditoria.sql e testar-permissao-modulo.sql (TESTE, não
│                                  # instalação — desde 25/09/2026 TODOS os testar-*.sql rodam
│                                  # sozinhos no CI, `npm run test:sql`; à mão: rodam num Postgres local depois da
│                                  # instalacao-completa.sql e estouram com "FALHOU: ..." se algo
│                                  # quebrar — o primeiro prova, entre outras coisas, que o token
│                                  # da Focus NFe sai mascarado na trilha de auditoria; o segundo,
│                                  # que um balconista só-Caixa é recusado em "clientes"; e
│                                  # testar-rh-permissao.sql prova as DUAS metades do TR-04.3 —
│                                  # que o balconista não alcança salário/CPF/filhos, e que
│                                  # mesmo assim ainda monta uma OS pela view pública; e
│                                  # testar-porteiro-focus-nfe.sql prova o cofre do TR-04.2 —
│                                  # ninguém lê o token, só admin da loja grava, e a regra de
│                                  # quem emite/cancela bate com a da tela; e
│                                  # testar-fechamento-caixa.sql, testar-comissoes-pagas.sql e
│                                  # testar-travas-de-dado.sql (0058 a 0060) e
│                                  # testar-contas-permissao.sql (0061) e
│                                  # testar-caixa-permissao.sql (0062) e
│                                  # testar-computadores.sql (0063). NUNCA
│                                  # rodar no Supabase real: gravam e apagam dado de teste) +
│                                  # limpar-dados-de-teste.sql
 (apaga dados de negócio de teste,
│                                  # preserva login/config; ver seção 5) + excluir-os-teste-eduarda.sql
│                                  # (uso único, criado numa sessão pra apagar as OS de teste abertas
│                                  # em nome de "Eduarda Cristina" na loja real, sem tocar no cadastro
│                                  # do cliente/veículo — ver "Empacotamento"/nota fiscal na seção 7/8)
│                                  # + excluir-os-teste-nfse-producao.sql (mesmo padrão, preparado
│                                  # nesta sessão pra limpar a OS usada no teste de NFS-e em PRODUÇÃO
│                                  # sugerido pelo suporte da Focus NFe — troca o número da OS antes
│                                  # de rodar; ver item 1 da seção 8)
├── supabase/testes-rls/          # `npm run test:rls` — a MATRIZ DE RLS (item TR-07.3). Monta um
│                                  # banco descartável do zero, simula cinco papéis (admin das duas
│                                  # lojas, admin de uma, balconista só-Caixa, operador SEM loja, e
│                                  # ninguém logado) e confere as 760 combinações de
│                                  # tabela × comando × papel — a view do TR-04.3 entra junto, e
│                                  # é o caso que mais importa, porque view não reage a RLS.
│                                  # expectativas.csv é A PARTE QUE SE
│                                  # REVISA — cada número é "quantas linhas este papel consegue
│                                  # mexer", então mudança de segurança aparece no diff do PR em vez
│                                  # de sumir dentro de uma migration; lacunas-de-proposito.csv
│                                  # declara os comandos que, de propósito, não têm policy nenhuma.
│                                  # cenario.sql / sondas.sql / matriz.sql / rodar.mjs são o
│                                  # encanamento. Ver README.md da pasta e o item 63 da seção 6.
│                                  # NÃO roda no Windows (precisa de Postgres e psql) — é do CI
├── supabase/functions/           # Edge Functions (Deno) — ler-notas-fiscais/index.ts: lê fotos ou

│                                  # PDFs de nota fiscal via Claude/Anthropic e devolve os produtos
│                                  # estruturados (a ANTHROPIC_API_KEY fica só como secret dessa
│                                  # função no Supabase, nunca no app instalado); e
│                                  # redefinir-senha-operador/index.ts (nesta sessão): admin gera
│                                  # senha temporária pra outro operador — usa a service role key
│                                  # (só o Supabase injeta sozinha, sem secret manual pra
│                                  # configurar), ver "Login e permissões" na seção 7; e
│                                  # focus-nfe/index.ts (TR-04.2): o PORTEIRO da Focus NFe —
│                                  # guarda o uso do token, confere quem pede (permissão, CNPJ
│                                  # da nota, nota registrada antes de cancelar) e só repassa o
│                                  # que o programa montou. Sem `import` nenhum, de propósito:
│                                  # o mesmo arquivo roda no Supabase e no Vitest
│                                  # (index.test.ts, 36 testes com um fetch de mentira).
├── site/                         # site de apresentação (HTML/CSS puros, SEM etapa de build —
│                                  # de propósito: uma página só não justifica um segundo
│                                  # node_modules, e assim não atrapalha build/teste do app).
│                                  # index.html (todo o texto), styles.css (mesma paleta do app),
│                                  # telas/*.jpg (imagens do sistema com dados inventados),
│                                  # ferramentas/ (abre o app de verdade num navegador com o
│                                  # Supabase respondido por dados inventados, e fotografa as
│                                  # cenas.mjs (a lista das 54 telas, com os cliques pra chegar em
│                                  # cada uma) + percorrer-telas.mjs (abre o app, faz login e visita
│                                  # as 54, chamando quem pediu em cada tela — usado pelo gerador de
│                                  # imagens E pela varredura de contraste) + playwright.mjs (acha o
│                                  # Playwright sem ele virar dependência do projeto) +
│                                  # telas — ver site/README.md): banco-falso.mjs (o Supabase de
│                                  # mentira, compartilhado) + dados-demo.mjs (os dados
│                                  # inventados, cobrem TODAS as tabelas) + gerar-telas.mjs (as
│                                  # 5 imagens do site) + gerar-catalogo-telas.mjs (as 54 telas
│                                  # do sistema, inclusive formulários/abas/janelas que só
│                                  # aparecem depois de clicar; escreve junto um catalogo.json
│                                  # com título e explicação de cada uma — ver "Onde tudo parou
│                                  # (10/09/2026)"), README.md (como ver, publicar na Vercel e
│                                  # regerar as imagens)
├── build/icon.png                # ícone do app (1024x1024, gerado a partir de public/sakura-icon.svg)
├── scripts/gerar-instalacao-completa.mjs # `npm run gerar-instalacao` — regera
│                                  # supabase/instalacao/instalacao-completa.sql a partir das
│                                  # migrations. Rodar SEMPRE que criar uma migration nova; o
│                                  # `npm test` reprova se o arquivo estiver desatualizado
│                                  # (scripts/gerar-instalacao-completa.test.ts)
├── scripts/varredura-contraste-dom.mjs # `npm run contraste:telas` — abre o app de VERDADE,
│                                  # percorre as 54 telas e mede a cor que a pessoa enxerga,
│                                  # compondo cada fundo translúcido com o que está atrás dele.
│                                  # medir-contraste.mjs é a medição em si; divida-de-contraste.mjs
│                                  # é a lista do que já estava abaixo da WCAG antes disto existir
│                                  # e ainda não foi corrigido — ela encolhe, nunca cresce.
│                                  # Ver item TR-01.3 e o item 58 da seção 6
├── scripts/varredura-contraste.mjs # `npm run contraste` — procura combinação de fundo/letra
│                                  # ilegível nas classes do app (sobra do tema claro antigo), ver
│                                  # item 17 da seção 6
├── scripts/testar-electron.mjs    # `npm run test:electron` — abre o app NO ELECTRON DE
│                                  # VERDADE (Playwright + xvfb) e confere 22 coisas: o preload
│                                  # rodou até o fim, as travas de segurança da janela, a CSP
│                                  # recusando script embutido e endereço fora da lista, e — do
│                                  # outro lado — que ela NÃO quebrou o estilo do React nem os
│                                  # iframes de garantia/recibo/DANFE. É o único teste que pega
│                                  # preload quebrado em silêncio (item 18 da seção 6). NÃO roda
│                                  # no Windows dela: é checagem de CI, como a matriz de RLS
├── scripts/ligar-fuses.mjs        # grava as "chavinhas" de segurança dentro do executável no
│                                  # build (`build.afterPack`) — sem elas, quem tem o app
│                                  # instalado roda o `.exe` como um Node.js comum. Ver item
│                                  # TR-04.6 e o comentário do próprio arquivo sobre a chavinha
│                                  # que ficou de fora de propósito (integridade do asar, que
│                                  # exige electron-builder 26)
├── scripts/checar-versao-electron.mjs # "o Electron deste projeto ainda recebe correção de
│                                  # segurança?" — roda sozinho uma vez por mês
│                                  # (.github/workflows/electron-desatualizado.yml). Reprova só
│                                  # quando a linha em uso sai do suporte, nunca por haver
│                                  # versão nova: aviso que aparece toda semana vira aviso
│                                  # ignorado. **Hoje ele está vermelho de propósito** — ver
│                                  # "Onde parou (17/09/2026)"
├── scripts/testar-sql.mjs         # `npm run test:sql` — roda cada supabase/scripts/testar-*.sql
│                                  # num banco limpo (cópia de um modelo com a instalação completa)
│                                  # e exige "TODAS AS CHECAGENS PASSARAM". Script novo entra
│                                  # sozinho; script que não diz a frase reprova. Só CI/Linux
├── scripts/testar-nos-dois-fusos.mjs # `npm run test:fusos` — roda a suíte DUAS vezes, em
│                                  # America/Sao_Paulo e em UTC. Está em .mjs porque
│                                  # `TZ=x npm test` não funciona no PowerShell do Windows dela.
│                                  # Ver item 48 da seção 6
├── .github/workflows/ci.yml      # CI — roda em todo push/PR as cinco checagens que antes eram
│                                  # feitas à mão: typecheck, lint, testes nos dois fusos,
│                                  # contraste e "o instalacao-completa.sql está em dia?". Tem mais
│                                  # quatro jobs próprios: contraste nas telas, a MATRIZ DE RLS
│                                  # (sobe um Postgres de serviço, e no mesmo banco roda o botão de
│                                  # atualizar bancos e os testes de cada migration), "Electron de verdade" (o
│                                  # `npm run test:electron`) e "segredos", que varre
│                                  # credencial e barra certificado digital versionado. NÃO builda
│                                  # o instalador (isso é do release.yml). Ver item 48 da seção 6

├── .github/workflows/backup-banco.yml # o backup próprio do banco (item TR-12.1), todo dia
│                                  # às 03:00 de Brasília. Tira a cópia de CADA empresa listada
│                                  # no secret BACKUP_EMPRESAS, cifra com a chave pública do age
│                                  # e guarda em DOIS lugares fora do Supabase: um repositório
│                                  # privado (anexo de release) e o Cloudflare R2. Dentro de cada
│                                  # cópia: o schema public COM as permissões, auth.users (senão
│                                  # ninguém entra no banco restaurado) e os XMLs das notas
│                                  # fiscais, que não ficam no banco. A chave que ABRE não está
│                                  # no GitHub. Empresa nova entra editando só o secret.
│                                  # Ver RESTAURAR-BACKUP.md e a seção 9
├── scripts/retencao-backup.mjs   # a regra de qual cópia fica e qual vai embora (30 diárias + a
│                                  # primeira de cada um dos últimos 12 meses), com teste. É
│                                  # "guarde as N mais recentes", NUNCA "apague o que tem mais de
│                                  # N dias" — se o job parar dois meses e voltar, a regra por
│                                  # idade apagaria o acervo inteiro de uma vez. E nome que ela
│                                  # não entende nunca é apagado
├── RESTAURAR-BACKUP.md           # "deu problema no banco — e agora?", em uma página e em
│                                  # linguagem simples. A primeira tabela manda NÃO usar backup
│                                  # na maioria dos casos: "apaguei uma OS sem querer" se resolve
│                                  # na Auditoria, em minutos. Restaurar num caso que não pedia
│                                  # transforma problema pequeno em problema grande
├── .github/workflows/release.yml # builda + publica o instalador Windows no GitHub Releases quando uma tag "v*" é enviada
│                                  # (NÃO embute mais a conexão do Supabase — ver seção 7). O
│                                  # electron-builder só BUILDA (`--publish never`); quem publica
│                                  # é o `gh`, arquivo por arquivo, com o latest.yml POR ÚLTIMO —
│                                  # ver item 66 da seção 6 pro estrago que motivou isso.
│                                  # Desde o TR-09.1 a release nasce como PRÉ-LANÇAMENTO: só o
│                                  # canal de teste recebe, até ela rodar o workflow abaixo
├── .github/workflows/liberar-versao.yml # "Liberar versão para todas as lojas" — só roda na
│                                  # mão, com a versão digitada. Chama o script abaixo
├── scripts/liberar-versao.mjs    # confere a release (inteira? anúncio bate com o instalador,
│                                  # pela impressão digital?) ANTES de liberar, e confere de fora
│                                  # DEPOIS. Voltar atrás = liberar a versão boa anterior. Com teste
├── .github/workflows/atualizar-bancos.yml # "Atualizar o banco de todas as empresas" — só
│                                  # na mão, modos ensaiar/aplicar. Lê o BACKUP_EMPRESAS. Chama:
├── scripts/atualizar-bancos.mjs  # a lógica (o que falta em cada banco, ensaio que desfaz,
│                                  # aplicação uma migration por transação, trava de tempo de
│                                  # 15s). Teste com psql de mentira ao lado, e
│                                  # atualizar-bancos.integracao.mjs contra Postgres de verdade
│                                  # (`npm run test:atualizar-bancos`, só no CI/Linux). Ver
│                                  # item 11 da seção 8
├── .gitleaks.toml                # regras da varredura de segredo do CI. Tem 3 regras próprias
│                                  # além das de fábrica, porque as de fábrica deixavam passar
│                                  # justamente `sb_secret_...` (Supabase) e `sk-ant-...`
│                                  # (Anthropic) — testado, não suposto. Ver item 49 da seção 6.
│                                  # Tem também uma liberação POR CONTEÚDO (`[allowlist] regexes`,
│                                  # só passa o que diz `naopodevazar`) pras credenciais de mentira
│                                  # do teste da máscara do Diagnóstico — liberar o caminho do
│                                  # arquivo inteiro tiraria do radar justo onde credencial de
│                                  # exemplo é rotina. Ver item 64 da seção 6
├── eslint.config.js              # flat config do ESLint 9 — além das regras de hooks, tem a
│                                  # trava contra cortar o dia de um timestamp em UTC
│                                  # (`no-restricted-syntax`), ver item 48 da seção 6
├── vitest.config.ts              # config de teste separado do vite.config.ts de propósito (não
│                                  # carrega os plugins do Electron, que não fazem sentido numa
│                                  # rodada de teste unitário puro) — `npm test` roda uma vez,
│                                  # `npm run test:watch` fica observando arquivo mudar. Testes
│                                  # ficam ao lado do arquivo testado (`<arquivo>.test.ts`), não
│                                  # numa pasta `__tests__` separada.
├── MELHORIAS.md                  # GUIA DE MELHORIAS (11/09/2026) — um cardápio priorizado de mais
│                                  # de cem sugestões: 12 eixos transversais (TR-nn), as 54 telas
│                                  # uma a uma (TL-nn), 15 funcionalidades que faltam (FN-nn) e um
│                                  # roteiro em 5 etapas. Cada item tem prompt pronto, critério de
│                                  # aceite e um "não mexer".
│                                  # **NÃO é ordem de execução** — ela escolhe o que entra em cada
│                                  # sessão, pelo código do item (ex: "faz o TR-11.1").
│                                  # **De propósito, este arquivo NÃO é carregado sozinho** (não
│                                  # está nos `@imports` do CLAUDE.md): são 227 KB, que em toda
│                                  # sessão nova gastariam contexto que faz falta pro trabalho de
│                                  # verdade. Abrir só quando ela citar um item ou pedir sugestão
│                                  # de próximo passo.
│                                  # A Etapa 1 dele já foi feita (ver "onde parou", 11/09/2026).
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
- **Toda migration nova termina registrando a própria versão** (desde a `0055`, item TR-05.7):
  `insert into schema_versao (versao) values (<número da migration>) on conflict do nothing;`
  Sem essa linha o aviso de "banco desatualizado" do app **mente** — ele passa a acusar um banco
  em dia. O `npm test` reprova quem esquecer (`scripts/gerar-instalacao-completa.test.ts`), e a
  constante `VERSAO_ESQUEMA_ESPERADA` (`src/schemas/versaoEsquema.ts`) sobe junto.
- **Migration que aperta uma regra que a versão ANTERIOR do programa usava** (é a exceção — o
  caso da `0062`) declara no cabeçalho a versão mínima do programa, numa linha própria:
  `-- versao-minima-do-programa: 0.9.44`. Com ela, o botão "Atualizar o banco de todas as
  empresas" só aplica quando nenhum computador em uso está abaixo dessa versão (desde a `0063`,
  ver seção 9). Migration que só ACRESCENTA — quase todas — não leva a linha. Versão torta na
  linha recusa a rodada inteira, de propósito.

**Padrão de formulário — `react-hook-form` + `zod`, migração concluída**: decisão tomada pela
usuária (a partir de um plano de refatoração escrito por outra IA, Gemini, fora desta sessão) de
que esse é o jeito **padrão** de construir formulários no app, substituindo o padrão antigo
(`useState` bruto por campo + função `campo()`/`setDados()` genérica). **Todo formulário do app já
foi migrado** (nesta e na sessão anterior): `FuncionarioForm.tsx`, `ClienteForm.tsx`,
`PecaForm.tsx`, `OrdemServicoForm.tsx` (o mais complexo, itens de peça/serviço via
`useFieldArray`), `OperadorForm.tsx` (checkbox de permissões/lojas via array nativo do RHF),
`ServicoForm.tsx`, `CaixaForm.tsx`, `MovimentoForm.tsx`, `ContaPagarForm.tsx`,
`PagarContaModal.tsx`, `ReceberContaModal.tsx`, `LojasSection.tsx` (dois `useForm` — cadastro novo
+ edição inline por loja, cada card de edição remonta com dados próprios em vez de um `reset()`
manual) e `FaturamentoCard.tsx` (o mais carregado de cálculo — juros/parcelas/split de pagamento
viraram funções puras em `schemas/faturamento.ts`, testáveis fora do componente). É, desde então,
o padrão que a skill `/gerar-modulo` deveria seguir também — conferir se já gera nesse formato ao
usá-la de novo. Convenção estabelecida no piloto, seguida em todos:
  - Schema de validação zod + funções de mapeamento form↔banco ficam em `src/schemas/<entidade>.ts`
    (não junto do componente): `<entidade>FormSchema`, `paraValoresFormulario(existente?)` (banco →
    formulário), `para<Entidade>(valores)` (formulário → banco, convertendo `""` pra `null` e string
    numérica pra `number`).
  - O formulário em si vira um **orquestrador** (`useForm` + abas/estado de UI + `handleSubmit`),
    delegando os campos pra componentes menores em `<modulo>/campos/<Grupo>Fields.tsx`, cada um
    recebendo `register` (e `control`, só quando precisa de `useFieldArray` — caso de listas
    dinâmicas tipo "filhos" ou "veículos").
  - `Secao`/`Campo`/`inputClasse` (os wrappers visuais de sempre) viram um arquivo só,
    `<modulo>/campos/FormCompartilhado.tsx`, reaproveitado por todos os grupos de campos daquele
    módulo (cada módulo tem o seu próprio — não compartilhado entre módulos diferentes, de
    propósito, pra não acoplar Clientes e Funcionários por causa de um wrapper visual).
  - **Item de lista dinâmica que tem `id` de banco (ex: veículo de um cliente) precisa de um
    `<input type="hidden">` registrado pro campo `id`** dentro do `useFieldArray`, mesmo ele nunca
    aparecendo pro usuário — sem isso, dar "Adicionar"/"Remover" no meio da lista arrisca perder o
    `id` original e recriar a linha no banco, desconectando referências de outra tabela (caso real:
    `veiculos.id` referenciado por `ordens_servico.veiculo_id`, ver `VeiculosFields.tsx`).
  - **Campos que se recalculam entre si** (ex: custo → margem % → preço final em `PecaForm.tsx`)
    não dá pra resolver só com `register` — usam `watch()` (ler o valor atual de outro campo) +
    `setValue()` (escrever no campo derivado) dentro de um `onChange` customizado, com a conta em
    si isolada como função pura no `schemas/<entidade>.ts` (`precoAPartirDaMargem`/
    `margemAPartirDoPreco` em `schemas/peca.ts`), não dentro do componente.
  - **Select com valor "sentinela" que não existe de verdade no dado** (ex: "Serviço avulso" no
    item de OS, que na prática é `servico_id` vazio/nenhum) **não dá pra registrar direto via
    `register()`** — mutar `e.target.value` (como no truque de maiúsculas do `uf`/`estado`) faz o
    `<select>` "desmarcar" visualmente porque o valor não bate com nenhuma `<option>`. Nesse caso,
    deixar o campo **controlado de verdade** (`value={watch(...)}` + `onChange` chamando
    `setValue()` com a tradução do sentinela pro valor real), sem passar `register()` nesse
    elemento — funciona sem `Controller`, só com `watch`/`setValue` (ver `ItemOSRow.tsx`, troca de
    peça/serviço/tipo do item da OS).

**Skill `/gerar-modulo`** (`.claude/skills/gerar-modulo/SKILL.md`): automatiza a criação de um
módulo novo inteiro (migration + types + lib + página + form + registro em `MODULOS`/`App.tsx`)
seguindo esse padrão de código. Uso: `/gerar-modulo <Nome do módulo>`. Preferir essa skill a fazer
o andaime manualmente sempre que o pedido for "módulo/cadastro novo".

