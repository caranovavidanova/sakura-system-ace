import { useState } from "react";
import { mensagemDeErro } from "@/lib/errors";
import type { NovoMovimentoCaixa, TipoCaixa } from "@/types/caixa";

interface CaixaFormProps {
  onSalvar: (movimento: NovoMovimentoCaixa) => Promise<void>;
  onCancelar: () => void;
}

export function CaixaForm({ onSalvar, onCancelar }: CaixaFormProps) {
  const [tipo, setTipo] = useState<TipoCaixa>("entrada");
  const [valor, setValor] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("dinheiro");
  const [descricao, setDescricao] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    const valorNumero = Number(valor);
    if (!valorNumero || valorNumero <= 0) {
      setErro("Informe um valor maior que zero.");
      return;
    }

    setSalvando(true);
    try {
      await onSalvar({
        ordem_servico_id: null,
        tipo,
        forma_pagamento: formaPagamento || null,
        valor: valorNumero,
        descricao: descricao.trim() || null,
      });
      setValor("");
      setDescricao("");
    } catch (err) {
      console.error("Erro ao registrar movimento de caixa:", err);
      setErro(mensagemDeErro(err));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-sakura-gray/30 bg-white p-6 shadow-sm"
    >
      {erro && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          {erro}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-sakura-purple-dark/80">Tipo</span>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoCaixa)}
            className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
          >
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-sakura-purple-dark/80">Valor</span>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-sakura-purple-dark/80">Forma de pagamento</span>
          <input
            type="text"
            value={formaPagamento}
            onChange={(e) => setFormaPagamento(e.target.value)}
            className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-sakura-purple-dark/80">Descrição</span>
          <input
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
          />
        </label>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancelar}
          className="rounded-xl px-4 py-2 text-sm font-medium text-sakura-purple-dark/70 hover:bg-sakura-gray/10"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={salvando}
          className="rounded-xl bg-sakura-purple px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {salvando ? "Salvando..." : "Registrar"}
        </button>
      </div>
    </form>
  );
}
