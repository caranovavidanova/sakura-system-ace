import { useEffect, useMemo, useState } from "react";
import { mensagemDeErro } from "@/lib/errors";
import { listarMovimentosCaixa } from "@/lib/caixa";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { MovimentoCaixa } from "@/types/caixa";

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

export function RelatoriosPage() {
  const [movimentos, setMovimentos] = useState<MovimentoCaixa[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregar() {
      if (!isSupabaseConfigured) {
        setCarregando(false);
        return;
      }
      try {
        setMovimentos(await listarMovimentosCaixa());
      } catch (err) {
        console.error("Erro ao carregar relatórios:", err);
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

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-sakura-purple-dark">Relatórios</h1>
        <p className="text-sm text-sakura-gray">
          Comparativo de vendas diárias, semanais e mensais
        </p>
      </header>

      {!isSupabaseConfigured && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          O Supabase ainda não está configurado. Defina{" "}
          <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code>{" "}
          no arquivo <code>.env</code> para ver os relatórios de verdade.
        </p>
      )}

      {erro && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</p>
      )}

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-sakura-gray/30 bg-white p-4">
          <p className="text-xs text-sakura-gray">Vendas hoje</p>
          <p className="text-xl font-semibold text-sakura-purple-dark">
            {formatarMoeda(totalHoje)}
          </p>
        </div>
        <div className="rounded-2xl border border-sakura-gray/30 bg-white p-4">
          <p className="text-xs text-sakura-gray">Vendas esta semana</p>
          <p className="text-xl font-semibold text-sakura-purple-dark">
            {formatarMoeda(totalSemana)}
          </p>
        </div>
        <div className="rounded-2xl border border-sakura-gray/30 bg-white p-4">
          <p className="text-xs text-sakura-gray">Vendas este mês</p>
          <p className="text-xl font-semibold text-sakura-purple-dark">
            {formatarMoeda(totalMes)}
          </p>
        </div>
      </div>

      {carregando ? (
        <p className="text-sm text-sakura-gray">Carregando...</p>
      ) : totaisPorDia.length === 0 ? (
        <p className="text-sm text-sakura-gray">
          Nenhuma venda registrada ainda (faturamentos de OS aparecem aqui automaticamente).
        </p>
      ) : (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-sakura-purple-dark">
            Vendas por dia
          </h2>
          <div className="overflow-hidden rounded-2xl border border-sakura-gray/30 bg-white">
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
    </div>
  );
}
