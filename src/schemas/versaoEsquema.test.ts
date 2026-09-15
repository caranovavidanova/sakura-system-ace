import { readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  PRIMEIRA_VERSAO_REGISTRADA,
  VERSAO_ESQUEMA_ESPERADA,
  numeroDaMigration,
  situacaoDoEsquema,
} from "./versaoEsquema";

describe("VERSAO_ESQUEMA_ESPERADA", () => {
  // A trava que faz o aviso valer alguma coisa. Se a constante ficar pra trás,
  // o app diz "está tudo em dia" contra um banco que não recebeu a migration
  // nova — ou seja, o item inteiro deixa de funcionar justo no dia em que
  // precisaria. Isso tem que ser um `npm test` vermelho, não uma surpresa na
  // loja.
  it("é a maior migration da pasta", () => {
    const maior = readdirSync("supabase/migrations")
      .filter((nome) => nome.endsWith(".sql"))
      .map((nome) => Number(nome.slice(0, 4)))
      .reduce((a, b) => Math.max(a, b), 0);

    expect(
      VERSAO_ESQUEMA_ESPERADA,
      "Criou migration nova? Suba VERSAO_ESQUEMA_ESPERADA em src/schemas/versaoEsquema.ts",
    ).toBe(maior);
  });
});

describe("situacaoDoEsquema", () => {
  it("não mostra nada quando não deu pra perguntar", () => {
    expect(situacaoDoEsquema(null).estado).toBe("desconhecido");
    expect(situacaoDoEsquema(null).faltando).toEqual([]);
  });

  it("fica quieto quando os dois números batem", () => {
    expect(situacaoDoEsquema(60, 60).estado).toBe("em_dia");
  });

  it("lista o que falta rodar quando o banco está atrás", () => {
    const situacao = situacaoDoEsquema(57, 60);

    expect(situacao.estado).toBe("banco_atrasado");
    expect(situacao.faltando).toEqual(["0058", "0059", "0060"]);
  });

  it("não lista o mundo inteiro quando o banco é anterior à tabela", () => {
    // Banco sem `schema_versao` responde 0. Ele rodou as 54 primeiras (senão
    // o app nem abriria), então listar "0001 a 0057" seria assustar sem
    // informar — o que se sabe é que falta da 0055 pra frente.
    const situacao = situacaoDoEsquema(0, 57);

    expect(situacao.faltando).toEqual(["0055", "0056", "0057"]);
    expect(situacao.faltando[0]).toBe(numeroDaMigration(PRIMEIRA_VERSAO_REGISTRADA));
  });

  it("avisa o contrário quando o banco está na frente", () => {
    // Acontece quando ela roda a migration nova antes do auto-update chegar
    // naquele computador — a ordem CERTA, aliás. Não é erro, é "atualize o
    // programa".
    const situacao = situacaoDoEsquema(61, 60);

    expect(situacao.estado).toBe("app_atrasado");
    expect(situacao.faltando).toEqual([]);
  });
});
