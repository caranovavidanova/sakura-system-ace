import type { OrdemServico } from "@/types/os";

function formatarData(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR");
}

function formatarItens(ordem: OrdemServico): string {
  const itens = ordem.itens ?? [];
  if (itens.length === 0) return "—";
  return itens.map((item) => `- ${item.descricao} (${item.quantidade}x)`).join("\n");
}

export function montarTextoGarantia(template: string, ordem: OrdemServico): string {
  return template
    .replaceAll("{cliente}", ordem.cliente?.nome ?? "—")
    .replaceAll("{veiculo}", ordem.veiculo?.placa ?? "—")
    .replaceAll("{itens}", formatarItens(ordem))
    .replaceAll("{data}", formatarData(ordem.data_fechamento));
}
