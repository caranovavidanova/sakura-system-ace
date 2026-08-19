import { z } from "zod";
import type { NovaContaPagar } from "@/types/contaPagar";

export const contaPagarFormSchema = z.object({
  descricao: z.string().trim().min(1, "Descrição é obrigatória."),
  valor: z.string().refine((v) => Number(v) > 0, "Informe um valor maior que zero."),
  vencimento: z.string().min(1, "Vencimento é obrigatório."),
  categoria_id: z.string(),
  recorrente: z.boolean(),
  recorrente_ate: z.string(),
});

export type ContaPagarFormValues = z.infer<typeof contaPagarFormSchema>;

export const contaPagarFormVazio: ContaPagarFormValues = {
  descricao: "",
  valor: "",
  vencimento: "",
  categoria_id: "",
  recorrente: false,
  recorrente_ate: "",
};

export function paraNovaContaPagar(valores: ContaPagarFormValues): NovaContaPagar {
  return {
    descricao: valores.descricao.trim(),
    valor: Number(valores.valor),
    vencimento: valores.vencimento,
    categoria_id: valores.categoria_id || null,
    recorrente: valores.recorrente,
    // Só faz sentido salvar o "até quando" se a conta for de fato recorrente
    // — evita ficar um valor esquecido caso o operador preencha e depois
    // desmarque "Conta mensal recorrente" sem limpar o campo.
    recorrente_ate: valores.recorrente ? valores.recorrente_ate || null : null,
  };
}
