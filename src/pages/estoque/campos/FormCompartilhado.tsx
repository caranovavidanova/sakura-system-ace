import { cloneElement, isValidElement, useId } from "react";
import { Explicacao } from "@/components/Explicacao";

export const inputClasse =
  "rounded-lg border border-sakura-gray/40 px-3 py-2 focus:border-sakura-purple";

export function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-3 text-corpo font-semibold text-sakura-purple-dark">{titulo}</h3>
      {children}
    </section>
  );
}

export function Campo({
  label,
  obrigatorio,
  erro,
  explicacao,
  className,
  children,
}: {
  label: string;
  obrigatorio?: boolean;
  erro?: string;
  /**
   * Uma frase dizendo o que é o campo e de onde tirar o valor. Usada nos
   * campos fiscais (item TL-12 do guia): eles são a maior fonte de erro
   * deste sistema — foi um CST no lugar de um CSOSN que derrubou a emissão
   * de nota em 09/09/2026, e o campo parecia preenchido e certo
   * (PROJETO_STATUS.md, seção 6, item 47).
   */
  explicacao?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const id = useId();

  // Antes o <label> envolvia o campo inteiro, e a ligação entre rótulo e
  // campo era implícita (clicar no rótulo foca o campo). Isso não sobrevive
  // à chegada do "?": `<Explicacao>` é um <button>, e botão dentro de
  // <label> é conteúdo interativo onde o HTML não permite — além de o texto
  // do botão entrar no nome que o leitor de tela anuncia ("NCM ?").
  //
  // Então a ligação passou a ser explícita, por `htmlFor`: o id nasce aqui e
  // é colocado no campo. Vale pros controles deste formulário (input, select,
  // textarea e o Combobox, que já aceita `id`).
  const campo = isValidElement<{ id?: string }>(children)
    ? cloneElement(children, { id: children.props.id ?? id })
    : children;

  return (
    <div className={`flex flex-col gap-1 text-corpo ${className ?? ""}`}>
      <div className="flex items-center gap-1.5">
        <label htmlFor={id} className="text-sakura-purple-dark/80">
          {label}
          {obrigatorio && <span className="text-red-400"> *</span>}
        </label>
        {explicacao && <Explicacao titulo={label} texto={explicacao} />}
      </div>
      {campo}
      {erro && <span className="text-rotulo text-red-300">{erro}</span>}
    </div>
  );
}
