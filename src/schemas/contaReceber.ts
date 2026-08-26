import { z } from "zod";
import type { NovaContaReceber } from "@/types/contaReceber";

export const contaReceberFormSchema = z.object({
  cliente_id: z.string().min(1, "Escolha o cliente."),
  descricao: z.string().trim().min(1, "Descrição é obrigatória."),
  valor: z.string().refine((v) => Number(v) > 0, "Informe um valor maior que zero."),
  vencimento: z.string().min(1, "Previsão de recebimento é obrigatória."),
});

export type ContaReceberFormValues = z.infer<typeof contaReceberFormSchema>;

export const contaReceberFormVazio: ContaReceberFormValues = {
  cliente_id: "",
  descricao: "",
  valor: "",
  vencimento: "",
};

export function paraNovaContaReceber(valores: ContaReceberFormValues): NovaContaReceber {
  return {
    cliente_id: valores.cliente_id,
    // Conta lançada à mão não nasce de OS nenhuma. A tabela tem uma restrição
    // de "uma conta por OS", mas ela não atrapalha aqui: o Postgres não
    // considera dois nulos como repetidos, então dá pra ter quantas contas
    // avulsas forem precisas.
    ordem_servico_id: null,
    descricao: valores.descricao.trim(),
    valor: Number(valores.valor),
    vencimento: valores.vencimento,
  };
}
