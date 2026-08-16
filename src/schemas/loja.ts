import { z } from "zod";
import type { Loja, NovaLoja } from "@/types/loja";

export const lojaFormSchema = z.object({
  nome: z.string().trim().min(1, "Nome é obrigatório."),
  cidade: z.string(),
  uf: z.string(),
});

export type LojaFormValues = z.infer<typeof lojaFormSchema>;

export const lojaFormVazio: LojaFormValues = { nome: "", cidade: "", uf: "" };

export function paraValoresFormulario(loja: Loja): LojaFormValues {
  return { nome: loja.nome, cidade: loja.cidade ?? "", uf: loja.uf ?? "" };
}

export function paraNovaLoja(valores: LojaFormValues): NovaLoja {
  return {
    nome: valores.nome.trim(),
    cidade: valores.cidade.trim() || null,
    uf: valores.uf.trim() || null,
    ativo: true,
  };
}

export function paraPatchLoja(
  valores: LojaFormValues,
): Pick<Loja, "nome" | "cidade" | "uf"> {
  return {
    nome: valores.nome.trim(),
    cidade: valores.cidade.trim() || null,
    uf: valores.uf.trim() || null,
  };
}
