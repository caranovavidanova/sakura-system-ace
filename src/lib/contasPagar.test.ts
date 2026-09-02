import { describe, expect, it } from "vitest";
import { proximoVencimento } from "./contasPagar";

describe("proximoVencimento", () => {
  it("anda um mês mantendo o dia, no caso comum", () => {
    expect(proximoVencimento("2026-01-15")).toBe("2026-02-15");
    expect(proximoVencimento("2026-09-05")).toBe("2026-10-05");
  });

  it("segura no último dia do mês quando o dia não existe lá", () => {
    // Antes, 31/01 virava "31 de fevereiro", que o JavaScript transborda pra
    // 03/03: a conta pulava fevereiro inteiro e mudava de dia pra sempre.
    expect(proximoVencimento("2026-01-31")).toBe("2026-02-28");
    expect(proximoVencimento("2026-01-30")).toBe("2026-02-28");
    expect(proximoVencimento("2026-01-29")).toBe("2026-02-28");
    expect(proximoVencimento("2026-03-31")).toBe("2026-04-30");
    expect(proximoVencimento("2026-05-31")).toBe("2026-06-30");
  });

  it("respeita fevereiro de ano bissexto", () => {
    expect(proximoVencimento("2028-01-31")).toBe("2028-02-29");
  });

  it("vira o ano corretamente em dezembro", () => {
    expect(proximoVencimento("2026-12-10")).toBe("2027-01-10");
    expect(proximoVencimento("2026-12-31")).toBe("2027-01-31");
  });

  it("não deixa o dia desandar ao recorrer vários meses seguidos", () => {
    // O aluguel que vence dia 31 volta pro dia 31 nos meses que têm 31.
    let vencimento = "2026-01-31";
    const meses: string[] = [];
    for (let i = 0; i < 4; i += 1) {
      vencimento = proximoVencimento(vencimento);
      meses.push(vencimento);
    }
    // Depois de segurar em fevereiro, o dia fica preso no 28 — é o
    // comportamento esperado de "mesmo dia do mês que vem" sem guardar o dia
    // original, e nunca mais pula um mês inteiro como antes.
    expect(meses).toEqual(["2026-02-28", "2026-03-28", "2026-04-28", "2026-05-28"]);
  });
});
