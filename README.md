# Sakura System — AutoCenter Edition

Sistema de gestão para autocenters e borracharias, parte da linha Sakura System.

## Stack

- **Electron** — empacota a interface como app desktop (Windows)
- **React + Vite + TypeScript** — interface do usuário
- **Tailwind CSS** — estilização com a paleta visual Sakura System
- **Supabase** — banco de dados em nuvem (Postgres) e autenticação

## Como rodar localmente

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Copie `.env.example` para `.env` e preencha com as credenciais do seu projeto Supabase:
   ```bash
   cp .env.example .env
   ```
3. Rode as migrations em `supabase/migrations/` no seu projeto Supabase (via SQL Editor ou Supabase CLI).
4. Inicie o app em modo desenvolvimento (abre a janela do Electron com hot reload):
   ```bash
   npm run dev
   ```

## Build de produção

```bash
npm run electron:build
```

Gera o instalador do Windows em `release/`.

## Status

Em desenvolvimento — veja o [CHANGELOG.md](./CHANGELOG.md) para o progresso por versão.
