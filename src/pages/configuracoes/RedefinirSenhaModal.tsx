import { useState } from "react";
import { Modal } from "@/components/Modal";
import { mensagemDeErro } from "@/lib/errors";
import { redefinirSenhaOperador } from "@/lib/operadores";
import type { Operador } from "@/types/operador";

interface RedefinirSenhaModalProps {
  operador: Operador;
  onFechar: () => void;
  onRedefinida: () => void;
}

export function RedefinirSenhaModal({
  operador,
  onFechar,
  onRedefinida,
}: RedefinirSenhaModalProps) {
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    if (novaSenha !== confirmacao) {
      setErro("As duas senhas precisam ser iguais.");
      return;
    }
    setSalvando(true);
    try {
      await redefinirSenhaOperador(operador.id, novaSenha);
      alert("Senha redefinida com sucesso.");
      onRedefinida();
    } catch (err) {
      console.error("Erro ao redefinir senha:", err);
      setErro(mensagemDeErro(err));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Modal titulo={`Redefinir senha de ${operador.nome}`} onFechar={onFechar}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-sakura-muted">
          Defina uma senha nova pra <strong>@{operador.usuario}</strong>. Avise a pessoa pra
          trocar de novo depois de entrar, se preferir.
        </p>

        {erro && (
          <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{erro}</p>
        )}

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-sakura-purple-dark/80">
            Nova senha <span className="text-red-500">*</span>
          </span>
          <input
            type="password"
            required
            minLength={6}
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-sakura-purple-dark/80">
            Confirmar nova senha <span className="text-red-500">*</span>
          </span>
          <input
            type="password"
            required
            minLength={6}
            value={confirmacao}
            onChange={(e) => setConfirmacao(e.target.value)}
            className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
          />
        </label>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onFechar}
            className="rounded-xl px-4 py-2 text-sm font-medium text-sakura-purple-dark/90 hover:bg-sakura-gray/10"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={salvando}
            className="rounded-xl bg-sakura-purple px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {salvando ? "Salvando..." : "Redefinir senha"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
