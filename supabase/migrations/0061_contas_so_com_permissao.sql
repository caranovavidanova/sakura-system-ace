-- Sakura System — AutoCenter Edition
-- Migration 0061: Contas a Pagar e Contas a Receber só pra quem tem o
-- módulo — o segundo lote da etapa 2 do TR-04.1 (o primeiro foi o RH, na
-- 0056).
--
-- O problema. A TELA escondia as duas listas de quem não tem a permissão;
-- a RLS só exigia acesso à loja. Então um balconista com permissão só de
-- Caixa, usando a chave que está no computador dele, podia pedir pela API a
-- lista inteira do que a loja deve (fornecedor, aluguel, valor, vencimento)
-- e de quem deve pra loja (cliente, valor) — e também criar, pagar ou
-- apagar conta. É a diferença entre esconder e proteger (§6 item 1).
--
-- O que NÃO pode quebrar junto — e foi por isso que o desenho levou mais
-- tempo que a policy. Conferido tela por tela antes de escrever:
--
--   • FATURAR UMA OS "A RECEBER DEPOIS" (módulo Ordens de Serviço) cria a
--     conta a receber. Quem fatura OS pode não ter o módulo Contas a
--     Receber — e faturar não pode parar de funcionar por isso. Então quem
--     tem Ordens de Serviço pode INSERIR, mas só uma conta amarrada a uma OS
--     desta mesma loja: é exatamente o caminho do faturamento, e nada além.
--     Uma cobrança avulsa (sem OS) continua sendo só do módulo.
--     O insert do faturamento não pede a linha de volta (`returning`) — e
--     isso importa: com `returning`, a policy de LEITURA também teria de
--     deixar, e quem só fatura não lê a lista (lição da 0058).
--
--   • A ABA COMISSÕES (módulo Funcionários) lê as contas a receber pra
--     avisar "esta comissão vem de OS que o cliente ainda não pagou". Então
--     quem tem Funcionários também LÊ. Só lê: não cria, não recebe.
--     Janela menor (uma view só com "OS pendente sim/não", como a da 0056)
--     foi considerada e deixada pra quando `ordens_servico` for fechada: hoje
--     a lista de OS, com cliente e valor, continua aberta a qualquer um
--     logado, então a view não esconderia nada que já não esteja à vista.
--
--   • O INÍCIO lê Contas a Pagar pro cartão "Contas a pagar vencendo" e pro
--     calendário. Decisão dela (26/09/2026): quem não tem o módulo NÃO vê —
--     o programa passa a mostrar "—" no cartão, com a explicação, em vez de
--     um R$ 0,00 que parece verdade. Isso é do lado do app; aqui não há
--     exceção nenhuma pro Início.
--
--   • PAGAR / RECEBER lançam no Caixa. Isso continua funcionando porque
--     `caixa_movimentos` ainda não foi fechada. QUANDO FOR (próximo lote),
--     quem tem Contas a Pagar e Contas a Receber precisa continuar podendo
--     lançar ali — anotado aqui pra não virar surpresa.
--
-- Os quatro comandos em policies separadas, pelo mesmo motivo da 0056: uma
-- `for all` sobrevivente daria `select` a quem a policy nova quer barrar, e
-- comando sem policy filtra a zero linhas sem erro nenhum (§6 item 15).
--
-- O `(select ...)` em volta da função faz o planejador avaliá-la uma vez por
-- consulta, não por linha (cabeçalho da 0054). O índice em `loja_id`, que a
-- outra metade da policy usa, já existe nas duas tabelas (0032 e 0036).
--
-- Idempotente: seguro rodar de novo.

-- ===================================================================
-- 1. Contas a Pagar: só o módulo, nos quatro comandos
-- ===================================================================

drop policy if exists "contas_pagar_acesso_autenticados" on contas_pagar;
drop policy if exists "contas_pagar_acesso_por_loja" on contas_pagar;
drop policy if exists "contas_pagar_leitura" on contas_pagar;
drop policy if exists "contas_pagar_insercao" on contas_pagar;
drop policy if exists "contas_pagar_alteracao" on contas_pagar;
drop policy if exists "contas_pagar_exclusao" on contas_pagar;

create policy "contas_pagar_leitura" on contas_pagar
  for select to authenticated
  using (
    operador_tem_acesso_loja(loja_id)
    and (select operador_tem_permissao('contas_pagar'))
  );

create policy "contas_pagar_insercao" on contas_pagar
  for insert to authenticated
  with check (
    operador_tem_acesso_loja(loja_id)
    and (select operador_tem_permissao('contas_pagar'))
  );

create policy "contas_pagar_alteracao" on contas_pagar
  for update to authenticated
  using (
    operador_tem_acesso_loja(loja_id)
    and (select operador_tem_permissao('contas_pagar'))
  )
  with check (
    operador_tem_acesso_loja(loja_id)
    and (select operador_tem_permissao('contas_pagar'))
  );

create policy "contas_pagar_exclusao" on contas_pagar
  for delete to authenticated
  using (
    operador_tem_acesso_loja(loja_id)
    and (select operador_tem_permissao('contas_pagar'))
  );

-- ===================================================================
-- 2. Contas a Receber: o módulo, mais as duas portas estreitas
-- ===================================================================

drop policy if exists "contas_receber_acesso_por_loja" on contas_receber;
drop policy if exists "contas_receber_leitura" on contas_receber;
drop policy if exists "contas_receber_insercao" on contas_receber;
drop policy if exists "contas_receber_alteracao" on contas_receber;
drop policy if exists "contas_receber_exclusao" on contas_receber;

-- Lê: o módulo, ou Funcionários (a aba Comissões).
create policy "contas_receber_leitura" on contas_receber
  for select to authenticated
  using (
    operador_tem_acesso_loja(loja_id)
    and (
      (select operador_tem_permissao('contas_receber'))
      or (select operador_tem_permissao('funcionarios'))
    )
  );

-- Cria: o módulo; ou Ordens de Serviço, e aí SÓ amarrada a uma OS desta
-- mesma loja (o faturamento "a receber depois"). O `exists` consulta
-- `ordens_servico` com os direitos de quem pede — quem fatura enxerga a OS
-- que está faturando.
create policy "contas_receber_insercao" on contas_receber
  for insert to authenticated
  with check (
    operador_tem_acesso_loja(loja_id)
    and (
      (select operador_tem_permissao('contas_receber'))
      or (
        (select operador_tem_permissao('ordens_servico'))
        and ordem_servico_id is not null
        and exists (
          select 1 from ordens_servico o
           where o.id = contas_receber.ordem_servico_id
             and o.loja_id = contas_receber.loja_id
        )
      )
    )
  );

-- Recebe (marca como recebido): só o módulo.
create policy "contas_receber_alteracao" on contas_receber
  for update to authenticated
  using (
    operador_tem_acesso_loja(loja_id)
    and (select operador_tem_permissao('contas_receber'))
  )
  with check (
    operador_tem_acesso_loja(loja_id)
    and (select operador_tem_permissao('contas_receber'))
  );

-- Apaga: só o módulo. (Hoje nenhuma tela apaga conta a receber; a policy
-- existe pra que o comando não fique sem dono — §6 item 15.)
create policy "contas_receber_exclusao" on contas_receber
  for delete to authenticated
  using (
    operador_tem_acesso_loja(loja_id)
    and (select operador_tem_permissao('contas_receber'))
  );

insert into schema_versao (versao) values (61) on conflict do nothing;
