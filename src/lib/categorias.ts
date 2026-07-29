import { supabase } from "./supabase";
import type { Categoria, NovaCategoria } from "@/types/categoria";

export async function listarCategorias(): Promise<Categoria[]> {
  const { data, error } = await supabase
    .from("categorias")
    .select("*")
    .order("nome", { ascending: true });

  if (error) throw error;
  return data as Categoria[];
}

export async function criarCategoria(categoria: NovaCategoria): Promise<Categoria> {
  const { data, error } = await supabase
    .from("categorias")
    .insert(categoria)
    .select()
    .single();

  if (error) throw error;
  return data as Categoria;
}

export async function excluirCategoria(id: string): Promise<void> {
  const { error } = await supabase.from("categorias").delete().eq("id", id);
  if (error) throw error;
}
