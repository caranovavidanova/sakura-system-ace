import { supabase } from "./supabase";
import type { MovimentoCaixa, NovoMovimentoCaixa } from "@/types/caixa";

const SELECT_MOVIMENTO =
  "*, ordem_servico:ordens_servico(id, numero, cliente:clientes(nome), itens:ordens_servico_itens(*)), " +
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

// Uma OS pode ter mais de um lançamento de Caixa quando o faturamento foi
// dividido em mais de uma forma de pagamento (ex: metade Pix, metade
// cartão) — por isso retorna uma lista, não um único registro.
export async function listarMovimentosCaixaPorOrdem(
  ordemServicoId: string,
): Promise<MovimentoCaixa[]> {
  const { data, error } = await supabase
    .from("caixa_movimentos")
    .select("*")
    .eq("ordem_servico_id", ordemServicoId);

  if (error) throw error;
  return data as MovimentoCaixa[];
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

export async function excluirMovimentoCaixa(id: string): Promise<void> {
  const { error } = await supabase.from("caixa_movimentos").delete().eq("id", id);
  if (error) throw error;
}
