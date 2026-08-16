import { z } from "zod";
import type { Fornecedor, NovoFornecedor } from "@/types/fornecedor";

export const fornecedorFormSchema = z.object({
  nome: z.string().trim().min(1, "Nome é obrigatório."),
  cnpj: z.string(),
  telefone: z.string(),
  email: z.string(),
  cep: z.string(),
  rua: z.string(),
  numero: z.string(),
  bairro: z.string(),
  cidade: z.string(),
  uf: z.string(),
});

export type FornecedorFormValues = z.infer<typeof fornecedorFormSchema>;

export function paraValoresFormulario(fornecedor?: Fornecedor): FornecedorFormValues {
  return {
    nome: fornecedor?.nome ?? "",
    cnpj: fornecedor?.cnpj ?? "",
    telefone: fornecedor?.telefone ?? "",
    email: fornecedor?.email ?? "",
    cep: fornecedor?.cep ?? "",
    rua: fornecedor?.rua ?? "",
    numero: fornecedor?.numero ?? "",
    bairro: fornecedor?.bairro ?? "",
    cidade: fornecedor?.cidade ?? "",
    uf: fornecedor?.uf ?? "",
  };
}

const paraTextoOuNulo = (valor: string) => (valor.trim() === "" ? null : valor.trim());

export function paraNovoFornecedor(valores: FornecedorFormValues): NovoFornecedor {
  return {
    nome: valores.nome.trim(),
    cnpj: paraTextoOuNulo(valores.cnpj),
    telefone: paraTextoOuNulo(valores.telefone),
    email: paraTextoOuNulo(valores.email),
    cep: paraTextoOuNulo(valores.cep),
    rua: paraTextoOuNulo(valores.rua),
    numero: paraTextoOuNulo(valores.numero),
    bairro: paraTextoOuNulo(valores.bairro),
    cidade: paraTextoOuNulo(valores.cidade),
    uf: paraTextoOuNulo(valores.uf),
    ativo: true,
  };
}
