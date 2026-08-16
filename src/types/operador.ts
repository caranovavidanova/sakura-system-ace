export const MODULOS = [
  { chave: "painel", label: "Início", rota: "/" },
  { chave: "clientes", label: "Clientes", rota: "/clientes" },
  { chave: "ordens_servico", label: "Ordens de Serviço", rota: "/ordens-servico" },
  { chave: "estoque", label: "Estoque", rota: "/estoque" },
  { chave: "fornecedores", label: "Fornecedores", rota: "/fornecedores" },
  { chave: "servicos", label: "Serviços", rota: "/servicos" },
  { chave: "caixa", label: "Caixa Diário", rota: "/caixa" },
  { chave: "contas_pagar", label: "Contas a Pagar", rota: "/contas-pagar" },
  { chave: "contas_receber", label: "Contas a Receber", rota: "/contas-receber" },
  { chave: "relatorios", label: "Relações", rota: "/relatorios" },
  { chave: "garantias", label: "Garantias", rota: "/garantias" },
  { chave: "notas_fiscais", label: "Notas Fiscais", rota: "/notas-fiscais" },
  { chave: "funcionarios", label: "Funcionários", rota: "/funcionarios" },
] as const;

export type ModuloChave = (typeof MODULOS)[number]["chave"];

export interface Operador {
  id: string;
  usuario: string;
  nome: string;
  admin: boolean;
  permissoes: ModuloChave[];
  ativo: boolean;
  deve_trocar_senha: boolean;
  criado_em: string;
}

// `deve_trocar_senha` não é um campo de formulário — nasce `false` (default
// do banco) e só vira `true` via a Edge Function de redefinir senha.
export type NovoOperador = Omit<Operador, "id" | "criado_em" | "deve_trocar_senha">;

export function temPermissao(
  operador: Operador | null,
  modulo: ModuloChave,
): boolean {
  if (!operador) return false;
  if (operador.admin) return true;
  return operador.permissoes.includes(modulo);
}
