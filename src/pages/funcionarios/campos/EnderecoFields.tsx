import type { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { buscarEnderecoPorCep } from "@/lib/viaCep";
import type { FuncionarioFormValues } from "@/schemas/funcionario";
import { Campo, inputClasse, Secao } from "./FormCompartilhado";

export function EnderecoFields({
  register,
  setValue,
}: {
  register: UseFormRegister<FuncionarioFormValues>;
  setValue: UseFormSetValue<FuncionarioFormValues>;
}) {
  const estado = register("estado");
  const cep = register("cep");

  async function aoSairDoCep(valor: string) {
    const endereco = await buscarEnderecoPorCep(valor);
    if (!endereco) return;
    setValue("endereco", endereco.logradouro);
    setValue("bairro", endereco.bairro);
    setValue("cidade", endereco.localidade);
    setValue("estado", endereco.uf);
  }

  return (
    <Secao titulo="Endereço">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Campo label="CEP">
          <input
            type="text"
            {...cep}
            onBlur={(e) => {
              cep.onBlur(e);
              aoSairDoCep(e.target.value);
            }}
            className={inputClasse}
          />
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
