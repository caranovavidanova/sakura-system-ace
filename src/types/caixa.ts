import type { ItemOS } from "@/types/os";

export type TipoCaixa = "entrada" | "saida";

export interface MovimentoCaixa {
  id: string;
  data: string;
  ordem_servico_id: string | null;
  tipo: TipoCaixa;
  forma_pagamento: string | null;
  valor: number;
  descricao: string | null;
  ordem_servico?: {
    id: string;
    cliente: { nome: string } | null;
    itens: ItemOS[];
  } | null;
}

export type NovoMovimentoCaixa = Omit<MovimentoCaixa, "id" | "data">;
