export interface JurosParcela {
  loja_id: string;
  numero_parcelas: number;
  juros_percentual: number;
}

export interface ConfiguracaoGarantia {
  loja_id: string;
  texto: string;
}

export type RegimeTributario = "simples_nacional" | "lucro_presumido" | "lucro_real";
export type AmbienteFocusNfe = "homologacao" | "producao";

export interface ConfiguracaoFiscalLoja {
  loja_id: string;
  cnpj: string | null;
  razao_social: string | null;
  nome_fantasia: string | null;
  inscricao_estadual: string | null;
  inscricao_municipal: string | null;
  regime_tributario: RegimeTributario | null;
  cep: string | null;
  rua: string | null;
  numero: string | null;
  bairro: string | null;
  cidade: string | null;
  uf: string | null;
  telefone: string | null;
  email: string | null;
  focus_nfe_token: string | null;
  focus_nfe_ambiente: AmbienteFocusNfe;
  // Usados só na emissão de NFS-e (serviço) — NFC-e (peça) não precisa de
  // nenhum destes. codigo_municipio é o código IBGE da cidade da loja;
  // item_lista_servico é o código da LC 116/2003 (padrão "14.01" — manutenção
  // e conservação de veículos); codigo_tributario_municipio é específico da
  // prefeitura, só alguns municípios exigem; codigo_cnae vem do Cartão CNPJ
  // da empresa ("Atividade econômica principal") — algumas prefeituras
  // (Araraquara incluída) exigem esse campo pra autorizar a nota.
  codigo_municipio: string | null;
  item_lista_servico: string | null;
  aliquota_iss: number | null;
  codigo_tributario_municipio: string | null;
  codigo_cnae: string | null;
  atualizado_em: string;
}

export const REGIME_TRIBUTARIO_LABEL: Record<RegimeTributario, string> = {
  simples_nacional: "Simples Nacional",
  lucro_presumido: "Lucro Presumido",
  lucro_real: "Lucro Real",
};

export type CartaoMetrica =
  | "vendas_mes"
  | "custos_mes"
  | "lucro_mes"
  | "ticket_medio_mes"
  | "contas_pagar_vencendo";

export const CARTAO_METRICA_LABEL: Record<CartaoMetrica, string> = {
  vendas_mes: "Vendas do mês",
  custos_mes: "Custos do mês",
  lucro_mes: "Lucro do mês",
  ticket_medio_mes: "Ticket médio do mês",
  contas_pagar_vencendo: "Contas a pagar vencendo",
};

// Custos não entra no padrão de propósito — a usuária achou estranho mostrar
// algo "negativo" logo de cara no Início; continua disponível pra quem
// quiser escolher em Configurações → "Cartões do Início".
export const CARTOES_INICIO_PADRAO: CartaoMetrica[] = [
  "vendas_mes",
  "lucro_mes",
  "ticket_medio_mes",
];

export interface ConfiguracaoPainelInicio {
  loja_id: string;
  cartoes: CartaoMetrica[];
}
