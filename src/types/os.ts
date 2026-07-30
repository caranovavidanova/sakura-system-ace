import type { TipoVeiculo } from "@/types/cliente";

export type StatusOS = "aberta" | "em_andamento" | "concluida" | "faturada";

export type TipoItemOS = "peca" | "servico";

export interface ItemOS {
  id: string;
  ordem_servico_id: string;
  tipo: TipoItemOS;
  peca_id: string | null;
  servico_id: string | null;
  tecnico_id: string | null;
  descricao: string;
  quantidade: number;
  preco_unitario: number;
  desconto: number;
  tecnico?: { nome: string } | null;
}

export type NovoItemOS = Omit<ItemOS, "id" | "ordem_servico_id" | "tecnico">;

export interface OrdemServico {
  id: string;
  loja_id: string;
  cliente_id: string;
  veiculo_id: string | null;
  status: StatusOS;
  km_entrada: number | null;
  descricao_problema: string | null;
  forma_pagamento: string | null;
  parcelas: number;
  data_abertura: string;
  data_fechamento: string | null;
  vendedor_id: string | null;
  criado_por_id: string | null;
  atualizado_por_id: string | null;
  cliente?: { nome: string };
  veiculo?: {
    placa: string;
    marca: string | null;
    modelo: string | null;
    cor: string | null;
    tipo: TipoVeiculo | null;
  } | null;
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
  vendedor_id: string | null;
}

export type PatchOrdemServico = Partial<
  Pick<
    OrdemServico,
    | "cliente_id"
    | "veiculo_id"
    | "km_entrada"
    | "descricao_problema"
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

// Cores por status pra bater o olho rápido numa lista grande — "concluída"
// (esperando faturar) usa laranja de propósito, pra chamar mais atenção que
// as outras: é o estado que ainda exige uma ação (faturar).
export const STATUS_COR: Record<StatusOS, string> = {
  aberta: "bg-sky-50 text-sky-700",
  em_andamento: "bg-amber-50 text-amber-800",
  concluida: "bg-orange-100 text-orange-800",
  faturada: "bg-emerald-50 text-emerald-700",
};

export function totalOrdem(itens: ItemOS[]): number {
  return itens.reduce(
    (total, item) => total + item.quantidade * item.preco_unitario - item.desconto,
    0,
  );
}

export function totalPorTipo(itens: ItemOS[], tipo: TipoItemOS): number {
  return itens
    .filter((item) => item.tipo === tipo)
    .reduce((total, item) => total + item.quantidade * item.preco_unitario - item.desconto, 0);
}
