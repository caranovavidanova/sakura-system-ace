import { supabase } from "./supabase";
import type {
  Funcionario,
  FuncionarioPublico,
  NovoFuncionario,
  NovoFuncionarioFilho,
} from "@/types/funcionario";

const SELECT_FUNCIONARIO =
  "*, operador:operadores(usuario), filhos:funcionario_filhos(*)";

// A lista que as telas fora do módulo usam (seletor de técnico e de vendedor
// na OS). Vem da view `funcionarios_publico` (migration 0056), que entrega
// nome e cargo pra qualquer operador com acesso à loja — sem salário, CPF nem
// nada do resto. Ler a tabela base aqui devolveria ZERO linha pra quem não
// tem o módulo, e o seletor da OS chegaria vazio no balcão.
export async function listarFuncionariosPublico(
  lojaId: string,
): Promise<FuncionarioPublico[]> {
  const { data, error } = await supabase
    .from("funcionarios_publico")
    .select("id, loja_id, nome, cargo, operador_id, ativo")
    .eq("loja_id", lojaId)
    .order("nome", { ascending: true });

  if (error) throw error;
  return data as FuncionarioPublico[];
}

// O cadastro inteiro, pro módulo Funcionários. Exige a permissão no banco.
export async function listarFuncionarios(lojaId: string): Promise<Funcionario[]> {
  const { data, error } = await supabase
    .from("funcionarios")
    .select(SELECT_FUNCIONARIO)
    .eq("loja_id", lojaId)
    .order("nome", { ascending: true });

  if (error) throw error;
  return data as unknown as Funcionario[];
}

export async function criarFuncionario(
  funcionario: NovoFuncionario,
  lojaId: string,
  filhos: NovoFuncionarioFilho[] = [],
): Promise<Funcionario> {
  const { data, error } = await supabase
    .from("funcionarios")
    .insert({ ...funcionario, loja_id: lojaId })
    .select()
    .single();

  if (error) throw error;
  const criado = data as Funcionario;
  if (filhos.length > 0) {
    await sincronizarFilhos(criado.id, filhos);
  }
  return criado;
}

export async function atualizarFuncionario(
  id: string,
  patch: Partial<NovoFuncionario & { ativo: boolean }>,
  filhos?: NovoFuncionarioFilho[],
): Promise<void> {
  const { error } = await supabase.from("funcionarios").update(patch).eq("id", id);
  if (error) throw error;
  if (filhos) {
    await sincronizarFilhos(id, filhos);
  }
}

// Substitui a lista de filhos inteira — mais simples que calcular diff, e a
// tabela não tem nenhuma referência externa a funcionario_filhos.id.
async function sincronizarFilhos(
  funcionarioId: string,
  filhos: NovoFuncionarioFilho[],
): Promise<void> {
  const { error: erroExclusao } = await supabase
    .from("funcionario_filhos")
    .delete()
    .eq("funcionario_id", funcionarioId);
  if (erroExclusao) throw erroExclusao;

  if (filhos.length === 0) return;

  const { error: erroInsercao } = await supabase
    .from("funcionario_filhos")
    .insert(filhos.map((filho) => ({ ...filho, funcionario_id: funcionarioId })));
  if (erroInsercao) throw erroInsercao;
}
