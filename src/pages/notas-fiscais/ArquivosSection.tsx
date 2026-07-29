import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { mensagemDeErro } from "@/lib/errors";
import { baixarArquivo, enviarArquivo, excluirArquivo, listarArquivos } from "@/lib/notasFiscais";
import { listarOrdens } from "@/lib/ordensServico";
import type { NotaFiscalArquivo, TipoNotaFiscal } from "@/types/notaFiscal";
import type { OrdemServico } from "@/types/os";
import { NotaFiscalVisualModal } from "./NotaFiscalVisualModal";

interface ArquivosSectionProps {
  tipo: TipoNotaFiscal;
}

function competenciaAtual(): string {
  const hoje = new Date();
  return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-01`;
}

function formatarCompetencia(competencia: string): string {
  const [ano, mes] = competencia.split("-");
  const data = new Date(Number(ano), Number(mes) - 1, 1);
  const texto = data.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export function ArquivosSection({ tipo }: ArquivosSectionProps) {
  const { operador } = useAuth();
  const [arquivos, setArquivos] = useState<NotaFiscalArquivo[]>([]);
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [competencia, setCompetencia] = useState(competenciaAtual());
  const [ordemServicoId, setOrdemServicoId] = useState("");
  const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(null);
  const [arquivoVisualizando, setArquivoVisualizando] = useState<NotaFiscalArquivo | null>(null);

  async function carregar() {
    setCarregando(true);
    setErro(null);
    try {
      const [listaArquivos, listaOrdens] = await Promise.all([
        listarArquivos(tipo),
        listarOrdens(),
      ]);
      setArquivos(listaArquivos);
      setOrdens(listaOrdens);
    } catch (err) {
      console.error("Erro ao carregar notas fiscais:", err);
      setErro(mensagemDeErro(err));
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
    setMostrarFormulario(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipo]);

  async function handleEnviar(e: React.FormEvent) {
    e.preventDefault();
    if (!arquivoSelecionado || !operador) return;
    setErro(null);
    setEnviando(true);
    try {
      await enviarArquivo({
        tipo,
        competencia,
        arquivo: arquivoSelecionado,
        ordemServicoId: ordemServicoId || null,
        operadorId: operador.id,
      });
      setMostrarFormulario(false);
      setArquivoSelecionado(null);
      setOrdemServicoId("");
      await carregar();
    } catch (err) {
      console.error("Erro ao enviar XML:", err);
      setErro(mensagemDeErro(err));
    } finally {
      setEnviando(false);
    }
  }

  async function handleBaixar(arquivo: NotaFiscalArquivo) {
    try {
      await baixarArquivo(arquivo);
    } catch (err) {
      console.error("Erro ao baixar XML:", err);
      setErro(mensagemDeErro(err));
    }
  }

  async function handleExcluir(arquivo: NotaFiscalArquivo) {
    if (!confirm(`Excluir o arquivo "${arquivo.nome_arquivo}"?`)) return;
    try {
      await excluirArquivo(arquivo);
      await carregar();
    } catch (err) {
      console.error("Erro ao excluir XML:", err);
      setErro(mensagemDeErro(err));
    }
  }

  const grupos = new Map<string, NotaFiscalArquivo[]>();
  for (const arquivo of arquivos) {
    const chave = arquivo.competencia.slice(0, 7);
    const grupo = grupos.get(chave) ?? [];
    grupo.push(arquivo);
    grupos.set(chave, grupo);
  }

  return (
    <div className="space-y-4">
      {erro && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</p>
      )}

      <div className="flex justify-end">
        {!mostrarFormulario && (
          <button
            onClick={() => setMostrarFormulario(true)}
            className="rounded-xl bg-sakura-purple px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            + Enviar XML
          </button>
        )}
      </div>

      {mostrarFormulario && (
        <form onSubmit={handleEnviar} className="space-y-4 sakura-card p-6 shadow-sm">
          <h3 className="text-sm font-semibold text-sakura-purple-dark">Enviar arquivo XML</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-sakura-purple-dark/80">
                Arquivo <span className="text-red-500">*</span>
              </span>
              <input
                type="file"
                accept=".xml,text/xml,application/xml"
                required
                onChange={(e) => setArquivoSelecionado(e.target.files?.[0] ?? null)}
                className="rounded-lg border border-sakura-gray/40 px-3 py-2 text-sm outline-none focus:border-sakura-purple"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-sakura-purple-dark/80">
                Mês de competência <span className="text-red-500">*</span>
              </span>
              <input
                type="month"
                required
                value={competencia.slice(0, 7)}
                onChange={(e) => setCompetencia(`${e.target.value}-01`)}
                className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-sakura-purple-dark/80">
                Ordem de Serviço relacionada (opcional)
              </span>
              <select
                value={ordemServicoId}
                onChange={(e) => setOrdemServicoId(e.target.value)}
                className="rounded-lg border border-sakura-gray/40 px-3 py-2 outline-none focus:border-sakura-purple"
              >
                <option value="">Nenhuma</option>
                {ordens.map((ordem) => (
                  <option key={ordem.id} value={ordem.id}>
                    {ordem.cliente?.nome ?? "Cliente"} —{" "}
                    {new Date(ordem.data_abertura).toLocaleDateString("pt-BR")}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setMostrarFormulario(false)}
              className="rounded-xl px-4 py-2 text-sm font-medium text-sakura-purple-dark/90 hover:bg-sakura-gray/10"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando}
              className="rounded-xl bg-sakura-purple px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              {enviando ? "Enviando..." : "Enviar"}
            </button>
          </div>
        </form>
      )}

      {carregando ? (
        <p className="text-sm text-sakura-muted">Carregando...</p>
      ) : grupos.size === 0 ? (
        <p className="text-sm text-sakura-muted">Nenhum arquivo enviado ainda.</p>
      ) : (
        [...grupos.entries()].map(([chave, arquivosDoMes]) => (
          <div key={chave} className="overflow-hidden sakura-card">
            <div className="bg-sakura-pink-soft px-4 py-3">
              <h3 className="text-sm font-semibold text-sakura-purple-dark">
                {formatarCompetencia(arquivosDoMes[0].competencia)}
              </h3>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="text-sakura-purple-dark/90">
                <tr>
                  <th className="px-4 py-2 font-medium">Arquivo</th>
                  <th className="px-4 py-2 font-medium">Ordem de Serviço</th>
                  <th className="px-4 py-2 font-medium">Enviado por</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody>
                {arquivosDoMes.map((arquivo) => (
                  <tr key={arquivo.id} className="border-t border-sakura-gray/20">
                    <td className="px-4 py-3">{arquivo.nome_arquivo}</td>
                    <td className="px-4 py-3">
                      {arquivo.ordem_servico?.cliente?.nome ?? "—"}
                    </td>
                    <td className="px-4 py-3">{arquivo.operador?.nome ?? "—"}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => setArquivoVisualizando(arquivo)}
                          className="text-xs font-medium text-sakura-purple hover:underline"
                        >
                          Versão para o cliente
                        </button>
                        <button
                          onClick={() => handleBaixar(arquivo)}
                          className="text-xs font-medium text-sakura-purple hover:underline"
                        >
                          Baixar XML
                        </button>
                        <button
                          onClick={() => handleExcluir(arquivo)}
                          className="text-xs font-medium text-red-600 hover:underline"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}

      {arquivoVisualizando && (
        <NotaFiscalVisualModal
          arquivo={arquivoVisualizando}
          onFechar={() => setArquivoVisualizando(null)}
        />
      )}
    </div>
  );
}
