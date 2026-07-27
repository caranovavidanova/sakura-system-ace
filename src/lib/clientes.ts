import { supabase } from "./supabase";
import type { Cliente, NovoCliente, NovoVeiculo, Veiculo } from "@/types/cliente";

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

export async function excluirCliente(id: string): Promise<void> {
  const { error } = await supabase.from("clientes").delete().eq("id", id);
  if (error) throw error;
}

export type { Veiculo };
