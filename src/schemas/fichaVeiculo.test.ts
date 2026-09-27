import { describe, expect, it } from "vitest";
import {
  diasDeVisita,
  kmMaisRecente,
  linhaDoTempo,
  mediaDeDiasEntreVisitas,
  ordensComKmMenorQueAnterior,
  pecasNaGarantia,
  rodagemEstimada,
  tempoDesde,
  totalGastoNoVeiculo,
  type ItemDaFicha,
  type OrdemDaFicha,
} from "./fichaVeiculo";

// Sempre às 15h de Brasília (18h em UTC): o mesmo dia nos dois fusos em que
// a suíte roda, pra nenhum teste daqui passar só num deles.
function em(dia: string): string {
  return `${dia}T15:00:00-03:00`;
}

let contador = 0;

function ordem(dados: Partial<OrdemDaFicha> & { dia: string }): OrdemDaFicha {
  contador++;
  const { dia, ...resto } = dados;
  return {
    id: `os${contador}`,
    numero: contador,
    loja_id: "loja",
    cliente_id: "cli",
    status: "faturada",
    km_entrada: null,
    data_abertura: em(dia),
    data_fechamento: em(dia),
    itens: [],
    ...resto,
  };
}

function item(dados: Partial<ItemDaFicha>): ItemDaFicha {
  contador++;
  return {
    id: `item${contador}`,
    tipo: "servico",
    peca_id: null,
    descricao: "Alinhamento",
    quantidade: 1,
    preco_unitario: 100,
    desconto: 0,
    peca: null,
    ...dados,
  };
}

describe("linhaDoTempo", () => {
  it("põe a visita mais recente primeiro, sem mexer na lista original", () => {
    const antiga = ordem({ dia: "2026-01-10" });
    const nova = ordem({ dia: "2026-09-10" });
    const lista = [antiga, nova];
    expect(linhaDoTempo(lista).map((o) => o.id)).toEqual([nova.id, antiga.id]);
    expect(lista[0]).toBe(antiga);
  });
});

describe("kmMaisRecente", () => {
  it("usa a OS mais recente com KM, não o maior KM já digitado", () => {
    // O 999.999 é o clássico dígito a mais: se o maior ganhasse, ele ficaria
    // colado no carro pra sempre.
    const ordens = [
      ordem({ dia: "2026-03-01", km_entrada: 999999 }),
      ordem({ dia: "2026-06-01", km_entrada: 52000 }),
      ordem({ dia: "2026-09-01", km_entrada: null }),
    ];
    expect(kmMaisRecente(ordens, 40000)).toEqual({ km: 52000, dia: "2026-06-01" });
  });

  it("cai no KM do cadastro quando nenhuma OS anotou KM", () => {
    expect(kmMaisRecente([ordem({ dia: "2026-09-01" })], 40000)).toEqual({ km: 40000, dia: null });
    expect(kmMaisRecente([], null)).toBeNull();
  });
});

describe("ordensComKmMenorQueAnterior", () => {
  it("aponta a visita cujo KM desceu em relação à anterior com KM", () => {
    const a = ordem({ dia: "2026-01-01", km_entrada: 50000 });
    const semKm = ordem({ dia: "2026-02-01", km_entrada: null });
    const b = ordem({ dia: "2026-03-01", km_entrada: 5300 });
    const c = ordem({ dia: "2026-05-01", km_entrada: 56000 });
    expect([...ordensComKmMenorQueAnterior([c, semKm, b, a])]).toEqual([b.id]);
  });
});

describe("rodagemEstimada", () => {
  it("estima pela primeira e pela última visita com KM, arredondando pra dezena", () => {
    const ordens = [
      ordem({ dia: "2026-01-01", km_entrada: 40000 }),
      ordem({ dia: "2026-04-11", km_entrada: 44000 }), // 100 dias depois
    ];
    // 4.000 km em 100 dias = 1.200 km a cada 30 dias
    expect(rodagemEstimada(ordens)).toEqual({ tipo: "estimada", kmPorMes: 1200 });
  });

  it("recusa com uma visita só", () => {
    const resultado = rodagemEstimada([ordem({ dia: "2026-01-01", km_entrada: 40000 })]);
    expect(resultado.tipo).toBe("indisponivel");
  });

  it("recusa quando as visitas estão a menos de um mês uma da outra", () => {
    const resultado = rodagemEstimada([
      ordem({ dia: "2026-01-01", km_entrada: 40000 }),
      ordem({ dia: "2026-01-20", km_entrada: 41000 }),
    ]);
    expect(resultado).toMatchObject({ tipo: "indisponivel", motivo: expect.stringMatching(/menos de um mês/) });
  });

  it("recusa quando algum KM desceu — a média de um erro de digitação é mentira", () => {
    const resultado = rodagemEstimada([
      ordem({ dia: "2026-01-01", km_entrada: 40000 }),
      ordem({ dia: "2026-03-01", km_entrada: 4200 }),
      ordem({ dia: "2026-06-01", km_entrada: 46000 }),
    ]);
    expect(resultado).toMatchObject({ tipo: "indisponivel", motivo: expect.stringMatching(/menor/) });
  });

  it("recusa quando o KM é o mesmo em todas as visitas", () => {
    const resultado = rodagemEstimada([
      ordem({ dia: "2026-01-01", km_entrada: 40000 }),
      ordem({ dia: "2026-06-01", km_entrada: 40000 }),
    ]);
    expect(resultado).toMatchObject({ tipo: "indisponivel", motivo: expect.stringMatching(/mesmo/) });
  });
});

describe("diasDeVisita e mediaDeDiasEntreVisitas", () => {
  it("duas OS no mesmo dia são uma visita só", () => {
    const ordens = [
      ordem({ dia: "2026-01-01" }),
      ordem({ dia: "2026-01-01" }),
      ordem({ dia: "2026-03-02" }),
      ordem({ dia: "2026-05-01" }),
    ];
    expect(diasDeVisita(ordens)).toEqual(["2026-01-01", "2026-03-02", "2026-05-01"]);
    // 120 dias entre a primeira e a última, em 2 intervalos
    expect(mediaDeDiasEntreVisitas(ordens)).toBe(60);
  });

  it("sem pelo menos duas visitas, não há média", () => {
    expect(mediaDeDiasEntreVisitas([ordem({ dia: "2026-01-01" })])).toBeNull();
    expect(mediaDeDiasEntreVisitas([])).toBeNull();
  });
});

describe("totalGastoNoVeiculo", () => {
  it("soma só as OS faturadas, com desconto, fechando no centavo", () => {
    const ordens = [
      ordem({
        dia: "2026-01-01",
        itens: [item({ quantidade: 3, preco_unitario: 0.1 }), item({ preco_unitario: 0.2 })],
      }),
      ordem({ dia: "2026-02-01", itens: [item({ preco_unitario: 500, desconto: 50 })] }),
      ordem({ dia: "2026-03-01", status: "em_andamento", itens: [item({ preco_unitario: 999 })] }),
      ordem({ dia: "2026-03-01", status: "concluida", itens: [item({ preco_unitario: 999 })] }),
    ];
    // 0,30 + 0,20 + 450,00 — sem cauda de ponto flutuante
    expect(totalGastoNoVeiculo(ordens)).toBe(450.5);
  });
});

describe("pecasNaGarantia", () => {
  const pneu = (prazo: number | null) =>
    item({ tipo: "peca", peca_id: "p1", descricao: "Pneu 175/70 R14", quantidade: 2, peca: { prazo_garantia_dias: prazo } });

  it("lista só peça com prazo, em OS fechada, da que vence primeiro à última", () => {
    const antiga = ordem({ dia: "2026-08-01", itens: [pneu(90)] });
    const nova = ordem({ dia: "2026-09-01", itens: [pneu(30), item({})] });
    const aberta = ordem({ dia: "2026-09-20", data_fechamento: null, status: "em_andamento", itens: [pneu(90)] });
    const semPrazo = ordem({ dia: "2026-09-01", itens: [pneu(null)] });

    const { emVigor, vencidas } = pecasNaGarantia([antiga, nova, aberta, semPrazo], "2026-09-27");
    expect(vencidas).toBe(0);
    expect(emVigor.map((p) => [p.ordemId, p.vencimento, p.diasRestantes])).toEqual([
      [nova.id, "2026-10-01", 4],
      [antiga.id, "2026-10-30", 33],
    ]);
  });

  it("separa as que já venceram e vale o último dia inteiro", () => {
    const ordens = [
      ordem({ dia: "2026-01-01", itens: [pneu(30)] }), // venceu em 31/01
      ordem({ dia: "2026-08-28", itens: [pneu(30)] }), // vence hoje
    ];
    const { emVigor, vencidas } = pecasNaGarantia(ordens, "2026-09-27");
    expect(vencidas).toBe(1);
    expect(emVigor).toHaveLength(1);
    expect(emVigor[0].diasRestantes).toBe(0);
  });
});

describe("tempoDesde", () => {
  it("troca de escala conforme a distância", () => {
    expect(tempoDesde(0)).toBe("hoje");
    expect(tempoDesde(1)).toBe("ontem");
    expect(tempoDesde(12)).toBe("há 12 dias");
    expect(tempoDesde(59)).toBe("há 59 dias");
    expect(tempoDesde(243)).toBe("há 8 meses");
    expect(tempoDesde(800)).toBe("há 2 anos");
  });
});
