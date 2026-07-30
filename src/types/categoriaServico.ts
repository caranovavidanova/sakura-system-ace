export interface CategoriaServico {
  id: string;
  nome: string;
  criado_em: string;
}

export type NovaCategoriaServico = Omit<CategoriaServico, "id" | "criado_em">;
