import type { UseFormRegister } from "react-hook-form";
import type { FuncionarioFormValues } from "@/schemas/funcionario";
import { Campo, inputClasse, Secao } from "./FormCompartilhado";

export function ConjugeFields({
  register,
}: {
  register: UseFormRegister<FuncionarioFormValues>;
}) {
  return (
    <Secao titulo="Cônjuge">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Campo label="Nome do cônjuge" className="md:col-span-2">
          <input type="text" {...register("conjuge_nome")} className={inputClasse} />
        </Campo>
        <Campo label="Nascimento">
          <input type="date" {...register("conjuge_nascimento")} className={inputClasse} />
        </Campo>
        <Campo label="Data do casamento">
          <input type="date" {...register("data_casamento")} className={inputClasse} />
        </Campo>
        <Campo label="Telefone">
          <input type="text" {...register("conjuge_telefone")} className={inputClasse} />
        </Campo>
        <Campo label="Celular">
          <input type="text" {...register("conjuge_celular")} className={inputClasse} />
        </Campo>
      </div>
    </Secao>
  );
}
