import { supabase } from "./supabase";
import type { MovimentoEstoque, NovoMovimentoEstoque } from "@/types/estoque";

export async function listarMovimentos(lojaId: string): Promise<MovimentoEstoque[]> {
  const { data, error } = await supabase
    .from("estoque_movimentos")
    .select("*")
    .eq("loja_id", lojaId)
    .order("criado_em", { ascending: false });

  if (error) throw error;
  return data as MovimentoEstoque[];
}

export async function criarMovimento(
  movimento: NovoMovimentoEstoque,
  lojaId: string,
): Promise<MovimentoEstoque> {
  const { data, error } = await supabase
    .from("estoque_movimentos")
    .insert({ ...movimento, loja_id: lojaId })
    .select()
    .single();

  if (error) throw error;
  return data as MovimentoEstoque;
}

export function calcularSaldoPorPeca(
  movimentos: MovimentoEstoque[],
): Map<string, number> {
  const saldos = new Map<string, number>();
  for (const movimento of movimentos) {
    const atual = saldos.get(movimento.peca_id) ?? 0;
    const delta =
      movimento.tipo === "entrada" ? movimento.quantidade : -movimento.quantidade;
    saldos.set(movimento.peca_id, atual + delta);
  }
  return saldos;
}
