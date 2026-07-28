export function mensagemDeErro(erro: unknown): string {
  if (erro && typeof erro === "object" && "message" in erro) {
    const mensagem = (erro as { message?: unknown }).message;
    if (typeof mensagem === "string" && mensagem.length > 0) return mensagem;
  }
  if (erro instanceof Error) return erro.message;
  return "Erro desconhecido ao salvar. Veja o console para mais detalhes.";
}
