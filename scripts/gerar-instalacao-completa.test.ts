// Guarda contra o arquivo de instalação ficar pra trás.
//
// O risco real: alguém cria a migration 0048, mescla na main, e esquece de
// rodar `npm run gerar-instalacao`. O banco de quem já usa o sistema continua
// certo (essa pessoa roda a migration nova à mão), mas a PRÓXIMA loja instalada
// nasce com um banco desatualizado — e isso só aparece bem depois, como um erro
// estranho numa tela específica. Este teste transforma esse esquecimento num
// `npm test` vermelho.
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  listarMigrations,
  migrationsSemRegistroDeVersao,
  montarInstalacaoCompleta,
  // @ts-expect-error — script utilitário em .mjs puro, sem tipos
} from "./gerar-instalacao-completa.mjs";

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

describe("registro da própria versão em schema_versao", () => {
  it("todas as migrations de hoje registram a própria versão", () => {
    const esquecidas: string[] = migrationsSemRegistroDeVersao();

    expect(
      esquecidas,
      "Migration nova precisa terminar com: insert into schema_versao (versao) values (N) on conflict do nothing;",
    ).toEqual([]);
  });

  // A checagem acima passaria sozinha hoje, porque ainda não existe migration
  // depois da 0055 — ou seja, ela ainda não provou nada. Este teste planta o
  // esquecimento de propósito, que é a única forma de saber que a trava
  // funciona no dia em que alguém esquecer (a lição do item 53 da seção 6).
  it("acusa a migration que esqueceu, e só ela", () => {
    const pasta = mkdtempSync(join(tmpdir(), "migrations-"));
    try {
      writeFileSync(join(pasta, "0055_schema_versao.sql"), "create table schema_versao ();");
      writeFileSync(
        join(pasta, "0056_com_registro.sql"),
        "alter table pecas add column x int;\ninsert into schema_versao (versao) values (56) on conflict do nothing;",
      );
      writeFileSync(join(pasta, "0057_esqueceu.sql"), "alter table pecas add column y int;");
      // O número tem que ser o DELA: copiar a linha da migration anterior é o
      // engano mais provável, e passaria batido numa busca só por "schema_versao".
      writeFileSync(
        join(pasta, "0058_numero_errado.sql"),
        "alter table pecas add column z int;\ninsert into schema_versao (versao) values (57);",
      );

      expect(migrationsSemRegistroDeVersao(pasta)).toEqual([
        "0057_esqueceu.sql",
        "0058_numero_errado.sql",
      ]);
    } finally {
      rmSync(pasta, { recursive: true, force: true });
    }
  });
});
