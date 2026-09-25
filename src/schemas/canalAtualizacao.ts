/**
 * Por qual canal ESTE computador recebe versão nova (item TR-09.1 do guia).
 *
 * Até aqui, publicar uma versão atualizava todas as lojas no mesmo minuto.
 * Com uma loja só, isso é ótimo; com lojas de outras empresas, uma versão
 * ruim vira vários telefonemas ao mesmo tempo. Agora são dois canais:
 *
 * - **teste** — recebe toda versão nova assim que ela é publicada. É o
 *   computador dela e o da Pneus Amigão: quem usa o sistema todo dia e
 *   consegue dizer "isso quebrou" antes de chegar em mais ninguém.
 * - **normal** — só recebe a versão depois que ela for **liberada** (o
 *   workflow "Liberar versão para todas as lojas"). É todo o resto, e é o
 *   padrão: um computador recém-instalado nasce aqui.
 *
 * **Como isso vira comportamento do atualizador.** Toda versão nasce no
 * GitHub marcada como *pré-lançamento*, e liberar é tirar essa marca. O
 * `electron-updater` 6 já sabe a diferença: com `allowPrerelease` desligado
 * ele pergunta ao GitHub "qual é a release mais recente?", e o GitHub nunca
 * responde com um pré-lançamento; ligado, ele pega a primeira release do
 * feed, marcada ou não. Isso foi conferido rodando o código da própria
 * biblioteca, não lido na documentação — ver `canalAtualizacao.test.ts`.
 *
 * O número da versão não muda entre os canais (nada de `0.9.40-beta`), e
 * liberar não refaz build nenhum: é a MESMA release, o mesmo instalador e o
 * mesmo `latest.yml`, só com a marca trocada.
 */

export type CanalAtualizacao = "teste" | "normal";

/** O que vale quando não há escolha nenhuma gravada neste computador. */
export const CANAL_PADRAO: CanalAtualizacao = "normal";

export const CANAIS_ATUALIZACAO: CanalAtualizacao[] = ["normal", "teste"];

export const CANAL_ATUALIZACAO_ROTULO: Record<CanalAtualizacao, string> = {
  normal: "Normal",
  teste: "Teste",
};

export const CANAL_ATUALIZACAO_DESCRICAO: Record<CanalAtualizacao, string> = {
  normal:
    "Só recebe uma versão nova depois que ela for liberada para todas as lojas. É o certo para quase todo computador.",
  teste:
    "Recebe toda versão nova assim que ela sai, antes das outras lojas. Serve para quem vai testar a versão no dia a dia e avisar se algo quebrou.",
};

export function ehCanalAtualizacao(valor: unknown): valor is CanalAtualizacao {
  return valor === "teste" || valor === "normal";
}

/**
 * Lê o conteúdo do arquivo `atualizacao.json` (ou `null`, quando ele não
 * existe).
 *
 * **Qualquer coisa estranha vira o canal normal**, nunca o de teste: arquivo
 * ausente, JSON quebrado, campo com erro de digitação. O erro seguro aqui é
 * um computador receber a versão um pouco mais tarde — o contrário faria uma
 * loja de terceiro testar uma versão sem ninguém ter decidido isso.
 */
export function lerCanal(conteudoDoArquivo: string | null): CanalAtualizacao {
  if (!conteudoDoArquivo) return CANAL_PADRAO;
  try {
    const dados: unknown = JSON.parse(conteudoDoArquivo);
    const canal =
      typeof dados === "object" && dados !== null ? (dados as { canal?: unknown }).canal : undefined;
    return ehCanalAtualizacao(canal) ? canal : CANAL_PADRAO;
  } catch {
    return CANAL_PADRAO;
  }
}

/** O que vai gravado no arquivo. Uma função só pra ler e escrever o mesmo formato. */
export function conteudoDoArquivo(canal: CanalAtualizacao): string {
  return `${JSON.stringify({ canal }, null, 2)}\n`;
}

/**
 * Como o canal vira configuração do `electron-updater`.
 *
 * **`channel` NÃO é usado, de propósito.** Parece o nome óbvio, mas no
 * `electron-updater` 6 atribuir `autoUpdater.channel` liga `allowDowngrade`
 * sozinho (está escrito no próprio código da biblioteca, `AppUpdater.js`) —
 * ou seja, trocar de canal passaria a poder INSTALAR UMA VERSÃO MAIS VELHA
 * por cima da atual. É exatamente o tipo de coisa que acontece longe de
 * quem entende, numa loja, sem ninguém ter pedido.
 *
 * Por isso a consequência de sair do canal de teste é esta, e é a certa: o
 * computador fica na versão que já tem até as lojas liberadas passarem dela.
 * Nunca volta pra trás sozinho.
 */
export function configuracaoDoAtualizador(canal: CanalAtualizacao): {
  allowPrerelease: boolean;
  allowDowngrade: false;
} {
  return { allowPrerelease: canal === "teste", allowDowngrade: false };
}
