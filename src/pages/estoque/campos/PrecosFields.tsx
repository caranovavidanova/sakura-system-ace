import type { UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { margemAPartirDoPreco, precoAPartirDaMargem, type PecaFormValues } from "@/schemas/peca";
import { Campo, inputClasse, Secao } from "./FormCompartilhado";

export function PrecosFields({
  register,
  watch,
  setValue,
  editando = false,
}: {
  register: UseFormRegister<PecaFormValues>;
  watch: UseFormWatch<PecaFormValues>;
  setValue: UseFormSetValue<PecaFormValues>;
  editando?: boolean;
}) {
  const custo = register("preco_custo");
  const margem = register("margem");
  const precoVenda = register("preco_venda");

  return (
    <Secao titulo="Preços">
      <div className="grid grid-cols-2 gap-4">
        <Campo label="Aquisição (custo)">
          <input
            type="number"
            step="0.01"
            {...custo}
            onChange={(e) => {
              custo.onChange(e);
              const novoPreco = precoAPartirDaMargem(e.target.value, watch("margem"));
              if (novoPreco !== null) setValue("preco_venda", novoPreco);
            }}
            className={inputClasse}
          />
        </Campo>
        <Campo label="Margem %">
          <input
            type="number"
            step="0.1"
            {...margem}
            onChange={(e) => {
              margem.onChange(e);
              const novoPreco = precoAPartirDaMargem(watch("preco_custo"), e.target.value);
              if (novoPreco !== null) setValue("preco_venda", novoPreco);
            }}
            className={inputClasse}
          />
        </Campo>
        <Campo label="Preço final">
          <input
            type="number"
            step="0.01"
            {...precoVenda}
            onChange={(e) => {
              precoVenda.onChange(e);
              setValue("margem", margemAPartirDoPreco(watch("preco_custo"), e.target.value));
            }}
            className={inputClasse}
          />
        </Campo>
        {!editando && (
          <Campo label="Qtde. estoque inicial">
            <input
              type="number"
              step="0.01"
              {...register("quantidade_inicial")}
              className={inputClasse}
            />
          </Campo>
        )}
      </div>
    </Secao>
  );
}
