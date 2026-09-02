/**
 * Data como "YYYY-MM-DD" **no fuso de quem está usando o sistema**.
 *
 * Existe porque o jeito óbvio de fazer isso — `new Date().toISOString()` e
 * cortar os 10 primeiros caracteres — devolve o dia em **UTC**, não o dia
 * local. No Brasil (UTC-3), das 21h em diante o UTC já virou amanhã: uma
 * nota emitida às 22h do dia 31 era arquivada no mês seguinte, e uma OS
 * faturada nesse horário sumia da lista de Ordens de Serviço (esse último
 * já aconteceu de verdade — PROJETO_STATUS.md, seção 6, item 34).
 *
 * O "sv-SE" não tem nada a ver com a Suécia além de um detalhe útil: é o
 * formato de data desse idioma que sai exatamente como "YYYY-MM-DD".
 */
export function diaLocal(dataIso: string | Date): string {
  const data = typeof dataIso === "string" ? new Date(dataIso) : dataIso;
  return data.toLocaleDateString("sv-SE");
}

/** O dia de hoje, no fuso local, como "YYYY-MM-DD". */
export function hojeLocal(): string {
  return diaLocal(new Date());
}

/**
 * O primeiro dia do mês corrente, no fuso local, como "YYYY-MM-DD".
 *
 * É o formato que a coluna `notas_fiscais_arquivos.competencia` espera (mês
 * de competência, sempre no dia 1º) — o upload manual de XML já gravava
 * assim, mas a emissão automática gravava o dia da emissão, deixando os dois
 * caminhos com formatos diferentes na mesma coluna.
 */
export function primeiroDiaDoMesLocal(): string {
  const hoje = new Date();
  return diaLocal(new Date(hoje.getFullYear(), hoje.getMonth(), 1));
}
