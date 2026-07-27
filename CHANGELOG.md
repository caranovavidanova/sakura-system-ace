# Changelog

Todas as mudanças notáveis do Sakura System — AutoCenter Edition são registradas aqui.
O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o projeto usa [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Não lançado]

### Adicionado
- Logo oficial da Sakura System (flor de lótus com sombreamento em camadas + wordmark "Sakura System" / "by Sakura Corp" em itálico serifado) aplicado ao menu lateral e ao ícone do app.
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
- Mensagens de erro genéricas no cadastro de clientes agora mostram a causa real.
- `npm run lint` estava quebrado (faltava o arquivo de configuração do ESLint e os plugins de React); adicionado `eslint.config.js` com as regras básicas de hooks do React.
- Tela em branco ao rodar `npm run dev` com o `.env` copiado do exemplo: as variáveis do Supabase ficavam como texto vazio (não "ausentes"), e o app tentava conectar com um endereço vazio e travava antes de desenhar a tela.

### Segurança
- Adicionadas policies temporárias de RLS liberando acesso via chave pública, até a autenticação de usuário ser implementada.
