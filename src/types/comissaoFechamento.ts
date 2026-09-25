/** Uma OS dentro do retrato de um pagamento de comissão. */
export interface ItemRetratoComissao {
  ordemId: string;
  numero: number;
  papel: "vendedor" | "tecnico";
  comissao: number;
}

/** Um pagamento de comissão registrado (migration 0059, item TL-46.1). */
export interface ComissaoFechamento {
  id: string;
  loja_id: string;
  funcionario_id: string | null;
  /** O nome no dia do pagamento — o registro continua dizendo pra quem foi. */
  funcionario_nome: string;
  periodo_inicio: string;
  periodo_fim: string;
  percentual: number | null;
  valor_calculado: number;
  valor_pago: number;
  data_pagamento: string;
  observacao: string | null;
  snapshot: ItemRetratoComissao[];
  operador_id: string | null;
  criado_em: string;
}

export interface NovoComissaoFechamento {
  loja_id: string;
  funcionario_id: string;
  funcionario_nome: string;
  periodo_inicio: string;
  periodo_fim: string;
  percentual: number | null;
  valor_calculado: number;
  valor_pago: number;
  data_pagamento: string;
  observacao: string | null;
  snapshot: ItemRetratoComissao[];
}
