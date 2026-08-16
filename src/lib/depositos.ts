import { supabase } from "./supabase";
import type { Deposito, NovoDeposito } from "@/types/deposito";

export async function listarDepositos(lojaId: string): Promise<Deposito[]> {
  const { data, error } = await supabase
    .from("depositos")
    .select("*")
    .eq("loja_id", lojaId)
    .order("nome", { ascending: true });

  if (error) throw error;
  return data as Deposito[];
}

export async function criarDeposito(novo: NovoDeposito): Promise<Deposito> {
  const { data, error } = await supabase.from("depositos").insert(novo).select().single();
  if (error) throw error;
  return data as Deposito;
}

export async function atualizarDeposito(id: string, patch: { nome: string }): Promise<void> {
  const { error } = await supabase.from("depositos").update(patch).eq("id", id);
  if (error) throw error;
}

export async function atualizarStatusDeposito(id: string, ativo: boolean): Promise<void> {
  const { error } = await supabase.from("depositos").update({ ativo }).eq("id", id);
  if (error) throw error;
}

// Usado por qualquer fluxo que gera uma movimentação de estoque sozinho, sem
// perguntar "em qual depósito" pro operador (ex: baixa automática ao usar
// peça numa OS, entrada ao receber Pedido de Compra, importação de nota por
// foto) — cai sempre no depósito mais antigo (o "Depósito Principal" criado
// junto com a loja), que também é o único depósito pra quem nunca criou um
// segundo. Ver src/lib/estoque.ts → criarMovimento().
export async function buscarDepositoPadraoId(lojaId: string): Promise<string> {
  const { data, error } = await supabase
    .from("depositos")
    .select("id")
    .eq("loja_id", lojaId)
    .eq("ativo", true)
    .order("criado_em", { ascending: true })
    .limit(1)
    .single();

  if (error) throw error;
  return data.id as string;
}
