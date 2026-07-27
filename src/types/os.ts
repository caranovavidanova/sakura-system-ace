export type StatusOS = "aberta" | "em_andamento" | "concluida" | "faturada";

export type TipoItemOS = "peca" | "servico";

export interface ItemOS {
  id: string;
  ordem_servico_id: string;
  tipo: TipoItemOS;
  peca_id: string | null;
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
  cliente?: { nome: string };
  veiculo?: { placa: string } | null;
  itens?: ItemOS[];
}

export interface NovaOrdemServico {
  cliente_id: string;
  veiculo_id: string | null;
  km_entrada: number | null;
  descricao_problema: string | null;
}

export function totalOrdem(itens: ItemOS[]): number {
  return itens.reduce(
    (total, item) => total + item.quantidade * item.preco_unitario - item.desconto,
    0,
  );
}
