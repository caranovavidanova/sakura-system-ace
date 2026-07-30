import { supabase } from "./supabase";
import type { MovimentoCaixa, NovoMovimentoCaixa } from "@/types/caixa";

const SELECT_MOVIMENTO =
  "*, ordem_servico:ordens_servico(id, cliente:clientes(nome), itens:ordens_servico_itens(*)), " +
  "categoria:categorias_caixa(nome)";

export async function listarMovimentosCaixa(lojaId: string): Promise<MovimentoCaixa[]> {
  const { data, error } = await supabase
    .from("caixa_movimentos")
    .select(SELECT_MOVIMENTO)
    .eq("loja_id", lojaId)
    .order("data", { ascending: false });

  if (error) throw error;
  return data as unknown as MovimentoCaixa[];
}

export async function buscarMovimentoCaixaPorOrdem(
  ordemServicoId: string,
): Promise<MovimentoCaixa | null> {
  const { data, error } = await supabase
    .from("caixa_movimentos")
    .select("*")
    .eq("ordem_servico_id", ordemServicoId)
    .maybeSingle();

  if (error) throw error;
  return data as MovimentoCaixa | null;
}

export async function criarMovimentoCaixa(
  movimento: NovoMovimentoCaixa,
  lojaId: string,
): Promise<MovimentoCaixa> {
  const { data, error } = await supabase
    .from("caixa_movimentos")
    .insert({ ...movimento, loja_id: lojaId })
    .select()
    .single();

  if (error) throw error;
  return data as MovimentoCaixa;
}
