import { z } from "zod";
import type { PagamentoOrdem } from "@/lib/ordensServico";
import type { JurosParcela } from "@/types/configuracao";

const linhaPagamentoSchema = z.object({
  formaPagamento: z.string(),
  valor: z.string(),
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
      { formaPagamento: "pix", valor: String(total) },
      { formaPagamento: "cartao_credito", valor: "0" },
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

export function paraPagamentos(
  valores: FaturamentoFormValues,
  valorCobrado: number,
): PagamentoOrdem[] {
  if (valores.recebidoAgora && valores.dividirPagamento) {
    return valores.linhasPagamento
      .filter((linha) => Number(linha.valor) > 0)
      .map((linha) => ({ formaPagamento: linha.formaPagamento, valor: Number(linha.valor) }));
  }
  return [{ formaPagamento: valores.formaPagamento, valor: valorCobrado }];
}
