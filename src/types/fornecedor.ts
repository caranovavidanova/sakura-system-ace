export interface Fornecedor {
  id: string;
  nome: string;
  cnpj: string | null;
  telefone: string | null;
  email: string | null;
  ativo: boolean;
  criado_em: string;
}

export type NovoFornecedor = Omit<Fornecedor, "id" | "criado_em">;
