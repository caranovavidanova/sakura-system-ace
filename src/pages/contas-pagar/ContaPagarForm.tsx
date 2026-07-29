import { useState } from "react";
import { BotaoVoltar } from "@/components/BotaoVoltar";
import { mensagemDeErro } from "@/lib/errors";
import type { CategoriaCaixa } from "@/types/categoriaCaixa";
import type { NovaContaPagar } from "@/types/contaPagar";

interface ContaPagarFormProps {
  categorias: CategoriaCaixa[];
  onSalvar: (conta: NovaContaPagar) => Promise<void>;
  onCancelar: () => void;
}

export function ContaPagarForm({ categorias, onSalvar, onCancelar }: ContaPagarFormProps) {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [vencimento, setVencimento] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [recorrente, setRecorrente] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const categoriasSaida = categorias.filter((c) => c.tipo === "saida");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    const valorNumero = Number(valor);
    if (!descricao.trim() || !valorNumero || valorNumero <= 0 || !vencimento) {
      setErro("Preencha descrição, valor e vencimento.");
      return;
    }

    setSalvando(true);
    try {
      await onSalvar({
        descricao: descricao.trim(),
        valor: valorNumero,
        vencimento,
        categoria_id: categoriaId || null,
        recorrente,
      });
    } catch (err) {
      console.error("Erro ao cadastrar conta a pagar:", err);
      setErro(mensagemDeErro(err));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sakura-card p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <BotaoVoltar onClick={onCancelar} />
        <h2 className="text-lg font-semibold text-sakura-purple-dark">Nova conta</h2>
      </div>

      {erro && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{erro}</p>}

      <div className="grid grid-cols-2 gap-4">
        <label className="col-span-2 flex flex-col gap-1 text-sm">
          <span className="text-sakura-purple-dark/80">
            Descrição <span className="text-red-500">*</span>
          </span>
          <input
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Aluguel"
            className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-sakura-purple-dark/80">
            Valor <span className="text-red-500">*</span>
          </span>
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
          <span className="text-sakura-purple-dark/80">
            Vencimento <span className="text-red-500">*</span>
          </span>
          <input
            type="date"
            value={vencimento}
            onChange={(e) => setVencimento(e.target.value)}
            className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-sakura-purple-dark/80">Categoria (opcional)</span>
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
          >
            <option value="">Sem categoria</option>
            {categoriasSaida.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm text-sakura-purple-dark/80">
          <input
            type="checkbox"
            checked={recorrente}
            onChange={(e) => setRecorrente(e.target.checked)}
            className="h-4 w-4 rounded border-sakura-gray/40"
          />
          Conta mensal recorrente (ao pagar, já cria a próxima automaticamente)
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
          {salvando ? "Salvando..." : "Cadastrar"}
        </button>
      </div>
    </form>
  );
}
