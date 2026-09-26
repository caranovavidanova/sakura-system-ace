import { z } from "zod";
import { diasDesde } from "./painelInicio";

/**
 * As regras da lista "Computadores desta empresa" (migration 0063).
 *
 * A lista responde uma pergunta só: **em que versão está cada computador que
 * abre o sistema?** — e, por consequência, quem ficou pra trás. Cada
 * computador se registra sozinho a cada login; ninguém cadastra nada à mão.
 */

/**
 * Computador que não aparece há mais que isto deixa de contar como "em uso":
 * sai do resumo e não segura o botão de atualizar os bancos.
 *
 * **O mesmo número mora em `scripts/atualizar-bancos.mjs`** (a janela da
 * consulta ao banco). Um teste confere que os dois são iguais — se só um
 * mudasse, a tela diria "em uso" pra um computador que o botão já ignora.
 */
export const DIAS_PARA_CONSIDERAR_EM_USO = 30;

/**
 * Compara duas versões "números.números.números" como NÚMERO, não como
 * texto: como texto, "0.9.9" viria depois de "0.9.10". Devolve negativo se
 * `a` é mais antiga, zero se iguais, positivo se `a` é mais nova.
 *
 * Versão fora do formato vale como a mais antiga possível — o erro seguro é
 * um computador aparecer como atrasado, nunca o contrário.
 */
export function compararVersoes(a: string, b: string): number {
  const partes = (v: string) =>
    /^\d+\.\d+\.\d+$/.test(v.trim()) ? v.trim().split(".").map(Number) : [-1, -1, -1];
  const [pa, pb] = [partes(a), partes(b)];
  for (let i = 0; i < 3; i++) {
    if (pa[i] !== pb[i]) return pa[i] - pb[i];
  }
  return 0;
}

export interface ComputadorParaSituacao {
  visto_em: string;
  versao_app: string;
}

export interface SituacaoDoComputador {
  /** Dias de calendário desde a última vez que alguém entrou nele. */
  diasSemAparecer: number;
  emUso: boolean;
  /**
   * Numa versão mais antiga que a do computador de quem está olhando. É a
   * pergunta honesta que dá pra fazer daqui: "a versão mais nova que existe"
   * este programa não sabe (pode haver uma em teste que as lojas ainda não
   * receberam, e isso não é atraso).
   */
  maisAntigaQueEste: boolean;
}

export function situacaoDoComputador(
  computador: ComputadorParaSituacao,
  hoje: Date,
  versaoDesteComputador: string | null,
): SituacaoDoComputador {
  const diasSemAparecer = Math.max(0, diasDesde(computador.visto_em, hoje));
  return {
    diasSemAparecer,
    emUso: diasSemAparecer < DIAS_PARA_CONSIDERAR_EM_USO,
    maisAntigaQueEste:
      !!versaoDesteComputador && compararVersoes(computador.versao_app, versaoDesteComputador) < 0,
  };
}

export interface ComputadorParaNome {
  apelido: string | null;
  nome_maquina: string;
}

/** O apelido, quando o admin deu um; senão, o nome que o Windows dá à máquina. */
export function nomeDoComputador(computador: ComputadorParaNome): string {
  return computador.apelido?.trim() || computador.nome_maquina.trim() || "Computador sem nome";
}

/**
 * Separa a lista em "em uso" e "sumidos", cada parte com o mais recente
 * primeiro. Sumido não é apagado sozinho: quem decide esquecer é o admin
 * (um notebook guardado numa gaveta pode voltar).
 */
export function separarComputadores<T extends ComputadorParaSituacao>(
  lista: T[],
  hoje: Date,
): { emUso: T[]; sumidos: T[] } {
  const ordenada = [...lista].sort((a, b) => b.visto_em.localeCompare(a.visto_em));
  const emUso: T[] = [];
  const sumidos: T[] = [];
  for (const computador of ordenada) {
    (situacaoDoComputador(computador, hoje, null).emUso ? emUso : sumidos).push(computador);
  }
  return { emUso, sumidos };
}

/** Quantos dos computadores em uso estão numa versão mais antiga que a deste. */
export function contarMaisAntigos(
  lista: ComputadorParaSituacao[],
  hoje: Date,
  versaoDesteComputador: string | null,
): number {
  return lista.filter((c) => {
    const s = situacaoDoComputador(c, hoje, versaoDesteComputador);
    return s.emUso && s.maisAntigaQueEste;
  }).length;
}

export const apelidoComputadorSchema = z.object({
  apelido: z.string().trim().max(60, "O apelido pode ter até 60 letras."),
});

export type ApelidoComputadorValores = z.infer<typeof apelidoComputadorSchema>;
