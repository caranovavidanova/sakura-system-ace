// Atualiza o banco de TODAS as empresas de uma vez (item 11 da seção 8 do
// PROJETO_STATUS.md).
//
// O PROBLEMA. Cada empresa tem o próprio projeto Supabase, e toda migration
// nova era colada à mão no SQL Editor de cada um. Com três empresas, uma
// migration vira três colagens — e esquecer um banco só aparece depois, como
// a faixa "o banco desta empresa ainda não foi atualizado" naquela loja.
//
// QUEM RODA ISTO é o workflow "Atualizar o banco de todas as empresas"
// (.github/workflows/atualizar-bancos.yml), sempre na mão, na aba Actions.
// Nunca roda sozinho: a regra "migration antes da tag" continua valendo, e
// quem decide a hora é ela.
//
// OS DOIS MODOS:
//
//   ensaiar (o padrão) — roda as migrations que faltam em cada banco DE
//     VERDADE, dentro de uma transação, e DESFAZ no fim. Não muda nada, e diz
//     não só o que cada banco receberia, mas se PASSARIA — inclusive o erro
//     que só existe por causa do dado daquela loja.
//
//   aplicar — primeiro ensaia em TODOS os bancos; se qualquer ensaio falhar,
//     não aplica em nenhum. Passando, aplica banco por banco, na ordem da
//     lista (a primeira empresa vai primeiro, como canário), cada migration
//     na própria transação: se uma falhar, aquele banco fica exatamente como
//     estava antes dela, e o robô PARA ali — nos bancos seguintes nada é
//     feito. No fim, confere de fora que cada banco chegou na última
//     migration do repositório.
//
// COMO ELE SABE O QUE FALTA. Pela tabela `schema_versao` (migration 0055):
// toda migration termina registrando o próprio número lá, então o maior
// número da tabela é a versão do banco. E como a migration só registra o
// número se ela inteira passou (é tudo uma transação), a tabela não mente.
// Banco sem essa tabela é anterior à 0055: o robô recusa e explica — esse
// caso raro se resolve à mão, uma vez.
//
// POR QUE A LÓGICA MORA AQUI, COM TESTE, e não em linhas de bash no workflow:
// é o passo que mexe no banco de loja de outra empresa, e o jeito de ele dar
// errado é silencioso (uma migration aplicada fora de ordem, um banco que
// ficou pela metade sem ninguém saber). As lições que o backup pagou caro
// (§6 itens 67 e 68) estão aqui: `set -e` que não vale dentro de `if`, `psql`
// errado escolhido sozinho, campo vazio que se disfarça de outro erro.

import { execFile } from "node:child_process";
import { readdirSync } from "node:fs";
import { appendFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const MODOS = ["ensaiar", "aplicar"];

/**
 * Espera máxima por uma trava de tabela. Sem isto, um `alter table` que
 * encontra a tabela ocupada fica ESPERANDO — e enquanto espera, toda consulta
 * nova naquela tabela entra na fila atrás dele: a tela da loja congela. Com
 * o limite, a migration falha com uma mensagem clara e a loja nem percebe.
 */
export const ESPERA_POR_TRAVA = "15s";

/** O marcador que o `psql` imprime antes de cada migration, no ensaio. */
const MARCADOR = "@@sakura-migration";

// --- As empresas -------------------------------------------------------------

/**
 * Lê o secret BACKUP_EMPRESAS — o mesmo do backup, de propósito: empresa nova
 * que entra no backup entra aqui junto, sem um secret a mais pra esquecer.
 * Só os campos `nome` e `banco` interessam aqui.
 *
 * O secret é editado à mão, e a caixa de editar secret do GitHub aparece
 * SEMPRE VAZIA — colar só um pedaço substitui a lista inteira (§6 item 68).
 * Por isso cada defeito de formato vira uma frase em português, e não um
 * "Unexpected token" que não diz nada a quem não programa.
 *
 * @param {string | undefined} texto
 * @returns {{ nome: string, banco: string }[]}
 */
export function lerEmpresas(texto) {
  const onde = "O modelo está no PROJETO_STATUS.md, seção 9, em 'Backup do banco'.";
  if (!texto || !String(texto).trim()) {
    throw new Error(`O secret BACKUP_EMPRESAS está vazio — sem ele não há banco nenhum pra atualizar. ${onde}`);
  }
  let lista;
  try {
    lista = JSON.parse(texto);
  } catch {
    throw new Error(
      `O secret BACKUP_EMPRESAS não está no formato certo. Ele precisa ser a LISTA inteira, começando com [ e terminando com ], com um bloco { ... } por empresa — não só a chave ou só um pedaço. ${onde}`,
    );
  }
  if (!Array.isArray(lista)) {
    throw new Error(
      `O secret BACKUP_EMPRESAS precisa ser uma LISTA, começando com [ e terminando com ] — mesmo com uma empresa só. ${onde}`,
    );
  }
  if (lista.length === 0) {
    throw new Error(`O secret BACKUP_EMPRESAS está com a lista vazia. ${onde}`);
  }

  const vistos = new Set();
  return lista.map((item, i) => {
    const numero = i + 1;
    for (const campo of ["nome", "banco"]) {
      if (!item || typeof item[campo] !== "string" || !item[campo].trim()) {
        throw new Error(`A empresa de número ${numero} no BACKUP_EMPRESAS está sem o campo "${campo}".`);
      }
    }
    const nome = item.nome.trim();
    if (vistos.has(nome)) {
      throw new Error(`A empresa "${nome}" aparece duas vezes no BACKUP_EMPRESAS.`);
    }
    vistos.add(nome);
    return { nome, banco: item.banco.trim() };
  });
}

/**
 * O que precisa ficar escondido dos registros do GitHub: a linha de conexão
 * inteira e, separada, a senha dentro dela (um erro que mostrasse só um
 * pedaço da linha ainda estaria coberto).
 *
 * @param {string} banco
 * @returns {string[]}
 */
export function segredosDaConexao(banco) {
  const segredos = [banco];
  try {
    const senha = decodeURIComponent(new URL(banco).password);
    if (senha) segredos.push(senha);
  } catch {
    // Linha que não é URL (formato "host=... password=..."): esconder a
    // linha inteira já é o que dá pra fazer.
  }
  return segredos;
}

// --- As migrations -----------------------------------------------------------

/**
 * @typedef {{ numero: number, arquivo: string, caminho: string }} Migration
 */

/**
 * As migrations do repositório, em ordem NUMÉRICA — nunca alfabética. Hoje as
 * duas coincidem porque os nomes têm 4 dígitos; no dia em que existir a
 * 10000, "10000_x" viria antes de "9999_y" na ordem de texto, e aplicar fora
 * de ordem quebra do jeito mais difícil de achar.
 *
 * @param {string} pasta
 * @returns {Migration[]}
 */
export function listarMigrations(pasta) {
  const lista = [];
  const numeros = new Set();
  for (const arquivo of readdirSync(pasta)) {
    if (!arquivo.endsWith(".sql")) continue;
    const casou = /^(\d+)_/.exec(arquivo);
    if (!casou) continue;
    const numero = Number(casou[1]);
    if (numeros.has(numero)) {
      throw new Error(`Duas migrations com o número ${numero} na pasta. Nada foi feito.`);
    }
    numeros.add(numero);
    const caminho = path.resolve(pasta, arquivo);
    // O caminho vai dentro de um `\i '...'` do psql. Aspa ou quebra de linha
    // no nome quebrariam o comando — e nome assim não existe neste projeto.
    if (/['\n\r\\]/.test(caminho)) {
      throw new Error(`O caminho da migration ${arquivo} tem um caractere que não dá pra passar ao psql.`);
    }
    lista.push({ numero, arquivo, caminho });
  }
  return lista.sort((a, b) => a.numero - b.numero);
}

/**
 * As que faltam num banco que está na versão `versaoDoBanco`.
 *
 * @param {Migration[]} migrations
 * @param {number} versaoDoBanco
 */
export function pendentes(migrations, versaoDoBanco) {
  return migrations.filter((m) => m.numero > versaoDoBanco);
}

/** "0058" — como o número aparece no nome do arquivo e na faixa do app. */
export function numeroComZeros(numero) {
  return String(numero).padStart(4, "0");
}

// --- Os scripts que o psql recebe ------------------------------------------

/**
 * O ensaio: todas as pendentes numa transação só, desfeita no fim. O
 * marcador antes de cada uma é o que diz, se der erro, EM QUAL migration foi.
 *
 * @param {Migration[]} lista
 */
export function scriptDeEnsaio(lista) {
  return [
    "\\set ON_ERROR_STOP on",
    "begin;",
    `set local lock_timeout = '${ESPERA_POR_TRAVA}';`,
    ...lista.flatMap((m) => [`\\echo ${MARCADOR} ${m.numero}`, `\\i '${m.caminho}'`]),
    "rollback;",
    "",
  ].join("\n");
}

/**
 * Uma migration aplicada de verdade, na PRÓPRIA transação. Se algo falhar, o
 * `psql` sai antes do `commit` e o Postgres desfaz tudo — inclusive a linha
 * de `schema_versao`, que é o que mantém a versão do banco honesta.
 *
 * @param {Migration} m
 */
export function scriptDeAplicacao(m) {
  return [
    "\\set ON_ERROR_STOP on",
    "begin;",
    `set local lock_timeout = '${ESPERA_POR_TRAVA}';`,
    `\\i '${m.caminho}'`,
    "commit;",
    "",
  ].join("\n");
}

/**
 * Em qual migration o ensaio parou: a última cujo marcador saiu na tela.
 *
 * @param {string} saida
 * @returns {number | null}
 */
export function ultimaMigrationIniciada(saida) {
  let ultima = null;
  for (const linha of String(saida).split(/\r?\n/)) {
    const casou = new RegExp(`^${MARCADOR} (\\d+)$`).exec(linha.trim());
    if (casou) ultima = Number(casou[1]);
  }
  return ultima;
}

/**
 * A mensagem de erro do Postgres, sem o ruído. O `psql` escreve os avisos
 * (NOTICE) no mesmo lugar dos erros, e uma migration idempotente rodada de
 * novo produz dezenas de "já existe, pulando" — que não são o motivo de nada.
 *
 * @param {string} saidaDeErro
 */
export function resumirErro(saidaDeErro) {
  const linhas = String(saidaDeErro)
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !/^(psql:[^:]*:\d+: )?NOTICE:/.test(l));
  const principal = linhas.find((l) => /ERROR|FATAL|ERRO|could not|error:/i.test(l));
  const texto = (principal ?? linhas[0] ?? "o psql saiu sem dizer o motivo")
    .replace(/^psql:[^:]*:\d+: /, "")
    .replace(/^psql: error: /, "");
  return texto.length > 400 ? `${texto.slice(0, 400)}…` : texto;
}

/**
 * Os avisos que a própria migration quis mostrar (RAISE NOTICE), sem os
 * automáticos do Postgres ("already exists, skipping"). É por aqui que uma
 * migration defensiva conta "não criei tal trava porque o dado não deixa".
 *
 * @param {string} saidaDeErro
 * @returns {string[]}
 */
export function avisosDaMigration(saidaDeErro) {
  return String(saidaDeErro)
    .split(/\r?\n/)
    .map((l) => /NOTICE:\s*(.*)$/.exec(l.trim())?.[1]?.trim() ?? "")
    .filter((l) => l && !/already exists|does not exist, skipping|skipping$/i.test(l));
}

// --- O trabalho ---------------------------------------------------------------

/**
 * @typedef {(pedido: { banco: string, argumentos?: string[], entrada?: string })
 *   => Promise<{ codigo: number, saida: string, erro: string }>} Psql
 */

/**
 * @typedef {object} Situacao
 * @property {string} nome
 * @property {number | null} versao        a versão antes de mexer (null = não deu pra saber)
 * @property {number[]} pendentes          os números que faltam
 * @property {"ok" | "problema"} ensaio
 * @property {string} [motivo]             por que o ensaio não passou
 * @property {number | null} [falhouEm]    em qual migration o ensaio parou
 * @property {string[]} [avisos]           o que as migrations pediram pra mostrar
 * @property {"aplicado" | "em-dia" | "falhou" | "nao-tocado"} [aplicacao]
 * @property {number | null} [versaoFinal] a versão conferida no fim
 */

async function consultar(psql, banco, sql) {
  const r = await psql({ banco, argumentos: ["-Atc", sql] });
  if (r.codigo !== 0) throw new Error(resumirErro(r.erro));
  return r.saida.trim();
}

/**
 * Em que versão este banco está. `null` quando não tem `schema_versao`.
 *
 * @param {Psql} psql
 * @param {string} banco
 */
export async function versaoDoBanco(psql, banco) {
  const existe = await consultar(psql, banco, "select to_regclass('public.schema_versao') is not null");
  if (existe !== "t") return null;
  const maior = await consultar(psql, banco, "select coalesce(max(versao), 0) from schema_versao");
  const numero = Number(maior);
  if (!Number.isInteger(numero)) throw new Error(`a versão do banco veio num formato inesperado ("${maior}")`);
  return numero;
}

/**
 * @param {object} p
 * @param {"ensaiar" | "aplicar"} p.modo
 * @param {{ nome: string, banco: string }[]} p.empresas
 * @param {Migration[]} p.migrations
 * @param {Psql} p.psql
 * @param {(mensagem: string) => void} [p.log]
 * @returns {Promise<{ modo: string, ultima: number, situacoes: Situacao[], sucesso: boolean, conclusao: string }>}
 */
export async function atualizarBancos({ modo, empresas, migrations, psql, log = console.log }) {
  if (!MODOS.includes(modo)) {
    throw new Error(`Modo "${modo}" não existe. Use "ensaiar" ou "aplicar".`);
  }
  if (migrations.length === 0) throw new Error("Não achei migration nenhuma no repositório.");
  const ultima = migrations[migrations.length - 1].numero;

  // --- 1. Onde cada banco está, e o ensaio em todos -------------------------
  /** @type {Situacao[]} */
  const situacoes = [];
  for (const { nome, banco } of empresas) {
    /** @type {Situacao} */
    const s = { nome, versao: null, pendentes: [], ensaio: "ok", avisos: [] };
    situacoes.push(s);

    try {
      s.versao = await versaoDoBanco(psql, banco);
    } catch (erro) {
      s.ensaio = "problema";
      s.motivo = `não consegui falar com o banco: ${erro instanceof Error ? erro.message : erro}`;
      log(`${nome}: ${s.motivo}`);
      continue;
    }

    if (s.versao === null) {
      s.ensaio = "problema";
      s.motivo =
        "este banco não tem a tabela schema_versao, ou seja, está antes da migration 0055. Rode no SQL Editor dele, à mão e em ordem, as migrations que faltam até a 0055 (inclusive) — daí em diante este botão cuida sozinho.";
      log(`${nome}: ${s.motivo}`);
      continue;
    }
    if (s.versao > ultima) {
      s.ensaio = "problema";
      s.motivo = `o banco está na ${numeroComZeros(s.versao)}, MAIS NOVO que a última migration deste código (${numeroComZeros(ultima)}). Isso quase sempre quer dizer que o botão foi rodado a partir de uma branch antiga — rode a partir da main.`;
      log(`${nome}: ${s.motivo}`);
      continue;
    }

    const faltam = pendentes(migrations, s.versao);
    s.pendentes = faltam.map((m) => m.numero);
    if (faltam.length === 0) {
      log(`${nome}: em dia (${numeroComZeros(s.versao)}).`);
      continue;
    }

    log(`${nome}: está na ${numeroComZeros(s.versao)}; faltam ${faltam.map((m) => numeroComZeros(m.numero)).join(", ")}. Ensaiando…`);
    const r = await psql({ banco, entrada: scriptDeEnsaio(faltam) });
    s.avisos = avisosDaMigration(r.erro);
    if (r.codigo !== 0) {
      s.ensaio = "problema";
      s.falhouEm = ultimaMigrationIniciada(r.saida);
      s.motivo = resumirErro(r.erro);
      log(
        `${nome}: o ensaio NÃO passou${s.falhouEm ? ` na ${numeroComZeros(s.falhouEm)}` : ""} — ${s.motivo}. Nada foi mudado neste banco.`,
      );
    } else {
      log(`${nome}: o ensaio passou (e foi desfeito — nada mudou).`);
    }
  }

  const algumProblema = situacoes.some((s) => s.ensaio === "problema");

  if (modo === "ensaiar") {
    return {
      modo,
      ultima,
      situacoes,
      sucesso: !algumProblema,
      conclusao: algumProblema
        ? "O ensaio encontrou problema em pelo menos um banco. Nada foi mudado em banco nenhum."
        : "Ensaio concluído: todas as migrations que faltam passariam. Nada foi mudado em banco nenhum.",
    };
  }

  // --- 2. Aplicar — só se TODOS os ensaios passaram --------------------------
  if (algumProblema) {
    for (const s of situacoes) s.aplicacao = "nao-tocado";
    return {
      modo,
      ultima,
      situacoes,
      sucesso: false,
      conclusao:
        "Nada foi aplicado em banco nenhum: o ensaio encontrou problema em pelo menos um deles. Resolva o que está apontado e rode de novo — o que já estava em dia continua em dia.",
    };
  }

  let parou = false;
  for (const [i, s] of situacoes.entries()) {
    if (parou) {
      s.aplicacao = "nao-tocado";
      continue;
    }
    if (s.pendentes.length === 0) {
      s.aplicacao = "em-dia";
      continue;
    }
    const { banco } = empresas[i];
    for (const numero of s.pendentes) {
      const m = migrations.find((x) => x.numero === numero);
      log(`${s.nome}: aplicando ${m.arquivo}…`);
      const r = await psql({ banco, entrada: scriptDeAplicacao(m) });
      if (r.codigo !== 0) {
        s.aplicacao = "falhou";
        s.falhouEm = numero;
        s.motivo = resumirErro(r.erro);
        log(`${s.nome}: a ${numeroComZeros(numero)} FALHOU e foi desfeita — ${s.motivo}. Parando aqui.`);
        parou = true;
        break;
      }
    }
    if (!parou) s.aplicacao = "aplicado";
  }

  // --- 3. Conferência de fora --------------------------------------------------
  // "O psql disse que deu certo" não é o mesmo que "o banco está na versão
  // certa". A conferência pergunta de novo, do zero, a cada banco.
  let todosEmDia = true;
  for (const [i, s] of situacoes.entries()) {
    try {
      s.versaoFinal = await versaoDoBanco(psql, empresas[i].banco);
    } catch (erro) {
      s.versaoFinal = null;
      log(`${s.nome}: não consegui conferir a versão final — ${erro instanceof Error ? erro.message : erro}`);
    }
    if (s.versaoFinal !== ultima) todosEmDia = false;
  }

  return {
    modo,
    ultima,
    situacoes,
    sucesso: !parou && todosEmDia,
    conclusao: parou
      ? "Uma migration falhou e o robô parou. Os bancos antes dela ficaram atualizados; o que falhou ficou exatamente como estava antes da migration que deu erro; os seguintes não foram tocados. Resolva e rode de novo: ele aplica só o que ainda falta."
      : todosEmDia
        ? `Todos os bancos estão na ${numeroComZeros(ultima)}, a última migration do repositório.`
        : "As migrations rodaram sem erro, mas a conferência final não achou todos os bancos na última versão. Veja a tabela.",
  };
}

// --- O resumo que aparece na página do workflow --------------------------------

const ROTULO_APLICACAO = {
  aplicado: "✅ atualizado",
  "em-dia": "✅ já estava em dia",
  falhou: "❌ falhou (desfeito)",
  "nao-tocado": "— não mexido",
};

/**
 * @param {Awaited<ReturnType<typeof atualizarBancos>>} r
 */
export function montarResumo(r) {
  const v = (n) => (n === null || n === undefined ? "?" : numeroComZeros(n));
  const titulo =
    r.modo === "ensaiar"
      ? `### ${r.sucesso ? "✅" : "⚠️"} Ensaio — nada foi mudado`
      : `### ${r.sucesso ? "✅" : "❌"} Aplicação`;

  const linhas = [titulo, "", `Última migration deste código: **${numeroComZeros(r.ultima)}**.`, ""];

  if (r.modo === "ensaiar") {
    linhas.push("| Empresa | Está em | Faltam | O ensaio |", "|---|---|---|---|");
    for (const s of r.situacoes) {
      const faltam = s.pendentes.length ? s.pendentes.map(numeroComZeros).join(", ") : "nada";
      const ensaio =
        s.ensaio === "ok"
          ? s.pendentes.length
            ? "✅ passaria"
            : "✅ em dia"
          : `❌ ${s.falhouEm ? `parou na ${numeroComZeros(s.falhouEm)}: ` : ""}${s.motivo}`;
      linhas.push(`| ${s.nome} | ${v(s.versao)} | ${faltam} | ${ensaio.replace(/\|/g, "/")} |`);
    }
  } else {
    linhas.push("| Empresa | Estava em | Resultado | Ficou em |", "|---|---|---|---|");
    for (const s of r.situacoes) {
      let resultado = ROTULO_APLICACAO[s.aplicacao ?? "nao-tocado"];
      if (s.aplicacao === "falhou") {
        resultado += ` na ${numeroComZeros(s.falhouEm)}: ${s.motivo}`;
      } else if (s.ensaio === "problema") {
        resultado += ` — o ensaio não passou${s.falhouEm ? ` na ${numeroComZeros(s.falhouEm)}` : ""}: ${s.motivo}`;
      }
      linhas.push(`| ${s.nome} | ${v(s.versao)} | ${resultado.replace(/\|/g, "/")} | ${v(s.versaoFinal ?? s.versao)} |`);
    }
  }

  const comAviso = r.situacoes.filter((s) => s.avisos && s.avisos.length);
  if (comAviso.length) {
    linhas.push("", "**O que as migrations avisaram** (não é erro — é o que elas pediram pra mostrar):", "");
    for (const s of comAviso) {
      for (const aviso of s.avisos) linhas.push(`- ${s.nome}: ${aviso}`);
    }
  }

  linhas.push("", r.conclusao, "");
  return linhas.join("\n");
}

// --- Rodando de verdade (no workflow) ------------------------------------------

/** @type {Psql} */
function psqlDeVerdade({ banco, argumentos = [], entrada }) {
  // O `psql` de /usr/bin é um atalho que escolhe a versão sozinho, e escolhe
  // errado (§6 item 67) — o workflow resolve o caminho da versão certa e
  // passa em PSQL.
  const programa = process.env.PSQL || "psql";
  return new Promise((resolve) => {
    const filho = execFile(
      programa,
      ["-X", "-q", "-v", "ON_ERROR_STOP=1", "-d", banco, ...argumentos],
      {
        maxBuffer: 64 * 1024 * 1024,
        // Conexão travada não pode pendurar o job: o limite do GitHub são 6
        // horas, e até lá ninguém fica sabendo de nada.
        env: { ...process.env, PGCONNECT_TIMEOUT: process.env.PGCONNECT_TIMEOUT || "15" },
      },
      (erro, saida, saidaDeErro) => {
        resolve({ codigo: erro ? (typeof erro.code === "number" ? erro.code : 1) : 0, saida, erro: saidaDeErro });
      },
    );
    if (entrada !== undefined) filho.stdin.end(entrada);
    else filho.stdin.end();
  });
}

const ESTE_ARQUIVO = fileURLToPath(import.meta.url);
if (process.argv[1] && path.resolve(process.argv[1]) === ESTE_ARQUIVO) {
  const resumo = process.env.GITHUB_STEP_SUMMARY;
  const noGitHub = process.env.GITHUB_ACTIONS === "true";
  try {
    const modo = String(process.argv[2] || "ensaiar").trim();
    const empresas = lerEmpresas(process.env.BACKUP_EMPRESAS);
    // Antes de qualquer saída: esconder as linhas de conexão e as senhas.
    if (noGitHub) {
      for (const e of empresas) for (const s of segredosDaConexao(e.banco)) console.log(`::add-mask::${s}`);
    }
    const pasta = process.env.PASTA_MIGRATIONS || path.join(path.dirname(ESTE_ARQUIVO), "..", "supabase", "migrations");
    const r = await atualizarBancos({ modo, empresas, migrations: listarMigrations(pasta), psql: psqlDeVerdade });
    const texto = montarResumo(r);
    console.log(`\n${texto}`);
    if (resumo) await appendFile(resumo, `${texto}\n`);
    if (!r.sucesso) {
      console.error(`::error::${r.conclusao}`);
      process.exit(1);
    }
  } catch (erro) {
    const mensagem = erro instanceof Error ? erro.message : String(erro);
    console.error(`::error::${mensagem}`);
    if (resumo) await appendFile(resumo, `### ❌ Não deu pra começar\n\n${mensagem}\n`);
    process.exit(1);
  }
}
