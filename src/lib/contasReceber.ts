import { criarMovimentoCaixa } from "./caixa";
import { supabase } from "./supabase";
import type { ContaReceber, NovaContaReceber } from "@/types/contaReceber";

const SELECT_CONTA = "*, cliente:clientes(nome)";

export async function listarContasReceber(lojaId: string): Promise<ContaReceber[]> {
  const { data, error } = await supabase
    .from("contas_receber")
    .select(SELECT_CONTA)
    .eq("loja_id", lojaId)
    .order("vencimento", { ascending: true });

  if (error) throw error;
  return data as unknown as ContaReceber[];
}

export async function criarContaReceber(
  conta: NovaContaReceber,
  lojaId: string,
): Promise<void> {
  const { error } = await supabase
    .from("contas_receber")
    .insert({ ...conta, loja_id: lojaId });
  if (error) throw error;
}

interface ReceberContaParams {
  conta: ContaReceber;
  valorRecebido: number;
  formaPagamento: string;
  operadorId: string;
}

// Marca a conta como recebida e lança a Entrada correspondente no Caixa
// nesse momento — mesmo padrão do "pagarConta" de Contas a Pagar, só que do
// lado do que a loja tem a receber.
export async function receberConta({
  conta,
  valorRecebido,
  formaPagamento,
  operadorId,
}: ReceberContaParams): Promise<void> {
  const movimento = await criarMovimentoCaixa(
    {
      ordem_servico_id: conta.ordem_servico_id,
      tipo: "entrada",
      forma_pagamento: formaPagamento || null,
      valor: valorRecebido,
      descricao: conta.descricao,
      categoria_id: null,
    },
    conta.loja_id,
  );

  const { error } = await supabase
    .from("contas_receber")
    .update({
      status: "recebido",
      data_recebimento: new Date().toISOString(),
      caixa_movimento_id: movimento.id,
      operador_id: operadorId,
    })
    .eq("id", conta.id);
  if (error) throw error;
}
