import { app, BrowserWindow, ipcMain, Menu } from "electron";
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

// --- Conexão com o Supabase, escolhida no próprio app ---------------------
//
// Antes, a URL e a chave do Supabase eram gravadas dentro do build (secrets
// do GitHub), então um instalador só servia uma empresa. Pra vender pra uma
// segunda empresa (que precisa do banco de dados próprio, separado) sem ter
// que gerar um instalador diferente por cliente, elas passam a ser digitadas
// na primeira abertura e guardadas **neste computador**, num arquivo simples
// dentro da pasta de dados do app.
//
// A chave guardada é a "anon"/publishable do Supabase, que é feita pra ser
// pública (quem protege os dados é a RLS no banco, não o segredo da chave) —
// por isso não há problema em ela ficar num arquivo de texto na máquina.
//
// O valor é repassado pro preload por **variável de ambiente**, o mesmo
// mecanismo já usado por SAKURA_APP_VERSION acima. Isso é de propósito: o
// preload precisa desse valor de forma síncrona (o cliente do Supabase é
// criado assim que a tela carrega, antes de qualquer IPC poder responder), e
// ler arquivo direto de dentro do preload empacotado já falhou antes de um
// jeito silencioso (ver PROJETO_STATUS.md, seção 6, item 18).
interface ConexaoSalva {
  url: string;
  chave: string;
}

const CAMINHO_CONEXAO = () => path.join(app.getPath("userData"), "conexao.json");

function carregarConexaoSalva(): ConexaoSalva | null {
  try {
    const conteudo = fs.readFileSync(CAMINHO_CONEXAO(), "utf8");
    const dados = JSON.parse(conteudo) as Partial<ConexaoSalva>;
    if (!dados.url || !dados.chave) return null;
    return { url: dados.url, chave: dados.chave };
  } catch {
    // Arquivo ainda não existe (primeira abertura) ou está corrompido — nos
    // dois casos o app cai na tela de configuração, que é o certo.
    return null;
  }
}

function aplicarConexaoNoAmbiente(conexao: ConexaoSalva | null) {
  if (conexao) {
    process.env.SAKURA_SUPABASE_URL = conexao.url;
    process.env.SAKURA_SUPABASE_ANON_KEY = conexao.chave;
  } else {
    delete process.env.SAKURA_SUPABASE_URL;
    delete process.env.SAKURA_SUPABASE_ANON_KEY;
  }
}

aplicarConexaoNoAmbiente(carregarConexaoSalva());

// Grava a conexão escolhida e recarrega a tela: o cliente do Supabase é
// montado uma vez só, quando a tela carrega, então trocar de banco de dados
// sem recarregar deixaria o app falando com o banco antigo.
ipcMain.handle("conexao:salvar", async (_evento, conexao: ConexaoSalva) => {
  fs.writeFileSync(CAMINHO_CONEXAO(), JSON.stringify(conexao, null, 2), "utf8");
  aplicarConexaoNoAmbiente(conexao);
  mainWindow?.webContents.reload();
});

// Sem isso, o Chromium detecta que a janela ficou "oculta" atrás de outra
// (ex: alt-tab, mesmo que por poucos segundos) e descarta/recarrega a tela
// pra economizar recursos — do lado da usuária isso parece a tela "resetar"
// sozinha, perdendo o que estava sendo digitado. Esses dois parâmetros
// (precisam ser setados antes de `app.whenReady()`) desligam essa otimização
// — não faz sentido pra um app de uso o dia todo, sempre em primeiro plano.
app.commandLine.appendSwitch("disable-backgrounding-occluded-windows");
app.commandLine.appendSwitch("disable-renderer-backgrounding");

// A tela do app (Chromium/renderer) trata fetch() como um navegador comum —
// a API do Focus NFe é feita pra ser chamada de servidor pra servidor, não
// tem CORS liberado pra chamada direta do navegador, então um fetch() feito
// na tela sempre falha com "Failed to fetch" (bloqueado antes de qualquer
// resposta chegar). Aqui no processo principal, que roda em Node.js, não
// existe essa restrição — por isso a chamada de verdade acontece aqui,
// exposta pro preload/tela via IPC (ver preload.ts e src/lib/focusNfe.ts).
interface FetchComAuthOpcoes {
  url: string;
  metodo: string;
  token: string;
  corpo?: unknown;
}

interface FetchComAuthResultado {
  ok: boolean;
  status: number;
  contentType: string;
  bytes: Uint8Array;
}

ipcMain.handle(
  "http:fetchComAuth",
  async (_evento, opcoes: FetchComAuthOpcoes): Promise<FetchComAuthResultado> => {
    const resposta = await fetch(opcoes.url, {
      method: opcoes.metodo,
      headers: {
        Authorization: `Basic ${Buffer.from(`${opcoes.token}:`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: opcoes.corpo ? JSON.stringify(opcoes.corpo) : undefined,
    });
    const arrayBuffer = await resposta.arrayBuffer();
    return {
      ok: resposta.ok,
      status: resposta.status,
      contentType: resposta.headers.get("content-type") ?? "",
      bytes: new Uint8Array(arrayBuffer),
    };
  },
);

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
      backgroundThrottling: false,
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
