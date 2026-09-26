-- Sakura System — AutoCenter Edition
-- Migration 0062: os lançamentos do Caixa só pra quem tem o módulo — o
-- terceiro lote da etapa 2 do TR-04.1 (0056 foi o RH, 0061 as contas).
--
-- O problema. `caixa_movimentos` é o dinheiro da loja: cada venda, cada
-- saída, a quebra de caixa do fechamento. A TELA do Caixa só abre pra quem
-- tem a permissão; a RLS só exigia acesso à loja. Então qualquer operador
-- logado, com a chave que está no computador dele, podia pedir a lista
-- inteira pela API — e também lançar, editar e apagar.
--
-- O que NÃO pode quebrar — mapeado tela por tela em 26/09/2026. O Caixa é a
-- tabela mais "atravessada" até aqui: quatro outros módulos gravam ou leem
-- nele, e cada um ganha uma porta ESTREITA, do tamanho do que faz:
--
--   • RELAÇÕES (os gráficos de vendas, custos e lucro) LÊ tudo. Decisão
--     dela (26/09/2026): quem recebe o relatório do dinheiro recebe pra ver
--     esses números. Só lê.
--
--   • ORDENS DE SERVIÇO: faturar "recebido agora" LANÇA a entrada da OS; e a
--     emissão da NFC-e (rateio do pagamento) e o documento de garantia (a
--     forma de pagamento) LEEM os lançamentos da OS. Então quem tem OS lê só
--     os lançamentos ligados a uma OS — os mesmos valores e formas que a
--     lista de OS já mostra — e lança só entrada amarrada a uma OS da mesma
--     loja. Nunca vê aluguel, sangria nem quebra de caixa.
--
--   • CONTAS A PAGAR: pagar LANÇA a saída; "desfazer pagamento" APAGA essa
--     saída. Quem tem o módulo lança saída sem OS, e lê/apaga só o
--     lançamento que está ligado a uma conta a pagar.
--
--   • CONTAS A RECEBER: receber LANÇA a entrada. Quem tem o módulo lança
--     entrada (se ligada a uma OS, da mesma loja) e lê só o lançamento
--     ligado a uma conta a receber.
--
-- O INÍCIO não ganha exceção nenhuma (decisão dela): os cartões Vendas,
-- Custos, Lucro e Ticket médio mostram "—" pra quem não tem Caixa nem
-- Relações. Isso é do lado do app.
--
-- Duas mudanças no app vieram junto, e sem elas as portas acima não
-- bastariam — as duas por causa da mesma regra do Postgres: um comando que
-- pede a linha de volta (`returning`) ou que filtra por coluna passa também
-- pela policy de LEITURA.
--   1. Lançar no Caixa não pede mais a linha de volta: o programa gera o id
--      antes de gravar. Senão quem só paga conta seria barrado ao lançar a
--      saída, porque ainda não "enxerga" a linha que acabou de criar (ela só
--      fica ligada à conta no passo seguinte).
--   2. "Desfazer pagamento" apaga o lançamento ANTES de desligá-lo da conta
--      (a chave estrangeira desliga sozinha, `on delete set null`). Na ordem
--      antiga, a conta era desligada primeiro — e aí quem só tem Contas a
--      Pagar perdia de vista o lançamento e o `delete` apagava zero linhas,
--      em silêncio, deixando uma saída órfã no Caixa (§6 item 15).
--
-- ⚠️ ORDEM AO SUBIR — AO CONTRÁRIO DO DE SEMPRE: a versão do programa que
-- traz essas duas mudanças (0.9.43) chega nos computadores ANTES desta
-- migration rodar. A versão nova funciona com o banco antigo; o contrário
-- não: com esta migration rodada e a v0.9.42 ainda instalada, quem não tem o
-- Caixa e paga ou recebe uma conta leva erro de permissão, e "desfazer
-- pagamento" deixa a saída órfã. (Admin não é afetado — tem todos os
-- módulos.) Entre uma coisa e outra, a faixa "banco desatualizado" aparece;
-- é aviso, nada quebra.
--
-- A linha abaixo foi acrescentada depois (migration 0063): é ela que faz o
-- botão "Atualizar o banco de todas as empresas" esperar os computadores que
-- ainda estão numa versão mais antiga — o que em 26/09/2026 foi conferido à
-- mão. Ela só muda o comportamento do botão; o SQL desta migration é o mesmo.
-- versao-minima-do-programa: 0.9.43
--
-- O fechamento de caixa (0058) continua igual: `fechar_caixa()` já exige o
-- módulo Caixa, e `desfazer_fechamento_caixa()` é de admin.
--
-- Os quatro comandos em policies separadas, pelo motivo de sempre (0056):
-- uma `for all` sobrevivente reabriria o que a nova fecha, e comando sem
-- policy filtra a zero linhas sem erro nenhum.
--
-- Idempotente: seguro rodar de novo.

-- As portas de Contas a Pagar e a Receber perguntam "este lançamento é o de
-- uma conta?", procurando pela coluna de ligação. Sem índice, cada pergunta
-- varreria a tabela de contas inteira.
create index if not exists contas_pagar_caixa_movimento_idx
  on contas_pagar (caixa_movimento_id);
create index if not exists contas_receber_caixa_movimento_idx
  on contas_receber (caixa_movimento_id);

-- A pergunta mora numa função, e não num `exists` escrito dentro da policy,
-- por DESEMPENHO — medido, não suposto. Com o `exists` direto, o planejador
-- somava o custo da RLS das contas em cada linha do Caixa, estimava a lista
-- 30 vezes mais cara, passava do limite do JIT e gastava ~16 ms compilando
-- a consulta a cada abertura da tela (20 mil lançamentos: 76 → 110 ms, pra
-- quem TEM o Caixa, que nem usa essa porta). Com a função: 76 → 78 ms.
--
-- `security definer` pelo motivo de sempre (§6 item 13) — e por isso ela
-- mesma confere que a conta é DA MESMA LOJA do lançamento, o que o `exists`
-- herdava da RLS das contas. Devolve só sim/não, nunca a conta.
create or replace function caixa_movimento_de_conta_pagar(movimento_id uuid, loja uuid)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from contas_pagar
     where caixa_movimento_id = movimento_id
       and loja_id = loja
  );
$$;

create or replace function caixa_movimento_de_conta_receber(movimento_id uuid, loja uuid)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from contas_receber
     where caixa_movimento_id = movimento_id
       and loja_id = loja
  );
$$;

-- Sem os revokes, `security definer` + a permissão padrão do Postgres
-- deixariam quem não está logado perguntar (mesma tranca da 0057).
revoke all on function caixa_movimento_de_conta_pagar(uuid, uuid) from public, anon;
revoke all on function caixa_movimento_de_conta_receber(uuid, uuid) from public, anon;
grant execute on function caixa_movimento_de_conta_pagar(uuid, uuid) to authenticated;
grant execute on function caixa_movimento_de_conta_receber(uuid, uuid) to authenticated;

drop policy if exists "caixa_movimentos_acesso_temporario" on caixa_movimentos;
drop policy if exists "caixa_movimentos_acesso_autenticados" on caixa_movimentos;
drop policy if exists "caixa_movimentos_acesso_por_loja" on caixa_movimentos;
drop policy if exists "caixa_movimentos_leitura" on caixa_movimentos;
drop policy if exists "caixa_movimentos_insercao" on caixa_movimentos;
drop policy if exists "caixa_movimentos_alteracao" on caixa_movimentos;
drop policy if exists "caixa_movimentos_exclusao" on caixa_movimentos;

-- Lê: Caixa ou Relações (tudo); OS (só o que é de OS); Contas a Pagar e a
-- Receber (só o lançamento ligado a uma conta delas).
create policy "caixa_movimentos_leitura" on caixa_movimentos
  for select to authenticated
  using (
    operador_tem_acesso_loja(loja_id)
    and (
      (select operador_tem_permissao('caixa'))
      or (select operador_tem_permissao('relatorios'))
      or (
        (select operador_tem_permissao('ordens_servico'))
        and ordem_servico_id is not null
      )
      or (
        (select operador_tem_permissao('contas_pagar'))
        and caixa_movimento_de_conta_pagar(id, loja_id)
      )
      or (
        (select operador_tem_permissao('contas_receber'))
        and caixa_movimento_de_conta_receber(id, loja_id)
      )
    )
  );

-- Lança: Caixa (qualquer lançamento); OS (entrada de uma OS da mesma loja);
-- Contas a Pagar (saída sem OS); Contas a Receber (entrada — se de uma OS,
-- da mesma loja).
create policy "caixa_movimentos_insercao" on caixa_movimentos
  for insert to authenticated
  with check (
    operador_tem_acesso_loja(loja_id)
    and (
      (select operador_tem_permissao('caixa'))
      or (
        (select operador_tem_permissao('ordens_servico'))
        and tipo = 'entrada'
        and ordem_servico_id is not null
        and exists (
          select 1 from ordens_servico o
           where o.id = caixa_movimentos.ordem_servico_id
             and o.loja_id = caixa_movimentos.loja_id
        )
      )
      or (
        (select operador_tem_permissao('contas_pagar'))
        and tipo = 'saida'
        and ordem_servico_id is null
      )
      or (
        (select operador_tem_permissao('contas_receber'))
        and tipo = 'entrada'
        and (
          ordem_servico_id is null
          or exists (
            select 1 from ordens_servico o
             where o.id = caixa_movimentos.ordem_servico_id
               and o.loja_id = caixa_movimentos.loja_id
          )
        )
      )
    )
  );

-- Edita (hoje: categorizar lançamentos em lote): só o Caixa.
create policy "caixa_movimentos_alteracao" on caixa_movimentos
  for update to authenticated
  using (
    operador_tem_acesso_loja(loja_id)
    and (select operador_tem_permissao('caixa'))
  )
  with check (
    operador_tem_acesso_loja(loja_id)
    and (select operador_tem_permissao('caixa'))
  );

-- Apaga: o Caixa; e Contas a Pagar, só a saída que ainda está ligada a uma
-- conta dela (o "desfazer pagamento").
create policy "caixa_movimentos_exclusao" on caixa_movimentos
  for delete to authenticated
  using (
    operador_tem_acesso_loja(loja_id)
    and (
      (select operador_tem_permissao('caixa'))
      or (
        (select operador_tem_permissao('contas_pagar'))
        and caixa_movimento_de_conta_pagar(id, loja_id)
      )
    )
  );

insert into schema_versao (versao) values (62) on conflict do nothing;
