import { contextBridge } from "electron";

// `process.env.npm_package_version` só existe quando o processo é lançado
// via `npm run ...` (ex: `npm run dev`) — no app instalado (aberto direto
// pelo `.exe`, sem `npm` por trás), essa variável nunca existe, e a versão
// nunca aparecia na tela. `SAKURA_APP_VERSION` é setada por `electron/main.ts`
// a partir de `app.getVersion()`, que funciona nos dois casos.
contextBridge.exposeInMainWorld("sakuraApp", {
  version: process.env.SAKURA_APP_VERSION,
});
