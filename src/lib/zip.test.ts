import { describe, expect, it } from "vitest";
import { criarZip, crc32, nomesSemRepetir } from "./zip";

function bytes(texto: string): Uint8Array {
  return new TextEncoder().encode(texto);
}

describe("crc32", () => {
  // Valores de referência conhecidos do CRC-32 (mesmos usados pelo zip/gzip).
  it("calcula os valores conhecidos de referência", () => {
    expect(crc32(bytes(""))).toBe(0);
    expect(crc32(bytes("a"))).toBe(0xe8b7be43);
    expect(crc32(bytes("123456789"))).toBe(0xcbf43926);
  });
});

describe("nomesSemRepetir", () => {
  it("deixa nomes distintos como estão", () => {
    expect(nomesSemRepetir(["nfse-1.xml", "nfse-2.xml"])).toEqual(["nfse-1.xml", "nfse-2.xml"]);
  });

  it("numera repetições mantendo a extensão no fim", () => {
    expect(nomesSemRepetir(["nota.xml", "nota.xml", "nota.xml"])).toEqual([
      "nota.xml",
      "nota (2).xml",
      "nota (3).xml",
    ]);
  });

  it("trata nome repetido só com maiúsculas diferentes como repetido", () => {
    // O Windows não diferencia maiúscula de minúscula em nome de arquivo —
    // "NOTA.xml" e "nota.xml" colidiriam ao descompactar lá.
    expect(nomesSemRepetir(["nota.xml", "NOTA.xml"])).toEqual(["nota.xml", "NOTA (2).xml"]);
  });

  it("numera repetição de nome sem extensão", () => {
    expect(nomesSemRepetir(["nota", "nota"])).toEqual(["nota", "nota (2)"]);
  });
});

describe("criarZip", () => {
  async function conteudo(blob: Blob): Promise<Uint8Array> {
    return new Uint8Array(await blob.arrayBuffer());
  }

  it("escreve as assinaturas e a contagem de arquivos que todo descompactador procura", async () => {
    const zip = await conteudo(
      criarZip([
        { nome: "a.xml", conteudo: bytes("<a/>") },
        { nome: "b.xml", conteudo: bytes("<b/>") },
      ]),
    );
    const visao = new DataView(zip.buffer);

    // Começa com o cabeçalho local do primeiro arquivo ("PK\x03\x04").
    expect(visao.getUint32(0, true)).toBe(0x04034b50);

    // E termina com o fim do diretório central ("PK\x05\x06"), que é por onde
    // o descompactador começa a ler — com a contagem de arquivos dentro.
    const inicioDoFim = zip.length - 22;
    expect(visao.getUint32(inicioDoFim, true)).toBe(0x06054b50);
    expect(visao.getUint16(inicioDoFim + 8, true)).toBe(2);
    expect(visao.getUint16(inicioDoFim + 10, true)).toBe(2);
  });

  it("guarda o conteúdo sem compressão, do tamanho original", async () => {
    const xml = "<nfse>conteúdo com acento</nfse>";
    const zip = await conteudo(criarZip([{ nome: "nfse.xml", conteudo: bytes(xml) }]));
    const visao = new DataView(zip.buffer);

    expect(visao.getUint16(8, true)).toBe(0); // método = sem compressão
    expect(visao.getUint32(18, true)).toBe(bytes(xml).length); // tamanho comprimido
    expect(visao.getUint32(22, true)).toBe(bytes(xml).length); // tamanho original

    const decodificado = new TextDecoder().decode(zip.slice(30 + "nfse.xml".length));
    expect(decodificado.startsWith(xml)).toBe(true);
  });

  it("aponta o índice final pro lugar certo do arquivo", async () => {
    const zip = await conteudo(
      criarZip([
        { nome: "a.xml", conteudo: bytes("<a/>") },
        { nome: "b.xml", conteudo: bytes("<bb/>") },
      ]),
    );
    const visao = new DataView(zip.buffer);
    const inicioDoFim = zip.length - 22;
    const inicioDoIndice = visao.getUint32(inicioDoFim + 16, true);

    // No lugar apontado tem que estar a primeira entrada do índice ("PK\x01\x02").
    expect(visao.getUint32(inicioDoIndice, true)).toBe(0x02014b50);
    // E o índice tem que ir exatamente até onde o bloco final começa.
    expect(inicioDoIndice + visao.getUint32(inicioDoFim + 12, true)).toBe(inicioDoFim);
  });

  it("marca o nome como UTF-8 pra acento não sair errado no Windows", async () => {
    const zip = await conteudo(criarZip([{ nome: "não-fiscal.xml", conteudo: bytes("<a/>") }]));
    const visao = new DataView(zip.buffer);
    expect(visao.getUint16(6, true) & 0x0800).toBe(0x0800);
  });

  it("gera um .zip vazio válido quando não há arquivo nenhum", async () => {
    const zip = await conteudo(criarZip([]));
    expect(zip.length).toBe(22);
    expect(new DataView(zip.buffer).getUint32(0, true)).toBe(0x06054b50);
  });
});
