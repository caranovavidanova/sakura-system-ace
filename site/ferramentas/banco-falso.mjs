import { TABELAS, SESSAO } from "./dados-demo.mjs";

// Responde as chamadas ao Supabase com os dados inventados de dados-demo.mjs,
// pra conseguir abrir o app de verdade num navegador sem tocar no banco de
// loja nenhuma. Usado tanto pelas imagens do site (gerar-telas.mjs) quanto
// pelo catálogo completo de telas (gerar-catalogo-telas.mjs).

export function tabelasSemDados() {
  return faltando;
}

const faltando = new Set();

export async function instalarBancoFalso(contexto) {
  await contexto.route("**demo.supabase.co/**", async (rota) => {
    const req = rota.request();
    const url = new URL(req.url());
    const caminho = url.pathname;

    // --- login ---
    if (caminho.startsWith("/auth/v1/token")) {
      return rota.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(SESSAO) });
    }
    if (caminho.startsWith("/auth/v1/user")) {
      return rota.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(SESSAO.user) });
    }
    if (caminho.startsWith("/auth/v1/logout")) {
      return rota.fulfill({ status: 204, body: "" });
    }

    // --- dados (PostgREST) ---
    if (caminho.startsWith("/rest/v1/")) {
      const tabela = caminho.replace("/rest/v1/", "").split("?")[0];
      let linhas = TABELAS[tabela];
      if (!linhas) {
        faltando.add(tabela);
        linhas = [];
      }

      // aplica os filtros ".eq()" que viram "campo=eq.valor" na URL
      for (const [campo, valor] of url.searchParams.entries()) {
        if (["select", "order", "limit", "offset"].includes(campo)) continue;
        if (!valor.startsWith("eq.")) continue;
        const alvo = valor.slice(3);
        linhas = linhas.filter((l) => l[campo] === undefined || String(l[campo]) === alvo);
      }

      // .maybeSingle()/.single() pedem um objeto, não uma lista
      const querObjeto = (req.headers()["accept"] || "").includes("vnd.pgrst.object");
      const corpo = querObjeto ? (linhas[0] ?? null) : linhas;
      return rota.fulfill({
        status: 200,
        contentType: "application/json",
        headers: { "content-range": `0-${Math.max(linhas.length - 1, 0)}/${linhas.length}` },
        body: JSON.stringify(corpo),
      });
    }

    return rota.fulfill({ status: 200, contentType: "application/json", body: "[]" });
  });
}
