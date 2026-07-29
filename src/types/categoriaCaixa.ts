export type TipoCategoriaCaixa = "entrada" | "saida";

export interface CategoriaCaixa {
  id: string;
  nome: string;
  tipo: TipoCategoriaCaixa;
  criado_em: string;
}

export type NovaCategoriaCaixa = Omit<CategoriaCaixa, "id" | "criado_em">;
