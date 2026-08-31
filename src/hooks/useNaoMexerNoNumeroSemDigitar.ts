import { useEffect } from "react";

/**
 * Impede que um campo numérico mude de valor sem ninguém digitar nada.
 *
 * O Chromium (motor do Electron) trata as setas ↑/↓ do teclado como
 * "somar/subtrair um step" quando o cursor está dentro de um
 * `input[type=number]`. Como vários campos do app usam `step="0.01"`
 * (preço, quantidade, alíquota), um único toque na seta pra baixo num campo
 * com "2" digitado deixa "1.99" ali, em silêncio — e a seta pra baixo é o
 * gesto natural de quem quer descer a tela do formulário, já que dentro de
 * um campo ela não rola a página, só mexe no número.
 *
 * Foi assim que o estoque de um amortecedor ficou em "1.99 UN": o "2"
 * digitado na "Qtde. estoque inicial" (último campo do bloco de Preços)
 * virou 1.99 antes de salvar. Confirmado no Electron de verdade: seta pra
 * baixo em cima de "2" devolve exatamente "1.99" (a rodinha do mouse NÃO
 * faz isso — o Chromium parou de mexer no valor com a rodinha; a outra
 * porta era a setinha minúscula dentro do campo, fechada por CSS em
 * globals.css).
 *
 * Aqui só as setas são bloqueadas: digitar continua igual, e o valor só muda
 * quando alguém escreve o número. Aplicado uma única vez, globalmente, mesmo
 * padrão do useEnterParaProximoCampo e do useLimparDataAoApagar.
 */
export function useNaoMexerNoNumeroSemDigitar() {
  useEffect(() => {
    function aoPressionarTecla(evento: KeyboardEvent) {
      if (evento.key !== "ArrowUp" && evento.key !== "ArrowDown") return;

      const alvo = evento.target;
      if (!(alvo instanceof HTMLInputElement) || alvo.type !== "number") return;

      evento.preventDefault();
    }

    document.addEventListener("keydown", aoPressionarTecla);
    return () => document.removeEventListener("keydown", aoPressionarTecla);
  }, []);
}
