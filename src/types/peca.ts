export interface Peca {
  id: string;
  codigo_interno: string | null;
  codigo_barras: string | null;
  descricao: string;
  marca: string | null;
  modelo: string | null;
  aplicacao: string | null;
  unidade: string | null;
  preco_custo: number | null;
  preco_venda: number | null;
  ncm: string | null;
  cest: string | null;
  cfop_padrao: string | null;
  origem: string | null;
  cst_ou_csosn: string | null;
  aliquota_icms: number | null;
  categoria_id: string | null;
  prazo_garantia_dias: number | null;
  // Quantidade a partir da qual a peça precisa ser recomprada (migration
  // 0051). `null` quer dizer "sem mínimo definido" e nunca vira aviso —
  // diferente de zero, que é um mínimo de verdade. A regra de leitura fica
  // em `schemas/estoque.ts`, não espalhada pelas telas.
  estoque_minimo: number | null;
  // Bloco de pneu (migration 0051): só aparece no formulário quando a
  // categoria da peça é a de Pneus. Ex: "175/70 R14", "84T", "3823".
  medida: string | null;
  indice_carga_velocidade: string | null;
  dot: string | null;
  ativo: boolean;
  criado_em: string;
}

export type NovaPeca = Omit<Peca, "id" | "criado_em">;
