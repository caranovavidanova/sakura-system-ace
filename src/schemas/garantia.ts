import { diaLocal, diasEntre } from "@/lib/datas";

/**
 * Até quando vale a garantia dada ao cliente na venda de uma peça.
 *
 * A garantia não tem tabela própria (PROJETO_STATUS.md, seção 5): ela sai da
 * data em que a OS foi fechada + o prazo cadastrado na peça. Esta conta
 * aparece em duas telas — Garantias e a ficha do veículo — e mora aqui pra
 * as duas darem sempre o mesmo dia (a lição do item 40 da seção 6: conta
 * repetida em tela diverge).
 *
 * Tudo em dia de calendário, no fuso de quem usa:
 *   • o dia de partida é o dia LOCAL do fechamento — uma OS fechada às 22h
 *     conta a partir daquele dia, não do dia seguinte em UTC (item 34);
 *   • a garantia vale o dia do vencimento INTEIRO, e só é "vencida" a partir
 *     do dia seguinte. Antes a tela comparava o instante exato, e uma peça
 *     vendida às 15h deixava de estar na garantia às 15h do último dia — o
 *     que ninguém espera de um "vence em 26/12".
 */
export function vencimentoDaGarantia(dataFechamentoIso: string, prazoDias: number): string {
  const [ano, mes, dia] = diaLocal(dataFechamentoIso).split("-").map(Number);
  // O construtor de Date "transborda" o dia sozinho (31/01 + 30 = 02/03), que
  // aqui é exatamente o que se quer: somar dias corridos.
  return diaLocal(new Date(ano, mes - 1, dia + prazoDias));
}

/** `vencimento` e `hoje` como "YYYY-MM-DD" — comparação de texto basta nesse formato. */
export function garantiaVencida(vencimento: string, hoje: string): boolean {
  return vencimento < hoje;
}

/** Dias de garantia que ainda restam (0 no último dia; negativo depois de vencida). */
export function diasAteVencer(vencimento: string, hoje: string): number {
  return diasEntre(hoje, vencimento);
}
