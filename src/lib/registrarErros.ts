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
// Contexto de quem está usando, pra pilha de erro significar alguma coisa.
// Fica em módulo (e não no React) porque `registrarErrosDaTela` roda uma vez
// só, na abertura, fora de qualquer componente — quem atualiza é o App.tsx.
let contexto: { usuario?: string; loja?: string } = {};

export function definirContextoDeErro(novo: { usuario?: string; loja?: string }): void {
  contexto = novo;
}

function linhaDeContexto(): string {
  const partes = [
    `rota=${typeof location !== "undefined" ? location.hash || "#/" : "?"}`,
    contexto.usuario ? `usuário=@${contexto.usuario}` : "usuário=(não logado)",
    contexto.loja ? `loja=${contexto.loja}` : "loja=(nenhuma)",
    `app=${window.sakuraApp?.version ?? "?"}`,
  ];
  return `Contexto: ${partes.join(" · ")}`;
}

export function registrarErrosDaTela(): void {
  if (typeof window === "undefined") return;

  function reportar(origem: string, detalhe: unknown, pilha?: string) {
    const linha = [`${origem}: ${String(detalhe)}`, pilha, linhaDeContexto()]
      .filter(Boolean)
      .join("\n");
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
