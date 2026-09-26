import type { ItemOS, TipoOrdem } from "@/types/os";

export type TipoCaixa = "entrada" | "saida";

export interface MovimentoCaixa {
  id: string;
  loja_id: string;
  data: string;
  ordem_servico_id: string | null;
  tipo: TipoCaixa;
  forma_pagamento: string | null;
  valor: number;
  descricao: string | null;
  categoria_id: string | null;
  ordem_servico?: {
    id: string;
    numero: number;
    /** Ausente em banco anterior à migration 0064 (aí é sempre OS). */
    tipo?: TipoOrdem;
    cliente: { nome: string } | null;
    itens: ItemOS[];
  } | null;
  categoria?: { nome: string } | null;
}

export type NovoMovimentoCaixa = Omit<
  MovimentoCaixa,
  "id" | "loja_id" | "data" | "categoria"
>;
