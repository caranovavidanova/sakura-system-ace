-- Sakura System — AutoCenter Edition
-- Migration 0048: declara a precisão das colunas de valor que estavam como
-- `numeric` "solto" (sem precisão nem casas decimais).
--
-- Por que isto importa. Uma auditoria do esquema (guia de melhorias, TR-05.3)
-- confirmou a parte boa: NENHUMA coluna de dinheiro deste banco é
-- `double precision`/`real`, então o erro de ponto flutuante nunca entrou pelo
-- armazenamento. Mas cinco colunas eram `numeric` sem precisão declarada, e
-- `numeric` solto guarda exatamente o que mandarem — inclusive uma cauda de
-- centavo vinda de conta feita em JavaScript, tipo 1234.5600000000002.
--
-- Isso não era teórico: o valor gravado em `contas_receber.valor` ao faturar
-- uma OS vinha de uma soma de pagamentos sem arredondamento
-- (`src/lib/ordensServico.ts`), e somar números já arredondados ainda pode
-- produzir cauda (0.1 + 0.2 dá 0.30000000000000004). O lado do aplicativo foi
-- corrigido junto com esta migration; a coluna passa a ser a segunda linha de
-- defesa, arredondando na entrada mesmo que uma conta nova erre no futuro.
--
-- As casas seguem o que o resto do banco já usa: dinheiro `numeric(12,2)`
-- (igual `pecas.preco_venda`, `caixa_movimentos.valor`, `cotacoes_pecas.preco`)
-- e percentual `numeric(5,2)` (igual `pecas.aliquota_icms`).
--
-- Efeito em dado já gravado: valores com até 2 casas decimais não mudam em
-- nada. Um valor que estivesse com cauda é arredondado pro centavo — que é o
-- que já aparecia na tela de qualquer forma, porque a exibição formata em 2
-- casas. Nenhum valor é truncado: `numeric(12,2)` comporta até
-- 9.999.999.999,99.
--
-- Idempotente: `alter ... type` para o mesmo tipo é aceito sem erro pelo
-- Postgres, então é seguro rodar de novo. A guarda `if exists` cobre um banco
-- que ainda não tenha a coluna.

do $$
begin
  -- Dinheiro: 12 dígitos no total, 2 deles decimais.
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'contas_pagar'
               and column_name = 'valor') then
    alter table contas_pagar alter column valor type numeric(12,2);
  end if;

  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'contas_receber'
               and column_name = 'valor') then
    alter table contas_receber alter column valor type numeric(12,2);
  end if;

  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'funcionarios'
               and column_name = 'salario') then
    alter table funcionarios alter column salario type numeric(12,2);
  end if;

  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'servicos'
               and column_name = 'custo') then
    alter table servicos alter column custo type numeric(12,2);
  end if;

  -- Percentual: 5 dígitos no total, 2 deles decimais (até 999,99%).
  if exists (select 1 from information_schema.columns
             where table_schema = 'public' and table_name = 'configuracoes_fiscais_loja'
               and column_name = 'aliquota_iss') then
    alter table configuracoes_fiscais_loja alter column aliquota_iss type numeric(5,2);
  end if;
end $$;
