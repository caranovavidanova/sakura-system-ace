import { useState } from "react";
import { BotaoVoltar } from "@/components/BotaoVoltar";
import { mensagemDeErro } from "@/lib/errors";
import { OPCOES_ORIGEM } from "@/lib/origemMercadoria";
import type { Categoria } from "@/types/categoria";
import type { NovaPeca } from "@/types/peca";

interface PecaFormProps {
  categorias: Categoria[];
  onSalvar: (peca: NovaPeca, quantidadeInicial: number | null) => Promise<void>;
  onCancelar: () => void;
}

const pecaVazia: NovaPeca = {
  codigo_interno: "",
  codigo_barras: "",
  descricao: "",
  marca: "",
  modelo: "",
  aplicacao: "",
  unidade: "UN",
  preco_custo: null,
  preco_venda: null,
  ncm: "",
  cest: "",
  cfop_padrao: "",
  origem: "",
  cst_ou_csosn: "",
  aliquota_icms: null,
  categoria_id: null,
  prazo_garantia_dias: null,
  ativo: true,
};

function arredondar(valor: number): number {
  return Math.round(valor * 100) / 100;
}

export function PecaForm({ categorias, onSalvar, onCancelar }: PecaFormProps) {
  const [peca, setPeca] = useState<NovaPeca>(pecaVazia);
  const [margemTexto, setMargemTexto] = useState("");
  const [quantidadeInicial, setQuantidadeInicial] = useState<number | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  function aoMudarCusto(novoCusto: number | null) {
    const margem = parseFloat(margemTexto);
    const novoPeca = { ...peca, preco_custo: novoCusto };
    if (novoCusto !== null && !isNaN(margem)) {
      novoPeca.preco_venda = arredondar(novoCusto * (1 + margem / 100));
    }
    setPeca(novoPeca);
  }

  function aoMudarMargem(texto: string) {
    setMargemTexto(texto);
    const margem = parseFloat(texto);
    if (peca.preco_custo !== null && !isNaN(margem)) {
      setPeca({ ...peca, preco_venda: arredondar(peca.preco_custo * (1 + margem / 100)) });
    }
  }

  function aoMudarPrecoVenda(novoPreco: number | null) {
    setPeca({ ...peca, preco_venda: novoPreco });
    if (peca.preco_custo !== null && peca.preco_custo > 0 && novoPreco !== null) {
      const margem = ((novoPreco - peca.preco_custo) / peca.preco_custo) * 100;
      setMargemTexto((Math.round(margem * 10) / 10).toString());
    } else {
      setMargemTexto("");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setSalvando(true);
    try {
      await onSalvar(peca, quantidadeInicial);
    } catch (err) {
      console.error("Erro ao salvar peça:", err);
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
          Novo produto
        </h2>
      </div>

      {erro && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          {erro}
        </p>
      )}

      <section>
        <h3 className="mb-3 text-sm font-semibold text-sakura-purple-dark">
          Dados cadastrais
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <Campo
            label="Descrição"
            required
            value={peca.descricao}
            onChange={(v) => setPeca({ ...peca, descricao: v })}
          />
          <Campo
            label="Código de barras"
            value={peca.codigo_barras ?? ""}
            onChange={(v) => setPeca({ ...peca, codigo_barras: v })}
          />
          <Campo
            label="Referência"
            value={peca.codigo_interno ?? ""}
            onChange={(v) => setPeca({ ...peca, codigo_interno: v })}
          />
          <Campo
            label="Marca"
            value={peca.marca ?? ""}
            onChange={(v) => setPeca({ ...peca, marca: v })}
          />
          <Campo
            label="Modelo"
            value={peca.modelo ?? ""}
            onChange={(v) => setPeca({ ...peca, modelo: v })}
          />
          <Campo
            label="Unidade (UN, PC, KG...)"
            required
            value={peca.unidade ?? ""}
            onChange={(v) => setPeca({ ...peca, unidade: v.toUpperCase() })}
          />
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-sakura-purple-dark/80">Categoria</span>
            <select
              value={peca.categoria_id ?? ""}
              onChange={(e) =>
                setPeca({ ...peca, categoria_id: e.target.value || null })
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
          <CampoNumero
            label="Garantia (dias, opcional)"
            value={peca.prazo_garantia_dias}
            onChange={(v) =>
              setPeca({ ...peca, prazo_garantia_dias: v === null ? null : Math.round(v) })
            }
          />
        </div>
        <label className="mt-4 flex flex-col gap-1 text-sm">
          <span className="text-sakura-purple-dark/80">Aplicação</span>
          <textarea
            value={peca.aplicacao ?? ""}
            onChange={(e) => setPeca({ ...peca, aplicacao: e.target.value })}
            rows={2}
            className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
          />
        </label>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold text-sakura-purple-dark">
          Tributos
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <Campo
            label="NCM"
            required
            value={peca.ncm ?? ""}
            onChange={(v) => setPeca({ ...peca, ncm: v })}
          />
          <Campo
            label="C.E.S.T"
            required
            value={peca.cest ?? ""}
            onChange={(v) => setPeca({ ...peca, cest: v })}
          />
          <Campo
            label="CFOP padrão"
            required
            value={peca.cfop_padrao ?? ""}
            onChange={(v) => setPeca({ ...peca, cfop_padrao: v })}
          />
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-sakura-purple-dark/80">
              Origem
              <span className="text-red-500"> *</span>
            </span>
            <select
              required
              value={peca.origem ?? ""}
              onChange={(e) => setPeca({ ...peca, origem: e.target.value })}
              className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
            >
              <option value="" disabled>
                Selecione
              </option>
              {OPCOES_ORIGEM.map((opcao) => (
                <option key={opcao.valor} value={opcao.valor}>
                  {opcao.label}
                </option>
              ))}
            </select>
          </label>
          <Campo
            label="CST / CSOSN"
            required
            value={peca.cst_ou_csosn ?? ""}
            onChange={(v) => setPeca({ ...peca, cst_ou_csosn: v })}
          />
          <CampoNumero
            label="Alíquota ICMS (%)"
            value={peca.aliquota_icms}
            onChange={(v) => setPeca({ ...peca, aliquota_icms: v })}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold text-sakura-purple-dark">
          Preços
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <CampoNumero
            label="Aquisição (custo)"
            value={peca.preco_custo}
            onChange={aoMudarCusto}
          />
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-sakura-purple-dark/80">Margem %</span>
            <input
              type="number"
              step="0.1"
              value={margemTexto}
              onChange={(e) => aoMudarMargem(e.target.value)}
              className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
            />
          </label>
          <CampoNumero
            label="Preço final"
            value={peca.preco_venda}
            onChange={aoMudarPrecoVenda}
          />
          <CampoNumero
            label="Qtde. estoque inicial"
            value={quantidadeInicial}
            onChange={setQuantidadeInicial}
          />
        </div>
      </section>

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
          {salvando ? "Salvando..." : "Salvar peça"}
        </button>
      </div>
    </form>
  );
}

function Campo({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-sakura-purple-dark/80">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      <input
        type="text"
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
      />
    </label>
  );
}

function CampoNumero({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-sakura-purple-dark/80">{label}</span>
      <input
        type="number"
        step="0.01"
        value={value ?? ""}
        onChange={(e) =>
          onChange(e.target.value === "" ? null : Number(e.target.value))
        }
        className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
      />
    </label>
  );
}
