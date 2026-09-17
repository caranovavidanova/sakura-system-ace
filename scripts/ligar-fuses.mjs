// Os "fuses" do Electron (item TR-04.6 do guia de melhorias).
//
// Rodado pelo electron-builder logo depois de empacotar o app, via
// `build.afterPack` no package.json.
//
// O que um fuse é, em uma frase: uma chavinha gravada dentro do próprio
// executável do Electron, que liga ou desliga um recurso de forma
// definitiva naquele binário — não dá pra mudar por configuração, por
// variável de ambiente nem por argumento de linha de comando.
//
// O que se ganha aqui: sem estas quatro chavinhas, quem tiver o
// `SakuraSystem-Setup.exe` instalado na máquina consegue rodar o executável
// do sistema como se fosse um Node.js comum (`ELECTRON_RUN_AS_NODE=1`), ou
// com o depurador acoplado, e a partir daí ler tudo que o processo
// principal enxerga — inclusive a conexão do banco daquela empresa. O app
// continua abrindo normalmente pra quem usa; o que deixa de existir é esse
// atalho.
//
// **Uma chavinha ficou de fora de propósito**:
// `EnableEmbeddedAsarIntegrityValidation`, que é a que confere se o
// `app.asar` foi adulterado. Ela só funciona quando o empacotador grava o
// hash do asar junto no executável, e o electron-builder 25 (o que este
// projeto usa) ainda não faz isso — ligá-la sozinha produziria um
// instalador que **não abre**, e o estrago só apareceria na loja, depois da
// atualização automática. Isso passa a ser possível ao subir o
// electron-builder pra 26, que é decisão dela (ver PROJETO_STATUS.md §9).

import { flipFuses, FuseVersion, FuseV1Options } from "@electron/fuses";
import path from "node:path";
import fs from "node:fs";

/** @type {(contexto: import("electron-builder").AfterPackContext) => Promise<void>} */
export default async function ligarFuses(contexto) {
  const plataforma = contexto.electronPlatformName;

  // O nome do executável não é o mesmo em toda plataforma, e errar aqui é o
  // jeito fácil de o build quebrar só no dia do lançamento: no Windows (que
  // é o alvo de verdade) e no macOS ele usa o nome de exibição do produto
  // ("Sakura System - AutoCenter Edition"); no Linux, o nome curto do
  // pacote ("sakura-system-autocenter"), que o empacotador entrega em
  // `executableName`.
  const nomeDeExibicao = contexto.packager.appInfo.productFilename;
  const caminho =
    plataforma === "darwin"
      ? path.join(contexto.appOutDir, `${nomeDeExibicao}.app`)
      : plataforma === "win32"
        ? path.join(contexto.appOutDir, `${nomeDeExibicao}.exe`)
        : path.join(contexto.appOutDir, contexto.packager.executableName ?? nomeDeExibicao);

  if (!fs.existsSync(caminho)) {
    // Falhar alto, e não seguir em silêncio: um build que "deu certo" sem
    // as chavinhas entregaria um instalador menos protegido sem ninguém
    // perceber — que é exatamente o tipo de defeito silencioso que este
    // projeto já pagou caro pra aprender a evitar.
    throw new Error(`Não achei o executável para ligar os fuses: ${caminho}`);
  }

  await flipFuses(caminho, {
    version: FuseVersion.V1,
    // Impede rodar o executável do app como um Node.js comum.
    [FuseV1Options.RunAsNode]: false,
    // Impede injetar argumentos de Node por variável de ambiente.
    [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
    // Impede acoplar o depurador (`--inspect`) ao processo principal.
    [FuseV1Options.EnableNodeCliInspectArguments]: false,
    // Só carrega o código de dentro do app.asar — sem isso, deixar uma
    // pasta `app/` ao lado do executável substitui o programa inteiro.
    [FuseV1Options.OnlyLoadAppFromAsar]: true,
    // `resetAdHocDarwinSignature` só vale pra macOS, que este projeto não
    // empacota; fica de fora pra não mexer no que não é usado.
  });

  console.log(`  • fuses do Electron gravados em ${path.basename(caminho)}`);
}
