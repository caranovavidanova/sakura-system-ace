export const MODULOS = [
  { chave: "painel", label: "Painel de Controle", rota: "/" },
  { chave: "clientes", label: "Clientes", rota: "/clientes" },
  { chave: "estoque", label: "Estoque", rota: "/estoque" },
  { chave: "ordens_servico", label: "Ordens de Serviço", rota: "/ordens-servico" },
  { chave: "caixa", label: "Caixa Diário", rota: "/caixa" },
  { chave: "relatorios", label: "Relatórios", rota: "/relatorios" },
  { chave: "lucratividade", label: "Lucratividade", rota: "/lucratividade" },
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
