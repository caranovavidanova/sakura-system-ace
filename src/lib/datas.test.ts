import { describe, expect, it } from "vitest";
import { diaLocal, hojeLocal } from "./datas";

describe("diaLocal", () => {
  it("devolve o dia no formato YYYY-MM-DD", () => {
    expect(diaLocal("2026-09-02T14:00:00.000Z")).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("usa o dia do fuso local, não o de UTC", () => {
    // 22h49 do dia 31/08 no Brasil já é 01/09 em UTC. Cortar o toISOString()
    // arquivaria isso no mês seguinte — foi o que motivou este arquivo.
    const fusoOriginal = process.env.TZ;
    process.env.TZ = "America/Sao_Paulo";
    try {
      const instante = "2026-09-01T01:49:00.000Z";
      expect(diaLocal(instante)).toBe("2026-08-31");
      expect(new Date(instante).toISOString().slice(0, 10)).toBe("2026-09-01");
    } finally {
      process.env.TZ = fusoOriginal;
    }
  });

  it("aceita tanto uma data quanto o texto dela", () => {
    const data = new Date("2026-09-02T14:00:00.000Z");
    expect(diaLocal(data)).toBe(diaLocal(data.toISOString()));
  });

  it("hojeLocal responde o dia de hoje", () => {
    expect(hojeLocal()).toBe(new Date().toLocaleDateString("sv-SE"));
  });
});
