export interface Loja {
  id: string;
  nome: string;
  cidade: string | null;
  uf: string | null;
  ativo: boolean;
  criado_em: string;
}

export type NovaLoja = Omit<Loja, "id" | "criado_em">;
