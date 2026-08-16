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
-- Idempotente: seguro rodar de novo.

create table if not exists fornecedores (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  cnpj text,
  telefone text,
  email text,
  cep text,
  rua text,
  numero text,
  bairro text,
  cidade text,
  uf text,
  ativo boolean not null default true,
  criado_em timestamptz not null default now()
);

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
