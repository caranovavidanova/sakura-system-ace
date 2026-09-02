import { useEffect, useState } from "react";
import { BotaoVoltar } from "@/components/BotaoVoltar";
import { useAuth } from "@/contexts/AuthContext";
import { listarMovimentosCaixa } from "@/lib/caixa";
import { listarContasReceber } from "@/lib/contasReceber";
import { listarFuncionarios } from "@/lib/funcionarios";
import { mensagemDeErro } from "@/lib/errors";
import { listarOrdens } from "@/lib/ordensServico";
import { listarPecas } from "@/lib/pecas";
import { listarServicos } from "@/lib/servicos";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { MovimentoCaixa } from "@/types/caixa";
import type { ContaReceber } from "@/types/contaReceber";
import type { Funcionario } from "@/types/funcionario";
import type { OrdemServico } from "@/types/os";
import type { Peca } from "@/types/peca";
import type { Servico } from "@/types/servico";
import { ComissoesSection } from "./ComissoesSection";
import { GraficosSection } from "./GraficosSection";
import { LucratividadeSection } from "./LucratividadeSection";

type Aba = "graficos" | "lucratividade" | "comissoes";

export function RelatoriosPage() {
  const { lojaAtual } = useAuth();
  const [aba, setAba] = useState<Aba>("graficos");
  const [movimentos, setMovimentos] = useState<MovimentoCaixa[]>([]);
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [pecas, setPecas] = useState<Peca[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [contasReceber, setContasReceber] = useState<ContaReceber[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregar() {
      if (!isSupabaseConfigured || !lojaAtual) {
        setCarregando(false);
        return;
      }
      try {
        const [
          movimentosCarregados,
          ordensCarregadas,
          pecasCarregadas,
          servicosCarregados,
          funcionariosCarregados,
          contasCarregadas,
        ] = await Promise.all([
          listarMovimentosCaixa(lojaAtual.id),
          listarOrdens(lojaAtual.id),
          listarPecas(),
          listarServicos(),
          listarFuncionarios(lojaAtual.id),
          listarContasReceber(lojaAtual.id),
        ]);
        setMovimentos(movimentosCarregados);
        setOrdens(ordensCarregadas);
        setPecas(pecasCarregadas);
        setServicos(servicosCarregados);
        setFuncionarios(funcionariosCarregados);
        setContasReceber(contasCarregadas);
      } catch (err) {
        console.error("Erro ao carregar relações:", err);
        setErro(mensagemDeErro(err));
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [lojaAtual]);

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <BotaoVoltar />
        <div>
          <h1 className="text-2xl font-semibold text-sakura-purple-dark">Relações</h1>
          <p className="text-sm text-sakura-muted">
            Vendas, custos, lucro e margem do negócio ao longo do tempo
          </p>
        </div>
      </header>

      {!isSupabaseConfigured && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          O Supabase ainda não está configurado. Defina{" "}
          <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code>{" "}
          no arquivo <code>.env</code> para ver as relações de verdade.
        </p>
      )}

      {erro && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</p>}

      <div className="flex gap-1 border-b border-sakura-gray/30">
        <AbaBotao
          label="Gráficos"
          ativa={aba === "graficos"}
          onClick={() => setAba("graficos")}
        />
        <AbaBotao
          label="Lucratividade"
          ativa={aba === "lucratividade"}
          onClick={() => setAba("lucratividade")}
        />
        <AbaBotao
          label="Comissões"
          ativa={aba === "comissoes"}
          onClick={() => setAba("comissoes")}
        />
      </div>

      {carregando ? (
        <p className="text-sm text-sakura-muted">Carregando...</p>
      ) : aba === "graficos" ? (
        <GraficosSection
          movimentos={movimentos}
          ordens={ordens}
          pecas={pecas}
          servicos={servicos}
        />
      ) : aba === "lucratividade" ? (
        <LucratividadeSection ordens={ordens} pecas={pecas} servicos={servicos} />
      ) : (
        <ComissoesSection
          ordens={ordens}
          pecas={pecas}
          servicos={servicos}
          funcionarios={funcionarios}
          contasReceber={contasReceber}
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
