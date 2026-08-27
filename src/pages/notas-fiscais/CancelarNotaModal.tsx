import { useState } from "react";
import { Modal } from "@/components/Modal";
import { useAuth } from "@/contexts/AuthContext";
import { buscarConfiguracaoFiscal } from "@/lib/configuracoes";
import { mensagemDeErro } from "@/lib/errors";
import { cancelarArquivoEmitido } from "@/lib/notasFiscais";
import type { NotaFiscalArquivo } from "@/types/notaFiscal";

interface CancelarNotaModalProps {
  arquivo: NotaFiscalArquivo;
  onFechar: () => void;
  onCancelado: () => void;
}

// A Focus NFe exige uma justificativa com pelo menos 15 caracteres pra
// cancelar uma nota — validar aqui evita mandar a chamada só pra ela voltar
// com um erro de validação sobre o tamanho do texto.
const TAMANHO_MINIMO_JUSTIFICATIVA = 15;

export function CancelarNotaModal({ arquivo, onFechar, onCancelado }: CancelarNotaModalProps) {
  const { lojaAtual } = useAuth();
  const [justificativa, setJustificativa] = useState("");
  const [cancelando, setCancelando] = useState(false);
  const [erro, setErro] = useState("");

  async function handleConfirmar() {
    if (!lojaAtual) return;
    setErro("");
    setCancelando(true);
    try {
      const configuracaoFiscal = await buscarConfiguracaoFiscal(lojaAtual.id);
      if (!configuracaoFiscal?.focus_nfe_token) {
        throw new Error(
          "Token do Focus NFe não configurado — cadastre em Configurações → Dados fiscais da loja.",
        );
      }
      await cancelarArquivoEmitido(
        arquivo,
        justificativa.trim(),
        configuracaoFiscal.focus_nfe_token,
        configuracaoFiscal.focus_nfe_ambiente,
      );
      onCancelado();
      onFechar();
    } catch (err) {
      setErro(mensagemDeErro(err));
    } finally {
      setCancelando(false);
    }
  }

  const justificativaValida = justificativa.trim().length >= TAMANHO_MINIMO_JUSTIFICATIVA;

  return (
    <Modal titulo="Cancelar nota fiscal" onFechar={onFechar}>
      <div className="space-y-4">
        <p className="text-sm text-sakura-purple-dark/90">
          Isso cancela <strong>{arquivo.nome_arquivo}</strong> direto na SEFAZ/prefeitura, através
          da Focus NFe. Não dá pra desfazer.
        </p>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-sakura-purple-dark/80">
            Justificativa <span className="text-red-500">*</span> (mínimo{" "}
            {TAMANHO_MINIMO_JUSTIFICATIVA} caracteres)
          </span>
          <textarea
            value={justificativa}
            onChange={(e) => setJustificativa(e.target.value)}
            rows={3}
            placeholder="Ex: nota emitida por engano, valor errado, teste do sistema..."
            className="rounded-lg border border-sakura-gray/40 px-3 py-2 text-sm outline-none focus:border-sakura-purple"
          />
        </label>

        {erro && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</p>}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onFechar}
            className="rounded-xl px-4 py-2 text-sm font-medium text-sakura-purple-dark/90 hover:bg-sakura-gray/10"
          >
            Voltar
          </button>
          <button
            type="button"
            onClick={handleConfirmar}
            disabled={!justificativaValida || cancelando}
            className="rounded-xl bg-red-600 px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {cancelando ? "Cancelando..." : "Confirmar cancelamento"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
