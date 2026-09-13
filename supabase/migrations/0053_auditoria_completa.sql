-- Sakura System — AutoCenter Edition
-- Migration 0053: a trilha de auditoria passa a cobrir o que escapava.
--
-- A migration 0040 criou a trilha, mas com três buracos:
--
-- 1. **Só UPDATE/DELETE.** "Quem cadastrou este cliente com esse CPF?" é uma
--    pergunta tão legítima quanto "quem editou", e não tinha resposta.
-- 2. **Cinco tabelas de fora**, sendo a mais grave `ordens_servico_itens`:
--    desde a v0.9.28 dá pra mudar o VALOR de um item de uma OS pela tela, e
--    essa alteração não deixava rastro nenhum. Junto vêm
--    `notas_fiscais_arquivos` (excluir nota é ação séria),
--    `configuracoes_fiscais_loja` e `configuracoes_juros_parcelas` (mexer
--    aqui muda documento fiscal e o que o cliente paga) e `operador_lojas`
--    (dar acesso de alguém a uma loja).
-- 3. **Segredo em texto claro.** `configuracoes_fiscais_loja` guarda o token
--    da Focus NFe. Sem máscara, auditar essa tabela transformaria a própria
--    trilha no lugar novo onde o token fica legível — o contrário do que ela
--    existe pra fazer.
--
-- ATENÇÃO, detalhe que quebraria tudo em silêncio: a função da 0040 grava
-- `new.id`, e TRÊS das tabelas novas NÃO TÊM coluna `id` —
-- `configuracoes_fiscais_loja` tem PK `loja_id` (a 0033 derrubou o `id`),
-- `configuracoes_juros_parcelas` tem PK composta (`loja_id`,
-- `numero_parcelas`) e `operador_lojas` tem PK composta (`operador_id`,
-- `loja_id`). Por isso a função passa a receber, como argumento do trigger,
-- QUAL coluna usar como `registro_id` (padrão: `id`). O resto da chave
-- composta não se perde: a linha inteira continua indo em
-- `dados_antes`/`dados_depois`.
--
-- Idempotente: seguro rodar de novo.

-- ---------------------------------------------------------------------------
-- 1. `acao` passa a aceitar 'criar'
-- ---------------------------------------------------------------------------

alter table auditoria drop constraint if exists auditoria_acao_check;
alter table auditoria add constraint auditoria_acao_check
  check (acao in ('criar', 'atualizar', 'excluir'));

-- ---------------------------------------------------------------------------
-- 2. O operador da trilha deixa de travar a exclusão dele mesmo
--
-- `auditoria.operador_id` referencia `operadores (id)` sem `on delete`, ou
-- seja NO ACTION: enquanto existir uma linha de auditoria apontando pra um
-- operador, esse operador não pode ser excluído — nem pelo painel do
-- Supabase, que é justamente como o PROJETO_STATUS (seção 6, item 23) manda
-- excluir operador órfão. Até aqui isso quase nunca mordia, porque só quem
-- editava ou excluía algo aparecia na trilha. A partir desta migration TODA
-- criação também aparece, então na prática todo operador ativo passa a ter
-- linha aqui — e o caminho de exclusão documentado quebraria.
--
-- `on delete set null` NÃO resolve, e vale saber por quê antes de alguém
-- tentar: a linha de auditoria da exclusão é gravada DEPOIS que o operador
-- some, então um admin que exclui a própria conta faz a gravação estourar na
-- FK — testado, não suposto.
--
-- Então a FK sai. Trilha append-only não deve ter chave estrangeira capaz de
-- bloquear ou reescrever o passado: o dia em que o cadastro muda, o registro
-- histórico tem que continuar contando o que era verdade naquele dia. O
-- "quem" passa a viver em `operador_nome`, gravado no momento do fato — e
-- `operador_id` continua ali, sem FK, porque é por ele que a tela filtra.
-- ---------------------------------------------------------------------------

alter table auditoria add column if not exists operador_nome text;
alter table auditoria drop constraint if exists auditoria_operador_id_fkey;

-- As linhas que já existem (gravadas pela 0040) não têm o nome; como o
-- operador delas ainda está cadastrado, dá pra preencher uma vez.
update auditoria a
  set operador_nome = o.nome
  from operadores o
  where a.operador_id = o.id and a.operador_nome is null;

-- ---------------------------------------------------------------------------
-- 3. Índice que a tela usa (ela filtra por tabela e ordena por data) — a
--    auditoria só cresce, então vale ter antes de precisar.
--    O índice de `criado_em desc` sozinho já existe desde a 0040.
-- ---------------------------------------------------------------------------

create index if not exists auditoria_tabela_criado_em_idx on auditoria (tabela, criado_em desc);

-- ---------------------------------------------------------------------------
-- 4. Máscara de segredo
--
-- Mascara por NOME DE COLUNA, não por tabela: se um dia outra tabela ganhar
-- uma coluna com um desses nomes, ela já nasce protegida. Só substitui o que
-- existe e não é nulo — um token vazio continua aparecendo como vazio, que é
-- informação útil ("estava em branco") e não é segredo nenhum.
-- ---------------------------------------------------------------------------

create or replace function mascarar_segredos(dados jsonb)
returns jsonb
language plpgsql
immutable
as $$
declare
  chave text;
  resultado jsonb := dados;
begin
  if resultado is null then
    return null;
  end if;

  foreach chave in array array['focus_nfe_token'] loop
    if resultado ? chave and jsonb_typeof(resultado -> chave) <> 'null' then
      resultado := jsonb_set(resultado, array[chave], to_jsonb('***'::text));
    end if;
  end loop;

  return resultado;
end;
$$;

-- ---------------------------------------------------------------------------
-- 5. A função do trigger, agora com INSERT e com a coluna-chave parametrizada
-- ---------------------------------------------------------------------------

create or replace function registrar_auditoria()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  coluna_chave text := coalesce(tg_argv[0], 'id');
  antes jsonb;
  depois jsonb;
  alvo uuid;
  quem uuid := auth.uid();
  quem_nome text;
begin
  select nome into quem_nome from operadores where id = quem;
  if tg_op <> 'INSERT' then
    antes := to_jsonb(old);
  end if;
  if tg_op <> 'DELETE' then
    depois := to_jsonb(new);
  end if;

  alvo := (coalesce(depois, antes) ->> coluna_chave)::uuid;

  insert into auditoria
    (tabela, registro_id, acao, operador_id, operador_nome, dados_antes, dados_depois)
  values (
    tg_table_name,
    alvo,
    case tg_op
      when 'INSERT' then 'criar'
      when 'UPDATE' then 'atualizar'
      else 'excluir'
    end,
    quem,
    quem_nome,
    mascarar_segredos(antes),
    mascarar_segredos(depois)
  );

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- 6. Os triggers — as 11 tabelas da 0040 mais as 5 novas.
--    Segundo valor de cada par: a coluna que vira `registro_id`.
-- ---------------------------------------------------------------------------

do $$
declare
  alvo text[];
begin
  foreach alvo slice 1 in array array[
    ['operadores', 'id'],
    ['pecas', 'id'],
    ['servicos', 'id'],
    ['caixa_movimentos', 'id'],
    ['contas_pagar', 'id'],
    ['contas_receber', 'id'],
    ['ordens_servico', 'id'],
    ['clientes', 'id'],
    ['fornecedores', 'id'],
    ['pedidos_compra', 'id'],
    ['lojas', 'id'],
    -- novas nesta migration
    ['ordens_servico_itens', 'id'],
    ['notas_fiscais_arquivos', 'id'],
    ['configuracoes_fiscais_loja', 'loja_id'],
    ['configuracoes_juros_parcelas', 'loja_id'],
    ['operador_lojas', 'operador_id']
  ]
  loop
    execute format('drop trigger if exists trigger_auditoria on %I', alvo[1]);
    execute format(
      'create trigger trigger_auditoria after insert or update or delete on %I ' ||
      'for each row execute function registrar_auditoria(%L)',
      alvo[1], alvo[2]
    );
  end loop;
end;
$$;

-- ---------------------------------------------------------------------------
-- 7. Expurgo — trilha de auditoria sem expurgo é a tabela que estoura o
--    banco primeiro, e a partir desta migration ela cresce bem mais rápido
--    (toda criação de registro passa a gerar uma linha).
--
-- NÃO roda sozinha, de propósito: apagar histórico é decisão da dona do
-- sistema, não efeito colateral de uma migration. O padrão sugerido é 24
-- meses; o mínimo que a função aceita é 6, pra um dedo escorregado não
-- levar a trilha inteira junto.
--
-- O `revoke` abaixo é a trava que importa: sem ele, `security definer` +
-- permissão padrão do Postgres deixaria QUALQUER operador logado chamar
-- esta função pela API e apagar a própria pegada. Depois do revoke, só quem
-- tem acesso de dono ao banco (ou seja, o SQL Editor do Supabase) consegue.
--
--   select expurgar_auditoria(24);   -- devolve quantas linhas apagou
-- ---------------------------------------------------------------------------

create or replace function expurgar_auditoria(meses int default 24)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  apagadas bigint;
begin
  if meses is null or meses < 6 then
    raise exception 'Retenção mínima de 6 meses (foi pedido: %)', meses;
  end if;

  delete from auditoria where criado_em < now() - make_interval(months => meses);
  get diagnostics apagadas = row_count;
  return apagadas;
end;
$$;

revoke all on function expurgar_auditoria(int) from public;
