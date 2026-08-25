import { z } from "zod";
import type { NovaPeca, Peca } from "@/types/peca";

// Mesma ideia dos outros schemas: formulário trabalha só com strings (mesmo
// pros campos number | null no banco) — a conversão pra NovaPeca acontece só
// na borda, em paraNovaPeca(). "margem" e "quantidade_inicial" só existem no
// formulário, não fazem parte de NovaPeca (margem é derivada, quantidade
// inicial vira um movimento de estoque à parte — ver paraQuantidadeInicial).
export const pecaFormSchema = z.object({
  descricao: z.string().trim().min(1, "Descrição é obrigatória"),
  codigo_barras: z.string(),
  codigo_interno: z.string(),
  marca: z.string(),
  modelo: z.string(),
  unidade: z.string().trim().min(1, "Unidade é obrigatória"),
  categoria_id: z.string(),
  prazo_garantia_dias: z.string(),
  aplicacao: z.string(),
  ncm: z.string().trim().min(1, "NCM é obrigatório"),
  cest: z.string().trim().min(1, "C.E.S.T é obrigatório"),
  cfop_padrao: z.string().trim().min(1, "CFOP padrão é obrigatório"),
  origem: z.string().min(1, "Origem é obrigatória"),
  cst_ou_csosn: z.string().trim().min(1, "CST/CSOSN é obrigatório"),
  aliquota_icms: z.string(),
  preco_custo: z.string(),
  margem: z.string(),
  preco_venda: z.string(),
  quantidade_inicial: z.string(),
});

export type PecaFormValues = z.infer<typeof pecaFormSchema>;

export const pecaFormVazio: PecaFormValues = {
  descricao: "",
  codigo_barras: "",
  codigo_interno: "",
  marca: "",
  modelo: "",
  unidade: "UN",
  categoria_id: "",
  prazo_garantia_dias: "",
  aplicacao: "",
  ncm: "",
  cest: "",
  cfop_padrao: "",
  origem: "",
  cst_ou_csosn: "",
  aliquota_icms: "",
  preco_custo: "",
  margem: "",
  preco_venda: "",
  quantidade_inicial: "",
};

export function paraValoresFormulario(peca?: Peca): PecaFormValues {
  if (!peca) return pecaFormVazio;
  return {
    descricao: peca.descricao,
    codigo_barras: peca.codigo_barras ?? "",
    codigo_interno: peca.codigo_interno ?? "",
    marca: peca.marca ?? "",
    modelo: peca.modelo ?? "",
    unidade: peca.unidade ?? "UN",
    categoria_id: peca.categoria_id ?? "",
    prazo_garantia_dias: peca.prazo_garantia_dias?.toString() ?? "",
    aplicacao: peca.aplicacao ?? "",
    ncm: peca.ncm ?? "",
    cest: peca.cest ?? "",
    cfop_padrao: peca.cfop_padrao ?? "",
    origem: peca.origem ?? "",
    cst_ou_csosn: peca.cst_ou_csosn ?? "",
    aliquota_icms: peca.aliquota_icms?.toString() ?? "",
    preco_custo: peca.preco_custo?.toString() ?? "",
    margem: margemAPartirDoPreco(
      peca.preco_custo?.toString() ?? "",
      peca.preco_venda?.toString() ?? "",
    ),
    preco_venda: peca.preco_venda?.toString() ?? "",
    quantidade_inicial: "",
  };
}

const paraTextoOuNulo = (valor: string) => (valor.trim() === "" ? null : valor.trim());
const paraNumeroOuNulo = (valor: string) => (valor.trim() === "" ? null : Number(valor));

export function paraNovaPeca(valores: PecaFormValues): NovaPeca {
  return {
    codigo_interno: paraTextoOuNulo(valores.codigo_interno),
    codigo_barras: paraTextoOuNulo(valores.codigo_barras),
    descricao: valores.descricao.trim(),
    marca: paraTextoOuNulo(valores.marca),
    modelo: paraTextoOuNulo(valores.modelo),
    aplicacao: paraTextoOuNulo(valores.aplicacao),
    unidade: valores.unidade.trim(),
    preco_custo: paraNumeroOuNulo(valores.preco_custo),
    preco_venda: paraNumeroOuNulo(valores.preco_venda),
    ncm: paraTextoOuNulo(valores.ncm),
    cest: paraTextoOuNulo(valores.cest),
    cfop_padrao: paraTextoOuNulo(valores.cfop_padrao),
    origem: paraTextoOuNulo(valores.origem),
    cst_ou_csosn: paraTextoOuNulo(valores.cst_ou_csosn),
    aliquota_icms: paraNumeroOuNulo(valores.aliquota_icms),
    categoria_id: valores.categoria_id || null,
    prazo_garantia_dias:
      valores.prazo_garantia_dias.trim() === ""
        ? null
        : Math.round(Number(valores.prazo_garantia_dias)),
    ativo: true,
  };
}

export function paraQuantidadeInicial(valores: PecaFormValues): number | null {
  return paraNumeroOuNulo(valores.quantidade_inicial);
}

// --- Cálculo reativo de preço (custo <-> margem % <-> preço final) ---
// Os três campos se atualizam entre si conforme qual deles a pessoa mexeu por
// último (ver PrecosFields.tsx). Retornar `null` significa "não mexe no outro
// campo" (dado insuficiente pra calcular ainda); retornar "" limpa o campo.

function arredondar(valor: number): number {
  return Math.round(valor * 100) / 100;
}

export function precoAPartirDaMargem(custo: string, margem: string): string | null {
  const custoNum = Number(custo);
  const margemNum = parseFloat(margem);
  if (custo.trim() === "" || Number.isNaN(custoNum) || Number.isNaN(margemNum)) return null;
  return arredondar(custoNum * (1 + margemNum / 100)).toString();
}

export function margemAPartirDoPreco(custo: string, precoVenda: string): string {
  const custoNum = Number(custo);
  const precoNum = Number(precoVenda);
  if (
    custo.trim() === "" ||
    Number.isNaN(custoNum) ||
    custoNum <= 0 ||
    precoVenda.trim() === "" ||
    Number.isNaN(precoNum)
  ) {
    return "";
  }
  const margem = ((precoNum - custoNum) / custoNum) * 100;
  return (Math.round(margem * 10) / 10).toString();
}
