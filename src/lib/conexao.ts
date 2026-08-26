// Decide com qual Supabase (qual empresa) este computador vai falar.
//
// O app nasceu com a conexão gravada dentro do build, o que fazia um
// instalador servir uma empresa só. Agora ela é escolhida na primeira
// abertura e guardada neste computador (ver o bloco sobre "conexao.json" em
// electron/main.ts), então o mesmo instalador serve qualquer empresa.

export interface Conexao {
  url: string;
  chave: string;
}

// Em desenvolvimento (`npm run dev`), o `.env` continua mandando — assim quem
// está programando não precisa passar pela tela de configuração a cada
// máquina nova. **No app instalado o `.env` é ignorado de propósito**: o
// instalador não carrega mais a conexão de empresa nenhuma dentro dele (ver o
// comentário em .github/workflows/release.yml), justamente pra um instalador
// entregue a um cliente novo não vir apontando pro banco de outra empresa.
const urlDoDesenvolvimento = import.meta.env.DEV
  ? import.meta.env.VITE_SUPABASE_URL || ""
  : "";
const chaveDoDesenvolvimento = import.meta.env.DEV
  ? import.meta.env.VITE_SUPABASE_ANON_KEY || ""
  : "";

export function conexaoAtual(): Conexao | null {
  if (urlDoDesenvolvimento && chaveDoDesenvolvimento) {
    return { url: urlDoDesenvolvimento, chave: chaveDoDesenvolvimento };
  }
  const salva = typeof window !== "undefined" ? window.sakuraApp?.conexao : undefined;
  return salva ?? null;
}

export function conexaoConfigurada(): boolean {
  return conexaoAtual() !== null;
}

export async function salvarConexao(conexao: Conexao): Promise<void> {
  if (typeof window === "undefined" || !window.sakuraApp) {
    throw new Error(
      "Não foi possível salvar a conexão: esta tela precisa rodar dentro do aplicativo instalado.",
    );
  }
  await window.sakuraApp.salvarConexao(conexao);
}

// Confere se a URL e a chave realmente respondem, antes de gravar — evita a
// usuária salvar um endereço com erro de digitação e só descobrir na hora de
// entrar, com uma mensagem que não ajuda em nada. Um Supabase válido responde
// nesse endereço quando recebe a chave certa.
export async function testarConexao(conexao: Conexao): Promise<void> {
  const base = conexao.url.replace(/\/+$/, "");
  let resposta: Response;
  try {
    resposta = await fetch(`${base}/rest/v1/`, {
      headers: { apikey: conexao.chave, Authorization: `Bearer ${conexao.chave}` },
    });
  } catch {
    throw new Error(
      "Não foi possível falar com esse endereço. Confira se a URL está certa e se o computador está conectado à internet.",
    );
  }
  if (resposta.status === 401 || resposta.status === 403) {
    throw new Error("O endereço respondeu, mas a chave não foi aceita. Confira a chave anon.");
  }
  if (!resposta.ok) {
    throw new Error(
      `O endereço respondeu de um jeito inesperado (código ${resposta.status}). Confira se a URL é a do seu projeto Supabase.`,
    );
  }
}
