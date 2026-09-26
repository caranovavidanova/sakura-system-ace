import { describe, expect, it } from "vitest";
import {
  apelidoComputadorSchema,
  compararVersoes,
  contarMaisAntigos,
  DIAS_PARA_CONSIDERAR_EM_USO,
  nomeDoComputador,
  separarComputadores,
  situacaoDoComputador,
} from "./computadores";

// Meio-dia: o mesmo dia de calendário em São Paulo e em UTC, os dois fusos
// em que a suíte roda (§6 item 48).
const HOJE = new Date("2026-09-26T12:00:00Z");
const diasAtras = (n: number) => new Date(HOJE.getTime() - n * 86_400_000).toISOString();

describe("compararVersoes", () => {
  it("compara por número, não por texto: 0.9.9 é mais antiga que 0.9.10", () => {
    expect(compararVersoes("0.9.9", "0.9.10")).toBeLessThan(0);
    expect(compararVersoes("0.10.0", "0.9.99")).toBeGreaterThan(0);
    expect(compararVersoes("1.0.0", "0.99.99")).toBeGreaterThan(0);
  });

  it("iguais dão zero", () => {
    expect(compararVersoes("0.9.44", "0.9.44")).toBe(0);
  });

  it("versão fora do formato vale como a mais antiga — o erro seguro é parecer atrasada", () => {
    expect(compararVersoes("desconhecida", "0.0.1")).toBeLessThan(0);
    expect(compararVersoes("0.9", "0.0.1")).toBeLessThan(0);
  });
});

describe("situacaoDoComputador", () => {
  it("visto hoje, na mesma versão: em uso e em dia", () => {
    expect(situacaoDoComputador({ visto_em: diasAtras(0), versao_app: "0.9.44" }, HOJE, "0.9.44")).toEqual({
      diasSemAparecer: 0,
      emUso: true,
      maisAntigaQueEste: false,
    });
  });

  it("versão mais antiga que a deste computador aparece como tal", () => {
    const s = situacaoDoComputador({ visto_em: diasAtras(2), versao_app: "0.9.43" }, HOJE, "0.9.44");
    expect(s.maisAntigaQueEste).toBe(true);
    expect(s.diasSemAparecer).toBe(2);
  });

  it("versão MAIS NOVA que a deste (um computador no canal de teste) não é atraso", () => {
    expect(
      situacaoDoComputador({ visto_em: diasAtras(0), versao_app: "0.9.45" }, HOJE, "0.9.44").maisAntigaQueEste,
    ).toBe(false);
  });

  it(`deixa de contar como em uso a partir de ${DIAS_PARA_CONSIDERAR_EM_USO} dias sem aparecer`, () => {
    const limite = DIAS_PARA_CONSIDERAR_EM_USO;
    expect(situacaoDoComputador({ visto_em: diasAtras(limite - 1), versao_app: "0.9.44" }, HOJE, null).emUso).toBe(true);
    expect(situacaoDoComputador({ visto_em: diasAtras(limite), versao_app: "0.9.44" }, HOJE, null).emUso).toBe(false);
  });

  it("sem saber a versão deste computador (fora do Electron), ninguém é marcado como atrasado", () => {
    expect(
      situacaoDoComputador({ visto_em: diasAtras(0), versao_app: "0.0.1" }, HOJE, null).maisAntigaQueEste,
    ).toBe(false);
  });
});

describe("nomeDoComputador", () => {
  it("o apelido ganha do nome da máquina; sem nenhum dos dois, diz que não tem nome", () => {
    expect(nomeDoComputador({ apelido: "Balcão", nome_maquina: "DESKTOP-1" })).toBe("Balcão");
    expect(nomeDoComputador({ apelido: "   ", nome_maquina: "DESKTOP-1" })).toBe("DESKTOP-1");
    expect(nomeDoComputador({ apelido: null, nome_maquina: "" })).toBe("Computador sem nome");
  });
});

describe("separarComputadores e contarMaisAntigos", () => {
  const lista = [
    { id: "velho", visto_em: diasAtras(45), versao_app: "0.9.30" },
    { id: "balcao", visto_em: diasAtras(0), versao_app: "0.9.44" },
    { id: "notebook", visto_em: diasAtras(3), versao_app: "0.9.42" },
  ];

  it("em uso primeiro, do mais recente; sumido à parte", () => {
    const { emUso, sumidos } = separarComputadores(lista, HOJE);
    expect(emUso.map((c) => c.id)).toEqual(["balcao", "notebook"]);
    expect(sumidos.map((c) => c.id)).toEqual(["velho"]);
  });

  it("conta como atrasado só quem está EM USO — o sumido não entra na conta", () => {
    expect(contarMaisAntigos(lista, HOJE, "0.9.44")).toBe(1);
  });
});

describe("apelidoComputadorSchema", () => {
  it("aceita em branco (volta o nome da máquina) e recusa mais de 60 letras", () => {
    expect(apelidoComputadorSchema.safeParse({ apelido: "" }).success).toBe(true);
    expect(apelidoComputadorSchema.safeParse({ apelido: "a".repeat(61) }).success).toBe(false);
  });
});
