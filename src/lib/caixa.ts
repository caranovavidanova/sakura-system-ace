import { supabase } from "./supabase";
import type { MovimentoCaixa, NovoMovimentoCaixa } from "@/types/caixa";

export async function listarMovimentosCaixa(): Promise<MovimentoCaixa[]> {
  const { data, error } = await supabase
    .from("caixa_movimentos")
    .select("*")
    .order("data", { ascending: false });

  if (error) throw error;
  return data as MovimentoCaixa[];
}

export async function criarMovimentoCaixa(
  movimento: NovoMovimentoCaixa,
): Promise<MovimentoCaixa> {
  const { data, error } = await supabase
    .from("caixa_movimentos")
    .insert(movimento)
    .select()
    .single();

  if (error) throw error;
  return data as MovimentoCaixa;
}
