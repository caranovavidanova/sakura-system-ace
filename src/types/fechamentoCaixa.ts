export interface FechamentoCaixa {
  id: string;
  loja_id: string;
  /** "YYYY-MM-DD" — o dia fechado. */
  data: string;
  fundo_troco: number;
  /** O que o sistema esperava em espécie, congelado no fechamento. */
  saldo_sistema: number;
  valor_contado: number;
  /** Contado − esperado. Negativo = faltou. */
  diferenca: number;
  totais_por_forma: Record<string, number>;
  observacao: string | null;
  /** O lançamento de "Quebra/Sobra de caixa" gerado, quando houve diferença. */
  caixa_movimento_id: string | null;
  operador_id: string | null;
  criado_em: string;
  operador?: { nome: string } | null;
}

export interface NovoFechamentoCaixa {
  lojaId: string;
  data: string;
  fundoTroco: number;
  esperado: number;
  contado: number;
  totais: Record<string, number>;
  observacao: string;
  /** Nulo = agora. Ver momentoDoLancamento() em schemas/fechamentoCaixa.ts. */
  momento: string | null;
}
