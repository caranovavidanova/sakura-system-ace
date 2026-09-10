import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";
import { mkdirSync } from "node:fs";
import { instalarBancoFalso, tabelasSemDados } from "./banco-falso.mjs";

// Gera as imagens do site rodando o app DE VERDADE num navegador, com as
// chamadas ao Supabase interceptadas e respondidas com dados inventados —
// nada toca o banco de nenhuma loja. Ver site/README.md.
//
// Pra um print de TODAS as telas do sistema (e não só as do site), use
// gerar-catalogo-telas.mjs, que compartilha o mesmo banco falso.

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

await instalarBancoFalso(contexto);

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

const faltando = tabelasSemDados();
if (faltando.size) {
  console.log("tabelas sem dado de demonstração:", [...faltando].join(", "));
}

await navegador.close();
