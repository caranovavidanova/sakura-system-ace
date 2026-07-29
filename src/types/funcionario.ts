export interface Funcionario {
  id: string;
  nome: string;
  cargo: string | null;
  operador_id: string | null;
  ativo: boolean;
  criado_em: string;
  operador?: { usuario: string } | null;
}

export type NovoFuncionario = Pick<Funcionario, "nome" | "cargo">;
