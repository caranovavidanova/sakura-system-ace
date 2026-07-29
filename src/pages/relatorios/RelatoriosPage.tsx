import { useEffect, useMemo, useState } from "react";
import { BotaoVoltar } from "@/components/BotaoVoltar";
import { GraficoBarras } from "@/components/GraficoBarras";
import { GraficoRadar } from "@/components/GraficoRadar";
import { mensagemDeErro } from "@/lib/errors";
import { listarMovimentosCaixa } from "@/lib/caixa";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { MovimentoCaixa } from "@/types/caixa";

type Periodo = "diario" | "semanal" | "mensal";

const QTD_BUCKETS: Record<Periodo, number> = { diario: 14, semanal: 8, mensal: 6 };

const CORES = { vendas: "#1baf7a", custos: "#eb6834", lucro: "#4a3aa7" };

function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function paraDataLocal(dataIso: string): string {
  return new Date(dataIso).toLocaleDateString("sv-SE");
}

function inicioDaSemana(data: Date): Date {
  const dia = data.getDay();
  const diff = (dia + 6) % 7; // segunda-feira como início da semana
  const inicio = new Date(data);
  inicio.setDate(data.getDate() - diff);
  inicio.setHours(0, 0, 0, 0);
  return inicio;
}

function chaveDoMovimento(dataIso: string, periodo: Periodo): string {
  const d = new Date(dataIso);
  if (periodo === "mensal") {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  }
  if (periodo === "semanal") {
    return paraDataLocal(inicioDaSemana(d).toISOString());
  }
  return paraDataLocal(dataIso);
}

function gerarChavesBuckets(periodo: Periodo, hoje: Date): string[] {
  const qtd = QTD_BUCKETS[periodo];
  const chaves: string[] = [];
  for (let i = qtd - 1; i >= 0; i--) {
    if (periodo === "diario") {
      const d = new Date(hoje);
      d.setDate(d.getDate() - i);
      chaves.push(paraDataLocal(d.toISOString()));
    } else if (periodo === "semanal") {
      const d = new Date(hoje);
      d.setDate(d.getDate() - i * 7);
      chaves.push(paraDataLocal(inicioDaSemana(d).toISOString()));
    } else {
      const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      chaves.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    }
  }
  return chaves;
}

const MESES_ABREV = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

function rotuloBucket(chave: string, periodo: Periodo): string {
  if (periodo === "mensal") {
    const [ano, mes] = chave.split("-").map(Number);
    return `${MESES_ABREV[mes - 1]}/${String(ano).slice(2)}`;
  }
  return new Date(`${chave}T00:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
}

const PERIODOS: { chave: Periodo; label: string }[] = [
  { chave: "diario", label: "Diário" },
  { chave: "semanal", label: "Semanal" },
  { chave: "mensal", label: "Mensal" },
];

export function RelatoriosPage() {
  const [movimentos, setMovimentos] = useState<MovimentoCaixa[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [periodo, setPeriodo] = useState<Periodo>("diario");

  useEffect(() => {
    async function carregar() {
      if (!isSupabaseConfigured) {
        setCarregando(false);
        return;
      }
      try {
        setMovimentos(await listarMovimentosCaixa());
      } catch (err) {
        console.error("Erro ao carregar relações:", err);
        setErro(mensagemDeErro(err));
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  const entradas = useMemo(() => movimentos.filter((m) => m.tipo === "entrada"), [movimentos]);

  const totaisPorDia = useMemo(() => {
    const mapa = new Map<string, number>();
    for (const m of entradas) {
      const dia = paraDataLocal(m.data);
      mapa.set(dia, (mapa.get(dia) ?? 0) + m.valor);
    }
    return [...mapa.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [entradas]);

  const hoje = new Date();
  const hojeStr = paraDataLocal(hoje.toISOString());
  const inicioSemana = inicioDaSemana(hoje);
  const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

  const totalHoje = totaisPorDia.find(([dia]) => dia === hojeStr)?.[1] ?? 0;
  const totalSemana = entradas
    .filter((m) => new Date(m.data) >= inicioSemana)
    .reduce((total, m) => total + m.valor, 0);
  const totalMes = entradas
    .filter((m) => new Date(m.data) >= inicioMes)
    .reduce((total, m) => total + m.valor, 0);

  const { categorias, vendas, custos, lucro } = useMemo(() => {
    const chaves = gerarChavesBuckets(periodo, hoje);
    const vendasMap = new Map<string, number>();
    const custosMap = new Map<string, number>();
    for (const m of movimentos) {
      const chave = chaveDoMovimento(m.data, periodo);
      const mapa = m.tipo === "entrada" ? vendasMap : custosMap;
      mapa.set(chave, (mapa.get(chave) ?? 0) + m.valor);
    }
    const vendasArr = chaves.map((c) => vendasMap.get(c) ?? 0);
    const custosArr = chaves.map((c) => custosMap.get(c) ?? 0);
    return {
      categorias: chaves.map((c) => rotuloBucket(c, periodo)),
      vendas: vendasArr,
      custos: custosArr,
      lucro: vendasArr.map((v, i) => v - custosArr[i]),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movimentos, periodo]);

  const ultimoIndice = vendas.length - 1;
  const penultimoIndice = vendas.length - 2;

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <BotaoVoltar />
        <div>
          <h1 className="text-2xl font-semibold text-sakura-purple-dark">Relações</h1>
          <p className="text-sm text-sakura-muted">
            Como vendas, custos e lucro se relacionam ao longo do tempo
          </p>
        </div>
      </header>

      {!isSupabaseConfigured && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          O Supabase ainda não está configurado. Defina{" "}
          <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code>{" "}
          no arquivo <code>.env</code> para ver as relações de verdade.
        </p>
      )}

      {erro && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</p>
      )}

      <div className="grid grid-cols-3 gap-4">
        <div className="sakura-card p-4">
          <p className="text-xs text-sakura-muted">Vendas hoje</p>
          <p className="text-xl font-semibold text-sakura-purple-dark">
            {formatarMoeda(totalHoje)}
          </p>
        </div>
        <div className="sakura-card p-4">
          <p className="text-xs text-sakura-muted">Vendas esta semana</p>
          <p className="text-xl font-semibold text-sakura-purple-dark">
            {formatarMoeda(totalSemana)}
          </p>
        </div>
        <div className="sakura-card p-4">
          <p className="text-xs text-sakura-muted">Vendas este mês</p>
          <p className="text-xl font-semibold text-sakura-purple-dark">
            {formatarMoeda(totalMes)}
          </p>
        </div>
      </div>

      {carregando ? (
        <p className="text-sm text-sakura-muted">Carregando...</p>
      ) : (
        <>
          <section className="sakura-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-sakura-purple-dark">
                Vendas x Custos x Lucro
              </h2>
              <div className="flex gap-1 rounded-full bg-white/50 p-1">
                {PERIODOS.map((p) => (
                  <button
                    key={p.chave}
                    onClick={() => setPeriodo(p.chave)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                      periodo === p.chave
                        ? "bg-sakura-purple text-white"
                        : "text-sakura-purple-dark/85 hover:bg-white/60"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <GraficoBarras
              series={[
                { chave: "vendas", nome: "Vendas", cor: CORES.vendas },
                { chave: "custos", nome: "Custos", cor: CORES.custos },
                { chave: "lucro", nome: "Lucro", cor: CORES.lucro },
              ]}
              categorias={categorias}
              valores={{ vendas, custos, lucro }}
              formatarValor={formatarMoeda}
            />
          </section>

          {penultimoIndice >= 0 && (
            <section className="sakura-card p-5">
              <h2 className="mb-1 text-sm font-semibold text-sakura-purple-dark">
                Comparativo do período
              </h2>
              <p className="mb-4 text-xs text-sakura-muted">
                {PERIODOS.find((p) => p.chave === periodo)?.label} atual comparado com o anterior.
              </p>
              <GraficoRadar
                eixos={[
                  {
                    chave: "vendas",
                    nome: "Vendas",
                    atual: vendas[ultimoIndice],
                    anterior: vendas[penultimoIndice],
                  },
                  {
                    chave: "custos",
                    nome: "Custos",
                    atual: custos[ultimoIndice],
                    anterior: custos[penultimoIndice],
                  },
                  {
                    chave: "lucro",
                    nome: "Lucro",
                    atual: Math.max(lucro[ultimoIndice], 0),
                    anterior: Math.max(lucro[penultimoIndice], 0),
                  },
                ]}
                formatarValor={formatarMoeda}
              />
            </section>
          )}

          {totaisPorDia.length === 0 ? (
            <p className="text-sm text-sakura-muted">
              Nenhuma venda registrada ainda (faturamentos de OS aparecem aqui automaticamente).
            </p>
          ) : (
            <section>
              <h2 className="mb-3 text-sm font-semibold text-sakura-purple-dark">
                Vendas por dia
              </h2>
              <div className="overflow-hidden sakura-card">
                <table className="w-full text-left text-sm">
                  <thead className="bg-sakura-pink-soft text-sakura-purple-dark">
                    <tr>
                      <th className="px-4 py-3 font-medium">Dia</th>
                      <th className="px-4 py-3 font-medium">Total vendido</th>
                    </tr>
                  </thead>
                  <tbody>
                    {totaisPorDia.map(([dia, total]) => (
                      <tr key={dia} className="border-t border-sakura-gray/20">
                        <td className="px-4 py-3">
                          {new Date(dia).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
                        </td>
                        <td className="px-4 py-3">{formatarMoeda(total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
