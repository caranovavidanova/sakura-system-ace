import type { Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { buscarOperadorAtual, entrar, sair } from "@/lib/auth";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import type { Operador } from "@/types/operador";

interface AuthContextValue {
  carregando: boolean;
  session: Session | null;
  operador: Operador | null;
  login: (usuario: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [operador, setOperador] = useState<Operador | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setCarregando(false);
      return;
    }

    let ativo = true;

    // Cobre tanto a sessão inicial (ao abrir o app) quanto qualquer mudança
    // depois (login, logout, token renovado) com o mesmo fluxo, sempre
    // mantendo "carregando" até o perfil do operador estar pronto — evita um
    // instante em que a sessão já existe mas o perfil (e as permissões) ainda
    // não, o que faria as telas piscarem "sem permissão" por um instante.
    async function processarSessao(novaSessao: Session | null) {
      setSession(novaSessao);
      if (!novaSessao) {
        setOperador(null);
        setCarregando(false);
        return;
      }
      setCarregando(true);
      try {
        const perfil = await buscarOperadorAtual(novaSessao.user.id);
        if (ativo) setOperador(perfil);
      } catch (err) {
        console.error("Erro ao carregar perfil do operador:", err);
        if (ativo) setOperador(null);
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    supabase.auth.getSession().then(({ data }) => {
      if (ativo) processarSessao(data.session);
    });

    const { data: assinatura } = supabase.auth.onAuthStateChange(
      (_evento, novaSessao) => {
        processarSessao(novaSessao);
      },
    );

    return () => {
      ativo = false;
      assinatura.subscription.unsubscribe();
    };
  }, []);

  async function login(usuario: string, senha: string) {
    await entrar(usuario, senha);
  }

  async function logout() {
    await sair();
  }

  return (
    <AuthContext.Provider value={{ carregando, session, operador, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error("useAuth precisa ser usado dentro de um AuthProvider");
  }
  return contexto;
}
