import { supabase } from "./supabase";
import { criarMovimentoCaixa } from "./caixa";
import { criarContaReceber } from "./contasReceber";
import { buscarDepositoPadraoId } from "./depositos";
import { FORMA_PAGAMENTO_LABEL, nomeOrdem } from "@/types/os";
import type {
  NovaOrdemServico,
  NovoItemOS,
  OrdemServico,
  PatchOrdemServico,
} from "@/types/os";

export interface PagamentoOrdem {
  formaPagamento: string;
  valor: number;
}

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
  numeroOrdem: number,
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
    const depositoId = await buscarDepositoPadraoId(lojaId);
    const { error: erroEstoque } = await supabase.from("estoque_movimentos").insert(
      itensPeca.map((item) => ({
        peca_id: item.peca_id,
        deposito_id: depositoId,
        tipo: "saida" as const,
        quantidade: item.quantidade,
        motivo: "uso_em_os" as const,
        referencia: nomeOrdem(numeroOrdem),
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
      loja_id: lojaId,
    })
    .select()
    .single();

  if (erroOrdem) throw erroOrdem;

  await inserirItens(ordemCriada.id, ordemCriada.numero, itens, lojaId);

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
  numeroOrdem: number,
  itens: NovoItemOS[],
  operadorId: string,
  lojaId: string,
): Promise<void> {
  await inserirItens(ordemId, numeroOrdem, itens, lojaId);
  await atualizarOrdem(ordemId, {}, operadorId);
}

// Marca a OS como "concluída" — usado pelo botão "Encerrar OS", que já leva
// direto pra tela de faturamento em seguida.
export async function concluirOrdem(id: string, operadorId: string): Promise<void> {
  await atualizarOrdem(id, { status: "concluida" }, operadorId);
}

export async function faturarOrdem(
  ordem: OrdemServico,
  pagamentos: PagamentoOrdem[],
  parcelas: number,
  previsaoRecebimento: string | null,
): Promise<void> {
  const valorTotal = pagamentos.reduce((soma, p) => soma + p.valor, 0);
  // Resumo legível pra exibir em qualquer lugar (garantia, lista de OS) —
  // uma forma só continua mostrando só ela; duas ou mais aparecem juntas
  // (ex: "Pix + Cartão de crédito").
  const formaPagamentoResumo = [...new Set(pagamentos.map((p) => p.formaPagamento))]
    .map((forma) => FORMA_PAGAMENTO_LABEL[forma] ?? forma)
    .join(" + ");

  const { error: erroOrdem } = await supabase
    .from("ordens_servico")
    .update({
      status: "faturada",
      forma_pagamento: formaPagamentoResumo,
      parcelas,
      data_fechamento: new Date().toISOString(),
    })
    .eq("id", ordem.id);

  if (erroOrdem) throw erroOrdem;

  // Sem previsão de recebimento = cliente já pagou na hora, lança a Entrada
  // no Caixa direto (comportamento de sempre) — um lançamento por forma de
  // pagamento usada, pra cobrir o caso de pagamento dividido (ex: metade
  // Pix, metade cartão). Com previsão = cliente ainda vai pagar depois; em
  // vez de lançar a Entrada agora, cria uma conta a receber pendente — o
  // Caixa só recebe o lançamento quando ela for marcada como recebida de
  // verdade (Contas a Receber).
  if (!previsaoRecebimento) {
    for (const pagamento of pagamentos) {
      await criarMovimentoCaixa(
        {
          ordem_servico_id: ordem.id,
          tipo: "entrada",
          forma_pagamento: pagamento.formaPagamento,
          valor: pagamento.valor,
          descricao: `Faturamento da ${nomeOrdem(ordem.numero)}`,
          categoria_id: null,
        },
        ordem.loja_id,
      );
    }
  } else {
    await criarContaReceber(
      {
        cliente_id: ordem.cliente_id,
        ordem_servico_id: ordem.id,
        descricao: `Faturamento da ${nomeOrdem(ordem.numero)}`,
        valor: valorTotal,
        vencimento: previsaoRecebimento,
      },
      ordem.loja_id,
    );
  }
}
