export type StatusContaReceber = "pendente" | "recebido";

export interface ContaReceber {
  id: string;
  loja_id: string;
  cliente_id: string;
  ordem_servico_id: string | null;
  descricao: string;
  valor: number;
  vencimento: string;
  status: StatusContaReceber;
  data_recebimento: string | null;
  caixa_movimento_id: string | null;
  operador_id: string | null;
  criado_em: string;
  cliente?: { nome: string } | null;
}

export type NovaContaReceber = Pick<
  ContaReceber,
  "cliente_id" | "ordem_servico_id" | "descricao" | "valor" | "vencimento"
>;
