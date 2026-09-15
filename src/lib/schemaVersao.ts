import { supabase } from "./supabase";

// Pergunta ao banco em que versão ele está (item TR-05.7). A conta do que
// fazer com a resposta fica em `schemas/versaoEsquema.ts`; aqui é só ir lá
// buscar — e, principalmente, saber diferenciar as duas maneiras de não
// receber resposta.

/**
 * O banco é antigo demais pra ter a tabela `schema_versao`?
 *
 * Isso NÃO é falha: é a resposta "sou anterior à migration 0055". Precisa ser
 * separado de um erro de rede, porque os dois significam coisas opostas — um
 * pede aviso na tela, o outro pede silêncio. Confundir os dois deixaria o app
 * gritando "rode as migrations!" toda vez que a internet oscilasse.
 *
 * O PostgREST responde isso de dois jeitos conforme a versão: o código do
 * Postgres (`42P01`, tabela inexistente) ou o dele próprio (`PGRST205`, tabela
 * fora do cache de esquema). Os dois são tratados.
 */
export function ehTabelaInexistente(erro: unknown): boolean {
  if (!erro || typeof erro !== "object") return false;

  const { code, message } = erro as { code?: unknown; message?: unknown };
  if (code === "42P01" || code === "PGRST205") return true;

  return (
    typeof message === "string" &&
    message.includes("schema_versao") &&
    (message.includes("does not exist") || message.includes("Could not find the table"))
  );
}

/**
 * O maior número de migration registrado neste banco.
 *
 * - um número — o banco respondeu;
 * - `0` — o banco é anterior à `0055`, quando a tabela nasceu;
 * - `null` — não deu pra perguntar (sem rede, sessão caída). Nesse caso o app
 *   não mostra nada: um aviso baseado em não-resposta é palpite, e palpite na
 *   tela dela já custou caro uma vez (item 33 da seção 6).
 */
export async function buscarVersaoDoBanco(): Promise<number | null> {
  const { data, error } = await supabase
    .from("schema_versao")
    .select("versao")
    .order("versao", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return ehTabelaInexistente(error) ? 0 : null;

  return (data as { versao: number } | null)?.versao ?? 0;
}
