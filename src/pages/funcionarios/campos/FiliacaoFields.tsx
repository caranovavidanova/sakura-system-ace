import type { UseFormRegister } from "react-hook-form";
import type { FuncionarioFormValues } from "@/schemas/funcionario";
import { Campo, inputClasse, Secao } from "./FormCompartilhado";

export function FiliacaoFields({
  register,
}: {
  register: UseFormRegister<FuncionarioFormValues>;
}) {
  return (
    <Secao titulo="Filiação">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Campo label="Pai">
          <input type="text" {...register("pai")} className={inputClasse} />
        </Campo>
        <Campo label="Mãe">
          <input type="text" {...register("mae")} className={inputClasse} />
        </Campo>
        <Campo label="Naturalidade">
          <input type="text" {...register("naturalidade")} className={inputClasse} />
        </Campo>
      </div>
    </Secao>
  );
}
