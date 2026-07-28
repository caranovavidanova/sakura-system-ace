import { useState } from "react";
import { mensagemDeErro } from "@/lib/errors";
import type { Cliente } from "@/types/cliente";
import type { Operador } from "@/types/operador";
import type {
  NovaOrdemServico,
  NovoItemOS,
  OrdemServico,
  PatchOrdemServico,
  StatusOS,
} from "@/types/os";
import { STATUS_LABEL, totalOrdem } from "@/types/os";
import type { Peca } from "@/types/peca";
import type { Servico } from "@/types/servico";
import { ItemOSRow } from "./ItemOSRow";

interface OrdemServicoFormProps {
  clientes: Cliente[];
  pecas: Peca[];
  servicos: Servico[];
  operadores: Operador[];
  operadorAtualId: string;
  ordemExistente?: OrdemServico;
  onSalvarNova: (ordem: NovaOrdemServico, itens: NovoItemOS[]) => Promise<void>;
  onSalvarEdicao: (
    id: string,
    patch: PatchOrdemServico,
    novosItens: NovoItemOS[],
  ) => Promise<void>;
  onCancelar: () => void;
}

function novoItemVazio(): NovoItemOS {
  return {
    tipo: "peca",
    peca_id: null,
    servico_id: null,
    tecnico_id: null,
    descricao: "",
    quantidade: 1,
    preco_unitario: 0,
    desconto: 0,
  };
}

function paraInputDatetime(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function paraIso(valor: string): string | null {
  return valor ? new Date(valor).toISOString() : null;
}

function formatarData(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function OrdemServicoForm({
  clientes,
  pecas,
  servicos,
  operadores,
  operadorAtualId,
  ordemExistente,
  onSalvarNova,
  onSalvarEdicao,
  onCancelar,
}: OrdemServicoFormProps) {
  const [clienteId, setClienteId] = useState(ordemExistente?.cliente_id ?? "");
  const [veiculoId, setVeiculoId] = useState(ordemExistente?.veiculo_id ?? "");
  const [kmEntrada, setKmEntrada] = useState(
    ordemExistente?.km_entrada != null ? String(ordemExistente.km_entrada) : "",
  );
  const [descricaoProblema, setDescricaoProblema] = useState(
    ordemExistente?.descricao_problema ?? "",
  );
  const [previsaoEntrega, setPrevisaoEntrega] = useState(
    paraInputDatetime(ordemExistente?.previsao_entrega),
  );
  const [dataRetorno, setDataRetorno] = useState(
    paraInputDatetime(ordemExistente?.data_retorno),
  );
  const [vendedorId, setVendedorId] = useState(
    ordemExistente?.vendedor_id ?? operadorAtualId,
  );
  const [status, setStatus] = useState<StatusOS>(ordemExistente?.status ?? "aberta");
  const [itens, setItens] = useState<NovoItemOS[]>(
    ordemExistente ? [] : [novoItemVazio()],
  );
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const clienteSelecionado = clientes.find((c) => c.id === clienteId);
  const veiculosDoCliente = clienteSelecionado?.veiculos ?? [];
  const itensExistentes = ordemExistente?.itens ?? [];
  const totalGeral =
    totalOrdem(itensExistentes) +
    totalOrdem(itens.map((item) => ({ ...item, id: "", ordem_servico_id: "" })));

  function atualizarItem(index: number, item: NovoItemOS) {
    setItens((atual) => atual.map((it, i) => (i === index ? item : it)));
  }

  function removerItem(index: number) {
    setItens((atual) => atual.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    if (!clienteId) {
      setErro("Selecione um cliente.");
      return;
    }
    const itensValidos = itens.filter(
      (item) => item.descricao.trim() && item.quantidade > 0,
    );

    const camposComuns = {
      cliente_id: clienteId,
      veiculo_id: veiculoId || null,
      km_entrada: kmEntrada ? Number(kmEntrada) : null,
      descricao_problema: descricaoProblema.trim() || null,
      previsao_entrega: paraIso(previsaoEntrega),
      data_retorno: paraIso(dataRetorno),
      vendedor_id: vendedorId || null,
    };

    setSalvando(true);
    try {
      if (ordemExistente) {
        await onSalvarEdicao(
          ordemExistente.id,
          { ...camposComuns, status },
          itensValidos,
        );
      } else {
        await onSalvarNova(camposComuns, itensValidos);
      }
    } catch (err) {
      console.error("Erro ao salvar ordem de serviço:", err);
      setErro(mensagemDeErro(err));
    } finally {
      setSalvando(false);
    }
  }

  function emitirPlaceholderFiscal(tipo: "NFe" | "NFS-e") {
    alert(
      `Emissão de ${tipo} ainda não está disponível — falta escolher o provedor fiscal ` +
        "(Focus NFe, eNotas, PlugNotas ou similar) e, no caso da NFS-e, confirmar o " +
        "município da loja. Assim que essa decisão for tomada, este botão passa a emitir de verdade.",
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-sakura-gray/30 bg-white p-6 shadow-sm"
    >
      {ordemExistente && (
        <div className="flex items-center justify-between border-b border-sakura-gray/20 pb-4">
          <div>
            <p className="text-xs text-sakura-gray">
              OS #{ordemExistente.id.slice(0, 8)} · aberta em{" "}
              {formatarData(ordemExistente.data_abertura)}
            </p>
            <h2 className="text-lg font-semibold text-sakura-purple-dark">
              {ordemExistente.cliente?.nome ?? "Cliente"}
              {ordemExistente.veiculo?.placa ? ` — ${ordemExistente.veiculo.placa}` : ""}
            </h2>
          </div>
          <span className="rounded-full bg-sakura-pink-soft px-3 py-1 text-xs font-medium text-sakura-purple-dark">
            {STATUS_LABEL[ordemExistente.status]}
          </span>
        </div>
      )}

      {erro && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          {erro}
        </p>
      )}

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <section className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-sakura-purple-dark/80">
                Cliente <span className="text-red-500">*</span>
              </span>
              <select
                value={clienteId}
                onChange={(e) => {
                  setClienteId(e.target.value);
                  setVeiculoId("");
                }}
                className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
              >
                <option value="">Selecione o cliente</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nome}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm">
              <span className="text-sakura-purple-dark/80">Veículo</span>
              <select
                value={veiculoId}
                onChange={(e) => setVeiculoId(e.target.value)}
                disabled={!clienteId}
                className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple disabled:opacity-50"
              >
                <option value="">Sem veículo vinculado</option>
                {veiculosDoCliente.map((veiculo) => (
                  <option key={veiculo.id} value={veiculo.id}>
                    {veiculo.placa} — {veiculo.marca} {veiculo.modelo}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm">
              <span className="text-sakura-purple-dark/80">KM de entrada</span>
              <input
                type="number"
                value={kmEntrada}
                onChange={(e) => setKmEntrada(e.target.value)}
                className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              <span className="text-sakura-purple-dark/80">Vendedor / atendente</span>
              <select
                value={vendedorId}
                onChange={(e) => setVendedorId(e.target.value)}
                className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
              >
                {operadores.map((operador) => (
                  <option key={operador.id} value={operador.id}>
                    {operador.nome}
                  </option>
                ))}
              </select>
            </label>

            <label className="col-span-2 flex flex-col gap-1 text-sm">
              <span className="text-sakura-purple-dark/80">Observação</span>
              <textarea
                value={descricaoProblema}
                onChange={(e) => setDescricaoProblema(e.target.value)}
                rows={2}
                className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
              />
            </label>
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-sakura-purple-dark">
                Peças e serviços
              </h3>
              <button
                type="button"
                onClick={() => setItens((atual) => [...atual, novoItemVazio()])}
                className="text-xs font-medium text-sakura-purple hover:underline"
              >
                + adicionar item
              </button>
            </div>

            {itensExistentes.length > 0 && (
              <div className="mb-3 space-y-1.5 rounded-lg bg-sakura-gray/5 p-3">
                <p className="mb-1 text-xs font-medium text-sakura-purple-dark/60">
                  Já lançados nesta OS
                </p>
                {itensExistentes.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-sm text-sakura-purple-dark/80"
                  >
                    <span>
                      {item.tipo === "peca" ? "Peça" : "Serviço"} — {item.descricao} (
                      {item.quantidade}x){item.tecnico?.nome ? ` · técnico: ${item.tecnico.nome}` : ""}
                    </span>
                    <span>
                      {(item.quantidade * item.preco_unitario - item.desconto).toLocaleString(
                        "pt-BR",
                        { style: "currency", currency: "BRL" },
                      )}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2">
              {itens.map((item, index) => (
                <ItemOSRow
                  key={index}
                  item={item}
                  pecas={pecas}
                  servicos={servicos}
                  operadores={operadores}
                  onChange={(novoItem) => atualizarItem(index, novoItem)}
                  onRemover={() => removerItem(index)}
                />
              ))}
              {itens.length === 0 && (
                <p className="text-xs text-sakura-gray">
                  Nenhum item novo — use "+ adicionar item" pra lançar mais peças ou serviços.
                </p>
              )}
            </div>

            <p className="mt-3 text-right text-sm font-semibold text-sakura-purple-dark">
              Total {ordemExistente ? "geral" : "previsto"}:{" "}
              {totalGeral.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </p>
          </section>
        </div>

        <div className="space-y-4">
          <div className="space-y-3 rounded-2xl border border-sakura-gray/30 p-4">
            <h3 className="text-sm font-semibold text-sakura-purple-dark">Prazos</h3>
            <div className="flex flex-col gap-1 text-sm">
              <span className="text-sakura-purple-dark/80">Entrada</span>
              <span className="text-sakura-purple-dark">
                {ordemExistente ? formatarData(ordemExistente.data_abertura) : "Definida ao salvar"}
              </span>
            </div>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-sakura-purple-dark/80">Previsão de entrega</span>
              <input
                type="datetime-local"
                value={previsaoEntrega}
                onChange={(e) => setPrevisaoEntrega(e.target.value)}
                className="rounded-lg border border-sakura-gray/40 px-3 py-2 text-sm outline-none focus:border-sakura-purple"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-sakura-purple-dark/80">Agendar retorno</span>
              <input
                type="datetime-local"
                value={dataRetorno}
                onChange={(e) => setDataRetorno(e.target.value)}
                className="rounded-lg border border-sakura-gray/40 px-3 py-2 text-sm outline-none focus:border-sakura-purple"
              />
            </label>
          </div>

          {ordemExistente && (
            <div className="space-y-3 rounded-2xl border border-sakura-gray/30 p-4">
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-sakura-purple-dark/80">Status</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as StatusOS)}
                  disabled={ordemExistente.status === "faturada"}
                  className="rounded-lg border border-sakura-gray/40 px-3 py-2 text-sm outline-none focus:border-sakura-purple disabled:opacity-50"
                >
                  <option value="aberta">Aberta</option>
                  <option value="em_andamento">Em andamento</option>
                  <option value="concluida">Concluída</option>
                  {ordemExistente.status === "faturada" && (
                    <option value="faturada">Faturada</option>
                  )}
                </select>
                {ordemExistente.status === "faturada" && (
                  <span className="text-xs text-sakura-gray">
                    OS já faturada — status não muda mais por aqui.
                  </span>
                )}
              </label>

              <div className="border-t border-sakura-gray/20 pt-3 text-xs text-sakura-purple-dark/70">
                <p>
                  <span className="font-semibold">Criado por:</span>{" "}
                  {ordemExistente.criado_por?.nome ?? "—"}
                </p>
                <p className="mt-1">
                  <span className="font-semibold">Alterado por:</span>{" "}
                  {ordemExistente.atualizado_por?.nome ?? "—"}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-xs font-medium text-sakura-purple-dark/60">
              Nota fiscal
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => emitirPlaceholderFiscal("NFe")}
                className="flex-1 rounded-xl border border-sakura-gray/40 px-3 py-2 text-xs font-medium text-sakura-purple-dark/60 hover:bg-sakura-gray/10"
              >
                Emitir NFe
              </button>
              <button
                type="button"
                onClick={() => emitirPlaceholderFiscal("NFS-e")}
                className="flex-1 rounded-xl border border-sakura-gray/40 px-3 py-2 text-xs font-medium text-sakura-purple-dark/60 hover:bg-sakura-gray/10"
              >
                Emitir NFS-e
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-sakura-gray/20 pt-4">
        <button
          type="button"
          onClick={onCancelar}
          className="rounded-xl px-4 py-2 text-sm font-medium text-sakura-purple-dark/70 hover:bg-sakura-gray/10"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={salvando}
          className="rounded-xl bg-sakura-purple px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {salvando
            ? "Salvando..."
            : ordemExistente
              ? "Salvar alterações"
              : "Abrir ordem de serviço"}
        </button>
      </div>
    </form>
  );
}
