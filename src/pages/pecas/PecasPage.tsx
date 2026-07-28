import { useEffect, useState } from "react";
import { mensagemDeErro } from "@/lib/errors";
import { criarPeca, excluirPeca, listarPecas } from "@/lib/pecas";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { NovaPeca, Peca } from "@/types/peca";
import { PecaForm } from "./PecaForm";

function formatarPreco(valor: number | null): string {
  if (valor === null) return "—";
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function PecasPage() {
  const [pecas, setPecas] = useState<Peca[]>([]);
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
      setPecas(await listarPecas());
    } catch (err) {
      console.error("Erro ao carregar peças:", err);
      setErro(mensagemDeErro(err));
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function handleSalvar(peca: NovaPeca) {
    await criarPeca(peca);
    setMostrarFormulario(false);
    await carregar();
  }

  async function handleExcluir(id: string) {
    if (!confirm("Excluir esta peça?")) return;
    await excluirPeca(id);
    await carregar();
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-sakura-purple-dark">
            Peças
          </h1>
          <p className="text-sm text-sakura-gray">
            Cadastro de peças e produtos, com dados fiscais
          </p>
        </div>
        {!mostrarFormulario && (
          <button
            onClick={() => setMostrarFormulario(true)}
            className="rounded-xl bg-sakura-purple px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            + Nova peça
          </button>
        )}
      </header>

      {!isSupabaseConfigured && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          O Supabase ainda não está configurado. Defina{" "}
          <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code>{" "}
          no arquivo <code>.env</code> para começar a salvar peças de verdade.
        </p>
      )}

      {mostrarFormulario && (
        <PecaForm
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
      ) : pecas.length === 0 ? (
        <p className="text-sm text-sakura-gray">
          Nenhuma peça cadastrada ainda.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-sakura-gray/30 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-sakura-pink-soft text-sakura-purple-dark">
              <tr>
                <th className="px-4 py-3 font-medium">Descrição</th>
                <th className="px-4 py-3 font-medium">Código</th>
                <th className="px-4 py-3 font-medium">Unidade</th>
                <th className="px-4 py-3 font-medium">Preço custo</th>
                <th className="px-4 py-3 font-medium">Preço venda</th>
                <th className="px-4 py-3 font-medium">NCM</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {pecas.map((peca) => (
                <tr key={peca.id} className="border-t border-sakura-gray/20">
                  <td className="px-4 py-3">{peca.descricao}</td>
                  <td className="px-4 py-3">{peca.codigo_interno || "—"}</td>
                  <td className="px-4 py-3">{peca.unidade || "—"}</td>
                  <td className="px-4 py-3">{formatarPreco(peca.preco_custo)}</td>
                  <td className="px-4 py-3">{formatarPreco(peca.preco_venda)}</td>
                  <td className="px-4 py-3">{peca.ncm || "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleExcluir(peca.id)}
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
