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
