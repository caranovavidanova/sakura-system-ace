import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";
import {
  CANAL_PADRAO,
  configuracaoDoAtualizador,
  conteudoDoArquivo,
  lerCanal,
  type CanalAtualizacao,
} from "./canalAtualizacao";

describe("lerCanal", () => {
  it("sem arquivo, o computador fica no canal normal", () => {
    expect(lerCanal(null)).toBe("normal");
    expect(CANAL_PADRAO).toBe("normal");
  });

  it("lê o que a própria tela grava", () => {
    expect(lerCanal(conteudoDoArquivo("teste"))).toBe("teste");
    expect(lerCanal(conteudoDoArquivo("normal"))).toBe("normal");
  });

  it("qualquer coisa estranha vira normal, nunca teste", () => {
    expect(lerCanal("")).toBe("normal");
    expect(lerCanal("{ quebrado")).toBe("normal");
    expect(lerCanal("null")).toBe("normal");
    expect(lerCanal('"teste"')).toBe("normal");
    expect(lerCanal('{"canal":"Teste"}')).toBe("normal");
    expect(lerCanal('{"canal":"beta"}')).toBe("normal");
    expect(lerCanal('{"canal":true}')).toBe("normal");
  });
});

describe("configuracaoDoAtualizador", () => {
  it("só o canal de teste enxerga pré-lançamento", () => {
    expect(configuracaoDoAtualizador("teste").allowPrerelease).toBe(true);
    expect(configuracaoDoAtualizador("normal").allowPrerelease).toBe(false);
  });

  it("nenhum canal instala versão mais velha por cima da atual", () => {
    expect(configuracaoDoAtualizador("teste").allowDowngrade).toBe(false);
    expect(configuracaoDoAtualizador("normal").allowDowngrade).toBe(false);
  });
});

// A trava contra o atalho que parece certo: `autoUpdater.channel = ...` liga
// `allowDowngrade` sozinho no electron-updater 6 (ver canalAtualizacao.ts).
describe("electron/main.ts", () => {
  it("não atribui autoUpdater.channel", () => {
    const main = readFileSync(new URL("../../electron/main.ts", import.meta.url), "utf8");
    expect(main).not.toMatch(/autoUpdater\.channel\s*=/);
    expect(main).toMatch(/configuracaoDoAtualizador\(/);
  });
});

// --- O comportamento da biblioteca DE VERDADE --------------------------------
//
// O guia pedia pra conferir na documentação atual do electron-updater como ele
// trata canal, porque "a API já mudou entre versões maiores". Documentação
// envelhece; o código instalado não mente. Estes testes rodam o
// `GitHubProvider` que vai dentro do instalador, trocando só a rede por um
// GitHub de mentira — ou seja, se uma atualização do electron-updater mudar
// a regra, é aqui que fica vermelho, e não numa loja.
//
// O GitHub de mentira responde exatamente os três endereços que a biblioteca
// pede: o feed `releases.atom`, `releases/latest` (que, no GitHub de verdade,
// nunca devolve um pré-lançamento) e o `latest.yml` de cada tag.

const requireDoProjeto = createRequire(import.meta.url);
const requireDoUpdater = createRequire(requireDoProjeto.resolve("electron-updater/package.json"));
const { GitHubProvider } = requireDoUpdater("./out/providers/GitHubProvider.js");
const { HttpError } = requireDoUpdater("builder-util-runtime");
const semver = requireDoUpdater("semver");

interface ReleaseDeMentira {
  tag: string;
  preLancamento: boolean;
  /** Marcada explicitamente como "mais recente" (o que o Liberar faz). */
  maisRecente?: boolean;
  /** Publicação pela metade: a release existe, o latest.yml ainda não. */
  semLatestYml?: boolean;
}

function githubDeMentira(releases: ReleaseDeMentira[]) {
  const entradas = releases
    .map(
      (r) =>
        `<entry><id>tag:github.com,2008:Repository/1/${r.tag}</id>` +
        `<updated>2026-09-25T12:00:00Z</updated>` +
        `<link rel="alternate" type="text/html" href="https://github.com/o/r/releases/tag/${r.tag}"/>` +
        `<title>${r.tag.slice(1)}</title><content type="html">No content.</content></entry>`,
    )
    .join("");
  const feed = `<?xml version="1.0" encoding="UTF-8"?><feed xmlns="http://www.w3.org/2005/Atom">${entradas}</feed>`;
  // O que o GitHub responde em /releases/latest: a marcada explicitamente,
  // senão a primeira que não é pré-lançamento. Nunca um pré-lançamento.
  const maisRecente =
    releases.find((r) => r.maisRecente && !r.preLancamento) ??
    releases.find((r) => !r.preLancamento);

  return {
    async request(opcoes: { protocol: string; hostname: string; path: string }) {
      const url = `${opcoes.protocol}//${opcoes.hostname}${opcoes.path}`;
      if (url.endsWith("/releases.atom")) return feed;
      if (url.endsWith("/releases/latest")) {
        if (!maisRecente) throw new HttpError(404, "Not Found");
        return JSON.stringify({ tag_name: maisRecente.tag });
      }
      const pedido = /\/releases\/download\/(v[^/]+)\/latest\.yml$/.exec(url);
      const release = pedido && releases.find((r) => r.tag === pedido[1]);
      if (release && !release.semLatestYml) {
        const versao = release.tag.slice(1);
        return [
          `version: ${versao}`,
          "files:",
          "  - url: SakuraSystem-Setup.exe",
          "    sha512: abc",
          "    size: 1",
          "path: SakuraSystem-Setup.exe",
          "sha512: abc",
          `releaseDate: '2026-09-25T12:00:00.000Z'`,
        ].join("\n");
      }
      throw new HttpError(404, "Not Found");
    },
  };
}

async function versaoEscolhida(
  canal: CanalAtualizacao,
  releases: ReleaseDeMentira[],
  versaoInstalada = "0.9.39",
): Promise<string> {
  const { allowPrerelease } = configuracaoDoAtualizador(canal);
  const updater = {
    allowPrerelease,
    channel: null,
    currentVersion: semver.parse(versaoInstalada),
    fullChangelog: false,
  };
  const provider = new GitHubProvider({ provider: "github", owner: "o", repo: "r" }, updater, {
    executor: githubDeMentira(releases),
    platform: "win32",
    isUseMultipleRangeRequest: false,
  });
  const info = await provider.getLatestVersion();
  // O que interessa é a versão que o latest.yml anuncia — é ela que o
  // atualizador compara com a instalada. A tag vem junto pra provar que o
  // arquivo foi buscado na release certa.
  expect(info.tag).toBe(`v${info.version}`);
  return info.version;
}

describe("electron-updater instalado: quem recebe o quê", () => {
  const recemPublicada: ReleaseDeMentira[] = [
    { tag: "v0.9.41", preLancamento: true },
    { tag: "v0.9.40", preLancamento: false },
    { tag: "v0.9.39", preLancamento: false },
  ];

  it("versão recém-publicada: o canal de teste recebe", async () => {
    expect(await versaoEscolhida("teste", recemPublicada)).toBe("0.9.41");
  });

  it("versão recém-publicada: o canal normal NÃO recebe — fica na última liberada", async () => {
    expect(await versaoEscolhida("normal", recemPublicada)).toBe("0.9.40");
  });

  it("depois de liberar, os dois canais recebem", async () => {
    const liberada = recemPublicada.map((r) =>
      r.tag === "v0.9.41" ? { ...r, preLancamento: false, maisRecente: true } : r,
    );
    expect(await versaoEscolhida("normal", liberada)).toBe("0.9.41");
    expect(await versaoEscolhida("teste", liberada)).toBe("0.9.41");
  });

  it("várias versões em teste: o canal normal continua na liberada", async () => {
    const empilhadas: ReleaseDeMentira[] = [
      { tag: "v0.9.43", preLancamento: true },
      { tag: "v0.9.42", preLancamento: true },
      { tag: "v0.9.41", preLancamento: true },
      { tag: "v0.9.40", preLancamento: false },
    ];
    expect(await versaoEscolhida("normal", empilhadas)).toBe("0.9.40");
    expect(await versaoEscolhida("teste", empilhadas)).toBe("0.9.43");
  });

  it("voltar atrás: liberar a anterior de novo tira a ruim do canal normal", async () => {
    // O que o Liberar faz quando recebe uma versão mais velha que a liberada:
    // marca a anterior como "mais recente" e devolve a ruim pro teste.
    const voltou: ReleaseDeMentira[] = [
      { tag: "v0.9.41", preLancamento: true },
      { tag: "v0.9.40", preLancamento: false, maisRecente: true },
    ];
    expect(await versaoEscolhida("normal", voltou, "0.9.39")).toBe("0.9.40");
  });

  it("publicação pela metade não instala nada no teste, e o normal nem vê", async () => {
    const metade: ReleaseDeMentira[] = [
      { tag: "v0.9.41", preLancamento: true, semLatestYml: true },
      { tag: "v0.9.40", preLancamento: false },
    ];
    await expect(versaoEscolhida("teste", metade)).rejects.toThrow(/latest\.yml/);
    expect(await versaoEscolhida("normal", metade)).toBe("0.9.40");
  });
});
