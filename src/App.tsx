import { Route, Routes } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { PainelPage } from "./pages/painel/PainelPage";
import { ClientesPage } from "./pages/clientes/ClientesPage";
import { EstoquePage } from "./pages/estoque/EstoquePage";
import { OrdensServicoPage } from "./pages/ordens-servico/OrdensServicoPage";
import { CaixaPage } from "./pages/caixa/CaixaPage";
import { RelatoriosPage } from "./pages/relatorios/RelatoriosPage";
import { LucratividadePage } from "./pages/lucratividade/LucratividadePage";

export default function App() {
  return (
    <div className="flex h-screen overflow-hidden bg-sakura-bg">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <Routes>
          <Route path="/" element={<PainelPage />} />
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/estoque" element={<EstoquePage />} />
          <Route path="/ordens-servico" element={<OrdensServicoPage />} />
          <Route path="/caixa" element={<CaixaPage />} />
          <Route path="/relatorios" element={<RelatoriosPage />} />
          <Route path="/lucratividade" element={<LucratividadePage />} />
        </Routes>
      </main>
    </div>
  );
}
