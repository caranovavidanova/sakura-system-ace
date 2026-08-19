import { describe, expect, it } from "vitest";
import type { ClienteFormValues } from "./cliente";
import { paraVeiculosPreenchidos, veiculoFormVazio } from "./cliente";

function veiculo(sobrescrever: Partial<ClienteFormValues["veiculos"][number]> = {}) {
  return { ...veiculoFormVazio, ...sobrescrever };
}

describe("paraVeiculosPreenchidos", () => {
  it("mantém um veículo preenchido mesmo sem placa", () => {
    const resultado = paraVeiculosPreenchidos([veiculo({ marca: "Hyundai", modelo: "HB20" })]);
    expect(resultado).toHaveLength(1);
    expect(resultado[0].marca).toBe("Hyundai");
    expect(resultado[0].placa).toBe("");
  });

  it("descarta a linha de veículo totalmente vazia (padrão do formulário novo)", () => {
    expect(paraVeiculosPreenchidos([veiculo()])).toHaveLength(0);
  });

  it("mantém um veículo preenchido só com placa", () => {
    expect(paraVeiculosPreenchidos([veiculo({ placa: "ABC1234" })])).toHaveLength(1);
  });

  it("mantém um veículo já existente (com id) mesmo sem placa", () => {
    const resultado = paraVeiculosPreenchidos([
      veiculo({ id: "veiculo-1", marca: "Fiat", modelo: "Uno" }),
    ]);
    expect(resultado).toEqual([
      expect.objectContaining({ id: "veiculo-1", marca: "Fiat", modelo: "Uno" }),
    ]);
  });
});
