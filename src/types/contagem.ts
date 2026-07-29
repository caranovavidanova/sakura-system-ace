export interface ContagemEstoque {
  id: string;
  peca_id: string;
  quantidade_contada: number;
  saldo_sistema: number;
  diferenca: number;
  observacao: string | null;
  operador_id: string | null;
  criado_em: string;
}
