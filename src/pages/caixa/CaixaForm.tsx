import { useState } from "react";
import { BotaoVoltar } from "@/components/BotaoVoltar";
import { mensagemDeErro } from "@/lib/errors";
import type { CategoriaCaixa } from "@/types/categoriaCaixa";
import type { NovoMovimentoCaixa, TipoCaixa } from "@/types/caixa";

interface CaixaFormProps {
  categorias: CategoriaCaixa[];
  tipoInicial?: TipoCaixa;
  tipoBloqueado?: boolean;
  onSalvar: (movimento: NovoMovimentoCaixa) => Promise<void>;
  onCancelar: () => void;
}

export function CaixaForm({
  categorias,
  tipoInicial = "entrada",
  tipoBloqueado = false,
  onSalvar,
  onCancelar,
}: CaixaFormProps) {
  const [tipo, setTipo] = useState<TipoCaixa>(tipoInicial);
  const [categoriaId, setCategoriaId] = useState("");
  const [valor, setValor] = useState("");
  const [formaPagamento, setFormaPagamento] = useState("dinheiro");
  const [descricao, setDescricao] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const categoriasDoTipo = categorias.filter((c) => c.tipo === tipo);

  function handleTipoChange(novoTipo: TipoCaixa) {
    setTipo(novoTipo);
    setCategoriaId("");
  }

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
        categoria_id: categoriaId || null,
      });
      setValor("");
      setDescricao("");
      setCategoriaId("");
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
      className="space-y-4 sakura-card p-6 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <BotaoVoltar onClick={onCancelar} />
        <h2 className="text-lg font-semibold text-sakura-purple-dark">
          Novo lançamento
        </h2>
      </div>

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
            onChange={(e) => handleTipoChange(e.target.value as TipoCaixa)}
            disabled={tipoBloqueado}
            className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple disabled:bg-sakura-gray/10 disabled:text-sakura-muted"
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
          <span className="text-sakura-purple-dark/80">Categoria (opcional)</span>
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
          >
            <option value="">Sem categoria</option>
            {categoriasDoTipo.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </select>
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

        <label className="col-span-2 flex flex-col gap-1 text-sm">
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
          className="rounded-xl px-4 py-2 text-sm font-medium text-sakura-purple-dark/90 hover:bg-sakura-gray/10"
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
