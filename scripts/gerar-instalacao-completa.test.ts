// Guarda contra o arquivo de instalação ficar pra trás.
//
// O risco real: alguém cria a migration 0048, mescla na main, e esquece de
// rodar `npm run gerar-instalacao`. O banco de quem já usa o sistema continua
// certo (essa pessoa roda a migration nova à mão), mas a PRÓXIMA loja instalada
// nasce com um banco desatualizado — e isso só aparece bem depois, como um erro
// estranho numa tela específica. Este teste transforma esse esquecimento num
// `npm test` vermelho.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
// @ts-expect-error — script utilitário em .mjs puro, sem tipos
import { listarMigrations, montarInstalacaoCompleta } from "./gerar-instalacao-completa.mjs";

const ARQUIVO = "supabase/instalacao/instalacao-completa.sql";

describe("arquivo de instalação completa", () => {
  it("está atualizado com as migrations de hoje", () => {
    const gravado = readFileSync(ARQUIVO, "utf8");
    const esperado: string = montarInstalacaoCompleta();

    expect(
      gravado,
      "O arquivo de instalação está desatualizado. Rode: npm run gerar-instalacao",
    ).toBe(esperado);
  });

  it("inclui todas as migrations, na ordem numérica", () => {
    const gravado = readFileSync(ARQUIVO, "utf8");
    const migrations: string[] = listarMigrations();

    // cada migration aparece como um cabeçalho de seção no arquivo gerado
    const posicoes = migrations.map((nome) => gravado.indexOf(`\n-- ${nome}\n`));

    expect(posicoes.every((p) => p >= 0), "alguma migration ficou de fora").toBe(true);
    expect(posicoes).toEqual([...posicoes].sort((a, b) => a - b));
  });
});
