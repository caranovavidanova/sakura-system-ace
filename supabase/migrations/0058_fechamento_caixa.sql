-- Sakura System — AutoCenter Edition
-- Migration 0058: fechamento de caixa do dia (item TR-06.4 do guia).
--
-- O PROBLEMA. O Caixa Diário mostrava o movimento do dia, mas não existia o
-- gesto de FECHAR o dia: contar o dinheiro da gaveta, comparar com o que o
-- sistema diz e registrar a diferença. Sem isso, um erro de troco só aparece
-- olhando extrato no fim do mês, quando ninguém lembra do dia — e "faltou
-- dinheiro no caixa hoje?" é uma das perguntas que mais fazem uma loja querer
-- um sistema.
--
-- O DESENHO espelha a Contagem de Estoque, que já funciona e ela já entende:
--   • uma linha por loja por dia, com o que o sistema esperava, o que foi
--     contado e a diferença;
--   • a diferença vira um lançamento de caixa de verdade ("Quebra de caixa"
--     quando falta, "Sobra de caixa" quando sobra), em dinheiro — igual a
--     Contagem gera o ajuste de estoque. Nunca "sumir" com a diferença. E,
--     como o lançamento é em dinheiro, depois de fechado o esperado passa a
--     bater com o contado sozinho;
--   • a CONTA do esperado não mora aqui: ela é de src/schemas/fechamentoCaixa.ts,
--     função pura testada (regra 8 do guia — é a sexta vez que este projeto
--     teria a mesma conta de dinheiro em dois lugares). O banco só guarda o
--     número e a subtração contado − esperado.
--
-- QUATRO DECISÕES QUE VALEM SABER ANTES DE MEXER AQUI:
--
-- 1. FECHAR É UMA FUNÇÃO (`fechar_caixa`), não dois inserts do app. O
--    lançamento da diferença e o registro do fechamento entram na MESMA
--    transação: se o segundo falhar (dois computadores fechando o mesmo dia,
--    por exemplo), o primeiro some junto. Feito pelo app em dois pedidos, uma
--    falha no meio deixaria uma "quebra de caixa" órfã, lançada e sem
--    fechamento. A função é `security invoker`: a RLS das duas tabelas vale
--    como se o próprio operador tivesse feito cada insert.
--
-- 2. NINGUÉM ALTERA um fechamento. Não existe policy de update, de propósito
--    (a matriz de RLS declara isso em lacunas-de-proposito.csv). Contou
--    errado? Desfaz e fecha de novo.
--
-- 3. DESFAZER É SÓ DE ADMIN DA LOJA. Se quem fecha pudesse desfazer, bastaria
--    fechar com falta, desfazer e fechar de novo com o valor "certo" pra a
--    falta sumir. Desfazer apaga o lançamento da diferença junto (mesma
--    transação, `desfazer_fechamento_caixa`), e a trilha de auditoria guarda
--    os dois — quem fechou, com quanto, e quem desfez.
--
-- 4. FECHAR EXIGE A PERMISSÃO DO MÓDULO CAIXA no banco, e não só a tela — a
--    etapa 2 do TR-04.1 aplicada desde o nascimento. Tabela nova não tem
--    comportamento antigo pra quebrar, então não há o que decidir com ela.
--
-- Idempotente: seguro rodar de novo.

create table if not exists fechamentos_caixa (
  id                 uuid primary key default gen_random_uuid(),
  loja_id            uuid not null references lojas(id),
  data               date not null,
  -- o dinheiro que já estava na gaveta ao abrir (o "troco"). Guardado pra
  -- que o próximo fechamento já venha com ele preenchido.
  fundo_troco        numeric(12,2) not null default 0,
  -- o que o sistema esperava encontrar em ESPÉCIE: fundo + entradas em
  -- dinheiro − saídas em dinheiro. Congelado no momento do fechamento.
  saldo_sistema      numeric(12,2) not null,
  valor_contado      numeric(12,2) not null,
  diferenca          numeric(12,2) not null,
  -- Pix, cartão e o resto, pra conferência do extrato — só registro.
  totais_por_forma   jsonb not null default '{}'::jsonb,
  observacao         text,
  caixa_movimento_id uuid references caixa_movimentos(id) on delete set null,
  operador_id        uuid references operadores(id) on delete set null,
  criado_em          timestamptz not null default now(),
  constraint fechamentos_caixa_loja_data_unique unique (loja_id, data),
  constraint ck_fechamentos_caixa_valores check (
    fundo_troco >= 0 and valor_contado >= 0 and diferenca = valor_contado - saldo_sistema
  )
);

comment on table fechamentos_caixa is
  'TR-06.4. Um fechamento por loja por dia: esperado em espécie, contado e a '
  'diferença, que vira um lançamento de caixa (Quebra/Sobra de caixa). Gravado '
  'só por fechar_caixa(); ninguém altera; desfazer é só de admin da loja.';

create index if not exists fechamentos_caixa_loja_data_idx
  on fechamentos_caixa (loja_id, data desc);

alter table fechamentos_caixa enable row level security;

drop policy if exists "fechamentos_caixa_leitura" on fechamentos_caixa;
drop policy if exists "fechamentos_caixa_insercao" on fechamentos_caixa;
drop policy if exists "fechamentos_caixa_exclusao" on fechamentos_caixa;

create policy "fechamentos_caixa_leitura" on fechamentos_caixa
  for select to authenticated
  using (
    operador_tem_acesso_loja(loja_id)
    and (select operador_tem_permissao('caixa'))
  );

create policy "fechamentos_caixa_insercao" on fechamentos_caixa
  for insert to authenticated
  with check (
    operador_tem_acesso_loja(loja_id)
    and (select operador_tem_permissao('caixa'))
  );

create policy "fechamentos_caixa_exclusao" on fechamentos_caixa
  for delete to authenticated
  using (operador_e_admin_da_loja(loja_id));

-- As duas categorias da diferença. Semeadas aqui pelo mesmo motivo da 0050:
-- `categorias_caixa` nasce vazia num banco novo, e o lançamento da diferença
-- precisa de categoria pra não cair no balde "sem categoria".
insert into categorias_caixa (nome, tipo)
values ('Quebra de caixa', 'saida'),
       ('Sobra de caixa', 'entrada')
on conflict (nome, tipo) do nothing;

-- ---------------------------------------------------------------------------
-- fechar_caixa — registra o fechamento e o lançamento da diferença juntos.
--
-- p_momento: quando o lançamento da diferença entra no caixa. Nulo = agora
-- (fechando o dia de hoje). Fechando um dia passado, o app manda o fim
-- daquele dia no fuso de quem usa — o banco não sabe o fuso da loja, e o
-- lançamento precisa cair no dia que está sendo fechado.
-- ---------------------------------------------------------------------------
create or replace function fechar_caixa(
  p_loja_id     uuid,
  p_data        date,
  p_fundo_troco numeric,
  p_esperado    numeric,
  p_contado     numeric,
  p_totais      jsonb,
  p_observacao  text,
  p_momento     timestamptz default null
)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_diferenca  numeric(12,2);
  v_movimento  uuid;
  v_categoria  uuid;
  v_fechamento uuid;
  v_dia        text := to_char(p_data, 'DD/MM/YYYY');
begin
  if p_contado is null or p_contado < 0 then
    raise exception 'O valor contado na gaveta precisa ser zero ou mais.';
  end if;
  if p_fundo_troco is null or p_fundo_troco < 0 then
    raise exception 'O fundo de troco precisa ser zero ou mais.';
  end if;
  if exists (select 1 from fechamentos_caixa where loja_id = p_loja_id and data = p_data) then
    raise exception 'O caixa do dia % já foi fechado.', v_dia;
  end if;

  v_diferenca := round(p_contado, 2) - round(p_esperado, 2);

  if v_diferenca <> 0 then
    select id into v_categoria
      from categorias_caixa
     where nome = case when v_diferenca < 0 then 'Quebra de caixa' else 'Sobra de caixa' end
       and tipo = case when v_diferenca < 0 then 'saida' else 'entrada' end;

    insert into caixa_movimentos (loja_id, data, tipo, forma_pagamento, valor, descricao, categoria_id)
    values (
      p_loja_id,
      coalesce(p_momento, now()),
      case when v_diferenca < 0 then 'saida' else 'entrada' end,
      'dinheiro',
      abs(v_diferenca),
      case when v_diferenca < 0
        then 'Quebra de caixa — fechamento de ' || v_dia
        else 'Sobra de caixa — fechamento de ' || v_dia
      end,
      v_categoria
    )
    returning id into v_movimento;
  end if;

  insert into fechamentos_caixa (
    loja_id, data, fundo_troco, saldo_sistema, valor_contado, diferenca,
    totais_por_forma, observacao, caixa_movimento_id, operador_id
  )
  values (
    p_loja_id, p_data, round(p_fundo_troco, 2), round(p_esperado, 2), round(p_contado, 2),
    v_diferenca, coalesce(p_totais, '{}'::jsonb), nullif(trim(p_observacao), ''),
    v_movimento, auth.uid()
  )
  returning id into v_fechamento;

  return v_fechamento;
end;
$$;

-- ---------------------------------------------------------------------------
-- desfazer_fechamento_caixa — apaga o fechamento e o lançamento da diferença
-- juntos. Só admin da loja consegue, pela policy de delete (a função é
-- security invoker). Sem linha apagada = sem permissão, e isso vira erro em
-- vez de "não fez nada" (§6 item 15 do PROJETO_STATUS).
-- ---------------------------------------------------------------------------
create or replace function desfazer_fechamento_caixa(p_fechamento_id uuid)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_movimento uuid;
begin
  delete from fechamentos_caixa
   where id = p_fechamento_id
  returning caixa_movimento_id into v_movimento;

  if not found then
    raise exception 'Só um administrador desta loja pode desfazer um fechamento de caixa.';
  end if;

  if v_movimento is not null then
    delete from caixa_movimentos where id = v_movimento;
  end if;
end;
$$;

revoke all on function fechar_caixa(uuid, date, numeric, numeric, numeric, jsonb, text, timestamptz) from public, anon;
revoke all on function desfazer_fechamento_caixa(uuid) from public, anon;
grant execute on function fechar_caixa(uuid, date, numeric, numeric, numeric, jsonb, text, timestamptz) to authenticated;
grant execute on function desfazer_fechamento_caixa(uuid) to authenticated;

-- Auditado desde o nascimento: fechar e desfazer são exatamente o tipo de
-- coisa que alguém vai querer saber quem fez.
drop trigger if exists trigger_auditoria on fechamentos_caixa;
create trigger trigger_auditoria
  after insert or update or delete on fechamentos_caixa
  for each row execute function registrar_auditoria('id');

insert into schema_versao (versao) values (58) on conflict do nothing;
