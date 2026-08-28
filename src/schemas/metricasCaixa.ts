import type { MovimentoCaixa } from "@/types/caixa";
import type { ItemOS } from "@/types/os";
import { totalOrdem } from "@/types/os";

/**
 * Contas de Caixa usadas em mais de uma tela (Início, Caixa Diário e
 * Relações). Ficam aqui, como funções puras testáveis, porque as três
 * calculavam "lucro" de um jeito diferente e davam números diferentes pro
 * mesmo dia — ver PROJETO_STATUS.md, seção 6.
 *
 * Duas armadilhas que este arquivo existe pra resolver de uma vez:
 *
 * 1. Uma OS faturada com pagamento dividido gera VÁRIOS lançamentos de
 *    Caixa (um por forma). Somar o custo — ou contar a OS — uma vez por
 *    lançamento infla o resultado.
 * 2. Custo não é só o `preco_custo` da peça: o serviço também tem `custo`
 *    (mão de obra). Ignorar isso faz o lucro parecer maior do que é.
 */

export type MapaCusto = Map<string, number>;

export function mapaCustoPecas(pecas: { id: string; preco_custo: number | null }[]): MapaCusto {
  return new Map(pecas.map((peca) => [peca.id, peca.preco_custo ?? 0]));
}

export function mapaCustoServicos(servicos: { id: string; custo: number | null }[]): MapaCusto {
  return new Map(servicos.map((servico) => [servico.id, servico.custo ?? 0]));
}

/** Quanto custou pra loja o que foi vendido nesses itens (peça + serviço). */
export function custoDosItens(
  itens: ItemOS[],
  custoPeca: MapaCusto,
  custoServico: MapaCusto,
): number {
  return itens.reduce((total, item) => {
    const unitario =
      item.tipo === "peca"
        ? custoPeca.get(item.peca_id ?? "") ?? 0
        : custoServico.get(item.servico_id ?? "") ?? 0;
    return total + item.quantidade * unitario;
  }, 0);
}

export interface ResumoCaixa {
  /** Tudo que entrou (vendas de OS + entradas manuais). */
  entradas: number;
  /** Saídas lançadas à mão (aluguel, sucata, fornecedor pago...). */
  saidas: number;
  /** Custo do que foi vendido, contado uma vez por OS. */
  custoDeAquisicao: number;
  /** entradas − saídas − custo do que foi vendido. */
  lucro: number;
  /** Quantas OS distintas geraram entrada no período. */
  ordensDistintas: number;
  /** Média por OS — por ORDEM, não por lançamento. */
  ticketMedio: number;
}

export function resumirMovimentos(
  movimentos: MovimentoCaixa[],
  custoPeca: MapaCusto,
  custoServico: MapaCusto,
): ResumoCaixa {
  let entradas = 0;
  let saidas = 0;
  let custoDeAquisicao = 0;
  let totalDeOrdens = 0;
  // Uma OS com pagamento dividido aparece em vários lançamentos: o custo
  // dela entra uma vez só, e ela conta como uma OS só no ticket médio.
  const ordensJaContadas = new Set<string>();

  for (const movimento of movimentos) {
    if (movimento.tipo === "saida") {
      saidas += movimento.valor;
      continue;
    }

    entradas += movimento.valor;

    const ordemId = movimento.ordem_servico_id;
    if (!ordemId) continue;

    totalDeOrdens += movimento.valor;
    if (ordensJaContadas.has(ordemId)) continue;
    ordensJaContadas.add(ordemId);
    custoDeAquisicao += custoDosItens(
      movimento.ordem_servico?.itens ?? [],
      custoPeca,
      custoServico,
    );
  }

  const ordensDistintas = ordensJaContadas.size;

  return {
    entradas,
    saidas,
    custoDeAquisicao,
    lucro: entradas - saidas - custoDeAquisicao,
    ordensDistintas,
    ticketMedio: ordensDistintas > 0 ? totalDeOrdens / ordensDistintas : 0,
  };
}

/**
 * Lucro de cada lançamento, pra mostrar linha a linha. O lucro pertence à
 * OS inteira (venda − custo), então numa OS paga em duas formas ele é
 * repartido entre os lançamentos na proporção do que foi pago em cada um —
 * repetir o valor cheio em cada linha faria a coluna não fechar com o total.
 */
export function lucroPorMovimento(
  movimentos: MovimentoCaixa[],
  custoPeca: MapaCusto,
  custoServico: MapaCusto,
): Map<string, number> {
  const pagoPorOrdem = new Map<string, number>();
  for (const movimento of movimentos) {
    if (movimento.tipo !== "entrada" || !movimento.ordem_servico_id) continue;
    const atual = pagoPorOrdem.get(movimento.ordem_servico_id) ?? 0;
    pagoPorOrdem.set(movimento.ordem_servico_id, atual + movimento.valor);
  }

  const lucros = new Map<string, number>();
  for (const movimento of movimentos) {
    const ordem = movimento.ordem_servico;
    if (movimento.tipo !== "entrada" || !movimento.ordem_servico_id || !ordem) continue;

    const lucroDaOrdem =
      totalOrdem(ordem.itens ?? []) - custoDosItens(ordem.itens ?? [], custoPeca, custoServico);
    const pagoNaOrdem = pagoPorOrdem.get(movimento.ordem_servico_id) ?? 0;
    const fatia = pagoNaOrdem > 0 ? movimento.valor / pagoNaOrdem : 1;
    lucros.set(movimento.id, Math.round(lucroDaOrdem * fatia * 100) / 100);
  }
  return lucros;
}
