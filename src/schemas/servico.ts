import { z } from "zod";
import type { NovoServico, Servico } from "@/types/servico";

export const servicoFormSchema = z.object({
  codigo_interno: z.string(),
  descricao: z.string().trim().min(1, "Descrição é obrigatória."),
  preco_padrao: z.string(),
  custo: z.string(),
  categoria_id: z.string(),
});

export type ServicoFormValues = z.infer<typeof servicoFormSchema>;

export function paraValoresFormulario(servico?: Servico): ServicoFormValues {
  return {
    codigo_interno: servico?.codigo_interno ?? "",
    descricao: servico?.descricao ?? "",
    preco_padrao: servico?.preco_padrao?.toString() ?? "",
    custo: servico?.custo?.toString() ?? "",
    categoria_id: servico?.categoria_id ?? "",
  };
}

const paraNumeroOuNulo = (valor: string) => (valor.trim() === "" ? null : Number(valor));

// `ativo` não tem campo nenhum neste formulário (é alternado pela lista, ver
// ServicosPage) — precisa ser repassado de fora pra não resetar um serviço
// inativo pra ativo só por editar outro campo dele.
export function paraNovoServico(valores: ServicoFormValues, ativoAtual: boolean): NovoServico {
  return {
    codigo_interno: valores.codigo_interno.trim() || null,
    descricao: valores.descricao.trim(),
    preco_padrao: paraNumeroOuNulo(valores.preco_padrao),
    custo: paraNumeroOuNulo(valores.custo),
    categoria_id: valores.categoria_id || null,
    ativo: ativoAtual,
  };
}
