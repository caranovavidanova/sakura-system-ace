import { describe, expect, it } from "vitest";
import { diasAteVencer, garantiaVencida, vencimentoDaGarantia } from "./garantia";

describe("vencimentoDaGarantia", () => {
  it("soma o prazo em dias corridos a partir do dia do fechamento", () => {
    expect(vencimentoDaGarantia("2026-09-10T15:00:00-03:00", 90)).toBe("2026-12-09");
    expect(vencimentoDaGarantia("2026-01-31T15:00:00-03:00", 30)).toBe("2026-03-02");
  });

  it("parte do dia LOCAL do fechamento, não do dia em UTC", () => {
    // 22h do dia 31/08 no Brasil já é 01/09 em UTC. A garantia é do dia 31.
    const fusoOriginal = process.env.TZ;
    process.env.TZ = "America/Sao_Paulo";
    try {
      expect(vencimentoDaGarantia("2026-09-01T01:00:00.000Z", 1)).toBe("2026-09-01");
    } finally {
      process.env.TZ = fusoOriginal;
    }
  });

  it("prazo zero vence no próprio dia", () => {
    expect(vencimentoDaGarantia("2026-09-10T15:00:00-03:00", 0)).toBe("2026-09-10");
  });
});

describe("garantiaVencida", () => {
  it("vale o dia do vencimento inteiro, e só vence no dia seguinte", () => {
    expect(garantiaVencida("2026-12-09", "2026-12-08")).toBe(false);
    expect(garantiaVencida("2026-12-09", "2026-12-09")).toBe(false);
    expect(garantiaVencida("2026-12-09", "2026-12-10")).toBe(true);
  });
});

describe("diasAteVencer", () => {
  it("é zero no último dia e negativo depois", () => {
    expect(diasAteVencer("2026-12-09", "2026-12-01")).toBe(8);
    expect(diasAteVencer("2026-12-09", "2026-12-09")).toBe(0);
    expect(diasAteVencer("2026-12-09", "2026-12-12")).toBe(-3);
  });
});
