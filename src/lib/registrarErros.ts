/**
 * Manda pro processo principal gravar em "erros.log" (na pasta de dados do
 * app) qualquer erro de JavaScript que estourar na tela sem ninguém tratar.
 *
 * Por que isso existe: no app instalado não há como ver o console — o
 * DevTools só abre em modo de desenvolvimento, e um app aberto por duplo
 * clique não tem terminal. Então um erro solto na tela é totalmente
 * invisível, e some junto com a janela quando o app é reaberto. É esse tipo
 * de problema que aparece como "a tela travou / o campo parou de aceitar
 * digitação, mas fechei e abri e voltou ao normal": sem registro, não sobra
 * nenhuma pista pra investigar depois. Mesmo espírito do "atualizacoes.log"
 * já usado pelo autoUpdater (ver PROJETO_STATUS.md, seção 6, item 19).
 */
export function registrarErrosDaTela(): void {
  if (typeof window === "undefined") return;

  function reportar(origem: string, detalhe: unknown, pilha?: string) {
    const linha = [`${origem}: ${String(detalhe)}`, pilha].filter(Boolean).join("\n");
    // Continua indo pro console também: em `npm run dev` é lá que se olha.
    console.error(linha);
    window.sakuraApp?.registrarErro?.(linha);
  }

  window.addEventListener("error", (evento) => {
    const local = evento.filename ? ` (${evento.filename}:${evento.lineno}:${evento.colno})` : "";
    reportar(`Erro na tela${local}`, evento.message, evento.error?.stack);
  });

  // Promise que rejeitou e ninguém pegou — o caso mais comum aqui é uma
  // chamada ao Supabase falhando dentro de um handler sem try/catch.
  window.addEventListener("unhandledrejection", (evento) => {
    const razao = evento.reason;
    reportar(
      "Erro não tratado numa operação em segundo plano",
      razao instanceof Error ? razao.message : razao,
      razao instanceof Error ? razao.stack : undefined,
    );
  });
}
