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
