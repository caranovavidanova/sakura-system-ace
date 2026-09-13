export type AcaoAuditoria = "criar" | "atualizar" | "excluir";

export interface RegistroAuditoria {
  id: string;
  tabela: string;
  registro_id: string;
  acao: AcaoAuditoria;
  operador_id: string | null;
  // Gravado no momento do fato pelo trigger (migration 0053), não buscado por
  // join: o registro histórico conta quem era aquela pessoa naquele dia, e
  // continua respondendo mesmo se o operador for excluído depois.
  operador_nome: string | null;
  dados_antes: Record<string, unknown> | null;
  dados_depois: Record<string, unknown> | null;
  criado_em: string;
}

// Nomes técnicos das tabelas → rótulo em português, pra tela de Auditoria.
// Só as tabelas cobertas pelo trigger (migrations 0040 e 0053) — ver
// PROJETO_STATUS.md.
export const TABELA_AUDITORIA_LABEL: Record<string, string> = {
  operadores: "Operadores",
  pecas: "Peças",
  servicos: "Serviços",
  caixa_movimentos: "Caixa",
  contas_pagar: "Contas a Pagar",
  contas_receber: "Contas a Receber",
  ordens_servico: "Ordens de Serviço",
  ordens_servico_itens: "Itens de OS",
  clientes: "Clientes",
  fornecedores: "Fornecedores",
  pedidos_compra: "Pedidos de Compra",
  lojas: "Lojas",
  notas_fiscais_arquivos: "Notas Fiscais",
  configuracoes_fiscais_loja: "Dados fiscais da loja",
  configuracoes_juros_parcelas: "Juros de parcelamento",
  operador_lojas: "Acesso de operador a loja",
};

export const ACAO_AUDITORIA_LABEL: Record<AcaoAuditoria, string> = {
  criar: "Criou",
  atualizar: "Editou",
  excluir: "Excluiu",
};
