// Edge Function do Supabase — redefine a senha de um operador que esqueceu
// a dela. Como o login usa só "usuário" (o e-mail é inventado por baixo dos
// panos, ver src/lib/auth.ts), o fluxo padrão de "esqueci minha senha" por
// e-mail do Supabase Auth não funciona aqui. Em vez disso, um admin gera uma
// senha temporária pra outro operador — e isso exige a service role key
// (única chave com permissão de mudar a senha de outra pessoa), que por isso
// só pode existir aqui, nunca no app Electron instalado.
//
// Duas ações, no corpo da requisição (`{ acao: "..." }`):
// - "redefinir" (só admin): gera uma senha temporária pro operador indicado
//   e marca que ele precisa trocá-la no próximo login.
// - "confirmar-troca" (qualquer operador logado): limpa essa marca pra si
//   mesmo, depois de já ter trocado a senha de verdade (ver TrocarSenhaPage).
//
// SUPABASE_URL, SUPABASE_ANON_KEY e SUPABASE_SERVICE_ROLE_KEY já vêm
// prontos como variáveis de ambiente em toda Edge Function do Supabase —
// diferente da ANTHROPIC_API_KEY (de ler-notas-fiscais), não precisa
// configurar nenhum secret novo pra publicar esta função.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Sem caracteres ambíguos (0/O, 1/l/I) — só facilita quando o admin for
// ditar a senha temporária em voz alta ou por WhatsApp pro operador.
const ALFABETO_SENHA = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";

function gerarSenhaTemporaria(): string {
  let senha = "";
  for (let i = 0; i < 10; i++) {
    senha += ALFABETO_SENHA[Math.floor(Math.random() * ALFABETO_SENHA.length)];
  }
  return senha;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      throw new Error("Configuração do Supabase incompleta nesta função.");
    }

    const authHeader = req.headers.get("Authorization") ?? "";

    // Cliente "como o operador que está chamando" — só serve pra descobrir
    // quem é, nunca é usado pra alterar senha ou tabela de ninguém.
    const clienteChamador = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: dadosUsuario, error: erroUsuario } = await clienteChamador.auth.getUser();
    if (erroUsuario || !dadosUsuario.user) {
      throw new Error("Sessão inválida — faça login de novo.");
    }
    const chamadorId = dadosUsuario.user.id;

    // Cliente com a service role — a única com permissão de mudar a senha
    // de outro usuário ou gravar em `operadores` ignorando RLS.
    const admin = createClient(supabaseUrl, serviceRoleKey);

    const corpo = await req.json();

    if (corpo.acao === "confirmar-troca") {
      const { error } = await admin
        .from("operadores")
        .update({ deve_trocar_senha: false })
        .eq("id", chamadorId);
      if (error) throw error;

      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (corpo.acao === "redefinir") {
      const operadorId = corpo.operadorId;
      if (!operadorId || typeof operadorId !== "string") {
        throw new Error("Informe o operador cuja senha vai ser redefinida.");
      }

      const { data: chamador, error: erroChamador } = await admin
        .from("operadores")
        .select("admin, ativo")
        .eq("id", chamadorId)
        .maybeSingle();
      if (erroChamador) throw erroChamador;
      if (!chamador?.admin || !chamador.ativo) {
        throw new Error("Só administradores podem redefinir a senha de outro operador.");
      }

      const senhaTemporaria = gerarSenhaTemporaria();
      const { error: erroSenha } = await admin.auth.admin.updateUserById(operadorId, {
        password: senhaTemporaria,
      });
      if (erroSenha) throw erroSenha;

      const { error: erroFlag } = await admin
        .from("operadores")
        .update({ deve_trocar_senha: true })
        .eq("id", operadorId);
      if (erroFlag) throw erroFlag;

      return new Response(JSON.stringify({ senhaTemporaria }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("Ação inválida.");
  } catch (err) {
    const mensagem = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: mensagem }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
