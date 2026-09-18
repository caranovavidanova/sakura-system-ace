export interface FuncionarioFilho {
  id: string;
  funcionario_id: string;
  nome: string;
  data_nascimento: string | null;
  criado_em: string;
}

export type NovoFuncionarioFilho = Pick<FuncionarioFilho, "nome" | "data_nascimento">;

// A "janela pública" do cadastro (view funcionarios_publico, migration 0056):
// o que qualquer operador com acesso à loja enxerga, tenha ou não o módulo
// Funcionários. É o bastante pra escolher técnico e vendedor numa OS — e é
// deliberadamente o teto do que a view entrega. Acrescentar campo aqui sem
// acrescentar na view faz a tela ler `undefined` em silêncio.
export interface FuncionarioPublico {
  id: string;
  loja_id: string | null;
  nome: string;
  cargo: string | null;
  operador_id: string | null;
  ativo: boolean;
}

// O cadastro inteiro — salário, CPF, RG, CNH, família. Só quem tem o módulo
// alcança isto, e a partir da 0056 é o BANCO que garante, não a tela.
export interface Funcionario extends FuncionarioPublico {
  criado_em: string;
  operador?: { usuario: string } | null;

  // Documentos e dados pessoais
  cpf: string | null;
  rg: string | null;
  cnh_categoria: string | null;
  cnh_numero: string | null;
  data_nascimento: string | null;
  estado_civil: string | null;
  tipo_sanguineo: string | null;

  // Endereço e contato
  cep: string | null;
  endereco: string | null;
  numero: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
  complemento: string | null;
  telefone: string | null;
  celular: string | null;
  email: string | null;

  // Cargo e admissão
  pis: string | null;
  codigo_registro: string | null;
  cbo: string | null;
  salario: number | null;
  comissao: number | null;
  admissao: string | null;
  data_ferias: string | null;

  // Família: filiação e cônjuge
  pai: string | null;
  mae: string | null;
  naturalidade: string | null;
  sexo: string | null;
  conjuge_nome: string | null;
  conjuge_nascimento: string | null;
  data_casamento: string | null;
  conjuge_telefone: string | null;
  conjuge_celular: string | null;

  filhos?: FuncionarioFilho[];
}

export type NovoFuncionario = Omit<
  Funcionario,
  "id" | "loja_id" | "operador_id" | "ativo" | "criado_em" | "operador" | "filhos"
>;

export const ESTADOS_CIVIS = [
  "Solteiro(a)",
  "Casado(a)",
  "Divorciado(a)",
  "Viúvo(a)",
  "União estável",
] as const;

export const TIPOS_SANGUINEOS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;
