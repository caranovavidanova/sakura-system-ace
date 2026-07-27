export interface Peca {
  id: string;
  codigo_interno: string | null;
  descricao: string;
  unidade: string | null;
  preco_custo: number | null;
  preco_venda: number | null;
  ncm: string | null;
  cfop_padrao: string | null;
  cst_ou_csosn: string | null;
  aliquota_icms: number | null;
  ativo: boolean;
  criado_em: string;
}

export type NovaPeca = Omit<Peca, "id" | "criado_em">;
