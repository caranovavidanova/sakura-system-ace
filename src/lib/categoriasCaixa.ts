import { supabase } from "./supabase";
import type { CategoriaCaixa, NovaCategoriaCaixa } from "@/types/categoriaCaixa";

export async function listarCategoriasCaixa(): Promise<CategoriaCaixa[]> {
  const { data, error } = await supabase
    .from("categorias_caixa")
    .select("*")
    .order("nome", { ascending: true });

  if (error) throw error;
  return data as CategoriaCaixa[];
}

export async function criarCategoriaCaixa(
  categoria: NovaCategoriaCaixa,
): Promise<CategoriaCaixa> {
  const { data, error } = await supabase
    .from("categorias_caixa")
    .insert(categoria)
    .select()
    .single();

  if (error) throw error;
  return data as CategoriaCaixa;
}

export async function excluirCategoriaCaixa(id: string): Promise<void> {
  const { error } = await supabase.from("categorias_caixa").delete().eq("id", id);
  if (error) throw error;
}
