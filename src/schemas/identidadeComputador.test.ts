import { describe, expect, it } from "vitest";
import { conteudoDaIdentidade, lerIdentidadeComputador } from "./identidadeComputador";

const ID = "3f1c2b9a-7d4e-4c1a-9b2f-0a1b2c3d4e5f";

describe("lerIdentidadeComputador", () => {
  it("arquivo que ainda não existe: não há identidade (quem chama cria uma)", () => {
    expect(lerIdentidadeComputador(null)).toBeNull();
    expect(lerIdentidadeComputador("")).toBeNull();
  });

  it("lê de volta o que conteudoDaIdentidade grava", () => {
    const identidade = { id: ID, criadoEm: "2026-09-26T12:00:00.000Z" };
    expect(lerIdentidadeComputador(conteudoDaIdentidade(identidade))).toEqual(identidade);
  });

  it("guarda o id em minúsculas — o mesmo computador não pode virar dois por causa de letra", () => {
    const lido = lerIdentidadeComputador(JSON.stringify({ id: ID.toUpperCase() }));
    expect(lido?.id).toBe(ID);
  });

  it("qualquer coisa estranha vira 'sem identidade', nunca um id torto", () => {
    expect(lerIdentidadeComputador("{ quebrado")).toBeNull();
    expect(lerIdentidadeComputador("[]")).toBeNull();
    expect(lerIdentidadeComputador('"texto"')).toBeNull();
    expect(lerIdentidadeComputador(JSON.stringify({ id: "computador-do-balcao" }))).toBeNull();
    expect(lerIdentidadeComputador(JSON.stringify({ id: 123 }))).toBeNull();
    expect(lerIdentidadeComputador(JSON.stringify({ outro: ID }))).toBeNull();
  });
});
