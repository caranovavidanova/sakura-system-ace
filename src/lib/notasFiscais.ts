import { supabase } from "./supabase";
import type { NotaFiscalArquivo, TipoNotaFiscal } from "@/types/notaFiscal";

const SELECT_ARQUIVO =
  "*, ordem_servico:ordens_servico(cliente:clientes(nome)), operador:operadores(nome)";

export async function listarArquivos(tipo: TipoNotaFiscal): Promise<NotaFiscalArquivo[]> {
  const { data, error } = await supabase
    .from("notas_fiscais_arquivos")
    .select(SELECT_ARQUIVO)
    .eq("tipo", tipo)
    .order("competencia", { ascending: false })
    .order("criado_em", { ascending: false });

  if (error) throw error;
  return data as unknown as NotaFiscalArquivo[];
}

interface NovoEnvioArquivo {
  tipo: TipoNotaFiscal;
  competencia: string;
  arquivo: File;
  ordemServicoId: string | null;
  operadorId: string;
}

export async function enviarArquivo({
  tipo,
  competencia,
  arquivo,
  ordemServicoId,
  operadorId,
}: NovoEnvioArquivo): Promise<void> {
  const caminho = `${tipo}/${competencia.slice(0, 7)}/${crypto.randomUUID()}-${arquivo.name}`;

  const { error: erroUpload } = await supabase.storage
    .from("notas-fiscais")
    .upload(caminho, arquivo, { contentType: arquivo.type || "application/xml" });
  if (erroUpload) throw erroUpload;

  const { error: erroMetadados } = await supabase.from("notas_fiscais_arquivos").insert({
    tipo,
    competencia,
    nome_arquivo: arquivo.name,
    storage_path: caminho,
    ordem_servico_id: ordemServicoId,
    operador_id: operadorId,
  });
  if (erroMetadados) {
    await supabase.storage.from("notas-fiscais").remove([caminho]);
    throw erroMetadados;
  }
}

export async function baixarArquivo(arquivo: NotaFiscalArquivo): Promise<void> {
  const { data, error } = await supabase.storage
    .from("notas-fiscais")
    .download(arquivo.storage_path);
  if (error) throw error;

  const url = URL.createObjectURL(data);
  const link = document.createElement("a");
  link.href = url;
  link.download = arquivo.nome_arquivo;
  link.click();
  URL.revokeObjectURL(url);
}

export async function excluirArquivo(arquivo: NotaFiscalArquivo): Promise<void> {
  const { error: erroStorage } = await supabase.storage
    .from("notas-fiscais")
    .remove([arquivo.storage_path]);
  if (erroStorage) throw erroStorage;

  const { error: erroMetadados } = await supabase
    .from("notas_fiscais_arquivos")
    .delete()
    .eq("id", arquivo.id);
  if (erroMetadados) throw erroMetadados;
}
