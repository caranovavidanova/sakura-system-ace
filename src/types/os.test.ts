import { describe, expect, it } from "vitest";
import { nomeOrdem, totalOrdem, totalPorTipo } from "./os";
import type { ItemOS } from "./os";

function item(sobrescreve: Partial<ItemOS>): ItemOS {
  return {
    id: "item-1",
    ordem_servico_id: "os-1",
    tipo: "peca",
    peca_id: null,
    servico_id: null,
    tecnico_id: null,
    descricao: "Item de teste",
    quantidade: 1,
    preco_unitario: 0,
    desconto: 0,
    ...sobrescreve,
  };
}

describe("totalOrdem", () => {
  it("soma quantidade x preço unitário de cada item, menos o desconto", () => {
    const itens = [
      item({ quantidade: 2, preco_unitario: 50, desconto: 0 }),
      item({ quantidade: 1, preco_unitario: 100, desconto: 10 }),
    ];
    // (2 * 50) + (1 * 100 - 10) = 100 + 90 = 190
    expect(totalOrdem(itens)).toBe(190);
  });

  it("devolve 0 pra lista vazia (OS sem item nenhum)", () => {
    expect(totalOrdem([])).toBe(0);
  });
});

describe("totalPorTipo", () => {
  it("soma só os itens do tipo pedido, ignorando o outro tipo", () => {
    const itens = [
      item({ tipo: "peca", quantidade: 1, preco_unitario: 100, desconto: 0 }),
      item({ tipo: "servico", quantidade: 1, preco_unitario: 50, desconto: 0 }),
      item({ tipo: "peca", quantidade: 2, preco_unitario: 20, desconto: 0 }),
    ];
    expect(totalPorTipo(itens, "peca")).toBe(140);
    expect(totalPorTipo(itens, "servico")).toBe(50);
  });
});

describe("nomeOrdem", () => {
  it("monta o nome curto da OS a partir do número sequencial", () => {
    expect(nomeOrdem(12)).toBe("OS 12");
  });
});
