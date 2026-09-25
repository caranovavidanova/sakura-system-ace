// Comissão já paga: o registro congelado e a comparação com o recálculo
// (item TL-46.1 do guia, migration 0059).
//
// O problema que isto resolve: a comissão é sempre recalculada a partir das
// OS, e desde a v0.9.28 dá pra corrigir o valor de um item de OS já lançado.
// Uma correção numa OS antiga mudava, retroativamente, uma comissão que já
// tinha sido paga — sem ninguém ficar sabendo. Agora o pagamento guarda um
// retrato das OS, e a tela compara. A regra é MOSTRAR a divergência, nunca
// esconder: ela é justamente o sinal de que alguém mexeu numa OS depois.
import { somar } from "./dinheiro";
import type { ComissaoFuncionario } from "./comissoes";
import type { ComissaoFechamento, ItemRetratoComissao } from "@/types/comissaoFechamento";

const chave = (i: Pick<ItemRetratoComissao, "ordemId" | "papel">) => `${i.ordemId}|${i.papel}`;

/** As OS que formam a comissão de uma linha, nos dois papéis. */
export function retratoDaLinha(linha: ComissaoFuncionario): ItemRetratoComissao[] {
  return [
    ...linha.comoVendedor.ordens.map((o) => ({
      ordemId: o.ordemId,
      numero: o.numero,
      papel: "vendedor" as const,
      comissao: o.comissao,
    })),
    ...linha.comoTecnico.ordens.map((o) => ({
      ordemId: o.ordemId,
      numero: o.numero,
      papel: "tecnico" as const,
      comissao: o.comissao,
    })),
  ];
}

/** O pagamento registrado pra EXATAMENTE este funcionário e este período. */
export function pagamentoDoPeriodo(
  pagamentos: readonly ComissaoFechamento[],
  funcionarioId: string,
  de: string,
  ate: string,
): ComissaoFechamento | null {
  return (
    pagamentos.find(
      (p) => p.funcionario_id === funcionarioId && p.periodo_inicio === de && p.periodo_fim === ate,
    ) ?? null
  );
}

export interface MudancaDeOs {
  numero: number;
  papel: "vendedor" | "tecnico";
  /** A comissão no retrato do pagamento. `null` = a OS não estava lá. */
  antes: number | null;
  /** A comissão recalculada hoje. `null` = a OS saiu do período. */
  agora: number | null;
}

export interface ComparacaoComPagamento {
  congelado: number;
  recalculado: number;
  /** recalculado − congelado */
  diferenca: number;
  divergiu: boolean;
  mudancas: MudancaDeOs[];
}

/**
 * Compara o recálculo de hoje com o retrato do pagamento.
 *
 * @param linha a linha recalculada agora (pode não existir mais — se todas as
 *   OS do período saíram, o recalculado é zero e cada OS aparece como "saiu")
 */
export function compararComPagamento(
  linha: ComissaoFuncionario | undefined,
  pagamento: ComissaoFechamento,
): ComparacaoComPagamento {
  const recalculado = linha ? linha.comissaoTotal : 0;
  const congelado = pagamento.valor_calculado;
  const agora = new Map((linha ? retratoDaLinha(linha) : []).map((i) => [chave(i), i]));
  const antes = new Map(pagamento.snapshot.map((i) => [chave(i), i]));

  const mudancas: MudancaDeOs[] = [];
  for (const [k, a] of antes) {
    const n = agora.get(k);
    if (!n || somar([n.comissao, -a.comissao]) !== 0) {
      mudancas.push({ numero: a.numero, papel: a.papel, antes: a.comissao, agora: n ? n.comissao : null });
    }
  }
  for (const [k, n] of agora) {
    if (!antes.has(k)) mudancas.push({ numero: n.numero, papel: n.papel, antes: null, agora: n.comissao });
  }
  mudancas.sort((x, y) => x.numero - y.numero || x.papel.localeCompare(y.papel));

  const diferenca = somar([recalculado, -congelado]);
  return { congelado, recalculado, diferenca, divergiu: diferenca !== 0 || mudancas.length > 0, mudancas };
}

export interface JaPagoEmOutroPeriodo {
  /** Quanto das OS deste período já foi pago (pelo retrato dos pagamentos antigos). */
  valor: number;
  /** Os números das OS, sem repetir. */
  numeros: number[];
  pagamentos: ComissaoFechamento[];
}

/**
 * OS deste período que já entraram num pagamento de OUTRO período (que cruza
 * com este). É o que evita pagar a mesma OS duas vezes quando alguém escolhe
 * "de 15/09 a 15/10" depois de já ter pago "setembro inteiro".
 *
 * Não bloqueia (regra 7 do guia) — avisa, com o número de cada OS.
 */
export function jaPagoEmOutrosPeriodos(
  linha: ComissaoFuncionario,
  pagamentos: readonly ComissaoFechamento[],
  de: string,
  ate: string,
): JaPagoEmOutroPeriodo {
  const minhas = new Set(retratoDaLinha(linha).map(chave));
  const valores: number[] = [];
  const numeros = new Set<number>();
  const envolvidos: ComissaoFechamento[] = [];

  for (const p of pagamentos) {
    if (p.funcionario_id !== linha.funcionarioId) continue;
    if (p.periodo_inicio === de && p.periodo_fim === ate) continue;
    let entrou = false;
    for (const item of p.snapshot) {
      if (minhas.has(chave(item))) {
        valores.push(item.comissao);
        numeros.add(item.numero);
        entrou = true;
      }
    }
    if (entrou) envolvidos.push(p);
  }

  return { valor: somar(valores), numeros: [...numeros].sort((a, b) => a - b), pagamentos: envolvidos };
}
