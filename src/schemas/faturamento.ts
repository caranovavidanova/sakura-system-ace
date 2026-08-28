import { z } from "zod";
import type { PagamentoOrdem } from "@/lib/ordensServico";
import type { JurosParcela } from "@/types/configuracao";

const linhaPagamentoSchema = z.object({
  formaPagamento: z.string(),
  valor: z.string(),
  // Parcelas daquela forma de pagamento — só faz sentido no cartão de
  // crédito; nas outras formas fica sempre "1" (à vista).
  parcelas: z.string(),
});

export const faturamentoFormSchema = z.object({
  recebidoAgora: z.boolean(),
  previsaoRecebimento: z.string(),
  dividirPagamento: z.boolean(),
  formaPagamento: z.string(),
  parcelas: z.string(),
  linhasPagamento: z.array(linhaPagamentoSchema),
});

export type FaturamentoFormValues = z.infer<typeof faturamentoFormSchema>;
export type LinhaPagamentoValues = FaturamentoFormValues["linhasPagamento"][number];

function hojeIso(): string {
  const hoje = new Date();
  return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(
    hoje.getDate(),
  ).padStart(2, "0")}`;
}

export function faturamentoFormVazio(total: number): FaturamentoFormValues {
  return {
    recebidoAgora: true,
    previsaoRecebimento: hojeIso(),
    dividirPagamento: false,
    formaPagamento: "pix",
    parcelas: "1",
    linhasPagamento: [
      { formaPagamento: "pix", valor: String(total), parcelas: "1" },
      { formaPagamento: "cartao_credito", valor: "0", parcelas: "1" },
    ],
  };
}

// --- Cálculo de juros/parcelas — funções puras, sem depender do React,
// extraídas do componente pra ficar fácil de olhar (e testar) isolado. ---

export function calcularJurosPercentual(
  jurosParcelas: JurosParcela[],
  parcelas: number,
): number {
  return jurosParcelas.find((j) => j.numero_parcelas === parcelas)?.juros_percentual ?? 0;
}

// Arredonda pra 2 casas — sem isso, `total * (1 + juros / 100)` pode sair
// tipo 110.00000000000001 em ponto flutuante (ex: 100 * 1.1), um erro de
// centavo silencioso que só apareceria numa comparação exata mais adiante
// (o teste automatizado pegou esse caso — ver faturamento.test.ts).
export function calcularValorCobrado(total: number, jurosPercentual: number): number {
  return Math.round(total * (1 + jurosPercentual / 100) * 100) / 100;
}

function addMeses(data: Date, meses: number): Date {
  const nova = new Date(data);
  nova.setMonth(nova.getMonth() + meses);
  return nova;
}

export interface ParcelaCalculada {
  numero: number;
  vencimento: Date;
  valor: number;
}

export function calcularListaParcelas(
  valorCobrado: number,
  parcelas: number,
  apartirDe: Date = new Date(),
): ParcelaCalculada[] {
  const valorParcela = valorCobrado / parcelas;
  return Array.from({ length: parcelas }, (_, i) => ({
    numero: i + 1,
    vencimento: addMeses(apartirDe, i + 1),
    valor: valorParcela,
  }));
}

export function somarLinhasPagamento(linhas: LinhaPagamentoValues[]): number {
  return linhas.reduce((soma, linha) => soma + (Number(linha.valor) || 0), 0);
}

// Só o cartão de crédito parcela — as outras formas são sempre à vista
// (Pix, dinheiro e débito saem da conta do cliente de uma vez só).
export function formaPermiteParcelar(formaPagamento: string): boolean {
  return formaPagamento === "cartao_credito";
}

export function parcelasDaLinha(linha: LinhaPagamentoValues): number {
  if (!formaPermiteParcelar(linha.formaPagamento)) return 1;
  const parcelas = Math.trunc(Number(linha.parcelas));
  return parcelas > 0 ? parcelas : 1;
}

export interface LinhaPagamentoCalculada {
  formaPagamento: string;
  /** O que o cliente combinou de pagar naquela forma, antes de juros. */
  valorBase: number;
  parcelas: number;
  jurosPercentual: number;
  /** Valor que entra de verdade no Caixa — o base já com os juros do cartão. */
  valorCobrado: number;
}

// No pagamento dividido, o juro do parcelamento incide só sobre a parte que
// passou no cartão — não sobre a OS inteira. Ex: R$300 no Pix + R$1.195 no
// cartão em 3x cobra juros só sobre os R$1.195, igual à maquininha.
export function calcularLinhasPagamento(
  linhas: LinhaPagamentoValues[],
  jurosParcelas: JurosParcela[],
): LinhaPagamentoCalculada[] {
  return linhas.map((linha) => {
    const valorBase = Number(linha.valor) || 0;
    const parcelas = parcelasDaLinha(linha);
    const jurosPercentual = parcelas > 1 ? calcularJurosPercentual(jurosParcelas, parcelas) : 0;
    return {
      formaPagamento: linha.formaPagamento,
      valorBase,
      parcelas,
      jurosPercentual,
      valorCobrado: calcularValorCobrado(valorBase, jurosPercentual),
    };
  });
}

export function somarLinhasCobradas(
  linhas: LinhaPagamentoValues[],
  jurosParcelas: JurosParcela[],
): number {
  const soma = calcularLinhasPagamento(linhas, jurosParcelas).reduce(
    (total, linha) => total + linha.valorCobrado,
    0,
  );
  return Math.round(soma * 100) / 100;
}

// `ordens_servico.parcelas` é um número só, então no pagamento dividido
// grava o maior parcelamento usado (na prática, o do cartão de crédito) —
// é o que faz sentido mostrar como "OS parcelada em Nx".
export function parcelasDaOrdem(valores: FaturamentoFormValues): number {
  if (valores.recebidoAgora && valores.dividirPagamento) {
    return valores.linhasPagamento
      .filter((linha) => (Number(linha.valor) || 0) > 0)
      .reduce((maior, linha) => Math.max(maior, parcelasDaLinha(linha)), 1);
  }
  const parcelas = Math.trunc(Number(valores.parcelas));
  return parcelas > 0 ? parcelas : 1;
}

export function paraPagamentos(
  valores: FaturamentoFormValues,
  valorCobrado: number,
  jurosParcelas: JurosParcela[] = [],
): PagamentoOrdem[] {
  if (valores.recebidoAgora && valores.dividirPagamento) {
    return calcularLinhasPagamento(valores.linhasPagamento, jurosParcelas)
      .filter((linha) => linha.valorBase > 0)
      .map((linha) => ({ formaPagamento: linha.formaPagamento, valor: linha.valorCobrado }));
  }
  return [{ formaPagamento: valores.formaPagamento, valor: valorCobrado }];
}

// Divide um total (ex: só a parte de peça de uma OS, que é o que a NFC-e
// representa) entre as formas de pagamento já usadas, mantendo a proporção
// de cada uma. O rateio é feito sobre a SOMA das formas, não sobre o total
// da OS: com juros de cartão, o dinheiro que entrou é maior que o total dos
// itens, e usar o total da OS como divisor podia fazer uma linha estourar o
// total da nota (deixando a última negativa, que a SEFAZ rejeita).
// A última linha absorve a diferença de arredondamento, pra soma bater
// exatamente com o total pedido.
export function ratearPagamentos<T extends { valor: number }>(
  pagamentos: T[],
  totalDestino: number,
): T[] {
  const somaOriginal = pagamentos.reduce((soma, p) => soma + p.valor, 0);
  if (pagamentos.length === 0 || somaOriginal <= 0) return [];

  const fator = totalDestino / somaOriginal;
  const rateados = pagamentos.map((p) => ({
    ...p,
    valor: Math.round(p.valor * fator * 100) / 100,
  }));

  const somaSemUltima = rateados.slice(0, -1).reduce((soma, p) => soma + p.valor, 0);
  rateados[rateados.length - 1].valor = Math.round((totalDestino - somaSemUltima) * 100) / 100;

  return rateados;
}
