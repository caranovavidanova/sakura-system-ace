// ===================================================================
// npm run test:sql — os testes de migration rodando sozinhos
// ===================================================================
//
// O QUE ISTO FAZ. Cada migration que promete alguma coisa importante tem um
// script de teste em supabase/scripts/testar-*.sql (a auditoria mascarar o
// token, o porteiro não deixar ninguém ler o cofre, o balconista não alcançar
// salário, o fechamento de caixa não gravar pela metade...). Até aqui eles só
// rodavam À MÃO, pela sessão que escreveu a migration — ou seja, uma
// migration nova que quebrasse a promessa de uma antiga passaria calada.
//
// Este runner instala o sistema inteiro UMA vez num banco-modelo e, pra cada
// script, copia o modelo num banco limpo (cada teste começa do zero, sem
// herdar o que o anterior gravou ou apagou), roda o script e exige as duas
// coisas: que ele termine sem erro E que imprima "TODAS AS CHECAGENS
// PASSARAM". Script novo na pasta entra sozinho — e script sem essa frase
// reprova, pra ninguém escrever um teste que não tem como dizer que passou.
//
// COMO RODAR.
//   • No CI: já roda sozinho, no job da matriz de RLS (mesmo Postgres).
//   • Num Linux com Postgres local:
//       service postgresql start
//       sudo -u postgres psql -c "alter user postgres password 'postgres'"
//       npm run test:sql
//   • No Windows (a máquina dela): NÃO roda, e não precisa — mesma situação
//     da matriz de RLS. O comando de todo dia continua sendo `npm test`.
//
//   Um script só: npm run test:sql -- testar-auditoria
//   Endereço do banco: variável SAKURA_RLS_URL (o mesmo da matriz de RLS).
//   Todo banco criado aqui é descartável e é apagado no fim.
// ===================================================================

import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const PASTA = join(RAIZ, "supabase", "scripts");
const STUB = join(PASTA, "stub-supabase-local.sql");
const INSTALACAO = join(RAIZ, "supabase", "instalacao", "instalacao-completa.sql");
export const FRASE_DE_SUCESSO = "TODAS AS CHECAGENS PASSARAM";

const URL_ADMIN = process.env.SAKURA_RLS_URL || "postgres://postgres:postgres@127.0.0.1:5432/postgres";
const MODELO = `sakura_sql_modelo_${process.pid}`;

function urlDoBanco(nome) {
  const u = new URL(URL_ADMIN);
  u.pathname = `/${nome}`;
  return u.toString();
}

/** Roda o psql e devolve { ok, saida } — nunca lança. */
function psql(url, args) {
  const r = spawnSync("psql", [url, "-X", "-q", "-v", "ON_ERROR_STOP=1", ...args], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
    timeout: 5 * 60 * 1000,
  });
  return { ok: r.status === 0, saida: `${r.stdout ?? ""}${r.stderr ?? ""}${r.error ? String(r.error) : ""}` };
}

function exigir(resultado, oQue) {
  if (!resultado.ok) {
    console.error(`\n✗ ${oQue}\n${resultado.saida.trim()}`);
    process.exit(1);
  }
}

const filtro = process.argv[2];
const scripts = readdirSync(PASTA)
  .filter((a) => /^testar-.+\.sql$/.test(a))
  .filter((a) => !filtro || a.includes(filtro))
  .sort();

if (scripts.length === 0) {
  console.error(filtro ? `Nenhum script casa com "${filtro}".` : "Nenhum testar-*.sql encontrado.");
  process.exit(1);
}

const conexao = psql(URL_ADMIN, ["-Atc", "select 1"]);
if (!conexao.ok) {
  console.error(
    `\nNão consegui falar com o Postgres em ${URL_ADMIN.replace(/:[^:@/]*@/, ":***@")}.\n` +
      "Esta suíte precisa de um Postgres e do `psql` — roda no CI e num Linux com\n" +
      "Postgres local; no Windows do dia a dia ela não roda, e isso é esperado.\n",
  );
  console.error(conexao.saida.trim());
  process.exit(1);
}

const criados = [];
function apagarTudo() {
  for (const nome of criados.reverse()) {
    psql(URL_ADMIN, ["-c", `drop database if exists ${nome} with (force)`]);
  }
}

let falhas = 0;
try {
  console.log(`Instalando o sistema no banco-modelo (${MODELO})...`);
  exigir(psql(URL_ADMIN, ["-c", `drop database if exists ${MODELO} with (force)`]), "apagar modelo antigo");
  exigir(psql(URL_ADMIN, ["-c", `create database ${MODELO}`]), "criar o banco-modelo");
  criados.push(MODELO);
  exigir(psql(urlDoBanco(MODELO), ["-f", STUB]), "rodar o stub do Supabase no modelo");
  exigir(psql(urlDoBanco(MODELO), ["-f", INSTALACAO]), "rodar a instalação completa no modelo");

  for (const [i, script] of scripts.entries()) {
    const nome = `sakura_sql_${process.pid}_${i}`;
    exigir(psql(URL_ADMIN, ["-c", `create database ${nome} template ${MODELO}`]), `copiar o modelo pra ${script}`);
    criados.push(nome);

    const r = psql(urlDoBanco(nome), ["-f", join(PASTA, script)]);
    if (r.ok && r.saida.includes(FRASE_DE_SUCESSO)) {
      const linha = r.saida.split("\n").find((l) => l.includes(FRASE_DE_SUCESSO)) ?? "";
      console.log(`  ✓ ${script}${linha.includes("(") ? ` ${linha.slice(linha.indexOf("("))}` : ""}`);
    } else {
      falhas += 1;
      const motivo = r.ok
        ? `terminou sem erro mas não disse "${FRASE_DE_SUCESSO}" — todo teste precisa terminar com essa frase`
        : "falhou";
      console.error(`  ✗ ${script}: ${motivo}\n${r.saida.trim().split("\n").slice(-15).join("\n")}\n`);
    }
  }
} finally {
  apagarTudo();
}

if (falhas > 0) {
  console.error(`\n✗ ${falhas} de ${scripts.length} testes de migration falharam.`);
  process.exit(1);
}
console.log(`\n✓ Os ${scripts.length} testes de migration passaram, cada um num banco limpo.`);
