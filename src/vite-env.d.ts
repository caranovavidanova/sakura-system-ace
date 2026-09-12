/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  sakuraApp?: {
    version: string;
    fetchComAuth: (opcoes: {
      url: string;
      metodo: string;
      token: string;
      corpo?: unknown;
    }) => Promise<{ ok: boolean; status: number; contentType: string; bytes: Uint8Array }>;
    conexao?: { url: string; chave: string };
    salvarConexao: (conexao: { url: string; chave: string }) => Promise<void>;
    registrarErro?: (mensagem: string) => void;
    // Abre uma conversa no WhatsApp no navegador padrão. Opcional porque
    // o app também roda no navegador (preview/catálogo de telas), onde
    // essa ponte não existe — ver lib/whatsapp.ts.
    abrirWhatsapp?: (url: string) => Promise<boolean>;
  };
}
