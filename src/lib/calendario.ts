// Seis semanas fixas, como no calendário do Windows: além de manter a altura
// do card estável de um mês pro outro, garante que os primeiros dias do mês
// QUE VEM sempre apareçam — é o que evita a conta que vence dia 1º ficar
// invisível no dia 31 (o Início mostra só o mês corrente e não tem seta pra
// avançar de mês).
const SEMANAS_VISIVEIS = 6;

/** Data como "YYYY-MM-DD" no fuso local (nunca via toISOString, que é UTC). */
export function chaveData(data: Date): string {
  return data.toLocaleDateString("sv-SE");
}

/**
 * Os 42 dias desenhados na grade de um mês: a sobra do mês anterior, o mês
 * inteiro e a sobra do mês seguinte. Exportada porque quem monta os eventos
 * (PainelPage) precisa saber exatamente qual intervalo está visível.
 */
export function diasDoCalendario(ano: number, mes: number): Date[] {
  const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
  return Array.from(
    { length: SEMANAS_VISIVEIS * 7 },
    (_, i) => new Date(ano, mes, 1 - primeiroDiaSemana + i),
  );
}
