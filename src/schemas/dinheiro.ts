/**
 * As contas de centavo, num lugar só.
 *
 * Por que este arquivo existe. A expressão `Math.round(valor * 100) / 100`
 * estava escrita **doze vezes** em sete arquivos diferentes — quatro delas
 * como funções privadas idênticas chamadas `arredondar`, copiadas de um
 * arquivo pro outro. Esse é exatamente o padrão que já custou cinco bugs de
 * dinheiro neste projeto (PROJETO_STATUS.md, seção 6, itens 35, 40 e 44:
 * "sempre que uma conta de dinheiro aparece em mais de um lugar, ela vai
 * divergir").
 *
 * Junto disso, a auditoria do esquema (guia de melhorias, TR-05.3) achou uma
 * soma de pagamentos que ia pro banco **sem** arredondar nenhum: somar
 * números já arredondados ainda produz cauda (0.1 + 0.2 dá
 * 0.30000000000000004), e a coluna `contas_receber.valor` era `numeric`
 * solto, então guardava a cauda inteira. Daí `somar()`, abaixo.
 *
 * ## Um limite conhecido, de propósito
 *
 * `arredondarCentavo()` mantém **exatamente** a mesma aritmética que já
 * estava espalhada pelo código, inclusive o canto conhecido dela: 1,005 vira
 * 1,00 (e não 1,01), porque 1,005 em binário fica um fio abaixo da metade.
 * Isso é herança do ponto flutuante, não deste arquivo.
 *
 * Foi mantido assim de propósito: trocar a regra de arredondamento mudaria
 * valores que hoje saem numa nota fiscal e num lançamento de caixa, e isso
 * é decisão dela, não efeito colateral de uma arrumação de código. Na
 * prática nenhum centavo se perde, porque quem divide valor (parcela,
 * rateio de pagamento) faz a última linha absorver a diferença — ver
 * `calcularListaParcelas` e `ratearPagamentos`, em `faturamento.ts`. O teste
 * `dinheiro.test.ts` fixa esse comportamento, pra que mudá-lo seja uma
 * escolha visível e não uma surpresa.
 */

/** Valor em reais → centavos inteiros. */
export function paraCentavos(valor: number): number {
  return Math.round(valor * 100);
}

/** Centavos inteiros → valor em reais. */
export function deCentavos(centavos: number): number {
  return centavos / 100;
}

/**
 * Arredonda pro centavo. É o jeito padrão de fechar qualquer conta de
 * dinheiro do sistema antes de mostrar na tela ou gravar no banco.
 */
export function arredondarCentavo(valor: number): number {
  return deCentavos(paraCentavos(valor));
}

/**
 * Soma valores em dinheiro e fecha no centavo.
 *
 * Use isto em vez de `.reduce((a, b) => a + b, 0)` sempre que o resultado da
 * soma for gravado ou comparado: somar em ponto flutuante deixa cauda mesmo
 * quando cada pedaço já está arredondado.
 */
export function somar(valores: readonly number[]): number {
  return arredondarCentavo(valores.reduce((soma, valor) => soma + valor, 0));
}

/**
 * Valor em reais como a tela mostra: "R$ 1.234,56".
 *
 * Estava copiado, idêntico, em mais de dez arquivos de tela — a mesma
 * duplicação que motivou este arquivo, só que de formatação e não de conta.
 * Quem precisa de um valor formatado importa daqui; as telas que ainda têm a
 * cópia antiga vão trocando conforme forem mexidas.
 */
export function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
