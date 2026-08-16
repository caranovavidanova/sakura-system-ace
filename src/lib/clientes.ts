import { supabase } from "./supabase";
import type {
  Cliente,
  NovoCliente,
  NovoVeiculo,
  Veiculo,
  VeiculoFormulario,
} from "@/types/cliente";

export async function listarClientes(): Promise<Cliente[]> {
  const { data, error } = await supabase
    .from("clientes")
    .select("*, veiculos(*)")
    .order("nome", { ascending: true });

  if (error) throw error;
  return data as Cliente[];
}

export async function criarCliente(
  cliente: NovoCliente,
  veiculos: NovoVeiculo[],
): Promise<Cliente> {
  const { data: clienteCriado, error: erroCliente } = await supabase
    .from("clientes")
    .insert(cliente)
    .select()
    .single();

  if (erroCliente) throw erroCliente;

  if (veiculos.length > 0) {
    const { error: erroVeiculos } = await supabase.from("veiculos").insert(
      veiculos.map((veiculo) => ({ ...veiculo, cliente_id: clienteCriado.id })),
    );
    if (erroVeiculos) throw erroVeiculos;
  }

  return clienteCriado as Cliente;
}

export async function atualizarCliente(
  id: string,
  cliente: NovoCliente,
  veiculos: VeiculoFormulario[],
): Promise<void> {
  const { error: erroCliente } = await supabase
    .from("clientes")
    .update(cliente)
    .eq("id", id);
  if (erroCliente) throw erroCliente;

  const idsParaManter = veiculos
    .map((veiculo) => veiculo.id)
    .filter((veiculoId): veiculoId is string => Boolean(veiculoId));

  const exclusao = supabase.from("veiculos").delete().eq("cliente_id", id);
  const { error: erroExclusao } =
    idsParaManter.length > 0
      ? await exclusao.not("id", "in", `(${idsParaManter.join(",")})`)
      : await exclusao;
  if (erroExclusao) throw erroExclusao;

  if (veiculos.length > 0) {
    const { error: erroVeiculos } = await supabase
      .from("veiculos")
      .upsert(veiculos.map((veiculo) => ({ ...veiculo, cliente_id: id })));
    if (erroVeiculos) throw erroVeiculos;
  }
}

export async function excluirCliente(id: string): Promise<void> {
  const { error } = await supabase.from("clientes").delete().eq("id", id);
  if (error) throw error;
}

export async function buscarClientePorId(id: string): Promise<Cliente> {
  const { data, error } = await supabase.from("clientes").select("*").eq("id", id).single();
  if (error) throw error;
  return data as Cliente;
}

export async function buscarVeiculoPorId(id: string): Promise<Veiculo> {
  const { data, error } = await supabase.from("veiculos").select("*").eq("id", id).single();
  if (error) throw error;
  return data as Veiculo;
}

export type { Veiculo };
