import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { MODULOS } from "@/types/operador";
import { Logo } from "./Logo";

export function Sidebar() {
  const { operador, logout } = useAuth();

  const modulosLiberados = operador?.admin
    ? MODULOS
    : MODULOS.filter((modulo) => operador?.permissoes.includes(modulo.chave));

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col overflow-y-auto border-r border-sakura-gray/40 bg-white">
      <div className="px-6 py-6">
        <Logo />
        <p className="mt-1 text-xs text-sakura-gray">AutoCenter Edition</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {modulosLiberados.length === 0 && (
          <p className="px-4 py-2.5 text-xs text-sakura-gray">
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
                  ? "bg-sakura-pink-soft text-sakura-purple-dark"
                  : "text-sakura-purple-dark/70 hover:bg-sakura-pink-soft"
              }`
            }
          >
            {modulo.label}
          </NavLink>
        ))}

        {operador?.admin && (
          <>
            <div className="my-2 border-t border-sakura-gray/20" />
            <NavLink
              to="/configuracoes"
              className={({ isActive }) =>
                `rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sakura-pink-soft text-sakura-purple-dark"
                    : "text-sakura-purple-dark/70 hover:bg-sakura-pink-soft"
                }`
              }
            >
              Configurações
            </NavLink>
          </>
        )}
      </nav>

      {operador && (
        <div className="border-t border-sakura-gray/20 px-6 py-4">
          <p className="text-sm font-medium text-sakura-purple-dark">
            {operador.nome}
          </p>
          <p className="text-xs text-sakura-gray">@{operador.usuario}</p>
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
