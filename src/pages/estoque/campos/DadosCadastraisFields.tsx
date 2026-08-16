import type { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { Combobox } from "@/components/Combobox";
import type { PecaFormValues } from "@/schemas/peca";
import type { Categoria } from "@/types/categoria";
import { Campo, inputClasse, Secao } from "./FormCompartilhado";

export function DadosCadastraisFields({
  register,
  watch,
  setValue,
  errors,
  categorias,
}: {
  register: UseFormRegister<PecaFormValues>;
  watch: UseFormWatch<PecaFormValues>;
  setValue: UseFormSetValue<PecaFormValues>;
  errors: FieldErrors<PecaFormValues>;
  categorias: Categoria[];
}) {
  const unidade = register("unidade");

  return (
    <Secao titulo="Dados cadastrais">
      <div className="grid grid-cols-2 gap-4">
        <Campo label="Descrição" obrigatorio erro={errors.descricao?.message}>
          <input type="text" {...register("descricao")} className={inputClasse} />
        </Campo>
        <Campo label="Código de barras">
          <input type="text" {...register("codigo_barras")} className={inputClasse} />
        </Campo>
        <Campo label="Referência">
          <input type="text" {...register("codigo_interno")} className={inputClasse} />
        </Campo>
        <Campo label="Marca">
          <input type="text" {...register("marca")} className={inputClasse} />
        </Campo>
        <Campo label="Modelo">
          <input type="text" {...register("modelo")} className={inputClasse} />
        </Campo>
        <Campo label="Unidade (UN, PC, KG...)" obrigatorio erro={errors.unidade?.message}>
          <input
            type="text"
            {...unidade}
            onChange={(e) => {
              e.target.value = e.target.value.toUpperCase();
              unidade.onChange(e);
            }}
            className={inputClasse}
          />
        </Campo>
        <Campo label="Categoria">
          <Combobox
            opcoes={categorias.map((categoria) => ({ valor: categoria.id, rotulo: categoria.nome }))}
            valor={watch("categoria_id")}
            onMudar={(v) => setValue("categoria_id", v)}
            opcaoVazia="Sem categoria"
            placeholder="Sem categoria"
          />
        </Campo>
        <Campo label="Garantia (dias, opcional)">
          <input
            type="number"
            step="1"
            {...register("prazo_garantia_dias")}
            className={inputClasse}
          />
        </Campo>
      </div>
      <Campo label="Aplicação" className="mt-4">
        <textarea rows={2} {...register("aplicacao")} className={inputClasse} />
      </Campo>
    </Secao>
  );
}
