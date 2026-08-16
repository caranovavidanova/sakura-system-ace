import { describe, expect, it } from "vitest";
import { melhorCotacaoPorFornecedor } from "./cotacoesPecas";
import type { CotacaoPeca } from "@/types/cotacaoPeca";

function cotacao(sobrescreve: Partial<CotacaoPeca>): CotacaoPeca {
  return {
    id: "cotacao-1",
    peca_id: "peca-1",
    fornecedor_id: "fornecedor-1",
    preco: 100,
    criado_em: new Date().toISOString(),
    ...sobrescreve,
  };
}

describe("melhorCotacaoPorFornecedor", () => {
  it("mantém só a cotação mais recente de cada fornecedor", () => {
    const resultado = melhorCotacaoPorFornecedor([
      cotacao({ id: "1", fornecedor_id: "a", preco: 200, criado_em: "2026-07-01T00:00:00Z" }),
      cotacao({ id: "2", fornecedor_id: "a", preco: 220, criado_em: "2026-08-01T00:00:00Z" }),
    ]);
    expect(resultado).toHaveLength(1);
    expect(resultado[0].id).toBe("2");
    expect(resultado[0].preco).toBe(220);
  });

  it("ordena o resultado do mais barato pro mais caro", () => {
    const resultado = melhorCotacaoPorFornecedor([
      cotacao({ id: "1", fornecedor_id: "a", preco: 200 }),
      cotacao({ id: "2", fornecedor_id: "b", preco: 180 }),
      cotacao({ id: "3", fornecedor_id: "c", preco: 250 }),
    ]);
    expect(resultado.map((c) => c.fornecedor_id)).toEqual(["b", "a", "c"]);
  });

  it("sem cotação nenhuma retorna lista vazia", () => {
    expect(melhorCotacaoPorFornecedor([])).toEqual([]);
  });
});
