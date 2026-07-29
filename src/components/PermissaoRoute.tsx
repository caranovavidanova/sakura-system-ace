import type { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { temPermissao } from "@/types/operador";
import type { ModuloChave } from "@/types/operador";

function AcessoNegado() {
  return (
    <div className="sakura-card p-8 text-center">
      <p className="text-sm text-sakura-purple-dark/90">
        Você não tem permissão para acessar este módulo. Fale com o administrador.
      </p>
    </div>
  );
}

export function PermissaoRoute({
  modulo,
  children,
}: {
  modulo: ModuloChave;
  children: ReactNode;
}) {
  const { operador } = useAuth();
  if (!temPermissao(operador, modulo)) return <AcessoNegado />;
  return <>{children}</>;
}

export function AdminRoute({ children }: { children: ReactNode }) {
  const { operador } = useAuth();
  if (!operador?.admin) return <AcessoNegado />;
  return <>{children}</>;
}
