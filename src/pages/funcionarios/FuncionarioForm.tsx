import { useState } from "react";
import { BotaoVoltar } from "@/components/BotaoVoltar";
import { mensagemDeErro } from "@/lib/errors";
import type { Funcionario, NovoFuncionario } from "@/types/funcionario";

interface FuncionarioFormProps {
  funcionarioExistente?: Funcionario;
  onSalvar: (funcionario: NovoFuncionario) => Promise<void>;
  onCancelar: () => void;
}

export function FuncionarioForm({
  funcionarioExistente,
  onSalvar,
  onCancelar,
}: FuncionarioFormProps) {
  const editando = Boolean(funcionarioExistente);
  const [nome, setNome] = useState(funcionarioExistente?.nome ?? "");
  const [cargo, setCargo] = useState(funcionarioExistente?.cargo ?? "");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setSalvando(true);
    try {
      await onSalvar({ nome: nome.trim(), cargo: cargo.trim() || null });
    } catch (err) {
      console.error("Erro ao salvar funcionário:", err);
      setErro(mensagemDeErro(err));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sakura-card p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <BotaoVoltar onClick={onCancelar} />
        <h2 className="text-lg font-semibold text-sakura-purple-dark">
          {editando ? "Editar funcionário" : "Novo funcionário"}
        </h2>
      </div>

      {erro && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{erro}</p>
      )}

      {funcionarioExistente?.operador_id && (
        <p className="rounded-lg bg-sakura-pink-soft/60 px-4 py-2 text-xs text-sakura-purple-dark/80">
          Também é operador do sistema (login @{funcionarioExistente.operador?.usuario}) — nome e
          status ativo/inativo desse cadastro seguem o que estiver em Configurações →
          Operadores.
        </p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-sakura-purple-dark/80">
            Nome <span className="text-red-500">*</span>
          </span>
          <input
            type="text"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-sakura-purple-dark/80">Cargo (opcional)</span>
          <input
            type="text"
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
            placeholder="Ex: Mecânico, Vendedor, Faxineira"
            className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
          />
        </label>
      </div>

      <div className="flex justify-end gap-3">
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
          {salvando ? "Salvando..." : "Salvar funcionário"}
        </button>
      </div>
    </form>
  );
}
