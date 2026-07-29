import { supabase } from "./supabase";
import type { ItemNotaFiscalExtraido } from "@/types/itemNotaFiscal";

interface ImagemNota {
  base64: string;
  mediaType: string;
}

// Converte um File (foto escolhida pelo operador) pro par base64/mediaType
// que a Edge Function espera — sem o prefixo "data:image/...;base64," do
// FileReader, só o conteúdo puro.
export function arquivoParaImagemNota(arquivo: File): Promise<ImagemNota> {
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
// lá no Supabase (secret), nunca no app instalado. Aceita várias fotos numa
// leitura só (várias notas, ou uma nota com vários itens).
export async function lerNotasFiscais(
  arquivos: File[],
): Promise<ItemNotaFiscalExtraido[]> {
  const imagens = await Promise.all(arquivos.map(arquivoParaImagemNota));

  const { data, error } = await supabase.functions.invoke("ler-notas-fiscais", {
    body: { imagens },
  });

  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return (data?.itens ?? []) as ItemNotaFiscalExtraido[];
}
