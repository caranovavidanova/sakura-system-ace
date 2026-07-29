import { useState } from "react";
import { BotaoVoltar } from "@/components/BotaoVoltar";
import { mensagemDeErro } from "@/lib/errors";
import type { Peca } from "@/types/peca";
import type {
  MotivoMovimento,
  NovoMovimentoEstoque,
  TipoMovimento,
} from "@/types/estoque";

interface MovimentoFormProps {
  pecas: Peca[];
  onSalvar: (movimento: NovoMovimentoEstoque) => Promise<void>;
  onCancelar: () => void;
}

const motivos: { value: MotivoMovimento; label: string }[] = [
  { value: "compra", label: "Compra (entrada de fornecedor)" },
  { value: "venda", label: "Venda" },
  { value: "ajuste", label: "Ajuste manual" },
  { value: "uso_em_os", label: "Uso em ordem de serviço" },
];

export function MovimentoForm({ pecas, onSalvar, onCancelar }: MovimentoFormProps) {
  const [pecaId, setPecaId] = useState(pecas[0]?.id ?? "");
  const [tipo, setTipo] = useState<TipoMovimento>("entrada");
  const [quantidade, setQuantidade] = useState("");
  const [motivo, setMotivo] = useState<MotivoMovimento>("compra");
  const [referencia, setReferencia] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    const quantidadeNumero = Number(quantidade);
    if (!pecaId) {
      setErro("Selecione uma peça.");
      return;
    }
    if (!quantidadeNumero || quantidadeNumero <= 0) {
      setErro("Informe uma quantidade maior que zero.");
      return;
    }

    setSalvando(true);
    try {
      await onSalvar({
        peca_id: pecaId,
        tipo,
        quantidade: quantidadeNumero,
        motivo,
        referencia: referencia.trim() || null,
      });
      setQuantidade("");
      setReferencia("");
    } catch (err) {
      console.error("Erro ao registrar movimentação:", err);
      setErro(mensagemDeErro(err));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 sakura-card p-6 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <BotaoVoltar onClick={onCancelar} />
        <h2 className="text-lg font-semibold text-sakura-purple-dark">
          Nova movimentação
        </h2>
      </div>

      {erro && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          {erro}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-sakura-purple-dark/80">Peça</span>
          <select
            value={pecaId}
            onChange={(e) => setPecaId(e.target.value)}
            className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
          >
            {pecas.length === 0 && <option value="">Nenhuma peça cadastrada</option>}
            {pecas.map((peca) => (
              <option key={peca.id} value={peca.id}>
                {peca.descricao}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-sakura-purple-dark/80">Tipo</span>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoMovimento)}
            className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
          >
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-sakura-purple-dark/80">Quantidade</span>
          <input
            type="number"
            step="1"
            min="1"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-sakura-purple-dark/80">Motivo</span>
          <select
            value={motivo}
            onChange={(e) => setMotivo(e.target.value as MotivoMovimento)}
            className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
          >
            {motivos.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </label>

        <label className="col-span-2 flex flex-col gap-1 text-sm">
          <span className="text-sakura-purple-dark/80">
            Referência (opcional — ex: nº da nota, nº da OS)
          </span>
          <input
            type="text"
            value={referencia}
            onChange={(e) => setReferencia(e.target.value)}
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
          disabled={salvando || pecas.length === 0}
          className="rounded-xl bg-sakura-purple px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {salvando ? "Salvando..." : "Registrar movimentação"}
        </button>
      </div>
    </form>
  );
}
