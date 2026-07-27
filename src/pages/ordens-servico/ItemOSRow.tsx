import type { Peca } from "@/types/peca";
import type { NovoItemOS, TipoItemOS } from "@/types/os";

interface ItemOSRowProps {
  item: NovoItemOS;
  pecas: Peca[];
  onChange: (item: NovoItemOS) => void;
  onRemover: () => void;
}

export function ItemOSRow({ item, pecas, onChange, onRemover }: ItemOSRowProps) {
  function handleTipoChange(tipo: TipoItemOS) {
    onChange({
      ...item,
      tipo,
      peca_id: null,
      descricao: "",
      preco_unitario: 0,
    });
  }

  function handlePecaChange(pecaId: string) {
    const peca = pecas.find((p) => p.id === pecaId);
    onChange({
      ...item,
      peca_id: pecaId || null,
      descricao: peca?.descricao ?? "",
      preco_unitario: peca?.preco_venda ?? 0,
    });
  }

  return (
    <div className="space-y-2 rounded-lg border border-sakura-gray/30 p-3">
      <div className="flex gap-2">
        <select
          value={item.tipo}
          onChange={(e) => handleTipoChange(e.target.value as TipoItemOS)}
          className="w-28 shrink-0 rounded-lg border border-sakura-gray/40 px-2 py-1.5 text-sm"
        >
          <option value="peca">Peça</option>
          <option value="servico">Serviço</option>
        </select>

        {item.tipo === "peca" ? (
          <select
            value={item.peca_id ?? ""}
            onChange={(e) => handlePecaChange(e.target.value)}
            className="flex-1 rounded-lg border border-sakura-gray/40 px-2 py-1.5 text-sm"
          >
            <option value="">Selecione a peça</option>
            {pecas.map((peca) => (
              <option key={peca.id} value={peca.id}>
                {peca.descricao}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            placeholder="Descrição do serviço"
            value={item.descricao}
            onChange={(e) => onChange({ ...item, descricao: e.target.value })}
            className="flex-1 rounded-lg border border-sakura-gray/40 px-2 py-1.5 text-sm"
          />
        )}

        <button
          type="button"
          onClick={onRemover}
          className="shrink-0 text-xs font-medium text-red-600 hover:underline"
        >
          Remover
        </button>
      </div>

      <div className="flex gap-2">
        <label className="flex flex-1 flex-col gap-0.5 text-xs text-sakura-purple-dark/70">
          Quantidade
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={item.quantidade || ""}
            onChange={(e) => onChange({ ...item, quantidade: Number(e.target.value) })}
            className="rounded-lg border border-sakura-gray/40 px-2 py-1.5 text-sm text-sakura-purple-dark"
          />
        </label>

        <label className="flex flex-1 flex-col gap-0.5 text-xs text-sakura-purple-dark/70">
          Preço unitário
          <input
            type="number"
            min="0"
            step="0.01"
            value={item.preco_unitario || ""}
            onChange={(e) => onChange({ ...item, preco_unitario: Number(e.target.value) })}
            className="rounded-lg border border-sakura-gray/40 px-2 py-1.5 text-sm text-sakura-purple-dark"
          />
        </label>

        <label className="flex flex-1 flex-col gap-0.5 text-xs text-sakura-purple-dark/70">
          Desconto
          <input
            type="number"
            min="0"
            step="0.01"
            value={item.desconto || ""}
            onChange={(e) => onChange({ ...item, desconto: Number(e.target.value) })}
            className="rounded-lg border border-sakura-gray/40 px-2 py-1.5 text-sm text-sakura-purple-dark"
          />
        </label>
      </div>
    </div>
  );
}
