import { criarMovimentoCaixa } from "./caixa";
import { supabase } from "./supabase";
import type { ContaPagar, NovaContaPagar } from "@/types/contaPagar";

const SELECT_CONTA = "*, categoria:categorias_caixa(nome)";

export async function listarContasPagar(): Promise<ContaPagar[]> {
  const { data, error } = await supabase
    .from("contas_pagar")
    .select(SELECT_CONTA)
    .order("vencimento", { ascending: true });

  if (error) throw error;
  return data as unknown as ContaPagar[];
}

export async function criarContaPagar(conta: NovaContaPagar): Promise<void> {
  const { error } = await supabase.from("contas_pagar").insert(conta);
  if (error) throw error;
}

export async function excluirContaPagar(id: string): Promise<void> {
  const { error } = await supabase.from("contas_pagar").delete().eq("id", id);
  if (error) throw error;
}

function proximoVencimento(vencimentoIso: string): string {
  const [ano, mes, dia] = vencimentoIso.split("-").map(Number);
  const proxima = new Date(ano, mes, dia);
  return `${proxima.getFullYear()}-${String(proxima.getMonth() + 1).padStart(2, "0")}-${String(
    proxima.getDate(),
  ).padStart(2, "0")}`;
}

interface PagarContaParams {
  conta: ContaPagar;
  valorPago: number;
  formaPagamento: string;
  operadorId: string;
}

// Marca a conta como paga, lança a Saída correspondente no Caixa (mesmo
// padrão do faturamento de OS gerando Entrada) e, se a conta for
// recorrente, já cria a próxima ocorrência (vencimento um mês depois).
export async function pagarConta({
  conta,
  valorPago,
  formaPagamento,
  operadorId,
}: PagarContaParams): Promise<void> {
  const movimento = await criarMovimentoCaixa({
    ordem_servico_id: null,
    tipo: "saida",
    forma_pagamento: formaPagamento || null,
    valor: valorPago,
    descricao: conta.descricao,
    categoria_id: conta.categoria_id,
  });

  const { error: erroConta } = await supabase
    .from("contas_pagar")
    .update({
      status: "paga",
      data_pagamento: new Date().toISOString(),
      caixa_movimento_id: movimento.id,
      operador_id: operadorId,
    })
    .eq("id", conta.id);
  if (erroConta) throw erroConta;

  if (conta.recorrente) {
    const { error: erroProxima } = await supabase.from("contas_pagar").insert({
      descricao: conta.descricao,
      valor: conta.valor,
      vencimento: proximoVencimento(conta.vencimento),
      categoria_id: conta.categoria_id,
      recorrente: true,
    });
    if (erroProxima) throw erroProxima;
  }
}
