-- Sakura System — AutoCenter Edition
-- Migration 0043: fim opcional pra recorrência de Contas a Pagar
-- `contas_pagar.recorrente` já existia (liga/desliga a criação automática da
-- próxima ocorrência ao pagar), mas não tinha como dizer "isso vai só até tal
-- mês" — a conta recorria pra sempre. `recorrente_ate` é opcional: nulo
-- continua recorrendo sem fim (comportamento de sempre); preenchido, para de
-- criar a próxima ocorrência quando o próximo vencimento passar dessa data
-- (ver pagarConta() em src/lib/contasPagar.ts). Ver PROJETO_STATUS.md.
-- Idempotente: seguro rodar de novo.

alter table contas_pagar add column if not exists recorrente_ate date;
