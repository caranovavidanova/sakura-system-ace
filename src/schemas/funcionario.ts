import { z } from "zod";
import type { Funcionario, NovoFuncionario, NovoFuncionarioFilho } from "@/types/funcionario";

// Formulário trabalha só com strings (é o que todo <input>/<select> devolve),
// mesmo pros campos que no banco são number | null — a conversão pra
// NovoFuncionario acontece só na borda, em paraNovoFuncionario().
export const funcionarioFormSchema = z.object({
  nome: z.string().trim().min(1, "Nome é obrigatório"),
  cargo: z.string(),
  data_nascimento: z.string(),
  sexo: z.string(),
  estado_civil: z.string(),
  tipo_sanguineo: z.string(),
  cpf: z.string(),
  rg: z.string(),
  cnh_categoria: z.string(),
  cnh_numero: z.string(),
  cep: z.string(),
  endereco: z.string(),
  numero: z.string(),
  bairro: z.string(),
  cidade: z.string(),
  estado: z.string(),
  complemento: z.string(),
  telefone: z.string(),
  celular: z.string(),
  email: z.string(),
  pis: z.string(),
  codigo_registro: z.string(),
  cbo: z.string(),
  admissao: z.string(),
  salario: z.string(),
  comissao: z.string(),
  data_ferias: z.string(),
  pai: z.string(),
  mae: z.string(),
  naturalidade: z.string(),
  conjuge_nome: z.string(),
  conjuge_nascimento: z.string(),
  data_casamento: z.string(),
  conjuge_telefone: z.string(),
  conjuge_celular: z.string(),
  filhos: z.array(
    z.object({
      nome: z.string(),
      data_nascimento: z.string(),
    }),
  ),
});

export type FuncionarioFormValues = z.infer<typeof funcionarioFormSchema>;

const texto = (valor: string | null | undefined) => valor ?? "";
const numero = (valor: number | null | undefined) => valor?.toString() ?? "";

export function paraValoresFormulario(funcionario?: Funcionario): FuncionarioFormValues {
  return {
    nome: texto(funcionario?.nome),
    cargo: texto(funcionario?.cargo),
    data_nascimento: texto(funcionario?.data_nascimento),
    sexo: texto(funcionario?.sexo),
    estado_civil: texto(funcionario?.estado_civil),
    tipo_sanguineo: texto(funcionario?.tipo_sanguineo),
    cpf: texto(funcionario?.cpf),
    rg: texto(funcionario?.rg),
    cnh_categoria: texto(funcionario?.cnh_categoria),
    cnh_numero: texto(funcionario?.cnh_numero),
    cep: texto(funcionario?.cep),
    endereco: texto(funcionario?.endereco),
    numero: texto(funcionario?.numero),
    bairro: texto(funcionario?.bairro),
    cidade: texto(funcionario?.cidade),
    estado: texto(funcionario?.estado),
    complemento: texto(funcionario?.complemento),
    telefone: texto(funcionario?.telefone),
    celular: texto(funcionario?.celular),
    email: texto(funcionario?.email),
    pis: texto(funcionario?.pis),
    codigo_registro: texto(funcionario?.codigo_registro),
    cbo: texto(funcionario?.cbo),
    admissao: texto(funcionario?.admissao),
    salario: numero(funcionario?.salario),
    comissao: numero(funcionario?.comissao),
    data_ferias: texto(funcionario?.data_ferias),
    pai: texto(funcionario?.pai),
    mae: texto(funcionario?.mae),
    naturalidade: texto(funcionario?.naturalidade),
    conjuge_nome: texto(funcionario?.conjuge_nome),
    conjuge_nascimento: texto(funcionario?.conjuge_nascimento),
    data_casamento: texto(funcionario?.data_casamento),
    conjuge_telefone: texto(funcionario?.conjuge_telefone),
    conjuge_celular: texto(funcionario?.conjuge_celular),
    filhos:
      funcionario?.filhos?.map((filho) => ({
        nome: filho.nome,
        data_nascimento: texto(filho.data_nascimento),
      })) ?? [],
  };
}

const paraTextoOuNulo = (valor: string) => (valor.trim() === "" ? null : valor.trim());
const paraNumeroOuNulo = (valor: string) => (valor.trim() === "" ? null : Number(valor));

export function paraNovoFuncionario(valores: FuncionarioFormValues): NovoFuncionario {
  return {
    nome: valores.nome.trim(),
    cargo: paraTextoOuNulo(valores.cargo),
    data_nascimento: paraTextoOuNulo(valores.data_nascimento),
    sexo: paraTextoOuNulo(valores.sexo),
    estado_civil: paraTextoOuNulo(valores.estado_civil),
    tipo_sanguineo: paraTextoOuNulo(valores.tipo_sanguineo),
    cpf: paraTextoOuNulo(valores.cpf),
    rg: paraTextoOuNulo(valores.rg),
    cnh_categoria: paraTextoOuNulo(valores.cnh_categoria),
    cnh_numero: paraTextoOuNulo(valores.cnh_numero),
    cep: paraTextoOuNulo(valores.cep),
    endereco: paraTextoOuNulo(valores.endereco),
    numero: paraTextoOuNulo(valores.numero),
    bairro: paraTextoOuNulo(valores.bairro),
    cidade: paraTextoOuNulo(valores.cidade),
    estado: paraTextoOuNulo(valores.estado),
    complemento: paraTextoOuNulo(valores.complemento),
    telefone: paraTextoOuNulo(valores.telefone),
    celular: paraTextoOuNulo(valores.celular),
    email: paraTextoOuNulo(valores.email),
    pis: paraTextoOuNulo(valores.pis),
    codigo_registro: paraTextoOuNulo(valores.codigo_registro),
    cbo: paraTextoOuNulo(valores.cbo),
    admissao: paraTextoOuNulo(valores.admissao),
    salario: paraNumeroOuNulo(valores.salario),
    comissao: paraNumeroOuNulo(valores.comissao),
    data_ferias: paraTextoOuNulo(valores.data_ferias),
    pai: paraTextoOuNulo(valores.pai),
    mae: paraTextoOuNulo(valores.mae),
    naturalidade: paraTextoOuNulo(valores.naturalidade),
    conjuge_nome: paraTextoOuNulo(valores.conjuge_nome),
    conjuge_nascimento: paraTextoOuNulo(valores.conjuge_nascimento),
    data_casamento: paraTextoOuNulo(valores.data_casamento),
    conjuge_telefone: paraTextoOuNulo(valores.conjuge_telefone),
    conjuge_celular: paraTextoOuNulo(valores.conjuge_celular),
  };
}

export function paraFilhosPreenchidos(
  filhos: FuncionarioFormValues["filhos"],
): NovoFuncionarioFilho[] {
  return filhos
    .filter((filho) => filho.nome.trim())
    .map((filho) => ({
      nome: filho.nome.trim(),
      data_nascimento: paraTextoOuNulo(filho.data_nascimento),
    }));
}
