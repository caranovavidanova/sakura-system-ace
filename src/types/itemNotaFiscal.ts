export interface ItemNotaFiscalExtraido {
  descricao: string;
  marca: string | null;
  modelo: string | null;
  codigo_barras: string | null;
  ncm: string | null;
  cest: string | null;
  cfop_padrao: string | null;
  origem: string | null;
  cst_ou_csosn: string | null;
  aliquota_icms: number | null;
  unidade: string | null;
  preco_custo: number | null;
  quantidade: number | null;
}
