// ===================================================================
// npm run test:rls — a matriz de RLS (item TR-07.3 do guia de melhorias)
// ===================================================================
//
// O QUE ISTO PROVA, em uma frase: que cada papel enxerga e mexe exatamente
// no que o expectativas.csv diz, e em nada além disso.
//
// POR QUE EXISTE. A RLS é a única defesa real deste sistema — a permissão por
// módulo é checada só na tela (§6 item 1). E RLS falha em SILÊNCIO: policy
// faltando não dá erro, filtra a zero linhas, e do lado do app isso é igual a
// "deu certo" (§6 item 15). Até aqui, cada migration era conferida à mão, uma
// vez, pela sessão que a escreveu. Isto tira a conferência do "alguém
// lembrar".
//
// COMO RODAR.
//   • No CI: já roda sozinho, num job com um Postgres de serviço.
//   • Num Linux com Postgres local:
//       service postgresql start
//       sudo -u postgres psql -c "alter user postgres password 'postgres'"
//       npm run test:rls
//   • No Windows (a máquina dela): NÃO roda, e não precisa. Depende de um
//     Postgres e do `psql` instalados. `npm test` continua sendo o comando de
//     todo dia; este aqui é do CI.
//
//   Endereço do banco: variável SAKURA_RLS_URL (o padrão abaixo serve pro CI
//   e pro Postgres local). O runner cria um banco DESCARTÁVEL e o apaga no
//   fim — ele nunca encosta em banco existente.
//
// COMO CONSERTAR QUANDO FICAR VERMELHO. A saída mostra, célula por célula, o
// que era esperado e o que aconteceu. Duas leituras possíveis, e a ordem
// importa:
//   1. A mudança era intencional (a policy mudou de propósito)? Então atualize
//      o expectativas.csv — e esse diff É a revisão de segurança do PR.
//   2. A mudança não era intencional? Então é um furo de RLS, e o conserto é
//      na policy, nunca no arquivo de expectativas.
// Atualizar o expectativas.csv "pra ficar verde" é o único jeito de este
// teste não valer nada.
// ===================================================================

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = join(AQUI, "..", "..");
const PAPEIS = ["admin_ab", "admin_a", "caixa_a", "orfao", "sem_login"];
const COMANDOS = ["select", "insert", "update", "delete"];

const URL_ADMIN =
  process.env.SAKURA_RLS_URL || "postgres://postgres:postgres@127.0.0.1:5432/postgres";
const NOME_BANCO = `sakura_rls_${process.pid}`;

const problemas = [];
function reprovar(mensagem) {
  problemas.push(mensagem);
}

function urlDoBanco(nome) {
  const u = new URL(URL_ADMIN);
  u.pathname = `/${nome}`;
  return u.toString();
}

function psql(url, args, { silencioso = true } = {}) {
  return execFileSync("psql", [url, "-v", "ON_ERROR_STOP=1", "-X", ...args], {
    encoding: "utf8",
    stdio: silencioso ? ["ignore", "pipe", "pipe"] : "inherit",
    maxBuffer: 64 * 1024 * 1024,
  });
}

// --- lê os dois arquivos declarativos -------------------------------------
// Linha começada por # e linha em branco são comentário: é o que deixa o
// expectativas.csv legível pra quem revisa o PR sem abrir código.
function lerCsv(caminho) {
  const linhas = readFileSync(caminho, "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"));
  const cabecalho = linhas.shift().split(",");
  return linhas.map((linha) => {
    // Sem aspas em campo nenhum, de propósito: um CSV que precisa de parser
    // de verdade é um CSV que ninguém revisa de olho.
    const partes = linha.split(",");
    return Object.fromEntries(cabecalho.map((c, i) => [c.trim(), (partes[i] ?? "").trim()]));
  });
}

const esperado = new Map();
for (const linha of lerCsv(join(AQUI, "expectativas.csv"))) {
  if (!COMANDOS.includes(linha.comando)) {
    reprovar(`expectativas.csv: comando desconhecido "${linha.comando}" em ${linha.tabela}`);
    continue;
  }
  for (const papel of PAPEIS) {
    const valor = linha[papel];
    if (!/^\d+$/.test(valor)) {
      reprovar(`expectativas.csv: ${linha.tabela}/${linha.comando}/${papel} não é um número: "${valor}"`);
      continue;
    }
    esperado.set(`${linha.tabela}|${linha.comando}|${papel}`, Number(valor));
  }
}

const lacunasDeclaradas = new Set(
  lerCsv(join(AQUI, "lacunas-de-proposito.csv")).map(
    (l) => `${l.tabela}|${l.comando.toUpperCase()}`,
  ),
);

if (problemas.length > 0) {
  console.error(problemas.map((p) => `  ✗ ${p}`).join("\n"));
  process.exit(1);
}

// --- monta o banco descartável --------------------------------------------
console.log(`Banco de teste: ${NOME_BANCO}`);
try {
  psql(URL_ADMIN, ["-c", `drop database if exists ${NOME_BANCO}`]);
  psql(URL_ADMIN, ["-c", `create database ${NOME_BANCO}`]);
} catch (erro) {
  console.error(
    "\nNão consegui falar com o Postgres em " +
      URL_ADMIN.replace(/:[^:@/]*@/, ":***@") +
      ".\n" +
      "Esta suíte precisa de um Postgres e do `psql` — ela roda no CI e num Linux\n" +
      "com Postgres local; na máquina do dia a dia (Windows) ela não roda, e isso\n" +
      "é esperado. O comando de todo dia continua sendo `npm test`.\n",
  );
  console.error(String(erro.stderr || erro.message).trim());
  process.exit(1);
}

const URL_TESTE = urlDoBanco(NOME_BANCO);
let saida = 0;
// Marcador pra sair do bloco sem pular o `finally` que apaga o banco.
class SaiuCedo extends Error {}
try {
  for (const arquivo of [
    join(RAIZ, "supabase", "scripts", "stub-supabase-local.sql"),
    join(RAIZ, "supabase", "instalacao", "instalacao-completa.sql"),
    join(AQUI, "cenario.sql"),
    join(AQUI, "sondas.sql"),
    join(AQUI, "matriz.sql"),
  ]) {
    try {
      psql(URL_TESTE, ["-q", "-f", arquivo]);
    } catch (erro) {
      // A mensagem do Postgres é a informação útil aqui (uma migration que
      // não roda, uma sonda que falta). Mostrar só ela, sem a pilha do Node.
      console.error(`\nFalhou aplicando ${arquivo.replace(RAIZ + "/", "")}:\n`);
      console.error(
        String(erro.stderr || erro.message)
          .split("\n")
          .filter((l) => l.trim() && !l.includes("NOTICE:"))
          .map((l) => `  ${l}`)
          .join("\n"),
      );
      process.exitCode = 1;
      saida = 1;
      break;
    }
  }
  if (saida !== 0) throw new SaiuCedo();

  // --- 1. comando sem policy nenhuma --------------------------------------
  // Consulta direta ao catálogo: tabela com RLS ligada que não tenha policy
  // pra algum dos quatro comandos (uma policy ALL cobre os quatro).
  //
  // O apelido é `comando_alvo`, e não `cmd`, por um motivo que já custou uma
  // rodada: `pg_policies` TEM uma coluna chamada `cmd`, e dentro da
  // subconsulta o nome de dentro ganha do de fora — a condição virava
  // `p.cmd in (p.cmd, 'ALL')`, sempre verdadeira, e a checagem devolvia
  // "nenhuma lacuna" pra qualquer banco.
  const lacunas = psql(URL_TESTE, [
    "-tA",
    "-F",
    "|",
    "-c",
    `select c.relname, comando_alvo
       from pg_class c
       join pg_namespace n on n.oid = c.relnamespace and n.nspname = 'public'
       cross join unnest(array['SELECT','INSERT','UPDATE','DELETE']) as comando_alvo
      where c.relkind = 'r' and c.relrowsecurity
        and not exists (
          select 1 from pg_policies p
           where p.schemaname = 'public' and p.tablename = c.relname
             and p.cmd in (comando_alvo, 'ALL'))
      order by 1, 2`,
  ])
    .split("\n")
    .filter(Boolean);

  for (const linha of lacunas) {
    const [tabela, comando] = linha.split("|");
    if (!lacunasDeclaradas.has(`${tabela}|${comando}`)) {
      reprovar(
        `${tabela}: nenhuma policy cobre ${comando}. ` +
          `Isso não dá erro no app — filtra a zero linhas e parece que funcionou (§6 item 15). ` +
          `Crie a policy, ou declare a lacuna em lacunas-de-proposito.csv dizendo por quê.`,
      );
    }
  }
  // E o contrário: lacuna declarada que já foi tapada. Deixar a linha lá
  // envelhecendo faria a lista virar decoração.
  for (const declarada of lacunasDeclaradas) {
    if (!lacunas.includes(declarada)) {
      const [tabela, comando] = declarada.split("|");
      reprovar(
        `lacunas-de-proposito.csv diz que ${tabela}/${comando} não tem policy, mas agora tem. ` +
          `Tire a linha de lá.`,
      );
    }
  }

  // --- 2. a matriz ---------------------------------------------------------
  const obtido = new Map();
  const tabelasVistas = new Set();
  for (const linha of psql(URL_TESTE, [
    "-tA",
    "-F",
    "|",
    "-c",
    "select tabela, comando, papel, coalesce(linhas::text,''), coalesce(erro,'') from teste_rls.resultado order by tabela, comando, papel",
  ])
    .split("\n")
    .filter(Boolean)) {
    const [tabela, comando, papel, linhas, erro] = linha.split("|");
    tabelasVistas.add(tabela);
    obtido.set(`${tabela}|${comando}|${papel}`, { linhas, erro });
  }

  // Tabela nova com RLS e sem linha no expectativas.csv: é migration que
  // passou sem ninguém declarar quem pode o quê nela.
  for (const tabela of [...tabelasVistas].sort()) {
    for (const comando of COMANDOS) {
      if (!esperado.has(`${tabela}|${comando}|admin_ab`)) {
        reprovar(
          `${tabela}/${comando} não está no expectativas.csv. ` +
            `Toda tabela com RLS precisa das quatro linhas declaradas.`,
        );
      }
    }
  }
  for (const chave of esperado.keys()) {
    const tabela = chave.split("|")[0];
    if (!tabelasVistas.has(tabela)) {
      reprovar(
        `expectativas.csv fala da tabela "${tabela}", que não existe no banco (ou está sem RLS).`,
      );
      break;
    }
  }

  const divergencias = [];
  for (const [chave, valorEsperado] of esperado) {
    const resultado = obtido.get(chave);
    if (!resultado) continue;
    const [tabela, comando, papel] = chave.split("|");
    if (resultado.erro) {
      // Erro que não é de RLS: a sonda em si está quebrada. Isso é vermelho,
      // nunca um zero silencioso.
      reprovar(`${tabela}/${comando}/${papel}: a sonda deu erro — ${resultado.erro}`);
      continue;
    }
    if (Number(resultado.linhas) !== valorEsperado) {
      divergencias.push({
        tabela,
        comando,
        papel,
        esperado: valorEsperado,
        obtido: Number(resultado.linhas),
      });
    }
  }

  if (divergencias.length > 0) {
    console.error(`\n${divergencias.length} célula(s) da matriz não bateram:\n`);
    console.error("  tabela                        comando  papel      esperado  aconteceu");
    for (const d of divergencias) {
      console.error(
        `  ${d.tabela.padEnd(29)} ${d.comando.padEnd(8)} ${d.papel.padEnd(10)} ` +
          `${String(d.esperado).padStart(8)}  ${String(d.obtido).padStart(9)}`,
      );
    }
    console.error(
      "\n  Cada linha acima é alguém podendo mexer em mais (ou menos) dado do que\n" +
        "  o combinado. Se a mudança foi intencional, atualize o expectativas.csv —\n" +
        "  esse diff é a revisão de segurança do PR. Se não foi, o conserto é na\n" +
        "  policy.\n",
    );
    saida = 1;
  }

  if (problemas.length > 0) {
    console.error(`\n${problemas.length} problema(s):\n`);
    console.error(problemas.map((p) => `  ✗ ${p}`).join("\n\n"));
    saida = 1;
  }

  if (saida === 0) {
    console.log(
      `\n✓ Matriz de RLS conferida: ${tabelasVistas.size} tabelas × ${COMANDOS.length} comandos × ` +
        `${PAPEIS.length} papéis = ${esperado.size} células, todas como o expectativas.csv declara.`,
    );
    console.log("✓ Nenhum comando ficou sem policy (fora as lacunas declaradas).");
  }
} catch (erro) {
  if (!(erro instanceof SaiuCedo)) throw erro;
} finally {
  try {
    psql(URL_ADMIN, ["-c", `drop database if exists ${NOME_BANCO} with (force)`]);
  } catch {
    console.error(`(não consegui apagar o banco de teste ${NOME_BANCO})`);
  }
}

process.exit(saida);
