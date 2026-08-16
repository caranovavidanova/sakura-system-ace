import { z } from "zod";
import type { ModuloChave, NovoOperador, Operador } from "@/types/operador";

// A senha só é obrigatória (e com tamanho mínimo) ao criar — ao editar, o
// campo nem aparece no formulário. Por isso o schema é uma função, não um
// objeto fixo: `editando` muda a regra de validação da senha.
export function criarOperadorFormSchema(editando: boolean) {
  return z.object({
    usuario: z.string().trim().min(1, "Usuário é obrigatório."),
    nome: z.string().trim().min(1, "Nome é obrigatório."),
    senha: editando ? z.string() : z.string().min(6, "A senha precisa ter pelo menos 6 caracteres."),
    admin: z.boolean(),
    permissoes: z.array(z.string()),
    ativo: z.boolean(),
    lojaIds: z.array(z.string()),
  });
}

export type OperadorFormValues = z.infer<ReturnType<typeof criarOperadorFormSchema>>;

export function paraValoresFormulario(
  operador?: Operador,
  lojaIdsExistente?: string[],
): OperadorFormValues {
  return {
    usuario: operador?.usuario ?? "",
    nome: operador?.nome ?? "",
    senha: "",
    admin: operador?.admin ?? false,
    permissoes: operador?.permissoes ?? [],
    ativo: operador?.ativo ?? true,
    lojaIds: lojaIdsExistente ?? [],
  };
}

export function paraNovoOperador(valores: OperadorFormValues): NovoOperador {
  return {
    usuario: valores.usuario.trim().toLowerCase(),
    nome: valores.nome.trim(),
    admin: valores.admin,
    permissoes: valores.permissoes as ModuloChave[],
    ativo: valores.ativo,
  };
}
