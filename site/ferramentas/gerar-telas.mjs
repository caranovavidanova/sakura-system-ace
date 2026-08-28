import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";
import { mkdirSync } from "node:fs";
import { TABELAS, SESSAO } from "./dados-demo.mjs";

// Gera as imagens do site rodando o app DE VERDADE num navegador, com as
// chamadas ao Supabase interceptadas e respondidas com dados inventados —
// nada toca o banco de nenhuma loja. Ver site/ferramentas/README.md.

const BASE = "http://localhost:5199";
const SAIDA = process.argv[2] || "site/telas";
mkdirSync(SAIDA, { recursive: true });

const TELAS = [
  ["inicio", "/", "Início"],
  ["ordens-servico", "/ordens-servico", "Ordens de Serviço"],
  ["estoque", "/estoque", "Estoque"],
  ["caixa", "/caixa", "Caixa Diário"],
  ["clientes", "/clientes", "Clientes"],
];

const navegador = await chromium.launch({ args: ["--lang=pt-BR"], env: { ...process.env, LANG: "pt_BR.UTF-8", LANGUAGE: "pt_BR" } });
const contexto = await navegador.newContext({
  viewport: { width: 1720, height: 980 },
  deviceScaleFactor: 1.6, // nítido sem virar arquivo gigante
  locale: "pt-BR",
  timezoneId: "America/Sao_Paulo",
});

const chamadasSemDados = new Set();

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
      chamadasSemDados.add(tabela);
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

const pagina = await contexto.newPage();
pagina.on("console", (m) => {
  if (m.type() === "error") console.log("  [console]", m.text().slice(0, 160));
});

// --- login ---
await pagina.goto(BASE, { waitUntil: "networkidle" });
await pagina.fill('input[type="text"], input:not([type="password"]):visible', "demo");
await pagina.fill('input[type="password"]', "demo1234");
await pagina.click('button[type="submit"]');
await pagina.waitForTimeout(2500);

const entrou = await pagina.locator("aside, nav").count();
console.log(entrou > 0 ? "login simulado: OK" : "login simulado: FALHOU (sem menu lateral)");

for (const [arquivo, rota, titulo] of TELAS) {
  await pagina.goto(`${BASE}/#${rota}`, { waitUntil: "networkidle" });
  await pagina.waitForTimeout(1800);
  await pagina.screenshot({ path: `${SAIDA}/${arquivo}.jpg`, type: "jpeg", quality: 86 });
  console.log(`  ✓ ${titulo} -> ${arquivo}.jpg`);
}

if (chamadasSemDados.size) {
  console.log("tabelas sem dado de demonstração:", [...chamadasSemDados].join(", "));
}

await navegador.close();
