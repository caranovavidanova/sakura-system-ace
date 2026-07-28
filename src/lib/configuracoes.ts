import { supabase } from "./supabase";
import type { JurosParcela } from "@/types/configuracao";

export async function listarJurosParcelas(): Promise<JurosParcela[]> {
  const { data, error } = await supabase
    .from("configuracoes_juros_parcelas")
    .select("*")
    .order("numero_parcelas", { ascending: true });

  if (error) throw error;
  return data as JurosParcela[];
}

export async function salvarJurosParcelas(lista: JurosParcela[]): Promise<void> {
  const { error } = await supabase
    .from("configuracoes_juros_parcelas")
    .upsert(lista, { onConflict: "numero_parcelas" });

  if (error) throw error;
}
