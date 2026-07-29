import { useEffect, useState } from "react";
import { BotaoVoltar } from "@/components/BotaoVoltar";
import { mensagemDeErro } from "@/lib/errors";
import { criarMovimentoCaixa, listarMovimentosCaixa } from "@/lib/caixa";
import { listarCategoriasCaixa } from "@/lib/categoriasCaixa";
import { listarPecas } from "@/lib/pecas";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { CategoriaCaixa } from "@/types/categoriaCaixa";
import type { MovimentoCaixa, NovoMovimentoCaixa } from "@/types/caixa";
import type { Peca } from "@/types/peca";
import { DiarioSection } from "./DiarioSection";
import { EntradaSaidaSection } from "./EntradaSaidaSection";

type Aba = "diario" | "entradas" | "saidas";

export function CaixaPage() {
  const [aba, setAba] = useState<Aba>("diario");
  const [movimentos, setMovimentos] = useState<MovimentoCaixa[]>([]);
  const [pecas, setPecas] = useState<Peca[]>([]);
  const [categorias, setCategorias] = useState<CategoriaCaixa[]>([]);
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
      const [movimentosCarregados, pecasCarregadas, categoriasCarregadas] = await Promise.all([
        listarMovimentosCaixa(),
        listarPecas(),
        listarCategoriasCaixa(),
      ]);
      setMovimentos(movimentosCarregados);
      setPecas(pecasCarregadas);
      setCategorias(categoriasCarregadas);
    } catch (err) {
      console.error("Erro ao carregar caixa:", err);
      setErro(mensagemDeErro(err));
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function handleSalvar(movimento: NovoMovimentoCaixa) {
    await criarMovimentoCaixa(movimento);
    await carregar();
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <BotaoVoltar />
        <div>
          <h1 className="text-2xl font-semibold text-sakura-purple-dark">
            Caixa Diário
          </h1>
          <p className="text-sm text-sakura-muted">
            Vendas e movimentação do dia, nascendo das ordens de serviço faturadas
          </p>
        </div>
      </header>

      {!isSupabaseConfigured && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          O Supabase ainda não está configurado. Defina{" "}
          <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code>{" "}
          no arquivo <code>.env</code> para começar a registrar o caixa de verdade.
        </p>
      )}

      {erro && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {erro}
        </p>
      )}

      <div className="flex gap-1 border-b border-sakura-gray/30">
        <AbaBotao label="Diário" ativa={aba === "diario"} onClick={() => setAba("diario")} />
        <AbaBotao label="Entradas" ativa={aba === "entradas"} onClick={() => setAba("entradas")} />
        <AbaBotao label="Saídas" ativa={aba === "saidas"} onClick={() => setAba("saidas")} />
      </div>

      {carregando ? (
        <p className="text-sm text-sakura-muted">Carregando...</p>
      ) : aba === "diario" ? (
        <DiarioSection
          movimentos={movimentos}
          pecas={pecas}
          categorias={categorias}
          onSalvar={handleSalvar}
        />
      ) : aba === "entradas" ? (
        <EntradaSaidaSection
          tipo="entrada"
          movimentos={movimentos}
          categorias={categorias}
          onSalvar={handleSalvar}
        />
      ) : (
        <EntradaSaidaSection
          tipo="saida"
          movimentos={movimentos}
          categorias={categorias}
          onSalvar={handleSalvar}
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
