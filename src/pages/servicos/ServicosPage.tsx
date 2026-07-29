import { useEffect, useState } from "react";
import { BotaoVoltar } from "@/components/BotaoVoltar";
import { mensagemDeErro } from "@/lib/errors";
import {
  atualizarStatusServico,
  criarServico,
  excluirServico,
  listarServicos,
} from "@/lib/servicos";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { NovoServico, Servico } from "@/types/servico";
import { ServicoForm } from "./ServicoForm";

function formatarPreco(valor: number | null): string {
  if (valor === null) return "—";
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function ServicosPage() {
  const [servicos, setServicos] = useState<Servico[]>([]);
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
      setServicos(await listarServicos());
    } catch (err) {
      console.error("Erro ao carregar serviços:", err);
      setErro(mensagemDeErro(err));
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function handleSalvar(servico: NovoServico) {
    await criarServico(servico);
    setMostrarFormulario(false);
    await carregar();
  }

  async function handleExcluir(id: string) {
    if (!confirm("Excluir este serviço?")) return;
    try {
      await excluirServico(id);
      await carregar();
    } catch (err) {
      console.error("Erro ao excluir serviço:", err);
      setErro(mensagemDeErro(err));
    }
  }

  async function handleAlternarStatus(servico: Servico) {
    try {
      await atualizarStatusServico(servico.id, !servico.ativo);
      await carregar();
    } catch (err) {
      console.error("Erro ao atualizar status do serviço:", err);
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
              Serviços
            </h1>
            <p className="text-sm text-sakura-gray">
              Catálogo de serviços oferecidos, com preço padrão
            </p>
          </div>
        </div>
        {!mostrarFormulario && (
          <button
            onClick={() => setMostrarFormulario(true)}
            className="rounded-xl bg-sakura-purple px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            + Novo serviço
          </button>
        )}
      </header>

      {!isSupabaseConfigured && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          O Supabase ainda não está configurado. Defina{" "}
          <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code>{" "}
          no arquivo <code>.env</code> para começar a cadastrar serviços de verdade.
        </p>
      )}

      {mostrarFormulario && (
        <ServicoForm
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
      ) : servicos.length === 0 ? (
        <p className="text-sm text-sakura-gray">
          Nenhum serviço cadastrado ainda.
        </p>
      ) : (
        <div className="overflow-hidden sakura-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-sakura-pink-soft text-sakura-purple-dark">
              <tr>
                <th className="px-4 py-3 font-medium">Descrição</th>
                <th className="px-4 py-3 font-medium">Código</th>
                <th className="px-4 py-3 font-medium">Preço padrão</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {servicos.map((servico) => (
                <tr key={servico.id} className="border-t border-sakura-gray/20">
                  <td className="px-4 py-3">{servico.descricao}</td>
                  <td className="px-4 py-3">{servico.codigo_interno || "—"}</td>
                  <td className="px-4 py-3">{formatarPreco(servico.preco_padrao)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        servico.ativo
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-sakura-gray/20 text-sakura-gray"
                      }`}
                    >
                      {servico.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => handleAlternarStatus(servico)}
                        className="text-xs font-medium text-sakura-purple hover:underline"
                      >
                        {servico.ativo ? "Inativar" : "Reativar"}
                      </button>
                      <button
                        onClick={() => handleExcluir(servico.id)}
                        className="text-xs font-medium text-red-600 hover:underline"
                      >
                        Excluir
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
