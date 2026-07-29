import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { MODULOS } from "@/types/operador";
import { AreaRolavel } from "./AreaRolavel";
import { Logo } from "./Logo";

function IconeEngrenagem({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

export function Sidebar() {
  const { operador, logout } = useAuth();

  const modulosLiberados = operador?.admin
    ? MODULOS
    : MODULOS.filter((modulo) => operador?.permissoes.includes(modulo.chave));

  return (
    <aside className="sakura-card flex h-full w-64 shrink-0 flex-col overflow-hidden">
      <AreaRolavel className="flex flex-col">
        <div className="px-6 py-6">
          <Logo />
          <p className="mt-1 text-xs text-sakura-purple-dark/85">AutoCenter Edition</p>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          {modulosLiberados.length === 0 && (
            <p className="px-4 py-2.5 text-xs text-sakura-purple-dark/85">
              Nenhum módulo liberado. Fale com o administrador.
            </p>
          )}
          {modulosLiberados.map((modulo) => (
            <NavLink
              key={modulo.chave}
              to={modulo.rota}
              end={modulo.chave === "painel"}
              className={({ isActive }) =>
                `rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white/50 text-sakura-purple-dark"
                    : "text-sakura-purple-dark/90 hover:bg-white/30"
                }`
              }
            >
              {modulo.label}
            </NavLink>
          ))}
        </nav>

        {operador && (
          <div className="border-t border-white/40 px-6 py-4">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-sakura-purple-dark">
                  {operador.nome}
                </p>
                <p className="truncate text-xs text-sakura-purple-dark/85">
                  @{operador.usuario}
                </p>
              </div>
              {operador.admin && (
                <NavLink
                  to="/configuracoes"
                  title="Configurações"
                  className={({ isActive }) =>
                    `shrink-0 rounded-full p-2 transition-colors ${
                      isActive
                        ? "bg-white/50 text-sakura-purple-dark"
                        : "text-sakura-purple-dark/85 hover:bg-white/30 hover:text-sakura-purple-dark"
                    }`
                  }
                >
                  <IconeEngrenagem className="h-5 w-5" />
                </NavLink>
              )}
            </div>
            <button
              onClick={() => logout()}
              className="mt-2 text-xs font-medium text-sakura-purple hover:underline"
            >
              Sair
            </button>
          </div>
        )}
      </AreaRolavel>
    </aside>
  );
}
