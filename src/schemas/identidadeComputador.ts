/**
 * A identidade DESTE computador (migration 0063).
 *
 * Cada computador cria, na primeira vez que abre o programa, um número
 * aleatório só dele e guarda num arquivo próprio, `computador.json`, na pasta
 * de dados do app. É esse número que diz ao banco "sou o mesmo computador de
 * ontem" — sem ele, cada login viraria um computador novo na lista, e a
 * pergunta "em que versão está o computador do balcão?" não teria resposta.
 *
 * Arquivo próprio pelo mesmo motivo do `atualizacao.json`: o `conexao.json` é
 * regravado inteiro sempre que alguém salva a conexão, e é ele que decide se
 * a loja consegue entrar — misturar os dois faria salvar a conexão trocar a
 * identidade do computador.
 *
 * Este arquivo NÃO importa nada: ele roda também no processo principal do
 * Electron (`electron/main.ts`), onde os atalhos `@/...` do Vite não existem.
 */

const FORMATO_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface IdentidadeComputador {
  id: string;
  criadoEm: string;
}

/**
 * Lê o conteúdo do `computador.json` (ou `null`, quando ele não existe).
 *
 * **Qualquer coisa estranha devolve `null`**, e quem chama cria uma
 * identidade nova. O preço disso é pequeno e visível: o computador aparece
 * duas vezes na lista, e o admin "esquece" a linha velha. O contrário —
 * aceitar um id torto — faria o registro no banco falhar a cada login, calado.
 */
export function lerIdentidadeComputador(conteudoDoArquivo: string | null): IdentidadeComputador | null {
  if (!conteudoDoArquivo) return null;
  try {
    const dados: unknown = JSON.parse(conteudoDoArquivo);
    if (typeof dados !== "object" || dados === null) return null;
    const { id, criadoEm } = dados as { id?: unknown; criadoEm?: unknown };
    if (typeof id !== "string" || !FORMATO_UUID.test(id)) return null;
    return { id: id.toLowerCase(), criadoEm: typeof criadoEm === "string" ? criadoEm : "" };
  } catch {
    return null;
  }
}

/** O que vai gravado no arquivo. Uma função só pra ler e escrever o mesmo formato. */
export function conteudoDaIdentidade(identidade: IdentidadeComputador): string {
  return `${JSON.stringify(identidade, null, 2)}\n`;
}
