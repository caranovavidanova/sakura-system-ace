import { useState } from "react";
import { mensagemDeErro } from "@/lib/errors";
import type { NovaPeca } from "@/types/peca";

interface PecaFormProps {
  onSalvar: (peca: NovaPeca) => Promise<void>;
  onCancelar: () => void;
}

const pecaVazia: NovaPeca = {
  codigo_interno: "",
  descricao: "",
  unidade: "UN",
  preco_custo: null,
  preco_venda: null,
  ncm: "",
  cfop_padrao: "",
  cst_ou_csosn: "",
  aliquota_icms: null,
  ativo: true,
};

export function PecaForm({ onSalvar, onCancelar }: PecaFormProps) {
  const [peca, setPeca] = useState<NovaPeca>(pecaVazia);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setSalvando(true);
    try {
      await onSalvar(peca);
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
      className="space-y-6 rounded-2xl border border-sakura-gray/30 bg-white p-6 shadow-sm"
    >
      {erro && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
          {erro}
        </p>
      )}

      <section>
        <h3 className="mb-3 text-sm font-semibold text-sakura-purple-dark">
          Dados do produto
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <Campo
            label="Descrição"
            required
            value={peca.descricao}
            onChange={(v) => setPeca({ ...peca, descricao: v })}
          />
          <Campo
            label="Código interno"
            value={peca.codigo_interno ?? ""}
            onChange={(v) => setPeca({ ...peca, codigo_interno: v })}
          />
          <Campo
            label="Unidade (UN, PC, KG...)"
            value={peca.unidade ?? ""}
            onChange={(v) => setPeca({ ...peca, unidade: v.toUpperCase() })}
          />
          <CampoNumero
            label="Preço de custo"
            value={peca.preco_custo}
            onChange={(v) => setPeca({ ...peca, preco_custo: v })}
          />
          <CampoNumero
            label="Preço de venda"
            value={peca.preco_venda}
            onChange={(v) => setPeca({ ...peca, preco_venda: v })}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold text-sakura-purple-dark">
          Dados fiscais
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <Campo
            label="NCM"
            value={peca.ncm ?? ""}
            onChange={(v) => setPeca({ ...peca, ncm: v })}
          />
          <Campo
            label="CFOP padrão"
            value={peca.cfop_padrao ?? ""}
            onChange={(v) => setPeca({ ...peca, cfop_padrao: v })}
          />
          <Campo
            label="CST / CSOSN"
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
