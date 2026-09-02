import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BotaoVoltar } from "@/components/BotaoVoltar";
import { useAuth } from "@/contexts/AuthContext";
import { listarJurosParcelas } from "@/lib/configuracoes";
import { mensagemDeErro } from "@/lib/errors";
import {
  custoDosItens,
  mapaCustoPecas,
  mapaCustoServicos,
} from "@/schemas/metricasCaixa";
import { listarClientes } from "@/lib/clientes";
import { listarFuncionarios } from "@/lib/funcionarios";
import {
  adicionarItensOrdem,
  atualizarOrdem,
  concluirOrdem,
  criarOrdem,
  faturarOrdem,
  listarOrdens,
} from "@/lib/ordensServico";
import type { PagamentoOrdem } from "@/lib/ordensServico";
import { listarArquivosDasOrdens } from "@/lib/notasFiscais";
import { listarPecas } from "@/lib/pecas";
import { listarServicos } from "@/lib/servicos";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { Cliente } from "@/types/cliente";
import type { JurosParcela } from "@/types/configuracao";
import type { Funcionario } from "@/types/funcionario";
import type {
  NovaOrdemServico,
  NovoItemOS,
  OrdemServico,
  PatchOrdemServico,
} from "@/types/os";
import {
  STATUS_COM_FECHAMENTO,
  nomeOrdem,
  totalOrdem,
  totalPorTipo,
} from "@/types/os";
import type { NotaFiscalArquivo } from "@/types/notaFiscal";
import { agruparNotasPorOrdem } from "@/schemas/situacaoFiscal";
import type { Peca } from "@/types/peca";
import type { Servico } from "@/types/servico";
import { FaturamentoCard } from "./FaturamentoCard";
import { StatusOrdem } from "./StatusOrdemBadge";
import { OrdemServicoForm } from "./OrdemServicoForm";

function primeiroDiaDoMes(): string {
  const hoje = new Date();
  return new Date(hoje.getFullYear(), hoje.getMonth(), 1).toLocaleDateString("sv-SE");
}

function hojeStr(): string {
  return new Date().toLocaleDateString("sv-SE");
}

// `data_abertura` vem do banco em UTC — não dá pra pegar o "dia" com um
// `.slice(0, 10)` na string, porque isso pega o dia em UTC, não no fuso
// local. No Brasil (UTC-3), qualquer OS aberta depois das ~21h vira "amanhã"
// em UTC e sumiria do filtro "Até: hoje" (que é calculado em hora local) até
// a data virar de verdade. Convertendo pra `Date` e formatando com
// `toLocaleDateString`, o "dia" bate com o fuso local, igual ao Caixa Diário
// já faz (`DiarioSection.tsx` → `paraDataLocal`).
function paraDataLocal(dataIso: string): string {
  return new Date(dataIso).toLocaleDateString("sv-SE");
}

function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function OrdensServicoPage() {
  const { operador, lojaAtual } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [pecas, setPecas] = useState<Peca[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [jurosParcelas, setJurosParcelas] = useState<JurosParcela[]>([]);
  const [notasPorOrdem, setNotasPorOrdem] = useState<Map<string, NotaFiscalArquivo[]>>(
    () => new Map(),
  );
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [ordemEmEdicao, setOrdemEmEdicao] = useState<OrdemServico | null>(null);
  const [abaInicialEdicao, setAbaInicialEdicao] = useState<"detalhes" | "fechamento">("detalhes");
  const [ordemFaturando, setOrdemFaturando] = useState<OrdemServico | null>(null);
  const [dataInicio, setDataInicio] = useState(primeiroDiaDoMes());
  const [dataFim, setDataFim] = useState(hojeStr());
  const [busca, setBusca] = useState("");
  const funcionarioAtualId =
    funcionarios.find((f) => f.operador_id === operador?.id)?.id ?? "";

  const custoPorPeca = useMemo(() => mapaCustoPecas(pecas), [pecas]);
  const custoPorServico = useMemo(() => mapaCustoServicos(servicos), [servicos]);

  // Usa a mesma conta de custo do Caixa, do Início e de Relações
  // (schemas/metricasCaixa.ts) em vez de refazer a soma aqui: cada tela que
  // recalculava lucro por conta própria acabou divergindo das outras — ver
  // PROJETO_STATUS.md, seção 6, item 40.
  function lucroOrdem(ordem: OrdemServico): number {
    const itens = ordem.itens ?? [];
    return totalOrdem(itens) - custoDosItens(itens, custoPorPeca, custoPorServico);
  }

  // Ordens em aberto (ainda não faturadas) sempre aparecem, não importa a
  // data — senão uma OS esquecida do mês passado sumiria da lista sem
  // ninguém perceber. O filtro de período só afasta o histórico já faturado,
  // que é o que realmente cresce sem parar. Buscando por cliente/placa, o
  // período é ignorado (a busca vale pra qualquer época).
  const ordensFiltradas = useMemo(() => {
    const buscaNormalizada = busca.trim().toLowerCase();
    return ordens.filter((ordem) => {
      if (buscaNormalizada) {
        const nomeCliente = ordem.cliente?.nome?.toLowerCase() ?? "";
        const placa = ordem.veiculo?.placa?.toLowerCase() ?? "";
        return nomeCliente.includes(buscaNormalizada) || placa.includes(buscaNormalizada);
      }
      if (ordem.status !== "faturada") return true;
      const dia = paraDataLocal(ordem.data_abertura);
      return dia >= dataInicio && dia <= dataFim;
    });
  }, [ordens, busca, dataInicio, dataFim]);

  async function carregar() {
    if (!isSupabaseConfigured || !lojaAtual) {
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
        funcionariosCarregados,
        jurosCarregados,
      ] = await Promise.all([
        listarOrdens(lojaAtual.id),
        listarClientes(),
        listarPecas(),
        listarServicos(),
        listarFuncionarios(lojaAtual.id),
        listarJurosParcelas(lojaAtual.id),
      ]);
      setOrdens(ordensCarregadas);
      setClientes(clientesCarregados);
      setPecas(pecasCarregadas);
      setServicos(servicosCarregados);
      setFuncionarios(funcionariosCarregados);
      setJurosParcelas(jurosCarregados);

      // Notas de todas as OS de uma vez só (uma consulta, não uma por linha)
      // — é o que diz quais notas cada OS já tem. Falhar aqui não pode
      // derrubar a lista inteira: sem essa informação a OS só aparece como
      // "Faturada", que é o comportamento de antes.
      try {
        const notas = await listarArquivosDasOrdens(ordensCarregadas.map((o) => o.id));
        setNotasPorOrdem(agruparNotasPorOrdem(notas));
      } catch (err) {
        console.error("Erro ao carregar as notas fiscais das ordens:", err);
      }

      const abrirOrdemId = (location.state as { abrirOrdemId?: string } | null)?.abrirOrdemId;
      if (abrirOrdemId) {
        const ordemParaAbrir = ordensCarregadas.find((o) => o.id === abrirOrdemId);
        if (ordemParaAbrir) setOrdemEmEdicao(ordemParaAbrir);
        navigate(location.pathname, { replace: true, state: null });
      }
    } catch (err) {
      console.error("Erro ao carregar ordens de serviço:", err);
      setErro(mensagemDeErro(err));
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lojaAtual?.id]);

  async function handleSalvarNova(ordem: NovaOrdemServico, itens: NovoItemOS[]) {
    if (!operador || !lojaAtual) return;
    await criarOrdem(ordem, itens, operador.id, lojaAtual.id);
    setMostrarFormulario(false);
    await carregar();
  }

  async function handleSalvarEdicao(
    id: string,
    patch: PatchOrdemServico,
    novosItens: NovoItemOS[],
  ) {
    if (!operador || !lojaAtual) return;
    if (novosItens.length > 0 && ordemEmEdicao?.status === "faturada") {
      throw new Error(
        "Esta OS já foi faturada — não dá mais pra acrescentar peça ou serviço nela.",
      );
    }
    await atualizarOrdem(id, patch, operador.id);
    if (novosItens.length > 0 && ordemEmEdicao) {
      await adicionarItensOrdem(id, ordemEmEdicao.numero, novosItens, operador.id, lojaAtual.id);
    }
    setOrdemEmEdicao(null);
    await carregar();
  }

  async function handleEncerrar(ordem: OrdemServico) {
    if (!operador) return;
    await concluirOrdem(ordem.id, operador.id);
    setOrdemEmEdicao(null);
    setOrdemFaturando({ ...ordem, status: "concluida" });
    await carregar();
  }

  async function confirmarFaturamento(
    pagamentos: PagamentoOrdem[],
    parcelas: number,
    previsaoRecebimento: string | null,
  ) {
    if (!ordemFaturando) return;
    await faturarOrdem(ordemFaturando, pagamentos, parcelas, previsaoRecebimento);
    setOrdemFaturando(null);
    await carregar();
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BotaoVoltar />
          <div>
            <h1 className="text-2xl font-semibold text-sakura-purple-dark">
              Ordens de Serviço
            </h1>
            <p className="text-sm text-sakura-muted">
              Cliente + veículo + peças usadas + serviço realizado
            </p>
          </div>
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

      {isSupabaseConfigured && !carregando && !lojaAtual && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Seu usuário não tem loja atribuída. Fale com o administrador.
        </p>
      )}

      {isSupabaseConfigured && !carregando && lojaAtual && clientes.length === 0 && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Cadastre ao menos um cliente antes de abrir uma ordem de serviço.
        </p>
      )}

      {mostrarFormulario && operador && (
        <OrdemServicoForm
          clientes={clientes}
          pecas={pecas}
          servicos={servicos}
          funcionarios={funcionarios}
          funcionarioAtualId={funcionarioAtualId}
          onSalvarNova={handleSalvarNova}
          onSalvarEdicao={handleSalvarEdicao}
          onEncerrar={handleEncerrar}
          onCancelar={() => setMostrarFormulario(false)}
        />
      )}

      {ordemEmEdicao && operador && (
        <OrdemServicoForm
          clientes={clientes}
          pecas={pecas}
          servicos={servicos}
          funcionarios={funcionarios}
          funcionarioAtualId={funcionarioAtualId}
          ordemExistente={ordemEmEdicao}
          abaInicial={abaInicialEdicao}
          onSalvarNova={handleSalvarNova}
          onSalvarEdicao={handleSalvarEdicao}
          onEncerrar={handleEncerrar}
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

      {!carregando && ordens.length > 0 && (
        <div className="flex flex-wrap items-end gap-4">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-sakura-purple-dark/80">Buscar por cliente ou placa</span>
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Ex: João ou ABC1D23"
              className="w-56 rounded-lg border border-sakura-gray/40 px-3 py-1.5 text-sm outline-none focus:border-sakura-purple"
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-sakura-purple-dark/80">
            De:
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              disabled={!!busca.trim()}
              className="rounded-lg border border-sakura-gray/40 px-3 py-1.5 disabled:opacity-40"
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-sakura-purple-dark/80">
            Até:
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              disabled={!!busca.trim()}
              className="rounded-lg border border-sakura-gray/40 px-3 py-1.5 disabled:opacity-40"
            />
          </label>
          <p className="text-xs text-sakura-muted">
            {busca.trim()
              ? "Buscando em todo o histórico, sem limite de data."
              : "OS em aberto sempre aparecem, não importa a data — o período filtra só o histórico já faturado."}
          </p>
        </div>
      )}

      {carregando ? (
        <p className="text-sm text-sakura-muted">Carregando...</p>
      ) : ordens.length === 0 ? (
        <p className="text-sm text-sakura-muted">
          Nenhuma ordem de serviço aberta ainda.
        </p>
      ) : ordensFiltradas.length === 0 ? (
        <p className="text-sm text-sakura-muted">
          Nenhuma ordem de serviço encontrada com esse filtro.
        </p>
      ) : (
        <div className="overflow-hidden sakura-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-sakura-pink-soft text-sakura-purple-dark">
              <tr>
                <th className="px-4 py-3 font-medium">Nº</th>
                <th className="px-4 py-3 font-medium">Cliente</th>
                <th className="px-4 py-3 font-medium">Veículo</th>
                <th className="px-4 py-3 font-medium">Aberta em</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Peças</th>
                <th className="px-4 py-3 font-medium">Serviços</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Lucro</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {ordensFiltradas.map((ordem) => (
                <tr
                  key={ordem.id}
                  onClick={() => {
                    setMostrarFormulario(false);
                    setAbaInicialEdicao("detalhes");
                    setOrdemEmEdicao(ordem);
                  }}
                  className="cursor-pointer border-t border-sakura-gray/20 hover:bg-sakura-pink-soft/30"
                >
                  <td className="px-4 py-3 text-sakura-muted">{nomeOrdem(ordem.numero)}</td>
                  <td className="px-4 py-3">{ordem.cliente?.nome ?? "—"}</td>
                  <td className="px-4 py-3">{ordem.veiculo?.placa ?? "—"}</td>
                  <td className="px-4 py-3">
                    {new Date(ordem.data_abertura).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-3">
                    <StatusOrdem ordem={ordem} notas={notasPorOrdem.get(ordem.id) ?? []} />
                  </td>
                  <td className="px-4 py-3">{formatarMoeda(totalPorTipo(ordem.itens ?? [], "peca"))}</td>
                  <td className="px-4 py-3">
                    {formatarMoeda(totalPorTipo(ordem.itens ?? [], "servico"))}
                  </td>
                  <td className="px-4 py-3">{formatarMoeda(totalOrdem(ordem.itens ?? []))}</td>
                  <td className="px-4 py-3">{formatarMoeda(lucroOrdem(ordem))}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      {STATUS_COM_FECHAMENTO.includes(ordem.status) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMostrarFormulario(false);
                            setAbaInicialEdicao("fechamento");
                            setOrdemEmEdicao(ordem);
                          }}
                          className="rounded-full border border-sakura-purple px-3 py-1.5 text-xs font-medium text-sakura-purple-dark hover:bg-sakura-pink-soft/40"
                        >
                          Fechamento
                        </button>
                      )}
                      {ordem.status !== "faturada" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOrdemFaturando(ordem);
                          }}
                          className="rounded-full bg-sakura-purple px-3 py-1.5 text-xs font-medium text-white hover:opacity-90"
                        >
                          Faturar
                        </button>
                      )}
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
