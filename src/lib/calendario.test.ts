import { describe, expect, it } from "vitest";
import { chaveData, diasDoCalendario } from "./calendario";

describe("chaveData", () => {
  it("usa o fuso local, não UTC", () => {
    // 31/08 às 22h no horário de Brasília já é 01/09 em UTC — cortar o
    // toISOString aqui devolveria o dia errado (mesmo bug do item 34 da
    // seção 6 do PROJETO_STATUS).
    expect(chaveData(new Date(2026, 7, 31, 22, 49))).toBe("2026-08-31");
  });
});

describe("diasDoCalendario", () => {
  it("devolve sempre 42 dias (6 semanas)", () => {
    for (let mes = 0; mes < 12; mes++) {
      expect(diasDoCalendario(2026, mes)).toHaveLength(42);
    }
  });

  it("começa num domingo e cobre o mês inteiro", () => {
    const dias = diasDoCalendario(2026, 7); // agosto/2026
    expect(dias[0].getDay()).toBe(0);
    const doMes = dias.filter((d) => d.getMonth() === 7);
    expect(doMes).toHaveLength(31);
  });

  it("mostra a sobra do mês seguinte — é o caso da conta que vence dia 1º", () => {
    // Agosto/2026 termina numa segunda, então o resto da grade é setembro.
    const chaves = diasDoCalendario(2026, 7).map(chaveData);
    expect(chaves).toContain("2026-09-01");
    expect(chaves).toContain("2026-09-05");
  });

  it("atravessa a virada de ano sem quebrar", () => {
    const chaves = diasDoCalendario(2026, 11).map(chaveData);
    expect(chaves).toContain("2026-12-31");
    expect(chaves).toContain("2027-01-01");
  });
});
