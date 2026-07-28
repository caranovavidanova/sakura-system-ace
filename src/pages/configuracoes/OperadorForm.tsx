import { useState } from "react";
import { mensagemDeErro } from "@/lib/errors";
import { MODULOS } from "@/types/operador";
import type { ModuloChave, NovoOperador, Operador } from "@/types/operador";

interface OperadorFormProps {
  operadorExistente?: Operador;
  onSalvar: (operador: NovoOperador, senha: string) => Promise<void>;
  onCancelar: () => void;
}

export function OperadorForm({
  operadorExistente,
  onSalvar,
  onCancelar,
}: OperadorFormProps) {
  const editando = Boolean(operadorExistente);

  const [usuario, setUsuario] = useState(operadorExistente?.usuario ?? "");
  const [nome, setNome] = useState(operadorExistente?.nome ?? "");
  const [senha, setSenha] = useState("");
  const [admin, setAdmin] = useState(operadorExistente?.admin ?? false);
  const [permissoes, setPermissoes] = useState<ModuloChave[]>(
    operadorExistente?.permissoes ?? [],
  );
  const [ativo, setAtivo] = useState(operadorExistente?.ativo ?? true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  function alternarPermissao(modulo: ModuloChave) {
    setPermissoes((atual) =>
      atual.includes(modulo)
        ? atual.filter((m) => m !== modulo)
        : [...atual, modulo],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setSalvando(true);
    try {
      await onSalvar(
        { usuario: usuario.trim().toLowerCase(), nome, admin, permissoes, ativo },
        senha,
      );
    } catch (err) {
      console.error("Erro ao salvar operador:", err);
      setErro(mensagemDeErro(err));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-sakura-gray/30 bg-white p-6 shadow-sm"
    >
      {erro && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          {erro}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-sakura-purple-dark/80">
            Usuário {!editando && <span className="text-red-500">*</span>}
          </span>
          <input
            type="text"
            required
            disabled={editando}
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple disabled:bg-sakura-gray/10 disabled:text-sakura-gray"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-sakura-purple-dark/80">
            Nome completo <span className="text-red-500">*</span>
          </span>
          <input
            type="text"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
          />
        </label>

        {!editando && (
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-sakura-purple-dark/80">
              Senha <span className="text-red-500">*</span>
            </span>
            <input
              type="password"
              required
              minLength={6}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
            />
          </label>
        )}

        {editando && (
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={ativo}
              onChange={(e) => setAtivo(e.target.checked)}
              className="h-4 w-4 rounded border-sakura-gray/40 text-sakura-purple focus:ring-sakura-purple"
            />
            <span className="text-sakura-purple-dark/80">
              Operador ativo (desmarque para bloquear o login)
            </span>
          </label>
        )}
      </div>

      <section>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={admin}
            onChange={(e) => setAdmin(e.target.checked)}
            className="h-4 w-4 rounded border-sakura-gray/40 text-sakura-purple focus:ring-sakura-purple"
          />
          <span className="font-medium text-sakura-purple-dark">
            Administrador (acesso total, inclusive Configurações)
          </span>
        </label>

        {!admin && (
          <div className="mt-4">
            <h3 className="mb-3 text-sm font-semibold text-sakura-purple-dark">
              Módulos liberados
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {MODULOS.map((modulo) => (
                <label key={modulo.chave} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={permissoes.includes(modulo.chave)}
                    onChange={() => alternarPermissao(modulo.chave)}
                    className="h-4 w-4 rounded border-sakura-gray/40 text-sakura-purple focus:ring-sakura-purple"
                  />
                  <span className="text-sakura-purple-dark/80">{modulo.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </section>

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
          {salvando ? "Salvando..." : "Salvar operador"}
        </button>
      </div>
    </form>
  );
}
