import { describe, expect, it } from "vitest";
import {
  calcularJurosPercentual,
  calcularListaParcelas,
  calcularValorCobrado,
  faturamentoFormVazio,
  paraPagamentos,
  somarLinhasPagamento,
  type FaturamentoFormValues,
} from "./faturamento";
import type { JurosParcela } from "@/types/configuracao";

const jurosParcelas: JurosParcela[] = [
  { loja_id: "loja-1", numero_parcelas: 2, juros_percentual: 3 },
  { loja_id: "loja-1", numero_parcelas: 3, juros_percentual: 5 },
];

describe("calcularJurosPercentual", () => {
  it("acha o juros configurado pro número de parcelas", () => {
    expect(calcularJurosPercentual(jurosParcelas, 3)).toBe(5);
  });

  it("devolve 0 quando não tem juros configurado pra essa parcela (ex: 1x à vista)", () => {
    expect(calcularJurosPercentual(jurosParcelas, 1)).toBe(0);
  });

  it("devolve 0 quando o número de parcelas não está na lista", () => {
    expect(calcularJurosPercentual(jurosParcelas, 12)).toBe(0);
  });
});

describe("calcularValorCobrado", () => {
  it("sem juros, o valor cobrado é igual ao total", () => {
    expect(calcularValorCobrado(100, 0)).toBe(100);
  });

  it("aplica o percentual de juros sobre o total", () => {
    expect(calcularValorCobrado(100, 10)).toBe(110);
  });
});

describe("calcularListaParcelas", () => {
  it("divide o valor cobrado igualmente entre as parcelas", () => {
    const parcelas = calcularListaParcelas(300, 3, new Date(2026, 0, 15));
    expect(parcelas).toHaveLength(3);
    expect(parcelas.map((p) => p.valor)).toEqual([100, 100, 100]);
  });

  it("numera as parcelas a partir de 1 e vence uma por mês", () => {
    const parcelas = calcularListaParcelas(200, 2, new Date(2026, 0, 15));
    expect(parcelas[0].numero).toBe(1);
    expect(parcelas[1].numero).toBe(2);
    expect(parcelas[0].vencimento.getMonth()).toBe(1); // fevereiro
    expect(parcelas[1].vencimento.getMonth()).toBe(2); // março
  });

  it("com 1 parcela só, a 'lista' tem um item com o valor cheio e vence 1 mês depois", () => {
    const parcelas = calcularListaParcelas(150, 1, new Date(2026, 0, 15));
    expect(parcelas).toEqual([
      { numero: 1, vencimento: new Date(2026, 1, 15), valor: 150 },
    ]);
  });
});

describe("somarLinhasPagamento", () => {
  it("soma o valor de cada forma de pagamento", () => {
    const total = somarLinhasPagamento([
      { formaPagamento: "pix", valor: "50" },
      { formaPagamento: "cartao_credito", valor: "50.5" },
    ]);
    expect(total).toBe(100.5);
  });

  it("ignora campo vazio ou inválido como se fosse zero (não quebra a soma)", () => {
    const total = somarLinhasPagamento([
      { formaPagamento: "pix", valor: "" },
      { formaPagamento: "dinheiro", valor: "abc" },
      { formaPagamento: "cartao_debito", valor: "30" },
    ]);
    expect(total).toBe(30);
  });
});

describe("paraPagamentos", () => {
  const base: FaturamentoFormValues = faturamentoFormVazio(200);

  it("faturamento simples (não dividido): um pagamento só, com o valor cobrado (já com juros)", () => {
    const valores: FaturamentoFormValues = {
      ...base,
      dividirPagamento: false,
      formaPagamento: "pix",
    };
    expect(paraPagamentos(valores, 220)).toEqual([{ formaPagamento: "pix", valor: 220 }]);
  });

  it("faturamento dividido: um pagamento por linha preenchida", () => {
    const valores: FaturamentoFormValues = {
      ...base,
      dividirPagamento: true,
      linhasPagamento: [
        { formaPagamento: "pix", valor: "100" },
        { formaPagamento: "cartao_credito", valor: "100" },
      ],
    };
    expect(paraPagamentos(valores, 200)).toEqual([
      { formaPagamento: "pix", valor: 100 },
      { formaPagamento: "cartao_credito", valor: 100 },
    ]);
  });

  it("faturamento dividido: descarta linha com valor zero (ex: forma não usada)", () => {
    const valores: FaturamentoFormValues = {
      ...base,
      dividirPagamento: true,
      linhasPagamento: [
        { formaPagamento: "pix", valor: "200" },
        { formaPagamento: "cartao_credito", valor: "0" },
      ],
    };
    expect(paraPagamentos(valores, 200)).toEqual([{ formaPagamento: "pix", valor: 200 }]);
  });

  it("'a receber depois' (recebidoAgora false) sempre vira um pagamento só, mesmo se dividirPagamento estiver true", () => {
    const valores: FaturamentoFormValues = {
      ...base,
      recebidoAgora: false,
      dividirPagamento: true,
      formaPagamento: "pix",
    };
    expect(paraPagamentos(valores, 200)).toEqual([{ formaPagamento: "pix", valor: 200 }]);
  });
});
