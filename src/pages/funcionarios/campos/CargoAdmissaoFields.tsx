import type { UseFormRegister } from "react-hook-form";
import type { FuncionarioFormValues } from "@/schemas/funcionario";
import { Campo, inputClasse, Secao } from "./FormCompartilhado";

export function CargoAdmissaoFields({
  register,
}: {
  register: UseFormRegister<FuncionarioFormValues>;
}) {
  return (
    <Secao titulo="Cargo e admissão">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Campo label="PIS">
          <input type="text" {...register("pis")} className={inputClasse} />
        </Campo>
        <Campo label="Código de registro">
          <input type="text" {...register("codigo_registro")} className={inputClasse} />
        </Campo>
        <Campo label="CBO">
          <input type="text" {...register("cbo")} className={inputClasse} />
        </Campo>
        <Campo label="Admissão">
          <input type="date" {...register("admissao")} className={inputClasse} />
        </Campo>
        <Campo label="Salário">
          <input
            type="number"
            step="0.01"
            min="0"
            {...register("salario")}
            className={inputClasse}
          />
        </Campo>
        <Campo label="Comissão (%)">
          <input
            type="number"
            step="0.01"
            min="0"
            {...register("comissao")}
            className={inputClasse}
          />
        </Campo>
        <Campo label="Data de férias">
          <input type="date" {...register("data_ferias")} className={inputClasse} />
        </Campo>
      </div>
    </Secao>
  );
}
