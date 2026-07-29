import { useEffect, useMemo, useState } from "react";
import { buscarTextoGarantia } from "@/lib/configuracoes";
import { mensagemDeErro } from "@/lib/errors";
import { montarTextoGarantia } from "@/lib/garantiaTexto";
import type { OrdemServico } from "@/types/os";
import { totalOrdem } from "@/types/os";

interface FechamentoTabProps {
  ordem: OrdemServico;
}

function formatarData(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function emitirPlaceholderFiscal(tipo: "NFe" | "NFS-e") {
  alert(
    `Emissão de ${tipo} ainda não está disponível — falta escolher o provedor fiscal ` +
      "(Focus NFe, eNotas, PlugNotas ou similar) e, no caso da NFS-e, confirmar o " +
      "município da loja. Assim que essa decisão for tomada, este botão passa a emitir de verdade.",
  );
}

export function FechamentoTab({ ordem }: FechamentoTabProps) {
  const itens = ordem.itens ?? [];
  const [templateGarantia, setTemplateGarantia] = useState("");

  useEffect(() => {
    async function carregar() {
      try {
        setTemplateGarantia(await buscarTextoGarantia());
      } catch (err) {
        console.error("Erro ao carregar texto de garantia:", err);
      }
    }
    carregar();
  }, []);

  const textoGarantia = useMemo(
    () => (templateGarantia ? montarTextoGarantia(templateGarantia, ordem) : ""),
    [templateGarantia, ordem],
  );

  function handleImprimirGarantia() {
    if (!textoGarantia) {
      alert(
        "Configure o texto de garantia em Configurações antes de imprimir " +
          "(seção \"Texto de garantia\").",
      );
      return;
    }
    window.print();
  }

  function handleBaixarGarantia() {
    if (!textoGarantia) {
      alert(
        "Configure o texto de garantia em Configurações antes de baixar " +
          "(seção \"Texto de garantia\").",
      );
      return;
    }
    try {
      const blob = new Blob([textoGarantia], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `garantia-OS-${ordem.id.slice(0, 8)}.txt`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erro ao baixar garantia:", err);
      alert(mensagemDeErro(err));
    }
  }

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-2 gap-4 sakura-card p-4 text-sm">
        <div>
          <p className="text-sakura-purple-dark/80">Cliente</p>
          <p className="font-medium text-sakura-purple-dark">{ordem.cliente?.nome ?? "—"}</p>
        </div>
        <div>
          <p className="text-sakura-purple-dark/80">Veículo</p>
          <p className="font-medium text-sakura-purple-dark">{ordem.veiculo?.placa ?? "—"}</p>
        </div>
        <div>
          <p className="text-sakura-purple-dark/80">Aberta em</p>
          <p className="font-medium text-sakura-purple-dark">
            {formatarData(ordem.data_abertura)}
          </p>
        </div>
        <div>
          <p className="text-sakura-purple-dark/80">Fechada em</p>
          <p className="font-medium text-sakura-purple-dark">
            {formatarData(ordem.data_fechamento)}
          </p>
        </div>
      </section>

      <section className="sakura-card p-4">
        <h3 className="mb-3 text-sm font-semibold text-sakura-purple-dark">
          Peças e serviços
        </h3>
        <div className="space-y-1.5">
          {itens.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between text-sm text-sakura-purple-dark/80"
            >
              <span>
                {item.tipo === "peca" ? "Peça" : "Serviço"} — {item.descricao} (
                {item.quantidade}x){item.tecnico?.nome ? ` · técnico: ${item.tecnico.nome}` : ""}
              </span>
              <span>
                {(item.quantidade * item.preco_unitario - item.desconto).toLocaleString(
                  "pt-BR",
                  { style: "currency", currency: "BRL" },
                )}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-right text-sm font-semibold text-sakura-purple-dark">
          Total geral: {totalOrdem(itens).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </p>
      </section>

      <section className="space-y-4 sakura-card p-4">
        <div className="space-y-2">
          <p className="text-xs font-medium text-sakura-purple-dark/60">Nota fiscal</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => emitirPlaceholderFiscal("NFe")}
              className="flex-1 rounded-xl border border-sakura-gray/40 px-3 py-2 text-xs font-medium text-sakura-purple-dark/60 hover:bg-sakura-gray/10"
            >
              Emitir NFe
            </button>
            <button
              type="button"
              onClick={() => emitirPlaceholderFiscal("NFS-e")}
              className="flex-1 rounded-xl border border-sakura-gray/40 px-3 py-2 text-xs font-medium text-sakura-purple-dark/60 hover:bg-sakura-gray/10"
            >
              Emitir NFS-e
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-sakura-purple-dark/60">Garantia</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleImprimirGarantia}
              className="flex-1 rounded-xl border border-sakura-gray/40 px-3 py-2 text-xs font-medium text-sakura-purple-dark/60 hover:bg-sakura-gray/10"
            >
              Imprimir garantia
            </button>
            <button
              type="button"
              onClick={handleBaixarGarantia}
              className="flex-1 rounded-xl border border-sakura-gray/40 px-3 py-2 text-xs font-medium text-sakura-purple-dark/60 hover:bg-sakura-gray/10"
            >
              Baixar garantia
            </button>
          </div>
        </div>
      </section>

      <pre className="apenas-impressao">{textoGarantia}</pre>
    </div>
  );
}
