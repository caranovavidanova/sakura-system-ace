import { useState } from "react";

interface SimulacaoParcelasProps {
  total: number;
}

const MAX_PARCELAS = 12;

function valorParcela(total: number, taxaMensal: number, parcelas: number): number {
  if (parcelas <= 1) return total;
  const i = taxaMensal / 100;
  if (i === 0) return total / parcelas;
  return (total * i) / (1 - Math.pow(1 + i, -parcelas));
}

export function SimulacaoParcelas({ total }: SimulacaoParcelasProps) {
  const [taxaMensal, setTaxaMensal] = useState(2.5);

  return (
    <div className="rounded-2xl border border-sakura-gray/30 bg-white p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-sakura-purple-dark">
          Simulação de parcelas
        </h3>
        <label className="flex items-center gap-1.5 text-xs text-sakura-purple-dark/70">
          Juros a.m.
          <input
            type="number"
            step="0.1"
            min="0"
            value={taxaMensal}
            onChange={(e) => setTaxaMensal(Number(e.target.value) || 0)}
            className="w-16 rounded-lg border border-sakura-gray/40 px-2 py-1 text-sm"
          />
          %
        </label>
      </div>

      {total <= 0 ? (
        <p className="text-xs text-sakura-gray">
          Adicione peças ou serviços para simular as parcelas.
        </p>
      ) : (
        <div className="max-h-48 overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-sakura-purple-dark/70">
              <tr>
                <th className="py-1 font-medium">Parcelas</th>
                <th className="py-1 font-medium">Valor</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: MAX_PARCELAS }, (_, i) => i + 1).map((n) => (
                <tr key={n} className="border-t border-sakura-gray/10">
                  <td className="py-1 text-sakura-purple-dark">{n}x</td>
                  <td className="py-1 text-sakura-purple-dark">
                    {valorParcela(total, taxaMensal, n).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-2 text-[11px] text-sakura-gray">
        Simulação apenas informativa — não gera cobrança nem parcelamento real.
      </p>
    </div>
  );
}
