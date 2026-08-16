import { z } from "zod";
import type { NovoMovimentoEstoque } from "@/types/estoque";

export const movimentoFormSchema = z.object({
  peca_id: z.string().min(1, "Selecione uma peça."),
  deposito_id: z.string().min(1, "Selecione um depósito."),
  tipo: z.enum(["entrada", "saida"]),
  quantidade: z.string().refine((v) => Number(v) > 0, "Informe uma quantidade maior que zero."),
  motivo: z.enum(["compra", "venda", "ajuste", "uso_em_os"]),
  referencia: z.string(),
});

export type MovimentoFormValues = z.infer<typeof movimentoFormSchema>;

export function movimentoFormVazio(
  pecaIdInicial: string,
  depositoIdInicial: string,
): MovimentoFormValues {
  return {
    peca_id: pecaIdInicial,
    deposito_id: depositoIdInicial,
    tipo: "entrada",
    quantidade: "",
    motivo: "compra",
    referencia: "",
  };
}

export function paraNovoMovimentoEstoque(valores: MovimentoFormValues): NovoMovimentoEstoque {
  return {
    peca_id: valores.peca_id,
    deposito_id: valores.deposito_id,
    tipo: valores.tipo,
    quantidade: Number(valores.quantidade),
    motivo: valores.motivo,
    referencia: valores.referencia.trim() || null,
  };
}
