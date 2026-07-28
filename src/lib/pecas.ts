import { supabase } from "./supabase";
import type { NovaPeca, Peca } from "@/types/peca";

export async function listarPecas(): Promise<Peca[]> {
  const { data, error } = await supabase
    .from("pecas")
    .select("*")
    .order("descricao", { ascending: true });

  if (error) throw error;
  return data as Peca[];
}

export async function criarPeca(peca: NovaPeca): Promise<Peca> {
  const { data, error } = await supabase
    .from("pecas")
    .insert(peca)
    .select()
    .single();

  if (error) throw error;
  return data as Peca;
}

export async function excluirPeca(id: string): Promise<void> {
  const { error } = await supabase.from("pecas").delete().eq("id", id);
  if (error) throw error;
}
