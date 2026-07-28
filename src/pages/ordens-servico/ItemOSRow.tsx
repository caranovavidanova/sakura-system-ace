import type { Operador } from "@/types/operador";
import type { Peca } from "@/types/peca";
import type { Servico } from "@/types/servico";
import type { NovoItemOS, TipoItemOS } from "@/types/os";

interface ItemOSRowProps {
  item: NovoItemOS;
  pecas: Peca[];
  servicos: Servico[];
  operadores: Operador[];
  onChange: (item: NovoItemOS) => void;
  onRemover: () => void;
}

const SERVICO_AVULSO = "avulso";

export function ItemOSRow({
  item,
  pecas,
  servicos,
  operadores,
  onChange,
  onRemover,
}: ItemOSRowProps) {
  function handleTipoChange(tipo: TipoItemOS) {
    onChange({
      ...item,
      tipo,
      peca_id: null,
      servico_id: null,
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

  function handleServicoChange(valor: string) {
    if (valor === SERVICO_AVULSO) {
      onChange({ ...item, servico_id: null, descricao: "", preco_unitario: 0 });
      return;
    }
    const servico = servicos.find((s) => s.id === valor);
    onChange({
      ...item,
      servico_id: valor,
      descricao: servico?.descricao ?? "",
      preco_unitario: servico?.preco_padrao ?? 0,
    });
  }

  const servicoEhAvulso = item.tipo === "servico" && !item.servico_id;

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
          <select
            value={item.servico_id ?? SERVICO_AVULSO}
            onChange={(e) => handleServicoChange(e.target.value)}
            className="flex-1 rounded-lg border border-sakura-gray/40 px-2 py-1.5 text-sm"
          >
            <option value={SERVICO_AVULSO}>Serviço avulso (digitar abaixo)</option>
            {servicos.map((servico) => (
              <option key={servico.id} value={servico.id}>
                {servico.descricao}
              </option>
            ))}
          </select>
        )}

        <button
          type="button"
          onClick={onRemover}
          className="shrink-0 text-xs font-medium text-red-600 hover:underline"
        >
          Remover
        </button>
      </div>

      {servicoEhAvulso && (
        <input
          type="text"
          placeholder="Descrição do serviço"
          value={item.descricao}
          onChange={(e) => onChange({ ...item, descricao: e.target.value })}
          className="w-full rounded-lg border border-sakura-gray/40 px-2 py-1.5 text-sm"
        />
      )}

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

        <label className="flex flex-1 flex-col gap-0.5 text-xs text-sakura-purple-dark/70">
          Técnico
          <select
            value={item.tecnico_id ?? ""}
            onChange={(e) => onChange({ ...item, tecnico_id: e.target.value || null })}
            className="rounded-lg border border-sakura-gray/40 px-2 py-1.5 text-sm text-sakura-purple-dark"
          >
            <option value="">Sem técnico definido</option>
            {operadores.map((operador) => (
              <option key={operador.id} value={operador.id}>
                {operador.nome}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
