import { useEffect, useMemo, useState } from "react";
import { Modal } from "@/components/Modal";
import { buscarConfiguracaoFiscal, buscarTextoGarantia } from "@/lib/configuracoes";
import { montarTextoGarantia } from "@/lib/garantiaTexto";
import type { ConfiguracaoFiscalLoja } from "@/types/configuracao";
import type { OrdemServico } from "@/types/os";
import { totalOrdem } from "@/types/os";
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
  const [configuracaoFiscal, setConfiguracaoFiscal] = useState<ConfiguracaoFiscalLoja | null>(
    null,
  );
  const [previewNF, setPreviewNF] = useState<"NFC-e" | "NFS-e" | null>(null);
  const [previewGarantiaAberta, setPreviewGarantiaAberta] = useState(false);

  useEffect(() => {
    async function carregar() {
      try {
        setTemplateGarantia(await buscarTextoGarantia());
      } catch (err) {
        console.error("Erro ao carregar texto de garantia:", err);
      }
      try {
        setConfiguracaoFiscal(await buscarConfiguracaoFiscal());
      } catch (err) {
        console.error("Erro ao carregar dados fiscais da loja:", err);
      }
    }
    carregar();
  }, []);

  const focusNfeConfigurado = Boolean(configuracaoFiscal?.focus_nfe_token);

  const textoGarantia = useMemo(
    () => (templateGarantia ? montarTextoGarantia(templateGarantia, ordem) : ""),
    [templateGarantia, ordem],
  );

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
          <p className="text-xs font-medium text-sakura-purple-dark/60">Nota fiscal</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPreviewNF("NFC-e")}
              className="flex-1 rounded-xl border border-sakura-gray/40 px-3 py-2 text-xs font-medium text-sakura-purple-dark/60 hover:bg-sakura-gray/10"
            >
              Emitir NFC-e
            </button>
            <button
              type="button"
              onClick={() => setPreviewNF("NFS-e")}
              className="flex-1 rounded-xl border border-sakura-gray/40 px-3 py-2 text-xs font-medium text-sakura-purple-dark/60 hover:bg-sakura-gray/10"
            >
              Emitir NFS-e
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium text-sakura-purple-dark/60">Garantia</p>
          <button
            type="button"
            onClick={() => setPreviewGarantiaAberta(true)}
            className="w-full rounded-xl border border-sakura-gray/40 px-3 py-2 text-xs font-medium text-sakura-purple-dark/60 hover:bg-sakura-gray/10"
          >
            Ver garantia
          </button>
        </div>
      </section>

      {previewNF && (
        <Modal titulo={`Pré-visualização — ${previewNF}`} onFechar={() => setPreviewNF(null)}>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3 rounded-lg bg-sakura-pink-soft/60 p-3">
              <div>
                <p className="text-xs text-sakura-purple-dark/60">Cliente</p>
                <p className="font-medium text-sakura-purple-dark">
                  {ordem.cliente?.nome ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-sakura-purple-dark/60">Veículo</p>
                <p className="font-medium text-sakura-purple-dark">
                  {ordem.veiculo?.placa ?? "—"}
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              {itens.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-sakura-purple-dark/80"
                >
                  <span>
                    {item.descricao} ({item.quantidade}x)
                  </span>
                  <span>{formatarMoeda(item.quantidade * item.preco_unitario - item.desconto)}</span>
                </div>
              ))}
            </div>
            <p className="text-right font-semibold text-sakura-purple-dark">
              Total: {formatarMoeda(totalOrdem(itens))}
            </p>

            <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
              {focusNfeConfigurado ? (
                <>
                  Isto é só uma pré-visualização com os dados da OS — a emissão de {previewNF}{" "}
                  via Focus NFe ainda não está disponível de verdade. Os dados fiscais da loja já
                  estão cadastrados, mas a integração ainda precisa ser testada e concluída antes
                  de emitir de verdade.
                </>
              ) : (
                <>
                  Isto é só uma pré-visualização com os dados da OS — a emissão de {previewNF}{" "}
                  ainda não está disponível de verdade. Falta cadastrar o token do Focus NFe (e os
                  dados fiscais da loja) em Configurações → "Dados fiscais da loja".
                </>
              )}
            </p>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setPreviewNF(null)}
              className="rounded-xl bg-sakura-purple px-5 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Entendi
            </button>
          </div>
        </Modal>
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
