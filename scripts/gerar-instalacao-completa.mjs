// Gera um arquivo SQL único com TODAS as migrations em ordem, pra instalar o
// banco de uma empresa nova colando uma vez só no SQL Editor do Supabase.
//
// Rodar com: npm run gerar-instalacao
//
// Por que existe: instalar uma loja nova exigia abrir os ~47 arquivos de
// supabase/migrations/ e colar um por um, na ordem certa. Pular um arquivo (ou
// trocar a ordem) não dá erro na hora — quebra depois, na tela do app, como um
// erro estranho difícil de ligar à instalação. Com o arquivo único isso deixa
// de ser possível.
//
// O arquivo gerado NÃO é uma migration nem entra na sequência numerada: é só a
// mesma coisa concatenada. Toda migration do projeto é idempotente, então o
// arquivo inteiro também é (seguro rodar de novo num banco já instalado).
//
// IMPORTANTE: rodar este script de novo toda vez que uma migration nova for
// criada, senão o arquivo de instalação fica pra trás e uma loja nova nasce
// com o banco desatualizado. O `npm test` confere isso (ver
// scripts/gerar-instalacao-completa.test.ts).
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const PASTA_MIGRATIONS = "supabase/migrations";
const PASTA_SAIDA = "supabase/instalacao";
const ARQUIVO_SAIDA = join(PASTA_SAIDA, "instalacao-completa.sql");

/** Lê as migrations já em ordem numérica (0001, 0002, ... 0047). */
export function listarMigrations(pasta = PASTA_MIGRATIONS) {
  return readdirSync(pasta)
    .filter((nome) => nome.endsWith(".sql"))
    .sort(); // os nomes começam com número de 4 dígitos, então ordem alfabética = ordem correta
}

/**
 * A migration que criou `schema_versao` (item TR-05.7). A partir DELA, toda
 * migration precisa registrar a própria linha — ver `migrationsSemRegistroDeVersao`.
 */
export const PRIMEIRA_VERSAO_REGISTRADA = 55;

/**
 * As migrations que esqueceram de registrar a própria versão em `schema_versao`.
 *
 * Por que isso é conferido por máquina: o app compara o maior número gravado
 * lá com a versão que a build dele espera, e avisa quando o banco está atrás
 * (item TR-05.7). Uma migration que não se registra faz esse aviso MENTIR —
 * ele passa a acusar um banco em dia de estar desatualizado, e aviso que
 * mente ensina quem usa a ignorar aviso. Esquecer é fácil; por isso vira
 * `npm test` vermelho, e não uma linha de documentação.
 *
 * A 0055 é a exceção: ela cria a tabela e preenche de 1 a 55 de uma vez.
 */
export function migrationsSemRegistroDeVersao(pasta = PASTA_MIGRATIONS) {
  return listarMigrations(pasta).filter((nome) => {
    const versao = Number(nome.slice(0, 4));
    if (!Number.isInteger(versao) || versao <= PRIMEIRA_VERSAO_REGISTRADA) return false;

    const conteudo = readFileSync(join(pasta, nome), "utf8");
    // Tolerante ao formato (quebra de linha, `values` em outra linha), exigente
    // no que importa: tem que ser esta tabela e este número.
    const registro = new RegExp(
      `insert\\s+into\\s+schema_versao[\\s\\S]{0,200}?\\(\\s*${versao}\\s*\\)`,
      "i",
    );
    return !registro.test(conteudo);
  });
}

/** Monta o conteúdo do arquivo único a partir da lista de migrations. */
export function montarInstalacaoCompleta(pasta = PASTA_MIGRATIONS) {
  const arquivos = listarMigrations(pasta);

  const cabecalho = [
    "-- ===================================================================",
    "-- Sakura System — AutoCenter Edition",
    "-- INSTALAÇÃO COMPLETA DO BANCO (empresa nova)",
    "-- ===================================================================",
    "--",
    "-- ARQUIVO GERADO AUTOMATICAMENTE — não editar à mão.",
    "-- Para regerar: npm run gerar-instalacao",
    "--",
    `-- Contém as ${arquivos.length} migrations de supabase/migrations/, na ordem.`,
    "--",
    "-- Como usar: painel do Supabase → SQL Editor → New query → colar TUDO",
    "-- deste arquivo → Run. Leva alguns segundos.",
    "--",
    "-- Seguro rodar de novo num banco que já tem tudo (todas as migrations são",
    "-- idempotentes) — não apaga nem duplica nada.",
    "--",
    "-- Isto é SÓ a parte do banco. O passo a passo completo de instalar uma",
    "-- loja nova (Auth, primeiro admin, app) está em",
    "-- supabase/instalacao/INSTALAR-LOJA-NOVA.md",
    "-- ===================================================================",
    "",
    "",
  ].join("\n");

  const corpo = arquivos
    .map((nome) => {
      const conteudo = readFileSync(join(pasta, nome), "utf8").trimEnd();
      const separador = [
        "-- -------------------------------------------------------------------",
        `-- ${nome}`,
        "-- -------------------------------------------------------------------",
      ].join("\n");
      return `${separador}\n\n${conteudo}\n`;
    })
    .join("\n\n");

  return `${cabecalho}${corpo}`;
}

// Só escreve o arquivo quando rodado direto (`npm run gerar-instalacao`),
// não quando importado pelo teste.
if (process.argv[1]?.endsWith("gerar-instalacao-completa.mjs")) {
  mkdirSync(PASTA_SAIDA, { recursive: true });

  const esquecidas = migrationsSemRegistroDeVersao();
  if (esquecidas.length > 0) {
    console.error(
      "Estas migrations não registram a própria versão em schema_versao (item TR-05.7):\n" +
        esquecidas.map((nome) => `  - ${nome}`).join("\n") +
        "\n\nAcrescente no final de cada uma:\n" +
        "  insert into schema_versao (versao) values (<número da migration>) on conflict do nothing;",
    );
    process.exit(1);
  }

  const conteudo = montarInstalacaoCompleta();
  writeFileSync(ARQUIVO_SAIDA, conteudo, "utf8");
  const linhas = conteudo.split("\n").length;
  console.log(
    `Gerado ${ARQUIVO_SAIDA} — ${listarMigrations().length} migrations, ${linhas} linhas.`,
  );
}
