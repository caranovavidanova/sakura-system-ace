import { supabase } from "./supabase";
import { criarMovimentoCaixa } from "./caixa";
import { criarContaReceber } from "./contasReceber";
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

export async function listarOrdens(lojaId: string): Promise<OrdemServico[]> {
  const { data, error } = await supabase
    .from("ordens_servico")
    .select(SELECT_ORDEM)
    .eq("loja_id", lojaId)
    .order("data_abertura", { ascending: false });

  if (error) throw error;
  return data as unknown as OrdemServico[];
}

async function inserirItens(
  ordemId: string,
  itens: NovoItemOS[],
  lojaId: string,
): Promise<void> {
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
        loja_id: lojaId,
      })),
    );
    if (erroEstoque) throw erroEstoque;
  }
}

export async function criarOrdem(
  ordem: NovaOrdemServico,
  itens: NovoItemOS[],
  operadorId: string,
  lojaId: string,
): Promise<OrdemServico> {
  const { data: ordemCriada, error: erroOrdem } = await supabase
    .from("ordens_servico")
    .insert({
      ...ordem,
      criado_por_id: operadorId,
      atualizado_por_id: operadorId,
      status: "aberta",
      loja_id: lojaId,
    })
    .select()
    .single();

  if (erroOrdem) throw erroOrdem;

  await inserirItens(ordemCriada.id, itens, lojaId);

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
  lojaId: string,
): Promise<void> {
  await inserirItens(ordemId, itens, lojaId);
  await atualizarOrdem(ordemId, {}, operadorId);
}

export async function faturarOrdem(
  ordem: OrdemServico,
  formaPagamento: string,
  parcelas: number,
  valorCobrado: number,
  previsaoRecebimento: string | null,
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

  // Sem previsão de recebimento = cliente já pagou na hora, lança a Entrada
  // no Caixa direto (comportamento de sempre). Com previsão = cliente ainda
  // vai pagar depois; em vez de lançar a Entrada agora, cria uma conta a
  // receber pendente — o Caixa só recebe o lançamento quando ela for
  // marcada como recebida de verdade (Contas a Receber).
  if (!previsaoRecebimento) {
    await criarMovimentoCaixa(
      {
        ordem_servico_id: ordem.id,
        tipo: "entrada",
        forma_pagamento: formaPagamento,
        valor: valorCobrado,
        descricao: `Faturamento da OS ${ordem.id.slice(0, 8)}`,
        categoria_id: null,
      },
      ordem.loja_id,
    );
  } else {
    await criarContaReceber(
      {
        cliente_id: ordem.cliente_id,
        ordem_servico_id: ordem.id,
        descricao: `Faturamento da OS ${ordem.id.slice(0, 8)}`,
        valor: valorCobrado,
        vencimento: previsaoRecebimento,
      },
      ordem.loja_id,
    );
  }
}
