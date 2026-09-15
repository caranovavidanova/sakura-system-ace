import {
  mascararSegredos,
  montarRelatorio,
  nomeDoArquivo,
  type ChecagemDiagnostico,
  type Diagnostico,
} from "@/schemas/diagnostico";
import type { Loja } from "@/types/loja";
import type { Operador } from "@/types/operador";
import { situacaoDoEsquema } from "@/schemas/versaoEsquema";
import { conexaoAtual } from "./conexao";
import { salvarComoDownload } from "./download";
import { buscarVersaoDoBanco } from "./schemaVersao";
import { supabase } from "./supabase";
import { criarZip } from "./zip";

/**
 * Junta o diagnóstico da instalação (item TR-08.1 do guia).
 *
 * A parte testável — montar o texto e esconder segredo — está em
 * `src/schemas/diagnostico.ts`. Aqui fica o que só existe rodando de
 * verdade: o que o processo principal sabe, os dois registros em disco e as
 * três checagens ao vivo.
 *
 * **A chave do banco entra neste arquivo e não sai dele.** Ela é lida uma vez
 * só, pra ser entregue à máscara como "segredo conhecido" — porque é ela que
 * aparece dentro da URL em toda requisição que falha, e portanto dentro do
 * erros.log. Nenhum campo do diagnóstico carrega a chave.
 */

const LINHAS_DE_LOG = 200;

// As checagens têm limite de tempo próprio: sem isso, uma loja com internet
// caída ficaria com a tela "Checando..." pendurada, que é o pior resultado
// possível pra uma tela cujo trabalho é justamente dizer o que está errado.
const LIMITE_DA_CHECAGEM_MS = 8000;

async function medir(
  nome: string,
  tarefa: () => Promise<string>,
): Promise<ChecagemDiagnostico> {
  const comecou = performance.now();
  try {
    const detalhe = await tarefa();
    return { nome, ok: true, detalhe, ms: Math.round(performance.now() - comecou) };
  } catch (erro) {
    return {
      nome,
      ok: false,
      detalhe: erro instanceof Error ? erro.message : String(erro),
      ms: Math.round(performance.now() - comecou),
    };
  }
}

/**
 * As três checagens, nesta ordem de propósito: elas vão de fora pra dentro, e
 * a primeira que falha já explica as seguintes. Sem internet, não adianta
 * olhar o Supabase; sem o Supabase respondendo, não adianta olhar a leitura.
 */
async function checar(enderecoDoBanco: string): Promise<ChecagemDiagnostico[]> {
  const internet = await medir("Internet", async () => {
    // O GitHub é a internet que este app realmente precisa: é de lá que vem
    // a atualização automática. `no-cors` porque o que interessa aqui é
    // "alcança?", não o conteúdo — e assim a checagem não depende de o
    // servidor liberar CORS pra uma tela carregada de `file://`.
    await fetch("https://api.github.com/", {
      mode: "no-cors",
      signal: AbortSignal.timeout(LIMITE_DA_CHECAGEM_MS),
    });
    return "o computador alcança a internet";
  });

  const alcancaBanco = await medir("Supabase responde", async () => {
    if (!enderecoDoBanco) throw new Error("nenhuma conexão configurada neste computador");
    await fetch(`${enderecoDoBanco}/auth/v1/health`, {
      mode: "no-cors",
      signal: AbortSignal.timeout(LIMITE_DA_CHECAGEM_MS),
    });
    return "o endereço do banco respondeu";
  });

  const leLojas = await medir("Ler uma linha de lojas", async () => {
    const { error } = await supabase.from("lojas").select("id").limit(1);
    if (error) throw new Error(error.message);
    return "o banco respondeu a consulta";
  });

  return [internet, alcancaBanco, leLojas];
}

export async function coletarDiagnostico(
  operador: Operador | null,
  loja: Loja | null,
): Promise<Diagnostico> {
  const conexao = conexaoAtual();
  const enderecoDoBanco = conexao?.url ?? "";
  // Lida aqui e usada só como "segredo conhecido" da máscara, nunca copiada
  // pra dentro do diagnóstico.
  const segredosConhecidos = conexao?.chave ? [conexao.chave] : [];

  const doProcessoPrincipal = await window.sakuraApp?.diagnostico?.().catch(() => undefined);
  const logs = await window.sakuraApp?.lerLogs?.(LINHAS_DE_LOG).catch(() => undefined);

  const checagens = await checar(enderecoDoBanco);
  // Sem sessão isto responde `null` (a RLS exige login) e o relatório diz
  // "não foi possível perguntar" — que é a verdade, e melhor que um número
  // inventado num arquivo feito pra diagnosticar.
  const versaoDoBanco = await buscarVersaoDoBanco().catch(() => null);

  return {
    geradoEm: new Date(),
    fusoDoComputador: Intl.DateTimeFormat().resolvedOptions().timeZone,
    app: {
      // Fora do Electron (o app também abre em navegador nas ferramentas de
      // tela) nada disso existe — a tela continua útil com o que sobrar.
      versao: doProcessoPrincipal?.versaoApp ?? window.sakuraApp?.version ?? "desconhecida",
      electron: doProcessoPrincipal?.electron ?? "—",
      chromium: doProcessoPrincipal?.chromium ?? "—",
      node: doProcessoPrincipal?.node ?? "—",
      sistema: doProcessoPrincipal?.sistema ?? "—",
      arquitetura: doProcessoPrincipal?.arquitetura ?? "—",
      pastaDados: doProcessoPrincipal?.pastaDados ?? "—",
    },
    enderecoDoBanco: enderecoDoBanco || "(não configurado)",
    esquema: situacaoDoEsquema(versaoDoBanco),
    sessao: {
      usuario: operador?.usuario ?? "(ninguém logado)",
      nome: operador?.nome ?? "—",
      admin: operador?.admin ?? false,
      loja: loja?.nome ?? "(nenhuma loja ativa)",
    },
    checagens,
    logs: {
      erros: mascararSegredos(logs?.erros ?? "", segredosConhecidos),
      atualizacoes: mascararSegredos(logs?.atualizacoes ?? "", segredosConhecidos),
    },
  };
}

/**
 * Monta o .zip e entrega pra pessoa salvar. Um `.zip` e não um `.txt` porque
 * é o que o WhatsApp aceita anexar sem transformar em outra coisa — e porque
 * o formato já existe aqui (`lib/zip.ts`), sem dependência nova.
 */
export function baixarDiagnostico(d: Diagnostico): void {
  const texto = new TextEncoder();
  salvarComoDownload(
    criarZip([
      { nome: "diagnostico.txt", conteudo: texto.encode(montarRelatorio(d)) },
      { nome: "erros.log", conteudo: texto.encode(d.logs.erros) },
      { nome: "atualizacoes.log", conteudo: texto.encode(d.logs.atualizacoes) },
    ]),
    nomeDoArquivo(d),
  );
}
