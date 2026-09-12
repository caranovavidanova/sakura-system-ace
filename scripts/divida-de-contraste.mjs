/**
 * Contraste que já estava abaixo da WCAG antes da varredura no DOM existir, e
 * que **depende de uma decisão da usuária** pra ser corrigido.
 *
 * Por que uma lista, e não uma correção direta: o item TR-01.3 do guia é
 * explícito — "traga o relatório para a usuária e corrija só o que ela
 * aprovar; não saia trocando cor da paleta sozinho". A cara do app é decisão
 * de quem é dona do produto, não efeito colateral de uma varredura. O que já
 * era erro claro (vermelho escuro sobre card escuro, letra branca sobre o
 * rosa neon) foi corrigido na hora e NÃO está aqui.
 *
 * A lista serve pra checagem poder ficar VERDE hoje e mesmo assim impedir que
 * apareça coisa NOVA — mesma disciplina do teste de arquitetura
 * (PROJETO_STATUS.md, seção 6, item 49): ela encolhe, nunca cresce. Quem
 * corrigir um item apaga a entrada, e o próprio script reprova se uma entrada
 * daqui parar de casar com alguma coisa.
 *
 * As entradas são por CAUSA, não por seletor: são 34 combinações reprovadas,
 * mas apenas três decisões — e uma lista de seletores quebraria inteira na
 * primeira classe que alguém mudasse.
 *
 * A entrada `borda-de-campo` (51 combinações, 1,15:1) saiu daqui em
 * 12/09/2026: a usuária aprovou clarear a borda, e ela virou o token
 * --color-sakura-borda-campo em globals.css.
 */
export const DIVIDA_DE_CONTRASTE = [
  {
    id: "botao-roxo-com-letra-branca",
    // 23 combinações, todas em 4,48:1 contra 4,5:1 — o botão principal do app
    // inteiro, a dois centésimos do mínimo. Corrigir exige mexer no roxo da
    // marca (que o item TR-01.3 proíbe) ou engrossar/aumentar a letra dos
    // botões. Decisão dela.
    quando: (g) => g.tipo === "texto" && g.frente === "#ffffff" && g.fundo === "#b624ff",
  },
  {
    id: "texto-roxo-como-link",
    // 9 combinações, 4,4:1 e 4,14:1 contra 4,5:1 — "Sair", "+ adicionar
    // item", "Ver as OS", as setas do calendário. Mesmo caso do anterior:
    // perto demais do limite pra trocar a cor da marca por conta própria.
    quando: (g) => g.tipo === "texto" && g.frente === "#b624ff",
  },
  {
    id: "calendario-dias-do-mes-vizinho",
    // 2,56:1. Estes são apagados DE PROPÓSITO: o calendário do Início mostra
    // a sobra do mês anterior e os primeiros dias do seguinte em cinza, pra
    // não competir com o mês corrente. Clarear resolve o número e estraga a
    // ideia. Fica aqui como decisão consciente, não como esquecimento.
    quando: (g) => g.tipo === "texto" && g.frente === "#5a5059",
  },
];

export function ehDividaConhecida(grupo) {
  return DIVIDA_DE_CONTRASTE.some((d) => d.quando(grupo));
}

/** Entradas que não casam com nada — já foram corrigidas e podem sair daqui. */
export function dividaResolvida(grupos) {
  return DIVIDA_DE_CONTRASTE.filter((d) => !grupos.some((g) => d.quando(g)));
}
