import { useEffect, useMemo, useState } from "react";
import { mensagemDeErro } from "@/lib/errors";
import { criarMovimentoCaixa, listarMovimentosCaixa } from "@/lib/caixa";
import { listarPecas } from "@/lib/pecas";
import { isSupabaseConfigured } from "@/lib/supabase";
import { totalOrdem } from "@/types/os";
import type { MovimentoCaixa, NovoMovimentoCaixa } from "@/types/caixa";
import type { Peca } from "@/types/peca";
import { CaixaForm } from "./CaixaForm";

function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function paraDataLocal(dataIso: string): string {
  return new Date(dataIso).toLocaleDateString("sv-SE");
}

export function CaixaPage() {
  const [movimentos, setMovimentos] = useState<MovimentoCaixa[]>([]);
  const [pecas, setPecas] = useState<Peca[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [dataFiltro, setDataFiltro] = useState(() => paraDataLocal(new Date().toISOString()));

  async function carregar() {
    if (!isSupabaseConfigured) {
      setCarregando(false);
      return;
    }
    setCarregando(true);
    setErro(null);
    try {
      const [movimentosCarregados, pecasCarregadas] = await Promise.all([
        listarMovimentosCaixa(),
        listarPecas(),
      ]);
      setMovimentos(movimentosCarregados);
      setPecas(pecasCarregadas);
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
    setMostrarFormulario(false);
    await carregar();
  }

  const custoPorPeca = useMemo(() => {
    const mapa = new Map<string, number>();
    for (const peca of pecas) mapa.set(peca.id, peca.preco_custo ?? 0);
    return mapa;
  }, [pecas]);

  const movimentosDoDia = useMemo(
    () => movimentos.filter((m) => paraDataLocal(m.data) === dataFiltro),
    [movimentos, dataFiltro],
  );

  const entradas = movimentosDoDia
    .filter((m) => m.tipo === "entrada")
    .reduce((total, m) => total + m.valor, 0);
  const saidas = movimentosDoDia
    .filter((m) => m.tipo === "saida")
    .reduce((total, m) => total + m.valor, 0);

  const porFormaPagamento = useMemo(() => {
    const mapa = new Map<string, number>();
    for (const m of movimentosDoDia) {
      if (m.tipo !== "entrada") continue;
      const forma = m.forma_pagamento || "Não informado";
      mapa.set(forma, (mapa.get(forma) ?? 0) + m.valor);
    }
    return [...mapa.entries()].sort((a, b) => b[1] - a[1]);
  }, [movimentosDoDia]);

  function lucroDoMovimento(m: MovimentoCaixa): number | null {
    if (!m.ordem_servico) return null;
    let custo = 0;
    for (const item of m.ordem_servico.itens) {
      const custoUnitario = item.tipo === "peca" ? custoPorPeca.get(item.peca_id ?? "") ?? 0 : 0;
      custo += item.quantidade * custoUnitario;
    }
    return totalOrdem(m.ordem_servico.itens) - custo;
  }

  const totalLucro = movimentosDoDia
    .filter((m) => m.tipo === "entrada")
    .reduce((total, m) => total + (lucroDoMovimento(m) ?? 0), 0);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-sakura-purple-dark">
            Caixa Diário
          </h1>
          <p className="text-sm text-sakura-gray">
            Vendas e movimentação do dia, nascendo das ordens de serviço faturadas
          </p>
        </div>
        {!mostrarFormulario && (
          <button
            onClick={() => setMostrarFormulario(true)}
            className="rounded-xl bg-sakura-purple px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            + Lançamento manual
          </button>
        )}
      </header>

      {!isSupabaseConfigured && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          O Supabase ainda não está configurado. Defina{" "}
          <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code>{" "}
          no arquivo <code>.env</code> para começar a registrar o caixa de verdade.
        </p>
      )}

      {mostrarFormulario && (
        <CaixaForm onSalvar={handleSalvar} onCancelar={() => setMostrarFormulario(false)} />
      )}

      {erro && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {erro}
        </p>
      )}

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-sakura-purple-dark/80">
          Dia:
          <input
            type="date"
            value={dataFiltro}
            onChange={(e) => setDataFiltro(e.target.value)}
            className="rounded-lg border border-sakura-gray/40 px-3 py-1.5"
          />
        </label>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-2xl border border-sakura-gray/30 bg-white p-4">
          <p className="text-xs text-sakura-gray">Entradas do dia</p>
          <p className="text-xl font-semibold text-sakura-purple-dark">
            {formatarMoeda(entradas)}
          </p>
        </div>
        <div className="rounded-2xl border border-sakura-gray/30 bg-white p-4">
          <p className="text-xs text-sakura-gray">Saídas do dia</p>
          <p className="text-xl font-semibold text-sakura-purple-dark">
            {formatarMoeda(saidas)}
          </p>
        </div>
        <div className="rounded-2xl border border-sakura-gray/30 bg-white p-4">
          <p className="text-xs text-sakura-gray">Saldo do dia</p>
          <p className="text-xl font-semibold text-sakura-purple-dark">
            {formatarMoeda(entradas - saidas)}
          </p>
        </div>
        <div className="rounded-2xl border border-sakura-gray/30 bg-white p-4">
          <p className="text-xs text-sakura-gray">Lucro do dia</p>
          <p className="text-xl font-semibold text-sakura-purple-dark">
            {formatarMoeda(totalLucro)}
          </p>
        </div>
      </div>

      {porFormaPagamento.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-sakura-purple-dark">
            Formas de recebimento
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {porFormaPagamento.map(([forma, valor]) => (
              <div
                key={forma}
                className="rounded-xl border border-sakura-gray/30 bg-white px-4 py-3"
              >
                <p className="text-xs text-sakura-gray">{forma}</p>
                <p className="text-base font-semibold text-sakura-purple-dark">
                  {formatarMoeda(valor)}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {carregando ? (
        <p className="text-sm text-sakura-gray">Carregando...</p>
      ) : movimentosDoDia.length === 0 ? (
        <p className="text-sm text-sakura-gray">Nenhuma movimentação neste dia.</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-sakura-gray/30 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-sakura-pink-soft text-sakura-purple-dark">
              <tr>
                <th className="px-4 py-3 font-medium">Horário</th>
                <th className="px-4 py-3 font-medium">Origem</th>
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Forma de pagamento</th>
                <th className="px-4 py-3 font-medium">Valor</th>
                <th className="px-4 py-3 font-medium">Lucro</th>
              </tr>
            </thead>
            <tbody>
              {movimentosDoDia.map((m) => {
                const lucro = lucroDoMovimento(m);
                return (
                  <tr key={m.id} className="border-t border-sakura-gray/20">
                    <td className="px-4 py-3">
                      {new Date(m.data).toLocaleTimeString("pt-BR")}
                    </td>
                    <td className="px-4 py-3">
                      {m.ordem_servico_id
                        ? `OS #${m.ordem_servico_id.slice(0, 8).toUpperCase()}`
                        : m.descricao || "Lançamento manual"}
                    </td>
                    <td className="px-4 py-3">{m.ordem_servico?.cliente?.nome ?? "—"}</td>
                    <td className="px-4 py-3">{m.forma_pagamento || "—"}</td>
                    <td
                      className={`px-4 py-3 font-medium ${
                        m.tipo === "saida" ? "text-red-700" : ""
                      }`}
                    >
                      {m.tipo === "saida" ? "− " : ""}
                      {formatarMoeda(m.valor)}
                    </td>
                    <td className="px-4 py-3">{lucro !== null ? formatarMoeda(lucro) : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t border-sakura-gray/30 bg-sakura-pink-soft/50 font-semibold text-sakura-purple-dark">
                <td className="px-4 py-3" colSpan={4}>
                  Total do dia
                </td>
                <td className="px-4 py-3">{formatarMoeda(entradas - saidas)}</td>
                <td className="px-4 py-3">{formatarMoeda(totalLucro)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
