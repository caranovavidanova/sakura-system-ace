import { describe, expect, it } from "vitest";
import {
  codigoParaPecaImportada,
  csosnMaisUsado,
  ehCsosn,
  ehCst,
  motivoCodigoIncompativel,
  regimeUsaCsosn,
} from "./tributacao";

describe("ehCsosn / ehCst / regimeUsaCsosn", () => {
  it("separa CSOSN (3 dígitos) de CST (2 dígitos)", () => {
    expect(ehCsosn("500")).toBe(true);
    expect(ehCst("500")).toBe(false);
    expect(ehCst("00")).toBe(true);
    expect(ehCsosn("00")).toBe(false);
  });

  it("ignora espaço em volta e trata vazio como nenhum dos dois", () => {
    expect(ehCsosn(" 102 ")).toBe(true);
    expect(ehCsosn("")).toBe(false);
    expect(ehCst(null)).toBe(false);
  });

  it("só o Simples Nacional usa CSOSN", () => {
    expect(regimeUsaCsosn("simples_nacional")).toBe(true);
    expect(regimeUsaCsosn("lucro_presumido")).toBe(false);
    expect(regimeUsaCsosn(null)).toBe(false);
  });
});

describe("motivoCodigoIncompativel", () => {
  it("aceita CSOSN no Simples Nacional", () => {
    expect(motivoCodigoIncompativel("500", "simples_nacional")).toBeNull();
  });

  it("recusa CST no Simples Nacional — foi a rejeição real da SEFAZ", () => {
    const motivo = motivoCodigoIncompativel("00", "simples_nacional");
    expect(motivo).toContain("CST 00");
    expect(motivo).toContain("Simples Nacional");
  });

  it("recusa CSOSN no regime normal", () => {
    expect(motivoCodigoIncompativel("500", "lucro_presumido")).toContain("CSOSN 500");
  });

  it("aceita CST no regime normal", () => {
    expect(motivoCodigoIncompativel("60", "lucro_real")).toBeNull();
  });

  it("avisa quando a peça está sem código nenhum", () => {
    expect(motivoCodigoIncompativel("", "simples_nacional")).toContain("sem o código CSOSN");
    expect(motivoCodigoIncompativel(null, "lucro_presumido")).toContain("sem o código CST");
  });

  it("avisa quando o código não é nenhum dos conhecidos", () => {
    expect(motivoCodigoIncompativel("999", "simples_nacional")).toContain('"999"');
  });

  // Sem o regime preenchido em Configurações não dá pra afirmar nada — calar
  // é melhor que encher a tela de aviso que pode estar errado.
  it("fica calado quando o regime da loja não está preenchido", () => {
    expect(motivoCodigoIncompativel("00", null)).toBeNull();
    expect(motivoCodigoIncompativel("", null)).toBeNull();
  });
});

describe("csosnMaisUsado", () => {
  it("devolve o CSOSN mais frequente do cadastro da loja", () => {
    expect(csosnMaisUsado(["500", "102", "500", null, "500"])).toBe("500");
  });

  it("ignora CST e código inválido", () => {
    expect(csosnMaisUsado(["00", "60", "999", "102"])).toBe("102");
  });

  it("devolve null quando não há nenhum CSOSN cadastrado", () => {
    expect(csosnMaisUsado(["00", "", null])).toBeNull();
    expect(csosnMaisUsado([])).toBeNull();
  });
});

describe("codigoParaPecaImportada", () => {
  it("mantém o código da nota quando ele serve pra loja", () => {
    expect(codigoParaPecaImportada("500", "simples_nacional", "102")).toBe("500");
  });

  it("troca o CST do fornecedor pelo padrão da loja no Simples Nacional", () => {
    expect(codigoParaPecaImportada("00", "simples_nacional", "500")).toBe("500");
  });

  it("deixa em branco quando não serve e a loja não tem padrão — melhor vazio que errado", () => {
    expect(codigoParaPecaImportada("00", "simples_nacional", null)).toBeNull();
  });

  it("não mexe em nada quando o regime da loja não está preenchido", () => {
    expect(codigoParaPecaImportada("00", null, "500")).toBe("00");
  });
});
