import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MiniCalendario } from "@/components/MiniCalendario";
import { VeiculoIcone } from "@/components/VeiculoIcone";
import { useAuth } from "@/contexts/AuthContext";
import { feriadosNacionais } from "@/lib/feriados";
import { mensagemDeErro } from "@/lib/errors";
import { listarMovimentosCaixa } from "@/lib/caixa";
import { listarClientes } from "@/lib/clientes";
import { listarContasPagar } from "@/lib/contasPagar";
import { buscarConfiguracaoPainelInicio } from "@/lib/configuracoes";
import { listarOrdens } from "@/lib/ordensServico";
import { isSupabaseConfigured } from "@/lib/supabase";
import { CARTOES_INICIO_PADRAO } from "@/types/configuracao";
import type { CartaoMetrica } from "@/types/configuracao";
import type { Cliente } from "@/types/cliente";
import type { ContaPagar } from "@/types/contaPagar";
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

const TITULO_CARTAO: Record<CartaoMetrica, string> = {
  vendas_mes: "Vendas mês",
  custos_mes: "Custos mês",
  lucro_mes: "Lucros mês",
  ticket_medio_mes: "Ticket médio",
  contas_pagar_vencendo: "Contas a pagar vencendo",
};

const COR_CARTAO: Record<CartaoMetrica, string> = {
  vendas_mes: "#B38DAC",
  custos_mes: "#C7C7C7",
  lucro_mes: "#6E4D68",
  ticket_medio_mes: "#7A9CC6",
  contas_pagar_vencendo: "#D99A4E",
};

export function PainelPage() {
  const { lojaAtual } = useAuth();
  const [movimentos, setMovimentos] = useState<MovimentoCaixa[]>([]);
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [contas, setContas] = useState<ContaPagar[]>([]);
  const [cartoesConfig, setCartoesConfig] = useState<CartaoMetrica[]>(CARTOES_INICIO_PADRAO);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregar() {
      if (!isSupabaseConfigured || !lojaAtual) {
        setCarregando(false);
        return;
      }
      try {
        const [movimentosCarregados, ordensCarregadas, clientesCarregados, contasCarregadas, cartoesCarregados] =
          await Promise.all([
            listarMovimentosCaixa(lojaAtual.id),
            listarOrdens(lojaAtual.id),
            listarClientes(),
            listarContasPagar(lojaAtual.id),
            buscarConfiguracaoPainelInicio(lojaAtual.id),
          ]);
        setMovimentos(movimentosCarregados);
        setOrdens(ordensCarregadas);
        setClientes(clientesCarregados);
        setContas(contasCarregadas);
        setCartoesConfig(cartoesCarregados);
      } catch (err) {
        console.error("Erro ao carregar painel:", err);
        setErro(mensagemDeErro(err));
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [lojaAtual]);

  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = hoje.getMonth();
  const diaDeHoje = hoje.getDate();

  const { vendasMes, custosMes, ticketMedioMes } = useMemo(() => {
    const inicioMesAtual = new Date(ano, mes, 1);
    let vendas = 0;
    let custos = 0;
    let somaTicket = 0;
    let qtdTicket = 0;

    for (const movimento of movimentos) {
      const dataMovimento = new Date(movimento.data);
      if (dataMovimento < inicioMesAtual) continue;
      if (dataMovimento.getDate() > diaDeHoje) continue;
      if (movimento.tipo === "entrada") {
        vendas += movimento.valor;
        if (movimento.ordem_servico_id) {
          somaTicket += movimento.valor;
          qtdTicket += 1;
        }
      } else {
        custos += movimento.valor;
      }
    }

    return {
      vendasMes: vendas,
      custosMes: custos,
      ticketMedioMes: qtdTicket > 0 ? somaTicket / qtdTicket : 0,
    };
  }, [movimentos, ano, mes, diaDeHoje]);

  const lucrosMes = vendasMes - custosMes;

  const contasVencendoMes = useMemo(() => {
    let total = 0;
    for (const conta of contas) {
      if (conta.status !== "pendente") continue;
      const [anoVencimento, mesVencimento] = conta.vencimento.split("-").map(Number);
      if (anoVencimento !== ano || mesVencimento - 1 !== mes) continue;
      total += conta.valor;
    }
    return total;
  }, [contas, ano, mes]);

  const valoresPorMetrica: Record<CartaoMetrica, string> = {
    vendas_mes: formatarMoeda(vendasMes),
    custos_mes: formatarMoeda(custosMes),
    lucro_mes: formatarMoeda(lucrosMes),
    ticket_medio_mes: formatarMoeda(ticketMedioMes),
    contas_pagar_vencendo: formatarMoeda(contasVencendoMes),
  };

  const filaDeAtendimento = ordens
    .filter((o) => o.status === "aberta" || o.status === "em_andamento")
    .sort((a, b) => (a.data_abertura < b.data_abertura ? -1 : 1));

  const veiculosNoPatio = filaDeAtendimento.filter((o) => o.veiculo);

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

    const contasDoMes = contas
      .filter((c) => c.status === "pendente")
      .map((c) => {
        const [anoVencimento, mesVencimento, diaVencimento] = c.vencimento.split("-").map(Number);
        if (anoVencimento !== ano || mesVencimento - 1 !== mes) return null;
        const vencida = new Date(c.vencimento) < new Date(ano, mes, hoje.getDate());
        const tipo: "conta_vencida" | "conta_a_vencer" = vencida
          ? "conta_vencida"
          : "conta_a_vencer";
        return {
          dia: diaVencimento,
          tipo,
          nome: `${vencida ? "Venceu" : "Vence"}: ${c.descricao} (${formatarMoeda(c.valor)})`,
        };
      })
      .filter((e): e is NonNullable<typeof e> => e !== null);

    return [...feriados, ...aniversarios, ...contasDoMes];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ano, mes, clientes, contas]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-sakura-purple-dark">Início</h1>
        <p className="text-sm text-sakura-muted">Visão geral da loja, em tempo real</p>
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
        <p className="text-sm text-sakura-muted">Carregando...</p>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4">
            {cartoesConfig.map((chave) => (
              <CartaoValor
                key={chave}
                titulo={TITULO_CARTAO[chave]}
                valor={valoresPorMetrica[chave]}
                cor={COR_CARTAO[chave]}
              />
            ))}
          </div>

          <div className="flex justify-center">
            <Link
              to="/relatorios"
              className="rounded-full bg-white/50 px-5 py-2 text-xs font-medium text-sakura-purple-dark hover:bg-white/70"
            >
              Ver relações completas →
            </Link>
          </div>

          <div className="grid grid-cols-[2fr_1fr] gap-4">
            <section className="sakura-card p-4">
              <h2 className="mb-3 text-sm font-semibold text-sakura-purple-dark">
                OS abertas
              </h2>
              {filaDeAtendimento.length === 0 ? (
                <p className="text-sm text-sakura-purple-dark/85">
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

          <section className="sakura-card p-4">
            <h2 className="mb-3 text-sm font-semibold text-sakura-purple-dark">
              Veículos no pátio
            </h2>
            {veiculosNoPatio.length === 0 ? (
              <p className="text-sm text-sakura-purple-dark/85">
                Nenhum veículo no pátio no momento.
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {veiculosNoPatio.map((ordem) => (
                  <div
                    key={ordem.id}
                    className="sakura-card flex items-center gap-3 p-3"
                  >
                    <VeiculoIcone
                      tipo={ordem.veiculo?.tipo ?? null}
                      cor={ordem.veiculo?.cor}
                      className="h-14 w-24 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-sakura-purple-dark">
                        {ordem.cliente?.nome ?? "—"}
                      </p>
                      <p className="truncate text-xs text-sakura-muted">
                        {ordem.veiculo?.placa ?? "—"}
                        {(ordem.veiculo?.marca || ordem.veiculo?.modelo) &&
                          ` · ${[ordem.veiculo?.marca, ordem.veiculo?.modelo]
                            .filter(Boolean)
                            .join(" ")}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function CartaoValor({
  titulo,
  valor,
  cor,
}: {
  titulo: string;
  valor: string;
  cor: string;
}) {
  return (
    <div
      className="sakura-card p-5"
      style={{
        boxShadow:
          "0 14px 34px -10px rgba(110, 77, 104, 0.4), " +
          "0 2px 8px -2px rgba(110, 77, 104, 0.2), " +
          "inset 0 1px 0 rgba(255, 255, 255, 0.75), " +
          `inset -12px 2px 26px -6px ${cor}66`,
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs text-sakura-muted">{titulo}</p>
        <span className="text-sakura-purple-dark/70">›</span>
      </div>
      <p className="mt-2 text-2xl font-semibold text-sakura-purple-dark">{valor}</p>
    </div>
  );
}
