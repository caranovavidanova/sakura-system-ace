-- Sakura System — AutoCenter Edition
-- TESTE da migration 0063 (computadores). NÃO é migration, e NUNCA deve ser
-- rodado no Supabase de verdade — grava e apaga dado de teste.
--
-- A promessa, em duas metades:
--   • QUALQUER operador logado registra o computador em que está — senão a
--     lista nunca saberia do computador do balconista, que é justamente o
--     que fica pra trás;
--   • e SÓ o admin daquela loja enxerga a lista, dá apelido e esquece um
--     computador. O balconista grava a própria linha sem poder ler nenhuma.
--
-- Como rodar: ver o cabeçalho de supabase/scripts/testar-auditoria.sql.
-- Terminou imprimindo "TODAS AS CHECAGENS PASSARAM", passou.

do $$
declare
  loja_a    uuid := 'c0c00000-0000-0000-0000-00000000000a';
  loja_b    uuid := 'c0c00000-0000-0000-0000-00000000000b';
  loja_c    uuid := 'c0c00000-0000-0000-0000-00000000000c';  -- vai ser excluída
  o_admin_a uuid := 'c0c01111-0000-0000-0000-000000000001';  -- admin só da loja A
  o_admin_b uuid := 'c0c01111-0000-0000-0000-000000000002';  -- admin só da loja B
  o_balcao  uuid := 'c0c01111-0000-0000-0000-000000000003';  -- balconista da A e da C
  o_inativo uuid := 'c0c01111-0000-0000-0000-000000000004';  -- operador inativo da A
  o_fantasma uuid := 'c0c01111-0000-0000-0000-000000000005'; -- logado, sem operador
  pc1       uuid := 'c0c02222-0000-0000-0000-000000000001';
  pc2       uuid := 'c0c02222-0000-0000-0000-000000000002';
  pc3       uuid := 'c0c02222-0000-0000-0000-000000000003';
  linha     record;
  quantas   int;
  estado    text;
  primeiro  timestamptz;
begin
  insert into lojas (id, nome, cidade, uf) values
    (loja_a, 'Loja A (teste computadores)', 'Araraquara', 'SP'),
    (loja_b, 'Loja B (teste computadores)', 'Araraquara', 'SP'),
    (loja_c, 'Loja C (teste computadores)', 'Araraquara', 'SP')
    on conflict (id) do nothing;

  insert into auth.users (id) values
    (o_admin_a), (o_admin_b), (o_balcao), (o_inativo), (o_fantasma)
    on conflict do nothing;
  insert into operadores (id, usuario, nome, admin, permissoes, ativo) values
    (o_admin_a, 'tc_admin_a', 'Admin A de teste',      true,  array['painel'],          true),
    (o_admin_b, 'tc_admin_b', 'Admin B de teste',      true,  array['painel'],          true),
    (o_balcao,  'tc_balcao',  'Balconista de teste',   false, array['painel','caixa'],  true),
    (o_inativo, 'tc_inativo', 'Inativo de teste',      false, array['painel'],          false)
    on conflict (id) do nothing;
  insert into operador_lojas (operador_id, loja_id) values
    (o_admin_a, loja_a), (o_admin_b, loja_b),
    (o_balcao, loja_a), (o_balcao, loja_c), (o_inativo, loja_a)
    on conflict do nothing;

  set local role authenticated;

  -- ===================================================================
  -- A. O balconista registra o computador dele (a metade que precisa
  --    continuar funcionando)
  -- ===================================================================
  perform set_config('request.jwt.claim.sub', o_balcao::text, true);
  perform registrar_computador(pc1, 'DESKTOP-BALCAO', '0.9.44', 'normal', 'Windows 11 Pro', loja_a);

  reset role;
  select * into linha from computadores where id = pc1;
  if linha.id is null then
    raise exception 'FALHOU: o balconista não conseguiu registrar o computador dele';
  end if;
  if linha.versao_app <> '0.9.44' or linha.loja_id is distinct from loja_a
     or linha.operador_id is distinct from o_balcao or linha.nome_maquina <> 'DESKTOP-BALCAO' then
    raise exception 'FALHOU: a linha registrada não tem o que foi mandado: %', row_to_json(linha);
  end if;
  -- `now()` é o mesmo instante durante a transação inteira, e este teste
  -- roda numa só. Pra "registrar de novo" (E) ter como mudar o "visto em",
  -- a primeira passagem é empurrada um dia pra trás, como se tivesse sido
  -- ontem — que é o caso real: cada login é uma transação.
  update computadores
     set primeiro_acesso = primeiro_acesso - interval '1 day',
         visto_em        = visto_em - interval '1 day'
   where id = pc1
  returning primeiro_acesso into primeiro;
  set local role authenticated;

  -- ===================================================================
  -- B. ... mas não lê a lista, nem a própria linha
  -- ===================================================================
  select count(*) into quantas from computadores;
  if quantas <> 0 then
    raise exception 'FALHOU: o balconista leu % computador(es) — a lista é só de admin', quantas;
  end if;

  -- ===================================================================
  -- C. O admin da loja vê; o admin de OUTRA loja, não
  -- ===================================================================
  perform set_config('request.jwt.claim.sub', o_admin_a::text, true);
  select count(*) into quantas from computadores where id = pc1;
  if quantas <> 1 then
    raise exception 'FALHOU: o admin da loja A devia ver o computador da loja A (viu %)', quantas;
  end if;

  perform set_config('request.jwt.claim.sub', o_admin_b::text, true);
  select count(*) into quantas from computadores where id = pc1;
  if quantas <> 0 then
    raise exception 'FALHOU: o admin da loja B viu o computador da loja A';
  end if;

  -- ===================================================================
  -- D. Apelido: o admin da loja dá; o balconista e o admin de outra loja,
  --    não
  -- ===================================================================
  perform set_config('request.jwt.claim.sub', o_admin_a::text, true);
  perform definir_apelido_computador(pc1, '  Balcão  ');

  perform set_config('request.jwt.claim.sub', o_balcao::text, true);
  estado := null;
  begin
    perform definir_apelido_computador(pc1, 'Meu computador');
  exception when others then
    estado := sqlstate;
  end;
  if estado is distinct from '42501' then
    raise exception 'FALHOU: o balconista deu apelido a um computador (estado %)', estado;
  end if;

  perform set_config('request.jwt.claim.sub', o_admin_b::text, true);
  estado := null;
  begin
    perform definir_apelido_computador(pc1, 'Da loja B');
  exception when others then
    estado := sqlstate;
  end;
  if estado is distinct from '42501' then
    raise exception 'FALHOU: o admin da loja B deu apelido a um computador da loja A (estado %)', estado;
  end if;

  -- ===================================================================
  -- E. Registrar de novo atualiza versão e "visto em", e NÃO apaga o
  --    apelido nem o primeiro acesso
  -- ===================================================================
  perform set_config('request.jwt.claim.sub', o_balcao::text, true);
  perform registrar_computador(pc1, 'DESKTOP-BALCAO', '0.9.45', 'teste', 'Windows 11 Pro', loja_a);

  reset role;
  select * into linha from computadores where id = pc1;
  if linha.apelido is distinct from 'Balcão' then
    raise exception 'FALHOU: registrar de novo mexeu no apelido (está %)', linha.apelido;
  end if;
  if linha.versao_app <> '0.9.45' or linha.canal <> 'teste' then
    raise exception 'FALHOU: registrar de novo não atualizou versão/canal: %', row_to_json(linha);
  end if;
  if linha.primeiro_acesso is distinct from primeiro then
    raise exception 'FALHOU: registrar de novo mexeu no primeiro acesso';
  end if;
  if linha.visto_em <= linha.primeiro_acesso then
    raise exception 'FALHOU: registrar de novo não atualizou o "visto em"';
  end if;
  set local role authenticated;

  -- ===================================================================
  -- F. Recusas: loja sem acesso, operador inativo, logado sem operador,
  --    versão que não é número
  -- ===================================================================
  perform set_config('request.jwt.claim.sub', o_balcao::text, true);
  estado := null;
  begin
    perform registrar_computador(pc2, 'X', '0.9.44', 'normal', null, loja_b);
  exception when others then
    estado := sqlstate;
  end;
  if estado is distinct from '42501' then
    raise exception 'FALHOU: registrou computador numa loja sem acesso (estado %)', estado;
  end if;

  perform set_config('request.jwt.claim.sub', o_inativo::text, true);
  estado := null;
  begin
    perform registrar_computador(pc2, 'X', '0.9.44', 'normal', null, loja_a);
  exception when others then
    estado := sqlstate;
  end;
  if estado is distinct from '42501' then
    raise exception 'FALHOU: operador inativo registrou computador (estado %)', estado;
  end if;

  perform set_config('request.jwt.claim.sub', o_fantasma::text, true);
  estado := null;
  begin
    perform registrar_computador(pc2, 'X', '0.9.44', 'normal', null, null);
  exception when others then
    estado := sqlstate;
  end;
  if estado is distinct from '42501' then
    raise exception 'FALHOU: logado sem cadastro de operador registrou computador (estado %)', estado;
  end if;

  perform set_config('request.jwt.claim.sub', o_balcao::text, true);
  estado := null;
  begin
    perform registrar_computador(pc2, 'X', 'versão nova', 'normal', null, loja_a);
  exception when others then
    estado := sqlstate;
  end;
  if estado is distinct from '23514' then
    raise exception 'FALHOU: uma versão que não é número entrou (estado %)', estado;
  end if;

  -- ===================================================================
  -- G. Direto na tabela, ninguém grava — nem o admin
  -- ===================================================================
  perform set_config('request.jwt.claim.sub', o_admin_a::text, true);
  estado := null;
  begin
    insert into computadores (id, versao_app, loja_id) values (pc2, '0.9.44', loja_a);
  exception when others then
    estado := sqlstate;
  end;
  if estado is distinct from '42501' then
    raise exception 'FALHOU: o admin inseriu direto na tabela (estado %)', estado;
  end if;

  -- Comando SEM filtro + get diagnostics: um `where` faria a regra de
  -- LEITURA valer junto e o teste passaria pelo motivo errado (§6 item 74).
  update computadores set versao_app = '9.9.9';
  get diagnostics quantas = row_count;
  if quantas <> 0 then
    raise exception 'FALHOU: o admin alterou % computador(es) direto na tabela', quantas;
  end if;

  -- ===================================================================
  -- H. Sem login, nem chama a função
  -- ===================================================================
  -- O `sub` do balconista ainda está na transação: sem limpar, o "anônimo"
  -- chegaria na função com a identidade dele e o teste mediria outra coisa.
  reset role;
  perform set_config('request.jwt.claim.sub', '', true);
  if has_function_privilege('anon', 'registrar_computador(uuid, text, text, text, text, uuid)', 'execute')
     or has_function_privilege('anon', 'definir_apelido_computador(uuid, text)', 'execute') then
    raise exception 'FALHOU: o anônimo tem permissão de chamar as funções de computador (faltou o revoke)';
  end if;
  set local role anon;
  estado := null;
  begin
    perform registrar_computador(pc2, 'X', '0.9.44', 'normal', null, null);
  exception when others then
    estado := sqlstate;
  end;
  if estado is distinct from '42501' then
    raise exception 'FALHOU: sem login chegou a chamar registrar_computador (estado %)', estado;
  end if;
  reset role;

  -- ===================================================================
  -- I. Computador cuja loja foi excluída: qualquer admin enxerga e
  --    esquece — senão vira linha que ninguém alcança (§6 item 23)
  -- ===================================================================
  set local role authenticated;
  perform set_config('request.jwt.claim.sub', o_balcao::text, true);
  perform registrar_computador(pc3, 'NOTEBOOK-VELHO', '0.9.40', 'normal', null, loja_c);
  reset role;
  delete from depositos where loja_id = loja_c;
  delete from configuracoes_garantia where loja_id = loja_c;
  delete from configuracoes_fiscais_loja where loja_id = loja_c;
  delete from configuracoes_painel_inicio where loja_id = loja_c;
  delete from operador_lojas where loja_id = loja_c;
  delete from lojas where id = loja_c;  -- a FK é `on delete set null`: não trava

  set local role authenticated;
  perform set_config('request.jwt.claim.sub', o_balcao::text, true);
  select count(*) into quantas from computadores where id = pc3;
  if quantas <> 0 then
    raise exception 'FALHOU: o balconista viu o computador sem loja';
  end if;

  perform set_config('request.jwt.claim.sub', o_admin_b::text, true);
  select count(*) into quantas from computadores where id = pc3;
  if quantas <> 1 then
    raise exception 'FALHOU: o computador sem loja ficou invisível pra todo admin';
  end if;

  -- ===================================================================
  -- J. Esquecer: só o admin da loja
  -- ===================================================================
  perform set_config('request.jwt.claim.sub', o_admin_b::text, true);
  delete from computadores where id = pc1;
  get diagnostics quantas = row_count;
  if quantas <> 0 then
    raise exception 'FALHOU: o admin da loja B esqueceu um computador da loja A';
  end if;

  perform set_config('request.jwt.claim.sub', o_balcao::text, true);
  delete from computadores;
  get diagnostics quantas = row_count;
  if quantas <> 0 then
    raise exception 'FALHOU: o balconista apagou % computador(es)', quantas;
  end if;

  perform set_config('request.jwt.claim.sub', o_admin_a::text, true);
  delete from computadores where id = pc1;
  get diagnostics quantas = row_count;
  if quantas <> 1 then
    raise exception 'FALHOU: o admin da loja A não conseguiu esquecer o computador dele';
  end if;
  reset role;

  -- ===================================================================
  -- K. A comparação que o botão de atualizar os bancos usa é por NÚMERO,
  --    não por texto: 0.9.9 é mais velha que 0.9.10
  -- ===================================================================
  if not (string_to_array('0.9.9', '.')::int[] < string_to_array('0.9.10', '.')::int[]) then
    raise exception 'FALHOU: a comparação de versão está olhando texto, não número';
  end if;
  if not (string_to_array('0.10.0', '.')::int[] > string_to_array('0.9.99', '.')::int[]) then
    raise exception 'FALHOU: a comparação de versão errou a virada de 0.9 pra 0.10';
  end if;

  -- ---- limpeza ------------------------------------------------------------
  delete from computadores where id in (pc1, pc2, pc3);
  delete from operador_lojas where operador_id in (o_admin_a, o_admin_b, o_balcao, o_inativo);
  delete from funcionarios where operador_id in (o_admin_a, o_admin_b, o_balcao, o_inativo);
  delete from operadores where id in (o_admin_a, o_admin_b, o_balcao, o_inativo);
  delete from auth.users where id in (o_admin_a, o_admin_b, o_balcao, o_inativo, o_fantasma);
  delete from depositos where loja_id in (loja_a, loja_b);
  delete from configuracoes_garantia where loja_id in (loja_a, loja_b);
  delete from configuracoes_fiscais_loja where loja_id in (loja_a, loja_b);
  delete from configuracoes_painel_inicio where loja_id in (loja_a, loja_b);
  delete from lojas where id in (loja_a, loja_b);
  delete from auditoria;

  raise notice 'TODAS AS CHECAGENS PASSARAM';
end;
$$;
