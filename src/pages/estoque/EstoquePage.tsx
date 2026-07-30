import { useEffect, useState } from "react";
import { BotaoVoltar } from "@/components/BotaoVoltar";
import { useAuth } from "@/contexts/AuthContext";
import { listarCategorias } from "@/lib/categorias";
import { mensagemDeErro } from "@/lib/errors";
import { calcularSaldoPorPeca, listarMovimentos } from "@/lib/estoque";
import { listarPecas } from "@/lib/pecas";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { Categoria } from "@/types/categoria";
import type { MovimentoEstoque } from "@/types/estoque";
import type { Peca } from "@/types/peca";
import { ContagemSection } from "./ContagemSection";
import { MovimentacoesSection } from "./MovimentacoesSection";
import { ProdutosSection } from "./ProdutosSection";
import { RelatoriosEstoqueSection } from "./RelatoriosEstoqueSection";

type Aba = "produtos" | "movimentacoes" | "contagem" | "relatorios";

export function EstoquePage() {
  const { lojaAtual } = useAuth();
  const [aba, setAba] = useState<Aba>("produtos");
  const [pecas, setPecas] = useState<Peca[]>([]);
  const [movimentos, setMovimentos] = useState<MovimentoEstoque[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  async function carregar() {
    if (!isSupabaseConfigured || !lojaAtual) {
      setCarregando(false);
      return;
    }
    setCarregando(true);
    setErro(null);
    try {
      const [pecasCarregadas, movimentosCarregados, categoriasCarregadas] = await Promise.all([
        listarPecas(),
        listarMovimentos(lojaAtual.id),
        listarCategorias(),
      ]);
      setPecas(pecasCarregadas);
      setMovimentos(movimentosCarregados);
      setCategorias(categoriasCarregadas);
    } catch (err) {
      console.error("Erro ao carregar estoque:", err);
      setErro(mensagemDeErro(err));
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lojaAtual?.id]);

  const saldos = calcularSaldoPorPeca(movimentos);

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <BotaoVoltar />
        <div>
          <h1 className="text-2xl font-semibold text-sakura-purple-dark">
            Estoque
          </h1>
          <p className="text-sm text-sakura-muted">
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
        <AbaBotao
          label="Contagem"
          ativa={aba === "contagem"}
          onClick={() => setAba("contagem")}
        />
        <AbaBotao
          label="Relatórios"
          ativa={aba === "relatorios"}
          onClick={() => setAba("relatorios")}
        />
      </div>

      {carregando ? (
        <p className="text-sm text-sakura-muted">Carregando...</p>
      ) : !lojaAtual ? (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Seu usuário não tem loja atribuída. Fale com o administrador.
        </p>
      ) : aba === "produtos" ? (
        <ProdutosSection
          pecas={pecas}
          categorias={categorias}
          saldos={saldos}
          lojaId={lojaAtual.id}
          onRecarregar={carregar}
        />
      ) : aba === "movimentacoes" ? (
        <MovimentacoesSection
          pecas={pecas}
          movimentos={movimentos}
          lojaId={lojaAtual.id}
          onRecarregar={carregar}
        />
      ) : aba === "contagem" ? (
        <ContagemSection
          pecas={pecas}
          saldos={saldos}
          lojaId={lojaAtual.id}
          onRecarregar={carregar}
        />
      ) : (
        <RelatoriosEstoqueSection
          pecas={pecas}
          movimentos={movimentos}
          saldos={saldos}
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
          : "text-sakura-purple-dark/85 hover:text-sakura-purple-dark"
      }`}
    >
      {label}
    </button>
  );
}
