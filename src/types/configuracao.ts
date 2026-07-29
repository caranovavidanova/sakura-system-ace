export interface JurosParcela {
  numero_parcelas: number;
  juros_percentual: number;
}

export interface ConfiguracaoGarantia {
  id: 1;
  texto: string;
}

export type RegimeTributario = "simples_nacional" | "lucro_presumido" | "lucro_real";
export type AmbienteFocusNfe = "homologacao" | "producao";

export interface ConfiguracaoFiscalLoja {
  id: 1;
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
  atualizado_em: string;
}

export const REGIME_TRIBUTARIO_LABEL: Record<RegimeTributario, string> = {
  simples_nacional: "Simples Nacional",
  lucro_presumido: "Lucro Presumido",
  lucro_real: "Lucro Real",
};
