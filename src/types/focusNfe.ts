// Tipos do formato de requisição/resposta da API do Focus NFe. Baseado nos
// exemplos oficiais do repositório github.com/FocusNFe/javascript (NFCe/v2 e
// NFSe/v2) — os campos do corpo da requisição (NFCeCorpo/NFSeCorpo) são
// exatos, confirmados contra esses exemplos. Os campos da resposta
// (RespostaFocusNfe) que vêm sem asterisco de dúvida abaixo (status,
// status_sefaz, mensagem_sefaz, chave_nfe, numero, serie,
// caminho_xml_nota_fiscal, caminho_danfe) foram confirmados pra NFC-e; os
// mesmos nomes são usados como melhor esforço pra NFS-e (a Focus NFe reusa o
// mesmo formato de resposta pros dois documentos), mas isso **ainda não foi
// validado contra uma emissão de teste real** — ver PROJETO_STATUS.md.

export type StatusEmissaoFocusNfe =
  | "processando_autorizacao"
  | "autorizado"
  | "erro_autorizacao"
  | "cancelado"
  | "erro_cancelamento"
  | "denegado";

export interface RespostaFocusNfe {
  ref?: string;
  status: string;
  status_sefaz?: string;
  mensagem_sefaz?: string;
  mensagem?: string;
  erros?: { mensagem?: string; campo?: string }[];
  numero?: string;
  serie?: string;
  chave_nfe?: string;
  caminho_xml_nota_fiscal?: string;
  caminho_danfe?: string;
  caminho_xml_cancelamento?: string;
  codigo_verificacao?: string;
  url?: string;
}

export interface ItemNFCe {
  numero_item: string;
  codigo_ncm: string;
  codigo_produto: string;
  descricao: string;
  quantidade_comercial: string;
  quantidade_tributavel: string;
  cfop: string;
  valor_unitario_comercial: string;
  valor_unitario_tributavel: string;
  valor_bruto: string;
  unidade_comercial: string;
  unidade_tributavel: string;
  icms_origem: string;
  icms_situacao_tributaria: string;
  icms_aliquota: string;
  icms_base_calculo: string;
  icms_modalidade_base_calculo: string;
}

export interface FormaPagamentoNFCe {
  forma_pagamento: string;
  valor_pagamento: string;
}

export interface NFCeCorpo {
  natureza_operacao: string;
  data_emissao: string;
  tipo_documento: string;
  presenca_comprador: string;
  consumidor_final: string;
  finalidade_emissao: string;
  cnpj_emitente: string;
  nome_destinatario: string;
  cpf_destinatario: string;
  informacoes_adicionais_contribuinte?: string;
  valor_produtos: string;
  valor_desconto: string;
  valor_total: string;
  forma_pagamento: string;
  icms_valor_total: string;
  modalidade_frete: string;
  items: ItemNFCe[];
  formas_pagamento: FormaPagamentoNFCe[];
}

export interface EnderecoNFSe {
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  codigo_municipio: string;
  uf: string;
  cep: string;
}

export interface NFSeCorpo {
  data_emissao: string;
  prestador: {
    cnpj: string;
    inscricao_municipal: string;
    codigo_municipio: string;
  };
  tomador: {
    cnpj?: string;
    cpf?: string;
    razao_social: string;
    email?: string;
    endereco?: EnderecoNFSe;
  };
  servico: {
    aliquota: number;
    discriminacao: string;
    iss_retido: string;
    item_lista_servico: string;
    codigo_tributario_municipio?: string;
    valor_servicos: number;
  };
}
