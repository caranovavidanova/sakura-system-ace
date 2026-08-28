-- Sakura System — AutoCenter Edition
-- Migration 0007: operadores (login com usuário/senha + permissões por módulo)
--
-- Login usa Supabase Auth (e-mail/senha), mas o operador só digita um "usuário"
-- curto — o app monta um e-mail interno (usuario@sakura.local) por baixo dos
-- panos. Esta tabela guarda o perfil (nome, permissões) de cada usuário do
-- Supabase Auth, ligado por id.
--
-- Diferente das outras tabelas (que ainda têm RLS totalmente aberto, ver
-- PROJETO_STATUS.md seção 6.1), esta tabela JÁ tem RLS de verdade baseada em
-- quem está logado, porque ela é a raiz de confiança do sistema de permissões
-- — não faria sentido proteger o resto só na interface se qualquer um pudesse
-- se auto-promover a admin direto pela API.

create table if not exists operadores (
  id uuid primary key references auth.users (id) on delete cascade,
  usuario text not null unique,
  nome text not null,
  admin boolean not null default false,
  permissoes text[] not null default '{}',
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

alter table operadores enable row level security;

-- Qualquer pessoa logada pode ler a lista de operadores (necessário pra cada
-- um buscar o próprio perfil ao logar, e pro admin listar todo mundo na tela
-- de Configurações).
drop policy if exists "operadores_leitura_autenticados" on operadores;
create policy "operadores_leitura_autenticados" on operadores
  for select
  using (auth.uid() is not null);

-- Só um operador marcado como admin (e ativo) pode criar, editar ou remover
-- outros operadores.
drop policy if exists "operadores_escrita_admins" on operadores;
create policy "operadores_escrita_admins" on operadores
  for all
  using (
    exists (
      select 1 from operadores admin_atual
      where admin_atual.id = auth.uid()
        and admin_atual.admin = true
        and admin_atual.ativo = true
    )
  )
  with check (
    exists (
      select 1 from operadores admin_atual
      where admin_atual.id = auth.uid()
        and admin_atual.admin = true
        and admin_atual.ativo = true
    )
  );

-- Bootstrap do primeiro admin (rodar manualmente, uma vez, pelo SQL Editor do
-- Supabase — não pelo app, porque a policy acima exige que já exista um admin
-- pra criar outro operador):
--
-- 1. Crie o usuário em Authentication → Users → Add user, com e-mail
--    "SEU_USUARIO@sakura.local" e a senha que quiser. Copie o "User UID".
-- 2. Rode, trocando os valores:
--
-- insert into operadores (id, usuario, nome, admin, permissoes, ativo)
-- values ('COLE_O_USER_UID_AQUI', 'SEU_USUARIO', 'Seu Nome', true, '{}', true);
--
-- insert into operador_lojas (operador_id, loja_id)
-- values ('COLE_O_USER_UID_AQUI', '00000000-0000-0000-0000-000000000001');
--
-- ⚠️  O SEGUNDO insert é obrigatório desde a migration 0031 (multi-loja) e é
-- fácil de esquecer, porque esta migration é bem anterior a ela. Sem o vínculo
-- em `operador_lojas`, o admin entra no sistema mas não enxerga NADA que seja
-- por loja — depósito, configurações do Início, dados fiscais, OS, caixa, tudo
-- vazio — e ninguém consegue nem editar esse operador depois (ver
-- PROJETO_STATUS.md, seção 6, item 23). O backfill da 0031 só cobre operadores
-- que já existiam quando ela rodou, então num banco novo, criado do zero, o
-- primeiro admin sempre precisa deste insert à mão.
--
-- O UUID acima é o da "Loja 1", criada pela própria migration 0031 com id fixo.
-- Passo a passo completo de instalar uma empresa nova:
-- supabase/instalacao/INSTALAR-LOJA-NOVA.md
