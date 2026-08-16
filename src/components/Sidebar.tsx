import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { MODULOS } from "@/types/operador";
import { AreaRolavel } from "./AreaRolavel";
import { Logo } from "./Logo";
import { LojaSwitcher } from "./LojaSwitcher";

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

function IconeAuditoria({ className = "" }: { className?: string }) {
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
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}

export function Sidebar() {
  const { operador, logout } = useAuth();

  const modulosLiberados = operador?.admin
    ? MODULOS
    : MODULOS.filter((modulo) => operador?.permissoes.includes(modulo.chave));

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col gap-4">
      <div className="sakura-card flex flex-1 flex-col overflow-hidden">
        <AreaRolavel className="flex flex-col">
          <div className="px-6 pb-6 pt-8">
            <Logo />
            <p className="mt-4 text-[10px] font-semibold tracking-widest text-sakura-pink drop-shadow-[0_0_5px_rgba(255,77,206,0.5)]">AUTOCENTER EDITION</p>
          </div>

          <nav className="flex flex-1 flex-col gap-1 px-3 pb-3">
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
                  `rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-sakura-pink/20 to-sakura-purple/10 text-white shadow-[0_0_15px_rgba(255,77,206,0.2)] border border-sakura-pink/30"
                      : "text-sakura-purple-dark/90 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                {modulo.label}
              </NavLink>
            ))}
          </nav>
        </AreaRolavel>
      </div>

      {operador && (
        <div className="sakura-card shrink-0 px-6 py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-sakura-purple-dark">
                {operador.nome}
              </p>
              <p className="truncate text-xs text-sakura-purple-dark/85">@{operador.usuario}</p>
            </div>
            {operador.admin && (
              <div className="flex shrink-0 gap-1">
                <NavLink
                  to="/auditoria"
                  title="Auditoria"
                  className={({ isActive }) =>
                    `rounded-full p-2 transition-all ${
                      isActive
                        ? "bg-sakura-purple/20 text-sakura-pink"
                        : "text-sakura-purple-dark/85 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  <IconeAuditoria className="h-5 w-5" />
                </NavLink>
                <NavLink
                  to="/configuracoes"
                  title="Configurações"
                  className={({ isActive }) =>
                    `rounded-full p-2 transition-all ${
                      isActive
                        ? "bg-sakura-purple/20 text-sakura-pink"
                        : "text-sakura-purple-dark/85 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  <IconeEngrenagem className="h-5 w-5" />
                </NavLink>
              </div>
            )}
          </div>
          <LojaSwitcher />
          <button
            onClick={() => logout()}
            className="mt-2 text-xs font-medium text-sakura-purple hover:underline"
          >
            Sair
          </button>
        </div>
      )}
    </aside>
  );
}
