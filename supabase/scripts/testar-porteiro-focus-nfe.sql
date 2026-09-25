-- Sakura System — AutoCenter Edition
-- TESTE do TR-04.2, parte 1 (migration 0057). NÃO é migration, e NUNCA deve
-- ser rodado no Supabase de verdade — grava e apaga dado de teste.
--
-- Prova as promessas do cofre do token da Focus NFe:
--   • ninguém lê o cofre pela API — nem o admin, nem escrevendo direto;
--   • só admin DA LOJA grava o token, e só pela função;
--   • a tela consegue saber "tem token?" sem ver o token;
--   • a regra do porteiro deixa cada papel fazer exatamente o que a tela já
--     deixava (e nada além);
--   • a trilha de auditoria registra a troca sem registrar o token.
--
-- Como rodar: ver o cabeçalho de supabase/scripts/testar-auditoria.sql.
-- Terminou imprimindo "TODAS AS CHECAGENS PASSARAM", passou.

do $$
declare
  loja_a   uuid := 'fafa0000-0000-0000-0000-00000000000a';
  loja_b   uuid := 'fafa0000-0000-0000-0000-00000000000b';
  o_admin  uuid := 'fafa1111-0000-0000-0000-000000000001';  -- admin só da loja A
  o_caixa  uuid := 'fafa1111-0000-0000-0000-000000000002';  -- só Caixa
  o_os     uuid := 'fafa1111-0000-0000-0000-000000000003';  -- só Ordens de Serviço
  o_nf     uuid := 'fafa1111-0000-0000-0000-000000000004';  -- só Notas Fiscais
  quantas  int;
  resposta boolean;
  mascarado text;
begin
  -- ---- preparo -------------------------------------------------------------
  insert into lojas (id, nome, cidade, uf) values
    (loja_a, 'Loja A do porteiro', 'Araraquara', 'SP'),
    (loja_b, 'Loja B do porteiro', 'Araraquara', 'SP')
    on conflict (id) do nothing;

  insert into auth.users (id) values (o_admin), (o_caixa), (o_os), (o_nf)
    on conflict do nothing;

  insert into operadores (id, usuario, nome, admin, permissoes, ativo) values
    (o_admin, 'porteiro_admin', 'Admin da A',  true,  array['painel'],                   true),
    (o_caixa, 'porteiro_caixa', 'Balconista',  false, array['painel','caixa'],           true),
    (o_os,    'porteiro_os',    'Atendente',   false, array['painel','ordens_servico'],  true),
    (o_nf,    'porteiro_nf',    'Fiscal',      false, array['painel','notas_fiscais'],   true)
    on conflict (id) do nothing;

  insert into operador_lojas (operador_id, loja_id) values
    (o_admin, loja_a), (o_caixa, loja_a), (o_os, loja_a), (o_nf, loja_a)
    on conflict do nothing;

  -- Loja B já com um token no cofre (como se o dono das duas tivesse
  -- cadastrado). Ninguém da loja A pode enxergá-lo nem trocá-lo.
  insert into segredos_fiscais_loja (loja_id, focus_nfe_token)
    values (loja_b, 'token-da-loja-b-naopodevazar')
    on conflict (loja_id) do nothing;

  set local role authenticated;

  -- ===================================================================
  -- A. O cofre é invisível, até pro admin
  -- ===================================================================
  perform set_config('request.jwt.claim.sub', o_admin::text, true);

  -- 1. o admin da loja A grava o token da loja dele
  perform definir_token_focus_nfe(loja_a, '  token-da-loja-a-naopodevazar  ');

  -- 2. ...e mesmo assim não consegue ler de volta
  select count(*) into quantas from segredos_fiscais_loja;
  if quantas <> 0 then
    raise exception 'FALHOU: o admin leu % linha(s) do cofre — ele não pode ler nem o da própria loja', quantas;
  end if;

  -- 3. nem escrever direto na tabela, passando por fora da função
  begin
    insert into segredos_fiscais_loja (loja_id, focus_nfe_token) values (loja_a, 'por-fora');
    raise exception 'FALHOU: deu pra escrever no cofre direto na tabela';
  exception
    when insufficient_privilege then null;  -- é a RLS recusando: esperado
  end;

  -- 4. nem trocar o token de uma loja que não é dele
  begin
    perform definir_token_focus_nfe(loja_b, 'sequestro');
    raise exception 'FALHOU: o admin da loja A trocou o token da loja B';
  exception
    when insufficient_privilege then null;
  end;

  -- 5. token em branco é recusado (apagaria a emissão sem ninguém perceber)
  begin
    perform definir_token_focus_nfe(loja_a, '   ');
    raise exception 'FALHOU: aceitou token em branco';
  exception
    when invalid_parameter_value then null;
  end;

  -- 6. a tela sabe que tem token, sem ver o token
  select loja_tem_token_focus_nfe(loja_a) into resposta;
  if resposta is not true then
    raise exception 'FALHOU: loja_tem_token_focus_nfe devia dizer que a loja A tem token';
  end if;

  -- ===================================================================
  -- B. Quem não é admin não troca token
  -- ===================================================================
  perform set_config('request.jwt.claim.sub', o_nf::text, true);
  begin
    perform definir_token_focus_nfe(loja_a, 'troca-do-fiscal');
    raise exception 'FALHOU: quem não é admin trocou o token (mesmo tendo Notas Fiscais)';
  exception
    when insufficient_privilege then null;
  end;

  -- 7. "tem token?" só responde sobre a própria loja
  perform set_config('request.jwt.claim.sub', o_caixa::text, true);
  select loja_tem_token_focus_nfe(loja_b) into resposta;
  if resposta is not false then
    raise exception 'FALHOU: o balconista da loja A descobriu se a loja B tem token';
  end if;

  -- ===================================================================
  -- C. A regra do porteiro, papel por papel
  -- ===================================================================
  -- 8. balconista só-Caixa: nada
  if pode_usar_focus_nfe(loja_a, 'emitir') or pode_usar_focus_nfe(loja_a, 'baixar')
     or pode_usar_focus_nfe(loja_a, 'cancelar') or pode_usar_focus_nfe(loja_a, 'consultar') then
    raise exception 'FALHOU: o balconista só-Caixa pode usar o porteiro';
  end if;

  -- 9. atendente de OS: emite, consulta e baixa — não cancela (é o que a tela
  --    já permite: o cancelamento só existe em Notas Fiscais)
  perform set_config('request.jwt.claim.sub', o_os::text, true);
  if not (pode_usar_focus_nfe(loja_a, 'emitir') and pode_usar_focus_nfe(loja_a, 'consultar')
          and pode_usar_focus_nfe(loja_a, 'baixar')) then
    raise exception 'FALHOU: o atendente de OS perdeu o direito de emitir/consultar/baixar';
  end if;
  if pode_usar_focus_nfe(loja_a, 'cancelar') then
    raise exception 'FALHOU: o atendente de OS (sem Notas Fiscais) consegue cancelar nota';
  end if;

  -- 10. e nada na loja que não é dele
  if pode_usar_focus_nfe(loja_b, 'emitir') then
    raise exception 'FALHOU: o atendente da loja A emite na loja B';
  end if;

  -- 11. quem tem Notas Fiscais cancela
  perform set_config('request.jwt.claim.sub', o_nf::text, true);
  if not (pode_usar_focus_nfe(loja_a, 'cancelar') and pode_usar_focus_nfe(loja_a, 'baixar')) then
    raise exception 'FALHOU: quem tem Notas Fiscais não consegue cancelar/baixar';
  end if;

  -- 12. admin faz tudo; ação inventada, ninguém faz
  perform set_config('request.jwt.claim.sub', o_admin::text, true);
  if not (pode_usar_focus_nfe(loja_a, 'emitir') and pode_usar_focus_nfe(loja_a, 'cancelar')) then
    raise exception 'FALHOU: o admin da loja não consegue emitir/cancelar';
  end if;
  if pode_usar_focus_nfe(loja_a, 'listar_empresas') then
    raise exception 'FALHOU: uma ação que não existe foi autorizada';
  end if;

  reset role;

  -- ===================================================================
  -- D. O que ficou gravado — visto como dono do banco
  -- ===================================================================
  -- 13. o token entrou, sem os espaços em volta
  select count(*) into quantas from segredos_fiscais_loja
   where loja_id = loja_a and focus_nfe_token = 'token-da-loja-a-naopodevazar';
  if quantas <> 1 then
    raise exception 'FALHOU: o token da loja A não ficou gravado como esperado';
  end if;

  -- 14. a loja B continua com o dela
  select count(*) into quantas from segredos_fiscais_loja
   where loja_id = loja_b and focus_nfe_token = 'token-da-loja-b-naopodevazar';
  if quantas <> 1 then
    raise exception 'FALHOU: o token da loja B foi mexido';
  end if;

  -- 15. a auditoria registrou a troca — e mascarou o token
  select dados_depois ->> 'focus_nfe_token' into mascarado
    from auditoria
   where tabela = 'segredos_fiscais_loja' and registro_id = loja_a
   order by criado_em desc
   limit 1;
  if mascarado is distinct from '***' then
    raise exception 'FALHOU: a auditoria do cofre gravou o token sem máscara (%)', coalesce(mascarado, 'nenhuma linha');
  end if;

  -- 16. quem não está logado nem pergunta
  set local role anon;
  begin
    perform loja_tem_token_focus_nfe(loja_a);
    raise exception 'FALHOU: o anon conseguiu chamar loja_tem_token_focus_nfe';
  exception
    when insufficient_privilege then null;
  end;
  begin
    perform pode_usar_focus_nfe(loja_a, 'emitir');
    raise exception 'FALHOU: o anon conseguiu chamar pode_usar_focus_nfe';
  exception
    when insufficient_privilege then null;
  end;
  reset role;

  -- 17. excluir a loja leva o segredo junto (senão a loja nunca mais sai)
  delete from operador_lojas where loja_id = loja_b;
  delete from depositos where loja_id = loja_b;
  delete from configuracoes_garantia where loja_id = loja_b;
  delete from configuracoes_fiscais_loja where loja_id = loja_b;
  delete from configuracoes_painel_inicio where loja_id = loja_b;
  delete from lojas where id = loja_b;
  select count(*) into quantas from segredos_fiscais_loja where loja_id = loja_b;
  if quantas <> 0 then
    raise exception 'FALHOU: o segredo da loja B sobreviveu à exclusão da loja';
  end if;

  -- ---- limpeza ------------------------------------------------------------
  delete from segredos_fiscais_loja where loja_id in (loja_a, loja_b);
  delete from funcionarios where operador_id in (o_admin, o_caixa, o_os, o_nf);
  delete from operador_lojas where operador_id in (o_admin, o_caixa, o_os, o_nf);
  delete from operadores where id in (o_admin, o_caixa, o_os, o_nf);
  delete from auth.users where id in (o_admin, o_caixa, o_os, o_nf);
  delete from depositos where loja_id in (loja_a, loja_b);
  delete from configuracoes_garantia where loja_id in (loja_a, loja_b);
  delete from configuracoes_fiscais_loja where loja_id in (loja_a, loja_b);
  delete from configuracoes_painel_inicio where loja_id in (loja_a, loja_b);
  delete from lojas where id in (loja_a, loja_b);
  delete from auditoria;

  raise notice 'TODAS AS CHECAGENS PASSARAM';
end;
$$;
