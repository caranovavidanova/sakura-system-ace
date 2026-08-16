export type AcaoAuditoria = "atualizar" | "excluir";

export interface RegistroAuditoria {
  id: string;
  tabela: string;
  registro_id: string;
  acao: AcaoAuditoria;
  operador_id: string | null;
  dados_antes: Record<string, unknown> | null;
  dados_depois: Record<string, unknown> | null;
  criado_em: string;
  operador?: { nome: string } | null;
}

// Nomes técnicos das tabelas → rótulo em português, pra tela de Auditoria.
// Só as tabelas cobertas pelo trigger (migration 0040) — ver PROJETO_STATUS.md.
export const TABELA_AUDITORIA_LABEL: Record<string, string> = {
  operadores: "Operadores",
  pecas: "Peças",
  servicos: "Serviços",
  caixa_movimentos: "Caixa",
  contas_pagar: "Contas a Pagar",
  contas_receber: "Contas a Receber",
  ordens_servico: "Ordens de Serviço",
  clientes: "Clientes",
  fornecedores: "Fornecedores",
  pedidos_compra: "Pedidos de Compra",
  lojas: "Lojas",
};

export const ACAO_AUDITORIA_LABEL: Record<AcaoAuditoria, string> = {
  atualizar: "Editou",
  excluir: "Excluiu",
};
