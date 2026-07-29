export interface Categoria {
  id: string;
  nome: string;
  criado_em: string;
}

export type NovaCategoria = Omit<Categoria, "id" | "criado_em">;
