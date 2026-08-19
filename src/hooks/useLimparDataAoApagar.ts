import { useEffect } from "react";

/**
 * O seletor de data nativo do Chromium divide o campo em "caixinhas"
 * (dia/mês/ano) e o foco pula sozinho de uma pra outra ao digitar — só que
 * Backspace não sabe voltar pra caixinha anterior pra apagar (o navegador
 * não expõe isso pra JS controlar; não tem como imitar de verdade um
 * "apagar cruzando as caixinhas" sem trocar o campo inteiro por um
 * componente próprio). Em vez disso, Backspace/Delete num campo de data
 * limpa o campo inteiro, deixando redigitar a data certa sem precisar do
 * mouse. Aplicado globalmente, mesmo padrão do useEnterParaProximoCampo.
 */
export function useLimparDataAoApagar() {
  useEffect(() => {
    function aoPressionarTecla(evento: KeyboardEvent) {
      if (evento.key !== "Backspace" && evento.key !== "Delete") return;

      const alvo = evento.target;
      if (!(alvo instanceof HTMLInputElement) || alvo.type !== "date") return;
      // Não checar `alvo.value` aqui: o navegador só preenche essa
      // propriedade quando as 3 caixinhas (dia/mês/ano) já estão completas
      // e válidas — no meio da digitação (o momento mais comum de querer
      // corrigir um dígito errado) ela fica vazia mesmo com algo digitado,
      // e um `if (!alvo.value) return` faria o Backspace não fazer nada
      // bem no caso que a gente mais quer resolver.
      if (alvo.disabled || alvo.readOnly) return;

      evento.preventDefault();

      // Setter nativo, não o `.value =` normal — assim o React (que o
      // react-hook-form usa por baixo) percebe a mudança e dispara o
      // onChange registrado, em vez de ficar com o valor "preso" no DOM sem
      // o formulário saber que ele mudou.
      const setterNativo = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
      )?.set;
      setterNativo?.call(alvo, "");
      alvo.dispatchEvent(new Event("input", { bubbles: true }));
    }

    document.addEventListener("keydown", aoPressionarTecla);
    return () => document.removeEventListener("keydown", aoPressionarTecla);
  }, []);
}
