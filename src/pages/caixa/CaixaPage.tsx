import { useEffect, useMemo, useState } from "react";
import { mensagemDeErro } from "@/lib/errors";
import { criarMovimentoCaixa, listarMovimentosCaixa } from "@/lib/caixa";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { MovimentoCaixa, NovoMovimentoCaixa } from "@/types/caixa";
import { CaixaForm } from "./CaixaForm";

function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function paraDataLocal(dataIso: string): string {
  return new Date(dataIso).toLocaleDateString("sv-SE");
}

export function CaixaPage() {
  const [movimentos, setMovimentos] = useState<MovimentoCaixa[]>([]);
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
      setMovimentos(await listarMovimentosCaixa());
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

      <div className="grid grid-cols-3 gap-4">
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
      </div>

      {carregando ? (
        <p className="text-sm text-sakura-gray">Carregando...</p>
      ) : movimentosDoDia.length === 0 ? (
        <p className="text-sm text-sakura-gray">Nenhuma movimentação neste dia.</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-sakura-gray/30 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-sakura-pink-soft text-sakura-purple-dark">
              <tr>
                <th className="px-4 py-3 font-medium">Hora</th>
                <th className="px-4 py-3 font-medium">Tipo</th>
                <th className="px-4 py-3 font-medium">Forma de pagamento</th>
                <th className="px-4 py-3 font-medium">Valor</th>
                <th className="px-4 py-3 font-medium">Descrição</th>
              </tr>
            </thead>
            <tbody>
              {movimentosDoDia.map((m) => (
                <tr key={m.id} className="border-t border-sakura-gray/20">
                  <td className="px-4 py-3">
                    {new Date(m.data).toLocaleTimeString("pt-BR")}
                  </td>
                  <td className="px-4 py-3">{m.tipo === "entrada" ? "Entrada" : "Saída"}</td>
                  <td className="px-4 py-3">{m.forma_pagamento || "—"}</td>
                  <td className="px-4 py-3">{formatarMoeda(m.valor)}</td>
                  <td className="px-4 py-3">{m.descricao || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
