import { describe, expect, it } from "vitest";
import { itemFormVazio, totaisDaOrdem, type ItemFormValues } from "./ordemServico";
import type { ItemOS } from "@/types/os";

function itemLancado(
  tipo: "peca" | "servico",
  quantidade: number,
  precoUnitario: number,
  desconto = 0,
): ItemOS {
  return {
    id: crypto.randomUUID(),
    ordem_servico_id: "os-1",
    tipo,
    peca_id: tipo === "peca" ? "p1" : null,
    servico_id: tipo === "servico" ? "s1" : null,
    tecnico_id: null,
    descricao: tipo,
    quantidade,
    preco_unitario: precoUnitario,
    desconto,
  };
}

function itemDigitado(
  tipo: "peca" | "servico",
  quantidade: string,
  precoUnitario: string,
  desconto = "",
): ItemFormValues {
  return { ...itemFormVazio, tipo, quantidade, preco_unitario: precoUnitario, desconto };
}

describe("totaisDaOrdem", () => {
  it("é tudo zero numa OS em branco", () => {
    expect(totaisDaOrdem([], [])).toEqual({ pecas: 0, servicos: 0, total: 0 });
  });

  it("separa peça de serviço", () => {
    const totais = totaisDaOrdem(
      [itemLancado("peca", 2, 150), itemLancado("servico", 1, 60)],
      [],
    );
    expect(totais).toEqual({ pecas: 300, servicos: 60, total: 360 });
  });

  it("soma o que já está lançado com o que está sendo digitado agora", () => {
    const totais = totaisDaOrdem(
      [itemLancado("peca", 1, 200)],
      [itemDigitado("peca", "2", "50"), itemDigitado("servico", "1", "80")],
    );
    expect(totais).toEqual({ pecas: 300, servicos: 80, total: 380 });
  });

  it("desconta o desconto dos dois lados", () => {
    const totais = totaisDaOrdem(
      [itemLancado("peca", 1, 100, 10)],
      [itemDigitado("servico", "1", "100", "25")],
    );
    expect(totais).toEqual({ pecas: 90, servicos: 75, total: 165 });
  });

  it("ignora linha em branco do formulário (campo vazio não vira NaN)", () => {
    const totais = totaisDaOrdem([itemLancado("peca", 1, 100)], [{ ...itemFormVazio }]);
    expect(totais).toEqual({ pecas: 100, servicos: 0, total: 100 });
  });

  it("o total é sempre peças + serviços, sem uma terceira conta que possa divergir", () => {
    const totais = totaisDaOrdem(
      [itemLancado("peca", 3, 33.33), itemLancado("servico", 2, 11.11)],
      [itemDigitado("peca", "1", "0.01")],
    );
    expect(totais.total).toBe(totais.pecas + totais.servicos);
  });
});
