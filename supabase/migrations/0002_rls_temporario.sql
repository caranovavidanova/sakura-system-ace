-- Sakura System — AutoCenter Edition
-- Migration 0002: libera acesso às tabelas de clientes/veículos
--
-- TEMPORÁRIO: o app ainda não tem login de usuário, então liberamos acesso
-- total pela chave pública (anon/publishable). Quando a autenticação for
-- implementada, substituir estas policies por regras que checam o usuário
-- logado (e, no futuro, a loja/tenant do usuário).

alter table clientes enable row level security;
alter table veiculos enable row level security;

create policy "clientes_acesso_temporario" on clientes
  for all
  using (true)
  with check (true);

create policy "veiculos_acesso_temporario" on veiculos
  for all
  using (true)
  with check (true);
