import { useEffect, useState } from "react";
import { BotaoVoltar } from "@/components/BotaoVoltar";
import { useAuth } from "@/contexts/AuthContext";
import { listarCategoriasCaixa } from "@/lib/categoriasCaixa";
import {
  criarContaPagar,
  excluirContaPagar,
  listarContasPagar,
  pagarConta,
} from "@/lib/contasPagar";
import { mensagemDeErro } from "@/lib/errors";
import type { CategoriaCaixa } from "@/types/categoriaCaixa";
import type { ContaPagar, NovaContaPagar } from "@/types/contaPagar";
import { ContaPagarForm } from "./ContaPagarForm";
import { PagarContaModal } from "./PagarContaModal";

function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function hojeIso(): string {
  const hoje = new Date();
  return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(
    hoje.getDate(),
  ).padStart(2, "0")}`;
}

export function ContasPagarPage() {
  const { operador } = useAuth();
  const [contas, setContas] = useState<ContaPagar[]>([]);
  const [categorias, setCategorias] = useState<CategoriaCaixa[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [contaPagando, setContaPagando] = useState<ContaPagar | null>(null);

  async function carregar() {
    setCarregando(true);
    setErro(null);
    try {
      const [listaContas, listaCategorias] = await Promise.all([
        listarContasPagar(),
        listarCategoriasCaixa(),
      ]);
      setContas(listaContas);
      setCategorias(listaCategorias);
    } catch (err) {
      console.error("Erro ao carregar contas a pagar:", err);
      setErro(mensagemDeErro(err));
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function handleCadastrar(conta: NovaContaPagar) {
    await criarContaPagar(conta);
    setMostrarFormulario(false);
    await carregar();
  }

  async function handleConfirmarPagamento(valorPago: number, formaPagamento: string) {
    if (!contaPagando || !operador) return;
    await pagarConta({
      conta: contaPagando,
      valorPago,
      formaPagamento,
      operadorId: operador.id,
    });
    setContaPagando(null);
    await carregar();
  }

  async function handleExcluir(conta: ContaPagar) {
    if (!confirm(`Excluir a conta "${conta.descricao}"?`)) return;
    try {
      await excluirContaPagar(conta.id);
      await carregar();
    } catch (err) {
      console.error("Erro ao excluir conta a pagar:", err);
      setErro(mensagemDeErro(err));
    }
  }

  const hoje = hojeIso();
  const pendentes = contas
    .filter((c) => c.status === "pendente")
    .sort((a, b) => a.vencimento.localeCompare(b.vencimento));
  const pagas = contas
    .filter((c) => c.status === "paga")
    .sort((a, b) => b.vencimento.localeCompare(a.vencimento));
  const totalPendente = pendentes.reduce((soma, c) => soma + c.valor, 0);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BotaoVoltar />
          <div>
            <h1 className="text-2xl font-semibold text-sakura-purple-dark">Contas a Pagar</h1>
            <p className="text-sm text-sakura-muted">
              Contas mensais (aluguel, etc.) com vencimento — diferente das Entradas/Saídas
              manuais do Caixa
            </p>
          </div>
        </div>
        {!mostrarFormulario && (
          <button
            onClick={() => setMostrarFormulario(true)}
            className="rounded-xl bg-sakura-purple px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            + Nova conta
          </button>
        )}
      </header>

      {erro && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</p>}

      {mostrarFormulario && (
        <ContaPagarForm
          categorias={categorias}
          onSalvar={handleCadastrar}
          onCancelar={() => setMostrarFormulario(false)}
        />
      )}

      {!carregando && (
        <div className="sakura-card p-4">
          <p className="text-xs text-sakura-muted">Total pendente</p>
          <p className="text-xl font-semibold text-sakura-purple-dark">
            {formatarMoeda(totalPendente)}
          </p>
        </div>
      )}

      {carregando ? (
        <p className="text-sm text-sakura-muted">Carregando...</p>
      ) : (
        <>
          <section>
            <h2 className="mb-3 text-sm font-semibold text-sakura-purple-dark">Pendentes</h2>
            {pendentes.length === 0 ? (
              <p className="text-sm text-sakura-muted">Nenhuma conta pendente.</p>
            ) : (
              <div className="overflow-hidden sakura-card">
                <table className="w-full text-left text-sm">
                  <thead className="bg-sakura-pink-soft text-sakura-purple-dark">
                    <tr>
                      <th className="px-4 py-3 font-medium">Vencimento</th>
                      <th className="px-4 py-3 font-medium">Descrição</th>
                      <th className="px-4 py-3 font-medium">Categoria</th>
                      <th className="px-4 py-3 font-medium">Valor</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {pendentes.map((conta) => {
                      const vencida = conta.vencimento < hoje;
                      return (
                        <tr key={conta.id} className="border-t border-sakura-gray/20">
                          <td className="px-4 py-3">
                            {new Date(conta.vencimento).toLocaleDateString("pt-BR")}
                          </td>
                          <td className="px-4 py-3">
                            {conta.descricao}
                            {conta.recorrente && (
                              <span className="ml-2 rounded-full bg-sakura-pink-soft px-2 py-0.5 text-xs text-sakura-purple-dark/90">
                                mensal
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">{conta.categoria?.nome ?? "—"}</td>
                          <td className="px-4 py-3 font-medium">{formatarMoeda(conta.valor)}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                vencida
                                  ? "bg-red-50 text-red-700"
                                  : "bg-amber-50 text-amber-700"
                              }`}
                            >
                              {vencida ? "Vencida" : "Pendente"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-3">
                              <button
                                onClick={() => setContaPagando(conta)}
                                className="text-xs font-medium text-sakura-purple hover:underline"
                              >
                                Marcar como paga
                              </button>
                              <button
                                onClick={() => handleExcluir(conta)}
                                className="text-xs font-medium text-red-600 hover:underline"
                              >
                                Excluir
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {pagas.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-semibold text-sakura-purple-dark">
                Pagas recentemente
              </h2>
              <div className="overflow-hidden sakura-card">
                <table className="w-full text-left text-sm">
                  <thead className="bg-sakura-pink-soft text-sakura-purple-dark">
                    <tr>
                      <th className="px-4 py-3 font-medium">Vencimento</th>
                      <th className="px-4 py-3 font-medium">Descrição</th>
                      <th className="px-4 py-3 font-medium">Categoria</th>
                      <th className="px-4 py-3 font-medium">Valor</th>
                      <th className="px-4 py-3 font-medium">Pago em</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagas.map((conta) => (
                      <tr key={conta.id} className="border-t border-sakura-gray/20">
                        <td className="px-4 py-3">
                          {new Date(conta.vencimento).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="px-4 py-3">{conta.descricao}</td>
                        <td className="px-4 py-3">{conta.categoria?.nome ?? "—"}</td>
                        <td className="px-4 py-3 font-medium">{formatarMoeda(conta.valor)}</td>
                        <td className="px-4 py-3">
                          {conta.data_pagamento
                            ? new Date(conta.data_pagamento).toLocaleDateString("pt-BR")
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </>
      )}

      {contaPagando && (
        <PagarContaModal
          conta={contaPagando}
          onConfirmar={handleConfirmarPagamento}
          onFechar={() => setContaPagando(null)}
        />
      )}
    </div>
  );
}
