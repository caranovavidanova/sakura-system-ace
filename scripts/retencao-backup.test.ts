// A promessa deste teste em uma frase: NUNCA apagar o que não deveria.
//
// Apagar backup demais é um erro que não dá sintoma nenhum — o job segue
// verde, e a falta só aparece no dia do aperto. Por isso o teste cobre muito
// mais o lado "ficou guardado" do que o lado "foi apagado".
import { describe, expect, it } from "vitest";
import {
  DIARIOS_MANTIDOS,
  MENSAIS_MANTIDOS,
  interpretarNome,
  quaisApagar,
  quaisManter,
  // @ts-expect-error — script utilitário em .mjs puro, sem tipos
} from "./retencao-backup.mjs";

/** Nome do arquivo de um dia, no formato que o workflow grava. */
function arquivo(dia: string, empresa = "pneus-amigao") {
  return `${empresa}-${dia}.age`;
}

/** Os N dias seguidos terminando em `fim` (inclusive), do mais antigo pro mais novo. */
function diasSeguidos(fim: string, quantos: number) {
  const dias: string[] = [];
  const data = new Date(`${fim}T12:00:00Z`);
  for (let i = 0; i < quantos; i += 1) {
    dias.push(data.toISOString().slice(0, 10));
    data.setUTCDate(data.getUTCDate() - 1);
  }
  return dias.reverse();
}

describe("interpretarNome", () => {
  it("entende o nome que o workflow grava", () => {
    expect(interpretarNome("pneus-amigao-2026-09-17.age")).toEqual({
      nome: "pneus-amigao-2026-09-17.age",
      empresa: "pneus-amigao",
      dia: "2026-09-17",
      mes: "2026-09",
    });
  });

  it("entende nome de empresa com hífen no meio", () => {
    // "auto-center-do-ze" tem hífens, igual ao separador da data — o padrão
    // precisa casar a data pelo FIM do nome, não pelo primeiro hífen.
    expect(interpretarNome("auto-center-do-ze-2026-01-05.age")?.empresa).toBe("auto-center-do-ze");
  });

  it("devolve null pro que não é backup nosso", () => {
    for (const nome of [
      "README.md",
      "pneus-amigao.age",
      "pneus-amigao-2026-09-17.sql",
      "pneus-amigao-2026-13-17.age", // mês 13 não existe
      "pneus-amigao-2026-09-32.age", // dia 32 não existe
    ]) {
      expect(interpretarNome(nome), nome).toBeNull();
    }
  });
});

describe("o que fica guardado", () => {
  it("não apaga nada enquanto houver menos que o limite diário", () => {
    const nomes = diasSeguidos("2026-09-17", DIARIOS_MANTIDOS).map((d) => arquivo(d));
    expect(quaisApagar(nomes)).toEqual([]);
  });

  it("guarda as diárias mais recentes e larga as de trás", () => {
    const nomes = diasSeguidos("2026-09-17", DIARIOS_MANTIDOS + 5).map((d) => arquivo(d));
    const manter = quaisManter(nomes);

    // a de ontem e a de hoje sempre ficam
    expect(manter).toContain(arquivo("2026-09-17"));
    expect(manter).toContain(arquivo("2026-09-16"));
    // a mais antiga da leva sai — a não ser que seja a primeira do mês dela,
    // que é o caso coberto no teste seguinte
    expect(quaisApagar(nomes).length).toBeGreaterThan(0);
  });

  it("guarda a PRIMEIRA cópia de cada mês, mesmo fora da janela diária", () => {
    // um ano inteiro, uma cópia por dia
    const nomes = diasSeguidos("2026-09-17", 365).map((d) => arquivo(d));
    const manter = new Set<string>(quaisManter(nomes));

    // o dia 1º de cada mês dentro dos últimos 12 meses continua lá
    for (const mes of ["2026-09", "2026-08", "2026-05", "2026-01", "2025-11", "2025-10"]) {
      expect(manter.has(arquivo(`${mes}-01`)), `sumiu a mensal de ${mes}`).toBe(true);
    }
  });

  it("não apaga nada quando há pouca coisa, mesmo sendo antiga", () => {
    // 24 cópias, uma por mês, dois anos. A regra é "guarde as 30 mais
    // recentes" — e como só existem 24, TODAS ficam. É de propósito: a regra
    // conta arquivos, não idade, justamente pra nunca esvaziar um acervo
    // pequeno só porque ele é velho.
    const nomes: string[] = [];
    for (let ano = 2025; ano <= 2026; ano += 1) {
      for (let mes = 1; mes <= 12; mes += 1) {
        nomes.push(arquivo(`${ano}-${String(mes).padStart(2, "0")}-01`));
      }
    }

    expect(quaisApagar(nomes)).toEqual([]);
  });

  it("guarda no máximo 12 mensais quando o acervo é grande", () => {
    // Dois anos e pouco de cópias DIÁRIAS: aí sim a janela diária não cobre
    // tudo, e a regra mensal precisa escolher.
    const nomes = diasSeguidos("2026-09-17", 800).map((d) => arquivo(d));
    const manter = new Set<string>(quaisManter(nomes));

    // 12 meses pra trás a partir de setembro/2026 chega em outubro/2025
    expect(manter.has(arquivo("2025-10-01")), "devia guardar a mensal de 2025-10").toBe(true);
    expect(manter.has(arquivo("2025-09-01")), "não devia guardar a mensal de 2025-09").toBe(false);

    // 30 diárias + 12 mensais, menos a de 1º/09 que conta nas duas listas
    expect(manter.size).toBe(DIARIOS_MANTIDOS + MENSAIS_MANTIDOS - 1);
  });

  it("a mensal de um mês não muda quando chegam cópias novas", () => {
    // A razão de ser "a primeira do mês" e não "a última": a escolha é feita
    // uma vez e nunca mais muda.
    const ate5 = ["2026-09-01", "2026-09-02", "2026-09-03", "2026-09-04", "2026-09-05"];
    const ate9 = [...ate5, "2026-09-06", "2026-09-07", "2026-09-08", "2026-09-09"];

    const mensalAntes = quaisManter(ate5.map((d) => arquivo(d)));
    const mensalDepois = quaisManter(ate9.map((d) => arquivo(d)));

    expect(mensalAntes).toContain(arquivo("2026-09-01"));
    expect(mensalDepois).toContain(arquivo("2026-09-01"));
  });
});

describe("as travas de segurança", () => {
  it("nunca apaga um arquivo que não entende", () => {
    const desconhecidos = ["README.md", "chave.txt", "backup-antigo.zip", "pneus-amigao.age"];
    const nomes = [...diasSeguidos("2026-09-17", 400).map((d) => arquivo(d)), ...desconhecidos];

    const apagar = new Set<string>(quaisApagar(nomes));
    for (const nome of desconhecidos) {
      expect(apagar.has(nome), `ia apagar ${nome}`).toBe(false);
    }
  });

  it("nunca apaga a cópia mais recente, nem com o acervo enorme", () => {
    const nomes = diasSeguidos("2026-09-17", 400).map((d) => arquivo(d));
    expect(quaisApagar(nomes)).not.toContain(arquivo("2026-09-17"));
  });

  it("apagar + manter dá exatamente a lista original, sem sobra nem repetido", () => {
    const nomes = [
      ...diasSeguidos("2026-09-17", 200).map((d) => arquivo(d)),
      "README.md",
      ...diasSeguidos("2026-09-17", 200).map((d) => arquivo(d, "loja-do-amigo")),
    ];

    const juntos = [...quaisManter(nomes), ...quaisApagar(nomes)].sort();
    expect(juntos).toEqual([...nomes].sort());
  });

  it("uma empresa não interfere na retenção da outra", () => {
    // Cada empresa tem a própria janela de 30 dias: se a loja do amigo entrar
    // no sistema hoje, com 3 cópias, a Pneus Amigão não pode perder nada por
    // causa disso — e vice-versa.
    const pneus = diasSeguidos("2026-09-17", 40).map((d) => arquivo(d));
    const amigo = diasSeguidos("2026-09-17", 3).map((d) => arquivo(d, "loja-do-amigo"));

    const manter = new Set<string>(quaisManter([...pneus, ...amigo]));
    for (const nome of amigo) {
      expect(manter.has(nome), `sumiu ${nome}`).toBe(true);
    }
  });
});
