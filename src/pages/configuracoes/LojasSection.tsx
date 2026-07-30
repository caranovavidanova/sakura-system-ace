import { useState } from "react";
import { atualizarStatusLoja, criarLoja } from "@/lib/lojas";
import { mensagemDeErro } from "@/lib/errors";
import type { Loja } from "@/types/loja";

interface LojasSectionProps {
  lojas: Loja[];
  operadorCriadorId: string;
  onSalvo: () => Promise<void>;
}

export function LojasSection({ lojas, operadorCriadorId, onSalvo }: LojasSectionProps) {
  const [nome, setNome] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleAdicionar(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return;
    setErro(null);
    setSalvando(true);
    try {
      await criarLoja(
        { nome: nome.trim(), cidade: cidade.trim() || null, uf: uf.trim() || null, ativo: true },
        operadorCriadorId,
      );
      setNome("");
      setCidade("");
      setUf("");
      await onSalvo();
    } catch (err) {
      console.error("Erro ao criar loja:", err);
      setErro(mensagemDeErro(err));
    } finally {
      setSalvando(false);
    }
  }

  async function handleAlternarStatus(loja: Loja) {
    try {
      await atualizarStatusLoja(loja.id, !loja.ativo);
      await onSalvo();
    } catch (err) {
      console.error("Erro ao atualizar status da loja:", err);
      setErro(mensagemDeErro(err));
    }
  }

  return (
    <>
      {erro && (
        <p className="mt-3 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{erro}</p>
      )}

      <form onSubmit={handleAdicionar} className="mt-4 grid grid-cols-4 gap-2">
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome da loja"
          className="col-span-2 rounded-lg border border-sakura-gray/40 px-3 py-2 text-sm outline-none focus:border-sakura-purple"
        />
        <input
          type="text"
          value={cidade}
          onChange={(e) => setCidade(e.target.value)}
          placeholder="Cidade"
          className="rounded-lg border border-sakura-gray/40 px-3 py-2 text-sm outline-none focus:border-sakura-purple"
        />
        <input
          type="text"
          value={uf}
          onChange={(e) => setUf(e.target.value.toUpperCase())}
          placeholder="UF"
          maxLength={2}
          className="rounded-lg border border-sakura-gray/40 px-3 py-2 text-sm outline-none focus:border-sakura-purple"
        />
        <button
          type="submit"
          disabled={salvando || !nome.trim()}
          className="col-span-4 rounded-xl bg-sakura-purple px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 sm:col-span-1 sm:justify-self-end"
        >
          {salvando ? "Salvando..." : "+ Nova loja"}
        </button>
      </form>

      {lojas.length === 0 ? (
        <p className="mt-4 text-sm text-sakura-muted">Nenhuma loja cadastrada ainda.</p>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          {lojas.map((loja) => (
            <span
              key={loja.id}
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
                loja.ativo
                  ? "bg-sakura-pink-soft text-sakura-purple-dark"
                  : "bg-sakura-gray/20 text-sakura-muted"
              }`}
            >
              {loja.nome}
              {(loja.cidade || loja.uf) && (
                <span className="text-sakura-purple-dark/70">
                  · {[loja.cidade, loja.uf].filter(Boolean).join("/")}
                </span>
              )}
              <button
                onClick={() => handleAlternarStatus(loja)}
                title={loja.ativo ? "Inativar loja" : "Reativar loja"}
                className="text-sakura-purple-dark/75 hover:text-red-600"
              >
                {loja.ativo ? "×" : "↺"}
              </button>
            </span>
          ))}
        </div>
      )}
    </>
  );
}
