import { criarMovimentoCaixa, excluirMovimentoCaixa } from "./caixa";
import { supabase } from "./supabase";
import type { ContaPagar, NovaContaPagar } from "@/types/contaPagar";

const SELECT_CONTA = "*, categoria:categorias_caixa(nome)";

export async function listarContasPagar(lojaId: string): Promise<ContaPagar[]> {
  const { data, error } = await supabase
    .from("contas_pagar")
    .select(SELECT_CONTA)
    .eq("loja_id", lojaId)
    .order("vencimento", { ascending: true });

  if (error) throw error;
  return data as unknown as ContaPagar[];
}

export async function criarContaPagar(
  conta: NovaContaPagar,
  lojaId: string,
): Promise<void> {
  const { error } = await supabase
    .from("contas_pagar")
    .insert({ ...conta, loja_id: lojaId });
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
// recorrente, já cria a próxima ocorrência (vencimento um mês depois) — a
// menos que o próximo vencimento já passe de `recorrente_ate` (opcional).
export async function pagarConta({
  conta,
  valorPago,
  formaPagamento,
  operadorId,
}: PagarContaParams): Promise<void> {
  const movimento = await criarMovimentoCaixa(
    {
      ordem_servico_id: null,
      tipo: "saida",
      forma_pagamento: formaPagamento || null,
      valor: valorPago,
      descricao: conta.descricao,
      categoria_id: conta.categoria_id,
    },
    conta.loja_id,
  );

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

  const proxima = conta.recorrente ? proximoVencimento(conta.vencimento) : null;
  const passouDoFim = conta.recorrente_ate !== null && proxima !== null && proxima > conta.recorrente_ate;

  if (proxima && !passouDoFim) {
    const { error: erroProxima } = await supabase.from("contas_pagar").insert({
      descricao: conta.descricao,
      valor: conta.valor,
      vencimento: proxima,
      categoria_id: conta.categoria_id,
      recorrente: true,
      recorrente_ate: conta.recorrente_ate,
      loja_id: conta.loja_id,
    });
    if (erroProxima) throw erroProxima;
  }
}

// Reverte um pagamento feito por engano: volta a conta pra pendente e
// remove a Saída que tinha sido lançada automaticamente no Caixa.
export async function desfazerPagamento(conta: ContaPagar): Promise<void> {
  const { error } = await supabase
    .from("contas_pagar")
    .update({
      status: "pendente",
      data_pagamento: null,
      caixa_movimento_id: null,
      operador_id: null,
    })
    .eq("id", conta.id);
  if (error) throw error;

  if (conta.caixa_movimento_id) {
    await excluirMovimentoCaixa(conta.caixa_movimento_id);
  }
}
