// "O Electron deste projeto ainda é uma versão que recebe correção?"
// (item TR-04.6, ponto 7 do guia de melhorias.)
//
// Por que isto existe: o Electron carrega um Chromium inteiro dentro do
// `.exe` que roda na loja. Quando sai uma falha de segurança no Chromium, a
// correção chega pelo Electron — e só chega se alguém atualizar. Diferente
// do resto do sistema, aqui ninguém percebe que está velho: o app continua
// abrindo e funcionando igual, ano após ano.
//
// A checagem é de propósito ESTREITA: não reclama de estar uma versão
// atrás, nem de haver versão nova. Ela só reprova quando a linha em uso
// **saiu da lista das que ainda recebem correção** — o Electron mantém as
// três últimas linhas estáveis. Um aviso que aparece toda semana é um aviso
// que a pessoa aprende a ignorar, e este projeto já decidiu isso uma vez
// (o lembrete da alíquota, item TR-11.2).
//
// Roda sozinho uma vez por mês pelo GitHub Actions
// (.github/workflows/electron-desatualizado.yml) e pode ser rodado à mão:
//
//   node scripts/checar-versao-electron.mjs
//
// Ele NÃO atualiza nada. Subir de linha do Electron muda o Chromium que
// desenha as telas, e este projeto já viu isso mudar o comportamento de
// campo nativo (PROJETO_STATUS.md, seção 6, item 41) — então é mudança pra
// ser decidida e testada na loja, nunca automática.

import fs from "node:fs";

const LINHAS_COM_SUPORTE = 3;

const pacote = JSON.parse(fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const declarada = pacote.devDependencies?.electron ?? pacote.dependencies?.electron ?? "";
const emUso = Number(declarada.replace(/^[^\d]*/, "").split(".")[0]);

if (!Number.isFinite(emUso)) {
  console.error(`Não consegui ler a versão do Electron no package.json (veio "${declarada}").`);
  process.exit(1);
}

let distTags;
try {
  const resposta = await fetch("https://registry.npmjs.org/-/package/electron/dist-tags", {
    signal: AbortSignal.timeout(20_000),
  });
  if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
  distTags = await resposta.json();
} catch (erro) {
  // Sem internet não dá pra saber, e "não deu pra perguntar" não é a mesma
  // coisa que "está desatualizado" — a mesma separação que o aviso de banco
  // desatualizado faz (item TR-05.7).
  console.log(`Não deu pra consultar as versões do Electron agora (${erro.message}). Nada a concluir.`);
  process.exit(0);
}

const maisNova = Number(String(distTags.latest).split(".")[0]);
const maisAntigaComSuporte = maisNova - (LINHAS_COM_SUPORTE - 1);

console.log(`Electron neste projeto: ${declarada} (linha ${emUso})`);
console.log(`Mais nova publicada:    ${distTags.latest} (linha ${maisNova})`);
console.log(`Ainda recebem correção: linhas ${maisAntigaComSuporte} a ${maisNova}`);

if (emUso >= maisAntigaComSuporte) {
  console.log("\nEm dia: esta linha ainda recebe correção de segurança.");
  process.exit(0);
}

console.error(
  `\nA linha ${emUso} do Electron saiu do suporte — está ${maisNova - emUso} linha(s) atrás.\n` +
    "Isso quer dizer que o Chromium que desenha as telas do sistema não recebe\n" +
    "mais correção de falha de segurança.\n\n" +
    "O que fazer com isso (é decisão da usuária, não automática):\n" +
    "  1. Subir o Electron é mexer no Chromium, que já mudou comportamento de\n" +
    "     campo de formulário antes neste projeto (seção 6, item 41 do\n" +
    "     PROJETO_STATUS.md). Precisa de teste na loja, não só de build verde.\n" +
    "  2. O caminho é: subir uma linha por vez, rodar `npm run test:electron`,\n" +
    "     publicar numa versão sozinha (sem outras mudanças junto), pra que um\n" +
    "     problema que apareça tenha só uma causa possível.\n",
);
process.exit(1);
