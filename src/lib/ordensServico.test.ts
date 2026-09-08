import { describe, expect, it } from "vitest";
import { diferencasDeEstoque } from "./ordensServico";
import type { ItemOS, PatchItemOS } from "@/types/os";

function item(parcial: Partial<ItemOS>): ItemOS {
  return {
    id: "item-1",
    ordem_servico_id: "os-1",
    tipo: "peca",
    peca_id: "peca-a",
    servico_id: null,
    tecnico_id: null,
    descricao: "Pneu",
    quantidade: 2,
    preco_unitario: 100,
    desconto: 0,
    ...parcial,
  };
}

function patch(parcial: Partial<PatchItemOS>): PatchItemOS {
  const base = item({});
  return {
    tipo: base.tipo,
    peca_id: base.peca_id,
    servico_id: base.servico_id,
    tecnico_id: base.tecnico_id,
    descricao: base.descricao,
    quantidade: base.quantidade,
    preco_unitario: base.preco_unitario,
    desconto: base.desconto,
    ...parcial,
  };
}

describe("diferencasDeEstoque", () => {
  it("não mexe no estoque quando só o preço muda (o caso mais comum de correção)", () => {
    const diferencas = diferencasDeEstoque(item({}), patch({ preco_unitario: 60 }));
    expect(diferencas.size).toBe(0);
  });

  it("tira mais do estoque quando a quantidade aumenta", () => {
    const diferencas = diferencasDeEstoque(item({ quantidade: 2 }), patch({ quantidade: 5 }));
    expect([...diferencas]).toEqual([["peca-a", 3]]);
  });

  it("devolve pro estoque quando a quantidade diminui", () => {
    const diferencas = diferencasDeEstoque(item({ quantidade: 5 }), patch({ quantidade: 2 }));
    expect([...diferencas]).toEqual([["peca-a", -3]]);
  });

  it("devolve a peça antiga e tira a nova quando a peça é trocada", () => {
    const diferencas = diferencasDeEstoque(
      item({ peca_id: "peca-a", quantidade: 2 }),
      patch({ peca_id: "peca-b", quantidade: 1 }),
    );
    expect(diferencas.get("peca-a")).toBe(-2);
    expect(diferencas.get("peca-b")).toBe(1);
  });

  it("devolve tudo quando a peça vira serviço", () => {
    const diferencas = diferencasDeEstoque(
      item({ quantidade: 2 }),
      patch({ tipo: "servico", peca_id: null, servico_id: "servico-a", quantidade: 1 }),
    );
    expect([...diferencas]).toEqual([["peca-a", -2]]);
  });

  it("tira do estoque quando um serviço vira peça", () => {
    const diferencas = diferencasDeEstoque(
      item({ tipo: "servico", peca_id: null, servico_id: "servico-a", quantidade: 1 }),
      patch({ tipo: "peca", peca_id: "peca-b", servico_id: null, quantidade: 4 }),
    );
    expect([...diferencas]).toEqual([["peca-b", 4]]);
  });

  it("ignora item de serviço dos dois lados", () => {
    const servico = item({ tipo: "servico", peca_id: null, servico_id: "servico-a" });
    const diferencas = diferencasDeEstoque(servico, patch({
      tipo: "servico",
      peca_id: null,
      servico_id: "servico-a",
      preco_unitario: 60,
    }));
    expect(diferencas.size).toBe(0);
  });

  it("ignora peça sem cadastro (item digitado à mão, que nunca baixou estoque)", () => {
    const diferencas = diferencasDeEstoque(
      item({ peca_id: null, quantidade: 2 }),
      patch({ peca_id: null, quantidade: 9 }),
    );
    expect(diferencas.size).toBe(0);
  });

  // Sem arredondar, 2.3 - 2.0 dá 0.2999999999999998 em ponto flutuante — e
  // uma correção de preço numa peça de quantidade quebrada geraria uma
  // movimentação de estoque que ninguém pediu.
  it("arredonda a diferença em duas casas, como o banco guarda", () => {
    const diferencas = diferencasDeEstoque(
      item({ quantidade: 2 }),
      patch({ quantidade: 2.3 }),
    );
    expect([...diferencas]).toEqual([["peca-a", 0.3]]);
  });

  it("não gera movimentação quando a quantidade não muda de verdade", () => {
    const diferencas = diferencasDeEstoque(
      item({ quantidade: 1.99 }),
      patch({ quantidade: 1.99, preco_unitario: 12 }),
    );
    expect(diferencas.size).toBe(0);
  });
});
