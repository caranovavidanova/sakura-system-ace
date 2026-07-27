# Changelog

Todas as mudanças notáveis do Sakura System — AutoCenter Edition são registradas aqui.
O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o projeto usa [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Não lançado]

### Adicionado
- Estrutura inicial do projeto: Electron + Vite + React + TypeScript + Tailwind CSS.
- Identidade visual Sakura System (paleta rosa/roxo) aplicada ao layout base e menu lateral.
- Cadastro de Clientes: criar, listar, excluir clientes e associar um veículo.
- Migration inicial do banco de dados (Supabase): tabelas `clientes` e `veiculos`.
- Cadastro de Peças/Produtos: criar, listar, excluir peças, com campos fiscais (NCM, CFOP, CST/CSOSN, alíquota de ICMS).

### Corrigido
- Mensagens de erro genéricas no cadastro de clientes agora mostram a causa real.

### Segurança
- Adicionadas policies temporárias de RLS liberando acesso via chave pública, até a autenticação de usuário ser implementada.
