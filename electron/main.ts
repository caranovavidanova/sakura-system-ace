import { app, BrowserWindow, Menu } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
import { autoUpdater } from "electron-updater";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");
// `app.getVersion()` funciona igual em dev e no app empacotado (diferente de
// `process.env.npm_package_version`, que só existe rodando via `npm run
// ...`) — repassado por variável de ambiente porque o preload não tem
// acesso direto ao módulo `app` do processo principal.
process.env.SAKURA_APP_VERSION = app.getVersion();
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

let mainWindow: BrowserWindow | null = null;

// Sem isso, o Electron mostra a barra de menu padrão (File/Edit/View/
// Window/Help) — itens genéricos em inglês sem função nenhuma pro app,
// que só ocupam uma faixa branca feia no topo da janela, inclusive em tela
// cheia. O app já tem sua própria navegação (Sidebar); não precisa dessa
// barra nativa.
Menu.setApplicationMenu(null);

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 700,
    backgroundColor: "#FFF7FC",
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
    },
  });

  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

// Sem isso, o autoUpdater roda "no escuro" — não tem terminal visível num
// app instalado (aberto por duplo clique), e o Console do DevTools do
// renderer não enxerga nada do processo principal. Escreve num arquivo de
// texto simples em vez de puxar uma dependência só pra log.
const CAMINHO_LOG_ATUALIZACAO = () => path.join(app.getPath("userData"), "atualizacoes.log");

function logAtualizacao(mensagem: string) {
  const linha = `[${new Date().toISOString()}] ${mensagem}\n`;
  try {
    fs.appendFileSync(CAMINHO_LOG_ATUALIZACAO(), linha);
  } catch {
    // Se nem o log conseguir escrever, não há mais nada a fazer aqui —
    // não deixa isso derrubar a checagem de atualização.
  }
}

app.whenReady().then(() => {
  createWindow();

  if (!VITE_DEV_SERVER_URL) {
    autoUpdater.on("checking-for-update", () => logAtualizacao("Procurando atualização..."));
    autoUpdater.on("update-available", (info) =>
      logAtualizacao(`Atualização encontrada: v${info.version}`),
    );
    autoUpdater.on("update-not-available", () =>
      logAtualizacao("Nenhuma atualização encontrada — já está na versão mais recente."),
    );
    autoUpdater.on("download-progress", (progresso) =>
      logAtualizacao(`Baixando atualização... ${Math.round(progresso.percent)}%`),
    );
    autoUpdater.on("update-downloaded", (info) =>
      logAtualizacao(`Atualização v${info.version} baixada — será instalada ao fechar o app.`),
    );
    autoUpdater.on("error", (erro) => logAtualizacao(`ERRO ao atualizar: ${erro.message}`));

    autoUpdater.checkForUpdatesAndNotify();
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    mainWindow = null;
  }
});
