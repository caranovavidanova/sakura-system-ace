import { supabase } from "./supabase";
import type { ConfiguracaoGarantia, JurosParcela } from "@/types/configuracao";

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

export async function buscarTextoGarantia(): Promise<string> {
  const { data, error } = await supabase
    .from("configuracoes_garantia")
    .select("texto")
    .eq("id", 1)
    .maybeSingle();

  if (error) throw error;
  return (data as ConfiguracaoGarantia | null)?.texto ?? "";
}

export async function salvarTextoGarantia(texto: string): Promise<void> {
  const { error } = await supabase
    .from("configuracoes_garantia")
    .upsert({ id: 1, texto }, { onConflict: "id" });

  if (error) throw error;
}
