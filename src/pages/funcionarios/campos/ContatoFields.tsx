import type { UseFormRegister } from "react-hook-form";
import type { FuncionarioFormValues } from "@/schemas/funcionario";
import { Campo, inputClasse, Secao } from "./FormCompartilhado";

export function ContatoFields({
  register,
}: {
  register: UseFormRegister<FuncionarioFormValues>;
}) {
  return (
    <Secao titulo="Contato">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <Campo label="Telefone">
          <input type="text" {...register("telefone")} className={inputClasse} />
        </Campo>
        <Campo label="Celular">
          <input type="text" {...register("celular")} className={inputClasse} />
        </Campo>
        <Campo label="E-mail">
          <input type="email" {...register("email")} className={inputClasse} />
        </Campo>
      </div>
    </Secao>
  );
}
