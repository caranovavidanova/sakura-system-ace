-- Sakura System — AutoCenter Edition
-- Migration 0060: travas que impedem dado impossível (item TR-05.1 do guia).
--
-- O PROBLEMA. O banco aceitava preço negativo, desconto maior que o item,
-- alíquota de 300%, CNPJ pela metade. A validação existia só no formulário,
-- que é a camada que dá pra contornar — e que não vale pro dado que entra por
-- importação de XML, por SQL Editor ou por uma versão velha do app numa loja
-- que não atualizou. Um `check` custa nada e não deixa o impossível existir.
--
-- A DECISÃO QUE MAIS IMPORTA AQUI: CADA TRAVA SÓ É CRIADA SE O DADO QUE JÁ
-- EXISTE DEIXAR. O guia manda conferir, antes de cada trava, se o banco real
-- já tem linha que a violaria — e o que fazer com esse dado é conversa com a
-- dona do sistema, não decisão de migration. Só que este banco é de empresas
-- diferentes, e nenhuma consulta daqui alcança o de verdade. Então a
-- migration faz a conferência sozinha, trava por trava:
--
--   • nenhuma linha fora da regra → a trava é criada;
--   • alguma linha fora da regra → a trava NÃO é criada, nada é alterado, e
--     a migration avisa qual e quantas linhas (raise notice), e mostra tudo
--     numa tabelinha no fim — é o que aparece no SQL Editor depois do Run.
--
-- Ou seja: rodar esta migration NUNCA falha por causa do dado de uma loja, e
-- NUNCA mexe em dado nenhum. O pior caso é "essa trava ficou pra depois".
-- Rodar de novo depois de corrigir o dado cria o que faltou (é idempotente).
--
-- AS DUAS REGRAS QUE O GUIA PEDIA E AQUI SAÍRAM DIFERENTES, DE PROPÓSITO:
--
--   1. Valor de conta a pagar/receber é ">= 0", não "> 0". Uma OS de garantia
--      (retorno, serviço sem cobrança) tem total zero; faturada como "a
--      receber depois", ela cria uma conta a receber de valor zero. Com "> 0",
--      faturar essa OS passaria a dar erro — e isso não dá pra descartar
--      daqui. Negativo, que é o que importa barrar, continua barrado.
--      (`caixa_movimentos.valor >= 0` já existe desde a 0006.)
--
--   2. Data de fechamento da OS pode ser até UM DIA antes da abertura, não
--      "maior ou igual". A abertura é gravada com o relógio do servidor e o
--      faturamento com o relógio do computador da loja; um Windows atrasado
--      alguns minutos, faturando logo depois de abrir, bateria na trava. O que
--      se quer barrar é o absurdo (fechar anos antes de abrir), não o relógio.
--
-- E UMA QUE EXIGIU CUIDADO: CNPJ. Desde julho de 2026 a Receita emite CNPJ
-- ALFANUMÉRICO (letras nas 12 primeiras posições). Por isso a trava conta
-- letras e números, e não só dígitos — uma regra de "14 dígitos" recusaria o
-- CNPJ de toda empresa aberta de julho pra cá.
--
-- Os nomes seguem `ck_<tabela>_<regra>` porque a tela traduz cada um numa
-- frase em português (src/lib/errors.ts). Nome novo aqui = frase nova lá.

-- A conferência "só crie se o dado deixar". Função temporária (pg_temp): some
-- sozinha no fim da sessão, não fica no banco nem pode ser chamada pela API.
create or replace function pg_temp.criar_trava(p_tabela text, p_nome text, p_regra text)
returns text
language plpgsql
as $$
declare
  v_fora bigint;
begin
  if exists (
    select 1 from pg_constraint c
      join pg_class t on t.oid = c.conrelid
     where t.relname = p_tabela and c.conname = p_nome
  ) then
    return 'já existia';
  end if;

  -- Linha em que a regra dá FALSO. Regra que dá nulo (coluna vazia) passa,
  -- que é exatamente como o `check` do Postgres trata.
  execute format('select count(*) from %I where (%s) is false', p_tabela, p_regra) into v_fora;

  if v_fora > 0 then
    raise notice 'trava % NÃO criada: % linha(s) de % estão fora da regra (%). Nada foi alterado.',
      p_nome, v_fora, p_tabela, p_regra;
    return format('NÃO criada — %s linha(s) fora da regra', v_fora);
  end if;

  execute format('alter table %I add constraint %I check (%s)', p_tabela, p_nome, p_regra);
  return 'criada';
end;
$$;

-- (o `client_min_messages` só cala o aviso técnico "table does not exist,
-- skipping" da primeira rodada; os avisos de "NÃO criada" vêm depois e aparecem)
set client_min_messages = warning;
drop table if exists pg_temp.travas_resultado;
create temp table travas_resultado (tabela text, trava text, regra text, resultado text);
reset client_min_messages;

insert into travas_resultado (tabela, trava, regra, resultado)
select t.tabela, t.trava, t.regra, pg_temp.criar_trava(t.tabela, t.trava, t.regra)
from (values
  -- item de OS: preço e desconto nunca negativos, e o desconto nunca maior
  -- que a própria linha (uma linha negativa derruba a nota — §6 item 60)
  ('ordens_servico_itens', 'ck_ordens_servico_itens_preco',      'preco_unitario >= 0'),
  -- (o `greatest` é pra esta não disparar junto com a de preço quando o preço
  -- é que está negativo — a mensagem na tela tem que apontar o campo certo)
  ('ordens_servico_itens', 'ck_ordens_servico_itens_desconto',   'desconto >= 0 and desconto <= greatest(quantidade * preco_unitario, 0)'),
  -- catálogo
  ('pecas',    'ck_pecas_preco_custo',      'preco_custo >= 0'),
  ('pecas',    'ck_pecas_preco_venda',      'preco_venda >= 0'),
  ('pecas',    'ck_pecas_prazo_garantia',   'prazo_garantia_dias >= 0'),
  ('pecas',    'ck_pecas_aliquota_icms',    'aliquota_icms between 0 and 100'),
  ('servicos', 'ck_servicos_preco_padrao',  'preco_padrao >= 0'),
  ('servicos', 'ck_servicos_custo',         'custo >= 0'),
  -- dinheiro a pagar/receber (>= 0: ver o item 1 do cabeçalho)
  ('contas_pagar',   'ck_contas_pagar_valor',   'valor >= 0'),
  ('contas_receber', 'ck_contas_receber_valor', 'valor >= 0'),
  -- pedido de compra
  ('pedidos_compra_itens', 'ck_pedidos_compra_itens_preco',    'preco_unitario >= 0'),
  ('pedidos_compra_itens', 'ck_pedidos_compra_itens_recebida', 'quantidade_recebida >= 0'),
  -- datas da OS (tolerância de um dia: ver o item 2 do cabeçalho)
  ('ordens_servico', 'ck_ordens_servico_datas', 'data_fechamento is null or data_fechamento >= data_abertura - interval ''1 day'''),
  -- configurações
  ('configuracoes_juros_parcelas', 'ck_juros_percentual', 'juros_percentual between 0 and 100'),
  -- ISS é limitado a 5% por lei; a folga até 10 é proposital
  ('configuracoes_fiscais_loja', 'ck_config_fiscal_aliquota_iss', 'aliquota_iss between 0 and 10'),
  ('configuracoes_fiscais_loja', 'ck_config_fiscal_cnpj',
     'cnpj is null or btrim(cnpj) = '''' or length(regexp_replace(upper(cnpj), ''[^0-9A-Z]'', '''', ''g'')) = 14'),
  -- cliente pessoa jurídica: CNPJ inteiro ou nenhum — nunca pela metade, que
  -- faz a SEFAZ recusar a nota inteira
  ('clientes', 'ck_clientes_cnpj_juridica',
     'tipo_pessoa is distinct from ''juridica'' or cpf_cnpj is null or btrim(cpf_cnpj) = '''' or length(regexp_replace(upper(cpf_cnpj), ''[^0-9A-Z]'', '''', ''g'')) = 14')
) as t(tabela, trava, regra);

insert into schema_versao (versao) values (60) on conflict do nothing;

-- O que aparece no SQL Editor depois do Run: uma linha por trava, com o
-- resultado. Se alguma disser "NÃO criada", o dado dela precisa ser olhado —
-- e é pra mandar o print, não pra forçar.
select tabela, trava, resultado from travas_resultado order by (resultado like 'NÃO%') desc, tabela, trava;
