import type { UseFormRegister } from "react-hook-form";
import type { ClienteFormValues } from "@/schemas/cliente";
import { Campo, inputClasse, Secao } from "./FormCompartilhado";

export function EnderecoFields({
  register,
}: {
  register: UseFormRegister<ClienteFormValues>;
}) {
  const uf = register("uf");

  return (
    <Secao titulo="Endereço">
      <div className="grid grid-cols-3 gap-4">
        <Campo label="CEP">
          <input type="text" {...register("cep")} className={inputClasse} />
        </Campo>
        <Campo label="Rua">
          <input type="text" {...register("rua")} className={inputClasse} />
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
        <Campo label="UF">
          <input
            type="text"
            {...uf}
            onChange={(e) => {
              e.target.value = e.target.value.toUpperCase();
              uf.onChange(e);
            }}
            className={inputClasse}
          />
        </Campo>
      </div>
    </Secao>
  );
}
