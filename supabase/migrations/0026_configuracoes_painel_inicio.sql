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
