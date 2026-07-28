export interface Servico {
  id: string;
  codigo_interno: string | null;
  descricao: string;
  preco_padrao: number | null;
  ativo: boolean;
  criado_em: string;
}

export type NovoServico = Omit<Servico, "id" | "criado_em">;
