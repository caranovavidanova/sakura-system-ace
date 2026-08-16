import { useState } from "react";
import { mensagemDeErro } from "@/lib/errors";
import { cancelarPedido, criarPedido, receberItensPedido } from "@/lib/pedidosCompra";
import type { RecebimentoItem } from "@/lib/pedidosCompra";
import type { Fornecedor } from "@/types/fornecedor";
import type { NovoItemPedidoCompra, NovoPedidoCompra, PedidoCompra } from "@/types/pedidoCompra";
import { nomePedido, STATUS_PEDIDO_COR, STATUS_PEDIDO_LABEL, totalPedido } from "@/types/pedidoCompra";
import type { Peca } from "@/types/peca";
import { PedidoCompraForm } from "./PedidoCompraForm";
import { ReceberPedidoModal } from "./ReceberPedidoModal";

interface PedidosCompraSectionProps {
  pedidos: PedidoCompra[];
  fornecedores: Fornecedor[];
  pecas: Peca[];
  lojaId: string;
  operadorId: string | null;
  onRecarregar: () => Promise<void>;
}

function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function PedidosCompraSection({
  pedidos,
  fornecedores,
  pecas,
  lojaId,
  operadorId,
  onRecarregar,
}: PedidosCompraSectionProps) {
  const [erro, setErro] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [pedidoRecebendo, setPedidoRecebendo] = useState<PedidoCompra | null>(null);

  async function handleSalvar(pedido: NovoPedidoCompra, itens: NovoItemPedidoCompra[]) {
    await criarPedido(pedido, itens, lojaId, operadorId);
    setMostrarFormulario(false);
    await onRecarregar();
  }

  async function handleReceber(recebimentos: RecebimentoItem[]) {
    if (!pedidoRecebendo) return;
    await receberItensPedido(pedidoRecebendo, recebimentos, lojaId);
    setPedidoRecebendo(null);
    await onRecarregar();
  }

  async function handleCancelar(pedido: PedidoCompra) {
    if (!confirm(`Cancelar ${nomePedido(pedido.numero)}? Isso não pode ser desfeito.`)) return;
    try {
      await cancelarPedido(pedido.id);
      await onRecarregar();
    } catch (err) {
      console.error("Erro ao cancelar pedido de compra:", err);
      setErro(mensagemDeErro(err));
    }
  }

  return (
    <div className="space-y-6">
      {!mostrarFormulario && (
        <div className="flex justify-end">
          <button
            onClick={() => setMostrarFormulario(true)}
            disabled={fornecedores.length === 0 || pecas.length === 0}
            className="rounded-xl bg-sakura-purple px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            + Novo pedido
          </button>
        </div>
      )}

      {fornecedores.length === 0 && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Cadastre ao menos um fornecedor na aba "Cadastro" antes de criar um pedido de compra.
        </p>
      )}
      {fornecedores.length > 0 && pecas.length === 0 && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Cadastre ao menos um produto em Estoque → Produtos antes de criar um pedido de compra.
        </p>
      )}

      {mostrarFormulario && (
        <PedidoCompraForm
          fornecedores={fornecedores}
          pecas={pecas}
          onSalvar={handleSalvar}
          onCancelar={() => setMostrarFormulario(false)}
        />
      )}

      {erro && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</p>}

      {pedidos.length === 0 ? (
        <p className="text-sm text-sakura-muted">Nenhum pedido de compra registrado ainda.</p>
      ) : (
        <div className="overflow-hidden sakura-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-sakura-pink-soft text-sakura-purple-dark">
              <tr>
                <th className="px-4 py-3 font-medium">Nº</th>
                <th className="px-4 py-3 font-medium">Fornecedor</th>
                <th className="px-4 py-3 font-medium">Data</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido.id} className="border-t border-sakura-gray/20">
                  <td className="px-4 py-3 text-sakura-purple-dark">{nomePedido(pedido.numero)}</td>
                  <td className="px-4 py-3 text-sakura-purple-dark">
                    {pedido.fornecedor?.nome ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-sakura-purple-dark">
                    {new Date(pedido.data_pedido).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-3 text-sakura-purple-dark">
                    {formatarMoeda(totalPedido(pedido.itens ?? []))}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_PEDIDO_COR[pedido.status]}`}
                    >
                      {STATUS_PEDIDO_LABEL[pedido.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      {(pedido.status === "pendente" || pedido.status === "parcial") && (
                        <>
                          <button
                            onClick={() => setPedidoRecebendo(pedido)}
                            className="text-xs font-medium text-sakura-purple hover:underline"
                          >
                            Receber
                          </button>
                          <button
                            onClick={() => handleCancelar(pedido)}
                            className="text-xs font-medium text-red-600 hover:underline"
                          >
                            Cancelar
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pedidoRecebendo && (
        <ReceberPedidoModal
          pedido={pedidoRecebendo}
          onConfirmar={handleReceber}
          onFechar={() => setPedidoRecebendo(null)}
        />
      )}
    </div>
  );
}
