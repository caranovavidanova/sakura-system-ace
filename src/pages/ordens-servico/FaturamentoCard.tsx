import { useState } from "react";
import { mensagemDeErro } from "@/lib/errors";
import type { JurosParcela } from "@/types/configuracao";
import type { OrdemServico } from "@/types/os";
import { totalOrdem } from "@/types/os";

interface FaturamentoCardProps {
  ordem: OrdemServico;
  jurosParcelas: JurosParcela[];
  onConfirmar: (formaPagamento: string, parcelas: number, valorCobrado: number) => Promise<void>;
  onCancelar: () => void;
}

const FORMAS_PAGAMENTO = [
  { valor: "dinheiro", label: "Dinheiro" },
  { valor: "pix", label: "Pix" },
  { valor: "cartao_debito", label: "Cartão de débito" },
  { valor: "cartao_credito", label: "Cartão de crédito" },
];

function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function addMeses(data: Date, meses: number): Date {
  const nova = new Date(data);
  nova.setMonth(nova.getMonth() + meses);
  return nova;
}

export function FaturamentoCard({
  ordem,
  jurosParcelas,
  onConfirmar,
  onCancelar,
}: FaturamentoCardProps) {
  const [formaPagamento, setFormaPagamento] = useState("pix");
  const [parcelas, setParcelas] = useState(1);
  const [confirmando, setConfirmando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const total = totalOrdem(ordem.itens ?? []);
  const permiteParcelar = formaPagamento === "cartao_credito";
  const jurosPercentual = parcelas === 1
    ? 0
    : (jurosParcelas.find((j) => j.numero_parcelas === parcelas)?.juros_percentual ?? 0);
  const valorCobrado = total * (1 + jurosPercentual / 100);
  const valorParcela = valorCobrado / parcelas;
  const hoje = new Date();
  const listaParcelas = Array.from({ length: parcelas }, (_, i) => ({
    numero: i + 1,
    vencimento: addMeses(hoje, i + 1),
    valor: valorParcela,
  }));

  function handleFormaPagamentoChange(valor: string) {
    setFormaPagamento(valor);
    if (valor !== "cartao_credito") setParcelas(1);
  }

  async function handleConfirmar() {
    setErro(null);
    setConfirmando(true);
    try {
      await onConfirmar(formaPagamento, parcelas, valorCobrado);
    } catch (err) {
      console.error("Erro ao faturar ordem de serviço:", err);
      setErro(mensagemDeErro(err));
    } finally {
      setConfirmando(false);
    }
  }

  return (
    <div className="space-y-5 sakura-card p-6 shadow-sm">
      <div>
        <h3 className="text-sm font-semibold text-sakura-purple-dark">
          Faturar OS de {ordem.cliente?.nome ?? "cliente"}
        </h3>
        <p className="text-xs text-sakura-gray">
          Total dos itens: {formatarMoeda(total)}
        </p>
      </div>

      {erro && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{erro}</p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-sakura-purple-dark/80">Forma de pagamento</span>
          <select
            value={formaPagamento}
            onChange={(e) => handleFormaPagamentoChange(e.target.value)}
            className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
          >
            {FORMAS_PAGAMENTO.map((forma) => (
              <option key={forma.valor} value={forma.valor}>
                {forma.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-sakura-purple-dark/80">Parcelas</span>
          <select
            value={parcelas}
            onChange={(e) => setParcelas(Number(e.target.value))}
            disabled={!permiteParcelar}
            className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple disabled:opacity-50"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => {
              const percentual = jurosParcelas.find((j) => j.numero_parcelas === n)?.juros_percentual ?? 0;
              return (
                <option key={n} value={n}>
                  {n}x{n === 1 ? " à vista" : percentual > 0 ? ` (${percentual}% de juros)` : " sem juros"}
                </option>
              );
            })}
          </select>
        </label>
      </div>

      {parcelas === 1 ? (
        <p className="text-right text-lg font-semibold text-sakura-purple-dark">
          {formatarMoeda(valorCobrado)}
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-sakura-gray/30">
          <table className="w-full text-left text-sm">
            <thead className="bg-sakura-pink-soft text-sakura-purple-dark">
              <tr>
                <th className="px-4 py-2 font-medium">Parcela</th>
                <th className="px-4 py-2 font-medium">Vencimento</th>
                <th className="px-4 py-2 font-medium">Valor</th>
              </tr>
            </thead>
            <tbody>
              {listaParcelas.map((p) => (
                <tr key={p.numero} className="border-t border-sakura-gray/20">
                  <td className="px-4 py-2 text-sakura-purple-dark">{p.numero}x</td>
                  <td className="px-4 py-2 text-sakura-purple-dark">
                    {p.vencimento.toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-2 text-sakura-purple-dark">
                    {formatarMoeda(p.valor)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="border-t border-sakura-gray/20 px-4 py-2 text-right text-sm font-semibold text-sakura-purple-dark">
            Total {jurosPercentual > 0 ? "com juros" : ""}: {formatarMoeda(valorCobrado)}
          </p>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancelar}
          className="rounded-xl px-4 py-2 text-sm font-medium text-sakura-purple-dark/70 hover:bg-sakura-gray/10"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleConfirmar}
          disabled={confirmando}
          className="rounded-xl bg-sakura-purple px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {confirmando ? "Faturando..." : "Confirmar faturamento"}
        </button>
      </div>
    </div>
  );
}
