import { describe, expect, it } from "vitest";
import { mensagemDoTeste } from "./conexao";

describe("mensagemDoTeste", () => {
  it("aceita a conexão quando o Supabase não devolve erro nenhum", () => {
    expect(mensagemDoTeste(null)).toBeNull();
  });

  it("aponta a chave quando o erro fala de API key", () => {
    expect(mensagemDoTeste({ message: "Invalid API key" })).toContain("chave");
    expect(mensagemDoTeste({ message: "No API key found in request" })).toContain("chave");
  });

  it("aponta as migrations quando o banco não tem as tabelas do sistema", () => {
    expect(
      mensagemDoTeste({ code: "PGRST205", message: "Could not find the table 'public.lojas'" }),
    ).toContain("migrations");
    expect(
      mensagemDoTeste({ code: "42P01", message: 'relation "lojas" does not exist' }),
    ).toContain("migrations");
  });

  it("repassa qualquer outro erro do Supabase em vez de escondê-lo", () => {
    expect(mensagemDoTeste({ message: "algo inesperado" })).toContain("algo inesperado");
  });
});
