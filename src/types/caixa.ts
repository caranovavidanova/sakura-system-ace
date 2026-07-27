export type TipoCaixa = "entrada" | "saida";

export interface MovimentoCaixa {
  id: string;
  data: string;
  ordem_servico_id: string | null;
  tipo: TipoCaixa;
  forma_pagamento: string | null;
  valor: number;
  descricao: string | null;
}

export type NovoMovimentoCaixa = Omit<MovimentoCaixa, "id" | "data">;
