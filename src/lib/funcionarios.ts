import { supabase } from "./supabase";
import type { Funcionario, NovoFuncionario } from "@/types/funcionario";

const SELECT_FUNCIONARIO = "*, operador:operadores(usuario)";

export async function listarFuncionarios(): Promise<Funcionario[]> {
  const { data, error } = await supabase
    .from("funcionarios")
    .select(SELECT_FUNCIONARIO)
    .order("nome", { ascending: true });

  if (error) throw error;
  return data as unknown as Funcionario[];
}

export async function criarFuncionario(funcionario: NovoFuncionario): Promise<Funcionario> {
  const { data, error } = await supabase
    .from("funcionarios")
    .insert(funcionario)
    .select()
    .single();

  if (error) throw error;
  return data as Funcionario;
}

export async function atualizarFuncionario(
  id: string,
  patch: Partial<Pick<Funcionario, "nome" | "cargo" | "ativo">>,
): Promise<void> {
  const { error } = await supabase.from("funcionarios").update(patch).eq("id", id);
  if (error) throw error;
}
