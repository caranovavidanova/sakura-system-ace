-- Sakura System — AutoCenter Edition
-- Migration 0038: redefinição de senha de operador esquecida.
--
-- Como os operadores não têm e-mail de verdade (o login usa só "usuário",
-- o e-mail é inventado por baixo dos panos — ver src/lib/auth.ts), o fluxo
-- padrão de "esqueci minha senha" do Supabase Auth (link por e-mail) não
-- funciona aqui. Em vez disso: um admin gera uma senha temporária pra outro
-- operador (via Edge Function `redefinir-senha-operador`, que usa a service
-- role key — nunca fica no app instalado) e essa coluna marca que, no
-- próximo login, o sistema exige trocar a senha antes de liberar o app.
--
-- Idempotente: seguro rodar de novo.

alter table operadores add column if not exists deve_trocar_senha boolean not null default false;
