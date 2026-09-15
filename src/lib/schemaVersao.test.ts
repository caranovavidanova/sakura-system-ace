import { describe, expect, it } from "vitest";
import { ehTabelaInexistente } from "./schemaVersao";

// Esta é a única parte de `schemaVersao.ts` que dá pra testar sem o Supabase —
// e é justamente a que decide entre avisar e ficar quieto.
describe("ehTabelaInexistente", () => {
  it("reconhece o banco anterior à 0055 pelos dois códigos", () => {
    expect(ehTabelaInexistente({ code: "42P01" })).toBe(true);
    expect(ehTabelaInexistente({ code: "PGRST205" })).toBe(true);
  });

  it("reconhece também pela mensagem, quando não vem código", () => {
    expect(
      ehTabelaInexistente({
        message: "Could not find the table 'public.schema_versao' in the schema cache",
      }),
    ).toBe(true);
    expect(
      ehTabelaInexistente({ message: 'relation "schema_versao" does not exist' }),
    ).toBe(true);
  });

  it("NÃO confunde queda de rede com banco desatualizado", () => {
    // O caso que mais importa: aqui o app tem que ficar calado, não acusar a
    // usuária de não ter rodado uma migration que ela rodou.
    expect(ehTabelaInexistente({ message: "Failed to fetch" })).toBe(false);
    expect(ehTabelaInexistente({ code: "PGRST301", message: "JWT expired" })).toBe(false);
    expect(ehTabelaInexistente(null)).toBe(false);
    expect(ehTabelaInexistente("erro")).toBe(false);
  });

  it("não se engana com outra tabela faltando", () => {
    expect(
      ehTabelaInexistente({ message: 'relation "clientes" does not exist' }),
    ).toBe(false);
  });
});
