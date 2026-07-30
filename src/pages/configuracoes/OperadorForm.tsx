import { useState } from "react";
import { BotaoVoltar } from "@/components/BotaoVoltar";
import { mensagemDeErro } from "@/lib/errors";
import type { Loja } from "@/types/loja";
import { MODULOS } from "@/types/operador";
import type { ModuloChave, NovoOperador, Operador } from "@/types/operador";

interface OperadorFormProps {
  operadorExistente?: Operador;
  lojasDisponiveis: Loja[];
  lojaIdsExistente?: string[];
  onSalvar: (operador: NovoOperador, senha: string, lojaIds: string[]) => Promise<void>;
  onCancelar: () => void;
}

export function OperadorForm({
  operadorExistente,
  lojasDisponiveis,
  lojaIdsExistente,
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
  const [lojaIds, setLojaIds] = useState<string[]>(lojaIdsExistente ?? []);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  function alternarPermissao(modulo: ModuloChave) {
    setPermissoes((atual) =>
      atual.includes(modulo)
        ? atual.filter((m) => m !== modulo)
        : [...atual, modulo],
    );
  }

  function alternarLoja(lojaId: string) {
    setLojaIds((atual) =>
      atual.includes(lojaId) ? atual.filter((id) => id !== lojaId) : [...atual, lojaId],
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
        lojaIds,
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
      className="space-y-6 sakura-card p-6 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <BotaoVoltar onClick={onCancelar} />
        <h2 className="text-lg font-semibold text-sakura-purple-dark">
          {editando ? "Editar operador" : "Novo operador"}
        </h2>
      </div>

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
            className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple disabled:bg-sakura-gray/10 disabled:text-sakura-muted"
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

      {lojasDisponiveis.length > 1 && (
        <section>
          <h3 className="mb-3 text-sm font-semibold text-sakura-purple-dark">
            Lojas com acesso
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {lojasDisponiveis.map((loja) => (
              <label key={loja.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={lojaIds.includes(loja.id)}
                  onChange={() => alternarLoja(loja.id)}
                  className="h-4 w-4 rounded border-sakura-gray/40 text-sakura-purple focus:ring-sakura-purple"
                />
                <span className="text-sakura-purple-dark/80">{loja.nome}</span>
              </label>
            ))}
          </div>
        </section>
      )}

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
          disabled={salvando}
          className="rounded-xl bg-sakura-purple px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {salvando ? "Salvando..." : "Salvar operador"}
        </button>
      </div>
    </form>
  );
}
