-- Sakura System — AutoCenter Edition
-- Migration 0026: quais 3 indicadores aparecem nos cartões de tendência da
-- tela Início. Ajuste único pra loja inteira (não por operador) — decisão da
-- usuária: mais simples, todo mundo vê os mesmos cartões. Loja única, por
-- isso tabela "singleton" (1 linha só, id fixo), editável só pelo admin em
-- Configurações. Ver PROJETO_STATUS.md.
-- Idempotente: seguro rodar de novo.

create table if not exists configuracoes_painel_inicio (
  id smallint primary key default 1,
  cartoes text[] not null default array['vendas_mes', 'custos_mes', 'lucro_mes'],
  constraint configuracoes_painel_inicio_singleton check (id = 1)
);

insert into configuracoes_painel_inicio (id, cartoes)
values (1, array['vendas_mes', 'custos_mes', 'lucro_mes'])
on conflict (id) do nothing;

alter table configuracoes_painel_inicio enable row level security;

drop policy if exists "configuracoes_painel_inicio_acesso_autenticados" on configuracoes_painel_inicio;
create policy "configuracoes_painel_inicio_acesso_autenticados" on configuracoes_painel_inicio
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);
