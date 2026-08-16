export interface Deposito {
  id: string;
  loja_id: string;
  nome: string;
  ativo: boolean;
  criado_em: string;
}

export type NovoDeposito = Omit<Deposito, "id" | "criado_em">;
