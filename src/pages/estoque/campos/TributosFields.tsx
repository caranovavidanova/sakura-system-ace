import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { OPCOES_ORIGEM } from "@/lib/origemMercadoria";
import type { PecaFormValues } from "@/schemas/peca";
import { Campo, inputClasse, Secao } from "./FormCompartilhado";

export function TributosFields({
  register,
  errors,
}: {
  register: UseFormRegister<PecaFormValues>;
  errors: FieldErrors<PecaFormValues>;
}) {
  return (
    <Secao titulo="Tributos">
      <div className="grid grid-cols-2 gap-4">
        <Campo label="NCM" obrigatorio erro={errors.ncm?.message}>
          <input type="text" {...register("ncm")} className={inputClasse} />
        </Campo>
        <Campo label="C.E.S.T" obrigatorio erro={errors.cest?.message}>
          <input type="text" {...register("cest")} className={inputClasse} />
        </Campo>
        <Campo label="CFOP padrão" obrigatorio erro={errors.cfop_padrao?.message}>
          <input type="text" {...register("cfop_padrao")} className={inputClasse} />
        </Campo>
        <Campo label="Origem" obrigatorio erro={errors.origem?.message}>
          <select {...register("origem")} className={inputClasse}>
            <option value="" disabled>
              Selecione
            </option>
            {OPCOES_ORIGEM.map((opcao) => (
              <option key={opcao.valor} value={opcao.valor}>
                {opcao.label}
              </option>
            ))}
          </select>
        </Campo>
        <Campo label="CST / CSOSN" obrigatorio erro={errors.cst_ou_csosn?.message}>
          <input type="text" {...register("cst_ou_csosn")} className={inputClasse} />
        </Campo>
        <Campo label="Alíquota ICMS (%)">
          <input type="number" step="0.01" {...register("aliquota_icms")} className={inputClasse} />
        </Campo>
      </div>
    </Secao>
  );
}
