import { useEffect, useState } from "react";
import { BotaoVoltar } from "@/components/BotaoVoltar";
import { mensagemDeErro } from "@/lib/errors";
import {
  atualizarFuncionario,
  criarFuncionario,
  listarFuncionarios,
} from "@/lib/funcionarios";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { Funcionario, NovoFuncionario, NovoFuncionarioFilho } from "@/types/funcionario";
import { FuncionarioForm } from "./FuncionarioForm";

export function FuncionariosPage() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [formulario, setFormulario] = useState<"novo" | Funcionario | null>(null);

  async function carregar() {
    if (!isSupabaseConfigured) {
      setCarregando(false);
      return;
    }
    setCarregando(true);
    setErro(null);
    try {
      setFuncionarios(await listarFuncionarios());
    } catch (err) {
      console.error("Erro ao carregar funcionários:", err);
      setErro(mensagemDeErro(err));
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function handleSalvar(funcionario: NovoFuncionario, filhos: NovoFuncionarioFilho[]) {
    if (formulario && formulario !== "novo") {
      await atualizarFuncionario(formulario.id, funcionario, filhos);
    } else {
      await criarFuncionario(funcionario, filhos);
    }
    setFormulario(null);
    await carregar();
  }

  async function handleAlternarStatus(funcionario: Funcionario) {
    try {
      await atualizarFuncionario(funcionario.id, { ativo: !funcionario.ativo });
      await carregar();
    } catch (err) {
      console.error("Erro ao atualizar status do funcionário:", err);
      setErro(mensagemDeErro(err));
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BotaoVoltar />
          <div>
            <h1 className="text-2xl font-semibold text-sakura-purple-dark">
              Funcionários
            </h1>
            <p className="text-sm text-sakura-gray">
              Técnicos, vendedores e demais funcionários — selecionáveis na Ordem de Serviço
            </p>
          </div>
        </div>
        {!formulario && (
          <button
            onClick={() => setFormulario("novo")}
            className="rounded-xl bg-sakura-purple px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            + Novo funcionário
          </button>
        )}
      </header>

      {!isSupabaseConfigured && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          O Supabase ainda não está configurado. Defina{" "}
          <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code>{" "}
          no arquivo <code>.env</code> para começar a cadastrar funcionários de verdade.
        </p>
      )}

      {formulario && (
        <FuncionarioForm
          funcionarioExistente={formulario === "novo" ? undefined : formulario}
          onSalvar={handleSalvar}
          onCancelar={() => setFormulario(null)}
        />
      )}

      {erro && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</p>
      )}

      {carregando ? (
        <p className="text-sm text-sakura-gray">Carregando...</p>
      ) : funcionarios.length === 0 ? (
        <p className="text-sm text-sakura-gray">Nenhum funcionário cadastrado ainda.</p>
      ) : (
        <div className="overflow-hidden sakura-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-sakura-pink-soft text-sakura-purple-dark">
              <tr>
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">Cargo</th>
                <th className="px-4 py-3 font-medium">Login</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {funcionarios.map((funcionario) => (
                <tr key={funcionario.id} className="border-t border-sakura-gray/20">
                  <td className="px-4 py-3">{funcionario.nome}</td>
                  <td className="px-4 py-3">{funcionario.cargo || "—"}</td>
                  <td className="px-4 py-3">
                    {funcionario.operador?.usuario ? `@${funcionario.operador.usuario}` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        funcionario.ativo
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-sakura-gray/20 text-sakura-gray"
                      }`}
                    >
                      {funcionario.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setFormulario(funcionario)}
                        className="text-xs font-medium text-sakura-purple hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleAlternarStatus(funcionario)}
                        className="text-xs font-medium text-red-600 hover:underline"
                      >
                        {funcionario.ativo ? "Inativar" : "Reativar"}
                      </button>
                    </div>
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
