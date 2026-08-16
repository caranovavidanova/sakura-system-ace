import { z } from "zod";
import type { NovoMovimentoCaixa } from "@/types/caixa";

export const caixaFormSchema = z.object({
  tipo: z.enum(["entrada", "saida"]),
  categoria_id: z.string(),
  valor: z.string().refine((v) => Number(v) > 0, "Informe um valor maior que zero."),
  forma_pagamento: z.string(),
  descricao: z.string(),
});

export type CaixaFormValues = z.infer<typeof caixaFormSchema>;

export function caixaFormVazio(tipoInicial: "entrada" | "saida"): CaixaFormValues {
  return {
    tipo: tipoInicial,
    categoria_id: "",
    valor: "",
    forma_pagamento: "dinheiro",
    descricao: "",
  };
}

export function paraNovoMovimentoCaixa(valores: CaixaFormValues): NovoMovimentoCaixa {
  return {
    ordem_servico_id: null,
    tipo: valores.tipo,
    forma_pagamento: valores.forma_pagamento || null,
    valor: Number(valores.valor),
    descricao: valores.descricao.trim() || null,
    categoria_id: valores.categoria_id || null,
  };
}
