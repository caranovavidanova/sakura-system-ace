import { describe, expect, it } from "vitest";
import { calcularSaldoPorPeca } from "./estoque";
import type { MovimentoEstoque } from "@/types/estoque";

function movimento(sobrescreve: Partial<MovimentoEstoque>): MovimentoEstoque {
  return {
    id: "mov-1",
    loja_id: "loja-1",
    deposito_id: "deposito-1",
    peca_id: "peca-1",
    tipo: "entrada",
    quantidade: 1,
    motivo: "compra",
    referencia: null,
    criado_em: new Date().toISOString(),
    ...sobrescreve,
  };
}

describe("calcularSaldoPorPeca", () => {
  it("soma entradas e subtrai saídas, por peça", () => {
    const saldos = calcularSaldoPorPeca([
      movimento({ peca_id: "peca-1", tipo: "entrada", quantidade: 10 }),
      movimento({ peca_id: "peca-1", tipo: "saida", quantidade: 3 }),
      movimento({ peca_id: "peca-2", tipo: "entrada", quantidade: 5 }),
    ]);
    expect(saldos.get("peca-1")).toBe(7);
    expect(saldos.get("peca-2")).toBe(5);
  });

  it("peça sem nenhuma movimentação não aparece no mapa", () => {
    const saldos = calcularSaldoPorPeca([]);
    expect(saldos.get("peca-inexistente")).toBeUndefined();
  });

  it("saldo pode ficar negativo (ex: uso em OS antes de repor estoque) — não trava, só reflete o número", () => {
    const saldos = calcularSaldoPorPeca([
      movimento({ peca_id: "peca-1", tipo: "saida", quantidade: 5 }),
    ]);
    expect(saldos.get("peca-1")).toBe(-5);
  });
});
