import { z } from "zod";
import type { NovoItemPedidoCompra, NovoPedidoCompra } from "@/types/pedidoCompra";

const itemPedidoSchema = z.object({
  peca_id: z.string().min(1, "Selecione uma peça."),
  quantidade_pedida: z.string().refine((v) => Number(v) > 0, "Quantidade maior que zero."),
  preco_unitario: z.string(),
});

export const pedidoCompraFormSchema = z.object({
  fornecedor_id: z.string().min(1, "Selecione um fornecedor."),
  data_pedido: z.string().min(1, "Informe a data do pedido."),
  observacao: z.string(),
  itens: z.array(itemPedidoSchema).min(1, "Adicione ao menos um item."),
});

export type PedidoCompraFormValues = z.infer<typeof pedidoCompraFormSchema>;
export type ItemPedidoFormValues = PedidoCompraFormValues["itens"][number];

function hojeIso(): string {
  const hoje = new Date();
  return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(
    hoje.getDate(),
  ).padStart(2, "0")}`;
}

export const itemPedidoVazio: ItemPedidoFormValues = {
  peca_id: "",
  quantidade_pedida: "1",
  preco_unitario: "",
};

export const pedidoCompraFormVazio: PedidoCompraFormValues = {
  fornecedor_id: "",
  data_pedido: hojeIso(),
  observacao: "",
  itens: [itemPedidoVazio],
};

export function paraNovoPedidoCompra(valores: PedidoCompraFormValues): NovoPedidoCompra {
  return {
    fornecedor_id: valores.fornecedor_id,
    data_pedido: valores.data_pedido,
    observacao: valores.observacao.trim() || null,
  };
}

export function paraItensPedido(itens: ItemPedidoFormValues[]): NovoItemPedidoCompra[] {
  return itens.map((item) => ({
    peca_id: item.peca_id,
    quantidade_pedida: Number(item.quantidade_pedida),
    preco_unitario: item.preco_unitario.trim() === "" ? null : Number(item.preco_unitario),
  }));
}
