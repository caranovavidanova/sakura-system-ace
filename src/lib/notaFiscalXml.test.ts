// @vitest-environment jsdom
//
// Precisa de DOM (DOMParser) — mesmo motivo/padrão de notaFiscalXmlFornecedor.test.ts.
import { describe, expect, it } from "vitest";
import { interpretarXmlNotaFiscal, montarHtmlVisualNotaFiscal } from "./notaFiscalXml";

const XML_CONFIRMACAO_GIAP = `<?xml version="1.0"?>
<nfeResposta><notaFiscal><numeroNota>10</numeroNota><numeroRps>2</numeroRps><loteRps>108320147</loteRps><codigoVerificacao>3499756VTP</codigoVerificacao><link>https://araraquara.giap.com.br/ords/pma/f?p=616:116</link><cnpjPrestador>66217744000170</cnpjPrestador><dataEmissaoRPS>27/08/2026</dataEmissaoRPS><dataEmissaoNF>27/08/2026</dataEmissaoNF><statusEmissao>200</statusEmissao><messages>Nota emitida com sucesso!</messages></notaFiscal></nfeResposta>`;

describe("interpretarXmlNotaFiscal — confirmação Giap (Araraquara)", () => {
  it("reconhece o formato de confirmação (sem itens/valores) e extrai o link do documento oficial", () => {
    const dados = interpretarXmlNotaFiscal(XML_CONFIRMACAO_GIAP, "nfse");

    expect(dados.reconhecido).toBe(true);
    expect(dados.numero).toBe("10");
    expect(dados.chaveAcesso).toBe("3499756VTP");
    expect(dados.protocolo).toBe("Lote 108320147 · RPS 2");
    expect(dados.emitente?.documento).toBe("66217744000170");
    expect(dados.itens).toEqual([]);
    expect(dados.total).toBeNull();
    expect(dados.linkOficial).toBe("https://araraquara.giap.com.br/ords/pma/f?p=616:116");
  });

  it("monta o recibo com o link do documento oficial em vez de uma tabela de itens vazia", () => {
    const dados = interpretarXmlNotaFiscal(XML_CONFIRMACAO_GIAP, "nfse");
    const html = montarHtmlVisualNotaFiscal(dados);

    expect(html).toContain("araraquara.giap.com.br");
    expect(html).toContain("Ver documento oficial completo");
    expect(html).not.toContain("<table>");
  });
});

describe("interpretarXmlNotaFiscal — XML não reconhecido", () => {
  it("devolve reconhecido: false pra um XML sem os formatos esperados", () => {
    const dados = interpretarXmlNotaFiscal("<algumaCoisa><x>1</x></algumaCoisa>", "nfse");
    expect(dados.reconhecido).toBe(false);
  });
});
