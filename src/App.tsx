import { Navigate, Route, Routes } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { ClientesPage } from "./pages/clientes/ClientesPage";
import { PecasPage } from "./pages/pecas/PecasPage";

export default function App() {
  return (
    <div className="flex min-h-screen bg-sakura-bg">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <Routes>
          <Route path="/" element={<Navigate to="/clientes" replace />} />
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/pecas" element={<PecasPage />} />
        </Routes>
      </main>
    </div>
  );
}
