import { diaLocal, diasEntre } from "@/lib/datas";
import { somar } from "./dinheiro";
import { diasAteVencer, garantiaVencida, vencimentoDaGarantia } from "./garantia";
import { totalOrdem } from "@/types/os";
import type { StatusOS, TipoItemOS, TipoOrdem } from "@/types/os";

/**
 * As contas da ficha do veículo (item FN-04 do guia de melhorias): tudo que
 * já foi feito num carro, quando, por quanto, com que KM, e o que ainda está
 * na garantia.
 *
 * Nenhuma tabela nova — tudo sai de `ordens_servico` e dos itens. Ficam aqui,
 * como função pura testada, pela regra de sempre (PROJETO_STATUS.md, seção 6,
 * item 40): conta repetida em tela diverge. E porque o lembrete de revisão
 * (FN-06) vai precisar exatamente da rodagem média calculada aqui.
 */

export interface ItemDaFicha {
  id: string;
  tipo: TipoItemOS;
  peca_id: string | null;
  descricao: string;
  quantidade: number;
  preco_unitario: number;
  desconto: number;
  peca?: { prazo_garantia_dias: number | null } | null;
}

export interface OrdemDaFicha {
  id: string;
  numero: number;
  tipo?: TipoOrdem;
  loja_id: string;
  cliente_id: string;
  status: StatusOS;
  km_entrada: number | null;
  data_abertura: string;
  data_fechamento: string | null;
  cliente?: { nome: string } | null;
  itens?: ItemDaFicha[];
}

/** A mais recente primeiro — é a ordem em que a pergunta do balcão é feita. */
export function linhaDoTempo(ordens: readonly OrdemDaFicha[]): OrdemDaFicha[] {
  return [...ordens].sort((a, b) => b.data_abertura.localeCompare(a.data_abertura));
}

/** Os dias diferentes em que o carro passou pela loja, do mais antigo ao mais novo. */
export function diasDeVisita(ordens: readonly OrdemDaFicha[]): string[] {
  return [...new Set(ordens.map((ordem) => diaLocal(ordem.data_abertura)))].sort();
}

function comKmEmOrdem(ordens: readonly OrdemDaFicha[]): OrdemDaFicha[] {
  return ordens
    .filter((ordem) => ordem.km_entrada != null)
    .sort((a, b) => a.data_abertura.localeCompare(b.data_abertura));
}

export interface KmConhecido {
  km: number;
  /** Dia da OS de onde o KM veio; `null` quando veio do cadastro do veículo. */
  dia: string | null;
}

/**
 * O KM mais recente que o sistema conhece do carro.
 *
 * Mesma regra de `ultimoKmConhecido` (abertura de OS): **a OS mais recente
 * ganha**, nunca o maior KM já digitado — senão um "999999" digitado errado
 * num dia corrido ficaria colado no carro pra sempre. O KM do cadastro só
 * entra quando nenhuma OS tem KM anotado.
 */
export function kmMaisRecente(
  ordens: readonly OrdemDaFicha[],
  kmDoCadastro: number | null,
): KmConhecido | null {
  const comKm = comKmEmOrdem(ordens);
  const ultima = comKm[comKm.length - 1];
  if (ultima) return { km: ultima.km_entrada as number, dia: diaLocal(ultima.data_abertura) };
  return kmDoCadastro == null ? null : { km: kmDoCadastro, dia: null };
}

/**
 * As OS cujo KM é menor que o da visita anterior com KM anotado.
 *
 * Quase sempre é dígito faltando (numa das duas visitas, não dá pra saber
 * qual) — e é justamente o dado que a rodagem média usa. A ficha aponta, não
 * corrige: odômetro trocado existe.
 */
export function ordensComKmMenorQueAnterior(ordens: readonly OrdemDaFicha[]): Set<string> {
  const suspeitas = new Set<string>();
  const comKm = comKmEmOrdem(ordens);
  for (let i = 1; i < comKm.length; i++) {
    if ((comKm[i].km_entrada as number) < (comKm[i - 1].km_entrada as number)) {
      suspeitas.add(comKm[i].id);
    }
  }
  return suspeitas;
}

/** Menos que isso entre a primeira e a última visita com KM, a média vira ruído. */
export const DIAS_MINIMOS_PARA_RODAGEM = 30;

export type Rodagem =
  | { tipo: "estimada"; kmPorMes: number }
  | { tipo: "indisponivel"; motivo: string };

/**
 * Quantos km por mês o carro roda, pela primeira e pela última visita com KM
 * anotado.
 *
 * É ESTIMATIVA e a tela diz isso — nunca aparece como fato. Por isso ela se
 * recusa, com o motivo escrito, nos casos em que o número enganaria:
 *   • menos de duas visitas com KM;
 *   • visitas próximas demais (menos de um mês);
 *   • algum KM menor que o da visita anterior (erro de digitação provável);
 *   • o mesmo KM em todas as visitas (quase sempre é o KM que não foi
 *     atualizado, não o carro parado).
 *
 * Arredonda pra dezena: "1.237 km por mês" daria uma precisão que a conta não
 * tem.
 */
export function rodagemEstimada(ordens: readonly OrdemDaFicha[]): Rodagem {
  const comKm = comKmEmOrdem(ordens);
  if (comKm.length < 2) {
    return {
      tipo: "indisponivel",
      motivo: "Precisa de pelo menos duas visitas com o KM anotado.",
    };
  }
  if (ordensComKmMenorQueAnterior(ordens).size > 0) {
    return {
      tipo: "indisponivel",
      motivo: "O KM de uma visita está menor que o da anterior — confira antes de tirar uma média.",
    };
  }

  const primeira = comKm[0];
  const ultima = comKm[comKm.length - 1];
  const dias = diasEntre(diaLocal(primeira.data_abertura), diaLocal(ultima.data_abertura));
  if (dias < DIAS_MINIMOS_PARA_RODAGEM) {
    return {
      tipo: "indisponivel",
      motivo: "As visitas com KM anotado estão a menos de um mês uma da outra.",
    };
  }

  const rodados = (ultima.km_entrada as number) - (primeira.km_entrada as number);
  if (rodados === 0) {
    return {
      tipo: "indisponivel",
      motivo: "O KM anotado é o mesmo em todas as visitas.",
    };
  }

  return { tipo: "estimada", kmPorMes: Math.round(((rodados / dias) * 30) / 10) * 10 };
}

/** Média de dias entre uma visita e a seguinte (dias diferentes), ou null com menos de duas. */
export function mediaDeDiasEntreVisitas(ordens: readonly OrdemDaFicha[]): number | null {
  const dias = diasDeVisita(ordens);
  if (dias.length < 2) return null;
  return Math.round(diasEntre(dias[0], dias[dias.length - 1]) / (dias.length - 1));
}

/**
 * Soma dos itens das OS **faturadas** — o que o cliente de fato pagou por
 * aquele carro, sem os juros do cartão (que é o mesmo "Total" da lista de
 * OS). OS em andamento ainda não é dinheiro gasto.
 */
export function totalGastoNoVeiculo(ordens: readonly OrdemDaFicha[]): number {
  return somar(
    ordens.filter((ordem) => ordem.status === "faturada").map((ordem) => totalOrdem(ordem.itens ?? [])),
  );
}

export interface PecaNaGarantia {
  itemId: string;
  descricao: string;
  quantidade: number;
  ordemId: string;
  numero: number;
  tipoOrdem?: TipoOrdem;
  vencimento: string;
  diasRestantes: number;
}

/**
 * As peças deste carro que ainda estão na garantia, da que vence primeiro à
 * que vence por último — mais quantas já venceram.
 *
 * Mesmo critério da tela de Garantias: peça com prazo cadastrado, numa OS já
 * fechada. A conta do vencimento é a mesma (`vencimentoDaGarantia`).
 */
export function pecasNaGarantia(
  ordens: readonly OrdemDaFicha[],
  hoje: string,
): { emVigor: PecaNaGarantia[]; vencidas: number } {
  const emVigor: PecaNaGarantia[] = [];
  let vencidas = 0;

  for (const ordem of ordens) {
    if (!ordem.data_fechamento) continue;
    for (const item of ordem.itens ?? []) {
      const prazo = item.peca?.prazo_garantia_dias;
      if (item.tipo !== "peca" || prazo == null) continue;

      const vencimento = vencimentoDaGarantia(ordem.data_fechamento, prazo);
      if (garantiaVencida(vencimento, hoje)) {
        vencidas++;
        continue;
      }
      emVigor.push({
        itemId: item.id,
        descricao: item.descricao,
        quantidade: item.quantidade,
        ordemId: ordem.id,
        numero: ordem.numero,
        tipoOrdem: ordem.tipo,
        vencimento,
        diasRestantes: diasAteVencer(vencimento, hoje),
      });
    }
  }

  emVigor.sort((a, b) => a.vencimento.localeCompare(b.vencimento));
  return { emVigor, vencidas };
}

/**
 * "hoje", "ontem", "há 12 dias", "há 8 meses", "há 2 anos".
 *
 * Diferente do `rotuloDeIdade` do Início, que só precisa de dias (OS aberta
 * há 6 dias). Aqui a pergunta é de outra escala — "quando foi a última troca
 * de óleo?" —, e "há 243 dias" obriga a fazer conta de cabeça.
 */
export function tempoDesde(dias: number): string {
  if (dias <= 0) return "hoje";
  if (dias === 1) return "ontem";
  if (dias < 60) return `há ${dias} dias`;
  if (dias < 730) {
    const meses = Math.round(dias / 30.44);
    return `há ${meses} meses`;
  }
  return `há ${Math.floor(dias / 365.25)} anos`;
}
