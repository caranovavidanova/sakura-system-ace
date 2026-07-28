import { createClient } from "@supabase/supabase-js";
import { emailInterno } from "./auth";
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
}

export async function atualizarOperador(
  id: string,
  patch: Partial<Pick<Operador, "nome" | "admin" | "permissoes" | "ativo">>,
): Promise<void> {
  const { error } = await supabase.from("operadores").update(patch).eq("id", id);
  if (error) throw error;
}
