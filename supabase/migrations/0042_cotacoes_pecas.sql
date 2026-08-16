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
