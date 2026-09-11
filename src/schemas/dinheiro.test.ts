import { describe, expect, it } from "vitest";
import { arredondarCentavo, deCentavos, paraCentavos, somar } from "./dinheiro";

describe("paraCentavos / deCentavos", () => {
  it("vai e volta sem perder centavo", () => {
    expect(paraCentavos(12.34)).toBe(1234);
    expect(deCentavos(1234)).toBe(12.34);
  });

  it("devolve centavo inteiro, nunca fracionado", () => {
    expect(Number.isInteger(paraCentavos(19.999))).toBe(true);
  });
});

describe("arredondarCentavo", () => {
  it("corta a cauda de ponto flutuante", () => {
    // Os dois valores abaixo apareceram de verdade: o primeiro é o tipo de
    // número que a soma de pagamentos produzia e ia pro banco (TR-05.3), e o
    // segundo é o bug de arredondamento do item 4 da seção 6 do status.
    expect(arredondarCentavo(1234.5600000000002)).toBe(1234.56);
    expect(arredondarCentavo(110.00000000000001)).toBe(110);
    expect(arredondarCentavo(0.1 + 0.2)).toBe(0.3);
  });

  it("não mexe em valor que já está no centavo", () => {
    expect(arredondarCentavo(60)).toBe(60);
    expect(arredondarCentavo(1113.5)).toBe(1113.5);
  });

  it("mantém o canto conhecido do ponto flutuante, de propósito", () => {
    // 1,005 e 8,165 em binário ficam um fio ABAIXO da metade, então descem.
    // Este teste existe pra fixar o comportamento que o sistema já tinha —
    // mudar isso alteraria valor de nota fiscal e de caixa, e é decisão da
    // usuária, não efeito colateral. Ver o comentário no topo de dinheiro.ts.
    expect(arredondarCentavo(1.005)).toBe(1);
    expect(arredondarCentavo(8.165)).toBe(8.16);
    // Já 2,675 sobe, porque cai do outro lado da metade em binário.
    expect(arredondarCentavo(2.675)).toBe(2.68);
  });
});

describe("somar", () => {
  it("soma sem deixar cauda", () => {
    expect(somar([0.1, 0.2])).toBe(0.3);
    expect(somar([1113.5, 121.06])).toBe(1234.56);
  });

  it("é o que faltava na soma de pagamentos do faturamento", () => {
    // Caso real: OS paga em duas formas. Cada pedaço já vem arredondado, mas
    // a soma dos dois em ponto flutuante deixava cauda — e essa cauda ia pro
    // banco, porque contas_receber.valor era numeric sem casas declaradas.
    const pagamentos = [617.28, 617.28];
    expect(somar(pagamentos)).toBe(1234.56);
    expect(somar([0.07, 0.07, 0.07])).toBe(0.21);
  });

  it("lista vazia soma zero", () => {
    expect(somar([])).toBe(0);
  });
});
