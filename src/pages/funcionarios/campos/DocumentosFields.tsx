import type { UseFormRegister } from "react-hook-form";
import type { FuncionarioFormValues } from "@/schemas/funcionario";
import { Campo, inputClasse, Secao } from "./FormCompartilhado";

export function DocumentosFields({
  register,
}: {
  register: UseFormRegister<FuncionarioFormValues>;
}) {
  return (
    <Secao titulo="Documentos">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Campo label="CPF">
          <input type="text" {...register("cpf")} className={inputClasse} />
        </Campo>
        <Campo label="RG">
          <input type="text" {...register("rg")} className={inputClasse} />
        </Campo>
        <Campo label="CNH categoria">
          <input type="text" {...register("cnh_categoria")} className={inputClasse} />
        </Campo>
        <Campo label="Nº CNH">
          <input type="text" {...register("cnh_numero")} className={inputClasse} />
        </Campo>
      </div>
    </Secao>
  );
}
