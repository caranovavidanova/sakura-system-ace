import { supabase } from "./supabase";
import type {
  Cliente,
  NovoCliente,
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
  veiculos: VeiculoFormulario[],
): Promise<Cliente> {
  const { data: clienteCriado, error: erroCliente } = await supabase
    .from("clientes")
    .insert(cliente)
    .select()
    .single();

  if (erroCliente) throw erroCliente;

  if (veiculos.length > 0) {
    // Todo veículo do formulário (mesmo num cliente novo) tem o hidden input
    // de `id` registrado (ver VeiculosFields.tsx) — sem `id` de banco ainda,
    // ele manda "" em vez de undefined. `...veiculo` espalharia esse `id: ""`
    // pro insert e o Postgres recusa string vazia numa coluna uuid, mesmo
    // aqui sendo sempre um veículo novo. Mesmo cuidado já aplicado em
    // atualizarCliente() pros veículos novos adicionados na edição.
    const { error: erroVeiculos } = await supabase.from("veiculos").insert(
      veiculos.map((veiculo) => ({
        placa: veiculo.placa,
        marca: veiculo.marca,
        modelo: veiculo.modelo,
        ano: veiculo.ano,
        cor: veiculo.cor,
        tipo: veiculo.tipo,
        km_atual: veiculo.km_atual,
        cliente_id: clienteCriado.id,
      })),
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

  const veiculosExistentes = veiculos.filter((veiculo) => Boolean(veiculo.id));
  const veiculosNovos = veiculos.filter((veiculo) => !veiculo.id);

  const idsParaManter = veiculosExistentes.map((veiculo) => veiculo.id as string);

  const exclusao = supabase.from("veiculos").delete().eq("cliente_id", id);
  const { error: erroExclusao } =
    idsParaManter.length > 0
      ? await exclusao.not("id", "in", `(${idsParaManter.join(",")})`)
      : await exclusao;
  if (erroExclusao) throw erroExclusao;

  if (veiculosExistentes.length > 0) {
    const { error: erroAtualizacao } = await supabase
      .from("veiculos")
      .upsert(veiculosExistentes.map((veiculo) => ({ ...veiculo, cliente_id: id })));
    if (erroAtualizacao) throw erroAtualizacao;
  }

  // Veículo novo não tem `id` ainda — não pode ir no upsert acima (o hidden
  // input do formulário manda "" em vez de undefined pra esse campo, e o
  // Postgres recusa "" numa coluna uuid); precisa de um insert à parte, sem a
  // chave `id`, pra o banco gerar o UUID sozinho.
  if (veiculosNovos.length > 0) {
    const { error: erroInsercao } = await supabase.from("veiculos").insert(
      veiculosNovos.map((veiculo) => ({
        placa: veiculo.placa,
        marca: veiculo.marca,
        modelo: veiculo.modelo,
        ano: veiculo.ano,
        cor: veiculo.cor,
        tipo: veiculo.tipo,
        km_atual: veiculo.km_atual,
        cliente_id: id,
      })),
    );
    if (erroInsercao) throw erroInsercao;
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
