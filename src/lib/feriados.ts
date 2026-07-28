export interface Feriado {
  data: string; // "YYYY-MM-DD"
  nome: string;
}

// Algoritmo de Meeus/Jones/Butcher pra achar o domingo de Páscoa —
// os feriados móveis nacionais (Carnaval, Sexta-feira Santa, Corpus Christi)
// são todos contados a partir dela.
function domingoDePascoa(ano: number): Date {
  const a = ano % 19;
  const b = Math.floor(ano / 100);
  const c = ano % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mes = Math.floor((h + l - 7 * m + 114) / 31);
  const dia = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(ano, mes - 1, dia);
}

function paraChave(data: Date): string {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

function comOffset(base: Date, dias: number): Date {
  const copia = new Date(base);
  copia.setDate(copia.getDate() + dias);
  return copia;
}

export function feriadosNacionais(ano: number): Feriado[] {
  const pascoa = domingoDePascoa(ano);

  return [
    { data: `${ano}-01-01`, nome: "Confraternização Universal" },
    { data: paraChave(comOffset(pascoa, -47)), nome: "Carnaval" },
    { data: paraChave(comOffset(pascoa, -2)), nome: "Sexta-feira Santa" },
    { data: paraChave(comOffset(pascoa, 60)), nome: "Corpus Christi" },
    { data: `${ano}-04-21`, nome: "Tiradentes" },
    { data: `${ano}-05-01`, nome: "Dia do Trabalho" },
    { data: `${ano}-09-07`, nome: "Independência do Brasil" },
    { data: `${ano}-10-12`, nome: "Nossa Senhora Aparecida" },
    { data: `${ano}-11-02`, nome: "Finados" },
    { data: `${ano}-11-15`, nome: "Proclamação da República" },
    { data: `${ano}-11-20`, nome: "Consciência Negra" },
    { data: `${ano}-12-25`, nome: "Natal" },
  ].sort((a, b) => (a.data < b.data ? -1 : 1));
}
