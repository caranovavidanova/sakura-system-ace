import type { Control, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { itemFormVazio, totalItensFormulario, type OrdemServicoFormValues } from "@/schemas/ordemServico";
import type { Funcionario } from "@/types/funcionario";
import type { ItemOS, PatchItemOS } from "@/types/os";
import { totalOrdem } from "@/types/os";
import type { Peca } from "@/types/peca";
import type { Servico } from "@/types/servico";
import { ItemExistenteRow } from "../ItemExistenteRow";
import { ItemOSRow } from "../ItemOSRow";

export function ItensFields({
  control,
  register,
  watch,
  setValue,
  itensExistentes,
  ehEdicao,
  podeAdicionarItem,
  podeEditarItem,
  avisoItens,
  onEditarItem,
  pecas,
  servicos,
  funcionarios,
}: {
  control: Control<OrdemServicoFormValues>;
  register: UseFormRegister<OrdemServicoFormValues>;
  watch: UseFormWatch<OrdemServicoFormValues>;
  setValue: UseFormSetValue<OrdemServicoFormValues>;
  itensExistentes: ItemOS[];
  ehEdicao: boolean;
  podeAdicionarItem: boolean;
  podeEditarItem: boolean;
  avisoItens: string | null;
  onEditarItem: (item: ItemOS, patch: PatchItemOS) => Promise<void>;
  pecas: Peca[];
  servicos: Servico[];
  funcionarios: Funcionario[];
}) {
  const { fields, append, remove } = useFieldArray({ control, name: "itens" });
  const itensAssistidos = watch("itens");
  const totalGeral = totalOrdem(itensExistentes) + totalItensFormulario(itensAssistidos);

  return (
    <section>
      <h3 className="mb-3 text-corpo font-semibold text-sakura-purple-dark">Peças e serviços</h3>

      {avisoItens && <p className="mb-3 text-rotulo text-sakura-muted">{avisoItens}</p>}

      {itensExistentes.length > 0 && (
        <div className="mb-3 space-y-1.5 rounded-lg bg-sakura-gray/5 p-3">
          <p className="mb-1 text-rotulo font-medium text-sakura-purple-dark/85">Já lançados nesta OS</p>
          {itensExistentes.map((item) => (
            <ItemExistenteRow
              key={item.id}
              item={item}
              podeEditar={podeEditarItem}
              pecas={pecas}
              servicos={servicos}
              funcionarios={funcionarios}
              onSalvar={onEditarItem}
            />
          ))}
        </div>
      )}

      <div className="space-y-2">
        {fields.map((campo, index) => (
          <ItemOSRow
            key={campo.id}
            index={index}
            register={register}
            watch={watch}
            setValue={setValue}
            pecas={pecas}
            servicos={servicos}
            funcionarios={funcionarios}
            onRemover={() => remove(index)}
          />
        ))}
        {fields.length === 0 && (
          <p className="text-rotulo text-sakura-muted">
            Nenhum item novo — use "+ adicionar item" pra lançar mais peças ou serviços.
          </p>
        )}
      </div>

      {/* O botão fica embaixo, colado no último item: com a OS cheia de peça,
          subir a tela toda pra adicionar mais uma era o que atrapalhava. */}
      {podeAdicionarItem && (
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={() => append({ ...itemFormVazio })}
            className="rounded-lg border border-sakura-purple/40 px-3 py-1.5 text-rotulo font-medium text-sakura-purple hover:bg-sakura-purple/10"
          >
            + adicionar item
          </button>
        </div>
      )}

      <p className="mt-3 text-right text-corpo font-semibold text-sakura-purple-dark">
        Total {ehEdicao ? "geral" : "previsto"}:{" "}
        {totalGeral.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
      </p>
    </section>
  );
}
