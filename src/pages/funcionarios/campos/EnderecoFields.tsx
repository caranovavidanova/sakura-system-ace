import type { UseFormRegister } from "react-hook-form";
import type { FuncionarioFormValues } from "@/schemas/funcionario";
import { Campo, inputClasse, Secao } from "./FormCompartilhado";

export function EnderecoFields({
  register,
}: {
  register: UseFormRegister<FuncionarioFormValues>;
}) {
  const estado = register("estado");

  return (
    <Secao titulo="Endereço">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Campo label="CEP">
          <input type="text" {...register("cep")} className={inputClasse} />
        </Campo>
        <Campo label="Endereço" className="md:col-span-2">
          <input type="text" {...register("endereco")} className={inputClasse} />
        </Campo>
        <Campo label="Número">
          <input type="text" {...register("numero")} className={inputClasse} />
        </Campo>
        <Campo label="Bairro">
          <input type="text" {...register("bairro")} className={inputClasse} />
        </Campo>
        <Campo label="Cidade">
          <input type="text" {...register("cidade")} className={inputClasse} />
        </Campo>
        <Campo label="Estado">
          <input
            type="text"
            maxLength={2}
            {...estado}
            onChange={(e) => {
              e.target.value = e.target.value.toUpperCase();
              estado.onChange(e);
            }}
            className={inputClasse}
          />
        </Campo>
        <Campo label="Complemento">
          <input type="text" {...register("complemento")} className={inputClasse} />
        </Campo>
      </div>
    </Secao>
  );
}
