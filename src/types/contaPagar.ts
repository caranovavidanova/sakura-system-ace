export type StatusContaPagar = "pendente" | "paga";

export interface ContaPagar {
  id: string;
  loja_id: string;
  descricao: string;
  valor: number;
  vencimento: string;
  categoria_id: string | null;
  recorrente: boolean;
  status: StatusContaPagar;
  data_pagamento: string | null;
  caixa_movimento_id: string | null;
  operador_id: string | null;
  criado_em: string;
  categoria?: { nome: string } | null;
}

export type NovaContaPagar = Pick<
  ContaPagar,
  "descricao" | "valor" | "vencimento" | "categoria_id" | "recorrente"
>;
