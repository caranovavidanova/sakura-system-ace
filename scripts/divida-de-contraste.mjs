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
 * As entradas são por CAUSA, não por seletor: são 85 combinações reprovadas,
 * mas apenas quatro decisões — e uma lista de 85 seletores quebraria inteira
 * na primeira classe que alguém mudasse.
 */
export const DIVIDA_DE_CONTRASTE = [
  {
    id: "borda-de-campo",
    // 51 combinações, 1,15:1 e 1,22:1 contra os 3:1 do critério 1.4.11.
    // É o achado mais importante do relatório e o mais fácil de sentir usando:
    // a borda que diz onde o campo começa e termina quase não existe.
    //
    // NÃO dá pra resolver mexendo na opacidade: `sakura-gray` (#3a3238) sobre
    // o card escuro dá 1,63:1 mesmo a 100%. Precisa de uma cor mais clara pra
    // borda de campo — o que muda a aparência de TODO formulário do app, e
    // por isso é decisão dela.
    quando: (g) => g.tipo === "campo (borda)",
  },
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
