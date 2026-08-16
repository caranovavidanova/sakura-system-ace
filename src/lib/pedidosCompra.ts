import { registrarCotacoes } from "./cotacoesPecas";
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

  // Todo item com preço lançado vira uma cotação nova — sem formulário
  // próprio pra preencher, ver "Cotação de peças por fornecedor" no
  // PROJETO_STATUS.md.
  await registrarCotacoes(
    itens
      .filter((item) => item.preco_unitario !== null)
      .map((item) => ({
        peca_id: item.peca_id,
        fornecedor_id: pedido.fornecedor_id,
        preco: item.preco_unitario as number,
      })),
  );

  return pedidoCriado as PedidoCompra;
}

export interface ItemImportacaoXml {
  pecaId: string;
  quantidade: number;
  precoUnitario: number;
}

// Diferente de criarPedido() + receberItensPedido() (fluxo em duas etapas:
// primeiro planeja, depois confere o que chegou): a nota fiscal XML já é a
// prova de que a mercadoria chegou, então o pedido nasce direto "recebido"
// — sem passar por "pendente". Usada por ImportarNotaFiscalXmlModal.tsx.
export async function importarNotaFiscalCompra(
  fornecedorId: string,
  itens: ItemImportacaoXml[],
  depositoId: string,
  lojaId: string,
  operadorId: string | null,
  observacao: string | null,
): Promise<PedidoCompra> {
  const { data: pedidoCriado, error: erroPedido } = await supabase
    .from("pedidos_compra")
    .insert({
      fornecedor_id: fornecedorId,
      data_pedido: new Date().toISOString().slice(0, 10),
      observacao,
      status: "recebido",
      loja_id: lojaId,
      operador_id: operadorId,
    })
    .select()
    .single();
  if (erroPedido) throw erroPedido;

  const { error: erroItens } = await supabase.from("pedidos_compra_itens").insert(
    itens.map((item) => ({
      pedido_compra_id: pedidoCriado.id,
      peca_id: item.pecaId,
      quantidade_pedida: item.quantidade,
      preco_unitario: item.precoUnitario,
      quantidade_recebida: item.quantidade,
    })),
  );
  if (erroItens) throw erroItens;

  for (const item of itens) {
    await criarMovimento(
      {
        peca_id: item.pecaId,
        deposito_id: depositoId,
        tipo: "entrada",
        quantidade: item.quantidade,
        motivo: "compra",
        referencia: nomePedido(pedidoCriado.numero),
      },
      lojaId,
    );
  }

  await registrarCotacoes(
    itens.map((item) => ({
      peca_id: item.pecaId,
      fornecedor_id: fornecedorId,
      preco: item.precoUnitario,
    })),
  );

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
