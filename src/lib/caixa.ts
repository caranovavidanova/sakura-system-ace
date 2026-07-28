import { supabase } from "./supabase";
import type { MovimentoCaixa, NovoMovimentoCaixa } from "@/types/caixa";

const SELECT_MOVIMENTO =
  "*, ordem_servico:ordens_servico(id, cliente:clientes(nome), itens:ordens_servico_itens(*))";

export async function listarMovimentosCaixa(): Promise<MovimentoCaixa[]> {
  const { data, error } = await supabase
    .from("caixa_movimentos")
    .select(SELECT_MOVIMENTO)
    .order("data", { ascending: false });

  if (error) throw error;
  return data as unknown as MovimentoCaixa[];
}

export async function criarMovimentoCaixa(
  movimento: NovoMovimentoCaixa,
): Promise<MovimentoCaixa> {
  const { data, error } = await supabase
    .from("caixa_movimentos")
    .insert(movimento)
    .select()
    .single();

  if (error) throw error;
  return data as MovimentoCaixa;
}
