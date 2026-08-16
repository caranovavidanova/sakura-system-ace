import { supabase } from "./supabase";
import type { CotacaoPeca, NovaCotacaoPeca } from "@/types/cotacaoPeca";

export async function listarCotacoesPorPeca(pecaId: string): Promise<CotacaoPeca[]> {
  const { data, error } = await supabase
    .from("cotacoes_pecas")
    .select("*, fornecedor:fornecedores(nome)")
    .eq("peca_id", pecaId)
    .order("criado_em", { ascending: false });

  if (error) throw error;
  return data as unknown as CotacaoPeca[];
}

export async function registrarCotacoes(cotacoes: NovaCotacaoPeca[]): Promise<void> {
  if (cotacoes.length === 0) return;
  const { error } = await supabase.from("cotacoes_pecas").insert(cotacoes);
  if (error) throw error;
}

// Reduz o histórico completo à cotação mais recente de cada fornecedor,
// ordenada da mais barata pra mais cara — é isso que aparece no Pedido de
// Compra pra comparar antes de decidir onde comprar.
export function melhorCotacaoPorFornecedor(cotacoes: CotacaoPeca[]): CotacaoPeca[] {
  const maisRecentePorFornecedor = new Map<string, CotacaoPeca>();
  for (const cotacao of cotacoes) {
    const existente = maisRecentePorFornecedor.get(cotacao.fornecedor_id);
    if (!existente || new Date(cotacao.criado_em) > new Date(existente.criado_em)) {
      maisRecentePorFornecedor.set(cotacao.fornecedor_id, cotacao);
    }
  }
  return Array.from(maisRecentePorFornecedor.values()).sort((a, b) => a.preco - b.preco);
}
