import { criarMovimento } from "./estoque";
import { supabase } from "./supabase";
import { nomePedido } from "@/types/pedidoCompra";
import type {
  NovoItemPedidoCompra,
  NovoPedidoCompra,
  PedidoCompra,
} from "@/types/pedidoCompra";

const SELECT_PEDIDO =
  "*, fornecedor:fornecedores(nome), itens:pedidos_compra_itens(*, peca:pecas(descricao, unidade))";

export async function listarPedidos(lojaId: string): Promise<PedidoCompra[]> {
  const { data, error } = await supabase
    .from("pedidos_compra")
    .select(SELECT_PEDIDO)
    .eq("loja_id", lojaId)
    .order("criado_em", { ascending: false });

  if (error) throw error;
  return data as unknown as PedidoCompra[];
}

export async function criarPedido(
  pedido: NovoPedidoCompra,
  itens: NovoItemPedidoCompra[],
  lojaId: string,
  operadorId: string | null,
): Promise<PedidoCompra> {
  const { data: pedidoCriado, error: erroPedido } = await supabase
    .from("pedidos_compra")
    .insert({ ...pedido, loja_id: lojaId, operador_id: operadorId })
    .select()
    .single();
  if (erroPedido) throw erroPedido;

  const { error: erroItens } = await supabase.from("pedidos_compra_itens").insert(
    itens.map((item) => ({ ...item, pedido_compra_id: pedidoCriado.id })),
  );
  if (erroItens) throw erroItens;

  return pedidoCriado as PedidoCompra;
}

export async function cancelarPedido(id: string): Promise<void> {
  const { error } = await supabase
    .from("pedidos_compra")
    .update({ status: "cancelado" })
    .eq("id", id);
  if (error) throw error;
}

export interface RecebimentoItem {
  itemId: string;
  pecaId: string;
  quantidadeRecebidaAgora: number;
}

// Confere as quantidades que chegaram contra o pedido: lança a entrada no
// estoque de cada item recebido (motivo "compra"), soma na
// `quantidade_recebida` do item, e recalcula o status do pedido inteiro
// (recebido só quando TODO item já bateu a quantidade pedida; parcial
// quando pelo menos um chegou sem fechar tudo ainda).
export async function receberItensPedido(
  pedido: PedidoCompra,
  recebimentos: RecebimentoItem[],
  lojaId: string,
): Promise<void> {
  const aplicaveis = recebimentos.filter((r) => r.quantidadeRecebidaAgora > 0);

  for (const recebimento of aplicaveis) {
    await criarMovimento(
      {
        peca_id: recebimento.pecaId,
        tipo: "entrada",
        quantidade: recebimento.quantidadeRecebidaAgora,
        motivo: "compra",
        referencia: nomePedido(pedido.numero),
      },
      lojaId,
    );

    const itemAtual = pedido.itens?.find((item) => item.id === recebimento.itemId);
    const { error: erroItem } = await supabase
      .from("pedidos_compra_itens")
      .update({
        quantidade_recebida:
          (itemAtual?.quantidade_recebida ?? 0) + recebimento.quantidadeRecebidaAgora,
      })
      .eq("id", recebimento.itemId);
    if (erroItem) throw erroItem;
  }

  const itensAtualizados = (pedido.itens ?? []).map((item) => {
    const recebimento = aplicaveis.find((r) => r.itemId === item.id);
    return recebimento
      ? { ...item, quantidade_recebida: item.quantidade_recebida + recebimento.quantidadeRecebidaAgora }
      : item;
  });
  const tudoRecebido = itensAtualizados.every(
    (item) => item.quantidade_recebida >= item.quantidade_pedida,
  );
  const algumaCoisaRecebida = itensAtualizados.some((item) => item.quantidade_recebida > 0);
  const novoStatus = tudoRecebido ? "recebido" : algumaCoisaRecebida ? "parcial" : "pendente";

  const { error: erroPedido } = await supabase
    .from("pedidos_compra")
    .update({ status: novoStatus })
    .eq("id", pedido.id);
  if (erroPedido) throw erroPedido;
}
