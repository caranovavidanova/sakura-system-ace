import { useEffect, useMemo, useState } from "react";
import { buscarTextoGarantia } from "@/lib/configuracoes";
import { mensagemDeErro } from "@/lib/errors";
import { montarTextoGarantia } from "@/lib/garantiaTexto";
import type { OrdemServico } from "@/types/os";
import { totalOrdem } from "@/types/os";
import { EmitirNotaFiscalModal } from "./EmitirNotaFiscalModal";
import { GarantiaVisualModal } from "./GarantiaVisualModal";

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

function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function FechamentoTab({ ordem }: FechamentoTabProps) {
  const itens = ordem.itens ?? [];
  const [templateGarantia, setTemplateGarantia] = useState("");
  const [notaParaEmitir, setNotaParaEmitir] = useState<"NFC-e" | "NFS-e" | null>(null);
  const [previewGarantiaAberta, setPreviewGarantiaAberta] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregar() {
      try {
        setTemplateGarantia(await buscarTextoGarantia(ordem.loja_id));
      } catch (err) {
        console.error("Erro ao carregar texto de garantia:", err);
        setErro(mensagemDeErro(err));
      }
    }
    carregar();
  }, [ordem.loja_id]);

  const textoGarantia = useMemo(
    () => (templateGarantia ? montarTextoGarantia(templateGarantia, ordem) : ""),
    [templateGarantia, ordem],
  );

  return (
    <div className="space-y-6">
      {erro && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</p>}

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
              <span>{formatarMoeda(item.quantidade * item.preco_unitario - item.desconto)}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-right text-sm font-semibold text-sakura-purple-dark">
          Total geral: {formatarMoeda(totalOrdem(itens))}
        </p>
      </section>

      <section className="space-y-4 sakura-card p-4">
        <div className="space-y-2">
          <p className="text-xs font-medium text-sakura-purple-dark/85">Nota fiscal</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setNotaParaEmitir("NFC-e")}
              className="flex-1 rounded-xl border border-sakura-gray/40 px-3 py-2 text-xs font-medium text-sakura-purple-dark/85 hover:bg-sakura-gray/10"
            >
              Emitir NFC-e
            </button>
            <button
              type="button"
              onClick={() => setNotaParaEmitir("NFS-e")}
              className="flex-1 rounded-xl border border-sakura-gray/40 px-3 py-2 text-xs font-medium text-sakura-purple-dark/85 hover:bg-sakura-gray/10"
            >
              Emitir NFS-e
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-sakura-purple-dark/85">Garantia</p>
          <button
            type="button"
            onClick={() => setPreviewGarantiaAberta(true)}
            className="w-full rounded-xl border border-sakura-gray/40 px-3 py-2 text-xs font-medium text-sakura-purple-dark/85 hover:bg-sakura-gray/10"
          >
            Ver garantia
          </button>
        </div>
      </section>

      {notaParaEmitir && (
        <EmitirNotaFiscalModal
          ordem={ordem}
          tipoNota={notaParaEmitir}
          onFechar={() => setNotaParaEmitir(null)}
          onEmitido={() => {}}
        />
      )}

      {previewGarantiaAberta && (
        <GarantiaVisualModal
          ordem={ordem}
          textoGarantia={textoGarantia}
          onFechar={() => setPreviewGarantiaAberta(false)}
        />
      )}
    </div>
  );
}
