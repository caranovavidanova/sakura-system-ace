import { useState } from "react";
import { BotaoVoltar } from "@/components/BotaoVoltar";
import { mensagemDeErro } from "@/lib/errors";
import type { Cliente } from "@/types/cliente";
import type { Funcionario } from "@/types/funcionario";
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
import { FechamentoTab } from "./FechamentoTab";
import { ItemOSRow } from "./ItemOSRow";

const STATUS_COM_FECHAMENTO: StatusOS[] = ["concluida", "faturada"];

interface OrdemServicoFormProps {
  clientes: Cliente[];
  pecas: Peca[];
  servicos: Servico[];
  funcionarios: Funcionario[];
  funcionarioAtualId: string;
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
  funcionarios,
  funcionarioAtualId,
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
  const [vendedorId, setVendedorId] = useState(
    ordemExistente?.vendedor_id ?? funcionarioAtualId,
  );
  const [status, setStatus] = useState<StatusOS>(ordemExistente?.status ?? "aberta");
  const [itens, setItens] = useState<NovoItemOS[]>(
    ordemExistente ? [] : [novoItemVazio()],
  );
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const temFechamento =
    !!ordemExistente && STATUS_COM_FECHAMENTO.includes(ordemExistente.status);
  const [aba, setAba] = useState<"detalhes" | "fechamento">("detalhes");

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

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 sakura-card p-6 shadow-sm"
    >
      {ordemExistente ? (
        <div className="flex items-center justify-between border-b border-sakura-gray/20 pb-4">
          <div className="flex items-center gap-3">
            <BotaoVoltar onClick={onCancelar} />
            <div>
              <p className="text-xs text-sakura-muted">
                OS #{ordemExistente.id.slice(0, 8)} · aberta em{" "}
                {formatarData(ordemExistente.data_abertura)}
              </p>
              <h2 className="text-lg font-semibold text-sakura-purple-dark">
                {ordemExistente.cliente?.nome ?? "Cliente"}
                {ordemExistente.veiculo?.placa ? ` — ${ordemExistente.veiculo.placa}` : ""}
              </h2>
            </div>
          </div>
          <span className="rounded-full bg-sakura-pink-soft px-3 py-1 text-xs font-medium text-sakura-purple-dark">
            {STATUS_LABEL[ordemExistente.status]}
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <BotaoVoltar onClick={onCancelar} />
          <h2 className="text-lg font-semibold text-sakura-purple-dark">
            Nova ordem de serviço
          </h2>
        </div>
      )}

      {erro && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          {erro}
        </p>
      )}

      {temFechamento && (
        <div className="flex gap-2 border-b border-sakura-gray/20">
          <button
            type="button"
            onClick={() => setAba("detalhes")}
            className={`px-4 py-2 text-sm font-medium ${
              aba === "detalhes"
                ? "border-b-2 border-sakura-purple text-sakura-purple-dark"
                : "text-sakura-purple-dark/75 hover:text-sakura-purple-dark"
            }`}
          >
            Detalhes
          </button>
          <button
            type="button"
            onClick={() => setAba("fechamento")}
            className={`px-4 py-2 text-sm font-medium ${
              aba === "fechamento"
                ? "border-b-2 border-sakura-purple text-sakura-purple-dark"
                : "text-sakura-purple-dark/75 hover:text-sakura-purple-dark"
            }`}
          >
            Fechamento
          </button>
        </div>
      )}

      {aba === "fechamento" && ordemExistente && <FechamentoTab ordem={ordemExistente} />}

      {aba === "detalhes" && (
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
                {funcionarios.map((funcionario) => (
                  <option key={funcionario.id} value={funcionario.id}>
                    {funcionario.nome}
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
                <p className="mb-1 text-xs font-medium text-sakura-purple-dark/85">
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
                  funcionarios={funcionarios}
                  onChange={(novoItem) => atualizarItem(index, novoItem)}
                  onRemover={() => removerItem(index)}
                />
              ))}
              {itens.length === 0 && (
                <p className="text-xs text-sakura-muted">
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
          {ordemExistente && (
            <div className="space-y-3 sakura-card p-4">
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
                  <span className="text-xs text-sakura-muted">
                    OS já faturada — status não muda mais por aqui.
                  </span>
                )}
              </label>

              <div className="border-t border-sakura-gray/20 pt-3 text-xs text-sakura-purple-dark/90">
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
        </div>
      </div>
      )}

      <div className="flex justify-end gap-3 border-t border-sakura-gray/20 pt-4">
        <button
          type="button"
          onClick={onCancelar}
          className="rounded-xl px-4 py-2 text-sm font-medium text-sakura-purple-dark/90 hover:bg-sakura-gray/10"
        >
          Cancelar
        </button>
        {aba === "detalhes" && (
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
        )}
      </div>
    </form>
  );
}
