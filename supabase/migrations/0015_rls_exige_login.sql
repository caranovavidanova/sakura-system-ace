-- Sakura System — AutoCenter Edition
-- Migration 0015: fecha o buraco de segurança documentado desde a migration
-- 0002 — as tabelas de negócio estavam com "using (true)" (qualquer um com a
-- chave anon, mesmo sem logar, lê/escreve tudo pela API do Supabase). Agora
-- todas exigem uma sessão autenticada (auth.uid() is not null). Continua sem
-- reforçar permissão por módulo aqui — isso segue checado só na interface,
-- decisão explícita do usuário (ver PROJETO_STATUS.md, item 1 da seção 6).
-- Idempotente: seguro rodar de novo.

drop policy if exists "clientes_acesso_temporario" on clientes;
create policy "clientes_acesso_autenticados" on clientes
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

drop policy if exists "veiculos_acesso_temporario" on veiculos;
create policy "veiculos_acesso_autenticados" on veiculos
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

drop policy if exists "pecas_acesso_temporario" on pecas;
create policy "pecas_acesso_autenticados" on pecas
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

drop policy if exists "estoque_movimentos_acesso_temporario" on estoque_movimentos;
create policy "estoque_movimentos_acesso_autenticados" on estoque_movimentos
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

drop policy if exists "servicos_acesso_temporario" on servicos;
create policy "servicos_acesso_autenticados" on servicos
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

drop policy if exists "ordens_servico_acesso_temporario" on ordens_servico;
create policy "ordens_servico_acesso_autenticados" on ordens_servico
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

drop policy if exists "ordens_servico_itens_acesso_temporario" on ordens_servico_itens;
create policy "ordens_servico_itens_acesso_autenticados" on ordens_servico_itens
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

drop policy if exists "caixa_movimentos_acesso_temporario" on caixa_movimentos;
create policy "caixa_movimentos_acesso_autenticados" on caixa_movimentos
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);

drop policy if exists "configuracoes_juros_parcelas_acesso_temporario" on configuracoes_juros_parcelas;
create policy "configuracoes_juros_parcelas_acesso_autenticados" on configuracoes_juros_parcelas
  for all
  using (auth.uid() is not null)
  with check (auth.uid() is not null);
