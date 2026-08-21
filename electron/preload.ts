import { contextBridge, ipcRenderer } from "electron";

// `process.env.npm_package_version` só existe quando o processo é lançado
// via `npm run ...` (ex: `npm run dev`) — no app instalado (aberto direto
// pelo `.exe`, sem `npm` por trás), essa variável nunca existe, e a versão
// nunca aparecia na tela. `SAKURA_APP_VERSION` é setada por `electron/main.ts`
// a partir de `app.getVersion()`, que funciona nos dois casos.
contextBridge.exposeInMainWorld("sakuraApp", {
  version: process.env.SAKURA_APP_VERSION,
  // Repassa fetch() com autenticação Basic Auth pro processo principal —
  // usado pela integração com o Focus NFe, que bloqueia chamada direta feita
  // da tela (CORS), ver o handler "http:fetchComAuth" em main.ts.
  fetchComAuth: (opcoes: { url: string; metodo: string; token: string; corpo?: unknown }) =>
    ipcRenderer.invoke("http:fetchComAuth", opcoes),
});
