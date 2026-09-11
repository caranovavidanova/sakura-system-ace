import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Tamanho de fonte sai da escala do app (`@theme` em `src/styles/globals.css`),
 * nunca de uma classe crua do Tailwind.
 *
 * Este teste é o critério de aceite do item TR-01.1 do guia de melhorias
 * virado mecanismo. O problema que ele impede não é estético: antes da escala,
 * cada tela escolhia `text-xs` ou `text-sm` por conta própria, e o resultado
 * era tabela inteira em tamanho de rodapé — num sistema que é lido de pé, de
 * relance, no balcão. Uma escala só existe enquanto ninguém escreve fora dela,
 * e "lembrar" nunca foi suficiente neste projeto (ver seção 6, itens 48 e 49).
 *
 * Quando ele reclamar, a saída certa é escolher o token pelo PAPEL do texto:
 * `text-metrica` (número grande de cartão), `text-titulo` (o <h1> da tela),
 * `text-destaque` (valor que salta num card), `text-subtitulo` (título de
 * seção), `text-corpo` (texto normal), `text-tabela` (tabela densa),
 * `text-rotulo` (rótulo de campo, etiqueta) e `text-meta` (só metadado, como a
 * versão do app). Precisando de um degrau que não existe, o certo é
 * acrescentá-lo à escala com um nome — não escrever `text-[13px]` na tela.
 */

const PASTA = "src";

/** Os nomes de tamanho do Tailwind e qualquer tamanho literal (`text-[13px]`). */
const TAMANHO_CRU =
  /\btext-(?:xs|sm|base|lg|xl|[2-9]xl|\[[^\]]*(?:px|rem|em|pt)\])(?=["'`\s])/g;

function arquivosDeTela(pasta: string): string[] {
  return readdirSync(pasta, { withFileTypes: true }).flatMap((entrada) => {
    const caminho = join(pasta, entrada.name);
    if (entrada.isDirectory()) return arquivosDeTela(caminho);
    return entrada.isFile() && caminho.endsWith(".tsx") ? [caminho] : [];
  });
}

describe("tamanho de fonte vem da escala, não de classe crua", () => {
  const arquivos = arquivosDeTela(PASTA);

  it("encontra os arquivos de tela pra varrer", () => {
    expect(arquivos.length).toBeGreaterThan(50);
  });

  it("nenhum arquivo usa classe de tamanho crua", () => {
    const achados: string[] = [];

    for (const arquivo of arquivos) {
      const linhas = readFileSync(arquivo, "utf8").split("\n");
      linhas.forEach((linha, indice) => {
        for (const classe of linha.match(TAMANHO_CRU) ?? []) {
          achados.push(`${arquivo}:${indice + 1} usa "${classe}"`);
        }
      });
    }

    expect(
      achados,
      `Use um token da escala (text-corpo, text-tabela, text-rotulo, text-meta,\n` +
        `text-subtitulo, text-destaque, text-titulo, text-metrica) em vez do\n` +
        `tamanho cru. A escala está no @theme de src/styles/globals.css.\n\n` +
        achados.join("\n"),
    ).toEqual([]);
  });
});
