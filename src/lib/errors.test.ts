// A promessa: toda trava do banco tem uma frase em português na tela. Sem
// este teste, a próxima migration com um `ck_...` novo faria quem esbarra
// nela ler "violates check constraint", que não diz o que fazer.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { MENSAGEM_DA_TRAVA, mensagemDeErro, traduzirTrava } from "./errors";

const PASTA = "supabase/migrations";

function travasDasMigrations(): string[] {
  const nomes = new Set<string>();
  for (const arquivo of readdirSync(PASTA)) {
    if (!arquivo.endsWith(".sql")) continue;
    const texto = readFileSync(join(PASTA, arquivo), "utf8");
    for (const casou of texto.matchAll(/\b(ck_[a-z0-9_]+)\b/g)) nomes.add(casou[1]);
  }
  return [...nomes].sort();
}

describe("MENSAGEM_DA_TRAVA", () => {
  it("toda trava ck_ das migrations tem frase", () => {
    const semFrase = travasDasMigrations().filter((nome) => !(nome in MENSAGEM_DA_TRAVA));
    expect(semFrase, "Trava nova precisa de frase em src/lib/errors.ts").toEqual([]);
  });

  it("e não sobra frase de trava que não existe mais", () => {
    const existentes = new Set(travasDasMigrations());
    expect(Object.keys(MENSAGEM_DA_TRAVA).filter((n) => !existentes.has(n))).toEqual([]);
  });
});

describe("mensagemDeErro", () => {
  it("troca a mensagem crua da trava pela frase", () => {
    const erro = {
      code: "23514",
      message: 'new row for relation "pecas" violates check constraint "ck_pecas_preco_venda"',
    };
    expect(mensagemDeErro(erro)).toBe("O preço de venda não pode ser negativo.");
  });

  it("trava desconhecida e erro comum passam como vieram", () => {
    expect(traduzirTrava('violates check constraint "algo_de_fora"')).toBeNull();
    expect(mensagemDeErro({ message: "falhou a rede" })).toBe("falhou a rede");
    expect(mensagemDeErro(new Error("x"))).toBe("x");
    expect(mensagemDeErro(null)).toMatch(/Erro desconhecido/);
  });
});
