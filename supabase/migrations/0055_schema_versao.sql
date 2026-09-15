-- Sakura System — AutoCenter Edition
-- Migration 0055: o banco passa a dizer em que versão ele está (item TR-05.7).
--
-- O PROBLEMA. O app instalado não tinha como saber se o banco daquela empresa
-- já recebeu as migrations que a versão nova precisa. Hoje isso funciona por
-- combinação: ela roda o SQL no Editor e só então publica a tag, nessa ordem.
-- Já houve descompasso (a `0046`/`0047` ficaram "ainda não rodadas" por um
-- tempo), e com mais de uma empresa isso deixa de ser exceção e vira rotina:
-- o auto-update chega em todas as lojas no mesmo minuto, e a migration é
-- manual, um projeto Supabase por vez.
--
-- O app novo contra o banco velho falha do pior jeito possível: `column ...
-- does not exist`, numa tela qualquer, sem dizer a ninguém o que fazer.
-- Com esta tabela o app abre, compara e avisa em português qual arquivo falta
-- rodar. É AVISO, nunca tranca (regra do item 33 da seção 6 do PROJETO_STATUS).
--
-- DUAS COISAS QUE VALEM SABER ANTES DE MEXER AQUI:
--
-- 1. A TABELA NÃO É ESCRITA PELO APP. Não existe policy de insert/update/
--    delete pra ninguém, de propósito — mesma decisão da trilha de auditoria.
--    Quem grava é a própria migration, rodando no SQL Editor (dono do banco).
--    Um app capaz de escrever "estou em dia" sobre si mesmo não serviria de
--    nada: bastaria o bug que ele deveria denunciar pra ele mentir.
--
-- 2. O BACKFILL ASSUME O ÓBVIO: quem chegou nesta migration rodou as 54
--    anteriores, porque elas rodam em ordem — e o arquivo de instalação única
--    (`supabase/instalacao/instalacao-completa.sql`) é justamente a ordem
--    inteira, de uma vez. Por isso ele registra de 1 a 55, e não só a 55.
--
-- A PARTIR DAQUI, TODA MIGRATION NOVA REGISTRA A PRÓPRIA LINHA, no final:
--
--     insert into schema_versao (versao) values (56) on conflict do nothing;
--
-- Não é estilo nem capricho: sem essa linha o aviso do app MENTE, dizendo que
-- o banco está atrasado quando ele está em dia — e aviso que mente é pior que
-- aviso nenhum, porque ensina quem usa a ignorar. O `npm test` reprova a
-- migration que esquecer (scripts/gerar-instalacao-completa.test.ts).
--
-- Idempotente: seguro rodar de novo.

create table if not exists schema_versao (
  versao      int primary key,
  aplicada_em timestamptz not null default now()
);

comment on table schema_versao is
  'TR-05.7. Uma linha por migration já aplicada neste banco. O app compara o '
  'maior número daqui com a versão que a build dele exige, e avisa quando o '
  'banco está atrás. Escrita só pelo dono do banco (SQL Editor): não existe '
  'policy de insert/update/delete pra ninguém.';

alter table schema_versao enable row level security;

-- Leitura liberada pra qualquer um logado, inclusive operador sem loja
-- nenhuma: o aviso precisa aparecer antes de qualquer tela, e o número da
-- versão do esquema não é dado de pessoa nenhuma.
drop policy if exists "schema_versao_leitura" on schema_versao;
create policy "schema_versao_leitura"
  on schema_versao
  for select
  to authenticated
  using (true);

-- O backfill descrito no item 2 do cabeçalho.
insert into schema_versao (versao)
select generate_series(1, 55)
on conflict (versao) do nothing;
