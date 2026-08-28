import type { Control, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { itemFormVazio, totalItensFormulario, type OrdemServicoFormValues } from "@/schemas/ordemServico";
import type { Funcionario } from "@/types/funcionario";
import type { ItemOS } from "@/types/os";
import { totalOrdem } from "@/types/os";
import type { Peca } from "@/types/peca";
import type { Servico } from "@/types/servico";
import { ItemOSRow } from "../ItemOSRow";

export function ItensFields({
  control,
  register,
  watch,
  setValue,
  itensExistentes,
  ehEdicao,
  podeAdicionarItem,
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
  pecas: Peca[];
  servicos: Servico[];
  funcionarios: Funcionario[];
}) {
  const { fields, append, remove } = useFieldArray({ control, name: "itens" });
  const itensAssistidos = watch("itens");
  const totalGeral = totalOrdem(itensExistentes) + totalItensFormulario(itensAssistidos);

  return (
    <section>
      <h3 className="mb-3 text-sm font-semibold text-sakura-purple-dark">Peças e serviços</h3>

      {!podeAdicionarItem && (
        <p className="mb-3 text-xs text-sakura-muted">
          Esta OS já foi faturada — pra acrescentar peça ou serviço, abra uma OS nova.
        </p>
      )}

      {itensExistentes.length > 0 && (
        <div className="mb-3 space-y-1.5 rounded-lg bg-sakura-gray/5 p-3">
          <p className="mb-1 text-xs font-medium text-sakura-purple-dark/85">Já lançados nesta OS</p>
          {itensExistentes.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between text-sm text-sakura-purple-dark/80"
            >
              <span>
                {item.tipo === "peca" ? "Peça" : "Serviço"} — {item.descricao} ({item.quantidade}x)
                {item.tecnico?.nome ? ` · técnico: ${item.tecnico.nome}` : ""}
              </span>
              <span>
                {(item.quantidade * item.preco_unitario - item.desconto).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>
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
          <p className="text-xs text-sakura-muted">
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
            className="rounded-lg border border-sakura-purple/40 px-3 py-1.5 text-xs font-medium text-sakura-purple hover:bg-sakura-purple/10"
          >
            + adicionar item
          </button>
        </div>
      )}

      <p className="mt-3 text-right text-sm font-semibold text-sakura-purple-dark">
        Total {ehEdicao ? "geral" : "previsto"}:{" "}
        {totalGeral.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
      </p>
    </section>
  );
}
