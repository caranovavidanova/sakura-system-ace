export const inputClasse =
  "rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple";

export function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold text-sakura-purple-dark">{titulo}</legend>
      {children}
    </fieldset>
  );
}

export function Campo({
  label,
  obrigatorio,
  erro,
  className,
  children,
}: {
  label: string;
  obrigatorio?: boolean;
  erro?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`flex flex-col gap-1 text-sm ${className ?? ""}`}>
      <span className="text-sakura-purple-dark/80">
        {label} {obrigatorio && <span className="text-red-500">*</span>}
      </span>
      {children}
      {erro && <span className="text-xs text-red-600">{erro}</span>}
    </label>
  );
}
