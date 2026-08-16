import { z } from "zod";
import type { Deposito, NovoDeposito } from "@/types/deposito";

export const depositoFormSchema = z.object({
  nome: z.string().trim().min(1, "Nome é obrigatório."),
});

export type DepositoFormValues = z.infer<typeof depositoFormSchema>;

export const depositoFormVazio: DepositoFormValues = { nome: "" };

export function paraValoresFormulario(deposito: Deposito): DepositoFormValues {
  return { nome: deposito.nome };
}

export function paraNovoDeposito(valores: DepositoFormValues, lojaId: string): NovoDeposito {
  return { loja_id: lojaId, nome: valores.nome.trim(), ativo: true };
}

export function paraPatchDeposito(valores: DepositoFormValues): Pick<Deposito, "nome"> {
  return { nome: valores.nome.trim() };
}
