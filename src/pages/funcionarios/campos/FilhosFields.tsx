import type { Control, UseFormRegister } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import type { FuncionarioFormValues } from "@/schemas/funcionario";
import { Campo, inputClasse, Secao } from "./FormCompartilhado";

export function FilhosFields({
  control,
  register,
}: {
  control: Control<FuncionarioFormValues>;
  register: UseFormRegister<FuncionarioFormValues>;
}) {
  const { fields, append, remove } = useFieldArray({ control, name: "filhos" });

  return (
    <Secao titulo="Filhos">
      <div className="space-y-3">
        {fields.map((campo, index) => (
          <div key={campo.id} className="flex items-end gap-3">
            <Campo label="Nome do filho(a)" className="flex-1">
              <input
                type="text"
                {...register(`filhos.${index}.nome`)}
                className={inputClasse}
              />
            </Campo>
            <Campo label="Nascimento">
              <input
                type="date"
                {...register(`filhos.${index}.data_nascimento`)}
                className={inputClasse}
              />
            </Campo>
            <button
              type="button"
              onClick={() => remove(index)}
              className="mb-1 text-xs font-medium text-red-600 hover:underline"
            >
              Remover
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => append({ nome: "", data_nascimento: "" })}
          className="text-sm font-medium text-sakura-purple hover:underline"
        >
          + Adicionar filho(a)
        </button>
      </div>
    </Secao>
  );
}
