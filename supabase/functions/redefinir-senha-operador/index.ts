// Edge Function do Supabase — permite que um admin redefina a senha de outro
// operador esquecida. Precisa rodar aqui (não no app Electron) porque exige
// a "service role key" do Supabase, que nunca pode ficar no app instalado
// (dá acesso total ao banco, sem passar por RLS).
//
// Fluxo de permissão: primeiro confirma quem está chamando é admin de uma
// loja que o operador-alvo também acessa (reaproveitando a função
// `operador_administra`, a mesma usada pela RLS de editar/excluir operador —
// migration 0031) usando o token do próprio chamador, sem privilégio
// nenhum extra. Só depois disso usa a service role key pra trocar a senha.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Requisição sem autenticação.");
    }

    const { operadorAlvoId, novaSenha } = await req.json();
    if (!operadorAlvoId || typeof operadorAlvoId !== "string") {
      throw new Error("Informe o operador que vai ter a senha redefinida.");
    }
    if (!novaSenha || typeof novaSenha !== "string" || novaSenha.length < 6) {
      throw new Error("A nova senha precisa ter pelo menos 6 caracteres.");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Client "como o chamador" — só pra checar permissão, nenhum privilégio
    // extra além do que o próprio operador logado já tem.
    const clienteChamador = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: podeAdministrar, error: erroPermissao } = await clienteChamador.rpc(
      "operador_administra",
      { p_operador_alvo_id: operadorAlvoId },
    );
    if (erroPermissao) throw erroPermissao;
    if (!podeAdministrar) {
      return new Response(
        JSON.stringify({ error: "Você não tem permissão para redefinir a senha desse operador." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Só a partir daqui usa a service role key, já com a permissão confirmada.
    const clienteAdmin = createClient(supabaseUrl, serviceRoleKey);
    const { error: erroSenha } = await clienteAdmin.auth.admin.updateUserById(operadorAlvoId, {
      password: novaSenha,
    });
    if (erroSenha) throw erroSenha;

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const mensagem = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: mensagem }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
