import { supabase } from "./supabase";

export interface ItemGarantia {
  id: string;
  quantidade: number;
  peca: { descricao: string; prazo_garantia_dias: number | null } | null;
  ordem: {
    id: string;
    data_fechamento: string | null;
    cliente: { nome: string } | null;
    veiculo: { placa: string } | null;
  } | null;
}

// Garantia dada ao cliente na venda — não é uma tabela própria, é calculada
// a partir do item de peça vendido numa OS (data_fechamento + o prazo de
// garantia cadastrado na peça). Ver PROJETO_STATUS.md.
export async function listarItensComGarantia(): Promise<ItemGarantia[]> {
  const { data, error } = await supabase
    .from("ordens_servico_itens")
    .select(
      "id, quantidade, peca:pecas(descricao, prazo_garantia_dias), " +
        "ordem:ordens_servico(id, data_fechamento, cliente:clientes(nome), veiculo:veiculos(placa))",
    )
    .eq("tipo", "peca");

  if (error) throw error;

  const itens = data as unknown as ItemGarantia[];
  return itens.filter(
    (item) => item.peca?.prazo_garantia_dias != null && item.ordem?.data_fechamento != null,
  );
}
