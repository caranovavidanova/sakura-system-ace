import type { Control, UseFormRegister } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { type ClienteFormValues, veiculoFormVazio } from "@/schemas/cliente";
import { TIPO_VEICULO_LABEL, type TipoVeiculo } from "@/types/cliente";
import { Campo, inputClasse, Secao } from "./FormCompartilhado";

export function VeiculosFields({
  control,
  register,
}: {
  control: Control<ClienteFormValues>;
  register: UseFormRegister<ClienteFormValues>;
}) {
  const { fields, append, remove } = useFieldArray({ control, name: "veiculos" });

  return (
    <Secao titulo="Veículos">
      <div className="space-y-4">
        {fields.map((campo, index) => {
          const placa = register(`veiculos.${index}.placa`);
          return (
            <div key={campo.id} className="relative rounded-xl border border-sakura-gray/30 p-4">
              {fields.length > 1 && (
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-medium text-sakura-muted">Veículo {index + 1}</p>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-xs font-medium text-red-600 hover:underline"
                  >
                    Remover
                  </button>
                </div>
              )}
              <input type="hidden" {...register(`veiculos.${index}.id`)} />
              <div className="grid grid-cols-3 gap-4">
                <Campo label="Placa">
                  <input
                    type="text"
                    {...placa}
                    onChange={(e) => {
                      e.target.value = e.target.value.toUpperCase();
                      placa.onChange(e);
                    }}
                    className={inputClasse}
                  />
                </Campo>
                <Campo label="Marca">
                  <input
                    type="text"
                    {...register(`veiculos.${index}.marca`)}
                    className={inputClasse}
                  />
                </Campo>
                <Campo label="Modelo">
                  <input
                    type="text"
                    {...register(`veiculos.${index}.modelo`)}
                    className={inputClasse}
                  />
                </Campo>
                <Campo label="Ano">
                  <input
                    type="number"
                    {...register(`veiculos.${index}.ano`)}
                    className={inputClasse}
                  />
                </Campo>
                <Campo label="Cor">
                  <input
                    type="text"
                    {...register(`veiculos.${index}.cor`)}
                    className={inputClasse}
                  />
                </Campo>
                <Campo label="KM atual">
                  <input
                    type="number"
                    {...register(`veiculos.${index}.km_atual`)}
                    className={inputClasse}
                  />
                </Campo>
                <Campo label="Tipo">
                  <select {...register(`veiculos.${index}.tipo`)} className={inputClasse}>
                    <option value="">Selecione...</option>
                    {(Object.keys(TIPO_VEICULO_LABEL) as TipoVeiculo[]).map((chave) => (
                      <option key={chave} value={chave}>
                        {TIPO_VEICULO_LABEL[chave]}
                      </option>
                    ))}
                  </select>
                </Campo>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => append({ ...veiculoFormVazio })}
        className="mt-4 text-xs font-medium text-sakura-purple hover:underline"
      >
        + Adicionar veículo
      </button>
    </Secao>
  );
}
