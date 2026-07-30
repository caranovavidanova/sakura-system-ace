import { useState } from "react";
import { BotaoVoltar } from "@/components/BotaoVoltar";
import { mensagemDeErro } from "@/lib/errors";
import type { CategoriaServico } from "@/types/categoriaServico";
import type { NovoServico, Servico } from "@/types/servico";

interface ServicoFormProps {
  categorias: CategoriaServico[];
  servicoExistente?: Servico;
  onSalvar: (servico: NovoServico) => Promise<void>;
  onSalvarEdicao?: (id: string, servico: NovoServico) => Promise<void>;
  onCancelar: () => void;
}

const servicoVazio: NovoServico = {
  codigo_interno: "",
  descricao: "",
  preco_padrao: null,
  custo: null,
  categoria_id: null,
  ativo: true,
};

export function ServicoForm({
  categorias,
  servicoExistente,
  onSalvar,
  onSalvarEdicao,
  onCancelar,
}: ServicoFormProps) {
  const [servico, setServico] = useState<NovoServico>(
    servicoExistente
      ? {
          codigo_interno: servicoExistente.codigo_interno,
          descricao: servicoExistente.descricao,
          preco_padrao: servicoExistente.preco_padrao,
          custo: servicoExistente.custo,
          categoria_id: servicoExistente.categoria_id,
          ativo: servicoExistente.ativo,
        }
      : servicoVazio,
  );
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setSalvando(true);
    try {
      if (servicoExistente && onSalvarEdicao) {
        await onSalvarEdicao(servicoExistente.id, servico);
      } else {
        await onSalvar(servico);
      }
    } catch (err) {
      console.error("Erro ao salvar serviço:", err);
      setErro(mensagemDeErro(err));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 sakura-card p-6 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <BotaoVoltar onClick={onCancelar} />
        <h2 className="text-lg font-semibold text-sakura-purple-dark">
          {servicoExistente ? "Editar serviço" : "Novo serviço"}
        </h2>
      </div>

      {erro && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          {erro}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <label className="col-span-2 flex flex-col gap-1 text-sm">
          <span className="text-sakura-purple-dark/80">
            Descrição <span className="text-red-500">*</span>
          </span>
          <input
            type="text"
            required
            value={servico.descricao}
            onChange={(e) => setServico({ ...servico, descricao: e.target.value })}
            className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-sakura-purple-dark/80">Código (opcional)</span>
          <input
            type="text"
            value={servico.codigo_interno ?? ""}
            onChange={(e) => setServico({ ...servico, codigo_interno: e.target.value })}
            className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-sakura-purple-dark/80">Preço padrão</span>
          <input
            type="number"
            step="0.01"
            min="0"
            value={servico.preco_padrao ?? ""}
            onChange={(e) =>
              setServico({
                ...servico,
                preco_padrao: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-sakura-purple-dark/80">Custo (ex: mão de obra)</span>
          <input
            type="number"
            step="0.01"
            min="0"
            value={servico.custo ?? ""}
            onChange={(e) =>
              setServico({
                ...servico,
                custo: e.target.value === "" ? null : Number(e.target.value),
              })
            }
            className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-sakura-purple-dark/80">Categoria</span>
          <select
            value={servico.categoria_id ?? ""}
            onChange={(e) =>
              setServico({ ...servico, categoria_id: e.target.value || null })
            }
            className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
          >
            <option value="">Sem categoria</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </select>
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
          {salvando ? "Salvando..." : servicoExistente ? "Salvar alterações" : "Salvar serviço"}
        </button>
      </div>
    </form>
  );
}
