import { supabase } from "./supabase";
import type { NovoServico, Servico } from "@/types/servico";

export async function listarServicos(): Promise<Servico[]> {
  const { data, error } = await supabase
    .from("servicos")
    .select("*")
    .order("descricao", { ascending: true });

  if (error) throw error;
  return data as Servico[];
}

export async function criarServico(servico: NovoServico): Promise<Servico> {
  const { data, error } = await supabase
    .from("servicos")
    .insert(servico)
    .select()
    .single();

  if (error) throw error;
  return data as Servico;
}

export async function atualizarServico(id: string, servico: NovoServico): Promise<void> {
  const { error } = await supabase.from("servicos").update(servico).eq("id", id);
  if (error) throw error;
}

export async function excluirServico(id: string): Promise<void> {
  const { error } = await supabase.from("servicos").delete().eq("id", id);
  if (error) throw error;
}

export async function atualizarStatusServico(id: string, ativo: boolean): Promise<void> {
  const { error } = await supabase.from("servicos").update({ ativo }).eq("id", id);
  if (error) throw error;
}
