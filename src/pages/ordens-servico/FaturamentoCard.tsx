import { useState } from "react";
import { BotaoVoltar } from "@/components/BotaoVoltar";
import { mensagemDeErro } from "@/lib/errors";
import type { PagamentoOrdem } from "@/lib/ordensServico";
import type { JurosParcela } from "@/types/configuracao";
import { FORMA_PAGAMENTO_LABEL, nomeOrdem, totalOrdem } from "@/types/os";
import type { OrdemServico } from "@/types/os";

interface FaturamentoCardProps {
  ordem: OrdemServico;
  jurosParcelas: JurosParcela[];
  onConfirmar: (
    pagamentos: PagamentoOrdem[],
    parcelas: number,
    previsaoRecebimento: string | null,
  ) => Promise<void>;
  onCancelar: () => void;
}

interface LinhaPagamento {
  formaPagamento: string;
  valor: string;
}

function hojeIso(): string {
  const hoje = new Date();
  return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(
    hoje.getDate(),
  ).padStart(2, "0")}`;
}

const FORMAS_PAGAMENTO = Object.entries(FORMA_PAGAMENTO_LABEL).map(([valor, label]) => ({
  valor,
  label,
}));

function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function addMeses(data: Date, meses: number): Date {
  const nova = new Date(data);
  nova.setMonth(nova.getMonth() + meses);
  return nova;
}

export function FaturamentoCard({
  ordem,
  jurosParcelas,
  onConfirmar,
  onCancelar,
}: FaturamentoCardProps) {
  const total = totalOrdem(ordem.itens ?? []);

  const [formaPagamento, setFormaPagamento] = useState("pix");
  const [parcelas, setParcelas] = useState(1);
  const [dividirPagamento, setDividirPagamento] = useState(false);
  const [linhasPagamento, setLinhasPagamento] = useState<LinhaPagamento[]>([
    { formaPagamento: "pix", valor: String(total) },
    { formaPagamento: "cartao_credito", valor: "0" },
  ]);
  const [recebidoAgora, setRecebidoAgora] = useState(true);
  const [previsaoRecebimento, setPrevisaoRecebimento] = useState(hojeIso());
  const [confirmando, setConfirmando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const permiteParcelar = !dividirPagamento && formaPagamento === "cartao_credito";
  const jurosPercentual =
    !dividirPagamento && parcelas > 1
      ? jurosParcelas.find((j) => j.numero_parcelas === parcelas)?.juros_percentual ?? 0
      : 0;
  const valorCobrado = total * (1 + jurosPercentual / 100);
  const valorParcela = valorCobrado / parcelas;
  const hoje = new Date();
  const listaParcelas = Array.from({ length: parcelas }, (_, i) => ({
    numero: i + 1,
    vencimento: addMeses(hoje, i + 1),
    valor: valorParcela,
  }));

  const somaLinhasPagamento = linhasPagamento.reduce(
    (soma, linha) => soma + (Number(linha.valor) || 0),
    0,
  );
  const diferencaLinhasPagamento = valorCobrado - somaLinhasPagamento;
  const linhasBatem = Math.abs(diferencaLinhasPagamento) < 0.01;

  function handleFormaPagamentoChange(valor: string) {
    setFormaPagamento(valor);
    if (valor !== "cartao_credito") setParcelas(1);
  }

  function handleDividirPagamentoChange(dividir: boolean) {
    setDividirPagamento(dividir);
    if (dividir) {
      setParcelas(1);
      setLinhasPagamento([
        { formaPagamento: "pix", valor: String(total) },
        { formaPagamento: "cartao_credito", valor: "0" },
      ]);
    }
  }

  function atualizarLinha(index: number, patch: Partial<LinhaPagamento>) {
    setLinhasPagamento((atual) =>
      atual.map((linha, i) => (i === index ? { ...linha, ...patch } : linha)),
    );
  }

  function adicionarLinha() {
    setLinhasPagamento((atual) => [...atual, { formaPagamento: "dinheiro", valor: "0" }]);
  }

  function removerLinha(index: number) {
    setLinhasPagamento((atual) => atual.filter((_, i) => i !== index));
  }

  async function handleConfirmar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    if (recebidoAgora && dividirPagamento && !linhasBatem) {
      setErro("A soma das formas de pagamento precisa bater com o total cobrado.");
      return;
    }

    const pagamentos: PagamentoOrdem[] =
      recebidoAgora && dividirPagamento
        ? linhasPagamento
            .filter((linha) => Number(linha.valor) > 0)
            .map((linha) => ({ formaPagamento: linha.formaPagamento, valor: Number(linha.valor) }))
        : [{ formaPagamento, valor: valorCobrado }];

    setConfirmando(true);
    try {
      await onConfirmar(pagamentos, parcelas, recebidoAgora ? null : previsaoRecebimento);
    } catch (err) {
      console.error("Erro ao faturar ordem de serviço:", err);
      setErro(mensagemDeErro(err));
    } finally {
      setConfirmando(false);
    }
  }

  return (
    <form onSubmit={handleConfirmar} className="space-y-5 sakura-card p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <BotaoVoltar onClick={onCancelar} />
        <div>
          <h3 className="text-sm font-semibold text-sakura-purple-dark">
            Faturar {nomeOrdem(ordem.numero)} de {ordem.cliente?.nome ?? "cliente"}
          </h3>
          <p className="text-xs text-sakura-muted">
            Total dos itens: {formatarMoeda(total)}
          </p>
        </div>
      </div>

      {erro && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{erro}</p>
      )}

      <div className="rounded-xl border border-sakura-gray/30 p-4">
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="recebimento"
              checked={recebidoAgora}
              onChange={() => setRecebidoAgora(true)}
              className="h-4 w-4 text-sakura-purple focus:ring-sakura-purple"
            />
            <span className="text-sakura-purple-dark/80">Recebido agora</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="recebimento"
              checked={!recebidoAgora}
              onChange={() => setRecebidoAgora(false)}
              className="h-4 w-4 text-sakura-purple focus:ring-sakura-purple"
            />
            <span className="text-sakura-purple-dark/80">A receber depois</span>
          </label>
        </div>

        {recebidoAgora ? (
          <p className="mt-2 text-xs text-sakura-muted">
            Lança o valor como Entrada no Caixa agora mesmo.
          </p>
        ) : (
          <>
            <p className="mt-2 text-xs text-sakura-muted">
              Não lança nada no Caixa ainda — cria uma pendência em "Contas a Receber", que só vira
              Entrada quando você marcar como recebido de verdade.
            </p>
            <label className="mt-2 flex items-center gap-2 text-sm">
              <span className="text-sakura-purple-dark/80">Previsão de recebimento</span>
              <input
                type="date"
                value={previsaoRecebimento}
                onChange={(e) => setPrevisaoRecebimento(e.target.value)}
                className="rounded-lg border border-sakura-gray/40 px-3 py-1.5 outline-none focus:border-sakura-purple"
              />
            </label>
          </>
        )}
      </div>

      {recebidoAgora && (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={dividirPagamento}
            onChange={(e) => handleDividirPagamentoChange(e.target.checked)}
            className="h-4 w-4 text-sakura-purple focus:ring-sakura-purple"
          />
          <span className="text-sakura-purple-dark/80">
            Dividir em mais de uma forma de pagamento
          </span>
        </label>
      )}

      {recebidoAgora && dividirPagamento ? (
        <div className="space-y-2">
          {linhasPagamento.map((linha, index) => (
            <div key={index} className="flex items-center gap-2">
              <select
                value={linha.formaPagamento}
                onChange={(e) => atualizarLinha(index, { formaPagamento: e.target.value })}
                className="flex-1 rounded-lg border border-sakura-gray/40 px-3 py-2 text-sm outline-none focus:border-sakura-purple"
              >
                {FORMAS_PAGAMENTO.map((forma) => (
                  <option key={forma.valor} value={forma.valor}>
                    {forma.label}
                  </option>
                ))}
              </select>
              <input
                type="number"
                step="0.01"
                min="0"
                value={linha.valor}
                onChange={(e) => atualizarLinha(index, { valor: e.target.value })}
                className="w-32 rounded-lg border border-sakura-gray/40 px-3 py-2 text-sm outline-none focus:border-sakura-purple"
              />
              {linhasPagamento.length > 1 && (
                <button
                  type="button"
                  onClick={() => removerLinha(index)}
                  className="text-xs font-medium text-red-600 hover:underline"
                >
                  Remover
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={adicionarLinha}
            className="text-xs font-medium text-sakura-purple hover:underline"
          >
            + Adicionar forma de pagamento
          </button>
          <p
            className={`text-right text-sm font-medium ${
              linhasBatem ? "text-sakura-purple-dark" : "text-red-600"
            }`}
          >
            {linhasBatem
              ? `Total: ${formatarMoeda(valorCobrado)}`
              : diferencaLinhasPagamento > 0
                ? `Falta ${formatarMoeda(diferencaLinhasPagamento)} de ${formatarMoeda(valorCobrado)}`
                : `Passou ${formatarMoeda(-diferencaLinhasPagamento)} de ${formatarMoeda(valorCobrado)}`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-sakura-purple-dark/80">Forma de pagamento</span>
            <select
              value={formaPagamento}
              onChange={(e) => handleFormaPagamentoChange(e.target.value)}
              className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
            >
              {FORMAS_PAGAMENTO.map((forma) => (
                <option key={forma.valor} value={forma.valor}>
                  {forma.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="text-sakura-purple-dark/80">Parcelas</span>
            <select
              value={parcelas}
              onChange={(e) => setParcelas(Number(e.target.value))}
              disabled={!permiteParcelar}
              className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple disabled:opacity-50"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => {
                const percentual = jurosParcelas.find((j) => j.numero_parcelas === n)?.juros_percentual ?? 0;
                return (
                  <option key={n} value={n}>
                    {n}x{n === 1 ? " à vista" : percentual > 0 ? ` (${percentual}% de juros)` : " sem juros"}
                  </option>
                );
              })}
            </select>
          </label>
        </div>
      )}

      {!(recebidoAgora && dividirPagamento) &&
        (parcelas === 1 ? (
          <p className="text-right text-lg font-semibold text-sakura-purple-dark">
            {formatarMoeda(valorCobrado)}
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-sakura-gray/30">
            <table className="w-full text-left text-sm">
              <thead className="bg-sakura-pink-soft text-sakura-purple-dark">
                <tr>
                  <th className="px-4 py-2 font-medium">Parcela</th>
                  <th className="px-4 py-2 font-medium">Vencimento</th>
                  <th className="px-4 py-2 font-medium">Valor</th>
                </tr>
              </thead>
              <tbody>
                {listaParcelas.map((p) => (
                  <tr key={p.numero} className="border-t border-sakura-gray/20">
                    <td className="px-4 py-2 text-sakura-purple-dark">{p.numero}x</td>
                    <td className="px-4 py-2 text-sakura-purple-dark">
                      {p.vencimento.toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-4 py-2 text-sakura-purple-dark">
                      {formatarMoeda(p.valor)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="border-t border-sakura-gray/20 px-4 py-2 text-right text-sm font-semibold text-sakura-purple-dark">
              Total {jurosPercentual > 0 ? "com juros" : ""}: {formatarMoeda(valorCobrado)}
            </p>
          </div>
        ))}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancelar}
          className="rounded-xl px-4 py-2 text-sm font-medium text-sakura-purple-dark/90 hover:bg-sakura-gray/10"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={confirmando || (recebidoAgora && dividirPagamento && !linhasBatem)}
          className="rounded-xl bg-sakura-purple px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {confirmando ? "Faturando..." : "Confirmar faturamento"}
        </button>
      </div>
    </form>
  );
}
