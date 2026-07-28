import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as
  | string
  | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    "[Sakura System] Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY em um arquivo .env.",
  );
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key",
  {
    // Sem persistir sessão: cada vez que o app abre, pede login de novo — a
    // pedido do usuário, já que o programa costuma ficar aberto o dia
    // inteiro (não é algo que se fecha e reabre com frequência).
    auth: { persistSession: false },
  },
);
