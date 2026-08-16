import type { UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { Combobox } from "@/components/Combobox";
import { paraDisplayNumero, type OrdemServicoFormValues } from "@/schemas/ordemServico";
import type { Funcionario } from "@/types/funcionario";
import type { TipoItemOS } from "@/types/os";
import type { Peca } from "@/types/peca";
import type { Servico } from "@/types/servico";

interface ItemOSRowProps {
  index: number;
  register: UseFormRegister<OrdemServicoFormValues>;
  watch: UseFormWatch<OrdemServicoFormValues>;
  setValue: UseFormSetValue<OrdemServicoFormValues>;
  pecas: Peca[];
  servicos: Servico[];
  funcionarios: Funcionario[];
  onRemover: () => void;
}

export function ItemOSRow({
  index,
  register,
  watch,
  setValue,
  pecas,
  servicos,
  funcionarios,
  onRemover,
}: ItemOSRowProps) {
  const tipo = watch(`itens.${index}.tipo`);
  const pecaId = watch(`itens.${index}.peca_id`);
  const servicoId = watch(`itens.${index}.servico_id`);

  function aoMudarTipo(tipo: TipoItemOS) {
    setValue(`itens.${index}.tipo`, tipo);
    setValue(`itens.${index}.peca_id`, "");
    setValue(`itens.${index}.servico_id`, "");
    setValue(`itens.${index}.descricao`, "");
    setValue(`itens.${index}.preco_unitario`, "");
  }

  function aoMudarPeca(pecaId: string) {
    const peca = pecas.find((p) => p.id === pecaId);
    setValue(`itens.${index}.peca_id`, pecaId);
    setValue(`itens.${index}.descricao`, peca?.descricao ?? "");
    setValue(`itens.${index}.preco_unitario`, paraDisplayNumero(peca?.preco_venda ?? 0));
  }

  function aoMudarServico(servicoId: string) {
    const servico = servicos.find((s) => s.id === servicoId);
    setValue(`itens.${index}.servico_id`, servicoId);
    setValue(`itens.${index}.descricao`, servico?.descricao ?? "");
    setValue(`itens.${index}.preco_unitario`, paraDisplayNumero(servico?.preco_padrao ?? 0));
  }

  const servicoEhAvulso = tipo === "servico" && !servicoId;

  return (
    <div className="space-y-2 rounded-lg border border-sakura-gray/30 p-3">
      <div className="flex gap-2">
        <select
          value={tipo}
          onChange={(e) => aoMudarTipo(e.target.value as TipoItemOS)}
          className="w-28 shrink-0 rounded-lg border border-sakura-gray/40 px-2 py-1.5 text-sm"
        >
          <option value="peca">Peça</option>
          <option value="servico">Serviço</option>
        </select>

        {tipo === "peca" ? (
          <Combobox
            className="flex-1"
            opcoes={pecas.map((peca) => ({ valor: peca.id, rotulo: peca.descricao }))}
            valor={pecaId}
            onMudar={aoMudarPeca}
            opcaoVazia="Selecione a peça"
            placeholder="Selecione a peça"
          />
        ) : (
          <Combobox
            className="flex-1"
            opcoes={servicos.map((servico) => ({ valor: servico.id, rotulo: servico.descricao }))}
            valor={servicoId}
            onMudar={aoMudarServico}
            opcaoVazia="Serviço avulso (digitar abaixo)"
            placeholder="Serviço avulso (digitar abaixo)"
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

      {servicoEhAvulso && (
        <input
          type="text"
          placeholder="Descrição do serviço"
          {...register(`itens.${index}.descricao`)}
          className="w-full rounded-lg border border-sakura-gray/40 px-2 py-1.5 text-sm"
        />
      )}

      <div className="flex gap-2">
        <label className="flex flex-1 flex-col gap-0.5 text-xs text-sakura-purple-dark/90">
          Quantidade
          <input
            type="number"
            min="0.01"
            step="0.01"
            {...register(`itens.${index}.quantidade`)}
            className="rounded-lg border border-sakura-gray/40 px-2 py-1.5 text-sm text-sakura-purple-dark"
          />
        </label>

        <label className="flex flex-1 flex-col gap-0.5 text-xs text-sakura-purple-dark/90">
          Preço unitário
          <input
            type="number"
            min="0"
            step="0.01"
            {...register(`itens.${index}.preco_unitario`)}
            className="rounded-lg border border-sakura-gray/40 px-2 py-1.5 text-sm text-sakura-purple-dark"
          />
        </label>

        <label className="flex flex-1 flex-col gap-0.5 text-xs text-sakura-purple-dark/90">
          Desconto
          <input
            type="number"
            min="0"
            step="0.01"
            {...register(`itens.${index}.desconto`)}
            className="rounded-lg border border-sakura-gray/40 px-2 py-1.5 text-sm text-sakura-purple-dark"
          />
        </label>

        <label className="flex flex-1 flex-col gap-0.5 text-xs text-sakura-purple-dark/90">
          Técnico
          <Combobox
            opcoes={funcionarios.map((funcionario) => ({
              valor: funcionario.id,
              rotulo: funcionario.nome,
            }))}
            valor={watch(`itens.${index}.tecnico_id`)}
            onMudar={(v) => setValue(`itens.${index}.tecnico_id`, v)}
            opcaoVazia="Sem técnico definido"
            placeholder="Sem técnico definido"
          />
        </label>
      </div>
    </div>
  );
}
