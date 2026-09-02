import { hojeLocal } from "./datas";
import type { AmbienteFocusNfe, ConfiguracaoFiscalLoja } from "@/types/configuracao";
import type { Cliente } from "@/types/cliente";
import type {
  FormaPagamentoNFCe,
  ItemNFCe,
  NFCeCorpo,
  NFSeCorpo,
  RespostaFocusNfe,
} from "@/types/focusNfe";
import type { OrdemServico } from "@/types/os";
import type { Peca } from "@/types/peca";

// Sakura System — AutoCenter Edition
// Cliente HTTP para a API do Focus NFe (https://focusnfe.com.br). Formato de
// requisição confirmado contra os exemplos oficiais do repositório
// github.com/FocusNFe/javascript (pasta NFCe/v2 e NFSe/v2) — ver
// PROJETO_STATUS.md seção 8, item 1, pro que ainda precisa ser validado com
// uma emissão de teste real (o formato da resposta da NFS-e, em especial,
// ainda não foi confirmado — só o da NFC-e).

const BASE_URL_POR_AMBIENTE: Record<AmbienteFocusNfe, string> = {
  homologacao: "https://homologacao.focusnfe.com.br",
  producao: "https://api.focusnfe.com.br",
};

export class FocusNfeError extends Error {
  constructor(
    message: string,
    public status?: number,
    public corpo?: unknown,
  ) {
    super(message);
    this.name = "FocusNfeError";
  }
}

// A API do Focus NFe é feita pra ser chamada de servidor pra servidor, sem
// CORS liberado — um fetch() direto na tela do app (Chromium/renderer) é
// bloqueado sempre com "Failed to fetch", antes mesmo de qualquer resposta
// chegar. Por isso a chamada de verdade acontece no processo principal do
// Electron (Node.js, sem essa restrição), repassada aqui via IPC — ver o
// handler "http:fetchComAuth" em electron/main.ts.
function requererPonteElectron(): NonNullable<Window["sakuraApp"]> {
  if (typeof window === "undefined" || !window.sakuraApp) {
    throw new FocusNfeError(
      "Emissão de nota fiscal só funciona dentro do aplicativo Sakura System instalado — não " +
        "funciona rodando fora do Electron.",
    );
  }
  return window.sakuraApp;
}

interface ChamarFocusNfeOpcoes {
  metodo: "GET" | "POST" | "PUT" | "DELETE";
  caminho: string;
  token: string;
  ambiente: AmbienteFocusNfe;
  corpo?: unknown;
}

export async function chamarFocusNfe<T>({
  metodo,
  caminho,
  token,
  ambiente,
  corpo,
}: ChamarFocusNfeOpcoes): Promise<T> {
  const url = `${BASE_URL_POR_AMBIENTE[ambiente]}${caminho}`;

  const resposta = await requererPonteElectron().fetchComAuth({ url, metodo, token, corpo });

  let dados: unknown = null;
  try {
    dados = JSON.parse(new TextDecoder("utf-8").decode(resposta.bytes));
  } catch {
    dados = null;
  }

  if (!resposta.ok) {
    throw new FocusNfeError(
      (dados as { mensagem?: string } | null)?.mensagem ??
        `Focus NFe retornou erro ${resposta.status}`,
      resposta.status,
      dados,
    );
  }

  return dados as T;
}

// Baixa um arquivo hospedado pela própria Focus NFe (XML ou DANFE, pelos
// caminhos que vêm em RespostaFocusNfe.caminho_xml_nota_fiscal/caminho_danfe)
// — mesma ponte via IPC das outras chamadas.
export async function baixarArquivoFocusNfe(
  caminho: string,
  token: string,
  ambiente: AmbienteFocusNfe,
): Promise<Blob> {
  const url = caminho.startsWith("http") ? caminho : `${BASE_URL_POR_AMBIENTE[ambiente]}${caminho}`;
  const resposta = await requererPonteElectron().fetchComAuth({ url, metodo: "GET", token });
  if (!resposta.ok) {
    throw new FocusNfeError(
      `Não foi possível baixar o arquivo da nota (HTTP ${resposta.status})`,
      resposta.status,
    );
  }
  return new Blob([resposta.bytes] as BlobPart[], {
    type: resposta.contentType || "application/octet-stream",
  });
}

function aguardar(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// A emissão é assíncrona do lado da Focus NFe/SEFAZ — o POST inicial quase
// sempre volta com status "processando_autorizacao", e é preciso consultar
// de novo até sair desse estado. Tenta por até ~30s antes de desistir (a
// nota continua processando do lado deles; dá pra consultar de novo depois).
async function aguardarAutorizacao(
  consultar: () => Promise<RespostaFocusNfe>,
): Promise<RespostaFocusNfe> {
  const tentativas = 10;
  const intervaloMs = 3000;
  for (let i = 0; i < tentativas; i++) {
    const resposta = await consultar();
    if (resposta.status !== "processando_autorizacao") return resposta;
    await aguardar(intervaloMs);
  }
  throw new FocusNfeError(
    "A SEFAZ está demorando mais que o normal pra responder — a nota continua sendo " +
      "processada. Consulte de novo em alguns instantes antes de tentar emitir outra vez.",
  );
}

// Tabela de formas de pagamento do layout da NFe/NFC-e (SEFAZ) — mapeia as
// chaves já usadas em ordens_servico/caixa_movimentos (ver
// types/os.ts → FORMA_PAGAMENTO_LABEL) pro código que a nota fiscal exige.
const CODIGO_FORMA_PAGAMENTO_SEFAZ: Record<string, string> = {
  dinheiro: "01",
  cartao_credito: "03",
  cartao_debito: "04",
  pix: "17",
};

function codigoFormaPagamentoSefaz(formaPagamento: string): string {
  return CODIGO_FORMA_PAGAMENTO_SEFAZ[formaPagamento] ?? "99";
}

function formatarValor(valor: number): string {
  return valor.toFixed(2);
}

function arredondar(valor: number): number {
  return Math.round(valor * 100) / 100;
}

export interface ItemParaNFCe {
  peca: Peca;
  quantidade: number;
  precoUnitario: number;
  /** Desconto em reais dado naquela linha da OS (0 quando não houve). */
  desconto: number;
}

export interface PagamentoParaNota {
  formaPagamento: string;
  valor: number;
}

export interface DadosEmissaoNFCe {
  ordem: OrdemServico;
  itens: ItemParaNFCe[];
  cliente: Cliente | null;
  pagamentos: PagamentoParaNota[];
  configuracaoFiscal: ConfiguracaoFiscalLoja;
}

/**
 * O que a linha vale de verdade: quantidade × preço menos o desconto dado
 * nela. Fica numa função só porque o mesmo número é usado em três lugares
 * (o item, o total dos produtos e a base do ICMS) e antes cada um refazia a
 * conta — dois deles esquecendo o desconto.
 */
function valorLiquidoItem(item: ItemParaNFCe): number {
  return arredondar(item.quantidade * item.precoUnitario - item.desconto);
}

function montarItemNFCe(item: ItemParaNFCe, numeroItem: number): ItemNFCe {
  const { peca, quantidade } = item;
  const aliquota = peca.aliquota_icms ?? 0;

  // O desconto da linha entra abatido no preço unitário, e não como um campo
  // separado, porque a SEFAZ confere que "valor bruto = quantidade × preço
  // unitário" — mandar o bruto já com desconto sem mexer no unitário seria
  // recusado. Ignorar o desconto (como era antes) deixava a nota valendo
  // mais do que o cliente pagou: os pagamentos informados são rateados sobre
  // o total da OS, que **já** desconta, então a soma dos pagamentos ficava
  // menor que o total da nota e a SEFAZ rejeitava a emissão.
  const valorBruto = valorLiquidoItem(item);
  const precoUnitario = quantidade > 0 ? valorBruto / quantidade : 0;

  return {
    numero_item: String(numeroItem),
    codigo_ncm: peca.ncm ?? "",
    codigo_produto: peca.codigo_interno || peca.id,
    descricao: peca.descricao,
    quantidade_comercial: quantidade.toFixed(4),
    quantidade_tributavel: quantidade.toFixed(4),
    cfop: peca.cfop_padrao ?? "5102",
    valor_unitario_comercial: precoUnitario.toFixed(10),
    valor_unitario_tributavel: precoUnitario.toFixed(10),
    valor_bruto: formatarValor(valorBruto),
    unidade_comercial: peca.unidade || "UN",
    unidade_tributavel: peca.unidade || "UN",
    icms_origem: peca.origem ?? "0",
    icms_situacao_tributaria: peca.cst_ou_csosn ?? "",
    icms_aliquota: String(aliquota),
    // Simplificação: só calcula base de ICMS quando há alíquota (regime
    // normal); em Simples Nacional (CSOSN, sem destaque de ICMS na nota) a
    // alíquota fica zerada e a base também — ver PROJETO_STATUS.md.
    icms_base_calculo: aliquota > 0 ? formatarValor(valorBruto) : "0",
    icms_modalidade_base_calculo: "3",
    // Reforma Tributária (IBS/CBS) — período de transição 2026: CST "000"
    // (tributação integral) + cClassTrib "000001" (situação plenamente
    // tributada). As alíquotas de teste (0,9% CBS / 0,1% IBS-UF / 0% IBS-mun)
    // são fixadas por lei pra 2026 (Nota Técnica NFe 2025.002/LC 214/2025) —
    // símbolicas, compensadas com PIS/Cofins/ICMS/ISS já cobrados, sem
    // aumento real de imposto — mas a SEFAZ rejeita a nota se o valor não
    // bater exatamente com isso (rejeição 1026/1027/1036/1037). A
    // contabilidade da loja tinha orientado tudo zerado (ver
    // PROJETO_STATUS.md seção 8, item 1) — essa parte específica (o valor
    // exato da alíquota de teste) foi corrigida depois de uma rejeição real
    // da SEFAZ em homologação apontando exatamente pra isso.
    ibs_cbs_situacao_tributaria: "000",
    ibs_cbs_classificacao_tributaria: "000001",
    ibs_cbs_base_calculo: formatarValor(valorBruto),
    cbs_aliquota: "0.90",
    cbs_valor: formatarValor((valorBruto * 0.9) / 100),
    ibs_uf_aliquota: "0.10",
    ibs_uf_valor: formatarValor((valorBruto * 0.1) / 100),
    ibs_mun_aliquota: "0.00",
    ibs_mun_valor: "0.00",
    ibs_valor_total: formatarValor((valorBruto * 0.1) / 100),
  };
}

function montarRefNota(numeroOrdem: number, sufixo: string): string {
  return `os${numeroOrdem}-${sufixo}-${Date.now()}`;
}

export function montarCorpoNFCe({
  itens,
  cliente,
  pagamentos,
  configuracaoFiscal,
}: DadosEmissaoNFCe): NFCeCorpo {
  const valorProdutos = itens.reduce((soma, item) => soma + valorLiquidoItem(item), 0);
  const valorIcmsTotal = itens.reduce((soma, item) => {
    const aliquota = item.peca.aliquota_icms ?? 0;
    return aliquota > 0 ? soma + (valorLiquidoItem(item) * aliquota) / 100 : soma;
  }, 0);

  return {
    natureza_operacao: "VENDA AO CONSUMIDOR",
    data_emissao: new Date().toISOString(),
    tipo_documento: "1",
    presenca_comprador: "1",
    consumidor_final: "1",
    finalidade_emissao: "1",
    cnpj_emitente: (configuracaoFiscal.cnpj ?? "").replace(/\D/g, ""),
    nome_destinatario: cliente?.tipo_pessoa === "fisica" ? cliente.nome : "",
    cpf_destinatario:
      cliente?.tipo_pessoa === "fisica" ? (cliente.cpf_cnpj ?? "").replace(/\D/g, "") : "",
    valor_produtos: formatarValor(valorProdutos),
    valor_desconto: "0.00",
    valor_total: formatarValor(valorProdutos),
    // "0" = pagamento à vista, "1" = a prazo — venda de balcão à vista
    // sempre, o parcelamento (quando existe) é do cartão de crédito, não da
    // nota em si (ver formas_pagamento abaixo, que é quem carrega o meio de
    // pagamento de verdade).
    forma_pagamento: "0",
    icms_valor_total: formatarValor(valorIcmsTotal),
    modalidade_frete: "9",
    items: itens.map((item, indice) => montarItemNFCe(item, indice + 1)),
    formas_pagamento: pagamentos.map(
      (pagamento): FormaPagamentoNFCe => ({
        forma_pagamento: codigoFormaPagamentoSefaz(pagamento.formaPagamento),
        valor_pagamento: formatarValor(pagamento.valor),
      }),
    ),
  };
}

export async function emitirNFCe(dados: DadosEmissaoNFCe): Promise<RespostaFocusNfe> {
  const { configuracaoFiscal, ordem } = dados;
  if (!configuracaoFiscal.focus_nfe_token) {
    throw new FocusNfeError(
      "Token do Focus NFe não configurado — cadastre em Configurações → Dados fiscais da loja.",
    );
  }

  const ref = montarRefNota(ordem.numero, "nfce");
  const corpo = montarCorpoNFCe(dados);

  await chamarFocusNfe<RespostaFocusNfe>({
    metodo: "POST",
    caminho: `/v2/nfce?ref=${ref}`,
    token: configuracaoFiscal.focus_nfe_token,
    ambiente: configuracaoFiscal.focus_nfe_ambiente,
    corpo,
  });

  return aguardarAutorizacao(() =>
    consultarNFCe(ref, configuracaoFiscal.focus_nfe_token as string, configuracaoFiscal.focus_nfe_ambiente),
  );
}

export async function consultarNFCe(
  ref: string,
  token: string,
  ambiente: AmbienteFocusNfe,
): Promise<RespostaFocusNfe> {
  return chamarFocusNfe<RespostaFocusNfe>({
    metodo: "GET",
    caminho: `/v2/nfce/${ref}`,
    token,
    ambiente,
  });
}

export async function cancelarNFCe(
  ref: string,
  justificativa: string,
  token: string,
  ambiente: AmbienteFocusNfe,
): Promise<RespostaFocusNfe> {
  return chamarFocusNfe<RespostaFocusNfe>({
    metodo: "DELETE",
    caminho: `/v2/nfce/${ref}`,
    token,
    ambiente,
    corpo: { justificativa },
  });
}

export interface DadosEmissaoNFSe {
  ordem: OrdemServico;
  discriminacao: string;
  valorServicos: number;
  cliente: Cliente;
  // Código IBGE do município do cliente (tomador) — não tem campo próprio no
  // cadastro de Clientes hoje, então é pedido na hora da emissão (ver
  // EmitirNotaFiscalModal.tsx).
  codigoMunicipioCliente: string;
  configuracaoFiscal: ConfiguracaoFiscalLoja;
}

export function montarCorpoNFSe({
  discriminacao,
  valorServicos,
  cliente,
  codigoMunicipioCliente,
  configuracaoFiscal,
}: DadosEmissaoNFSe): NFSeCorpo {
  const cnpjOuCpf = (cliente.cpf_cnpj ?? "").replace(/\D/g, "");

  return {
    // Dia local — com toISOString() a nota emitida à noite sairia com a
    // data de amanhã. Ver lib/datas.ts.
    data_emissao: hojeLocal(),
    prestador: {
      cnpj: (configuracaoFiscal.cnpj ?? "").replace(/\D/g, ""),
      inscricao_municipal: configuracaoFiscal.inscricao_municipal ?? "",
      codigo_municipio: configuracaoFiscal.codigo_municipio ?? "",
    },
    tomador: {
      ...(cliente.tipo_pessoa === "juridica" ? { cnpj: cnpjOuCpf } : { cpf: cnpjOuCpf }),
      razao_social: cliente.nome,
      email: cliente.email ?? undefined,
      endereco:
        cliente.rua && cliente.cep
          ? {
              logradouro: cliente.rua,
              numero: cliente.numero ?? "S/N",
              bairro: cliente.bairro ?? "",
              codigo_municipio: codigoMunicipioCliente,
              uf: cliente.uf ?? "",
              cep: (cliente.cep ?? "").replace(/\D/g, ""),
            }
          : undefined,
    },
    servico: {
      aliquota: configuracaoFiscal.aliquota_iss ?? 0,
      discriminacao,
      iss_retido: "false",
      item_lista_servico: configuracaoFiscal.item_lista_servico || "14.01",
      codigo_tributario_municipio: configuracaoFiscal.codigo_tributario_municipio ?? undefined,
      codigo_cnae: (configuracaoFiscal.codigo_cnae ?? "").replace(/\D/g, ""),
      valor_servicos: valorServicos,
    },
  };
}

export async function emitirNFSe(dados: DadosEmissaoNFSe): Promise<RespostaFocusNfe> {
  const { configuracaoFiscal, ordem } = dados;
  if (!configuracaoFiscal.focus_nfe_token) {
    throw new FocusNfeError(
      "Token do Focus NFe não configurado — cadastre em Configurações → Dados fiscais da loja.",
    );
  }
  if (!configuracaoFiscal.codigo_municipio) {
    throw new FocusNfeError(
      "Código do município da loja não configurado — cadastre em Configurações → Dados " +
        "fiscais da loja, seção \"Emissão de NFS-e\".",
    );
  }
  if (!configuracaoFiscal.codigo_cnae) {
    throw new FocusNfeError(
      "Código CNAE da loja não configurado — cadastre em Configurações → Dados fiscais da " +
        "loja, seção \"Emissão de NFS-e\" (está no Cartão CNPJ da empresa).",
    );
  }

  const ref = montarRefNota(ordem.numero, "nfse");
  const corpo = montarCorpoNFSe(dados);

  await chamarFocusNfe<RespostaFocusNfe>({
    metodo: "POST",
    caminho: `/v2/nfse?ref=${ref}`,
    token: configuracaoFiscal.focus_nfe_token,
    ambiente: configuracaoFiscal.focus_nfe_ambiente,
    corpo,
  });

  return aguardarAutorizacao(() =>
    consultarNFSe(ref, configuracaoFiscal.focus_nfe_token as string, configuracaoFiscal.focus_nfe_ambiente),
  );
}

export async function consultarNFSe(
  ref: string,
  token: string,
  ambiente: AmbienteFocusNfe,
): Promise<RespostaFocusNfe> {
  return chamarFocusNfe<RespostaFocusNfe>({
    metodo: "GET",
    caminho: `/v2/nfse/${ref}`,
    token,
    ambiente,
  });
}

export async function cancelarNFSe(
  ref: string,
  justificativa: string,
  token: string,
  ambiente: AmbienteFocusNfe,
): Promise<RespostaFocusNfe> {
  return chamarFocusNfe<RespostaFocusNfe>({
    metodo: "DELETE",
    caminho: `/v2/nfse/${ref}`,
    token,
    ambiente,
    corpo: { justificativa },
  });
}
