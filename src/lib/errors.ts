/**
 * A frase em português de cada trava do banco (migrations 0058 a 0060).
 *
 * Sem isto, quem esbarra numa trava lê "new row for relation ... violates
 * check constraint ...", que não diz o que fazer (item TR-02.6 do guia). O
 * nome da trava é a chave — por isso toda trava nova tem nome explícito
 * `ck_<tabela>_<regra>`, e ganha uma linha aqui.
 */
export const MENSAGEM_DA_TRAVA: Record<string, string> = {
  ck_ordens_servico_itens_preco: "O preço do item não pode ser negativo.",
  ck_ordens_servico_itens_desconto:
    "O desconto do item não pode ser negativo nem maior que o valor do item (quantidade × preço).",
  ck_pecas_preco_custo: "O preço de custo não pode ser negativo.",
  ck_pecas_preco_venda: "O preço de venda não pode ser negativo.",
  ck_pecas_prazo_garantia: "O prazo de garantia não pode ser negativo.",
  ck_pecas_aliquota_icms: "A alíquota de ICMS precisa estar entre 0 e 100%.",
  ck_servicos_preco_padrao: "O preço do serviço não pode ser negativo.",
  ck_servicos_custo: "O custo do serviço não pode ser negativo.",
  ck_contas_pagar_valor: "O valor da conta não pode ser negativo.",
  ck_contas_receber_valor: "O valor a receber não pode ser negativo.",
  ck_pedidos_compra_itens_preco: "O preço do item do pedido não pode ser negativo.",
  ck_pedidos_compra_itens_recebida: "A quantidade recebida não pode ser negativa.",
  ck_ordens_servico_datas:
    "A data de fechamento ficou antes da abertura da OS. Confira a data e a hora deste computador.",
  ck_juros_percentual: "O juro de parcelamento precisa estar entre 0 e 100%.",
  ck_config_fiscal_aliquota_iss: "A alíquota de ISS precisa estar entre 0 e 10%.",
  ck_config_fiscal_cnpj: "O CNPJ da loja está incompleto — ele tem 14 caracteres.",
  ck_clientes_cnpj_juridica:
    "O CNPJ está incompleto — ele tem 14 caracteres. Complete ou deixe o campo em branco.",
  ck_fechamentos_caixa_valores: "O valor contado e o troco não podem ser negativos.",
  ck_comissoes_fechamentos_valores:
    "O valor pago não pode ser negativo, e o fim do período não pode vir antes do início.",
};

/** A frase da trava, se a mensagem do banco for de uma trava conhecida. */
export function traduzirTrava(mensagem: string): string | null {
  const casou = /violates check constraint "([^"]+)"/.exec(mensagem);
  return casou ? (MENSAGEM_DA_TRAVA[casou[1]] ?? null) : null;
}

export function mensagemDeErro(erro: unknown): string {
  if (erro && typeof erro === "object" && "message" in erro) {
    const mensagem = (erro as { message?: unknown }).message;
    if (typeof mensagem === "string" && mensagem.length > 0) return traduzirTrava(mensagem) ?? mensagem;
  }
  if (erro instanceof Error) return traduzirTrava(erro.message) ?? erro.message;
  return "Erro desconhecido ao salvar. Veja o console para mais detalhes.";
}
