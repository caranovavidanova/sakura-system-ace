import { Navigate, Route, Routes } from "react-router-dom";
import { AdminRoute, PermissaoRoute } from "./components/PermissaoRoute";
import { Sidebar } from "./components/Sidebar";
import { useAuth } from "./contexts/AuthContext";
import { CaixaPage } from "./pages/caixa/CaixaPage";
import { ClientesPage } from "./pages/clientes/ClientesPage";
import { ConfiguracoesPage } from "./pages/configuracoes/ConfiguracoesPage";
import { EstoquePage } from "./pages/estoque/EstoquePage";
import { LoginPage } from "./pages/login/LoginPage";
import { LucratividadePage } from "./pages/lucratividade/LucratividadePage";
import { OrdensServicoPage } from "./pages/ordens-servico/OrdensServicoPage";
import { PainelPage } from "./pages/painel/PainelPage";
import { RelatoriosPage } from "./pages/relatorios/RelatoriosPage";
import { ServicosPage } from "./pages/servicos/ServicosPage";
import { MODULOS, temPermissao } from "./types/operador";

// Se o operador não tiver permissão pro Início (o "/" padrão),
// manda ele direto pro primeiro módulo que ele acessa, em vez de cair numa
// tela de "sem permissão" logo depois de fazer login.
function PaginaInicial() {
  const { operador } = useAuth();

  if (temPermissao(operador, "painel")) {
    return <PainelPage />;
  }

  const primeiroModulo = MODULOS.find(
    (modulo) => modulo.chave !== "painel" && temPermissao(operador, modulo.chave),
  );
  if (primeiroModulo) {
    return <Navigate to={primeiroModulo.rota} replace />;
  }

  return (
    <div className="rounded-2xl border border-sakura-gray/30 bg-white p-8 text-center">
      <p className="text-sm text-sakura-gray">
        Nenhum módulo liberado para o seu usuário. Fale com o administrador.
      </p>
    </div>
  );
}

export default function App() {
  const { carregando, session } = useAuth();

  if (carregando) {
    return (
      <div className="flex h-screen items-center justify-center bg-sakura-bg">
        <p className="text-sm text-sakura-gray">Carregando...</p>
      </div>
    );
  }

  if (!session) {
    return <LoginPage />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-sakura-bg">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <Routes>
          <Route path="/" element={<PaginaInicial />} />
          <Route
            path="/clientes"
            element={
              <PermissaoRoute modulo="clientes">
                <ClientesPage />
              </PermissaoRoute>
            }
          />
          <Route
            path="/estoque"
            element={
              <PermissaoRoute modulo="estoque">
                <EstoquePage />
              </PermissaoRoute>
            }
          />
          <Route
            path="/servicos"
            element={
              <PermissaoRoute modulo="servicos">
                <ServicosPage />
              </PermissaoRoute>
            }
          />
          <Route
            path="/ordens-servico"
            element={
              <PermissaoRoute modulo="ordens_servico">
                <OrdensServicoPage />
              </PermissaoRoute>
            }
          />
          <Route
            path="/caixa"
            element={
              <PermissaoRoute modulo="caixa">
                <CaixaPage />
              </PermissaoRoute>
            }
          />
          <Route
            path="/relatorios"
            element={
              <PermissaoRoute modulo="relatorios">
                <RelatoriosPage />
              </PermissaoRoute>
            }
          />
          <Route
            path="/lucratividade"
            element={
              <PermissaoRoute modulo="lucratividade">
                <LucratividadePage />
              </PermissaoRoute>
            }
          />
          <Route
            path="/configuracoes"
            element={
              <AdminRoute>
                <ConfiguracoesPage />
              </AdminRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
