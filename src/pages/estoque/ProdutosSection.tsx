import { useState } from "react";
import { atualizarStatusPeca, criarPeca, excluirPeca } from "@/lib/pecas";
import { criarMovimento } from "@/lib/estoque";
import { mensagemDeErro } from "@/lib/errors";
import type { Categoria } from "@/types/categoria";
import type { NovaPeca, Peca } from "@/types/peca";
import { ImportarNotasFiscaisModal } from "./ImportarNotasFiscaisModal";
import { PecaForm } from "./PecaForm";

function IconeCamera({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

interface ProdutosSectionProps {
  pecas: Peca[];
  categorias: Categoria[];
  saldos: Map<string, number>;
  onRecarregar: () => Promise<void>;
}

function formatarPreco(valor: number | null): string {
  if (valor === null) return "—";
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function ProdutosSection({
  pecas,
  categorias,
  saldos,
  onRecarregar,
}: ProdutosSectionProps) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarImportar, setMostrarImportar] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSalvar(peca: NovaPeca, quantidadeInicial: number | null) {
    const pecaCriada = await criarPeca(peca);
    if (quantidadeInicial && quantidadeInicial > 0) {
      await criarMovimento({
        peca_id: pecaCriada.id,
        tipo: "entrada",
        quantidade: quantidadeInicial,
        motivo: "ajuste",
        referencia: "Estoque inicial (cadastro do produto)",
      });
    }
    setMostrarFormulario(false);
    await onRecarregar();
  }

  async function handleExcluir(id: string) {
    if (!confirm("Excluir este produto?")) return;
    try {
      await excluirPeca(id);
      await onRecarregar();
    } catch (err) {
      console.error("Erro ao excluir produto:", err);
      setErro(mensagemDeErro(err));
    }
  }

  async function handleAlternarStatus(peca: Peca) {
    try {
      await atualizarStatusPeca(peca.id, !peca.ativo);
      await onRecarregar();
    } catch (err) {
      console.error("Erro ao atualizar status do produto:", err);
      setErro(mensagemDeErro(err));
    }
  }

  return (
    <div className="space-y-6">
      {!mostrarFormulario && (
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setMostrarImportar(true)}
            className="flex items-center gap-2 rounded-xl border border-sakura-purple/40 px-5 py-2.5 text-sm font-medium text-sakura-purple-dark hover:bg-sakura-gray/10"
          >
            <IconeCamera className="h-4 w-4" />
            Importar por foto/PDF
          </button>
          <button
            onClick={() => setMostrarFormulario(true)}
            className="rounded-xl bg-sakura-purple px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            + Novo produto
          </button>
        </div>
      )}

      {mostrarFormulario && (
        <PecaForm
          categorias={categorias}
          onSalvar={handleSalvar}
          onCancelar={() => setMostrarFormulario(false)}
        />
      )}

      {mostrarImportar && (
        <ImportarNotasFiscaisModal
          categorias={categorias}
          onFechar={() => setMostrarImportar(false)}
          onImportado={onRecarregar}
        />
      )}

      {erro && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {erro}
        </p>
      )}

      {pecas.length === 0 ? (
        <p className="text-sm text-sakura-muted">
          Nenhum produto cadastrado ainda.
        </p>
      ) : (
        <div className="overflow-hidden sakura-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-sakura-pink-soft text-sakura-purple-dark">
              <tr>
                <th className="px-4 py-3 font-medium">Descrição</th>
                <th className="px-4 py-3 font-medium">Categoria</th>
                <th className="px-4 py-3 font-medium">Código</th>
                <th className="px-4 py-3 font-medium">Unidade</th>
                <th className="px-4 py-3 font-medium">Preço custo</th>
                <th className="px-4 py-3 font-medium">Preço venda</th>
                <th className="px-4 py-3 font-medium">Estoque atual</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {pecas.map((peca) => (
                <tr key={peca.id} className="border-t border-sakura-gray/20">
                  <td className="px-4 py-3">{peca.descricao}</td>
                  <td className="px-4 py-3">
                    {categorias.find((c) => c.id === peca.categoria_id)?.nome ?? "—"}
                  </td>
                  <td className="px-4 py-3">{peca.codigo_interno || "—"}</td>
                  <td className="px-4 py-3">{peca.unidade || "—"}</td>
                  <td className="px-4 py-3">{formatarPreco(peca.preco_custo)}</td>
                  <td className="px-4 py-3">{formatarPreco(peca.preco_venda)}</td>
                  <td className="px-4 py-3 font-medium">{saldos.get(peca.id) ?? 0}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        peca.ativo
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-sakura-gray/20 text-sakura-muted"
                      }`}
                    >
                      {peca.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => handleAlternarStatus(peca)}
                        className="text-xs font-medium text-sakura-purple hover:underline"
                      >
                        {peca.ativo ? "Inativar" : "Reativar"}
                      </button>
                      <button
                        onClick={() => handleExcluir(peca.id)}
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
