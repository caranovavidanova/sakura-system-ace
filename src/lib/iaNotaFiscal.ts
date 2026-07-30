import { supabase } from "./supabase";
import type { ItemNotaFiscalExtraido } from "@/types/itemNotaFiscal";

interface ArquivoNota {
  base64: string;
  mediaType: string;
}

// Converte um File (foto ou PDF escolhido pelo operador) pro par
// base64/mediaType que a Edge Function espera — sem o prefixo
// "data:.../...;base64," do FileReader, só o conteúdo puro.
export function arquivoParaConteudoNota(arquivo: File): Promise<ArquivoNota> {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onload = () => {
      const resultado = leitor.result as string;
      const base64 = resultado.split(",")[1] ?? "";
      resolve({ base64, mediaType: arquivo.type || "image/jpeg" });
    };
    leitor.onerror = () => reject(leitor.error);
    leitor.readAsDataURL(arquivo);
  });
}

// Chama a Edge Function "ler-notas-fiscais" — a chave da Anthropic fica só
// lá no Supabase (secret), nunca no app instalado. Aceita várias fotos e/ou
// PDFs numa leitura só (várias notas, ou uma nota com vários itens).
export async function lerNotasFiscais(
  arquivos: File[],
): Promise<ItemNotaFiscalExtraido[]> {
  const conteudos = await Promise.all(arquivos.map(arquivoParaConteudoNota));

  const { data, error } = await supabase.functions.invoke("ler-notas-fiscais", {
    body: { arquivos: conteudos },
  });

  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return (data?.itens ?? []) as ItemNotaFiscalExtraido[];
}
