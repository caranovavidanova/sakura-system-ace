import { NavLink } from "react-router-dom";
import { Logo } from "./Logo";

interface ModuloLink {
  label: string;
  path: string;
  disponivel: boolean;
}

const modulos: ModuloLink[] = [
  { label: "Painel de Controle", path: "/", disponivel: true },
  { label: "Clientes", path: "/clientes", disponivel: true },
  { label: "Peças", path: "/pecas", disponivel: true },
  { label: "Estoque", path: "/estoque", disponivel: true },
  { label: "Ordens de Serviço", path: "/ordens-servico", disponivel: true },
  { label: "Caixa Diário", path: "/caixa", disponivel: true },
  { label: "Relatórios", path: "/relatorios", disponivel: true },
  { label: "Lucratividade", path: "/lucratividade", disponivel: true },
];

export function Sidebar() {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col overflow-y-auto border-r border-sakura-gray/40 bg-white">
      <div className="px-6 py-6">
        <Logo />
        <p className="mt-1 text-xs text-sakura-gray">AutoCenter Edition</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {modulos.map((modulo) =>
          modulo.disponivel ? (
            <NavLink
              key={modulo.path}
              to={modulo.path}
              end={modulo.path === "/"}
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
          ) : (
            <div
              key={modulo.path}
              className="flex items-center justify-between rounded-xl px-4 py-2.5 text-sm text-sakura-gray"
              title="Em breve"
            >
              <span>{modulo.label}</span>
              <span className="rounded-full bg-sakura-gray/20 px-2 py-0.5 text-[10px]">
                em breve
              </span>
            </div>
          ),
        )}
      </nav>
    </aside>
  );
}
