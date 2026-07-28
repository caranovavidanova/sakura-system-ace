import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MiniCalendario } from "@/components/MiniCalendario";
import { Sparkline } from "@/components/Sparkline";
import { feriadosNacionais } from "@/lib/feriados";
import { mensagemDeErro } from "@/lib/errors";
import { listarMovimentosCaixa } from "@/lib/caixa";
import { listarClientes } from "@/lib/clientes";
import { listarOrdens } from "@/lib/ordensServico";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { Cliente } from "@/types/cliente";
import type { MovimentoCaixa } from "@/types/caixa";
import type { OrdemServico } from "@/types/os";

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
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregar() {
      if (!isSupabaseConfigured) {
        setCarregando(false);
        return;
      }
      try {
        const [movimentosCarregados, ordensCarregadas, clientesCarregados] =
          await Promise.all([listarMovimentosCaixa(), listarOrdens(), listarClientes()]);
        setMovimentos(movimentosCarregados);
        setOrdens(ordensCarregadas);
        setClientes(clientesCarregados);
      } catch (err) {
        console.error("Erro ao carregar painel:", err);
        setErro(mensagemDeErro(err));
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = hoje.getMonth();
  const inicioMesAtual = new Date(ano, mes, 1);
  const diaDeHoje = hoje.getDate();

  const { vendasPorDia, custosPorDia, vendasMes, custosMes } = useMemo(() => {
    const vendas = Array(diaDeHoje).fill(0);
    const custos = Array(diaDeHoje).fill(0);

    for (const movimento of movimentos) {
      const dataMovimento = new Date(movimento.data);
      if (dataMovimento < inicioMesAtual) continue;
      const dia = dataMovimento.getDate();
      if (dia > diaDeHoje) continue;
      const alvo = movimento.tipo === "entrada" ? vendas : custos;
      alvo[dia - 1] += movimento.valor;
    }

    return {
      vendasPorDia: vendas,
      custosPorDia: custos,
      vendasMes: vendas.reduce((total, v) => total + v, 0),
      custosMes: custos.reduce((total, v) => total + v, 0),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movimentos, diaDeHoje]);

  const lucrosPorDia = vendasPorDia.map((v, i) => v - custosPorDia[i]);
  const lucrosMes = vendasMes - custosMes;

  const filaDeAtendimento = ordens
    .filter((o) => o.status === "aberta" || o.status === "em_andamento")
    .sort((a, b) => (a.data_abertura < b.data_abertura ? -1 : 1));

  const eventosDoMes = useMemo(() => {
    const feriados = feriadosNacionais(ano)
      .map((f) => {
        const [, mesFeriado, diaFeriado] = f.data.split("-").map(Number);
        return mesFeriado - 1 === mes
          ? { dia: diaFeriado, tipo: "feriado" as const, nome: f.nome }
          : null;
      })
      .filter((e): e is NonNullable<typeof e> => e !== null);

    const aniversarios = clientes
      .filter((c) => c.data_nascimento)
      .map((c) => {
        const [, mesNascimento, diaNascimento] = c.data_nascimento!.split("-").map(Number);
        return mesNascimento - 1 === mes
          ? { dia: diaNascimento, tipo: "aniversario" as const, nome: `Aniversário de ${c.nome}` }
          : null;
      })
      .filter((e): e is NonNullable<typeof e> => e !== null);

    return [...feriados, ...aniversarios];
  }, [ano, mes, clientes]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-sakura-purple-dark">Início</h1>
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
          <div className="grid grid-cols-3 gap-4">
            <CartaoTendencia
              titulo="Vendas mês"
              valor={formatarMoeda(vendasMes)}
              valores={vendasPorDia}
              cor="#B38DAC"
            />
            <CartaoTendencia
              titulo="Custos mês"
              valor={formatarMoeda(custosMes)}
              valores={custosPorDia}
              cor="#C7C7C7"
            />
            <CartaoTendencia
              titulo="Lucros mês"
              valor={formatarMoeda(lucrosMes)}
              valores={lucrosPorDia}
              cor="#6E4D68"
            />
          </div>

          <div className="flex justify-center">
            <Link
              to="/relatorios"
              className="rounded-full bg-white/50 px-5 py-2 text-xs font-medium text-sakura-purple-dark hover:bg-white/70"
            >
              Ver relatórios completos →
            </Link>
          </div>

          <div className="grid grid-cols-[2fr_1fr] gap-4">
            <section className="sakura-card p-4">
              <h2 className="mb-3 text-sm font-semibold text-sakura-purple-dark">
                OS abertas
              </h2>
              {filaDeAtendimento.length === 0 ? (
                <p className="text-sm text-sakura-purple-dark/60">
                  Nenhuma ordem de serviço em aberto no momento.
                </p>
              ) : (
                <div className="overflow-hidden rounded-xl border border-white/50">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-white/40 text-sakura-purple-dark">
                      <tr>
                        <th className="px-4 py-3 font-medium">Cliente</th>
                        <th className="px-4 py-3 font-medium">Veículo</th>
                        <th className="px-4 py-3 font-medium">Aberta em</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filaDeAtendimento.map((ordem) => (
                        <tr key={ordem.id} className="border-t border-white/40">
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

            <MiniCalendario ano={ano} mes={mes} eventos={eventosDoMes} />
          </div>
        </>
      )}
    </div>
  );
}

function CartaoTendencia({
  titulo,
  valor,
  valores,
  cor,
}: {
  titulo: string;
  valor: string;
  valores: number[];
  cor: string;
}) {
  return (
    <div className="sakura-card p-4">
      <p className="text-xs text-sakura-purple-dark/60">{titulo}</p>
      <p className="mt-1 text-lg font-semibold text-sakura-purple-dark">{valor}</p>
      <Sparkline valores={valores} cor={cor} />
    </div>
  );
}
