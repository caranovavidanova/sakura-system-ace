import { useEffect, useMemo, useState } from "react";
import { mensagemDeErro } from "@/lib/errors";
import { listarOrdens } from "@/lib/ordensServico";
import { listarPecas } from "@/lib/pecas";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { OrdemServico } from "@/types/os";
import type { Peca } from "@/types/peca";

function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function primeiroDiaDoMes(): string {
  const hoje = new Date();
  return new Date(hoje.getFullYear(), hoje.getMonth(), 1).toLocaleDateString("sv-SE");
}

function hojeStr(): string {
  return new Date().toLocaleDateString("sv-SE");
}

interface LinhaLucro {
  descricao: string;
  quantidade: number;
  receita: number;
  custo: number;
  margem: number;
}

export function LucratividadePage() {
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [pecas, setPecas] = useState<Peca[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [dataInicio, setDataInicio] = useState(primeiroDiaDoMes());
  const [dataFim, setDataFim] = useState(hojeStr());

  useEffect(() => {
    async function carregar() {
      if (!isSupabaseConfigured) {
        setCarregando(false);
        return;
      }
      try {
        const [ordensCarregadas, pecasCarregadas] = await Promise.all([
          listarOrdens(),
          listarPecas(),
        ]);
        setOrdens(ordensCarregadas);
        setPecas(pecasCarregadas);
      } catch (err) {
        console.error("Erro ao carregar lucratividade:", err);
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

  const linhas = useMemo(() => {
    const mapa = new Map<string, LinhaLucro>();

    for (const ordem of ordens) {
      const dia = ordem.data_abertura.slice(0, 10);
      if (dia < dataInicio || dia > dataFim) continue;

      for (const item of ordem.itens ?? []) {
        const receita = item.quantidade * item.preco_unitario - item.desconto;
        const custoUnitario = item.tipo === "peca" ? custoPorPeca.get(item.peca_id ?? "") ?? 0 : 0;
        const custo = item.quantidade * custoUnitario;

        const existente = mapa.get(item.descricao) ?? {
          descricao: item.descricao,
          quantidade: 0,
          receita: 0,
          custo: 0,
          margem: 0,
        };
        existente.quantidade += item.quantidade;
        existente.receita += receita;
        existente.custo += custo;
        existente.margem += receita - custo;
        mapa.set(item.descricao, existente);
      }
    }

    return [...mapa.values()].sort((a, b) => b.margem - a.margem);
  }, [ordens, custoPorPeca, dataInicio, dataFim]);

  const totalReceita = linhas.reduce((total, l) => total + l.receita, 0);
  const totalCusto = linhas.reduce((total, l) => total + l.custo, 0);
  const totalMargem = linhas.reduce((total, l) => total + l.margem, 0);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-sakura-purple-dark">Lucratividade</h1>
        <p className="text-sm text-sakura-gray">
          Margem por peça/serviço e lucro do período
        </p>
      </header>

      {!isSupabaseConfigured && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          O Supabase ainda não está configurado. Defina{" "}
          <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code>{" "}
          no arquivo <code>.env</code> para ver a lucratividade de verdade.
        </p>
      )}

      {erro && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</p>
      )}

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-sakura-purple-dark/80">
          De:
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            className="rounded-lg border border-sakura-gray/40 px-3 py-1.5"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-sakura-purple-dark/80">
          Até:
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            className="rounded-lg border border-sakura-gray/40 px-3 py-1.5"
          />
        </label>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="sakura-card p-4">
          <p className="text-xs text-sakura-gray">Receita do período</p>
          <p className="text-xl font-semibold text-sakura-purple-dark">
            {formatarMoeda(totalReceita)}
          </p>
        </div>
        <div className="sakura-card p-4">
          <p className="text-xs text-sakura-gray">Custo do período</p>
          <p className="text-xl font-semibold text-sakura-purple-dark">
            {formatarMoeda(totalCusto)}
          </p>
        </div>
        <div className="sakura-card p-4">
          <p className="text-xs text-sakura-gray">Margem do período</p>
          <p className="text-xl font-semibold text-sakura-purple-dark">
            {formatarMoeda(totalMargem)}
          </p>
        </div>
      </div>

      {carregando ? (
        <p className="text-sm text-sakura-gray">Carregando...</p>
      ) : linhas.length === 0 ? (
        <p className="text-sm text-sakura-gray">
          Nenhuma peça ou serviço vendido nesse período.
        </p>
      ) : (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-sakura-purple-dark">
            Margem por peça/serviço
          </h2>
          <div className="overflow-hidden sakura-card">
            <table className="w-full text-left text-sm">
              <thead className="bg-sakura-pink-soft text-sakura-purple-dark">
                <tr>
                  <th className="px-4 py-3 font-medium">Descrição</th>
                  <th className="px-4 py-3 font-medium">Qtd. vendida</th>
                  <th className="px-4 py-3 font-medium">Receita</th>
                  <th className="px-4 py-3 font-medium">Custo</th>
                  <th className="px-4 py-3 font-medium">Margem</th>
                </tr>
              </thead>
              <tbody>
                {linhas.map((linha) => (
                  <tr key={linha.descricao} className="border-t border-sakura-gray/20">
                    <td className="px-4 py-3">{linha.descricao}</td>
                    <td className="px-4 py-3">{linha.quantidade}</td>
                    <td className="px-4 py-3">{formatarMoeda(linha.receita)}</td>
                    <td className="px-4 py-3">{formatarMoeda(linha.custo)}</td>
                    <td className="px-4 py-3 font-medium">{formatarMoeda(linha.margem)}</td>
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
