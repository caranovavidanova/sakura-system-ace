import { describe, expect, it } from "vitest";
import { margemAPartirDoPreco, precoAPartirDaMargem } from "./peca";

describe("precoAPartirDaMargem", () => {
  it("calcula o preço final a partir do custo e da margem", () => {
    // custo 100, margem 20% -> preço 120
    expect(precoAPartirDaMargem("100", "20")).toBe("120");
  });

  it("arredonda pra 2 casas decimais", () => {
    // custo 33.33, margem 15% -> 38.3295 -> arredonda pra 38.33
    expect(precoAPartirDaMargem("33.33", "15")).toBe("38.33");
  });

  it("devolve null se o custo estiver vazio (não dá pra calcular ainda)", () => {
    expect(precoAPartirDaMargem("", "20")).toBeNull();
  });

  it("devolve null se a margem não for um número válido", () => {
    expect(precoAPartirDaMargem("100", "")).toBeNull();
    expect(precoAPartirDaMargem("100", "abc")).toBeNull();
  });

  it("aceita margem negativa (venda abaixo do custo, caso raro mas válido)", () => {
    expect(precoAPartirDaMargem("100", "-10")).toBe("90");
  });
});

describe("margemAPartirDoPreco", () => {
  it("calcula a margem % a partir do custo e do preço final", () => {
    // custo 100, preço 120 -> 20% de margem
    expect(margemAPartirDoPreco("100", "120")).toBe("20");
  });

  it("arredonda pra 1 casa decimal", () => {
    expect(margemAPartirDoPreco("30", "40")).toBe("33.3");
  });

  it("devolve string vazia se o custo for zero ou negativo (não dá pra calcular %)", () => {
    expect(margemAPartirDoPreco("0", "120")).toBe("");
    expect(margemAPartirDoPreco("-10", "120")).toBe("");
  });

  it("devolve string vazia se custo ou preço estiverem vazios", () => {
    expect(margemAPartirDoPreco("", "120")).toBe("");
    expect(margemAPartirDoPreco("100", "")).toBe("");
  });

  it("ida e volta bate: preço calculado da margem, e a margem calculada desse preço, é a mesma", () => {
    const preco = precoAPartirDaMargem("80", "25");
    expect(preco).not.toBeNull();
    expect(margemAPartirDoPreco("80", preco as string)).toBe("25");
  });
});
