import { useState } from "react";
import { mensagemDeErro } from "@/lib/errors";
import type { Cliente } from "@/types/cliente";
import type { NovaOrdemServico, NovoItemOS } from "@/types/os";
import { totalOrdem } from "@/types/os";
import type { Peca } from "@/types/peca";
import { ItemOSRow } from "./ItemOSRow";

interface OrdemServicoFormProps {
  clientes: Cliente[];
  pecas: Peca[];
  onSalvar: (ordem: NovaOrdemServico, itens: NovoItemOS[]) => Promise<void>;
  onCancelar: () => void;
}

function novoItemVazio(): NovoItemOS {
  return {
    tipo: "peca",
    peca_id: null,
    descricao: "",
    quantidade: 1,
    preco_unitario: 0,
    desconto: 0,
  };
}

export function OrdemServicoForm({
  clientes,
  pecas,
  onSalvar,
  onCancelar,
}: OrdemServicoFormProps) {
  const [clienteId, setClienteId] = useState("");
  const [veiculoId, setVeiculoId] = useState("");
  const [kmEntrada, setKmEntrada] = useState("");
  const [descricaoProblema, setDescricaoProblema] = useState("");
  const [itens, setItens] = useState<NovoItemOS[]>([novoItemVazio()]);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const clienteSelecionado = clientes.find((c) => c.id === clienteId);
  const veiculosDoCliente = clienteSelecionado?.veiculos ?? [];
  const totalPrevisto = totalOrdem(
    itens.map((item) => ({ ...item, id: "", ordem_servico_id: "" })),
  );

  function atualizarItem(index: number, item: NovoItemOS) {
    setItens((atual) => atual.map((it, i) => (i === index ? item : it)));
  }

  function removerItem(index: number) {
    setItens((atual) => atual.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    if (!clienteId) {
      setErro("Selecione um cliente.");
      return;
    }
    const itensValidos = itens.filter(
      (item) => item.descricao.trim() && item.quantidade > 0,
    );

    setSalvando(true);
    try {
      await onSalvar(
        {
          cliente_id: clienteId,
          veiculo_id: veiculoId || null,
          km_entrada: kmEntrada ? Number(kmEntrada) : null,
          descricao_problema: descricaoProblema.trim() || null,
        },
        itensValidos,
      );
    } catch (err) {
      console.error("Erro ao salvar ordem de serviço:", err);
      setErro(mensagemDeErro(err));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-sakura-gray/30 bg-white p-6 shadow-sm"
    >
      {erro && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          {erro}
        </p>
      )}

      <section className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-sakura-purple-dark/80">
            Cliente <span className="text-red-500">*</span>
          </span>
          <select
            value={clienteId}
            onChange={(e) => {
              setClienteId(e.target.value);
              setVeiculoId("");
            }}
            className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
          >
            <option value="">Selecione o cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nome}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-sakura-purple-dark/80">Veículo</span>
          <select
            value={veiculoId}
            onChange={(e) => setVeiculoId(e.target.value)}
            disabled={!clienteId}
            className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple disabled:opacity-50"
          >
            <option value="">Sem veículo vinculado</option>
            {veiculosDoCliente.map((veiculo) => (
              <option key={veiculo.id} value={veiculo.id}>
                {veiculo.placa} — {veiculo.marca} {veiculo.modelo}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-sakura-purple-dark/80">KM de entrada</span>
          <input
            type="number"
            value={kmEntrada}
            onChange={(e) => setKmEntrada(e.target.value)}
            className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
          />
        </label>

        <label className="col-span-2 flex flex-col gap-1 text-sm">
          <span className="text-sakura-purple-dark/80">Problema relatado</span>
          <textarea
            value={descricaoProblema}
            onChange={(e) => setDescricaoProblema(e.target.value)}
            rows={2}
            className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
          />
        </label>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-sakura-purple-dark">
            Peças e serviços
          </h3>
          <button
            type="button"
            onClick={() => setItens((atual) => [...atual, novoItemVazio()])}
            className="text-xs font-medium text-sakura-purple hover:underline"
          >
            + adicionar item
          </button>
        </div>
        <div className="space-y-2">
          {itens.map((item, index) => (
            <ItemOSRow
              key={index}
              item={item}
              pecas={pecas}
              onChange={(novoItem) => atualizarItem(index, novoItem)}
              onRemover={() => removerItem(index)}
            />
          ))}
        </div>
        <p className="mt-3 text-right text-sm font-semibold text-sakura-purple-dark">
          Total previsto: {totalPrevisto.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </p>
      </section>

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
          {salvando ? "Salvando..." : "Abrir ordem de serviço"}
        </button>
      </div>
    </form>
  );
}
