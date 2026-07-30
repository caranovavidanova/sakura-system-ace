-- Sakura System — AutoCenter Edition
-- Migration 0032: fundação multi-loja, parte 2 — adiciona `loja_id` nas
-- tabelas operacionais (o que é fisicamente/operacionalmente de uma loja só:
-- estoque, contagem, OS, caixa, contas a pagar, notas fiscais, funcionários)
-- e reescreve a RLS delas pra checar acesso à loja, não só login.
--
-- O que continua compartilhado entre as lojas (clientes, veículos, peças,
-- serviços, categorias) NÃO muda nesta migration — decisão explícita da
-- usuária, ver PROJETO_STATUS.md.
--
-- Toda coluna nova segue nullable → backfill pra loja 1 → not null, nessa
-- ordem, pra nunca deixar a produção real inacessível no meio do caminho.
-- Depende da migration 0031 já ter rodado (funções de apoio + operador_lojas
-- populada). Idempotente: seguro rodar de novo.

-- estoque_movimentos
alter table estoque_movimentos add column if not exists loja_id uuid references lojas (id);
update estoque_movimentos set loja_id = '00000000-0000-0000-0000-000000000001' where loja_id is null;
alter table estoque_movimentos alter column loja_id set not null;
create index if not exists estoque_movimentos_loja_id_idx on estoque_movimentos (loja_id);

drop policy if exists "estoque_movimentos_acesso_autenticados" on estoque_movimentos;
drop policy if exists "estoque_movimentos_acesso_por_loja" on estoque_movimentos;
create policy "estoque_movimentos_acesso_por_loja" on estoque_movimentos
  for all
  using (operador_tem_acesso_loja(loja_id))
  with check (operador_tem_acesso_loja(loja_id));

-- contagens_estoque
alter table contagens_estoque add column if not exists loja_id uuid references lojas (id);
update contagens_estoque set loja_id = '00000000-0000-0000-0000-000000000001' where loja_id is null;
alter table contagens_estoque alter column loja_id set not null;
create index if not exists contagens_estoque_loja_id_idx on contagens_estoque (loja_id);

drop policy if exists "contagens_estoque_acesso_autenticados" on contagens_estoque;
drop policy if exists "contagens_estoque_acesso_por_loja" on contagens_estoque;
create policy "contagens_estoque_acesso_por_loja" on contagens_estoque
  for all
  using (operador_tem_acesso_loja(loja_id))
  with check (operador_tem_acesso_loja(loja_id));

-- ordens_servico
alter table ordens_servico add column if not exists loja_id uuid references lojas (id);
update ordens_servico set loja_id = '00000000-0000-0000-0000-000000000001' where loja_id is null;
alter table ordens_servico alter column loja_id set not null;
create index if not exists ordens_servico_loja_id_idx on ordens_servico (loja_id);

drop policy if exists "ordens_servico_acesso_autenticados" on ordens_servico;
drop policy if exists "ordens_servico_acesso_por_loja" on ordens_servico;
create policy "ordens_servico_acesso_por_loja" on ordens_servico
  for all
  using (operador_tem_acesso_loja(loja_id))
  with check (operador_tem_acesso_loja(loja_id));

-- ordens_servico_itens: não ganha loja_id próprio, herda via ordens_servico.
drop policy if exists "ordens_servico_itens_acesso_autenticados" on ordens_servico_itens;
drop policy if exists "ordens_servico_itens_acesso_por_loja" on ordens_servico_itens;
create policy "ordens_servico_itens_acesso_por_loja" on ordens_servico_itens
  for all
  using (
    exists (
      select 1 from ordens_servico os
      where os.id = ordens_servico_itens.ordem_servico_id
        and operador_tem_acesso_loja(os.loja_id)
    )
  )
  with check (
    exists (
      select 1 from ordens_servico os
      where os.id = ordens_servico_itens.ordem_servico_id
        and operador_tem_acesso_loja(os.loja_id)
    )
  );

-- caixa_movimentos: não dá pra herdar de ordens_servico porque existem
-- lançamentos manuais (Entradas/Saídas) sem ordem_servico_id.
alter table caixa_movimentos add column if not exists loja_id uuid references lojas (id);
update caixa_movimentos set loja_id = '00000000-0000-0000-0000-000000000001' where loja_id is null;
alter table caixa_movimentos alter column loja_id set not null;
create index if not exists caixa_movimentos_loja_id_idx on caixa_movimentos (loja_id);

drop policy if exists "caixa_movimentos_acesso_autenticados" on caixa_movimentos;
drop policy if exists "caixa_movimentos_acesso_por_loja" on caixa_movimentos;
create policy "caixa_movimentos_acesso_por_loja" on caixa_movimentos
  for all
  using (operador_tem_acesso_loja(loja_id))
  with check (operador_tem_acesso_loja(loja_id));

-- contas_pagar
alter table contas_pagar add column if not exists loja_id uuid references lojas (id);
update contas_pagar set loja_id = '00000000-0000-0000-0000-000000000001' where loja_id is null;
alter table contas_pagar alter column loja_id set not null;
create index if not exists contas_pagar_loja_id_idx on contas_pagar (loja_id);

drop policy if exists "contas_pagar_acesso_autenticados" on contas_pagar;
drop policy if exists "contas_pagar_acesso_por_loja" on contas_pagar;
create policy "contas_pagar_acesso_por_loja" on contas_pagar
  for all
  using (operador_tem_acesso_loja(loja_id))
  with check (operador_tem_acesso_loja(loja_id));

-- notas_fiscais_arquivos (o bucket de Storage em si continua sem segmentação
-- por loja — decisão de escopo documentada no PROJETO_STATUS.md; a tabela de
-- metadados, que é por onde o app sempre lê, já fica isolada corretamente)
alter table notas_fiscais_arquivos add column if not exists loja_id uuid references lojas (id);
update notas_fiscais_arquivos set loja_id = '00000000-0000-0000-0000-000000000001' where loja_id is null;
alter table notas_fiscais_arquivos alter column loja_id set not null;
create index if not exists notas_fiscais_arquivos_loja_id_idx on notas_fiscais_arquivos (loja_id);

drop policy if exists "notas_fiscais_arquivos_acesso_autenticados" on notas_fiscais_arquivos;
drop policy if exists "notas_fiscais_arquivos_acesso_por_loja" on notas_fiscais_arquivos;
create policy "notas_fiscais_arquivos_acesso_por_loja" on notas_fiscais_arquivos
  for all
  using (operador_tem_acesso_loja(loja_id))
  with check (operador_tem_acesso_loja(loja_id));

-- funcionarios: EXCEÇÃO — loja_id fica nullable de propósito. O gatilho
-- trg_sincroniza_funcionario_operador (migration 0019) cria a linha em
-- funcionarios no momento do INSERT em operadores, antes do app inserir as
-- linhas em operador_lojas daquele operador novo (isso só acontece depois,
-- na mesma função de criação) — se loja_id fosse not null, o gatilho
-- quebraria. src/lib/operadores.ts preenche loja_id logo em seguida, via
-- UPDATE, assim que operador_lojas é populada. Enquanto loja_id está nulo, o
-- funcionário fica invisível pra todo mundo via RLS (comportamento seguro
-- por padrão, não é bug). Funcionários sem login (mecânico sem operador_id)
-- recebem loja_id direto no cadastro pela tela de Funcionários.
alter table funcionarios add column if not exists loja_id uuid references lojas (id);
update funcionarios set loja_id = '00000000-0000-0000-0000-000000000001' where loja_id is null;
create index if not exists funcionarios_loja_id_idx on funcionarios (loja_id);

drop policy if exists "funcionarios_acesso_autenticados" on funcionarios;
drop policy if exists "funcionarios_acesso_por_loja" on funcionarios;
create policy "funcionarios_acesso_por_loja" on funcionarios
  for all
  using (operador_tem_acesso_loja(loja_id))
  with check (operador_tem_acesso_loja(loja_id));

-- funcionario_filhos: não ganha loja_id próprio, herda via funcionarios.
drop policy if exists "funcionario_filhos_acesso_autenticados" on funcionario_filhos;
drop policy if exists "funcionario_filhos_acesso_por_loja" on funcionario_filhos;
create policy "funcionario_filhos_acesso_por_loja" on funcionario_filhos
  for all
  using (
    exists (
      select 1 from funcionarios f
      where f.id = funcionario_filhos.funcionario_id
        and operador_tem_acesso_loja(f.loja_id)
    )
  )
  with check (
    exists (
      select 1 from funcionarios f
      where f.id = funcionario_filhos.funcionario_id
        and operador_tem_acesso_loja(f.loja_id)
    )
  );
