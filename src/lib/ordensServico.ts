import { supabase } from "./supabase";
import { criarMovimentoCaixa } from "./caixa";
import { criarContaReceber } from "./contasReceber";
import { buscarDepositoPadraoId } from "./depositos";
import { arredondarCentavo, somar } from "@/schemas/dinheiro";
import { FORMA_PAGAMENTO_LABEL, nomeOrdem } from "@/types/os";
import type {
  ItemOS,
  NovaOrdemServico,
  NovoItemOS,
  OrdemServico,
  PatchItemOS,
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

// Só acrescenta itens novos numa OS já existente — corrigir um item já
// salvo é outro caminho, `editarItemOrdem()` logo abaixo.
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

// Quantidade sai do banco como numeric(12,2) — arredondar antes de comparar
// evita uma diferença de centésimo de milésimo virar uma movimentação de
// estoque fantasma (2.3 - 2.0 dá 0.2999999999999998 em ponto flutuante).
function arredondarQuantidade(valor: number): number {
  return arredondarCentavo(valor);
}

// Editar um item já lançado pode mexer no estoque: a saída que o item
// original gerou continua valendo, então o que precisa ser lançado é só a
// diferença. Um mapa peça → diferença cobre todos os casos de uma vez
// (mudou a quantidade, trocou a peça, virou serviço, ou o contrário) sem uma
// cascata de ifs — e some sozinho quando só o preço muda, que é o caso mais
// comum de correção.
export function diferencasDeEstoque(
  original: ItemOS,
  novo: PatchItemOS,
): Map<string, number> {
  const diferencas = new Map<string, number>();

  function somar(pecaId: string | null, quantidade: number) {
    if (!pecaId) return;
    diferencas.set(pecaId, (diferencas.get(pecaId) ?? 0) + quantidade);
  }

  if (original.tipo === "peca") somar(original.peca_id, -original.quantidade);
  if (novo.tipo === "peca") somar(novo.peca_id, novo.quantidade);

  return new Map(
    [...diferencas]
      .map(([pecaId, diferenca]) => [pecaId, arredondarQuantidade(diferenca)] as const)
      .filter(([, diferenca]) => diferenca !== 0),
  );
}

async function lancarDiferencasDeEstoque(
  diferencas: Map<string, number>,
  numeroOrdem: number,
  lojaId: string,
): Promise<void> {
  if (diferencas.size === 0) return;

  const depositoId = await buscarDepositoPadraoId(lojaId);
  const { error } = await supabase.from("estoque_movimentos").insert(
    [...diferencas].map(([pecaId, diferenca]) => ({
      peca_id: pecaId,
      deposito_id: depositoId,
      tipo: diferenca > 0 ? ("saida" as const) : ("entrada" as const),
      quantidade: Math.abs(diferenca),
      // Saiu mais peça pra essa OS: é uso em OS, igual ao lançamento
      // original. Voltou peça pra prateleira: é ajuste — não existe
      // "des-uso em OS", e "ajuste" é o que descreve a verdade do que
      // aconteceu (alguém corrigiu um lançamento).
      motivo: diferenca > 0 ? ("uso_em_os" as const) : ("ajuste" as const),
      referencia: `${nomeOrdem(numeroOrdem)} (correção de item)`,
      loja_id: lojaId,
    })),
  );
  if (error) throw error;
}

// Corrige um item já lançado numa OS (preço digitado errado, quantidade
// trocada, peça errada). Só faz sentido enquanto a OS ainda não foi
// faturada: depois do faturamento o pagamento já entrou no Caixa com o total
// antigo, e mexer no item deixaria os dois discordando — quem chama precisa
// garantir isso antes (a tela já esconde o botão).
export async function editarItemOrdem(
  itemOriginal: ItemOS,
  patch: PatchItemOS,
  numeroOrdem: number,
  operadorId: string,
  lojaId: string,
): Promise<void> {
  const diferencas = diferencasDeEstoque(itemOriginal, patch);

  const { error } = await supabase
    .from("ordens_servico_itens")
    .update(patch)
    .eq("id", itemOriginal.id);
  if (error) throw error;

  // O estoque vem depois de propósito: sem transação de verdade aqui, o
  // pior caso é a correção do item salvar e a movimentação falhar — que dá
  // erro na tela e é conferível em Movimentações. O contrário (movimentar
  // estoque de uma correção que não gravou) seria uma sobra invisível.
  await lancarDiferencasDeEstoque(diferencas, numeroOrdem, lojaId);

  await atualizarOrdem(itemOriginal.ordem_servico_id, {}, operadorId);
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
  // Fecha no centavo: cada pagamento já vem arredondado, mas somar em ponto
  // flutuante ainda deixa cauda (0.1 + 0.2 dá 0.30000000000000004) — e esse
  // valor vai pro banco, em Contas a Receber.
  const valorTotal = somar(pagamentos.map((p) => p.valor));
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
