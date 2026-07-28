import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { listarJurosParcelas } from "@/lib/configuracoes";
import { mensagemDeErro } from "@/lib/errors";
import { listarClientes } from "@/lib/clientes";
import { listarOperadores } from "@/lib/operadores";
import {
  adicionarItensOrdem,
  atualizarOrdem,
  criarOrdem,
  faturarOrdem,
  listarOrdens,
} from "@/lib/ordensServico";
import { listarPecas } from "@/lib/pecas";
import { listarServicos } from "@/lib/servicos";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { Cliente } from "@/types/cliente";
import type { JurosParcela } from "@/types/configuracao";
import type { Operador } from "@/types/operador";
import type {
  NovaOrdemServico,
  NovoItemOS,
  OrdemServico,
  PatchOrdemServico,
} from "@/types/os";
import { STATUS_LABEL, totalOrdem } from "@/types/os";
import type { Peca } from "@/types/peca";
import type { Servico } from "@/types/servico";
import { FaturamentoCard } from "./FaturamentoCard";
import { OrdemServicoForm } from "./OrdemServicoForm";

export function OrdensServicoPage() {
  const { operador } = useAuth();
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [pecas, setPecas] = useState<Peca[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [operadores, setOperadores] = useState<Operador[]>([]);
  const [jurosParcelas, setJurosParcelas] = useState<JurosParcela[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [ordemEmEdicao, setOrdemEmEdicao] = useState<OrdemServico | null>(null);
  const [ordemFaturando, setOrdemFaturando] = useState<OrdemServico | null>(null);

  async function carregar() {
    if (!isSupabaseConfigured) {
      setCarregando(false);
      return;
    }
    setCarregando(true);
    setErro(null);
    try {
      const [
        ordensCarregadas,
        clientesCarregados,
        pecasCarregadas,
        servicosCarregados,
        operadoresCarregados,
        jurosCarregados,
      ] = await Promise.all([
        listarOrdens(),
        listarClientes(),
        listarPecas(),
        listarServicos(),
        listarOperadores(),
        listarJurosParcelas(),
      ]);
      setOrdens(ordensCarregadas);
      setClientes(clientesCarregados);
      setPecas(pecasCarregadas);
      setServicos(servicosCarregados);
      setOperadores(operadoresCarregados);
      setJurosParcelas(jurosCarregados);
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

  async function handleSalvarNova(ordem: NovaOrdemServico, itens: NovoItemOS[]) {
    if (!operador) return;
    await criarOrdem(ordem, itens, operador.id);
    setMostrarFormulario(false);
    await carregar();
  }

  async function handleSalvarEdicao(
    id: string,
    patch: PatchOrdemServico,
    novosItens: NovoItemOS[],
  ) {
    if (!operador) return;
    await atualizarOrdem(id, patch, operador.id);
    if (novosItens.length > 0) {
      await adicionarItensOrdem(id, novosItens, operador.id);
    }
    setOrdemEmEdicao(null);
    await carregar();
  }

  async function confirmarFaturamento(
    formaPagamento: string,
    parcelas: number,
    valorCobrado: number,
  ) {
    if (!ordemFaturando) return;
    await faturarOrdem(ordemFaturando, formaPagamento, parcelas, valorCobrado);
    setOrdemFaturando(null);
    await carregar();
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
        {clientes.length > 0 && !mostrarFormulario && !ordemEmEdicao && operador && (
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

      {mostrarFormulario && operador && (
        <OrdemServicoForm
          clientes={clientes}
          pecas={pecas}
          servicos={servicos}
          operadores={operadores}
          operadorAtualId={operador.id}
          onSalvarNova={handleSalvarNova}
          onSalvarEdicao={handleSalvarEdicao}
          onCancelar={() => setMostrarFormulario(false)}
        />
      )}

      {ordemEmEdicao && operador && (
        <OrdemServicoForm
          clientes={clientes}
          pecas={pecas}
          servicos={servicos}
          operadores={operadores}
          operadorAtualId={operador.id}
          ordemExistente={ordemEmEdicao}
          onSalvarNova={handleSalvarNova}
          onSalvarEdicao={handleSalvarEdicao}
          onCancelar={() => setOrdemEmEdicao(null)}
        />
      )}

      {ordemFaturando && (
        <FaturamentoCard
          ordem={ordemFaturando}
          jurosParcelas={jurosParcelas}
          onConfirmar={confirmarFaturamento}
          onCancelar={() => setOrdemFaturando(null)}
        />
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
        <div className="overflow-hidden sakura-card">
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
                <tr
                  key={ordem.id}
                  onClick={() => {
                    setMostrarFormulario(false);
                    setOrdemEmEdicao(ordem);
                  }}
                  className="cursor-pointer border-t border-sakura-gray/20 hover:bg-sakura-pink-soft/30"
                >
                  <td className="px-4 py-3">{ordem.cliente?.nome ?? "—"}</td>
                  <td className="px-4 py-3">{ordem.veiculo?.placa ?? "—"}</td>
                  <td className="px-4 py-3">
                    {new Date(ordem.data_abertura).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-3">{STATUS_LABEL[ordem.status]}</td>
                  <td className="px-4 py-3">
                    {totalOrdem(ordem.itens ?? []).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {ordem.status !== "faturada" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOrdemFaturando(ordem);
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
