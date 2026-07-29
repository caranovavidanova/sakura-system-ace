export const MODULOS = [
  { chave: "painel", label: "Início", rota: "/" },
  { chave: "clientes", label: "Clientes", rota: "/clientes" },
  { chave: "ordens_servico", label: "Ordens de Serviço", rota: "/ordens-servico" },
  { chave: "estoque", label: "Estoque", rota: "/estoque" },
  { chave: "servicos", label: "Serviços", rota: "/servicos" },
  { chave: "funcionarios", label: "Funcionários", rota: "/funcionarios" },
  { chave: "caixa", label: "Caixa Diário", rota: "/caixa" },
  { chave: "relatorios", label: "Relatórios", rota: "/relatorios" },
  { chave: "lucratividade", label: "Lucratividade", rota: "/lucratividade" },
  { chave: "garantias", label: "Garantias", rota: "/garantias" },
] as const;

export type ModuloChave = (typeof MODULOS)[number]["chave"];

export interface Operador {
  id: string;
  usuario: string;
  nome: string;
  admin: boolean;
  permissoes: ModuloChave[];
  ativo: boolean;
  criado_em: string;
}

export type NovoOperador = Omit<Operador, "id" | "criado_em">;

export function temPermissao(
  operador: Operador | null,
  modulo: ModuloChave,
): boolean {
  if (!operador) return false;
  if (operador.admin) return true;
  return operador.permissoes.includes(modulo);
}
