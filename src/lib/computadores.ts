import { supabase } from "./supabase";
import type { Computador } from "@/types/computador";

/**
 * Conta ao banco que ESTE computador está aberto, em que versão e em que loja
 * (migration 0063). Chamado uma vez a cada login.
 *
 * **Nunca atrapalha ninguém**: não lança erro, não mostra nada na tela. Se o
 * banco ainda não tiver a migration, se a rede cair ou se o programa estiver
 * rodando fora do Electron (preview, catálogo de telas), simplesmente não
 * registra — o pior caso é o computador não aparecer na lista do admin, que
 * é bem menos grave que travar o login de quem está no balcão.
 *
 * Fora do programa instalado (`npm run dev`) também não registra, de
 * propósito: o computador de quem desenvolve não é um computador da loja, e
 * apareceria na lista dela como se fosse.
 */
export async function registrarEsteComputador(lojaId: string | null): Promise<void> {
  if (import.meta.env.DEV) return;
  const ponte = typeof window !== "undefined" ? window.sakuraApp?.identidadeComputador : undefined;
  if (!ponte) return;
  try {
    const eu = await ponte();
    const { error } = await supabase.rpc("registrar_computador", {
      p_id: eu.id,
      p_nome_maquina: eu.nomeMaquina,
      p_versao: eu.versao,
      p_canal: eu.canal,
      p_sistema: eu.sistema,
      p_loja_id: lojaId,
    });
    if (error) throw error;
  } catch (err) {
    console.warn("Não deu pra registrar este computador no banco:", err);
  }
}

/** Todos os computadores que este admin enxerga — os das lojas que ele administra. */
export async function listarComputadores(): Promise<Computador[]> {
  const { data, error } = await supabase
    .from("computadores")
    .select("*, loja:lojas(nome), operador:operadores(nome)")
    .order("visto_em", { ascending: false });
  if (error) throw error;
  return data as Computador[];
}

/** Texto em branco tira o apelido. */
export async function definirApelidoComputador(id: string, apelido: string): Promise<void> {
  const { error } = await supabase.rpc("definir_apelido_computador", {
    p_id: id,
    p_apelido: apelido,
  });
  if (error) throw error;
}

/**
 * "Esquecer" um computador que não existe mais. Não impede nada: se ele for
 * aberto de novo, volta pra lista no login seguinte.
 */
export async function esquecerComputador(id: string): Promise<void> {
  const { data, error } = await supabase.from("computadores").delete().eq("id", id).select("id");
  if (error) throw error;
  // RLS sem permissão não dá erro, apaga zero linhas (§6 item 15). Sem esta
  // conferência, o botão pareceria funcionar e a linha voltaria na próxima
  // vez que a tela abrisse.
  if (!data || data.length === 0) {
    throw new Error("O computador não foi esquecido: só um administrador da loja dele pode fazer isso.");
  }
}
