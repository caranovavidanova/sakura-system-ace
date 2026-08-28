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
