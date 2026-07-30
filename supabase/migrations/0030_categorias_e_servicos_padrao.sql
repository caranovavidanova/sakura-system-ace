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
