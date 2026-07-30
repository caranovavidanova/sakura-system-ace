import { useState } from "react";
import { Modal } from "@/components/Modal";
import { mensagemDeErro } from "@/lib/errors";
import type { ContaPagar } from "@/types/contaPagar";

interface PagarContaModalProps {
  conta: ContaPagar;
  onConfirmar: (valorPago: number, formaPagamento: string) => Promise<void>;
  onFechar: () => void;
}

function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function PagarContaModal({ conta, onConfirmar, onFechar }: PagarContaModalProps) {
  const [valor, setValor] = useState(String(conta.valor));
  const [formaPagamento, setFormaPagamento] = useState("dinheiro");
  const [confirmando, setConfirmando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleConfirmar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    const valorNumero = Number(valor);
    if (!valorNumero || valorNumero <= 0) {
      setErro("Informe um valor maior que zero.");
      return;
    }
    setConfirmando(true);
    try {
      await onConfirmar(valorNumero, formaPagamento);
    } catch (err) {
      console.error("Erro ao marcar conta como paga:", err);
      setErro(mensagemDeErro(err));
    } finally {
      setConfirmando(false);
    }
  }

  return (
    <Modal titulo="Marcar como paga" onFechar={onFechar}>
      <form onSubmit={handleConfirmar} className="space-y-3 text-sm">
        <p className="text-sakura-purple-dark/80">
          {conta.descricao} — venceu em {new Date(conta.vencimento).toLocaleDateString("pt-BR")}
          {conta.recorrente ? " · a próxima ocorrência já é criada automaticamente" : ""}
        </p>

        {erro && <p className="rounded-lg bg-red-50 px-3 py-2 text-red-700">{erro}</p>}

        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sakura-purple-dark/80">Valor pago</span>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sakura-purple-dark/80">Forma de pagamento</span>
            <input
              type="text"
              value={formaPagamento}
              onChange={(e) => setFormaPagamento(e.target.value)}
              className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
            />
          </label>
        </div>

        <p className="rounded-lg bg-sakura-pink-soft/60 px-3 py-2 text-xs text-sakura-purple-dark/90">
          Isso lança uma Saída de {formatarMoeda(Number(valor) || 0)} no Caixa automaticamente.
        </p>

        <div className="mt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onFechar}
            className="rounded-xl px-4 py-2 text-sm font-medium text-sakura-purple-dark/90 hover:bg-sakura-gray/10"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={confirmando}
            className="rounded-xl bg-sakura-purple px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {confirmando ? "Confirmando..." : "Confirmar pagamento"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
