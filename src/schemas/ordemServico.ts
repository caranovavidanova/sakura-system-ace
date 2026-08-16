import { z } from "zod";
import type {
  NovaOrdemServico,
  NovoItemOS,
  OrdemServico,
  PatchOrdemServico,
} from "@/types/os";

// Mesma ideia dos outros schemas: formulário trabalha só com strings (mesmo
// pros campos number | null no banco) — a conversão pra NovaOrdemServico/
// PatchOrdemServico/NovoItemOS acontece só na borda. IDs opcionais (veiculo,
// peca, servico, tecnico, vendedor) usam string vazia como "nenhum" — mesma
// convenção do `categoria_id` em PecaForm — não `null`, pra registrar em
// selects sem precisar de sentinela especial.
const itemFormSchema = z.object({
  tipo: z.enum(["peca", "servico"]),
  peca_id: z.string(),
  servico_id: z.string(),
  tecnico_id: z.string(),
  descricao: z.string(),
  quantidade: z.string(),
  preco_unitario: z.string(),
  desconto: z.string(),
});

export const ordemServicoFormSchema = z.object({
  cliente_id: z.string().min(1, "Selecione um cliente."),
  veiculo_id: z.string(),
  km_entrada: z.string(),
  descricao_problema: z.string(),
  vendedor_id: z.string(),
  itens: z.array(itemFormSchema),
});

export type OrdemServicoFormValues = z.infer<typeof ordemServicoFormSchema>;
export type ItemFormValues = OrdemServicoFormValues["itens"][number];

export const itemFormVazio: ItemFormValues = {
  tipo: "peca",
  peca_id: "",
  servico_id: "",
  tecnico_id: "",
  descricao: "",
  quantidade: "1",
  preco_unitario: "",
  desconto: "",
};

export function paraValoresFormulario(
  ordemExistente: OrdemServico | undefined,
  funcionarioAtualId: string,
): OrdemServicoFormValues {
  return {
    cliente_id: ordemExistente?.cliente_id ?? "",
    veiculo_id: ordemExistente?.veiculo_id ?? "",
    km_entrada: ordemExistente?.km_entrada != null ? String(ordemExistente.km_entrada) : "",
    descricao_problema: ordemExistente?.descricao_problema ?? "",
    vendedor_id: ordemExistente?.vendedor_id ?? funcionarioAtualId,
    itens: ordemExistente ? [] : [itemFormVazio],
  };
}

export function paraCamposComuns(
  valores: OrdemServicoFormValues,
): NovaOrdemServico & PatchOrdemServico {
  return {
    cliente_id: valores.cliente_id,
    veiculo_id: valores.veiculo_id || null,
    km_entrada: valores.km_entrada.trim() === "" ? null : Number(valores.km_entrada),
    descricao_problema: valores.descricao_problema.trim() || null,
    vendedor_id: valores.vendedor_id || null,
  };
}

const paraNumero = (valor: string): number => {
  const numero = Number(valor);
  return Number.isNaN(numero) ? 0 : numero;
};

export function paraItensValidos(itens: ItemFormValues[]): NovoItemOS[] {
  return itens
    .filter((item) => item.descricao.trim() && paraNumero(item.quantidade) > 0)
    .map((item) => ({
      tipo: item.tipo,
      peca_id: item.peca_id || null,
      servico_id: item.servico_id || null,
      tecnico_id: item.tecnico_id || null,
      descricao: item.descricao,
      quantidade: paraNumero(item.quantidade),
      preco_unitario: paraNumero(item.preco_unitario),
      desconto: paraNumero(item.desconto),
    }));
}

export function totalItensFormulario(itens: ItemFormValues[]): number {
  return itens.reduce(
    (total, item) =>
      total + paraNumero(item.quantidade) * paraNumero(item.preco_unitario) - paraNumero(item.desconto),
    0,
  );
}

// Mesmo truque visual de antes: 0 mostra campo vazio (não "0" travado no
// meio da digitação) — só importa pro auto-preenchimento de preço ao
// escolher uma peça/serviço do catálogo.
export function paraDisplayNumero(valor: number): string {
  return valor ? valor.toString() : "";
}
