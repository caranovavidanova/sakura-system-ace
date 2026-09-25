import { supabase } from "./supabase";
import type { ComissaoFechamento, NovoComissaoFechamento } from "@/types/comissaoFechamento";

function paraNumeros(p: ComissaoFechamento): ComissaoFechamento {
  // numeric pode chegar como texto; a tela compara e soma, então vira número
  // aqui, num lugar só.
  return {
    ...p,
    percentual: p.percentual === null ? null : Number(p.percentual),
    valor_calculado: Number(p.valor_calculado),
    valor_pago: Number(p.valor_pago),
    snapshot: (p.snapshot ?? []).map((i) => ({ ...i, comissao: Number(i.comissao) })),
  };
}

/** Os pagamentos de comissão registrados na loja, do mais recente pro mais antigo. */
export async function listarComissoesPagas(lojaId: string): Promise<ComissaoFechamento[]> {
  const { data, error } = await supabase
    .from("comissoes_fechamentos")
    .select("*")
    .eq("loja_id", lojaId)
    .order("periodo_fim", { ascending: false })
    .limit(500);

  if (error) throw error;
  return (data as ComissaoFechamento[]).map(paraNumeros);
}

export async function registrarComissaoPaga(novo: NovoComissaoFechamento): Promise<void> {
  const { error } = await supabase.from("comissoes_fechamentos").insert(novo);
  if (error) {
    // 23505 = o banco já tem um pagamento deste funcionário neste período
    // (a tela esconde o botão, mas dois computadores podem registrar juntos).
    if ((error as { code?: string }).code === "23505") {
      throw new Error("Já existe um pagamento registrado pra este funcionário neste mesmo período.");
    }
    throw error;
  }
}

/**
 * Desfaz um registro de pagamento. Só admin da loja — a RLS confere, e sem
 * linha apagada vira erro em vez de "não fez nada" (§6 item 15).
 */
export async function desfazerComissaoPaga(id: string): Promise<void> {
  const { data, error } = await supabase.from("comissoes_fechamentos").delete().eq("id", id).select("id");
  if (error) throw error;
  if (!data || data.length === 0) {
    throw new Error("Só um administrador desta loja pode desfazer um pagamento de comissão.");
  }
}
