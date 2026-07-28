import { supabase } from "./supabase";
import type { Operador } from "@/types/operador";

const DOMINIO_INTERNO = "sakura.local";

export function emailInterno(usuario: string): string {
  return `${usuario.trim().toLowerCase()}@${DOMINIO_INTERNO}`;
}

export async function entrar(usuario: string, senha: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({
    email: emailInterno(usuario),
    password: senha,
  });
  if (error) throw error;
}

export async function sair(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function buscarOperadorAtual(
  userId: string,
): Promise<Operador | null> {
  const { data, error } = await supabase
    .from("operadores")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return data as Operador | null;
}
