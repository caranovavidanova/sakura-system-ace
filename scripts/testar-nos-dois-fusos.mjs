// Roda a suíte de testes DUAS vezes: uma no fuso do Brasil e outra em UTC.
//
// Por que isto existe: a máquina que roda os testes (aqui e no GitHub) usa
// UTC, e é justamente em UTC que o pior bug de data deste projeto NÃO
// aparece. Ele já se repetiu quatro vezes (PROJETO_STATUS.md, seção 6, itens
// 34 e 42) — OS faturada à noite sumindo da lista, nota fiscal arquivada no
// mês seguinte — sempre porque alguém pegou "que dia é" de um horário que
// estava em UTC. No Brasil (UTC-3), das 21h em diante o UTC já virou amanhã.
//
// Até agora, cada teste que se importava com isso precisava lembrar de fixar
// o fuso na mão (`process.env.TZ = ...`). Isto tira a lembrança do caminho:
// se um resultado depender do fuso, uma das duas rodadas reprova.
//
// Está em .mjs, e não como `TZ=x vitest && TZ=y vitest` no package.json, por
// um motivo prático: essa sintaxe de variável não funciona no PowerShell do
// Windows, que é onde a usuária roda os comandos.
import { spawnSync } from "node:child_process";

const FUSOS = ["America/Sao_Paulo", "UTC"];

let algumReprovou = false;

for (const fuso of FUSOS) {
  console.log(`\n===== rodando os testes no fuso ${fuso} =====\n`);

  const resultado = spawnSync("npx", ["vitest", "run"], {
    stdio: "inherit",
    env: { ...process.env, TZ: fuso },
    shell: process.platform === "win32",
  });

  if (resultado.status !== 0) {
    algumReprovou = true;
    console.error(`\n✖ Os testes reprovaram no fuso ${fuso}.`);
  }
}

if (algumReprovou) {
  console.error(
    "\nUm teste que passa num fuso e falha no outro quase sempre é uma conta\n" +
      "de data pegando o dia em UTC em vez do dia de quem usa o sistema.\n" +
      "O jeito certo é diaLocal()/hojeLocal(), de src/lib/datas.ts.\n",
  );
  process.exit(1);
}

console.log(`\n✓ A suíte passou nos dois fusos (${FUSOS.join(" e ")}).\n`);
