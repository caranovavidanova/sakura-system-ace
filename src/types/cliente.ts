export interface Veiculo {
  id: string;
  cliente_id: string;
  placa: string;
  marca: string | null;
  modelo: string | null;
  ano: number | null;
  cor: string | null;
  km_atual: number | null;
  criado_em: string;
}

export type TipoPessoa = "fisica" | "juridica";

export interface Cliente {
  id: string;
  nome: string;
  tipo_pessoa: TipoPessoa;
  cpf_cnpj: string | null;
  telefone: string | null;
  email: string | null;
  cep: string | null;
  rua: string | null;
  numero: string | null;
  bairro: string | null;
  cidade: string | null;
  uf: string | null;
  data_nascimento: string | null;
  criado_em: string;
  veiculos?: Veiculo[];
}

export type NovoCliente = Omit<Cliente, "id" | "criado_em" | "veiculos">;
export type NovoVeiculo = Omit<Veiculo, "id" | "cliente_id" | "criado_em">;
