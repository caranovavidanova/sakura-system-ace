import { baixarArquivoFocusNfe, cancelarNFCe, cancelarNFSe, FocusNfeError } from "./focusNfe";
import { supabase } from "./supabase";
import { criarZip, type ArquivoParaZip } from "./zip";
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

// Notas ligadas a um conjunto de OS — usada pra saber, sem uma consulta por
// linha da lista, quais notas cada OS já tem (ver schemas/situacaoFiscal.ts).
export async function listarArquivosDasOrdens(
  ordemIds: string[],
): Promise<NotaFiscalArquivo[]> {
  if (ordemIds.length === 0) return [];

  const { data, error } = await supabase
    .from("notas_fiscais_arquivos")
    .select("*")
    .in("ordem_servico_id", ordemIds);

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
    focus_nfe_ref: resposta.ref ?? null,
  });
  if (erroMetadados) {
    await supabase.storage.from("notas-fiscais").remove([caminho]);
    throw erroMetadados;
  }
}

// Cancela uma nota emitida automaticamente pelo Sakura System (origem =
// "automatica") direto na Focus NFe, e atualiza o status guardado aqui.
// Precisa do `focus_nfe_ref` gravado na emissão (ver salvarArquivoEmitido) —
// notas enviadas manualmente (upload de XML) não têm esse dado e não têm
// como ser canceladas por aqui (cancelar/substituir é feito por fora, com
// quem emitiu a nota de verdade).
export async function cancelarArquivoEmitido(
  arquivo: NotaFiscalArquivo,
  justificativa: string,
  token: string,
  ambiente: AmbienteFocusNfe,
): Promise<void> {
  if (arquivo.origem !== "automatica" || !arquivo.focus_nfe_ref) {
    throw new FocusNfeError(
      "Essa nota não foi emitida automaticamente pelo Sakura System — cancele direto onde ela " +
        "foi emitida.",
    );
  }

  const resposta =
    arquivo.tipo === "nfe"
      ? await cancelarNFCe(arquivo.focus_nfe_ref, justificativa, token, ambiente)
      : await cancelarNFSe(arquivo.focus_nfe_ref, justificativa, token, ambiente);

  // A Focus NFe pode responder HTTP 200 com um cancelamento recusado pela
  // SEFAZ/prefeitura (ex: prazo de cancelamento vencido) — mesmo cuidado já
  // tomado na emissão (EmitirNotaFiscalModal.tsx): só considerar sucesso de
  // verdade quando o status vier "cancelado".
  if (resposta.status !== "cancelado") {
    const mensagensErros = (resposta.erros ?? [])
      .map((e) => (e.campo ? `${e.campo}: ${e.mensagem}` : e.mensagem))
      .filter((m): m is string => Boolean(m))
      .join(" | ");
    throw new FocusNfeError(
      resposta.mensagem_sefaz ??
        (mensagensErros || undefined) ??
        resposta.mensagem ??
        `O cancelamento voltou com status "${resposta.status}".`,
    );
  }

  const { error } = await supabase
    .from("notas_fiscais_arquivos")
    .update({ status: resposta.status })
    .eq("id", arquivo.id);
  if (error) throw error;
}

export async function buscarConteudoArquivo(arquivo: NotaFiscalArquivo): Promise<string> {
  const { data, error } = await supabase.storage
    .from("notas-fiscais")
    .download(arquivo.storage_path);
  if (error) throw error;
  return data.text();
}

function salvarComoDownload(conteudo: Blob, nomeArquivo: string): void {
  const url = URL.createObjectURL(conteudo);
  const link = document.createElement("a");
  link.href = url;
  link.download = nomeArquivo;
  link.click();
  URL.revokeObjectURL(url);
}

export async function baixarArquivo(arquivo: NotaFiscalArquivo): Promise<void> {
  const { data, error } = await supabase.storage
    .from("notas-fiscais")
    .download(arquivo.storage_path);
  if (error) throw error;

  salvarComoDownload(data, arquivo.nome_arquivo);
}

// Baixa de uma vez todos os XMLs de um mês, num .zip só — é o formato que a
// contabilidade costuma pedir, e evita clicar "Baixar XML" nota por nota.
export async function baixarZipDoMes(
  arquivos: NotaFiscalArquivo[],
  nomeZip: string,
): Promise<void> {
  if (arquivos.length === 0) return;

  // Em lotes, não todos de uma vez: um mês cheio pode ter dezenas de notas, e
  // disparar todas as requisições juntas costuma acabar em erro de limite.
  const TAMANHO_DO_LOTE = 5;
  const conteudos: ArquivoParaZip[] = [];

  for (let inicio = 0; inicio < arquivos.length; inicio += TAMANHO_DO_LOTE) {
    const lote = arquivos.slice(inicio, inicio + TAMANHO_DO_LOTE);
    const baixados = await Promise.all(
      lote.map(async (arquivo) => {
        const { data, error } = await supabase.storage
          .from("notas-fiscais")
          .download(arquivo.storage_path);
        if (error) throw error;
        return {
          nome: arquivo.nome_arquivo,
          conteudo: new Uint8Array(await data.arrayBuffer()),
        };
      }),
    );
    conteudos.push(...baixados);
  }

  salvarComoDownload(criarZip(conteudos), nomeZip);
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
