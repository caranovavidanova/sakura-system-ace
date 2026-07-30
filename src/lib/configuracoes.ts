import { supabase } from "./supabase";
import { CARTOES_INICIO_PADRAO } from "@/types/configuracao";
import type {
  CartaoMetrica,
  ConfiguracaoFiscalLoja,
  ConfiguracaoGarantia,
  ConfiguracaoPainelInicio,
  JurosParcela,
} from "@/types/configuracao";

export async function listarJurosParcelas(lojaId: string): Promise<JurosParcela[]> {
  const { data, error } = await supabase
    .from("configuracoes_juros_parcelas")
    .select("*")
    .eq("loja_id", lojaId)
    .order("numero_parcelas", { ascending: true });

  if (error) throw error;
  return data as JurosParcela[];
}

export async function salvarJurosParcelas(
  lojaId: string,
  lista: Omit<JurosParcela, "loja_id">[],
): Promise<void> {
  const { error } = await supabase
    .from("configuracoes_juros_parcelas")
    .upsert(
      lista.map((item) => ({ ...item, loja_id: lojaId })),
      { onConflict: "loja_id,numero_parcelas" },
    );

  if (error) throw error;
}

export async function buscarTextoGarantia(lojaId: string): Promise<string> {
  const { data, error } = await supabase
    .from("configuracoes_garantia")
    .select("texto")
    .eq("loja_id", lojaId)
    .maybeSingle();

  if (error) throw error;
  return (data as ConfiguracaoGarantia | null)?.texto ?? "";
}

export async function salvarTextoGarantia(lojaId: string, texto: string): Promise<void> {
  const { error } = await supabase
    .from("configuracoes_garantia")
    .upsert({ loja_id: lojaId, texto }, { onConflict: "loja_id" });

  if (error) throw error;
}

export async function buscarConfiguracaoFiscal(
  lojaId: string,
): Promise<ConfiguracaoFiscalLoja | null> {
  const { data, error } = await supabase
    .from("configuracoes_fiscais_loja")
    .select("*")
    .eq("loja_id", lojaId)
    .maybeSingle();

  if (error) throw error;
  return data as ConfiguracaoFiscalLoja | null;
}

export async function buscarConfiguracaoPainelInicio(
  lojaId: string,
): Promise<CartaoMetrica[]> {
  const { data, error } = await supabase
    .from("configuracoes_painel_inicio")
    .select("cartoes")
    .eq("loja_id", lojaId)
    .maybeSingle();

  if (error) throw error;
  return (data as ConfiguracaoPainelInicio | null)?.cartoes ?? CARTOES_INICIO_PADRAO;
}

export async function salvarConfiguracaoPainelInicio(
  lojaId: string,
  cartoes: CartaoMetrica[],
): Promise<void> {
  const { error } = await supabase
    .from("configuracoes_painel_inicio")
    .upsert({ loja_id: lojaId, cartoes }, { onConflict: "loja_id" });

  if (error) throw error;
}

export async function salvarConfiguracaoFiscal(
  lojaId: string,
  config: Omit<ConfiguracaoFiscalLoja, "loja_id" | "atualizado_em">,
): Promise<void> {
  const { error } = await supabase.from("configuracoes_fiscais_loja").upsert(
    { loja_id: lojaId, ...config, atualizado_em: new Date().toISOString() },
    { onConflict: "loja_id" },
  );

  if (error) throw error;
}
