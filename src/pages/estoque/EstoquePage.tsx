import { useEffect, useState } from "react";
import { mensagemDeErro } from "@/lib/errors";
import { calcularSaldoPorPeca, criarMovimento, listarMovimentos } from "@/lib/estoque";
import { listarPecas } from "@/lib/pecas";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { MovimentoEstoque, NovoMovimentoEstoque } from "@/types/estoque";
import type { Peca } from "@/types/peca";
import { MovimentoForm } from "./MovimentoForm";

const motivoLabel: Record<string, string> = {
  compra: "Compra",
  venda: "Venda",
  ajuste: "Ajuste manual",
  uso_em_os: "Uso em OS",
};

export function EstoquePage() {
  const [pecas, setPecas] = useState<Peca[]>([]);
  const [movimentos, setMovimentos] = useState<MovimentoEstoque[]>([]);
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
      const [pecasCarregadas, movimentosCarregados] = await Promise.all([
        listarPecas(),
        listarMovimentos(),
      ]);
      setPecas(pecasCarregadas);
      setMovimentos(movimentosCarregados);
    } catch (err) {
      console.error("Erro ao carregar estoque:", err);
      setErro(mensagemDeErro(err));
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function handleSalvar(movimento: NovoMovimentoEstoque) {
    await criarMovimento(movimento);
    await carregar();
  }

  const saldos = calcularSaldoPorPeca(movimentos);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-sakura-purple-dark">
            Estoque
          </h1>
          <p className="text-sm text-sakura-gray">
            Entradas e saídas de peças
          </p>
        </div>
        {pecas.length > 0 && !mostrarFormulario && (
          <button
            onClick={() => setMostrarFormulario(true)}
            className="rounded-xl bg-sakura-purple px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            + Registrar movimentação
          </button>
        )}
      </header>

      {!isSupabaseConfigured && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          O Supabase ainda não está configurado. Defina{" "}
          <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code>{" "}
          no arquivo <code>.env</code> para começar a registrar movimentações de verdade.
        </p>
      )}

      {isSupabaseConfigured && !carregando && pecas.length === 0 && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Cadastre ao menos uma peça em "Peças" antes de registrar movimentações de estoque.
        </p>
      )}

      {mostrarFormulario && (
        <MovimentoForm
          pecas={pecas}
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
      ) : (
        <>
          <section>
            <h2 className="mb-3 text-sm font-semibold text-sakura-purple-dark">
              Saldo atual por peça
            </h2>
            {pecas.length === 0 ? (
              <p className="text-sm text-sakura-gray">Nenhuma peça cadastrada ainda.</p>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-sakura-gray/30 bg-white">
                <table className="w-full text-left text-sm">
                  <thead className="bg-sakura-pink-soft text-sakura-purple-dark">
                    <tr>
                      <th className="px-4 py-3 font-medium">Peça</th>
                      <th className="px-4 py-3 font-medium">Unidade</th>
                      <th className="px-4 py-3 font-medium">Saldo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pecas.map((peca) => (
                      <tr key={peca.id} className="border-t border-sakura-gray/20">
                        <td className="px-4 py-3">{peca.descricao}</td>
                        <td className="px-4 py-3">{peca.unidade || "—"}</td>
                        <td className="px-4 py-3 font-medium">
                          {saldos.get(peca.id) ?? 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold text-sakura-purple-dark">
              Histórico de movimentações
            </h2>
            {movimentos.length === 0 ? (
              <p className="text-sm text-sakura-gray">Nenhuma movimentação registrada ainda.</p>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-sakura-gray/30 bg-white">
                <table className="w-full text-left text-sm">
                  <thead className="bg-sakura-pink-soft text-sakura-purple-dark">
                    <tr>
                      <th className="px-4 py-3 font-medium">Data</th>
                      <th className="px-4 py-3 font-medium">Peça</th>
                      <th className="px-4 py-3 font-medium">Tipo</th>
                      <th className="px-4 py-3 font-medium">Quantidade</th>
                      <th className="px-4 py-3 font-medium">Motivo</th>
                      <th className="px-4 py-3 font-medium">Referência</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movimentos.map((movimento) => {
                      const peca = pecas.find((p) => p.id === movimento.peca_id);
                      return (
                        <tr key={movimento.id} className="border-t border-sakura-gray/20">
                          <td className="px-4 py-3">
                            {new Date(movimento.criado_em).toLocaleString("pt-BR")}
                          </td>
                          <td className="px-4 py-3">{peca?.descricao ?? "—"}</td>
                          <td className="px-4 py-3">
                            {movimento.tipo === "entrada" ? "Entrada" : "Saída"}
                          </td>
                          <td className="px-4 py-3">{movimento.quantidade}</td>
                          <td className="px-4 py-3">{motivoLabel[movimento.motivo]}</td>
                          <td className="px-4 py-3">{movimento.referencia || "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
