export interface CotacaoPeca {
  id: string;
  peca_id: string;
  fornecedor_id: string;
  preco: number;
  criado_em: string;
  fornecedor?: { nome: string } | null;
}

export type NovaCotacaoPeca = Omit<CotacaoPeca, "id" | "criado_em" | "fornecedor">;
