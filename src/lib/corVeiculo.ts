const CORES_CONHECIDAS: Record<string, string> = {
  branco: "#f2f2f2",
  branca: "#f2f2f2",
  preto: "#2b2b2e",
  preta: "#2b2b2e",
  prata: "#c3c5c9",
  prateado: "#c3c5c9",
  cinza: "#8b8d93",
  grafite: "#54555b",
  chumbo: "#54555b",
  vermelho: "#c0392b",
  vermelha: "#c0392b",
  azul: "#2f6fb0",
  "azul escuro": "#274a78",
  "azul claro": "#5b9bd5",
  verde: "#3f7d4a",
  amarelo: "#e0b53a",
  amarela: "#e0b53a",
  laranja: "#d3702f",
  marrom: "#6b4a34",
  bege: "#c9b493",
  dourado: "#b89b52",
  dourada: "#b89b52",
  roxo: "#7a5a9c",
  roxa: "#7a5a9c",
  rosa: "#d98cbf",
  vinho: "#7a2f3a",
};

const COR_PADRAO = "#a7a2a9";

export function corVeiculoParaHex(cor: string | null | undefined): string {
  if (!cor) return COR_PADRAO;
  const chave = cor.trim().toLowerCase();
  if (CORES_CONHECIDAS[chave]) return CORES_CONHECIDAS[chave];
  const primeiraPalavra = chave.split(/\s+/)[0];
  return CORES_CONHECIDAS[primeiraPalavra] ?? COR_PADRAO;
}
