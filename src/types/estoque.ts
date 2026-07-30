export type TipoMovimento = "entrada" | "saida";

export type MotivoMovimento = "compra" | "venda" | "ajuste" | "uso_em_os";

export interface MovimentoEstoque {
  id: string;
  loja_id: string;
  peca_id: string;
  tipo: TipoMovimento;
  quantidade: number;
  motivo: MotivoMovimento;
  referencia: string | null;
  criado_em: string;
}

export type NovoMovimentoEstoque = Omit<
  MovimentoEstoque,
  "id" | "loja_id" | "criado_em"
>;
