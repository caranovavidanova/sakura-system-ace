// @vitest-environment jsdom
//
// Único arquivo de teste que precisa de DOM (DOMParser, disponível de
// verdade no Electron/navegador, mas não no ambiente "node" padrão do
// vitest.config.ts) — jsdom só entra pra esse arquivo, o resto continua
// rodando no ambiente node simples de sempre.
import { describe, expect, it } from "vitest";
import { extrairNotaFiscalXml, normalizarCnpj } from "./notaFiscalXmlFornecedor";

const XML_EXEMPLO = `<?xml version="1.0" encoding="UTF-8"?>
<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe">
  <NFe>
    <infNFe Id="NFe1234" versao="4.00">
      <ide>
        <nNF>1234</nNF>
        <dhEmi>2026-08-01T10:00:00-03:00</dhEmi>
      </ide>
      <emit>
        <CNPJ>12.345.678/0001-99</CNPJ>
        <xNome>Fornecedor Exemplo LTDA</xNome>
      </emit>
      <det nItem="1">
        <prod>
          <cProd>P001</cProd>
          <cEAN>7891234567890</cEAN>
          <xProd>Pneu 175/70 R14</xProd>
          <NCM>40111000</NCM>
          <CFOP>5102</CFOP>
          <uCom>UN</uCom>
          <qCom>10.0000</qCom>
          <vUnCom>150.50</vUnCom>
        </prod>
        <imposto>
          <ICMS>
            <ICMS00>
              <orig>0</orig>
              <CST>00</CST>
              <pICMS>18.00</pICMS>
            </ICMS00>
          </ICMS>
        </imposto>
      </det>
      <det nItem="2">
        <prod>
          <cProd>P002</cProd>
          <cEAN>SEM GTIN</cEAN>
          <xProd>Amortecedor dianteiro</xProd>
          <NCM>87088000</NCM>
          <CFOP>5102</CFOP>
          <uCom>PC</uCom>
          <qCom>2.0000</qCom>
          <vUnCom>320.00</vUnCom>
        </prod>
        <imposto>
          <ICMS>
            <ICMSSN102>
              <orig>1</orig>
              <CSOSN>102</CSOSN>
            </ICMSSN102>
          </ICMS>
        </imposto>
      </det>
    </infNFe>
  </NFe>
</nfeProc>`;

describe("extrairNotaFiscalXml", () => {
  it("extrai fornecedor e número da nota", () => {
    const resultado = extrairNotaFiscalXml(XML_EXEMPLO);
    expect(resultado.fornecedor_cnpj).toBe("12.345.678/0001-99");
    expect(resultado.fornecedor_nome).toBe("Fornecedor Exemplo LTDA");
    expect(resultado.numero).toBe("1234");
  });

  it("extrai os itens, com CST (regime normal)", () => {
    const resultado = extrairNotaFiscalXml(XML_EXEMPLO);
    const item = resultado.itens[0];
    expect(item.descricao).toBe("Pneu 175/70 R14");
    expect(item.codigo_barras).toBe("7891234567890");
    expect(item.ncm).toBe("40111000");
    expect(item.cfop_padrao).toBe("5102");
    expect(item.unidade).toBe("UN");
    expect(item.quantidade).toBe(10);
    expect(item.preco_unitario).toBe(150.5);
    expect(item.origem).toBe("0");
    expect(item.cst_ou_csosn).toBe("00");
    expect(item.aliquota_icms).toBe(18);
  });

  it("extrai item com CSOSN (Simples Nacional) e sem código de barras", () => {
    const resultado = extrairNotaFiscalXml(XML_EXEMPLO);
    const item = resultado.itens[1];
    expect(item.codigo_barras).toBeNull();
    expect(item.cst_ou_csosn).toBe("102");
    expect(item.origem).toBe("1");
    expect(item.aliquota_icms).toBeNull();
  });

  it("lança erro claro pra XML sem infNFe", () => {
    expect(() => extrairNotaFiscalXml("<xml><algumaCoisa/></xml>")).toThrow(/infNFe/);
  });

  it("lança erro claro pra XML corrompido", () => {
    expect(() => extrairNotaFiscalXml("isso não é XML")).toThrow();
  });
});

describe("normalizarCnpj", () => {
  it("remove pontuação, mantendo só dígitos", () => {
    expect(normalizarCnpj("12.345.678/0001-99")).toBe("12345678000199");
  });

  it("nulo/vazio vira string vazia", () => {
    expect(normalizarCnpj(null)).toBe("");
    expect(normalizarCnpj(undefined)).toBe("");
    expect(normalizarCnpj("")).toBe("");
  });
});
