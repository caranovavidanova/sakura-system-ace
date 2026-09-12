-- Sakura System — AutoCenter Edition
-- Migration 0051: quatro colunas opcionais em `pecas` — o estoque mínimo
-- (item TL-11 do guia de melhorias) e o bloco de pneu (item TL-12).
--
-- 1) estoque_minimo
--
--    É o campo que falta pro sistema responder "o que eu preciso comprar?".
--    Hoje a lista de Produtos mostra o saldo como um número neutro: dá pra
--    ver que sobrou 1, mas não dá pra saber se 1 é pouco. Num autocenter,
--    peça em falta é venda perdida na hora, com o carro parado no pátio —
--    é a pergunta que mais dá dinheiro, e a única que o cadastro não sabia
--    responder.
--
--    numeric(12,2), e não (12,3) como o guia sugeria: TODA quantidade deste
--    banco é numeric(12,2) (estoque_movimentos.quantidade,
--    contagens_estoque.quantidade_contada, ordens_servico_itens.quantidade,
--    pedidos_compra_itens). Um mínimo com três casas decimais compararia
--    com saldos de duas e só criaria uma diferença sem motivo.
--
--    Fica NULL por padrão de propósito: NULL quer dizer "essa peça não tem
--    mínimo definido" e não entra no filtro "abaixo do mínimo" — diferente
--    de zero, que é um mínimo de verdade ("não pode faltar nenhuma"). Zerar
--    todo o catálogo no backfill transformaria cada peça sem saldo num
--    alarme, e alarme que toca pra tudo é alarme que ninguém olha.
--
-- 2) medida / indice_carga_velocidade / dot
--
--    O bloco de pneu. É a peça que essa loja mais vende, o dado está escrito
--    na lateral do pneu, e hoje ele só existe afogado na descrição em texto
--    livre — o que impede responder "tem 175/70 R14?" sem ler peça por peça.
--    Três campos de texto simples, todos opcionais, mostrados na tela só
--    quando a categoria da peça for a de Pneus (a tela decide, não o banco:
--    a categoria é uma linha de `categorias`, que cada empresa nomeia como
--    quiser, então prender isso numa constraint aqui quebraria quem chamar a
--    categoria de outra coisa).
--
--    `medida` guarda o formato da lateral (ex: "175/70 R14"),
--    `indice_carga_velocidade` o índice de carga e velocidade (ex: "84T") e
--    `dot` a semana/ano de fabricação (ex: "3823" = 38ª semana de 2023), que
--    é o que diz se o pneu está velho no estoque.
--
-- `pecas` é compartilhada entre as lojas da mesma empresa (não tem loja_id),
-- então nada aqui precisa de backfill por loja nem de policy nova — a RLS de
-- `pecas` já cobre estas colunas, porque é por tabela, não por coluna.
--
-- Idempotente: seguro rodar de novo (`add column if not exists`).

alter table pecas
  add column if not exists estoque_minimo numeric(12, 2),
  add column if not exists medida text,
  add column if not exists indice_carga_velocidade text,
  add column if not exists dot text;

-- Mínimo negativo não quer dizer nada, e deixar passar viraria uma peça
-- eternamente "abaixo do mínimo" (ou nunca) sem explicação na tela.
do $$
begin
  if not exists (
    select 1 from information_schema.constraint_column_usage
    where table_name = 'pecas' and constraint_name = 'pecas_estoque_minimo_nao_negativo'
  ) then
    alter table pecas
      add constraint pecas_estoque_minimo_nao_negativo
      check (estoque_minimo is null or estoque_minimo >= 0);
  end if;
end $$;
