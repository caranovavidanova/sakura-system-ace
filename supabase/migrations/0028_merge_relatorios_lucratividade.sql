-- Sakura System — AutoCenter Edition
-- Migration 0028: o módulo "Lucratividade" foi absorvido dentro de "Relações"
-- (agora com abas Gráficos/Lucratividade, mesmo padrão de Estoque e Caixa
-- Diário). A chave "lucratividade" deixou de existir em MODULOS
-- (src/types/operador.ts) — quem tinha só essa permissão liberada (sem ter
-- "relatorios") precisa ganhar "relatorios" pra não perder acesso.
-- Idempotente: seguro rodar de novo.

update operadores
set permissoes = array_append(permissoes, 'relatorios')
where 'lucratividade' = any(permissoes)
  and not ('relatorios' = any(permissoes));

update operadores
set permissoes = array_remove(permissoes, 'lucratividade')
where 'lucratividade' = any(permissoes);
