import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { atualizarDeposito, atualizarStatusDeposito, criarDeposito } from "@/lib/depositos";
import { mensagemDeErro } from "@/lib/errors";
import {
  depositoFormSchema,
  depositoFormVazio,
  paraNovoDeposito,
  paraPatchDeposito,
  paraValoresFormulario,
  type DepositoFormValues,
} from "@/schemas/deposito";
import type { Deposito } from "@/types/deposito";

interface DepositosSectionProps {
  depositos: Deposito[];
  lojaId: string;
  onSalvo: () => Promise<void>;
}

export function DepositosSection({ depositos, lojaId, onSalvo }: DepositosSectionProps) {
  const [erro, setErro] = useState<string | null>(null);
  const [editandoId, setEditandoId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<DepositoFormValues>({
    resolver: zodResolver(depositoFormSchema),
    defaultValues: depositoFormVazio,
  });

  async function aoAdicionar(valores: DepositoFormValues) {
    setErro(null);
    try {
      await criarDeposito(paraNovoDeposito(valores, lojaId));
      reset(depositoFormVazio);
      await onSalvo();
    } catch (err) {
      console.error("Erro ao criar depósito:", err);
      setErro(mensagemDeErro(err));
    }
  }

  async function handleAlternarStatus(deposito: Deposito) {
    try {
      await atualizarStatusDeposito(deposito.id, !deposito.ativo);
      await onSalvo();
    } catch (err) {
      console.error("Erro ao atualizar status do depósito:", err);
      setErro(mensagemDeErro(err));
    }
  }

  return (
    <>
      {erro && <p className="mt-3 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{erro}</p>}

      <form onSubmit={handleSubmit(aoAdicionar)} className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="Nome do depósito (ex: Depósito Principal, Fundos)"
          {...register("nome")}
          className="flex-1 rounded-lg border border-sakura-gray/40 px-3 py-2 text-sm outline-none focus:border-sakura-purple"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-sakura-purple px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? "Salvando..." : "+ Novo depósito"}
        </button>
      </form>

      {depositos.length === 0 ? (
        <p className="mt-4 text-sm text-sakura-muted">Nenhum depósito cadastrado ainda.</p>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          {depositos.map((deposito) =>
            editandoId === deposito.id ? (
              <LinhaEdicaoDeposito
                key={deposito.id}
                deposito={deposito}
                onSalvo={async () => {
                  setEditandoId(null);
                  await onSalvo();
                }}
                onErro={setErro}
                onCancelar={() => setEditandoId(null)}
              />
            ) : (
              <span
                key={deposito.id}
                className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
                  deposito.ativo
                    ? "bg-sakura-pink-soft text-sakura-purple-dark"
                    : "bg-sakura-gray/20 text-sakura-muted"
                }`}
              >
                {deposito.nome}
                <button
                  onClick={() => {
                    setErro(null);
                    setEditandoId(deposito.id);
                  }}
                  title="Editar depósito"
                  className="text-sakura-purple-dark/75 hover:text-sakura-purple-dark"
                >
                  ✎
                </button>
                <button
                  onClick={() => handleAlternarStatus(deposito)}
                  title={deposito.ativo ? "Inativar depósito" : "Reativar depósito"}
                  className="text-sakura-purple-dark/75 hover:text-sakura-purple-dark"
                >
                  {deposito.ativo ? "×" : "↺"}
                </button>
              </span>
            ),
          )}
        </div>
      )}
    </>
  );
}

// Mesmo padrão de LinhaEdicaoLoja em LojasSection.tsx: componente à parte
// pra cada linha em edição nascer com o `useForm` já preenchido pelo
// depósito clicado, sem precisar de `reset()` manual.
function LinhaEdicaoDeposito({
  deposito,
  onSalvo,
  onErro,
  onCancelar,
}: {
  deposito: Deposito;
  onSalvo: () => Promise<void>;
  onErro: (mensagem: string) => void;
  onCancelar: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<DepositoFormValues>({
    resolver: zodResolver(depositoFormSchema),
    defaultValues: paraValoresFormulario(deposito),
  });

  async function aoSalvar(valores: DepositoFormValues) {
    try {
      await atualizarDeposito(deposito.id, paraPatchDeposito(valores));
      await onSalvo();
    } catch (err) {
      console.error("Erro ao editar depósito:", err);
      onErro(mensagemDeErro(err));
    }
  }

  return (
    <form
      onSubmit={handleSubmit(aoSalvar)}
      className="flex flex-wrap items-center gap-1.5 rounded-2xl bg-white/10 px-3 py-1.5"
    >
      <input
        type="text"
        autoFocus
        {...register("nome")}
        className="w-40 rounded-lg border border-sakura-gray/40 px-2 py-1 text-xs outline-none focus:border-sakura-purple"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="text-xs font-medium text-sakura-purple hover:underline disabled:opacity-50"
      >
        Salvar
      </button>
      <button
        type="button"
        onClick={onCancelar}
        className="text-xs font-medium text-sakura-muted hover:underline"
      >
        Cancelar
      </button>
    </form>
  );
}
