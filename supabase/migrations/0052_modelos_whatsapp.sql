-- Sakura System — AutoCenter Edition
-- Migration 0052: `configuracoes_whatsapp` — os modelos de mensagem que o
-- sistema abre no WhatsApp (item FN-03 do guia de melhorias).
--
-- Por que existe: o WhatsApp já é o canal por onde essa operação funciona —
-- é por lá que o pai dela manda foto de nota, que ela fala com a
-- contabilidade e com o suporte, e que a senha temporária de um operador é
-- repassada. O sistema era a única parte do fluxo que ignorava isso, e quem
-- precisava cobrar um cliente copiava valor e data na mão, de uma tela pra
-- outra, todo dia.
--
-- Por que os textos ficam no BANCO e não no código: cada loja fala do seu
-- jeito, e o texto que o dono manda pro cliente dele é decisão dele, não
-- minha. É o mesmo caminho já percorrido pelo texto de garantia
-- (`configuracoes_garantia`, migration 0018) — que também nasceu fixo e
-- precisou virar editável.
--
-- Por que uma linha por modelo, e não uma coluna por modelo: assim um modelo
-- novo (orçamento, lembrete de revisão — os dois já previstos no guia) é uma
-- linha, não uma migration. É exatamente a forma de `configuracoes_juros_parcelas`
-- (migration 0033): per-loja, PK composta, várias linhas.
--
-- A linha só existe depois que alguém edita o texto naquela loja: enquanto
-- não existir, vale o modelo padrão que está em `src/schemas/whatsapp.ts`.
-- Ou seja, nada aqui precisa ser semeado, e uma loja recém-instalada já
-- manda mensagem — ao contrário do que aconteceu com as categorias de caixa
-- na migration 0050, onde a tabela vazia deixava a tela sem saída.
--
-- Idempotente: seguro rodar de novo.

create table if not exists configuracoes_whatsapp (
  loja_id uuid not null references lojas (id),
  chave text not null,
  texto text not null,
  atualizado_em timestamptz not null default now(),
  primary key (loja_id, chave)
);

alter table configuracoes_whatsapp enable row level security;

-- Mesma regra das outras configurações por loja (migration 0033): quem tem
-- acesso à loja lê e grava. O reforço de "só admin edita" é da tela, como no
-- resto de Configurações.
drop policy if exists "configuracoes_whatsapp_acesso_por_loja" on configuracoes_whatsapp;
create policy "configuracoes_whatsapp_acesso_por_loja" on configuracoes_whatsapp
  for all
  using (operador_tem_acesso_loja(loja_id))
  with check (operador_tem_acesso_loja(loja_id));

-- Registro de que uma mensagem foi ABERTA — nunca "enviada".
--
-- A diferença não é preciosismo: o sistema abre a conversa no WhatsApp com o
-- texto pronto, e daí em diante quem decide é a pessoa (pode editar, pode
-- fechar sem mandar). Gravar "enviada" seria afirmar uma coisa que este
-- sistema não tem como saber, e um dia alguém tomaria uma decisão de cobrança
-- em cima dessa mentira.
--
-- O que isso responde, na prática: "já cobrei esse cliente?". Hoje a resposta
-- mora só na memória de quem cobrou.
--
-- `referencia` é o id do que motivou a mensagem (a conta a receber, a OS, o
-- pedido de compra) — texto e sem FK de propósito, porque aponta pra tabelas
-- diferentes conforme a `chave`, e uma FK por destino faria esta tabela
-- crescer a cada modelo novo.
create table if not exists whatsapp_mensagens (
  id uuid primary key default gen_random_uuid(),
  loja_id uuid not null references lojas (id),
  chave text not null,
  referencia text,
  destino text,
  operador_id uuid references operadores (id),
  criado_em timestamptz not null default now()
);

create index if not exists whatsapp_mensagens_referencia_idx
  on whatsapp_mensagens (loja_id, chave, referencia);

alter table whatsapp_mensagens enable row level security;

drop policy if exists "whatsapp_mensagens_acesso_por_loja" on whatsapp_mensagens;
create policy "whatsapp_mensagens_acesso_por_loja" on whatsapp_mensagens
  for all
  using (operador_tem_acesso_loja(loja_id))
  with check (operador_tem_acesso_loja(loja_id));
