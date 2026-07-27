import { useEffect, useState } from "react";
import { mensagemDeErro } from "@/lib/errors";
import { listarClientes } from "@/lib/clientes";
import { criarOrdem, faturarOrdem, listarOrdens } from "@/lib/ordensServico";
import { listarPecas } from "@/lib/pecas";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { Cliente } from "@/types/cliente";
import type { NovaOrdemServico, NovoItemOS, OrdemServico } from "@/types/os";
import { totalOrdem } from "@/types/os";
import type { Peca } from "@/types/peca";
import { OrdemServicoForm } from "./OrdemServicoForm";

const statusLabel: Record<string, string> = {
  aberta: "Aberta",
  em_andamento: "Em andamento",
  concluida: "Concluída",
  faturada: "Faturada",
};

export function OrdensServicoPage() {
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [pecas, setPecas] = useState<Peca[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [ordemFaturando, setOrdemFaturando] = useState<OrdemServico | null>(null);
  const [formaPagamento, setFormaPagamento] = useState("pix");
  const [faturando, setFaturando] = useState(false);

  async function carregar() {
    if (!isSupabaseConfigured) {
      setCarregando(false);
      return;
    }
    setCarregando(true);
    setErro(null);
    try {
      const [ordensCarregadas, clientesCarregados, pecasCarregadas] = await Promise.all([
        listarOrdens(),
        listarClientes(),
        listarPecas(),
      ]);
      setOrdens(ordensCarregadas);
      setClientes(clientesCarregados);
      setPecas(pecasCarregadas);
    } catch (err) {
      console.error("Erro ao carregar ordens de serviço:", err);
      setErro(mensagemDeErro(err));
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function handleSalvar(ordem: NovaOrdemServico, itens: NovoItemOS[]) {
    await criarOrdem(ordem, itens);
    setMostrarFormulario(false);
    await carregar();
  }

  async function confirmarFaturamento() {
    if (!ordemFaturando) return;
    setFaturando(true);
    try {
      await faturarOrdem(ordemFaturando, formaPagamento);
      setOrdemFaturando(null);
      await carregar();
    } catch (err) {
      console.error("Erro ao faturar ordem de serviço:", err);
      setErro(mensagemDeErro(err));
    } finally {
      setFaturando(false);
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-sakura-purple-dark">
            Ordens de Serviço
          </h1>
          <p className="text-sm text-sakura-gray">
            Cliente + veículo + peças usadas + serviço realizado
          </p>
        </div>
        {clientes.length > 0 && !mostrarFormulario && (
          <button
            onClick={() => setMostrarFormulario(true)}
            className="rounded-xl bg-sakura-purple px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            + Nova ordem de serviço
          </button>
        )}
      </header>

      {!isSupabaseConfigured && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          O Supabase ainda não está configurado. Defina{" "}
          <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code>{" "}
          no arquivo <code>.env</code> para começar a abrir ordens de serviço de verdade.
        </p>
      )}

      {isSupabaseConfigured && !carregando && clientes.length === 0 && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Cadastre ao menos um cliente antes de abrir uma ordem de serviço.
        </p>
      )}

      {mostrarFormulario && (
        <OrdemServicoForm
          clientes={clientes}
          pecas={pecas}
          onSalvar={handleSalvar}
          onCancelar={() => setMostrarFormulario(false)}
        />
      )}

      {ordemFaturando && (
        <div className="space-y-4 rounded-2xl border border-sakura-gray/30 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-sakura-purple-dark">
            Faturar OS de {ordemFaturando.cliente?.nome ?? "cliente"} — total{" "}
            {totalOrdem(ordemFaturando.itens ?? []).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </h3>
          <label className="flex max-w-xs flex-col gap-1 text-sm">
            <span className="text-sakura-purple-dark/80">Forma de pagamento</span>
            <select
              value={formaPagamento}
              onChange={(e) => setFormaPagamento(e.target.value)}
              className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
            >
              <option value="dinheiro">Dinheiro</option>
              <option value="pix">Pix</option>
              <option value="cartao_debito">Cartão de débito</option>
              <option value="cartao_credito">Cartão de crédito</option>
            </select>
          </label>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setOrdemFaturando(null)}
              className="rounded-xl px-4 py-2 text-sm font-medium text-sakura-purple-dark/70 hover:bg-sakura-gray/10"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={confirmarFaturamento}
              disabled={faturando}
              className="rounded-xl bg-sakura-purple px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              {faturando ? "Faturando..." : "Confirmar faturamento"}
            </button>
          </div>
        </div>
      )}

      {erro && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {erro}
        </p>
      )}

      {carregando ? (
        <p className="text-sm text-sakura-gray">Carregando...</p>
      ) : ordens.length === 0 ? (
        <p className="text-sm text-sakura-gray">
          Nenhuma ordem de serviço aberta ainda.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-sakura-gray/30 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-sakura-pink-soft text-sakura-purple-dark">
              <tr>
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Veículo</th>
                <th className="px-4 py-3 font-medium">Aberta em</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {ordens.map((ordem) => (
                <tr key={ordem.id} className="border-t border-sakura-gray/20">
                  <td className="px-4 py-3">{ordem.cliente?.nome ?? "—"}</td>
                  <td className="px-4 py-3">{ordem.veiculo?.placa ?? "—"}</td>
                  <td className="px-4 py-3">
                    {new Date(ordem.data_abertura).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-3">{statusLabel[ordem.status]}</td>
                  <td className="px-4 py-3">
                    {totalOrdem(ordem.itens ?? []).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {ordem.status !== "faturada" && (
                      <button
                        onClick={() => {
                          setOrdemFaturando(ordem);
                          setFormaPagamento("pix");
                        }}
                        className="text-xs font-medium text-sakura-purple hover:underline"
                      >
                        Faturar
                      </button>
                    )}
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
