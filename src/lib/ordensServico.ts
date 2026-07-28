import { supabase } from "./supabase";
import { criarMovimentoCaixa } from "./caixa";
import type { NovaOrdemServico, NovoItemOS, OrdemServico } from "@/types/os";
import { totalOrdem } from "@/types/os";

const SELECT_ORDEM =
  "*, cliente:clientes(nome), veiculo:veiculos(placa), itens:ordens_servico_itens(*)";

export async function listarOrdens(): Promise<OrdemServico[]> {
  const { data, error } = await supabase
    .from("ordens_servico")
    .select(SELECT_ORDEM)
    .order("data_abertura", { ascending: false });

  if (error) throw error;
  return data as unknown as OrdemServico[];
}

export async function criarOrdem(
  ordem: NovaOrdemServico,
  itens: NovoItemOS[],
): Promise<OrdemServico> {
  const { data: ordemCriada, error: erroOrdem } = await supabase
    .from("ordens_servico")
    .insert({ ...ordem, status: "aberta" })
    .select()
    .single();

  if (erroOrdem) throw erroOrdem;

  if (itens.length > 0) {
    const { error: erroItens } = await supabase.from("ordens_servico_itens").insert(
      itens.map((item) => ({ ...item, ordem_servico_id: ordemCriada.id })),
    );
    if (erroItens) throw erroItens;

    const itensPeca = itens.filter((item) => item.tipo === "peca" && item.peca_id);
    if (itensPeca.length > 0) {
      const { error: erroEstoque } = await supabase.from("estoque_movimentos").insert(
        itensPeca.map((item) => ({
          peca_id: item.peca_id,
          tipo: "saida" as const,
          quantidade: item.quantidade,
          motivo: "uso_em_os" as const,
          referencia: `OS ${ordemCriada.id.slice(0, 8)}`,
        })),
      );
      if (erroEstoque) throw erroEstoque;
    }
  }

  return ordemCriada as OrdemServico;
}

export async function faturarOrdem(
  ordem: OrdemServico,
  formaPagamento: string,
): Promise<void> {
  const { error: erroOrdem } = await supabase
    .from("ordens_servico")
    .update({
      status: "faturada",
      forma_pagamento: formaPagamento,
      data_fechamento: new Date().toISOString(),
    })
    .eq("id", ordem.id);

  if (erroOrdem) throw erroOrdem;

  const total = totalOrdem(ordem.itens ?? []);
  await criarMovimentoCaixa({
    ordem_servico_id: ordem.id,
    tipo: "entrada",
    forma_pagamento: formaPagamento,
    valor: total,
    descricao: `Faturamento da OS ${ordem.id.slice(0, 8)}`,
  });
}
