import { useState } from "react";
import { BotaoVoltar } from "@/components/BotaoVoltar";
import { mensagemDeErro } from "@/lib/errors";
import type { Fornecedor, NovoFornecedor } from "@/types/fornecedor";

interface FornecedorFormProps {
  fornecedorExistente?: Fornecedor;
  onSalvar: (fornecedor: NovoFornecedor) => Promise<void>;
  onSalvarEdicao?: (id: string, fornecedor: NovoFornecedor) => Promise<void>;
  onCancelar: () => void;
}

const fornecedorVazio: NovoFornecedor = {
  nome: "",
  cnpj: "",
  telefone: "",
  email: "",
  ativo: true,
};

export function FornecedorForm({
  fornecedorExistente,
  onSalvar,
  onSalvarEdicao,
  onCancelar,
}: FornecedorFormProps) {
  const [fornecedor, setFornecedor] = useState<NovoFornecedor>(
    fornecedorExistente
      ? {
          nome: fornecedorExistente.nome,
          cnpj: fornecedorExistente.cnpj,
          telefone: fornecedorExistente.telefone,
          email: fornecedorExistente.email,
          ativo: fornecedorExistente.ativo,
        }
      : fornecedorVazio,
  );
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setSalvando(true);
    try {
      if (fornecedorExistente && onSalvarEdicao) {
        await onSalvarEdicao(fornecedorExistente.id, fornecedor);
      } else {
        await onSalvar(fornecedor);
      }
    } catch (err) {
      console.error("Erro ao salvar fornecedor:", err);
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
          {fornecedorExistente ? "Editar fornecedor" : "Novo fornecedor"}
        </h2>
      </div>

      {erro && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{erro}</p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <label className="col-span-2 flex flex-col gap-1 text-sm">
          <span className="text-sakura-purple-dark/80">
            Nome / Razão social <span className="text-red-500">*</span>
          </span>
          <input
            type="text"
            required
            value={fornecedor.nome}
            onChange={(e) => setFornecedor({ ...fornecedor, nome: e.target.value })}
            className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-sakura-purple-dark/80">CNPJ</span>
          <input
            type="text"
            value={fornecedor.cnpj ?? ""}
            onChange={(e) => setFornecedor({ ...fornecedor, cnpj: e.target.value })}
            className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-sakura-purple-dark/80">Telefone</span>
          <input
            type="text"
            value={fornecedor.telefone ?? ""}
            onChange={(e) => setFornecedor({ ...fornecedor, telefone: e.target.value })}
            className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-sakura-purple-dark/80">E-mail</span>
          <input
            type="email"
            value={fornecedor.email ?? ""}
            onChange={(e) => setFornecedor({ ...fornecedor, email: e.target.value })}
            className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
          />
        </label>
      </div>

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
          {salvando ? "Salvando..." : fornecedorExistente ? "Salvar alterações" : "Salvar fornecedor"}
        </button>
      </div>
    </form>
  );
}
