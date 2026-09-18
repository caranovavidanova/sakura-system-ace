// Qual cópia de segurança fica e qual pode ir embora.
//
// Guardamos 30 diárias + 12 mensais (a primeira de cada mês). Na prática:
// cerca de um mês de "ontem, anteontem, semana passada" e cerca de um ano de
// "como estava no começo de cada mês".
//
// POR QUE ISTO É UM ARQUIVO SEPARADO, COM TESTE, EM VEZ DE TRÊS LINHAS DENTRO
// DO WORKFLOW: apagar demais é um erro que não aparece na hora. O job continua
// verde, o relatório continua dizendo "backup feito", e o estrago só se revela
// no dia em que alguém for buscar o arquivo de dois meses atrás e ele não
// existir mais. É a mesma família dos erros de dinheiro deste projeto (§6
// itens 49 e 60): conta que ninguém confere diverge em silêncio.
//
// DUAS DECISÕES QUE VALEM SABER ANTES DE MEXER:
//
// (a) A regra é "guarde as N mais recentes", NUNCA "apague o que tem mais de N
//     dias". Parece a mesma coisa e não é: se o job parar de rodar por dois
//     meses (secret vencido, conta suspensa, GitHub fora do ar) e voltar, a
//     regra por idade apagaria TODO o acervo de uma vez, justo quando ele é a
//     única cópia que existe. A regra por contagem não tem como fazer isso.
//
// (b) Nome que este arquivo não entende NUNCA é apagado. Se um dia alguém
//     subir um arquivo à mão, ou o formato do nome mudar, o pior caso é
//     acumular arquivo demais — nunca perder o que não devia.

/** Quantas cópias diárias seguidas ficam guardadas. */
export const DIARIOS_MANTIDOS = 30;

/** De quantos meses guardamos a primeira cópia do mês. */
export const MENSAIS_MANTIDOS = 12;

// pneus-amigao-2026-09-17.age
const PADRAO = /^(.+)-(\d{4})-(\d{2})-(\d{2})\.age$/;

/**
 * Lê um nome de arquivo de backup. Devolve null quando o nome não é de um
 * backup nosso — e esse null é o que garante a decisão (b) lá de cima.
 *
 * @param {string} nome
 * @returns {{ nome: string, empresa: string, dia: string, mes: string } | null}
 */
export function interpretarNome(nome) {
  const achado = PADRAO.exec(nome);
  if (!achado) return null;

  const [, empresa, ano, mes, dia] = achado;

  // Data impossível (13 de mês, 32 de dia) também conta como "não entendi".
  const numeroMes = Number(mes);
  const numeroDia = Number(dia);
  if (numeroMes < 1 || numeroMes > 12 || numeroDia < 1 || numeroDia > 31) return null;

  return { nome, empresa, dia: `${ano}-${mes}-${dia}`, mes: `${ano}-${mes}` };
}

/**
 * Os nomes que devem continuar existindo.
 *
 * @param {string[]} nomes todos os arquivos que estão hoje no destino
 * @returns {string[]}
 */
export function quaisManter(nomes) {
  const entendidos = nomes
    .map(interpretarNome)
    .filter((x) => x !== null)
    // mais recente primeiro
    .sort((a, b) => b.dia.localeCompare(a.dia));

  const manter = new Set();

  // As N diárias mais recentes.
  for (const arquivo of entendidos.slice(0, DIARIOS_MANTIDOS)) {
    manter.add(arquivo.nome);
  }

  // A PRIMEIRA cópia de cada um dos últimos N meses. "Primeira" e não "última"
  // de propósito: assim a mensal de agosto é escolhida uma vez e nunca mais
  // muda — se fosse a última, a escolha ficaria mudando todo dia dentro do mês
  // corrente, e "a mensal de setembro" seria um alvo móvel.
  const primeiraDoMes = new Map();
  for (const arquivo of entendidos) {
    // a lista está do mais recente pro mais antigo, então a última que
    // sobrescreve cada mês é justamente a mais antiga dele
    primeiraDoMes.set(arquivo.mes, arquivo.nome);
  }

  const mesesRecentes = [...primeiraDoMes.keys()]
    .sort((a, b) => b.localeCompare(a))
    .slice(0, MENSAIS_MANTIDOS);

  for (const mes of mesesRecentes) {
    manter.add(primeiraDoMes.get(mes));
  }

  // Tudo que não foi entendido também fica.
  for (const nome of nomes) {
    if (interpretarNome(nome) === null) manter.add(nome);
  }

  return [...manter];
}

/**
 * Os nomes que podem ser apagados. É o complemento de quaisManter.
 *
 * @param {string[]} nomes
 * @returns {string[]}
 */
export function quaisApagar(nomes) {
  const manter = new Set(quaisManter(nomes));
  return nomes.filter((nome) => !manter.has(nome));
}

// Uso pelo workflow: recebe os nomes pela entrada padrão (um por linha) e
// escreve na saída os que devem ser apagados (um por linha).
//
//   ls | node scripts/retencao-backup.mjs
//
// Silêncio na saída quer dizer "não tem nada pra apagar", que é o caso normal
// no primeiro mês de uso.
if (process.argv[1] && process.argv[1].endsWith("retencao-backup.mjs")) {
  const entrada = [];
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (pedaco) => entrada.push(pedaco));
  process.stdin.on("end", () => {
    const nomes = entrada
      .join("")
      .split("\n")
      .map((linha) => linha.trim())
      .filter((linha) => linha.length > 0);

    for (const nome of quaisApagar(nomes)) console.log(nome);
  });
}
