import { FunctionsHttpError } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import type { ItemNotaFiscalExtraido } from "@/types/itemNotaFiscal";

interface ArquivoNota {
  base64: string;
  mediaType: string;
}

// A API do Claude só aceita esses 4 media types de imagem (mais
// "application/pdf" pra documento) — qualquer outro valor que o navegador
// reporte (ex: "image/pjpeg" de um .jfif no Windows, ou string vazia)
// precisa cair pro "image/jpeg" antes de mandar, senão a leitura falha.
const TIPOS_IMAGEM_ACEITOS = ["image/jpeg", "image/png", "image/gif", "image/webp"];

// Converte um File (foto ou PDF escolhido pelo operador) pro par
// base64/mediaType que a Edge Function espera — sem o prefixo
// "data:.../...;base64," do FileReader, só o conteúdo puro.
export function arquivoParaConteudoNota(arquivo: File): Promise<ArquivoNota> {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onload = () => {
      const resultado = leitor.result as string;
      const base64 = resultado.split(",")[1] ?? "";
      const tipo = arquivo.type;
      const mediaType =
        tipo === "application/pdf" || TIPOS_IMAGEM_ACEITOS.includes(tipo)
          ? tipo
          : "image/jpeg";
      resolve({ base64, mediaType });
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

  if (error) {
    // O erro padrão do supabase-js pra uma função que respondeu com status
    // de erro é só "Edge Function returned a non-2xx status code" — a
    // mensagem de verdade (ex: chave da IA não configurada, recusa do
    // Claude, erro de leitura) vai no corpo da resposta, que o cliente não
    // lê sozinho. Busca esse corpo antes de desistir e mostrar só o genérico.
    if (error instanceof FunctionsHttpError) {
      const corpo = await error.context.json().catch(() => null);
      if (corpo?.error) throw new Error(corpo.error);
    }
    throw error;
  }
  if (data?.error) throw new Error(data.error);
  return (data?.itens ?? []) as ItemNotaFiscalExtraido[];
}
