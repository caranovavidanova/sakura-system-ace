import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BotaoVoltar } from "@/components/BotaoVoltar";
import {
  lerRascunhoFormulario,
  limparRascunhoFormulario,
  useRascunhoFormulario,
} from "@/hooks/useRascunhoFormulario";
import { mensagemDeErro } from "@/lib/errors";
import {
  ordemServicoFormSchema,
  paraCamposComuns,
  paraItensValidos,
  paraValoresFormulario,
  type OrdemServicoFormValues,
} from "@/schemas/ordemServico";
import type { Cliente } from "@/types/cliente";
import type { Funcionario } from "@/types/funcionario";
import type {
  NovaOrdemServico,
  NovoItemOS,
  OrdemServico,
  PatchOrdemServico,
} from "@/types/os";
import { STATUS_COM_FECHAMENTO, STATUS_LABEL, nomeOrdem } from "@/types/os";
import type { Peca } from "@/types/peca";
import type { Servico } from "@/types/servico";
import { DetalhesFields } from "./campos/DetalhesFields";
import { ItensFields } from "./campos/ItensFields";
import { FechamentoTab } from "./FechamentoTab";

interface OrdemServicoFormProps {
  clientes: Cliente[];
  pecas: Peca[];
  servicos: Servico[];
  funcionarios: Funcionario[];
  funcionarioAtualId: string;
  ordemExistente?: OrdemServico;
  abaInicial?: "detalhes" | "fechamento";
  onSalvarNova: (ordem: NovaOrdemServico, itens: NovoItemOS[]) => Promise<void>;
  onSalvarEdicao: (
    id: string,
    patch: PatchOrdemServico,
    novosItens: NovoItemOS[],
  ) => Promise<void>;
  onEncerrar: (ordem: OrdemServico) => Promise<void>;
  onCancelar: () => void;
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
  abaInicial = "detalhes",
  onSalvarNova,
  onSalvarEdicao,
  onEncerrar,
  onCancelar,
}: OrdemServicoFormProps) {
  const [erro, setErro] = useState<string | null>(null);
  const [encerrando, setEncerrando] = useState(false);
  const temFechamento =
    !!ordemExistente && STATUS_COM_FECHAMENTO.includes(ordemExistente.status);
  const [aba, setAba] = useState<"detalhes" | "fechamento">(
    temFechamento ? abaInicial : "detalhes",
  );

  const {
    register,
    control,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrdemServicoFormValues>({
    resolver: zodResolver(ordemServicoFormSchema),
    defaultValues: paraValoresFormulario(ordemExistente, funcionarioAtualId),
  });

  const chaveRascunho = `rascunho-os-${ordemExistente?.id ?? "nova"}`;
  const [rascunho, setRascunho] = useState(() =>
    lerRascunhoFormulario<OrdemServicoFormValues>(chaveRascunho),
  );
  useRascunhoFormulario(chaveRascunho, watch);

  function restaurarRascunho() {
    if (!rascunho) return;
    reset(rascunho);
    setRascunho(null);
  }

  function descartarRascunho() {
    limparRascunhoFormulario(chaveRascunho);
    setRascunho(null);
  }

  const itensExistentes = ordemExistente?.itens ?? [];

  async function aoSubmeter(valores: OrdemServicoFormValues) {
    setErro(null);
    const camposComuns = paraCamposComuns(valores);
    const itensValidos = paraItensValidos(valores.itens);
    try {
      if (ordemExistente) {
        await onSalvarEdicao(ordemExistente.id, camposComuns, itensValidos);
      } else {
        await onSalvarNova(camposComuns, itensValidos);
      }
      limparRascunhoFormulario(chaveRascunho);
    } catch (err) {
      console.error("Erro ao salvar ordem de serviço:", err);
      setErro(mensagemDeErro(err));
    }
  }

  async function handleEncerrar() {
    if (!ordemExistente) return;
    setErro(null);
    setEncerrando(true);
    try {
      await onEncerrar(ordemExistente);
    } catch (err) {
      console.error("Erro ao encerrar ordem de serviço:", err);
      setErro(mensagemDeErro(err));
      setEncerrando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(aoSubmeter)} className="space-y-6 sakura-card p-6 shadow-sm">
      {ordemExistente ? (
        <div className="flex items-center justify-between border-b border-sakura-gray/20 pb-4">
          <div className="flex items-center gap-3">
            <BotaoVoltar onClick={onCancelar} />
            <div>
              <p className="text-xs text-sakura-muted">
                {nomeOrdem(ordemExistente.numero)} · aberta em{" "}
                {formatarData(ordemExistente.data_abertura)} · criado por{" "}
                {ordemExistente.criado_por?.nome ?? "—"}
              </p>
              <h2 className="text-lg font-semibold text-sakura-purple-dark">
                {ordemExistente.cliente?.nome ?? "Cliente"}
                {ordemExistente.veiculo?.placa ? ` — ${ordemExistente.veiculo.placa}` : ""}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-sakura-pink-soft px-3 py-1 text-xs font-medium text-sakura-purple-dark">
              {STATUS_LABEL[ordemExistente.status]}
            </span>
            {ordemExistente.status === "em_andamento" && (
              <button
                type="button"
                onClick={handleEncerrar}
                disabled={encerrando}
                className="rounded-xl bg-sakura-purple px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
              >
                {encerrando ? "Encerrando..." : "Encerrar OS"}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <BotaoVoltar onClick={onCancelar} />
          <h2 className="text-lg font-semibold text-sakura-purple-dark">Nova ordem de serviço</h2>
        </div>
      )}

      {erro && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{erro}</p>
      )}

      {rascunho && (
        <div className="flex items-center justify-between gap-3 rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-800">
          <span>Encontramos um rascunho não salvo desta ordem de serviço. Restaurar?</span>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={descartarRascunho}
              className="rounded-lg px-3 py-1 text-xs font-medium text-amber-800 hover:bg-amber-100"
            >
              Descartar
            </button>
            <button
              type="button"
              onClick={restaurarRascunho}
              className="rounded-lg bg-amber-600 px-3 py-1 text-xs font-medium text-white hover:opacity-90"
            >
              Restaurar
            </button>
          </div>
        </div>
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
        <div className="space-y-6">
          <DetalhesFields
            register={register}
            watch={watch}
            setValue={setValue}
            errors={errors}
            clientes={clientes}
            funcionarios={funcionarios}
          />

          <ItensFields
            control={control}
            register={register}
            watch={watch}
            setValue={setValue}
            itensExistentes={itensExistentes}
            ehEdicao={!!ordemExistente}
            podeAdicionarItem={ordemExistente?.status !== "faturada"}
            pecas={pecas}
            servicos={servicos}
            funcionarios={funcionarios}
          />
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
            disabled={isSubmitting}
            className="rounded-xl bg-sakura-purple px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting
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
