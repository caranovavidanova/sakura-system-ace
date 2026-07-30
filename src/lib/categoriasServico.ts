import { supabase } from "./supabase";
import type { CategoriaServico, NovaCategoriaServico } from "@/types/categoriaServico";

export async function listarCategoriasServico(): Promise<CategoriaServico[]> {
  const { data, error } = await supabase
    .from("categorias_servicos")
    .select("*")
    .order("nome", { ascending: true });

  if (error) throw error;
  return data as CategoriaServico[];
}

export async function criarCategoriaServico(
  categoria: NovaCategoriaServico,
): Promise<CategoriaServico> {
  const { data, error } = await supabase
    .from("categorias_servicos")
    .insert(categoria)
    .select()
    .single();

  if (error) throw error;
  return data as CategoriaServico;
}

export async function excluirCategoriaServico(id: string): Promise<void> {
  const { error } = await supabase.from("categorias_servicos").delete().eq("id", id);
  if (error) throw error;
}
