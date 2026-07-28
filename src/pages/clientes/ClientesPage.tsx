import { useEffect, useState } from "react";
import { criarCliente, excluirCliente, listarClientes } from "@/lib/clientes";
import { mensagemDeErro } from "@/lib/errors";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { Cliente, NovoCliente, NovoVeiculo } from "@/types/cliente";
import { ClienteForm } from "./ClienteForm";

export function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  async function carregar() {
    if (!isSupabaseConfigured) {
      setCarregando(false);
      return;
    }
    setCarregando(true);
    setErro(null);
    try {
      setClientes(await listarClientes());
    } catch (err) {
      console.error("Erro ao carregar clientes:", err);
      setErro(mensagemDeErro(err));
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function handleSalvar(cliente: NovoCliente, veiculos: NovoVeiculo[]) {
    await criarCliente(cliente, veiculos);
    setMostrarFormulario(false);
    await carregar();
  }

  async function handleExcluir(id: string) {
    if (!confirm("Excluir este cliente?")) return;
    try {
      await excluirCliente(id);
      await carregar();
    } catch (err) {
      console.error("Erro ao excluir cliente:", err);
      const mensagem = mensagemDeErro(err);
      setErro(
        mensagem.includes("ordens_servico")
          ? "Não é possível excluir esse cliente porque ele já tem Ordens de Serviço vinculadas."
          : mensagem,
      );
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-sakura-purple-dark">
            Clientes
          </h1>
          <p className="text-sm text-sakura-gray">
            Cadastro de clientes e veículos
          </p>
        </div>
        {!mostrarFormulario && (
          <button
            onClick={() => setMostrarFormulario(true)}
            className="rounded-xl bg-sakura-purple px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            + Novo cliente
          </button>
        )}
      </header>

      {!isSupabaseConfigured && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          O Supabase ainda não está configurado. Defina{" "}
          <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code>{" "}
          no arquivo <code>.env</code> para começar a salvar clientes de verdade.
        </p>
      )}

      {mostrarFormulario && (
        <ClienteForm
          onSalvar={handleSalvar}
          onCancelar={() => setMostrarFormulario(false)}
        />
      )}

      {erro && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {erro}
        </p>
      )}

      {carregando ? (
        <p className="text-sm text-sakura-gray">Carregando...</p>
      ) : clientes.length === 0 ? (
        <p className="text-sm text-sakura-gray">
          Nenhum cliente cadastrado ainda.
        </p>
      ) : (
        <div className="overflow-hidden sakura-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-sakura-pink-soft text-sakura-purple-dark">
              <tr>
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">Telefone</th>
                <th className="px-4 py-3 font-medium">Veículos</th>
                <th className="px-4 py-3 font-medium">Cidade/UF</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id} className="border-t border-sakura-gray/20">
                  <td className="px-4 py-3">{cliente.nome}</td>
                  <td className="px-4 py-3">{cliente.telefone || "—"}</td>
                  <td className="px-4 py-3">
                    {cliente.veiculos?.map((v) => v.placa).join(", ") || "—"}
                  </td>
                  <td className="px-4 py-3">
                    {cliente.cidade ? `${cliente.cidade}/${cliente.uf ?? ""}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleExcluir(cliente.id)}
                      className="text-xs font-medium text-red-600 hover:underline"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
