export type StatusOS = "aberta" | "em_andamento" | "concluida" | "faturada";

export type TipoItemOS = "peca" | "servico";

export interface ItemOS {
  id: string;
  ordem_servico_id: string;
  tipo: TipoItemOS;
  peca_id: string | null;
  servico_id: string | null;
  descricao: string;
  quantidade: number;
  preco_unitario: number;
  desconto: number;
}

export type NovoItemOS = Omit<ItemOS, "id" | "ordem_servico_id">;

export interface OrdemServico {
  id: string;
  cliente_id: string;
  veiculo_id: string | null;
  status: StatusOS;
  km_entrada: number | null;
  descricao_problema: string | null;
  forma_pagamento: string | null;
  data_abertura: string;
  data_fechamento: string | null;
  previsao_entrega: string | null;
  data_retorno: string | null;
  checklist_direcao_hidraulica: boolean;
  checklist_ar_condicionado: boolean;
  checklist_direcao_eletrica: boolean;
  vendedor_id: string | null;
  criado_por_id: string | null;
  atualizado_por_id: string | null;
  cliente?: { nome: string };
  veiculo?: { placa: string } | null;
  vendedor?: { nome: string } | null;
  criado_por?: { nome: string } | null;
  atualizado_por?: { nome: string } | null;
  itens?: ItemOS[];
}

export interface NovaOrdemServico {
  cliente_id: string;
  veiculo_id: string | null;
  km_entrada: number | null;
  descricao_problema: string | null;
  previsao_entrega: string | null;
  data_retorno: string | null;
  checklist_direcao_hidraulica: boolean;
  checklist_ar_condicionado: boolean;
  checklist_direcao_eletrica: boolean;
  vendedor_id: string | null;
}

export type PatchOrdemServico = Partial<
  Pick<
    OrdemServico,
    | "cliente_id"
    | "veiculo_id"
    | "km_entrada"
    | "descricao_problema"
    | "previsao_entrega"
    | "data_retorno"
    | "checklist_direcao_hidraulica"
    | "checklist_ar_condicionado"
    | "checklist_direcao_eletrica"
    | "vendedor_id"
    | "status"
  >
>;

export const STATUS_LABEL: Record<StatusOS, string> = {
  aberta: "Aberta",
  em_andamento: "Em andamento",
  concluida: "Concluída",
  faturada: "Faturada",
};

export function totalOrdem(itens: ItemOS[]): number {
  return itens.reduce(
    (total, item) => total + item.quantidade * item.preco_unitario - item.desconto,
    0,
  );
}
