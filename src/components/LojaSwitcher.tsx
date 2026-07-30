import { useAuth } from "@/contexts/AuthContext";

// Só aparece pra quem tem acesso a mais de uma loja — fica invisível por
// completo pra quem usa o sistema numa loja só, sem mudar nada pra ela.
export function LojaSwitcher() {
  const { lojaAtual, lojasDisponiveis, definirLojaAtual } = useAuth();

  if (lojasDisponiveis.length <= 1) return null;

  return (
    <label className="mt-3 flex items-center gap-1.5 text-xs">
      <span className="shrink-0 text-sakura-purple-dark/85">Loja</span>
      <select
        value={lojaAtual?.id ?? ""}
        onChange={(e) => definirLojaAtual(e.target.value)}
        className="min-w-0 flex-1 rounded-lg border border-sakura-gray/40 bg-transparent px-2 py-1 text-xs text-sakura-purple-dark outline-none focus:border-sakura-purple"
      >
        {lojasDisponiveis.map((loja) => (
          <option key={loja.id} value={loja.id}>
            {loja.nome}
          </option>
        ))}
      </select>
    </label>
  );
}
