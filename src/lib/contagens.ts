import { criarMovimento } from "./estoque";
import { supabase } from "./supabase";
import type { ContagemEstoque } from "@/types/contagem";

export async function listarContagens(): Promise<ContagemEstoque[]> {
  const { data, error } = await supabase
    .from("contagens_estoque")
    .select("*")
    .order("criado_em", { ascending: false });

  if (error) throw error;
  return data as ContagemEstoque[];
}

export async function registrarContagem(
  pecaId: string,
  quantidadeContada: number,
  saldoSistema: number,
  observacao: string | null,
  operadorId: string | null,
): Promise<void> {
  const diferenca = quantidadeContada - saldoSistema;

  const { error } = await supabase.from("contagens_estoque").insert({
    peca_id: pecaId,
    quantidade_contada: quantidadeContada,
    saldo_sistema: saldoSistema,
    diferenca,
    observacao,
    operador_id: operadorId,
  });
  if (error) throw error;

  if (diferenca !== 0) {
    await criarMovimento({
      peca_id: pecaId,
      tipo: diferenca > 0 ? "entrada" : "saida",
      quantidade: Math.abs(diferenca),
      motivo: "ajuste",
      referencia: "Ajuste por contagem de estoque",
    });
  }
}
