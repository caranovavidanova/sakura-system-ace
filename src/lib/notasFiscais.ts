import { baixarArquivoFocusNfe } from "./focusNfe";
import { supabase } from "./supabase";
import type { AmbienteFocusNfe } from "@/types/configuracao";
import type { RespostaFocusNfe } from "@/types/focusNfe";
import type { NotaFiscalArquivo, TipoNotaFiscal } from "@/types/notaFiscal";

const SELECT_ARQUIVO =
  "*, ordem_servico:ordens_servico(cliente:clientes(nome)), operador:operadores(nome)";

export async function listarArquivos(
  tipo: TipoNotaFiscal,
  lojaId: string,
): Promise<NotaFiscalArquivo[]> {
  const { data, error } = await supabase
    .from("notas_fiscais_arquivos")
    .select(SELECT_ARQUIVO)
    .eq("tipo", tipo)
    .eq("loja_id", lojaId)
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
  lojaId: string;
}

export async function enviarArquivo({
  tipo,
  competencia,
  arquivo,
  ordemServicoId,
  operadorId,
  lojaId,
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
    loja_id: lojaId,
  });
  if (erroMetadados) {
    await supabase.storage.from("notas-fiscais").remove([caminho]);
    throw erroMetadados;
  }
}

interface SalvarArquivoEmitidoParams {
  tipo: TipoNotaFiscal;
  resposta: RespostaFocusNfe;
  ordemServicoId: string;
  operadorId: string;
  lojaId: string;
  token: string;
  ambiente: AmbienteFocusNfe;
}

// Depois de uma emissão automática autorizada (via emitirNFCe/emitirNFSe),
// baixa o XML que a Focus NFe hospeda e grava no mesmo bucket/tabela das
// notas enviadas manualmente — origem="automatica" é o que diferencia uma da
// outra na listagem (ver NotasFiscaisPage.tsx).
export async function salvarArquivoEmitido({
  tipo,
  resposta,
  ordemServicoId,
  operadorId,
  lojaId,
  token,
  ambiente,
}: SalvarArquivoEmitidoParams): Promise<void> {
  if (!resposta.caminho_xml_nota_fiscal) {
    throw new Error(
      "A nota foi autorizada, mas a Focus NFe não devolveu o caminho do XML — não deu pra " +
        "guardar o arquivo. Consulte a nota direto no painel do Focus NFe.",
    );
  }

  const competencia = new Date().toISOString().slice(0, 10);
  const nomeArquivo = `${tipo}-${resposta.numero ?? resposta.ref ?? "sem-numero"}.xml`;
  const caminho = `${tipo}/${competencia.slice(0, 7)}/${crypto.randomUUID()}-${nomeArquivo}`;

  const xml = await baixarArquivoFocusNfe(resposta.caminho_xml_nota_fiscal, token, ambiente);
  const { error: erroUpload } = await supabase.storage
    .from("notas-fiscais")
    .upload(caminho, xml, { contentType: "application/xml" });
  if (erroUpload) throw erroUpload;

  const { error: erroMetadados } = await supabase.from("notas_fiscais_arquivos").insert({
    tipo,
    competencia,
    nome_arquivo: nomeArquivo,
    storage_path: caminho,
    ordem_servico_id: ordemServicoId,
    operador_id: operadorId,
    loja_id: lojaId,
    origem: "automatica",
    numero: resposta.numero ?? null,
    chave_acesso: resposta.chave_nfe ?? null,
    status: resposta.status,
  });
  if (erroMetadados) {
    await supabase.storage.from("notas-fiscais").remove([caminho]);
    throw erroMetadados;
  }
}

export async function buscarConteudoArquivo(arquivo: NotaFiscalArquivo): Promise<string> {
  const { data, error } = await supabase.storage
    .from("notas-fiscais")
    .download(arquivo.storage_path);
  if (error) throw error;
  return data.text();
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
