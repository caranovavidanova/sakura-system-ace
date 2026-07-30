import { supabase } from "./supabase";
import type { Loja, NovaLoja } from "@/types/loja";

export async function listarLojas(): Promise<Loja[]> {
  const { data, error } = await supabase
    .from("lojas")
    .select("*")
    .order("nome", { ascending: true });

  if (error) throw error;
  return data as Loja[];
}

export async function listarLojasDoOperador(operadorId: string): Promise<Loja[]> {
  const { data, error } = await supabase
    .from("operador_lojas")
    .select("loja:lojas(*)")
    .eq("operador_id", operadorId);

  if (error) throw error;
  return (data ?? [])
    .map((linha) => linha.loja as unknown as Loja)
    .filter((loja): loja is Loja => Boolean(loja))
    .sort((a, b) => a.nome.localeCompare(b.nome));
}

export async function criarLoja(
  nova: NovaLoja,
  operadorCriadorId: string,
): Promise<Loja> {
  const { data, error } = await supabase.from("lojas").insert(nova).select().single();
  if (error) throw error;

  const loja = data as Loja;

  // Sem isso, quem acabou de criar a loja ficaria sem acesso a ela (a RLS de
  // `lojas`/`operador_lojas` exige já ser admin de uma loja pra criar outra,
  // mas não dá acesso automático à loja nova).
  const { error: erroVinculo } = await supabase
    .from("operador_lojas")
    .insert({ operador_id: operadorCriadorId, loja_id: loja.id });
  if (erroVinculo) throw erroVinculo;

  return loja;
}

export async function atualizarStatusLoja(id: string, ativo: boolean): Promise<void> {
  const { error } = await supabase.from("lojas").update({ ativo }).eq("id", id);
  if (error) throw error;
}

export async function atualizarLoja(
  id: string,
  patch: { nome: string; cidade: string | null; uf: string | null },
): Promise<void> {
  const { error } = await supabase.from("lojas").update(patch).eq("id", id);
  if (error) throw error;
}

export async function definirLojasDoOperador(
  operadorId: string,
  lojaIds: string[],
): Promise<void> {
  const { error: erroExclusao } = await supabase
    .from("operador_lojas")
    .delete()
    .eq("operador_id", operadorId);
  if (erroExclusao) throw erroExclusao;

  if (lojaIds.length === 0) return;

  const { error: erroInsercao } = await supabase
    .from("operador_lojas")
    .insert(lojaIds.map((lojaId) => ({ operador_id: operadorId, loja_id: lojaId })));
  if (erroInsercao) throw erroInsercao;
}
