import { z } from "zod";
import type { NovaContaPagar } from "@/types/contaPagar";

export const contaPagarFormSchema = z.object({
  descricao: z.string().trim().min(1, "Descrição é obrigatória."),
  valor: z.string().refine((v) => Number(v) > 0, "Informe um valor maior que zero."),
  vencimento: z.string().min(1, "Vencimento é obrigatório."),
  categoria_id: z.string(),
  recorrente: z.boolean(),
});

export type ContaPagarFormValues = z.infer<typeof contaPagarFormSchema>;

export const contaPagarFormVazio: ContaPagarFormValues = {
  descricao: "",
  valor: "",
  vencimento: "",
  categoria_id: "",
  recorrente: false,
};

export function paraNovaContaPagar(valores: ContaPagarFormValues): NovaContaPagar {
  return {
    descricao: valores.descricao.trim(),
    valor: Number(valores.valor),
    vencimento: valores.vencimento,
    categoria_id: valores.categoria_id || null,
    recorrente: valores.recorrente,
  };
}
