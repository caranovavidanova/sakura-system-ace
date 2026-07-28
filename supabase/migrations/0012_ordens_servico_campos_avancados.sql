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
