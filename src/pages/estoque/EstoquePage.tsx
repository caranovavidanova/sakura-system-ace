import { useEffect, useState } from "react";
import { BotaoVoltar } from "@/components/BotaoVoltar";
import { mensagemDeErro } from "@/lib/errors";
import { calcularSaldoPorPeca, listarMovimentos } from "@/lib/estoque";
import { listarPecas } from "@/lib/pecas";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { MovimentoEstoque } from "@/types/estoque";
import type { Peca } from "@/types/peca";
import { MovimentacoesSection } from "./MovimentacoesSection";
import { ProdutosSection } from "./ProdutosSection";

type Aba = "produtos" | "movimentacoes";

export function EstoquePage() {
  const [aba, setAba] = useState<Aba>("produtos");
  const [pecas, setPecas] = useState<Peca[]>([]);
  const [movimentos, setMovimentos] = useState<MovimentoEstoque[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  async function carregar() {
    if (!isSupabaseConfigured) {
      setCarregando(false);
      return;
    }
    setCarregando(true);
    setErro(null);
    try {
      const [pecasCarregadas, movimentosCarregados] = await Promise.all([
        listarPecas(),
        listarMovimentos(),
      ]);
      setPecas(pecasCarregadas);
      setMovimentos(movimentosCarregados);
    } catch (err) {
      console.error("Erro ao carregar estoque:", err);
      setErro(mensagemDeErro(err));
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  const saldos = calcularSaldoPorPeca(movimentos);

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <BotaoVoltar />
        <div>
          <h1 className="text-2xl font-semibold text-sakura-purple-dark">
            Estoque
          </h1>
          <p className="text-sm text-sakura-gray">
            Produtos, peças e movimentações de estoque
          </p>
        </div>
      </header>

      {!isSupabaseConfigured && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          O Supabase ainda não está configurado. Defina{" "}
          <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code>{" "}
          no arquivo <code>.env</code> para começar a usar o estoque de verdade.
        </p>
      )}

      {erro && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {erro}
        </p>
      )}

      <div className="flex gap-1 border-b border-sakura-gray/30">
        <AbaBotao label="Produtos" ativa={aba === "produtos"} onClick={() => setAba("produtos")} />
        <AbaBotao
          label="Movimentações"
          ativa={aba === "movimentacoes"}
          onClick={() => setAba("movimentacoes")}
        />
      </div>

      {carregando ? (
        <p className="text-sm text-sakura-gray">Carregando...</p>
      ) : aba === "produtos" ? (
        <ProdutosSection pecas={pecas} saldos={saldos} onRecarregar={carregar} />
      ) : (
        <MovimentacoesSection
          pecas={pecas}
          movimentos={movimentos}
          onRecarregar={carregar}
        />
      )}
    </div>
  );
}

function AbaBotao({
  label,
  ativa,
  onClick,
}: {
  label: string;
  ativa: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 text-sm font-medium transition-colors ${
        ativa
          ? "border-b-2 border-sakura-purple text-sakura-purple-dark"
          : "text-sakura-purple-dark/60 hover:text-sakura-purple-dark"
      }`}
    >
      {label}
    </button>
  );
}
