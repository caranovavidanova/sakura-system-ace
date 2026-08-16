export interface Fornecedor {
  id: string;
  nome: string;
  cnpj: string | null;
  telefone: string | null;
  email: string | null;
  cep: string | null;
  rua: string | null;
  numero: string | null;
  bairro: string | null;
  cidade: string | null;
  uf: string | null;
  ativo: boolean;
  criado_em: string;
}

export type NovoFornecedor = Omit<Fornecedor, "id" | "criado_em">;
