import { useState } from "react";
import { criarCategoriaServico, excluirCategoriaServico } from "@/lib/categoriasServico";
import { mensagemDeErro } from "@/lib/errors";
import type { CategoriaServico } from "@/types/categoriaServico";

interface CategoriasServicoSectionProps {
  categorias: CategoriaServico[];
  onSalvo: () => Promise<void>;
}

export function CategoriasServicoSection({ categorias, onSalvo }: CategoriasServicoSectionProps) {
  const [nome, setNome] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleAdicionar(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return;
    setErro(null);
    setSalvando(true);
    try {
      await criarCategoriaServico({ nome: nome.trim() });
      setNome("");
      await onSalvo();
    } catch (err) {
      console.error("Erro ao criar categoria de serviço:", err);
      setErro(mensagemDeErro(err));
    } finally {
      setSalvando(false);
    }
  }

  async function handleExcluir(id: string) {
    if (!confirm("Excluir esta categoria? Serviços nela ficam sem categoria.")) return;
    setErro(null);
    try {
      await excluirCategoriaServico(id);
      await onSalvo();
    } catch (err) {
      console.error("Erro ao excluir categoria de serviço:", err);
      setErro(mensagemDeErro(err));
    }
  }

  return (
    <>
      {erro && (
        <p className="mt-3 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{erro}</p>
      )}

      <form onSubmit={handleAdicionar} className="mt-4 flex gap-2">
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome da categoria (ex: Pneus, Freios)"
          className="flex-1 rounded-lg border border-sakura-gray/40 px-3 py-2 text-sm outline-none focus:border-sakura-purple"
        />
        <button
          type="submit"
          disabled={salvando || !nome.trim()}
          className="rounded-xl bg-sakura-purple px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {salvando ? "Salvando..." : "+ Adicionar"}
        </button>
      </form>

      {categorias.length === 0 ? (
        <p className="mt-4 text-sm text-sakura-muted">Nenhuma categoria cadastrada ainda.</p>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          {categorias.map((categoria) => (
            <span
              key={categoria.id}
              className="flex items-center gap-2 rounded-full bg-sakura-pink-soft px-3 py-1.5 text-xs font-medium text-sakura-purple-dark"
            >
              {categoria.nome}
              <button
                onClick={() => handleExcluir(categoria.id)}
                title="Excluir categoria"
                className="text-sakura-purple-dark/75 hover:text-red-600"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </>
  );
}
