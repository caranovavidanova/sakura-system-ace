import { useEffect, useState } from "react";
import { Modal } from "@/components/Modal";
import { useAuth } from "@/contexts/AuthContext";
import { buscarClientePorId } from "@/lib/clientes";
import { buscarConfiguracaoFiscal } from "@/lib/configuracoes";
import { mensagemDeErro } from "@/lib/errors";
import {
  baixarArquivoFocusNfe,
  emitirNFCe,
  emitirNFSe,
  FocusNfeError,
  type PagamentoParaNota,
} from "@/lib/focusNfe";
import { listarMovimentosCaixaPorOrdem } from "@/lib/caixa";
import { salvarArquivoEmitido } from "@/lib/notasFiscais";
import { buscarPecasPorIds } from "@/lib/pecas";
import type { Cliente } from "@/types/cliente";
import type { ConfiguracaoFiscalLoja } from "@/types/configuracao";
import type { RespostaFocusNfe } from "@/types/focusNfe";
import type { OrdemServico } from "@/types/os";
import { totalPorTipo } from "@/types/os";

interface EmitirNotaFiscalModalProps {
  ordem: OrdemServico;
  tipoNota: "NFC-e" | "NFS-e";
  onFechar: () => void;
  onEmitido: () => void;
}

// Venda de balcão de autocenter é sempre presencial/à vista do lado da nota
// — quando não há lançamento de Caixa vinculado (faturamento "a receber
// depois"), não dá pra saber o meio de pagamento real ainda, então cai num
// código genérico ("99" — Outros) só pra não travar a emissão.
async function buscarPagamentosParaNota(ordemId: string, total: number): Promise<PagamentoParaNota[]> {
  const movimentos = await listarMovimentosCaixaPorOrdem(ordemId);
  if (movimentos.length > 0) {
    return movimentos.map((m) => ({ formaPagamento: m.forma_pagamento ?? "outros", valor: m.valor }));
  }
  return [{ formaPagamento: "outros", valor: total }];
}

export function EmitirNotaFiscalModal({
  ordem,
  tipoNota,
  onFechar,
  onEmitido,
}: EmitirNotaFiscalModalProps) {
  const { operador, lojaAtual } = useAuth();
  const [carregando, setCarregando] = useState(true);
  const [emitindo, setEmitindo] = useState(false);
  const [erro, setErro] = useState("");
  const [configuracaoFiscal, setConfiguracaoFiscal] = useState<ConfiguracaoFiscalLoja | null>(null);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [codigoMunicipioCliente, setCodigoMunicipioCliente] = useState("");
  const [resultado, setResultado] = useState<RespostaFocusNfe | null>(null);
  const [baixandoDanfe, setBaixandoDanfe] = useState(false);

  const itensPeca = (ordem.itens ?? []).filter((item) => item.tipo === "peca");
  const itensServico = (ordem.itens ?? []).filter((item) => item.tipo === "servico");
  const totalPecas = totalPorTipo(ordem.itens ?? [], "peca");
  const totalServicos = totalPorTipo(ordem.itens ?? [], "servico");

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      setErro("");
      try {
        const [config, clienteCompleto] = await Promise.all([
          buscarConfiguracaoFiscal(ordem.loja_id),
          buscarClientePorId(ordem.cliente_id),
        ]);
        setConfiguracaoFiscal(config);
        setCliente(clienteCompleto);
      } catch (err) {
        setErro(mensagemDeErro(err));
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [ordem.loja_id, ordem.cliente_id]);

  async function handleEmitir() {
    if (!configuracaoFiscal || !cliente || !operador || !lojaAtual) return;
    setErro("");
    setEmitindo(true);
    try {
      let resposta: RespostaFocusNfe;
      if (tipoNota === "NFC-e") {
        const pecas = await buscarPecasPorIds(
          itensPeca.map((item) => item.peca_id).filter((id): id is string => Boolean(id)),
        );
        const itens = itensPeca
          .map((item) => {
            const peca = pecas.find((p) => p.id === item.peca_id);
            if (!peca) return null;
            return { peca, quantidade: item.quantidade, precoUnitario: item.preco_unitario };
          })
          .filter((item): item is NonNullable<typeof item> => item !== null);

        if (itens.length === 0) {
          throw new Error("Esta OS não tem nenhum item de peça pra emitir NFC-e.");
        }

        const pagamentos = await buscarPagamentosParaNota(ordem.id, totalPecas);

        resposta = await emitirNFCe({ ordem, itens, cliente, pagamentos, configuracaoFiscal });
      } else {
        if (itensServico.length === 0) {
          throw new Error("Esta OS não tem nenhum item de serviço pra emitir NFS-e.");
        }
        if (!codigoMunicipioCliente.trim()) {
          throw new Error("Informe o código do município do cliente pra emitir a NFS-e.");
        }

        const discriminacao = itensServico.map((item) => item.descricao).join("; ");

        resposta = await emitirNFSe({
          ordem,
          discriminacao,
          valorServicos: totalServicos,
          cliente,
          codigoMunicipioCliente: codigoMunicipioCliente.trim(),
          configuracaoFiscal,
        });
      }

      if (resposta.status !== "autorizado") {
        throw new FocusNfeError(
          resposta.mensagem_sefaz ?? resposta.mensagem ?? `A nota voltou com status "${resposta.status}".`,
        );
      }

      await salvarArquivoEmitido({
        tipo: tipoNota === "NFC-e" ? "nfe" : "nfse",
        resposta,
        ordemServicoId: ordem.id,
        operadorId: operador.id,
        lojaId: lojaAtual.id,
        token: configuracaoFiscal.focus_nfe_token as string,
        ambiente: configuracaoFiscal.focus_nfe_ambiente,
      });

      setResultado(resposta);
      onEmitido();
    } catch (err) {
      setErro(mensagemDeErro(err));
    } finally {
      setEmitindo(false);
    }
  }

  async function handleBaixarDanfe() {
    if (!resultado?.caminho_danfe || !configuracaoFiscal?.focus_nfe_token) return;
    setBaixandoDanfe(true);
    try {
      const blob = await baixarArquivoFocusNfe(
        resultado.caminho_danfe,
        configuracaoFiscal.focus_nfe_token,
        configuracaoFiscal.focus_nfe_ambiente,
      );
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (err) {
      setErro(mensagemDeErro(err));
    } finally {
      setBaixandoDanfe(false);
    }
  }

  const focusNfeConfigurado = Boolean(configuracaoFiscal?.focus_nfe_token);

  return (
    <Modal titulo={`Emitir ${tipoNota}`} onFechar={onFechar}>
      {carregando && <p className="text-sm text-sakura-muted">Carregando...</p>}

      {!carregando && erro && (
        <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>
      )}

      {!carregando && !resultado && !focusNfeConfigurado && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Falta cadastrar o token do Focus NFe (e os dados fiscais da loja) em Configurações →
          "Dados fiscais da loja" antes de emitir.
        </p>
      )}

      {!carregando && !resultado && focusNfeConfigurado && (
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-3 rounded-lg bg-sakura-pink-soft/60 p-3">
            <div>
              <p className="text-xs text-sakura-purple-dark/85">Cliente</p>
              <p className="font-medium text-sakura-purple-dark">{ordem.cliente?.nome ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs text-sakura-purple-dark/85">
                {tipoNota === "NFC-e" ? "Total de peças" : "Total de serviços"}
              </p>
              <p className="font-medium text-sakura-purple-dark">
                {(tipoNota === "NFC-e" ? totalPecas : totalServicos).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
            </div>
          </div>

          {tipoNota === "NFS-e" && (
            <label className="flex flex-col gap-1 text-xs text-sakura-purple-dark/90">
              Código IBGE do município do cliente
              <input
                value={codigoMunicipioCliente}
                onChange={(e) => setCodigoMunicipioCliente(e.target.value)}
                placeholder={cliente ? `${cliente.cidade ?? ""}/${cliente.uf ?? ""}` : ""}
                className="w-full rounded-lg border border-sakura-gray/40 px-3 py-2 text-sm text-sakura-purple-dark outline-none focus:border-sakura-purple"
              />
            </label>
          )}

          <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
            {configuracaoFiscal?.focus_nfe_ambiente === "homologacao"
              ? "Ambiente de homologação — esta nota é só de teste, sem valor fiscal."
              : "Ambiente de produção — esta nota será emitida de verdade."}
          </p>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onFechar}
              className="rounded-xl px-4 py-2 text-sm font-medium text-sakura-purple-dark/90 hover:bg-sakura-gray/10"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleEmitir}
              disabled={emitindo}
              className="rounded-xl bg-sakura-purple px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              {emitindo ? "Emitindo..." : "Confirmar emissão"}
            </button>
          </div>
        </div>
      )}

      {resultado && (
        <div className="space-y-3 text-sm">
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-emerald-700">
            {tipoNota} emitida com sucesso — número {resultado.numero ?? "—"}.
          </p>
          {resultado.chave_nfe && (
            <p className="break-all text-xs text-sakura-muted">Chave: {resultado.chave_nfe}</p>
          )}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onFechar}
              className="rounded-xl px-4 py-2 text-sm font-medium text-sakura-purple-dark/90 hover:bg-sakura-gray/10"
            >
              Fechar
            </button>
            {resultado.caminho_danfe && (
              <button
                type="button"
                onClick={handleBaixarDanfe}
                disabled={baixandoDanfe}
                className="rounded-xl bg-sakura-purple px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
              >
                {baixandoDanfe ? "Abrindo..." : "Ver DANFE"}
              </button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
