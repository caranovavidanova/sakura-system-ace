import { supabase } from "./supabase";
import { criarMovimentoCaixa } from "./caixa";
import type {
  NovaOrdemServico,
  NovoItemOS,
  OrdemServico,
  PatchOrdemServico,
} from "@/types/os";

const SELECT_ORDEM =
  "*, cliente:clientes(nome), veiculo:veiculos(placa, marca, modelo, cor, tipo), " +
  "vendedor:funcionarios!ordens_servico_vendedor_id_fkey(nome), " +
  "criado_por:operadores!ordens_servico_criado_por_id_fkey(nome), " +
  "atualizado_por:operadores!ordens_servico_atualizado_por_id_fkey(nome), " +
  "itens:ordens_servico_itens(*, tecnico:funcionarios(nome))";

export async function listarOrdens(): Promise<OrdemServico[]> {
  const { data, error } = await supabase
    .from("ordens_servico")
    .select(SELECT_ORDEM)
    .order("data_abertura", { ascending: false });

  if (error) throw error;
  return data as unknown as OrdemServico[];
}

async function inserirItens(ordemId: string, itens: NovoItemOS[]): Promise<void> {
  if (itens.length === 0) return;

  const { error: erroItens } = await supabase.from("ordens_servico_itens").insert(
    itens.map((item) => ({ ...item, ordem_servico_id: ordemId })),
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
        referencia: `OS ${ordemId.slice(0, 8)}`,
      })),
    );
    if (erroEstoque) throw erroEstoque;
  }
}

export async function criarOrdem(
  ordem: NovaOrdemServico,
  itens: NovoItemOS[],
  operadorId: string,
): Promise<OrdemServico> {
  const { data: ordemCriada, error: erroOrdem } = await supabase
    .from("ordens_servico")
    .insert({
      ...ordem,
      criado_por_id: operadorId,
      atualizado_por_id: operadorId,
      status: "aberta",
    })
    .select()
    .single();

  if (erroOrdem) throw erroOrdem;

  await inserirItens(ordemCriada.id, itens);

  return ordemCriada as OrdemServico;
}

export async function atualizarOrdem(
  id: string,
  patch: PatchOrdemServico,
  operadorId: string,
): Promise<void> {
  const { error } = await supabase
    .from("ordens_servico")
    .update({ ...patch, atualizado_por_id: operadorId })
    .eq("id", id);

  if (error) throw error;
}

// Só acrescenta itens novos numa OS já existente — editar/remover um item já
// salvo exigiria desfazer a baixa de estoque que ele já gerou, o que fica
// pra uma etapa própria (ver PROJETO_STATUS.md).
export async function adicionarItensOrdem(
  ordemId: string,
  itens: NovoItemOS[],
  operadorId: string,
): Promise<void> {
  await inserirItens(ordemId, itens);
  await atualizarOrdem(ordemId, {}, operadorId);
}

export async function faturarOrdem(
  ordem: OrdemServico,
  formaPagamento: string,
  parcelas: number,
  valorCobrado: number,
): Promise<void> {
  const { error: erroOrdem } = await supabase
    .from("ordens_servico")
    .update({
      status: "faturada",
      forma_pagamento: formaPagamento,
      parcelas,
      data_fechamento: new Date().toISOString(),
    })
    .eq("id", ordem.id);

  if (erroOrdem) throw erroOrdem;

  await criarMovimentoCaixa({
    ordem_servico_id: ordem.id,
    tipo: "entrada",
    forma_pagamento: formaPagamento,
    valor: valorCobrado,
    descricao: `Faturamento da OS ${ordem.id.slice(0, 8)}`,
    categoria_id: null,
  });
}
