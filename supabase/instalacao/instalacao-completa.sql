-- ===================================================================
-- Sakura System — AutoCenter Edition
-- INSTALAÇÃO COMPLETA DO BANCO (empresa nova)
-- ===================================================================
--
-- ARQUIVO GERADO AUTOMATICAMENTE — não editar à mão.
-- Para regerar: npm run gerar-instalacao
--
-- Contém as 47 migrations de supabase/migrations/, na ordem.
--
-- Como usar: painel do Supabase → SQL Editor → New query → colar TUDO
-- deste arquivo → Run. Leva alguns segundos.
--
-- Seguro rodar de novo num banco que já tem tudo (todas as migrations são
-- idempotentes) — não apaga nem duplica nada.
--
-- Isto é SÓ a parte do banco. O passo a passo completo de instalar uma
-- loja nova (Auth, primeiro admin, app) está em
-- supabase/instalacao/INSTALAR-LOJA-NOVA.md
-- ===================================================================

-- -------------------------------------------------------------------
-- 0001_clientes_veiculos.sql
-- -------------------------------------------------------------------

-- Sakura System — AutoCenter Edition
-- Migration 0001: clientes e veículos

create extension if not exists "pgcrypto";

create table if not exists clientes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  cpf_cnpj text,
  telefone text,
  email text,
  cep text,
  rua text,
  numero text,
  bairro text,
  cidade text,
  uf text,
  criado_em timestamptz not null default now()
);

create table if not exists veiculos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references clientes (id) on delete cascade,
  placa text not null,
  marca text,
  modelo text,
  ano int,
  cor text,
  km_atual int,
  criado_em timestamptz not null default now()
);

create index if not exists veiculos_cliente_id_idx on veiculos (cliente_id);


-- -------------------------------------------------------------------
-- 0002_rls_temporario.sql
-- -------------------------------------------------------------------

-- Sakura System — AutoCenter Edition
-- Migration 0002: libera acesso às tabelas de clientes/veículos
--
-- TEMPORÁRIO: o app ainda não tem login de usuário, então liberamos acesso
-- total pela chave pública (anon/publishable). Quando a autenticação for
-- implementada, substituir estas policies por regras que checam o usuário
-- logado (e, no futuro, a loja/tenant do usuário).

alter table clientes enable row level security;
alter table veiculos enable row level security;

drop policy if exists "clientes_acesso_temporario" on clientes;
create policy "clientes_acesso_temporario" on clientes
  for all
  using (true)
  with check (true);

drop policy if exists "veiculos_acesso_temporario" on veiculos;
create policy "veiculos_acesso_temporario" on veiculos
  for all
  using (true)
  with check (true);


-- -------------------------------------------------------------------
-- 0003_pecas.sql
-- -------------------------------------------------------------------

-- Sakura System — AutoCenter Edition
-- Migration 0003: peças/produtos (com dados fiscais)

create table if not exists pecas (
  id uuid primary key default gen_random_uuid(),
  codigo_interno text,
  descricao text not null,
  unidade text,
  preco_custo numeric(12, 2),
  preco_venda numeric(12, 2),
  ncm text,
  cfop_padrao text,
  cst_ou_csosn text,
  aliquota_icms numeric(5, 2),
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

-- TEMPORÁRIO: mesma lógica da migration 0002 — libera acesso pela chave
-- pública até a autenticação de usuário ser implementada.
alter table pecas enable row level security;

drop policy if exists "pecas_acesso_temporario" on pecas;
create policy "pecas_acesso_temporario" on pecas
  for all
  using (true)
  with check (true);


-- -------------------------------------------------------------------
-- 0004_estoque_movimentos.sql
-- -------------------------------------------------------------------

-- Sakura System — AutoCenter Edition
-- Migration 0004: movimentações de estoque (entrada/saída)

create table if not exists estoque_movimentos (
  id uuid primary key default gen_random_uuid(),
  peca_id uuid not null references pecas (id) on delete cascade,
  tipo text not null check (tipo in ('entrada', 'saida')),
  quantidade numeric(12, 2) not null check (quantidade > 0),
  motivo text not null check (motivo in ('compra', 'venda', 'ajuste', 'uso_em_os')),
  referencia text,
  criado_em timestamptz not null default now()
);

create index if not exists estoque_movimentos_peca_id_idx on estoque_movimentos (peca_id);

-- TEMPORÁRIO: mesma lógica das migrations anteriores — libera acesso pela
-- chave pública até a autenticação de usuário ser implementada.
alter table estoque_movimentos enable row level security;

drop policy if exists "estoque_movimentos_acesso_temporario" on estoque_movimentos;
create policy "estoque_movimentos_acesso_temporario" on estoque_movimentos
  for all
  using (true)
  with check (true);


-- -------------------------------------------------------------------
-- 0005_ordens_servico.sql
-- -------------------------------------------------------------------

-- Sakura System — AutoCenter Edition
-- Migration 0005: ordens de serviço e seus itens (peças e serviços)

create table if not exists ordens_servico (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references clientes (id) on delete restrict,
  veiculo_id uuid references veiculos (id) on delete set null,
  status text not null default 'aberta'
    check (status in ('aberta', 'em_andamento', 'concluida', 'faturada')),
  km_entrada int,
  descricao_problema text,
  forma_pagamento text,
  data_abertura timestamptz not null default now(),
  data_fechamento timestamptz
);

create index if not exists ordens_servico_cliente_id_idx on ordens_servico (cliente_id);

create table if not exists ordens_servico_itens (
  id uuid primary key default gen_random_uuid(),
  ordem_servico_id uuid not null references ordens_servico (id) on delete cascade,
  tipo text not null check (tipo in ('peca', 'servico')),
  peca_id uuid references pecas (id),
  descricao text not null,
  quantidade numeric(12, 2) not null check (quantidade > 0),
  preco_unitario numeric(12, 2) not null default 0,
  desconto numeric(12, 2) not null default 0
);

create index if not exists ordens_servico_itens_ordem_id_idx
  on ordens_servico_itens (ordem_servico_id);

-- TEMPORÁRIO: mesma lógica das migrations anteriores — libera acesso pela
-- chave pública até a autenticação de usuário ser implementada.
alter table ordens_servico enable row level security;
alter table ordens_servico_itens enable row level security;

drop policy if exists "ordens_servico_acesso_temporario" on ordens_servico;
create policy "ordens_servico_acesso_temporario" on ordens_servico
  for all
  using (true)
  with check (true);

drop policy if exists "ordens_servico_itens_acesso_temporario" on ordens_servico_itens;
create policy "ordens_servico_itens_acesso_temporario" on ordens_servico_itens
  for all
  using (true)
  with check (true);


-- -------------------------------------------------------------------
-- 0006_caixa_movimentos.sql
-- -------------------------------------------------------------------

-- Sakura System — AutoCenter Edition
-- Migration 0006: caixa diário (nasce das OS faturadas + lançamentos manuais)

create table if not exists caixa_movimentos (
  id uuid primary key default gen_random_uuid(),
  data timestamptz not null default now(),
  ordem_servico_id uuid references ordens_servico (id),
  tipo text not null check (tipo in ('entrada', 'saida')),
  forma_pagamento text,
  valor numeric(12, 2) not null check (valor >= 0),
  descricao text,
  constraint caixa_movimentos_ordem_id_idx_unique unique (ordem_servico_id)
);

-- TEMPORÁRIO: mesma lógica das migrations anteriores — libera acesso pela
-- chave pública até a autenticação de usuário ser implementada.
alter table caixa_movimentos enable row level security;

drop policy if exists "caixa_movimentos_acesso_temporario" on caixa_movimentos;
create policy "caixa_movimentos_acesso_temporario" on caixa_movimentos
  for all
  using (true)
  with check (true);


-- -------------------------------------------------------------------
-- 0007_operadores.sql
-- -------------------------------------------------------------------

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


-- -------------------------------------------------------------------
-- 0008_operadores_fix_rls_recursiva.sql
-- -------------------------------------------------------------------

-- Sakura System — AutoCenter Edition
-- Migration 0008: corrige recursão infinita na policy de escrita de `operadores`
--
-- A policy "operadores_escrita_admins" (migration 0007) verifica se quem está
-- logado é admin consultando a própria tabela `operadores` — isso faz o
-- Postgres reavaliar a mesma policy dentro da subconsulta, entrando num loop
-- ("infinite recursion detected in policy for relation operadores").
--
-- A correção padrão é fazer essa verificação dentro de uma função
-- `security definer`: ela roda com privilégio de dono da função, então a
-- consulta interna não passa pela RLS de novo, e a recursão para de existir.

create or replace function operador_atual_e_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from operadores
    where id = auth.uid()
      and admin = true
      and ativo = true
  );
$$;

drop policy if exists "operadores_escrita_admins" on operadores;
create policy "operadores_escrita_admins" on operadores
  for all
  using (operador_atual_e_admin())
  with check (operador_atual_e_admin());


-- -------------------------------------------------------------------
-- 0009_clientes_data_nascimento.sql
-- -------------------------------------------------------------------

-- Sakura System — AutoCenter Edition
-- Migration 0009: data de nascimento do cliente (usada no calendário do Início,
-- pra marcar aniversário de cliente no mês). Idempotente: seguro rodar de novo.

alter table clientes
  add column if not exists data_nascimento date;


-- -------------------------------------------------------------------
-- 0010_pecas_campos_cadastro_completo.sql
-- -------------------------------------------------------------------

-- Sakura System — AutoCenter Edition
-- Migration 0010: campos novos no cadastro de produto (código de barras,
-- marca, modelo, aplicação e os campos fiscais C.E.S.T. e origem da
-- mercadoria). Idempotente: seguro rodar de novo.

alter table pecas
  add column if not exists codigo_barras text,
  add column if not exists marca text,
  add column if not exists modelo text,
  add column if not exists aplicacao text,
  add column if not exists cest text,
  add column if not exists origem text;


-- -------------------------------------------------------------------
-- 0011_servicos.sql
-- -------------------------------------------------------------------

-- Sakura System — AutoCenter Edition
-- Migration 0011: catálogo de serviços (nome + preço padrão). Usado no
-- módulo "Serviços" e selecionável nos itens de Ordem de Serviço, no lugar
-- de digitar o serviço na mão toda vez.

create table if not exists servicos (
  id uuid primary key default gen_random_uuid(),
  codigo_interno text,
  descricao text not null,
  preco_padrao numeric(12, 2),
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

-- TEMPORÁRIO: mesma lógica das migrations anteriores (0002, 0003...) —
-- libera acesso pela chave pública; permissão de verdade fica na interface
-- (ver seção 6 do PROJETO_STATUS.md).
alter table servicos enable row level security;

drop policy if exists "servicos_acesso_temporario" on servicos;
create policy "servicos_acesso_temporario" on servicos
  for all
  using (true)
  with check (true);


-- -------------------------------------------------------------------
-- 0012_ordens_servico_campos_avancados.sql
-- -------------------------------------------------------------------

-- Sakura System — AutoCenter Edition
-- Migration 0012: campos novos na Ordem de Serviço, pro redesenho da tela
-- (prazos de previsão/retorno, checklist básico do veículo nesta OS,
-- vendedor responsável e autoria de quem criou/alterou) e um vínculo direto
-- entre item de OS e o catálogo de serviços (migration 0011). Idempotente:
-- seguro rodar de novo.

alter table ordens_servico
  add column if not exists previsao_entrega timestamptz,
  add column if not exists data_retorno timestamptz,
  add column if not exists checklist_direcao_hidraulica boolean not null default false,
  add column if not exists checklist_ar_condicionado boolean not null default false,
  add column if not exists checklist_direcao_eletrica boolean not null default false,
  add column if not exists vendedor_id uuid references operadores (id),
  add column if not exists criado_por_id uuid references operadores (id),
  add column if not exists atualizado_por_id uuid references operadores (id);

alter table ordens_servico_itens
  add column if not exists servico_id uuid references servicos (id);


-- -------------------------------------------------------------------
-- 0013_os_tecnico_parcelas_juros.sql
-- -------------------------------------------------------------------

-- Sakura System — AutoCenter Edition
-- Migration 0013: ajustes na tela de Ordem de Serviço a pedido do usuário —
-- remove o checklist do veículo (não vingou), adiciona técnico responsável
-- por item (peça/serviço), número de parcelas na OS faturada, e uma tabela
-- de configuração de juros por quantidade de parcelas (editável só pelo
-- admin em Configurações). Idempotente: seguro rodar de novo.

alter table ordens_servico
  drop column if exists checklist_direcao_hidraulica,
  drop column if exists checklist_ar_condicionado,
  drop column if exists checklist_direcao_eletrica;

alter table ordens_servico
  add column if not exists parcelas int not null default 1;

alter table ordens_servico_itens
  add column if not exists tecnico_id uuid references operadores (id);

create table if not exists configuracoes_juros_parcelas (
  numero_parcelas int primary key check (numero_parcelas between 2 and 12),
  juros_percentual numeric(6, 2) not null default 0
);

-- TEMPORÁRIO: mesma lógica das migrations anteriores — libera acesso pela
-- chave pública; permissão de verdade fica na interface (ver seção 6 do
-- PROJETO_STATUS.md). Só admin edita essa tela, mas isso é checado no app.
alter table configuracoes_juros_parcelas enable row level security;

drop policy if exists "configuracoes_juros_parcelas_acesso_temporario" on configuracoes_juros_parcelas;
create policy "configuracoes_juros_parcelas_acesso_temporario" on configuracoes_juros_parcelas
  for all
  using (true)
  with check (true);


-- -------------------------------------------------------------------
-- 0014_os_remove_prazos.sql
-- -------------------------------------------------------------------

-- Sakura System — AutoCenter Edition
-- Migration 0014: remove o card "Prazos" da tela de Ordem de Serviço a
-- pedido do usuário — não vingou. Idempotente: seguro rodar de novo.

alter table ordens_servico
  drop column if exists previsao_entrega,
  drop column if exists data_retorno;


-- -------------------------------------------------------------------
-- 0015_rls_exige_login.sql
-- -------------------------------------------------------------------

-- Sakura System — AutoCenter Edition
-- Migration 0015: fecha o buraco de segurança documentado desde a migration
-- 0002 — as tabelas de negócio estavam com "using (true)" (qualquer um com a
-- chave anon, mesmo sem logar, lê/escreve tudo pela API do Supabase). Agora
-- todas exigem uma sessão autenticada (auth.uid() is not null). Continua sem
-- reforçar permissão por módulo aqui — isso segue checado só na interface,
-- decisão explícita do usuário (ver PROJETO_STATUS.md, item 1 da seção 6).
-- Idempotente: seguro rodar de novo.

drop policy if exists "clientes_acesso_temporario" on clientes;
drop policy if exists "clientes_acesso_autenticados" on clientes;
create policy "clientes_acesso_autenticados" on clientes
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

drop policy if exists "veiculos_acesso_temporario" on veiculos;
drop policy if exists "veiculos_acesso_autenticados" on veiculos;
create policy "veiculos_acesso_autenticados" on veiculos
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

drop policy if exists "pecas_acesso_temporario" on pecas;
drop policy if exists "pecas_acesso_autenticados" on pecas;
create policy "pecas_acesso_autenticados" on pecas
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

drop policy if exists "estoque_movimentos_acesso_temporario" on estoque_movimentos;
drop policy if exists "estoque_movimentos_acesso_autenticados" on estoque_movimentos;
create policy "estoque_movimentos_acesso_autenticados" on estoque_movimentos
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

drop policy if exists "servicos_acesso_temporario" on servicos;
drop policy if exists "servicos_acesso_autenticados" on servicos;
create policy "servicos_acesso_autenticados" on servicos
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

drop policy if exists "ordens_servico_acesso_temporario" on ordens_servico;
drop policy if exists "ordens_servico_acesso_autenticados" on ordens_servico;
create policy "ordens_servico_acesso_autenticados" on ordens_servico
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

drop policy if exists "ordens_servico_itens_acesso_temporario" on ordens_servico_itens;
drop policy if exists "ordens_servico_itens_acesso_autenticados" on ordens_servico_itens;
create policy "ordens_servico_itens_acesso_autenticados" on ordens_servico_itens
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

drop policy if exists "caixa_movimentos_acesso_temporario" on caixa_movimentos;
drop policy if exists "caixa_movimentos_acesso_autenticados" on caixa_movimentos;
create policy "caixa_movimentos_acesso_autenticados" on caixa_movimentos
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

drop policy if exists "configuracoes_juros_parcelas_acesso_temporario" on configuracoes_juros_parcelas;
drop policy if exists "configuracoes_juros_parcelas_acesso_autenticados" on configuracoes_juros_parcelas;
create policy "configuracoes_juros_parcelas_acesso_autenticados" on configuracoes_juros_parcelas
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);


-- -------------------------------------------------------------------
-- 0016_categorias_e_garantia.sql
-- -------------------------------------------------------------------

-- Sakura System — AutoCenter Edition
-- Migration 0016: categoria de produto (tabela própria, reutilizável entre
-- peças — evita erro de digitação e permite renomear uma categoria e
-- refletir em todas as peças de uma vez) e prazo de garantia por peça
-- (usado na tela de Garantias; a garantia em si não vira tabela nova —
-- é calculada a partir da data de fechamento da OS + este prazo).
-- Idempotente: seguro rodar de novo.

create table if not exists categorias (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  criado_em timestamptz not null default now()
);

alter table categorias enable row level security;

drop policy if exists "categorias_acesso_autenticados" on categorias;
create policy "categorias_acesso_autenticados" on categorias
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

alter table pecas add column if not exists categoria_id uuid references categorias (id) on delete set null;
alter table pecas add column if not exists prazo_garantia_dias integer;


-- -------------------------------------------------------------------
-- 0017_contagens_estoque.sql
-- -------------------------------------------------------------------

-- Sakura System — AutoCenter Edition
-- Migration 0017: contagem/inventário físico de estoque — registra a
-- contagem manual de um produto, o saldo que o sistema calculava no
-- momento e a diferença encontrada. O app gera automaticamente um
-- lançamento de ajuste em estoque_movimentos quando há diferença (mesmo
-- padrão que "Qtde. estoque inicial" já usa no cadastro de produto).
-- Idempotente: seguro rodar de novo.

create table if not exists contagens_estoque (
  id uuid primary key default gen_random_uuid(),
  peca_id uuid not null references pecas (id) on delete cascade,
  quantidade_contada numeric(12, 2) not null,
  saldo_sistema numeric(12, 2) not null,
  diferenca numeric(12, 2) not null,
  observacao text,
  operador_id uuid references operadores (id),
  criado_em timestamptz not null default now()
);

create index if not exists contagens_estoque_peca_id_idx on contagens_estoque (peca_id);

alter table contagens_estoque enable row level security;

drop policy if exists "contagens_estoque_acesso_autenticados" on contagens_estoque;
create policy "contagens_estoque_acesso_autenticados" on contagens_estoque
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);


-- -------------------------------------------------------------------
-- 0018_configuracoes_garantia.sql
-- -------------------------------------------------------------------

-- Sakura System — AutoCenter Edition
-- Migration 0018: texto de garantia configurável, usado pelos botões
-- "Imprimir garantia"/"Baixar garantia" na aba Fechamento da OS. Loja única
-- (não multi-loja) — por isso uma tabela "singleton" (1 linha só, id fixo),
-- editável só pelo admin em Configurações. Ver PROJETO_STATUS.md seção 8.1.
-- Idempotente: seguro rodar de novo.

create table if not exists configuracoes_garantia (
  id smallint primary key default 1,
  texto text not null,
  constraint configuracoes_garantia_singleton check (id = 1)
);

-- A linha padrão abaixo só faz sentido enquanto esta tabela é "singleton"
-- (coluna `id`). A partir da migration 0033 ela vira uma linha POR LOJA
-- (`loja_id`), e a própria 0033 cria as linhas de cada loja. Sem esta guarda,
-- reexecutar a sequência inteira num banco já atualizado quebraria aqui, com
-- "column id does not exist" — ver PROJETO_STATUS.md, seção 6, item 12.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'configuracoes_garantia'
      and column_name = 'id'
  ) then
    insert into configuracoes_garantia (id, texto)
    values (
      1,
      E'Certificado de Garantia\n\n' ||
      E'Cliente: {cliente}\n' ||
      E'Veículo: {veiculo}\n' ||
      E'Data de fechamento: {data}\n\n' ||
      E'Itens cobertos por esta garantia:\n{itens}\n\n' ||
      E'Esta garantia cobre defeitos de fabricação e instalação nos itens acima, ' ||
      E'conforme o prazo de garantia informado no momento da venda de cada peça/serviço.'
    )
    on conflict (id) do nothing;
  end if;
end
$$;

alter table configuracoes_garantia enable row level security;

drop policy if exists "configuracoes_garantia_acesso_autenticados" on configuracoes_garantia;
create policy "configuracoes_garantia_acesso_autenticados" on configuracoes_garantia
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);


-- -------------------------------------------------------------------
-- 0019_funcionarios.sql
-- -------------------------------------------------------------------

-- Sakura System — AutoCenter Edition
-- Migration 0019: funcionarios — cadastro leve (nome, cargo, ativo) para
-- pessoal que não precisa de login no sistema, mas precisa ser selecionável
-- como técnico numa peça/serviço da OS ou como vendedor/atendente da OS.
--
-- Todo operador (quem loga no sistema) também é um funcionário por trás dos
-- panos: ao criar/editar um operador, um gatilho espelha automaticamente o
-- registro em funcionarios (ligado por operador_id), então o seletor de
-- técnico/vendedor sempre junta os dois grupos sem exigir cadastro duplicado.
--
-- tecnico_id (ordens_servico_itens) e vendedor_id (ordens_servico) passam a
-- apontar pra funcionarios em vez de operadores — criado_por_id/
-- atualizado_por_id continuam em operadores, porque esses são sobre quem
-- de fato mexeu no sistema (auditoria), não sobre quem presta o serviço.
--
-- Idempotente: seguro rodar de novo.

create table if not exists funcionarios (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  cargo text,
  operador_id uuid unique references operadores (id) on delete set null,
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

alter table funcionarios enable row level security;

drop policy if exists "funcionarios_acesso_autenticados" on funcionarios;
create policy "funcionarios_acesso_autenticados" on funcionarios
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

-- Espelha todo operador já existente (não duplica se a migration rodar de novo).
insert into funcionarios (nome, operador_id, ativo)
select o.nome, o.id, o.ativo
from operadores o
where not exists (select 1 from funcionarios f where f.operador_id = o.id);

-- Mantém o espelho em dia quando um operador é criado ou tem nome/status alterado.
create or replace function sincroniza_funcionario_operador()
returns trigger as $$
begin
  insert into funcionarios (nome, operador_id, ativo)
  values (new.nome, new.id, new.ativo)
  on conflict (operador_id) do update
    set nome = excluded.nome, ativo = excluded.ativo;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_sincroniza_funcionario_operador on operadores;
create trigger trg_sincroniza_funcionario_operador
  after insert or update of nome, ativo on operadores
  for each row execute function sincroniza_funcionario_operador();

-- Repontar ordens_servico_itens.tecnico_id de operadores(id) pra funcionarios(id).
-- Guardado por uma checagem do FK atual: se já foi migrado numa execução
-- anterior, o nome do constraint muda e a condição abaixo não bate de novo.
do $$
declare
  fk_target text;
begin
  select confrelid::regclass::text into fk_target
  from pg_constraint
  where conrelid = 'ordens_servico_itens'::regclass
    and conname = 'ordens_servico_itens_tecnico_id_fkey';

  if fk_target = 'operadores' then
    alter table ordens_servico_itens
      add column tecnico_funcionario_id uuid references funcionarios (id);

    update ordens_servico_itens i
    set tecnico_funcionario_id = f.id
    from funcionarios f
    where f.operador_id = i.tecnico_id;

    alter table ordens_servico_itens drop column tecnico_id;
    alter table ordens_servico_itens rename column tecnico_funcionario_id to tecnico_id;
    alter table ordens_servico_itens
      rename constraint ordens_servico_itens_tecnico_funcionario_id_fkey
      to ordens_servico_itens_tecnico_id_fkey;
  end if;
end $$;

-- Mesma coisa para ordens_servico.vendedor_id.
do $$
declare
  fk_target text;
begin
  select confrelid::regclass::text into fk_target
  from pg_constraint
  where conrelid = 'ordens_servico'::regclass
    and conname = 'ordens_servico_vendedor_id_fkey';

  if fk_target = 'operadores' then
    alter table ordens_servico
      add column vendedor_funcionario_id uuid references funcionarios (id);

    update ordens_servico o
    set vendedor_funcionario_id = f.id
    from funcionarios f
    where f.operador_id = o.vendedor_id;

    alter table ordens_servico drop column vendedor_id;
    alter table ordens_servico rename column vendedor_funcionario_id to vendedor_id;
    alter table ordens_servico
      rename constraint ordens_servico_vendedor_funcionario_id_fkey
      to ordens_servico_vendedor_id_fkey;
  end if;
end $$;


-- -------------------------------------------------------------------
-- 0020_categorias_caixa.sql
-- -------------------------------------------------------------------

-- Sakura System — AutoCenter Edition
-- Migration 0020: categorias de caixa (aluguel, mercado, limpeza, sucata...)
-- pra classificar lançamentos manuais de entrada/saída no Caixa — usadas
-- pelas abas novas "Entradas" e "Saídas" dentro do módulo Caixa Diário.
-- Idempotente: seguro rodar de novo.

create table if not exists categorias_caixa (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  tipo text not null check (tipo in ('entrada', 'saida')),
  criado_em timestamptz not null default now(),
  unique (nome, tipo)
);

alter table categorias_caixa enable row level security;

drop policy if exists "categorias_caixa_acesso_autenticados" on categorias_caixa;
create policy "categorias_caixa_acesso_autenticados" on categorias_caixa
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

alter table caixa_movimentos
  add column if not exists categoria_id uuid references categorias_caixa (id) on delete set null;


-- -------------------------------------------------------------------
-- 0021_clientes_tipo_pessoa.sql
-- -------------------------------------------------------------------

-- Sakura System — AutoCenter Edition
-- Migration 0021: tipo de pessoa (física/jurídica) no cadastro de cliente —
-- pedido da usuária pra diferenciar cliente pessoa física (CPF) de pessoa
-- jurídica/empresa (CNPJ). Idempotente: seguro rodar de novo.

alter table clientes
  add column if not exists tipo_pessoa text not null default 'fisica'
  check (tipo_pessoa in ('fisica', 'juridica'));


-- -------------------------------------------------------------------
-- 0022_funcionarios_dados_completos.sql
-- -------------------------------------------------------------------

-- Sakura System — AutoCenter Edition
-- Migration 0022: amplia o cadastro de Funcionários com os campos de RH que a
-- usuária pediu depois de ver o cadastro de um sistema de referência
-- (documentos, endereço/contato, cargo/admissão, família) — dados de saúde
-- (enfermidades/medicamentos) ficaram de fora por escolha explícita dela
-- (dado sensível, mais cuidado de LGPD). Idempotente: seguro rodar de novo.

alter table funcionarios
  -- Documentos e dados pessoais
  add column if not exists cpf text,
  add column if not exists rg text,
  add column if not exists cnh_categoria text,
  add column if not exists cnh_numero text,
  add column if not exists data_nascimento date,
  add column if not exists estado_civil text,
  add column if not exists tipo_sanguineo text,
  -- Endereço e contato
  add column if not exists cep text,
  add column if not exists endereco text,
  add column if not exists numero text,
  add column if not exists bairro text,
  add column if not exists cidade text,
  add column if not exists estado text,
  add column if not exists complemento text,
  add column if not exists telefone text,
  add column if not exists celular text,
  add column if not exists email text,
  -- Cargo e admissão (cargo em si já existia)
  add column if not exists pis text,
  add column if not exists codigo_registro text,
  add column if not exists cbo text,
  add column if not exists salario numeric,
  add column if not exists comissao numeric,
  add column if not exists admissao date,
  add column if not exists data_ferias date,
  -- Família: filiação e cônjuge
  add column if not exists pai text,
  add column if not exists mae text,
  add column if not exists naturalidade text,
  add column if not exists sexo text,
  add column if not exists conjuge_nome text,
  add column if not exists conjuge_nascimento date,
  add column if not exists data_casamento date,
  add column if not exists conjuge_telefone text,
  add column if not exists conjuge_celular text;

-- Família: filhos (lista, um funcionário pode ter vários).
create table if not exists funcionario_filhos (
  id uuid primary key default gen_random_uuid(),
  funcionario_id uuid not null references funcionarios (id) on delete cascade,
  nome text not null,
  data_nascimento date,
  criado_em timestamptz not null default now()
);

alter table funcionario_filhos enable row level security;

drop policy if exists "funcionario_filhos_acesso_autenticados" on funcionario_filhos;
create policy "funcionario_filhos_acesso_autenticados" on funcionario_filhos
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);


-- -------------------------------------------------------------------
-- 0023_notas_fiscais_xml.sql
-- -------------------------------------------------------------------

-- Sakura System — AutoCenter Edition
-- Migration 0023: módulo "Notas Fiscais" — guarda os arquivos XML de NFe/NFS-e
-- organizados por mês, com vínculo opcional a uma Ordem de Serviço. A emissão
-- fiscal automática ainda não existe (ver PROJETO_STATUS.md), então por
-- enquanto o upload é manual: a usuária sobe o XML da nota que já emite por
-- fora. Quando a emissão automática for construída, ela pode gravar direto
-- nessa mesma tabela/bucket em vez do upload manual.
--
-- Primeira vez que este projeto usa o Supabase Storage — cria um bucket
-- privado ("notas-fiscais") além da tabela de metadados de sempre.
-- Idempotente: seguro rodar de novo.

insert into storage.buckets (id, name, public)
values ('notas-fiscais', 'notas-fiscais', false)
on conflict (id) do nothing;

drop policy if exists "notas_fiscais_storage_acesso_autenticados" on storage.objects;
create policy "notas_fiscais_storage_acesso_autenticados" on storage.objects
  for all
  using (bucket_id = 'notas-fiscais' and auth.uid() is not null)
  with check (bucket_id = 'notas-fiscais' and auth.uid() is not null);

create table if not exists notas_fiscais_arquivos (
  id uuid primary key default gen_random_uuid(),
  tipo text not null check (tipo in ('nfe', 'nfse')),
  competencia date not null,
  nome_arquivo text not null,
  storage_path text not null,
  ordem_servico_id uuid references ordens_servico (id) on delete set null,
  operador_id uuid references operadores (id) on delete set null,
  criado_em timestamptz not null default now()
);

alter table notas_fiscais_arquivos enable row level security;

drop policy if exists "notas_fiscais_arquivos_acesso_autenticados" on notas_fiscais_arquivos;
create policy "notas_fiscais_arquivos_acesso_autenticados" on notas_fiscais_arquivos
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);


-- -------------------------------------------------------------------
-- 0024_configuracoes_fiscais_loja.sql
-- -------------------------------------------------------------------

-- Sakura System — AutoCenter Edition
-- Migration 0024: dados fiscais da loja + preparação para emissão automática
-- de nota fiscal via Focus NFe (ainda não habilitada — falta a usuária
-- assinar um plano e colar o token aqui). Loja única (não multi-loja), por
-- isso uma tabela "singleton" (1 linha só, id fixo), editável só pelo admin
-- em Configurações. Ver PROJETO_STATUS.md seção 8, item 1.
--
-- Também prepara `notas_fiscais_arquivos` (migration 0023) para guardar
-- documentos emitidos automaticamente, não só upload manual de XML — mesma
-- tabela/bucket, só com campos novos pra registrar o retorno do provedor
-- fiscal (número, chave de acesso, status).
-- Idempotente: seguro rodar de novo.

create table if not exists configuracoes_fiscais_loja (
  id smallint primary key default 1,
  cnpj text,
  razao_social text,
  nome_fantasia text,
  inscricao_estadual text,
  inscricao_municipal text,
  regime_tributario text check (regime_tributario in ('simples_nacional', 'lucro_presumido', 'lucro_real')),
  cep text,
  rua text,
  numero text,
  bairro text,
  cidade text,
  uf text,
  telefone text,
  email text,
  focus_nfe_token text,
  focus_nfe_ambiente text not null default 'homologacao' check (focus_nfe_ambiente in ('homologacao', 'producao')),
  atualizado_em timestamptz not null default now(),
  constraint configuracoes_fiscais_loja_singleton check (id = 1)
);

-- A linha padrão abaixo só faz sentido enquanto esta tabela é "singleton"
-- (coluna `id`). A partir da migration 0033 ela vira uma linha POR LOJA
-- (`loja_id`), e a própria 0033 cria as linhas de cada loja. Sem esta guarda,
-- reexecutar a sequência inteira num banco já atualizado quebraria aqui, com
-- "column id does not exist" — ver PROJETO_STATUS.md, seção 6, item 12.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'configuracoes_fiscais_loja'
      and column_name = 'id'
  ) then
    insert into configuracoes_fiscais_loja (id)
    values (1)
    on conflict (id) do nothing;
  end if;
end
$$;

alter table configuracoes_fiscais_loja enable row level security;

drop policy if exists "configuracoes_fiscais_loja_acesso_autenticados" on configuracoes_fiscais_loja;
create policy "configuracoes_fiscais_loja_acesso_autenticados" on configuracoes_fiscais_loja
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

alter table notas_fiscais_arquivos
  add column if not exists origem text not null default 'manual'
  check (origem in ('manual', 'automatica'));

alter table notas_fiscais_arquivos add column if not exists numero text;
alter table notas_fiscais_arquivos add column if not exists chave_acesso text;
alter table notas_fiscais_arquivos add column if not exists status text;


-- -------------------------------------------------------------------
-- 0025_contas_pagar.sql
-- -------------------------------------------------------------------

-- Sakura System — AutoCenter Edition
-- Migration 0025: módulo "Contas a Pagar" — contas mensais (aluguel, etc.)
-- com data de vencimento, diferente das Entradas/Saídas manuais do Caixa
-- (que só registram dinheiro que já saiu). Ao marcar uma conta como paga, o
-- app gera automaticamente uma Saída em caixa_movimentos (mesmo padrão do
-- faturamento de OS) e, se a conta for recorrente, já cria a próxima
-- ocorrência (mesmo valor, vencimento um mês depois). Ver PROJETO_STATUS.md.
-- Idempotente: seguro rodar de novo.

create table if not exists contas_pagar (
  id uuid primary key default gen_random_uuid(),
  descricao text not null,
  valor numeric not null,
  vencimento date not null,
  categoria_id uuid references categorias_caixa (id) on delete set null,
  recorrente boolean not null default false,
  status text not null default 'pendente' check (status in ('pendente', 'paga')),
  data_pagamento timestamptz,
  caixa_movimento_id uuid references caixa_movimentos (id) on delete set null,
  operador_id uuid references operadores (id) on delete set null,
  criado_em timestamptz not null default now()
);

alter table contas_pagar enable row level security;

drop policy if exists "contas_pagar_acesso_autenticados" on contas_pagar;
create policy "contas_pagar_acesso_autenticados" on contas_pagar
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);


-- -------------------------------------------------------------------
-- 0026_configuracoes_painel_inicio.sql
-- -------------------------------------------------------------------

-- Sakura System — AutoCenter Edition
-- Migration 0026: quais 3 indicadores aparecem nos cartões de tendência da
-- tela Início. Ajuste único pra loja inteira (não por operador) — decisão da
-- usuária: mais simples, todo mundo vê os mesmos cartões. Loja única, por
-- isso tabela "singleton" (1 linha só, id fixo), editável só pelo admin em
-- Configurações. Ver PROJETO_STATUS.md.
-- Idempotente: seguro rodar de novo.

create table if not exists configuracoes_painel_inicio (
  id smallint primary key default 1,
  cartoes text[] not null default array['vendas_mes', 'lucro_mes', 'ticket_medio_mes'],
  constraint configuracoes_painel_inicio_singleton check (id = 1)
);

-- A linha padrão abaixo só faz sentido enquanto esta tabela é "singleton"
-- (coluna `id`). A partir da migration 0033 ela vira uma linha POR LOJA
-- (`loja_id`), e a própria 0033 cria as linhas de cada loja. Sem esta guarda,
-- reexecutar a sequência inteira num banco já atualizado quebraria aqui, com
-- "column id does not exist" — ver PROJETO_STATUS.md, seção 6, item 12.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'configuracoes_painel_inicio'
      and column_name = 'id'
  ) then
    insert into configuracoes_painel_inicio (id, cartoes)
    values (1, array['vendas_mes', 'lucro_mes', 'ticket_medio_mes'])
    on conflict (id) do nothing;
  end if;
end
$$;

alter table configuracoes_painel_inicio enable row level security;

drop policy if exists "configuracoes_painel_inicio_acesso_autenticados" on configuracoes_painel_inicio;
create policy "configuracoes_painel_inicio_acesso_autenticados" on configuracoes_painel_inicio
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);


-- -------------------------------------------------------------------
-- 0027_veiculos_tipo.sql
-- -------------------------------------------------------------------

-- Sakura System — AutoCenter Edition
-- Migration 0027: tipo de veículo (usado pra escolher o ícone certo na seção
-- "Veículos no pátio" do Início). Conjunto simplificado de propósito — carro
-- em 4 carrocerias (hatch/sedã/SUV/picape) + moto como um ícone só (a
-- usuária confirmou que não vale a pena detalhar tipos de moto, já que quase
-- não aparece moto na borracharia). Nenhum veículo já cadastrado quebra:
-- coluna opcional, sem valor default forçado (fica null até alguém escolher
-- ao editar/cadastrar de novo).
-- Idempotente: seguro rodar de novo.

do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'veiculos' and column_name = 'tipo'
  ) then
    alter table veiculos add column tipo text;
  end if;
end $$;

alter table veiculos drop constraint if exists veiculos_tipo_check;
alter table veiculos add constraint veiculos_tipo_check
  check (tipo is null or tipo in ('hatch', 'sedan', 'suv', 'picape', 'moto'));


-- -------------------------------------------------------------------
-- 0028_merge_relatorios_lucratividade.sql
-- -------------------------------------------------------------------

-- Sakura System — AutoCenter Edition
-- Migration 0028: o módulo "Lucratividade" foi absorvido dentro de "Relações"
-- (agora com abas Gráficos/Lucratividade, mesmo padrão de Estoque e Caixa
-- Diário). A chave "lucratividade" deixou de existir em MODULOS
-- (src/types/operador.ts) — quem tinha só essa permissão liberada (sem ter
-- "relatorios") precisa ganhar "relatorios" pra não perder acesso.
-- Idempotente: seguro rodar de novo.

update operadores
set permissoes = array_append(permissoes, 'relatorios')
where 'lucratividade' = any(permissoes)
  and not ('relatorios' = any(permissoes));

update operadores
set permissoes = array_remove(permissoes, 'lucratividade')
where 'lucratividade' = any(permissoes);


-- -------------------------------------------------------------------
-- 0029_categorias_servicos.sql
-- -------------------------------------------------------------------

-- Sakura System — AutoCenter Edition
-- Migration 0029: categoria de serviço (tabela própria, mesmo padrão de
-- "categorias" pra peças) — agrupa o catálogo de serviços por área do
-- veículo (Pneus, Suspensão, Amortecedores, Freios, Alinhamento...),
-- selecionável no cadastro de serviço em Configurações → "Categorias de
-- serviço". Tabela separada de "categorias" (que é só pra produtos) —
-- o conceito é diferente, mesmo padrão já usado com "categorias_caixa".
-- Idempotente: seguro rodar de novo.

create table if not exists categorias_servicos (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  criado_em timestamptz not null default now()
);

alter table categorias_servicos enable row level security;

drop policy if exists "categorias_servicos_acesso_autenticados" on categorias_servicos;
create policy "categorias_servicos_acesso_autenticados" on categorias_servicos
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

alter table servicos
  add column if not exists categoria_id uuid references categorias_servicos (id) on delete set null;


-- -------------------------------------------------------------------
-- 0030_categorias_e_servicos_padrao.sql
-- -------------------------------------------------------------------

-- Sakura System — AutoCenter Edition
-- Migration 0030: categorias de peça, categorias de serviço e um catálogo
-- inicial de serviços — baseado na organização de uma ficha de orçamento de
-- referência (autocenter de pneus/mecânica), só como ponto de partida.
-- Nenhum preço vem preenchido (a usuária define os valores reais depois) e
-- nenhuma "peça" (produto) é criada aqui — cadastrar peça exige dados
-- fiscais (NCM/CFOP/CST-CSOSN/ICMS) reais, que não dá pra adivinhar com
-- segurança a partir de uma ficha de outra loja.
-- Idempotente: seguro rodar de novo (usa "on conflict do nothing" e
-- "where not exists").

insert into categorias (nome) values
  ('Pneus'),
  ('Suspensão'),
  ('Amortecedores'),
  ('Freios'),
  ('Outras Peças')
on conflict (nome) do nothing;

insert into categorias_servicos (nome) values
  ('Pneus'),
  ('Suspensão'),
  ('Amortecedores'),
  ('Freios'),
  ('Alinhamento'),
  ('Outros Serviços')
on conflict (nome) do nothing;

insert into servicos (descricao, categoria_id, preco_padrao, ativo)
select v.descricao, cs.id, null, true
from (
  values
    ('Alinhamento Dianteiro', 'Pneus'),
    ('Balanceamento', 'Pneus'),
    ('Montagem de Pneu', 'Pneus'),
    ('Rodízio de Pneus', 'Pneus'),
    ('Serviço técnico – Suspensão', 'Suspensão'),
    ('Serviço técnico – Amortecedores', 'Amortecedores'),
    ('Retífica de Disco de Freio', 'Freios'),
    ('Higienização de Freio', 'Freios'),
    ('Sangria de Freio', 'Freios'),
    ('Serviço técnico – Freios', 'Freios'),
    ('Alinhamento Traseiro', 'Alinhamento'),
    ('Cambagem Dianteira Direita', 'Alinhamento'),
    ('Cambagem Dianteira Esquerda', 'Alinhamento'),
    ('Caster Dianteiro Direito', 'Alinhamento'),
    ('Caster Dianteiro Esquerdo', 'Alinhamento'),
    ('Eixo Traseiro Completo', 'Alinhamento'),
    ('Serviço técnico – Outros', 'Outros Serviços')
) as v(descricao, categoria_nome)
join categorias_servicos cs on cs.nome = v.categoria_nome
where not exists (
  select 1 from servicos s where s.descricao = v.descricao
);


-- -------------------------------------------------------------------
-- 0031_lojas_e_operador_lojas.sql
-- -------------------------------------------------------------------

-- Sakura System — AutoCenter Edition
-- Migration 0031: fundação multi-loja, parte 1 — tabela `lojas`, vínculo
-- many-to-many `operador_lojas` (um operador pode ter acesso a mais de uma
-- loja — ex: o dono vendo as duas lojas, um balconista só a dele) e as
-- funções de apoio pra RLS por loja.
--
-- A loja em uso hoje (produção, dados reais) vira a "loja 1", com um UUID
-- fixo e conhecido (não gerado na hora) — assim o backfill é sempre
-- idempotente, mesmo rodando a migration de novo.
--
-- `operadores.admin` continua sendo um único boolean por operador (não uma
-- flag por loja): um "admin só da loja A" é um operador com admin=true e
-- 1 linha em operador_lojas; o dono que administra as duas lojas é um
-- operador com admin=true e 2 linhas. Ver PROJETO_STATUS.md seção 3/6.
--
-- Migrations 0032 e 0033 continuam essa fundação (loja_id nas tabelas
-- operacionais, e as tabelas de configuração viram "1 linha por loja"). A
-- ordem entre as três importa: esta migration precisa rodar inteira antes,
-- porque as próximas dependem das funções e da tabela operador_lojas já
-- populada.
-- Idempotente: seguro rodar de novo.

create table if not exists lojas (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  cidade text,
  uf text,
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

-- Loja 1 = a loja única que já existe hoje. UUID fixo de propósito (não
-- gen_random_uuid()) pra todo o resto desta migration e das próximas poder
-- referenciar essa loja de forma previsível no backfill.
insert into lojas (id, nome)
values ('00000000-0000-0000-0000-000000000001', 'Loja 1')
on conflict (id) do nothing;

alter table lojas enable row level security;

drop policy if exists "lojas_leitura_autenticados" on lojas;
create policy "lojas_leitura_autenticados" on lojas
  for select
  using (auth.uid() is not null);

create table if not exists operador_lojas (
  operador_id uuid not null references operadores (id) on delete cascade,
  loja_id uuid not null references lojas (id) on delete cascade,
  criado_em timestamptz not null default now(),
  primary key (operador_id, loja_id)
);

-- Dá acesso à loja 1 pra todo operador já existente — sem isso, assim que a
-- RLS por loja entrar em vigor (migrations 0032/0033), ninguém conseguiria
-- ver nada.
insert into operador_lojas (operador_id, loja_id)
select o.id, '00000000-0000-0000-0000-000000000001'
from operadores o
where not exists (
  select 1 from operador_lojas ol
  where ol.operador_id = o.id and ol.loja_id = '00000000-0000-0000-0000-000000000001'
);

alter table operador_lojas enable row level security;

drop policy if exists "operador_lojas_leitura_autenticados" on operador_lojas;
create policy "operador_lojas_leitura_autenticados" on operador_lojas
  for select
  using (auth.uid() is not null);

-- As funções abaixo são `security definer` — a consulta interna não passa
-- pela RLS de novo, então checar a própria tabela `operadores`/
-- `operador_lojas` dentro delas não causa recursão infinita. Mesmo motivo
-- documentado na migration 0008 pra `operador_atual_e_admin()`.

-- O operador logado tem acesso (admin ou não) a essa loja?
create or replace function operador_tem_acesso_loja(p_loja_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from operador_lojas
    where operador_id = auth.uid() and loja_id = p_loja_id
  );
$$;

-- O operador logado é admin especificamente dessa loja?
create or replace function operador_e_admin_da_loja(p_loja_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from operador_lojas ol
    join operadores o on o.id = ol.operador_id
    where ol.operador_id = auth.uid()
      and ol.loja_id = p_loja_id
      and o.admin = true
      and o.ativo = true
  );
$$;

-- O operador logado é admin de QUALQUER loja (usado só em INSERT, onde
-- ainda não existe vínculo operador_lojas com o alvo que está sendo criado).
create or replace function operador_atual_e_admin_de_alguma_loja()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from operador_lojas ol
    join operadores o on o.id = ol.operador_id
    where ol.operador_id = auth.uid()
      and o.admin = true
      and o.ativo = true
  );
$$;

-- O operador logado administra o operador-alvo (ou seja: é admin em pelo
-- menos uma loja que o alvo também tem acesso)?
create or replace function operador_administra(p_operador_alvo_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from operador_lojas ol_admin
    join operadores admin_atual on admin_atual.id = ol_admin.operador_id
    join operador_lojas ol_alvo on ol_alvo.loja_id = ol_admin.loja_id
    where ol_admin.operador_id = auth.uid()
      and admin_atual.admin = true
      and admin_atual.ativo = true
      and ol_alvo.operador_id = p_operador_alvo_id
  );
$$;

-- INSERT em lojas: precisa ser admin de pelo menos uma loja (não dá pra
-- exigir "admin daquela loja" porque ela ainda não existe nesse momento).
drop policy if exists "lojas_insercao_admins" on lojas;
create policy "lojas_insercao_admins" on lojas
  for insert
  with check (operador_atual_e_admin_de_alguma_loja());

drop policy if exists "lojas_atualizacao_admins" on lojas;
create policy "lojas_atualizacao_admins" on lojas
  for update
  using (operador_e_admin_da_loja(id))
  with check (operador_e_admin_da_loja(id));

-- Escrita em operador_lojas: só quem já é admin daquela loja específica pode
-- dar/tirar acesso de alguém a ela — é aqui, e não no INSERT de `operadores`,
-- que o limite "admin da loja A não dá acesso à loja B" é reforçado.
drop policy if exists "operador_lojas_escrita_admins" on operador_lojas;
create policy "operador_lojas_escrita_admins" on operador_lojas
  for all
  using (operador_e_admin_da_loja(loja_id))
  with check (operador_e_admin_da_loja(loja_id));

-- `operadores`: leitura continua igual (qualquer logado lê a lista inteira,
-- de todas as lojas — decisão deliberada, ver PROJETO_STATUS.md seção 6).
-- Escrita passa a ser loja-aware: criar exige ser admin de alguma loja;
-- editar/excluir exige administrar especificamente aquele operador-alvo
-- (compartilhar uma loja onde quem está logado é admin).
drop policy if exists "operadores_escrita_admins" on operadores;

drop policy if exists "operadores_insercao_admins" on operadores;
create policy "operadores_insercao_admins" on operadores
  for insert
  with check (operador_atual_e_admin_de_alguma_loja());

drop policy if exists "operadores_atualizacao_admins" on operadores;
create policy "operadores_atualizacao_admins" on operadores
  for update
  using (operador_administra(id))
  with check (operador_administra(id));

drop policy if exists "operadores_exclusao_admins" on operadores;
create policy "operadores_exclusao_admins" on operadores
  for delete
  using (operador_administra(id));


-- -------------------------------------------------------------------
-- 0032_loja_id_tabelas_por_loja.sql
-- -------------------------------------------------------------------

-- Sakura System — AutoCenter Edition
-- Migration 0032: fundação multi-loja, parte 2 — adiciona `loja_id` nas
-- tabelas operacionais (o que é fisicamente/operacionalmente de uma loja só:
-- estoque, contagem, OS, caixa, contas a pagar, notas fiscais, funcionários)
-- e reescreve a RLS delas pra checar acesso à loja, não só login.
--
-- O que continua compartilhado entre as lojas (clientes, veículos, peças,
-- serviços, categorias) NÃO muda nesta migration — decisão explícita da
-- usuária, ver PROJETO_STATUS.md.
--
-- Toda coluna nova segue nullable → backfill pra loja 1 → not null, nessa
-- ordem, pra nunca deixar a produção real inacessível no meio do caminho.
-- Depende da migration 0031 já ter rodado (funções de apoio + operador_lojas
-- populada). Idempotente: seguro rodar de novo.

-- estoque_movimentos
alter table estoque_movimentos add column if not exists loja_id uuid references lojas (id);
update estoque_movimentos set loja_id = '00000000-0000-0000-0000-000000000001' where loja_id is null;
alter table estoque_movimentos alter column loja_id set not null;
create index if not exists estoque_movimentos_loja_id_idx on estoque_movimentos (loja_id);

drop policy if exists "estoque_movimentos_acesso_autenticados" on estoque_movimentos;
drop policy if exists "estoque_movimentos_acesso_por_loja" on estoque_movimentos;
create policy "estoque_movimentos_acesso_por_loja" on estoque_movimentos
  for all
  using (operador_tem_acesso_loja(loja_id))
  with check (operador_tem_acesso_loja(loja_id));

-- contagens_estoque
alter table contagens_estoque add column if not exists loja_id uuid references lojas (id);
update contagens_estoque set loja_id = '00000000-0000-0000-0000-000000000001' where loja_id is null;
alter table contagens_estoque alter column loja_id set not null;
create index if not exists contagens_estoque_loja_id_idx on contagens_estoque (loja_id);

drop policy if exists "contagens_estoque_acesso_autenticados" on contagens_estoque;
drop policy if exists "contagens_estoque_acesso_por_loja" on contagens_estoque;
create policy "contagens_estoque_acesso_por_loja" on contagens_estoque
  for all
  using (operador_tem_acesso_loja(loja_id))
  with check (operador_tem_acesso_loja(loja_id));

-- ordens_servico
alter table ordens_servico add column if not exists loja_id uuid references lojas (id);
update ordens_servico set loja_id = '00000000-0000-0000-0000-000000000001' where loja_id is null;
alter table ordens_servico alter column loja_id set not null;
create index if not exists ordens_servico_loja_id_idx on ordens_servico (loja_id);

drop policy if exists "ordens_servico_acesso_autenticados" on ordens_servico;
drop policy if exists "ordens_servico_acesso_por_loja" on ordens_servico;
create policy "ordens_servico_acesso_por_loja" on ordens_servico
  for all
  using (operador_tem_acesso_loja(loja_id))
  with check (operador_tem_acesso_loja(loja_id));

-- ordens_servico_itens: não ganha loja_id próprio, herda via ordens_servico.
drop policy if exists "ordens_servico_itens_acesso_autenticados" on ordens_servico_itens;
drop policy if exists "ordens_servico_itens_acesso_por_loja" on ordens_servico_itens;
create policy "ordens_servico_itens_acesso_por_loja" on ordens_servico_itens
  for all
  using (
    exists (
      select 1 from ordens_servico os
      where os.id = ordens_servico_itens.ordem_servico_id
        and operador_tem_acesso_loja(os.loja_id)
    )
  )
  with check (
    exists (
      select 1 from ordens_servico os
      where os.id = ordens_servico_itens.ordem_servico_id
        and operador_tem_acesso_loja(os.loja_id)
    )
  );

-- caixa_movimentos: não dá pra herdar de ordens_servico porque existem
-- lançamentos manuais (Entradas/Saídas) sem ordem_servico_id.
alter table caixa_movimentos add column if not exists loja_id uuid references lojas (id);
update caixa_movimentos set loja_id = '00000000-0000-0000-0000-000000000001' where loja_id is null;
alter table caixa_movimentos alter column loja_id set not null;
create index if not exists caixa_movimentos_loja_id_idx on caixa_movimentos (loja_id);

drop policy if exists "caixa_movimentos_acesso_autenticados" on caixa_movimentos;
drop policy if exists "caixa_movimentos_acesso_por_loja" on caixa_movimentos;
create policy "caixa_movimentos_acesso_por_loja" on caixa_movimentos
  for all
  using (operador_tem_acesso_loja(loja_id))
  with check (operador_tem_acesso_loja(loja_id));

-- contas_pagar
alter table contas_pagar add column if not exists loja_id uuid references lojas (id);
update contas_pagar set loja_id = '00000000-0000-0000-0000-000000000001' where loja_id is null;
alter table contas_pagar alter column loja_id set not null;
create index if not exists contas_pagar_loja_id_idx on contas_pagar (loja_id);

drop policy if exists "contas_pagar_acesso_autenticados" on contas_pagar;
drop policy if exists "contas_pagar_acesso_por_loja" on contas_pagar;
create policy "contas_pagar_acesso_por_loja" on contas_pagar
  for all
  using (operador_tem_acesso_loja(loja_id))
  with check (operador_tem_acesso_loja(loja_id));

-- notas_fiscais_arquivos (o bucket de Storage em si continua sem segmentação
-- por loja — decisão de escopo documentada no PROJETO_STATUS.md; a tabela de
-- metadados, que é por onde o app sempre lê, já fica isolada corretamente)
alter table notas_fiscais_arquivos add column if not exists loja_id uuid references lojas (id);
update notas_fiscais_arquivos set loja_id = '00000000-0000-0000-0000-000000000001' where loja_id is null;
alter table notas_fiscais_arquivos alter column loja_id set not null;
create index if not exists notas_fiscais_arquivos_loja_id_idx on notas_fiscais_arquivos (loja_id);

drop policy if exists "notas_fiscais_arquivos_acesso_autenticados" on notas_fiscais_arquivos;
drop policy if exists "notas_fiscais_arquivos_acesso_por_loja" on notas_fiscais_arquivos;
create policy "notas_fiscais_arquivos_acesso_por_loja" on notas_fiscais_arquivos
  for all
  using (operador_tem_acesso_loja(loja_id))
  with check (operador_tem_acesso_loja(loja_id));

-- funcionarios: EXCEÇÃO — loja_id fica nullable de propósito. O gatilho
-- trg_sincroniza_funcionario_operador (migration 0019) cria a linha em
-- funcionarios no momento do INSERT em operadores, antes do app inserir as
-- linhas em operador_lojas daquele operador novo (isso só acontece depois,
-- na mesma função de criação) — se loja_id fosse not null, o gatilho
-- quebraria. src/lib/operadores.ts preenche loja_id logo em seguida, via
-- UPDATE, assim que operador_lojas é populada. Enquanto loja_id está nulo, o
-- funcionário fica invisível pra todo mundo via RLS (comportamento seguro
-- por padrão, não é bug). Funcionários sem login (mecânico sem operador_id)
-- recebem loja_id direto no cadastro pela tela de Funcionários.
alter table funcionarios add column if not exists loja_id uuid references lojas (id);
update funcionarios set loja_id = '00000000-0000-0000-0000-000000000001' where loja_id is null;
create index if not exists funcionarios_loja_id_idx on funcionarios (loja_id);

drop policy if exists "funcionarios_acesso_autenticados" on funcionarios;
drop policy if exists "funcionarios_acesso_por_loja" on funcionarios;
create policy "funcionarios_acesso_por_loja" on funcionarios
  for all
  using (operador_tem_acesso_loja(loja_id))
  with check (operador_tem_acesso_loja(loja_id));

-- funcionario_filhos: não ganha loja_id próprio, herda via funcionarios.
drop policy if exists "funcionario_filhos_acesso_autenticados" on funcionario_filhos;
drop policy if exists "funcionario_filhos_acesso_por_loja" on funcionario_filhos;
create policy "funcionario_filhos_acesso_por_loja" on funcionario_filhos
  for all
  using (
    exists (
      select 1 from funcionarios f
      where f.id = funcionario_filhos.funcionario_id
        and operador_tem_acesso_loja(f.loja_id)
    )
  )
  with check (
    exists (
      select 1 from funcionarios f
      where f.id = funcionario_filhos.funcionario_id
        and operador_tem_acesso_loja(f.loja_id)
    )
  );


-- -------------------------------------------------------------------
-- 0033_configuracoes_por_loja.sql
-- -------------------------------------------------------------------

-- Sakura System — AutoCenter Edition
-- Migration 0033: fundação multi-loja, parte 3 — as tabelas de configuração
-- que hoje são "singleton" (1 linha só, id fixo em 1: configuracoes_garantia,
-- configuracoes_fiscais_loja, configuracoes_painel_inicio) passam a ter
-- 1 linha POR LOJA, trocando a PK de `id smallint` pra `loja_id uuid`.
-- `configuracoes_juros_parcelas` não é singleton (1 linha por
-- numero_parcelas, 2 a 12) — a PK vira composta (loja_id, numero_parcelas).
--
-- Troca de PK não é uma mudança aditiva, então cada tabela usa um bloco
-- guardado (checa o estado atual antes de alterar) pra continuar
-- idempotente — mesmo padrão usado na migration 0019 ao repontar FKs de
-- tecnico_id/vendedor_id. Depende das migrations 0031/0032 já terem
-- rodado. Idempotente: seguro rodar de novo.

-- configuracoes_garantia
alter table configuracoes_garantia add column if not exists loja_id uuid references lojas (id);
update configuracoes_garantia set loja_id = '00000000-0000-0000-0000-000000000001' where loja_id is null;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_name = 'configuracoes_garantia' and column_name = 'id'
  ) then
    alter table configuracoes_garantia alter column loja_id set not null;
    alter table configuracoes_garantia drop constraint configuracoes_garantia_pkey;
    alter table configuracoes_garantia drop constraint if exists configuracoes_garantia_singleton;
    alter table configuracoes_garantia add constraint configuracoes_garantia_pkey primary key (loja_id);
    alter table configuracoes_garantia drop column id;
  end if;
end $$;

drop policy if exists "configuracoes_garantia_acesso_autenticados" on configuracoes_garantia;
drop policy if exists "configuracoes_garantia_acesso_por_loja" on configuracoes_garantia;
create policy "configuracoes_garantia_acesso_por_loja" on configuracoes_garantia
  for all
  using (operador_tem_acesso_loja(loja_id))
  with check (operador_tem_acesso_loja(loja_id));

-- configuracoes_fiscais_loja
alter table configuracoes_fiscais_loja add column if not exists loja_id uuid references lojas (id);
update configuracoes_fiscais_loja set loja_id = '00000000-0000-0000-0000-000000000001' where loja_id is null;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_name = 'configuracoes_fiscais_loja' and column_name = 'id'
  ) then
    alter table configuracoes_fiscais_loja alter column loja_id set not null;
    alter table configuracoes_fiscais_loja drop constraint configuracoes_fiscais_loja_pkey;
    alter table configuracoes_fiscais_loja drop constraint if exists configuracoes_fiscais_loja_singleton;
    alter table configuracoes_fiscais_loja add constraint configuracoes_fiscais_loja_pkey primary key (loja_id);
    alter table configuracoes_fiscais_loja drop column id;
  end if;
end $$;

drop policy if exists "configuracoes_fiscais_loja_acesso_autenticados" on configuracoes_fiscais_loja;
drop policy if exists "configuracoes_fiscais_loja_acesso_por_loja" on configuracoes_fiscais_loja;
create policy "configuracoes_fiscais_loja_acesso_por_loja" on configuracoes_fiscais_loja
  for all
  using (operador_tem_acesso_loja(loja_id))
  with check (operador_tem_acesso_loja(loja_id));

-- configuracoes_painel_inicio
alter table configuracoes_painel_inicio add column if not exists loja_id uuid references lojas (id);
update configuracoes_painel_inicio set loja_id = '00000000-0000-0000-0000-000000000001' where loja_id is null;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_name = 'configuracoes_painel_inicio' and column_name = 'id'
  ) then
    alter table configuracoes_painel_inicio alter column loja_id set not null;
    alter table configuracoes_painel_inicio drop constraint configuracoes_painel_inicio_pkey;
    alter table configuracoes_painel_inicio drop constraint if exists configuracoes_painel_inicio_singleton;
    alter table configuracoes_painel_inicio add constraint configuracoes_painel_inicio_pkey primary key (loja_id);
    alter table configuracoes_painel_inicio drop column id;
  end if;
end $$;

drop policy if exists "configuracoes_painel_inicio_acesso_autenticados" on configuracoes_painel_inicio;
drop policy if exists "configuracoes_painel_inicio_acesso_por_loja" on configuracoes_painel_inicio;
create policy "configuracoes_painel_inicio_acesso_por_loja" on configuracoes_painel_inicio
  for all
  using (operador_tem_acesso_loja(loja_id))
  with check (operador_tem_acesso_loja(loja_id));

-- configuracoes_juros_parcelas: não é singleton — PK vira composta
-- (loja_id, numero_parcelas) em vez de só numero_parcelas.
alter table configuracoes_juros_parcelas add column if not exists loja_id uuid references lojas (id);
update configuracoes_juros_parcelas set loja_id = '00000000-0000-0000-0000-000000000001' where loja_id is null;

do $$
begin
  if not exists (
    select 1 from information_schema.key_column_usage
    where table_name = 'configuracoes_juros_parcelas'
      and column_name = 'loja_id'
      and constraint_name = 'configuracoes_juros_parcelas_pkey'
  ) then
    alter table configuracoes_juros_parcelas alter column loja_id set not null;
    alter table configuracoes_juros_parcelas drop constraint configuracoes_juros_parcelas_pkey;
    alter table configuracoes_juros_parcelas add constraint configuracoes_juros_parcelas_pkey
      primary key (loja_id, numero_parcelas);
  end if;
end $$;

drop policy if exists "configuracoes_juros_parcelas_acesso_autenticados" on configuracoes_juros_parcelas;
drop policy if exists "configuracoes_juros_parcelas_acesso_por_loja" on configuracoes_juros_parcelas;
create policy "configuracoes_juros_parcelas_acesso_por_loja" on configuracoes_juros_parcelas
  for all
  using (operador_tem_acesso_loja(loja_id))
  with check (operador_tem_acesso_loja(loja_id));


-- -------------------------------------------------------------------
-- 0034_corrige_rls_criacao_loja.sql
-- -------------------------------------------------------------------

-- Sakura System — AutoCenter Edition
-- Migration 0034: corrige um bug real de RLS que impedia criar uma loja nova
-- pelo app.
--
-- O que acontecia: `criarLoja()` (src/lib/lojas.ts) faz dois inserts — 1) a
-- loja em si, 2) o vínculo do operador criador em `operador_lojas` (senão
-- ele ficaria sem acesso à loja que acabou de criar). O primeiro insert
-- sempre funcionava (a policy `lojas_insercao_admins` só exige ser admin de
-- QUALQUER loja). O segundo insert sempre FALHAVA: a policy
-- `operador_lojas_escrita_admins` (migration 0031) exigia
-- `operador_e_admin_da_loja(loja_id)`, que checa se já existe uma linha em
-- `operador_lojas` ligando esse operador a essa loja — só que essa é
-- exatamente a linha que o insert está tentando criar (problema do
-- "ovo e a galinha"). Resultado: a loja nova ficava criada (órfã, sem
-- ninguém vinculado a ela) e o app mostrava um erro no segundo passo.
--
-- Correção: divide a policy "for all" em duas (insert vs. update/delete).
-- A de insert ganha um caminho de bootstrap — o próprio operador pode se
-- vincular a uma loja que AINDA não tem ninguém vinculado, desde que ele já
-- seja admin de alguma outra loja (mesma função usada pra permitir o insert
-- em `lojas`). Isso preserva o isolamento entre lojas: só funciona enquanto
-- a loja alvo está "zerada"; depois que ela já tem algum vínculo, só quem já
-- é admin especificamente dela pode mexer (igual antes).
-- Idempotente: seguro rodar de novo.

drop policy if exists "operador_lojas_escrita_admins" on operador_lojas;
drop policy if exists "operador_lojas_insercao" on operador_lojas;
drop policy if exists "operador_lojas_atualizacao" on operador_lojas;
drop policy if exists "operador_lojas_exclusao" on operador_lojas;

create policy "operador_lojas_insercao" on operador_lojas
  for insert
  with check (
    (
      operador_id = auth.uid()
      and operador_atual_e_admin_de_alguma_loja()
      and not exists (
        select 1 from operador_lojas ol_existente
        where ol_existente.loja_id = operador_lojas.loja_id
      )
    )
    or operador_e_admin_da_loja(loja_id)
  );

create policy "operador_lojas_atualizacao" on operador_lojas
  for update
  using (operador_e_admin_da_loja(loja_id))
  with check (operador_e_admin_da_loja(loja_id));

create policy "operador_lojas_exclusao" on operador_lojas
  for delete
  using (operador_e_admin_da_loja(loja_id));

-- Conserta o estrago que o bug acima já pode ter deixado: qualquer loja que
-- ficou "órfã" (criada, mas sem ninguém vinculado, porque o segundo insert
-- sempre falhava) fica invisível pro LojaSwitcher e ninguém consegue nem
-- inativá-la pelo app (a policy de update também exige já ser admin dela).
-- Vincula toda loja órfã a todo admin ativo — mesmo padrão de backfill já
-- usado pra "Loja 1" na migration 0031.
insert into operador_lojas (operador_id, loja_id)
select o.id, l.id
from lojas l
cross join operadores o
where o.admin = true
  and o.ativo = true
  and not exists (
    select 1 from operador_lojas ol where ol.loja_id = l.id
  );


-- -------------------------------------------------------------------
-- 0035_custo_servico.sql
-- -------------------------------------------------------------------

-- Sakura System — AutoCenter Edition
-- Migration 0035: adiciona custo (ex: mão de obra) ao catálogo de serviços,
-- mesmo padrão já usado em `pecas.preco_custo`. Sem isso, a aba
-- Lucratividade (Relações) calculava a margem de peça certinha, mas
-- considerava o custo de todo item de serviço como zero — subestimando o
-- custo real da loja.
-- Idempotente: seguro rodar de novo.

alter table servicos add column if not exists custo numeric;


-- -------------------------------------------------------------------
-- 0036_contas_receber.sql
-- -------------------------------------------------------------------

-- Sakura System — AutoCenter Edition
-- Migration 0036: módulo "Contas a Receber" — permite faturar uma OS sem o
-- cliente pagar tudo na hora, controlando o que ainda falta receber
-- (espelha o "Contas a Pagar" que já existe, só que do lado do que a loja
-- tem a receber, não do que ela deve). Ao faturar uma OS escolhendo "a
-- receber" em vez de "recebido agora", o app não lança a Entrada no Caixa
-- na hora — em vez disso cria uma linha aqui, pendente. Marcar como
-- recebido gera a Entrada no Caixa nesse momento (mesmo padrão de
-- `pagarConta`/Contas a Pagar). Criada depois da fundação multi-loja, então
-- já nasce com `loja_id` obrigatório, sem precisar de backfill.
-- Idempotente: seguro rodar de novo.

create table if not exists contas_receber (
  id uuid primary key default gen_random_uuid(),
  loja_id uuid not null references lojas (id),
  cliente_id uuid not null references clientes (id),
  ordem_servico_id uuid references ordens_servico (id) on delete set null,
  descricao text not null,
  valor numeric not null,
  vencimento date not null,
  status text not null default 'pendente' check (status in ('pendente', 'recebido')),
  data_recebimento timestamptz,
  caixa_movimento_id uuid references caixa_movimentos (id) on delete set null,
  operador_id uuid references operadores (id) on delete set null,
  criado_em timestamptz not null default now(),
  constraint contas_receber_ordem_id_unique unique (ordem_servico_id)
);

create index if not exists contas_receber_loja_id_idx on contas_receber (loja_id);

alter table contas_receber enable row level security;

drop policy if exists "contas_receber_acesso_por_loja" on contas_receber;
create policy "contas_receber_acesso_por_loja" on contas_receber
  for all
  using (operador_tem_acesso_loja(loja_id))
  with check (operador_tem_acesso_loja(loja_id));


-- -------------------------------------------------------------------
-- 0037_numero_os_status_e_pagamento_split.sql
-- -------------------------------------------------------------------

-- Sakura System — AutoCenter Edition
-- Migration 0037: três mudanças pedidas pela usuária depois de usar o
-- sistema na prática:
--
-- 1) Ordens de Serviço ganham um número sequencial por loja (1, 2, 3...),
--    em vez de só o UUID (que aparecia como "OS #a0270a6e" — grande e sem
--    sentido pra ela). Numerado por loja via trigger (cada loja começa do 1).
--
-- 2) Simplifica o status da OS: remove "aberta" como estado distinto de
--    "em_andamento" — toda OS nova já nasce "em_andamento" diretamente. As
--    OS que ainda estavam com status "aberta" viram "em_andamento" no
--    backfill. Status possíveis agora: em_andamento, concluida, faturada.
--
-- 3) Permite faturar uma OS em mais de uma forma de pagamento (ex: metade
--    Pix, metade cartão) — remove a trava de "1 lançamento de Caixa por OS"
--    (`caixa_movimentos_ordem_id_idx_unique`), já que agora pode haver um
--    lançamento por forma de pagamento usada.
--
-- 4) Bug real encontrado testando a exclusão de loja pelo app: a migration
--    0031 nunca criou uma policy de RLS pra DELETE em `lojas` (só
--    select/insert/update) — sem policy nenhuma cobrindo o comando, o
--    Postgres simplesmente não deixa nenhuma linha visível pra excluir, e o
--    delete "funciona" sem erro nenhum, mas apaga 0 linhas (nem a loja some,
--    nem aparece mensagem de erro — silencioso, o pior tipo de bug). Cria a
--    policy que faltava, mesma regra de quem pode editar (admin da loja).
--
-- Idempotente: seguro rodar de novo.

-- 1) Número sequencial por loja -----------------------------------------
alter table ordens_servico add column if not exists numero integer;

create or replace function definir_numero_ordem_servico()
returns trigger
language plpgsql
as $$
begin
  if new.numero is null then
    select coalesce(max(numero), 0) + 1 into new.numero
    from ordens_servico
    where loja_id = new.loja_id;
  end if;
  return new;
end;
$$;

drop trigger if exists trigger_definir_numero_ordem_servico on ordens_servico;
create trigger trigger_definir_numero_ordem_servico
  before insert on ordens_servico
  for each row
  execute function definir_numero_ordem_servico();

-- Backfill: numera as OS que já existem, por loja, na ordem em que foram
-- abertas (só toca quem ainda está com numero nulo — seguro rodar de novo).
with numeradas as (
  select id, row_number() over (partition by loja_id order by data_abertura) as rn
  from ordens_servico
  where numero is null
)
update ordens_servico o
set numero = numeradas.rn
from numeradas
where o.id = numeradas.id;

alter table ordens_servico alter column numero set not null;

create unique index if not exists ordens_servico_loja_numero_unique
  on ordens_servico (loja_id, numero);

-- 2) Simplifica o status --------------------------------------------------
update ordens_servico set status = 'em_andamento' where status = 'aberta';

alter table ordens_servico drop constraint if exists ordens_servico_status_check;
alter table ordens_servico add constraint ordens_servico_status_check
  check (status in ('em_andamento', 'concluida', 'faturada'));

alter table ordens_servico alter column status set default 'em_andamento';

-- 3) Permite mais de um lançamento de Caixa por OS (split de pagamento) --
alter table caixa_movimentos drop constraint if exists caixa_movimentos_ordem_id_idx_unique;

-- 4) Policy de DELETE que faltava em `lojas` --------------------------------
drop policy if exists "lojas_exclusao_admins" on lojas;
create policy "lojas_exclusao_admins" on lojas
  for delete
  using (operador_e_admin_da_loja(id));


-- -------------------------------------------------------------------
-- 0038_deve_trocar_senha.sql
-- -------------------------------------------------------------------

-- Sakura System — AutoCenter Edition
-- Migration 0038: redefinição de senha de operador esquecida.
--
-- Como os operadores não têm e-mail de verdade (o login usa só "usuário",
-- o e-mail é inventado por baixo dos panos — ver src/lib/auth.ts), o fluxo
-- padrão de "esqueci minha senha" do Supabase Auth (link por e-mail) não
-- funciona aqui. Em vez disso: um admin gera uma senha temporária pra outro
-- operador (via Edge Function `redefinir-senha-operador`, que usa a service
-- role key — nunca fica no app instalado) e essa coluna marca que, no
-- próximo login, o sistema exige trocar a senha antes de liberar o app.
--
-- Idempotente: seguro rodar de novo.

alter table operadores add column if not exists deve_trocar_senha boolean not null default false;


-- -------------------------------------------------------------------
-- 0039_fornecedores_pedidos_compra.sql
-- -------------------------------------------------------------------

-- Sakura System — AutoCenter Edition
-- Migration 0039: módulo de Fornecedores + Pedido de Compra.
--
-- `fornecedores` é catálogo compartilhado entre lojas (mesmo padrão de
-- `clientes`/`pecas`/`servicos` — um fornecedor pode entregar pra mais de
-- uma loja da empresa). `pedidos_compra`/`pedidos_compra_itens` são por
-- loja (cada loja faz os próprios pedidos), mesmo padrão de
-- `ordens_servico`/`ordens_servico_itens`: número sequencial por loja via
-- trigger, itens sem `loja_id` próprio (herdam via `pedido_compra_id`).
--
-- "Receber pedido" (dar entrada no estoque) é feito pelo app conferindo as
-- quantidades chegadas contra o pedido — não é importação de XML de nota
-- fiscal do fornecedor (isso é bem mais complexo, fica pra uma etapa futura
-- separada se um dia for pedida).
--
-- Nota: uma versão anterior e mais simples de `fornecedores` (sem endereço)
-- chegou a ser publicada numa sessão separada — as colunas de endereço são
-- adicionadas via `alter table ... add column if not exists`, não só no
-- `create table`, pra funcionar tanto num banco novo quanto num banco que
-- já tinha essa versão simples.
--
-- Idempotente: seguro rodar de novo.

create table if not exists fornecedores (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  cnpj text,
  telefone text,
  email text,
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

-- Colunas de endereço, adicionadas via `alter` (não só no `create table`
-- acima) porque uma versão mais simples desta tabela — sem endereço — pode
-- já ter sido criada antes desta migration existir; `create table if not
-- exists` sozinho não adicionaria essas colunas num banco que já tem a
-- tabela.
alter table fornecedores add column if not exists cep text;
alter table fornecedores add column if not exists rua text;
alter table fornecedores add column if not exists numero text;
alter table fornecedores add column if not exists bairro text;
alter table fornecedores add column if not exists cidade text;
alter table fornecedores add column if not exists uf text;

alter table fornecedores enable row level security;
drop policy if exists "fornecedores_acesso_autenticados" on fornecedores;
create policy "fornecedores_acesso_autenticados" on fornecedores
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

create table if not exists pedidos_compra (
  id uuid primary key default gen_random_uuid(),
  numero integer,
  loja_id uuid not null references lojas (id),
  fornecedor_id uuid not null references fornecedores (id),
  status text not null default 'pendente'
    check (status in ('pendente', 'parcial', 'recebido', 'cancelado')),
  data_pedido date not null default current_date,
  observacao text,
  operador_id uuid references operadores (id),
  criado_em timestamptz not null default now()
);

create index if not exists pedidos_compra_loja_id_idx on pedidos_compra (loja_id);
create index if not exists pedidos_compra_fornecedor_id_idx on pedidos_compra (fornecedor_id);

create or replace function definir_numero_pedido_compra()
returns trigger
language plpgsql
as $$
begin
  if new.numero is null then
    select coalesce(max(numero), 0) + 1 into new.numero
    from pedidos_compra
    where loja_id = new.loja_id;
  end if;
  return new;
end;
$$;

drop trigger if exists trigger_definir_numero_pedido_compra on pedidos_compra;
create trigger trigger_definir_numero_pedido_compra
  before insert on pedidos_compra
  for each row
  execute function definir_numero_pedido_compra();

create unique index if not exists pedidos_compra_loja_numero_unique
  on pedidos_compra (loja_id, numero);

alter table pedidos_compra enable row level security;
drop policy if exists "pedidos_compra_acesso_por_loja" on pedidos_compra;
create policy "pedidos_compra_acesso_por_loja" on pedidos_compra
  for all
  using (operador_tem_acesso_loja(loja_id))
  with check (operador_tem_acesso_loja(loja_id));

create table if not exists pedidos_compra_itens (
  id uuid primary key default gen_random_uuid(),
  pedido_compra_id uuid not null references pedidos_compra (id) on delete cascade,
  peca_id uuid not null references pecas (id),
  quantidade_pedida numeric(12, 2) not null check (quantidade_pedida > 0),
  preco_unitario numeric(12, 2),
  quantidade_recebida numeric(12, 2) not null default 0
);

create index if not exists pedidos_compra_itens_pedido_id_idx
  on pedidos_compra_itens (pedido_compra_id);

alter table pedidos_compra_itens enable row level security;
drop policy if exists "pedidos_compra_itens_acesso_por_loja" on pedidos_compra_itens;
create policy "pedidos_compra_itens_acesso_por_loja" on pedidos_compra_itens
  for all
  using (
    exists (
      select 1 from pedidos_compra pc
      where pc.id = pedidos_compra_itens.pedido_compra_id
        and operador_tem_acesso_loja(pc.loja_id)
    )
  )
  with check (
    exists (
      select 1 from pedidos_compra pc
      where pc.id = pedidos_compra_itens.pedido_compra_id
        and operador_tem_acesso_loja(pc.loja_id)
    )
  );


-- -------------------------------------------------------------------
-- 0040_auditoria.sql
-- -------------------------------------------------------------------

-- Sakura System — AutoCenter Edition
-- Migration 0040: trilha de auditoria — "quem mexeu em quê".
--
-- Uma tabela genérica (`auditoria`) recebe uma linha toda vez que um
-- registro é **editado** ou **excluído** numa tabela sensível — via trigger
-- de banco, não chamada manual do app. Isso importa: um trigger pega
-- qualquer alteração não importa por onde ela veio (tela do app, um bug
-- futuro, até uma edição manual pelo SQL Editor do Supabase), diferente de
-- logar "na mão" dentro de cada função do `lib/`, que exigiria lembrar de
-- adicionar em todo lugar e vazaria silenciosamente em qualquer um
-- esquecido.
--
-- Escopo desta primeira leva (dá pra estender depois, é só repetir o bloco
-- de trigger pra outra tabela): `operadores`, `pecas`, `servicos`,
-- `caixa_movimentos`, `contas_pagar`, `contas_receber`, `ordens_servico`,
-- `clientes`, `fornecedores`, `pedidos_compra`, `lojas`. Só
-- **UPDATE/DELETE** (não INSERT) — a criação de um registro já fica
-- registrada nele mesmo (a maioria das tabelas já tem `criado_em`, várias
-- também têm `operador_id`/`criado_por_id`); o que faltava era saber quem
-- mudou ou apagou algo depois de criado, que é o que este módulo cobre.
--
-- Leitura só pra admin (`operador_atual_e_admin()`, já existe desde a
-- migration 0008). Escrita só acontece pelo trigger (função `security
-- definer`, roda com o dono da função — por isso não precisa de policy de
-- insert aqui, um operador comum não consegue gravar direto nesta tabela).
--
-- Idempotente: seguro rodar de novo.

create table if not exists auditoria (
  id uuid primary key default gen_random_uuid(),
  tabela text not null,
  registro_id uuid not null,
  acao text not null check (acao in ('atualizar', 'excluir')),
  operador_id uuid references operadores (id),
  dados_antes jsonb,
  dados_depois jsonb,
  criado_em timestamptz not null default now()
);

create index if not exists auditoria_tabela_registro_idx on auditoria (tabela, registro_id);
create index if not exists auditoria_criado_em_idx on auditoria (criado_em desc);
create index if not exists auditoria_operador_id_idx on auditoria (operador_id);

alter table auditoria enable row level security;
drop policy if exists "auditoria_leitura_admins" on auditoria;
create policy "auditoria_leitura_admins" on auditoria
  for select
  using (operador_atual_e_admin());

create or replace function registrar_auditoria()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (tg_op = 'UPDATE') then
    insert into auditoria (tabela, registro_id, acao, operador_id, dados_antes, dados_depois)
    values (tg_table_name, new.id, 'atualizar', auth.uid(), to_jsonb(old), to_jsonb(new));
    return new;
  elsif (tg_op = 'DELETE') then
    insert into auditoria (tabela, registro_id, acao, operador_id, dados_antes, dados_depois)
    values (tg_table_name, old.id, 'excluir', auth.uid(), to_jsonb(old), null);
    return old;
  end if;
  return null;
end;
$$;

do $$
declare
  tabela_alvo text;
begin
  foreach tabela_alvo in array array[
    'operadores', 'pecas', 'servicos', 'caixa_movimentos', 'contas_pagar',
    'contas_receber', 'ordens_servico', 'clientes', 'fornecedores',
    'pedidos_compra', 'lojas'
  ]
  loop
    execute format('drop trigger if exists trigger_auditoria on %I', tabela_alvo);
    execute format(
      'create trigger trigger_auditoria after update or delete on %I ' ||
      'for each row execute function registrar_auditoria()',
      tabela_alvo
    );
  end loop;
end;
$$;


-- -------------------------------------------------------------------
-- 0041_depositos.sql
-- -------------------------------------------------------------------

-- Sakura System — AutoCenter Edition
-- Migration 0041: cadastro de Depósito — locais físicos de estoque dentro de
-- uma loja (ex: "Depósito Principal", "Fundos"). Toda loja (já existente ou
-- criada depois desta migration) ganha automaticamente um depósito padrão —
-- nada muda pra quem usa um só lugar físico; só quem criar um depósito
-- extra passa a escolher entre eles.
--
-- `estoque_movimentos` e `contagens_estoque` ganham `deposito_id` (mesmo
-- padrão nullable → backfill → not null das migrations 0031-0033 pra
-- loja_id). O saldo por peça continua sendo a soma de todos os depósitos da
-- loja (calcularSaldoPorPeca, sem mudança) — o saldo por depósito é um
-- cálculo novo (calcularSaldoPorPecaEDeposito), usado na Contagem.
--
-- Idempotente: seguro rodar de novo.

create table if not exists depositos (
  id uuid primary key default gen_random_uuid(),
  loja_id uuid not null references lojas (id),
  nome text not null,
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

create index if not exists depositos_loja_id_idx on depositos (loja_id);

-- Toda loja que ainda não tem nenhum depósito ganha um "Depósito Principal"
-- — cobre o backfill de lojas já existentes. Lojas novas passam a ganhar o
-- depósito padrão direto pelo app (lib/lojas.ts → criarLoja()), mas rodar
-- esta migration de novo também cobre qualquer loja criada fora do app.
insert into depositos (loja_id, nome)
select l.id, 'Depósito Principal'
from lojas l
where not exists (select 1 from depositos d where d.loja_id = l.id);

alter table depositos enable row level security;

drop policy if exists "depositos_leitura_por_loja" on depositos;
create policy "depositos_leitura_por_loja" on depositos
  for select
  using (operador_tem_acesso_loja(loja_id));

drop policy if exists "depositos_insercao_admins" on depositos;
create policy "depositos_insercao_admins" on depositos
  for insert
  with check (operador_e_admin_da_loja(loja_id));

drop policy if exists "depositos_atualizacao_admins" on depositos;
create policy "depositos_atualizacao_admins" on depositos
  for update
  using (operador_e_admin_da_loja(loja_id))
  with check (operador_e_admin_da_loja(loja_id));

drop policy if exists "depositos_exclusao_admins" on depositos;
create policy "depositos_exclusao_admins" on depositos
  for delete
  using (operador_e_admin_da_loja(loja_id));

-- estoque_movimentos
alter table estoque_movimentos add column if not exists deposito_id uuid references depositos (id);
update estoque_movimentos em
set deposito_id = (
  select d.id from depositos d
  where d.loja_id = em.loja_id
  order by d.criado_em asc
  limit 1
)
where deposito_id is null;
alter table estoque_movimentos alter column deposito_id set not null;
create index if not exists estoque_movimentos_deposito_id_idx on estoque_movimentos (deposito_id);

-- contagens_estoque
alter table contagens_estoque add column if not exists deposito_id uuid references depositos (id);
update contagens_estoque ce
set deposito_id = (
  select d.id from depositos d
  where d.loja_id = ce.loja_id
  order by d.criado_em asc
  limit 1
)
where deposito_id is null;
alter table contagens_estoque alter column deposito_id set not null;
create index if not exists contagens_estoque_deposito_id_idx on contagens_estoque (deposito_id);


-- -------------------------------------------------------------------
-- 0042_cotacoes_pecas.sql
-- -------------------------------------------------------------------

-- Sakura System — AutoCenter Edition
-- Migration 0042: cotação de peças por fornecedor — histórico de preço
-- (peça, fornecedor, preço, data) pra comparar antes de decidir onde
-- comprar. Compartilhado entre lojas, mesmo padrão de `pecas`/`fornecedores`
-- (o catálogo é único pra empresa toda).
--
-- Tabela só de histórico (insert-only pelo app): toda vez que um Pedido de
-- Compra é criado com preço numa peça, uma linha nova é gravada aqui
-- sozinha (src/lib/pedidosCompra.ts → criarPedido()) — sem formulário
-- próprio pra preencher. A tela de Pedido de Compra usa
-- melhorCotacaoPorFornecedor() (src/lib/cotacoesPecas.ts) pra mostrar só a
-- cotação mais recente de cada fornecedor.
--
-- Idempotente: seguro rodar de novo.

create table if not exists cotacoes_pecas (
  id uuid primary key default gen_random_uuid(),
  peca_id uuid not null references pecas (id),
  fornecedor_id uuid not null references fornecedores (id),
  preco numeric(12, 2) not null check (preco > 0),
  criado_em timestamptz not null default now()
);

create index if not exists cotacoes_pecas_peca_id_idx on cotacoes_pecas (peca_id);
create index if not exists cotacoes_pecas_fornecedor_id_idx on cotacoes_pecas (fornecedor_id);

alter table cotacoes_pecas enable row level security;
drop policy if exists "cotacoes_pecas_acesso_autenticados" on cotacoes_pecas;
create policy "cotacoes_pecas_acesso_autenticados" on cotacoes_pecas
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);


-- -------------------------------------------------------------------
-- 0043_contas_pagar_recorrente_ate.sql
-- -------------------------------------------------------------------

-- Sakura System — AutoCenter Edition
-- Migration 0043: fim opcional pra recorrência de Contas a Pagar
-- `contas_pagar.recorrente` já existia (liga/desliga a criação automática da
-- próxima ocorrência ao pagar), mas não tinha como dizer "isso vai só até tal
-- mês" — a conta recorria pra sempre. `recorrente_ate` é opcional: nulo
-- continua recorrendo sem fim (comportamento de sempre); preenchido, para de
-- criar a próxima ocorrência quando o próximo vencimento passar dessa data
-- (ver pagarConta() em src/lib/contasPagar.ts). Ver PROJETO_STATUS.md.
-- Idempotente: seguro rodar de novo.

alter table contas_pagar add column if not exists recorrente_ate date;


-- -------------------------------------------------------------------
-- 0044_dados_fiscais_nfse.sql
-- -------------------------------------------------------------------

-- Sakura System — AutoCenter Edition
-- Migration 0044: campos extras em configuracoes_fiscais_loja pra emissão de
-- NFS-e (serviço) via Focus NFe — código IBGE do município da loja (exigido
-- pela API como "prestador.codigo_municipio"), código do serviço na lista da
-- LC 116/2003 (item_lista_servico — "14.01", usado como padrão pro app: cobre
-- "manutenção e conservação de veículos", a atividade principal de um
-- autocenter/borracharia), alíquota do ISS e o código tributário do serviço
-- específico do município (varia de cidade pra cidade, opcional — só alguns
-- municípios exigem). Nenhum desses bloqueia a emissão de NFC-e (peças), que
-- não usa nenhum deles. Ver PROJETO_STATUS.md seção 8, item 1.
-- Idempotente: seguro rodar de novo.

alter table configuracoes_fiscais_loja
  add column if not exists codigo_municipio text,
  add column if not exists item_lista_servico text default '14.01',
  add column if not exists aliquota_iss numeric,
  add column if not exists codigo_tributario_municipio text;


-- -------------------------------------------------------------------
-- 0045_clientes_codigo_municipio.sql
-- -------------------------------------------------------------------

-- Sakura System — AutoCenter Edition
-- Migration 0045: coluna codigo_municipio (IBGE) em clientes, só usada na
-- emissão de NFS-e (identifica o município do tomador do serviço). Antes
-- disso o operador precisava digitar esse código manualmente toda vez que
-- emitia uma NFS-e — agora é preenchido sozinho junto com o resto do
-- endereço, quando o CEP é buscado (o ViaCEP já devolve o código IBGE de
-- graça, ver lib/viaCep.ts), e fica salvo no cadastro do cliente pra não
-- precisar digitar de novo nas próximas emissões pra esse mesmo cliente.
-- Idempotente: seguro rodar de novo.

alter table clientes
  add column if not exists codigo_municipio text;


-- -------------------------------------------------------------------
-- 0046_notas_fiscais_focus_nfe_ref.sql
-- -------------------------------------------------------------------

-- Sakura System — AutoCenter Edition
-- Migration 0046: coluna focus_nfe_ref em notas_fiscais_arquivos — guarda a
-- referência (`ref`) que a Focus NFe usa pra identificar a nota, gerada na
-- hora da emissão automática (ver montarRefNota() em src/lib/focusNfe.ts).
-- Sem isso salvo, não tinha como cancelar uma nota emitida automaticamente
-- depois — cancelarNFCe()/cancelarNFSe() (lib/focusNfe.ts) exigem esse `ref`,
-- que nunca foi persistido em lugar nenhum antes desta migration. Só
-- preenchida pra notas com origem="automatica"; upload manual de XML não usa.
-- Idempotente: seguro rodar de novo.

alter table notas_fiscais_arquivos
  add column if not exists focus_nfe_ref text;


-- -------------------------------------------------------------------
-- 0047_configuracoes_fiscais_codigo_cnae.sql
-- -------------------------------------------------------------------

-- Sakura System — AutoCenter Edition
-- Migration 0047: coluna codigo_cnae em configuracoes_fiscais_loja — só usada
-- na emissão de NFS-e. Descoberta testando a emissão de verdade em produção:
-- Araraquara rejeitou a nota com "Preencher a tag cnae e envie novamente" —
-- campo `codigo_cnae` (documentado pela Focus NFe como obrigatório pra NFS-e)
-- que o Sakura System ainda não pedia nem mandava. Vem do Cartão CNPJ da
-- empresa ("Atividade econômica principal"). Idempotente: seguro rodar de novo.

alter table configuracoes_fiscais_loja
  add column if not exists codigo_cnae text;
