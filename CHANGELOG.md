# Changelog

Todas as mudanças notáveis do Sakura System — AutoCenter Edition são registradas aqui.
O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o projeto usa [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Não lançado]

### Adicionado
- Configurações → "Dados fiscais da loja": CNPJ, razão social, IE/IM, regime tributário, endereço e token de integração com o Focus NFe (ambiente de homologação/produção) — preparação para a emissão automática de NFC-e, ainda não habilitada.
- Notas Fiscais: botão "Versão para o cliente" gera um recibo em HTML (imprimir ou baixar) a partir do XML já enviado, além do "Baixar XML" que já existia.
- Garantia da OS (aba Fechamento) redesenhada: cabeçalho com dados da loja, dados do cliente e do veículo, tabela de peças/serviços com técnico, totalização (produtos/serviços/subtotal/descontos), forma de pagamento (com parcelas, se houver) e linhas de assinatura — além do texto de garantia configurável, que continua editável em Configurações.
- Módulo "Contas a Pagar": contas mensais (aluguel, etc.) com valor e vencimento, diferente das Entradas/Saídas manuais do Caixa. Marcar como paga lança automaticamente uma Saída no Caixa; contas marcadas como recorrentes já criam a próxima ocorrência (mês seguinte) sozinhas.

## [0.1.3] - 2026-07-29

### Adicionado
- Módulo "Funcionários": cadastro leve (nome + cargo, sem login) selecionável como técnico (peça/serviço da OS) ou vendedor/atendente (OS toda), ampliado depois com dados de RH completos (documentos, CNH, endereço, contato, cargo/admissão, filiação, cônjuge e filhos). Todo operador (quem loga no sistema) ganha automaticamente um registro espelhado aqui.
- Caixa Diário: abas "Entradas" e "Saídas" para lançamentos manuais não convencionais (ex: aluguel, mercado, sucata), com categorias próprias configuráveis em Configurações.
- Cadastro de Cliente: tipo de pessoa física/jurídica, trocando os rótulos "Nome completo"/"CPF" para "Razão social"/"CNPJ".
- Módulo "Notas Fiscais": upload manual de arquivos XML de NFe/NFS-e, organizados por mês de competência, com vínculo opcional a uma Ordem de Serviço — prepara o caminho para quando a emissão fiscal automática for construída.
- Botão "voltar" das telas de lista com ícone de casinha (leva direto para o Início), diferenciado da seta usada nos formulários.
- Ícone da flor (favicon e ícone do instalador) redesenhado.
- Pré-visualização antes de emitir NFe/NFS-e ou baixar/imprimir a garantia, na aba Fechamento da Ordem de Serviço.
- Texto de garantia configurável em Configurações, usado pelos botões "Imprimir garantia"/"Baixar garantia".
- Categorias de produto: cadastro em Configurações, selecionável no cadastro de produto.
- Estoque → aba "Relatórios": estoque físico-financeiro, saldo por situação (positivo/negativo/zerado) e produtos sem movimentação.
- Estoque → aba "Contagem": inventário físico com ajuste automático de estoque quando há diferença.
- Módulo "Garantias": lista peças vendidas com prazo de garantia definido, calculando o vencimento a partir do fechamento da OS.
- Cadastro de Produto: campos de código de barras, marca, modelo, aplicação, C.E.S.T. e origem da mercadoria; margem % calcula o preço final automaticamente (e vice-versa); quantidade de estoque inicial no cadastro já gera o lançamento de entrada.
- Início (antigo "Painel de Controle"): cartões de tendência do mês (Vendas, Custos, Lucros) com mini-gráfico, seção "OS abertas" e um calendário do mês com feriados nacionais e aniversário de cliente.
- Campo de data de nascimento no cadastro de cliente, usado para marcar aniversário no calendário do Início.
- Tela de Login redesenhada com efeito de vidro fosco sobre um fundo floral.
- Logo desenhada à mão (wordmark "Sakura System" / "by Sakura Corp" em itálico serifado) aplicada ao menu lateral; a flor ficou só no ícone/favicon do app.
- Wordmark do menu lateral simplificado: removida a flor do logo do topo (ela continua só no ícone/favicon), texto "Sakura System" / "by Sakura Corp" aumentado para ocupar o espaço liberado.
- Caixa Diário agora mostra o cliente e o lucro de cada lançamento vindo de OS, além de um resumo por forma de recebimento (dinheiro, cartão, PIX etc.) — uma única linha por lançamento, sem repetir informação.
- Estrutura inicial do projeto: Electron + Vite + React + TypeScript + Tailwind CSS.
- Identidade visual Sakura System (paleta rosa/roxo) aplicada ao layout base e menu lateral.
- Cadastro de Clientes: criar, listar, excluir clientes e associar um veículo.
- Migration inicial do banco de dados (Supabase): tabelas `clientes` e `veiculos`.
- Cadastro de Peças/Produtos: criar, listar, excluir peças, com campos fiscais (NCM, CFOP, CST/CSOSN, alíquota de ICMS).
- Estoque: registro de entradas/saídas por peça, saldo atual calculado automaticamente e histórico de movimentações.
- Ordens de Serviço: cliente + veículo + peças usadas + serviços realizados, com baixa automática de estoque para peças e faturamento que gera lançamento no caixa.
- Caixa Diário: lançamentos manuais e automáticos (das OS faturadas), com totais de entradas/saídas/saldo por dia.
- Relatórios: comparativo de vendas diárias, semanais e mensais.
- Lucratividade: margem por peça/serviço e lucro do período (receita, custo e margem), com filtro de data.
- Painel de Controle: indicadores tipo velocímetro de faturamento (mês atual vs. anterior) e margem bruta do mês, além da fila de atendimento (ordens de serviço em aberto).

### Corrigido
- Migration de RLS (`0015_rls_exige_login.sql`) dava erro "política já existe" ao ser rodada mais de uma vez; agora é realmente segura de repetir.
- Mensagens de erro genéricas no cadastro de clientes agora mostram a causa real.
- `npm run lint` estava quebrado (faltava o arquivo de configuração do ESLint e os plugins de React); adicionado `eslint.config.js` com as regras básicas de hooks do React.
- Tela em branco ao rodar `npm run dev` com o `.env` copiado do exemplo: as variáveis do Supabase ficavam como texto vazio (não "ausentes"), e o app tentava conectar com um endereço vazio e travava antes de desenhar a tela.
- Migrations do Supabase (`supabase/migrations/*.sql`) agora podem ser rodadas de novo com segurança: as `create policy` passaram a ter um `drop policy if exists` antes, então rodar tudo de novo não dá mais erro de "política já existe".
- Texto digitado em campos de formulário ficava invisível (branco sobre fundo claro) quando o Windows estava em modo escuro.
- Logo e imagens quebradas no instalador de verdade (funcionava normal no `npm run dev`) por causa de caminho de arquivo absoluto, que não funciona quando o Electron carrega a tela via `file://`.

### Segurança
- Login obrigatório (Supabase Auth) em todas as tabelas de negócio via RLS — sem sessão autenticada, não é mais possível ler ou escrever dados pela API, nem com a chave pública.
