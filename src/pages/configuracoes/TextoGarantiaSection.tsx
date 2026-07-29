import { useState } from "react";
import { mensagemDeErro } from "@/lib/errors";
import { salvarTextoGarantia } from "@/lib/configuracoes";

interface TextoGarantiaSectionProps {
  texto: string;
  onSalvo: () => Promise<void>;
}

export function TextoGarantiaSection({ texto, onSalvo }: TextoGarantiaSectionProps) {
  const [valor, setValor] = useState(texto);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [salvo, setSalvo] = useState(false);

  async function handleSalvar() {
    setErro(null);
    setSalvo(false);
    setSalvando(true);
    try {
      await salvarTextoGarantia(valor);
      await onSalvo();
      setSalvo(true);
    } catch (err) {
      console.error("Erro ao salvar texto de garantia:", err);
      setErro(mensagemDeErro(err));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="sakura-card p-6">
      <h2 className="text-sm font-semibold text-sakura-purple-dark">Texto de garantia</h2>
      <p className="mt-1 text-xs text-sakura-gray">
        Usado pelos botões "Imprimir garantia"/"Baixar garantia" na aba Fechamento de uma Ordem de
        Serviço. Use estes campos que são substituídos automaticamente:{" "}
        <code>{"{cliente}"}</code>, <code>{"{veiculo}"}</code>, <code>{"{itens}"}</code> e{" "}
        <code>{"{data}"}</code> (data de fechamento da OS).
      </p>

      {erro && (
        <p className="mt-3 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{erro}</p>
      )}
      {salvo && (
        <p className="mt-3 rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
          Texto de garantia salvo.
        </p>
      )}

      <textarea
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        rows={8}
        className="mt-4 w-full rounded-lg border border-sakura-gray/40 px-3 py-2 text-sm text-sakura-purple-dark outline-none focus:border-sakura-purple"
      />

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={handleSalvar}
          disabled={salvando}
          className="rounded-xl bg-sakura-purple px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {salvando ? "Salvando..." : "Salvar texto"}
        </button>
      </div>
    </div>
  );
}
