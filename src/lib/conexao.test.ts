import { describe, expect, it } from "vitest";
import { mensagemDoTeste } from "./conexao";

describe("mensagemDoTeste", () => {
  it("aceita a conexão quando o Supabase responde 200", () => {
    expect(mensagemDoTeste(200)).toBeNull();
  });

  it("aponta a chave quando a resposta é 401 ou 403", () => {
    expect(mensagemDoTeste(401)).toContain("chave");
    expect(mensagemDoTeste(403)).toContain("chave");
  });

  it("aponta a URL quando a resposta é outro código de erro", () => {
    expect(mensagemDoTeste(404)).toContain("URL");
    expect(mensagemDoTeste(500)).toContain("URL");
  });
});
