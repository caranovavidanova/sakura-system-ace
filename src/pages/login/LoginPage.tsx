import { useState } from "react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { mensagemDeErro } from "@/lib/errors";
import { isSupabaseConfigured } from "@/lib/supabase";

export function LoginPage() {
  const { login } = useAuth();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [entrando, setEntrando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setEntrando(true);
    try {
      await login(usuario, senha);
    } catch (err) {
      console.error("Erro ao entrar:", err);
      setErro(mensagemDeErro(err));
    } finally {
      setEntrando(false);
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-sakura-bg">
      <div className="w-full max-w-sm rounded-2xl border border-sakura-gray/30 bg-white p-8 shadow-sm">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        {!isSupabaseConfigured && (
          <p className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
            O Supabase ainda não está configurado. Defina{" "}
            <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code>{" "}
            no arquivo <code>.env</code> para conseguir entrar.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {erro && (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
              {erro}
            </p>
          )}

          <label className="flex flex-col gap-1 text-sm">
            <span className="text-sakura-purple-dark/80">Usuário</span>
            <input
              type="text"
              autoFocus
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="text-sakura-purple-dark/80">Senha</span>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
            />
          </label>

          <button
            type="submit"
            disabled={entrando}
            className="w-full rounded-xl bg-sakura-purple px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {entrando ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
