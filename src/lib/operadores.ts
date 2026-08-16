import { createClient } from "@supabase/supabase-js";
import { emailInterno } from "./auth";
import { definirLojasDoOperador } from "./lojas";
import { supabase } from "./supabase";
import type { NovoOperador, Operador } from "@/types/operador";

export async function listarOperadores(): Promise<Operador[]> {
  const { data, error } = await supabase
    .from("operadores")
    .select("*")
    .order("nome", { ascending: true });

  if (error) throw error;
  return data as Operador[];
}

export async function criarOperador(
  operador: NovoOperador,
  senha: string,
  lojaIds: string[],
): Promise<void> {
  // Um client isolado (sem persistir sessão) evita que criar um operador novo
  // troque a sessão de quem está logado agora (o supabase-js loga
  // automaticamente como o usuário recém-criado ao chamar signUp).
  const clienteTemporario = createClient(
    import.meta.env.VITE_SUPABASE_URL || "https://placeholder.supabase.co",
    import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder-anon-key",
    { auth: { persistSession: false, autoRefreshToken: false } },
  );

  const { data, error } = await clienteTemporario.auth.signUp({
    email: emailInterno(operador.usuario),
    password: senha,
  });
  if (error) throw error;
  if (!data.user) throw new Error("Não foi possível criar o login do operador.");

  const { error: erroPerfil } = await supabase.from("operadores").insert({
    id: data.user.id,
    usuario: operador.usuario,
    nome: operador.nome,
    admin: operador.admin,
    permissoes: operador.permissoes,
    ativo: operador.ativo,
  });
  if (erroPerfil) throw erroPerfil;

  if (lojaIds.length > 0) {
    await definirLojasDoOperador(data.user.id, lojaIds);

    // O gatilho que espelha o operador em `funcionarios` (migration 0019)
    // roda no INSERT acima, antes de operador_lojas existir — por isso ainda
    // não sabe a loja. Preenche agora que já temos o vínculo.
    const { error: erroFuncionario } = await supabase
      .from("funcionarios")
      .update({ loja_id: lojaIds[0] })
      .eq("operador_id", data.user.id);
    if (erroFuncionario) throw erroFuncionario;
  }
}

export async function atualizarOperador(
  id: string,
  patch: Partial<Pick<Operador, "nome" | "admin" | "permissoes" | "ativo">>,
): Promise<void> {
  const { error } = await supabase.from("operadores").update(patch).eq("id", id);
  if (error) throw error;
}

// Redefine a senha de um operador esquecida — só quem é admin de uma loja
// que esse operador também acessa consegue (checado dentro da Edge Function,
// que é quem de fato troca a senha via service role key).
export async function redefinirSenhaOperador(
  operadorAlvoId: string,
  novaSenha: string,
): Promise<void> {
  const { data, error } = await supabase.functions.invoke("redefinir-senha-operador", {
    body: { operadorAlvoId, novaSenha },
  });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
}
