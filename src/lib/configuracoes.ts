import { supabase } from "./supabase";
import { CARTOES_INICIO_PADRAO } from "@/types/configuracao";
import type {
  CartaoMetrica,
  ConfiguracaoFiscalLoja,
  ConfiguracaoGarantia,
  ConfiguracaoPainelInicio,
  JurosParcela,
} from "@/types/configuracao";

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

export async function buscarConfiguracaoFiscal(): Promise<ConfiguracaoFiscalLoja | null> {
  const { data, error } = await supabase
    .from("configuracoes_fiscais_loja")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error) throw error;
  return data as ConfiguracaoFiscalLoja | null;
}

export async function buscarConfiguracaoPainelInicio(): Promise<CartaoMetrica[]> {
  const { data, error } = await supabase
    .from("configuracoes_painel_inicio")
    .select("cartoes")
    .eq("id", 1)
    .maybeSingle();

  if (error) throw error;
  return (data as ConfiguracaoPainelInicio | null)?.cartoes ?? CARTOES_INICIO_PADRAO;
}

export async function salvarConfiguracaoPainelInicio(
  cartoes: CartaoMetrica[],
): Promise<void> {
  const { error } = await supabase
    .from("configuracoes_painel_inicio")
    .upsert({ id: 1, cartoes }, { onConflict: "id" });

  if (error) throw error;
}

export async function salvarConfiguracaoFiscal(
  config: Omit<ConfiguracaoFiscalLoja, "id" | "atualizado_em">,
): Promise<void> {
  const { error } = await supabase
    .from("configuracoes_fiscais_loja")
    .upsert({ id: 1, ...config, atualizado_em: new Date().toISOString() }, { onConflict: "id" });

  if (error) throw error;
}
