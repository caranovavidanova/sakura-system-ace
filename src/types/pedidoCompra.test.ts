import { describe, expect, it } from "vitest";
import { nomePedido, totalPedido } from "./pedidoCompra";
import type { ItemPedidoCompra } from "./pedidoCompra";

function item(sobrescreve: Partial<ItemPedidoCompra>): ItemPedidoCompra {
  return {
    id: "item-1",
    pedido_compra_id: "pedido-1",
    peca_id: "peca-1",
    quantidade_pedida: 1,
    preco_unitario: 0,
    quantidade_recebida: 0,
    ...sobrescreve,
  };
}

describe("totalPedido", () => {
  it("soma quantidade pedida x preço unitário de cada item", () => {
    const itens = [
      item({ quantidade_pedida: 10, preco_unitario: 5 }),
      item({ quantidade_pedida: 2, preco_unitario: 30 }),
    ];
    expect(totalPedido(itens)).toBe(110);
  });

  it("trata preço unitário nulo (ainda não informado) como zero, sem quebrar", () => {
    const itens = [item({ quantidade_pedida: 10, preco_unitario: null })];
    expect(totalPedido(itens)).toBe(0);
  });

  it("devolve 0 pra pedido sem item nenhum", () => {
    expect(totalPedido([])).toBe(0);
  });
});

describe("nomePedido", () => {
  it("monta o nome curto do pedido a partir do número sequencial", () => {
    expect(nomePedido(7)).toBe("Pedido 7");
  });
});
