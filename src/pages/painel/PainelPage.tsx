import { useEffect, useMemo, useState } from "react";
import { Gauge } from "@/components/Gauge";
import { mensagemDeErro } from "@/lib/errors";
import { listarMovimentosCaixa } from "@/lib/caixa";
import { listarOrdens } from "@/lib/ordensServico";
import { listarPecas } from "@/lib/pecas";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { MovimentoCaixa } from "@/types/caixa";
import type { OrdemServico } from "@/types/os";
import type { Peca } from "@/types/peca";

function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const statusLabel: Record<string, string> = {
  aberta: "Aberta",
  em_andamento: "Em andamento",
  concluida: "Concluída",
  faturada: "Faturada",
};

export function PainelPage() {
  const [movimentos, setMovimentos] = useState<MovimentoCaixa[]>([]);
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [pecas, setPecas] = useState<Peca[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregar() {
      if (!isSupabaseConfigured) {
        setCarregando(false);
        return;
      }
      try {
        const [movimentosCarregados, ordensCarregadas, pecasCarregadas] = await Promise.all([
          listarMovimentosCaixa(),
          listarOrdens(),
          listarPecas(),
        ]);
        setMovimentos(movimentosCarregados);
        setOrdens(ordensCarregadas);
        setPecas(pecasCarregadas);
      } catch (err) {
        console.error("Erro ao carregar painel:", err);
        setErro(mensagemDeErro(err));
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  const custoPorPeca = useMemo(() => {
    const mapa = new Map<string, number>();
    for (const peca of pecas) mapa.set(peca.id, peca.preco_custo ?? 0);
    return mapa;
  }, [pecas]);

  const hoje = new Date();
  const inicioMesAtual = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const inicioMesAnterior = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);

  const faturamentoMesAtual = movimentos
    .filter((m) => m.tipo === "entrada" && new Date(m.data) >= inicioMesAtual)
    .reduce((total, m) => total + m.valor, 0);

  const faturamentoMesAnterior = movimentos
    .filter(
      (m) =>
        m.tipo === "entrada" &&
        new Date(m.data) >= inicioMesAnterior &&
        new Date(m.data) < inicioMesAtual,
    )
    .reduce((total, m) => total + m.valor, 0);

  const percentualFaturamento =
    faturamentoMesAnterior > 0
      ? (faturamentoMesAtual / faturamentoMesAnterior) * 100
      : faturamentoMesAtual > 0
        ? 100
        : 0;

  const { receitaMes, custoMes } = useMemo(() => {
    let receita = 0;
    let custo = 0;
    for (const ordem of ordens) {
      if (new Date(ordem.data_abertura) < inicioMesAtual) continue;
      for (const item of ordem.itens ?? []) {
        const receitaItem = item.quantidade * item.preco_unitario - item.desconto;
        const custoUnitario = item.tipo === "peca" ? custoPorPeca.get(item.peca_id ?? "") ?? 0 : 0;
        receita += receitaItem;
        custo += item.quantidade * custoUnitario;
      }
    }
    return { receitaMes: receita, custoMes: custo };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ordens, custoPorPeca]);

  const margemMes = receitaMes - custoMes;
  const percentualMargem = receitaMes > 0 ? (margemMes / receitaMes) * 100 : 0;

  const filaDeAtendimento = ordens
    .filter((o) => o.status === "aberta" || o.status === "em_andamento")
    .sort((a, b) => (a.data_abertura < b.data_abertura ? -1 : 1));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-sakura-purple-dark">
          Painel de Controle
        </h1>
        <p className="text-sm text-sakura-gray">Visão geral da loja, em tempo real</p>
      </header>

      {!isSupabaseConfigured && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          O Supabase ainda não está configurado. Defina{" "}
          <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code>{" "}
          no arquivo <code>.env</code> para ver o painel de verdade.
        </p>
      )}

      {erro && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</p>
      )}

      {carregando ? (
        <p className="text-sm text-sakura-gray">Carregando...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            <Gauge
              titulo="Faturamento deste mês vs. mês anterior"
              percentual={percentualFaturamento}
              valorPrincipal={formatarMoeda(faturamentoMesAtual)}
              legenda={
                faturamentoMesAnterior > 0
                  ? `Mês anterior: ${formatarMoeda(faturamentoMesAnterior)}`
                  : "Sem histórico do mês anterior ainda"
              }
            />
            <Gauge
              titulo="Margem bruta deste mês"
              percentual={percentualMargem}
              valorPrincipal={formatarMoeda(margemMes)}
              legenda={
                receitaMes > 0
                  ? `Sobre receita de ${formatarMoeda(receitaMes)}`
                  : "Nenhuma venda neste mês ainda"
              }
            />
          </div>

          <section>
            <h2 className="mb-3 text-sm font-semibold text-sakura-purple-dark">
              Fila de atendimento
            </h2>
            {filaDeAtendimento.length === 0 ? (
              <p className="text-sm text-sakura-gray">
                Nenhuma ordem de serviço em aberto no momento.
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
                    </tr>
                  </thead>
                  <tbody>
                    {filaDeAtendimento.map((ordem) => (
                      <tr key={ordem.id} className="border-t border-sakura-gray/20">
                        <td className="px-4 py-3">{ordem.cliente?.nome ?? "—"}</td>
                        <td className="px-4 py-3">{ordem.veiculo?.placa ?? "—"}</td>
                        <td className="px-4 py-3">
                          {new Date(ordem.data_abertura).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="px-4 py-3">{statusLabel[ordem.status]}</td>
                      </tr>
                    ))}
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
