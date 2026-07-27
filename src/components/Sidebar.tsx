import { NavLink } from "react-router-dom";

interface ModuloLink {
  label: string;
  path: string;
  disponivel: boolean;
}

const modulos: ModuloLink[] = [
  { label: "Painel de Controle", path: "/", disponivel: false },
  { label: "Clientes", path: "/clientes", disponivel: true },
  { label: "Peças", path: "/pecas", disponivel: true },
  { label: "Estoque", path: "/estoque", disponivel: true },
  { label: "Ordens de Serviço", path: "/ordens-servico", disponivel: false },
  { label: "Caixa Diário", path: "/caixa", disponivel: false },
  { label: "Relatórios", path: "/relatorios", disponivel: false },
];

export function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r border-sakura-gray/40 bg-white">
      <div className="flex items-center gap-3 px-6 py-6">
        <img src="/sakura-icon.svg" alt="" className="h-9 w-9" />
        <div>
          <p className="text-sm font-semibold text-sakura-purple-dark">
            Sakura System
          </p>
          <p className="text-xs text-sakura-gray">AutoCenter Edition</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {modulos.map((modulo) =>
          modulo.disponivel ? (
            <NavLink
              key={modulo.path}
              to={modulo.path}
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

      <div className="px-6 py-4 text-[11px] text-sakura-gray">
        by Sakura Corp
      </div>
    </aside>
  );
}
