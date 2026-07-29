import { useMemo, useState } from "react";
import type { CategoriaCaixa } from "@/types/categoriaCaixa";
import type { MovimentoCaixa, NovoMovimentoCaixa, TipoCaixa } from "@/types/caixa";
import { CaixaForm } from "./CaixaForm";

interface EntradaSaidaSectionProps {
  tipo: TipoCaixa;
  movimentos: MovimentoCaixa[];
  categorias: CategoriaCaixa[];
  onSalvar: (movimento: NovoMovimentoCaixa) => Promise<void>;
}

function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function EntradaSaidaSection({
  tipo,
  movimentos,
  categorias,
  onSalvar,
}: EntradaSaidaSectionProps) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const rotulo = tipo === "entrada" ? "entrada" : "saída";

  const movimentosManuais = useMemo(
    () => movimentos.filter((m) => m.tipo === tipo && !m.ordem_servico_id),
    [movimentos, tipo],
  );

  const total = movimentosManuais.reduce((soma, m) => soma + m.valor, 0);

  const porCategoria = useMemo(() => {
    const mapa = new Map<string, number>();
    for (const m of movimentosManuais) {
      const nome = m.categoria?.nome ?? "Sem categoria";
      mapa.set(nome, (mapa.get(nome) ?? 0) + m.valor);
    }
    return [...mapa.entries()].sort((a, b) => b[1] - a[1]);
  }, [movimentosManuais]);

  async function handleSalvar(movimento: NovoMovimentoCaixa) {
    await onSalvar(movimento);
    setMostrarFormulario(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-sakura-muted">
          Lançamentos manuais de {rotulo} — não inclui faturamento de OS, que já aparece na
          aba Diário
        </p>
        {!mostrarFormulario && (
          <button
            onClick={() => setMostrarFormulario(true)}
            className="rounded-xl bg-sakura-purple px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            + Nova {rotulo}
          </button>
        )}
      </div>

      {mostrarFormulario && (
        <CaixaForm
          categorias={categorias}
          tipoInicial={tipo}
          tipoBloqueado
          onSalvar={handleSalvar}
          onCancelar={() => setMostrarFormulario(false)}
        />
      )}

      <div className="sakura-card p-4">
        <p className="text-xs text-sakura-muted">Total de {rotulo}s (todo o período)</p>
        <p className="text-xl font-semibold text-sakura-purple-dark">{formatarMoeda(total)}</p>
      </div>

      {porCategoria.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-sakura-purple-dark">Por categoria</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {porCategoria.map(([nome, valor]) => (
              <div key={nome} className="sakura-card px-4 py-3">
                <p className="text-xs text-sakura-muted">{nome}</p>
                <p className="text-base font-semibold text-sakura-purple-dark">
                  {formatarMoeda(valor)}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {movimentosManuais.length === 0 ? (
        <p className="text-sm text-sakura-muted">Nenhum lançamento manual de {rotulo} ainda.</p>
      ) : (
        <div className="overflow-hidden sakura-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-sakura-pink-soft text-sakura-purple-dark">
              <tr>
                <th className="px-4 py-3 font-medium">Data</th>
                <th className="px-4 py-3 font-medium">Categoria</th>
                <th className="px-4 py-3 font-medium">Descrição</th>
                <th className="px-4 py-3 font-medium">Forma de pagamento</th>
                <th className="px-4 py-3 font-medium">Valor</th>
              </tr>
            </thead>
            <tbody>
              {movimentosManuais.map((m) => (
                <tr key={m.id} className="border-t border-sakura-gray/20">
                  <td className="px-4 py-3">{new Date(m.data).toLocaleDateString("pt-BR")}</td>
                  <td className="px-4 py-3">{m.categoria?.nome ?? "—"}</td>
                  <td className="px-4 py-3">{m.descricao || "—"}</td>
                  <td className="px-4 py-3">{m.forma_pagamento || "—"}</td>
                  <td className="px-4 py-3 font-medium">{formatarMoeda(m.valor)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
