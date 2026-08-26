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
//
// Traduz o código HTTP da resposta na mensagem que a usuária vê (`null` =
// deu certo). Separado da chamada de rede pra poder ser testado sem internet.
export function mensagemDoTeste(status: number): string | null {
  if (status === 401 || status === 403) {
    return "O endereço respondeu, mas a chave não foi aceita. Confira se copiou a chave anon/publishable inteira.";
  }
  if (status >= 200 && status < 300) return null;
  return `O endereço respondeu de um jeito inesperado (código ${status}). Confira se a URL é a do seu projeto Supabase.`;
}

export async function testarConexao(conexao: Conexao): Promise<void> {
  const base = conexao.url.replace(/\/+$/, "");
  let resposta: Response;
  try {
    // Só o cabeçalho `apikey`. Mandar a chave também como
    // `Authorization: Bearer ...` faz o Supabase recusar com 401 quando ela
    // está no formato novo (`sb_publishable_...`), que não é um JWT e não
    // pode ser usado como token — erro documentado por eles, e que fazia esta
    // tela acusar "chave não foi aceita" com a chave certa. Só `apikey`
    // funciona nos dois formatos, o novo e o antigo (`eyJ...`).
    resposta = await fetch(`${base}/rest/v1/`, { headers: { apikey: conexao.chave } });
  } catch {
    throw new Error(
      "Não foi possível falar com esse endereço. Confira se a URL está certa e se o computador está conectado à internet.",
    );
  }
  const problema = mensagemDoTeste(resposta.status);
  if (problema) throw new Error(problema);
}
