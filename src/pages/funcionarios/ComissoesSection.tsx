import { useMemo, useState } from "react";
import { mapaCustoPecas, mapaCustoServicos } from "@/schemas/metricasCaixa";
import {
  resumirComissoes,
  totaisComissoes,
  SEM_FUNCIONARIO,
  type ComissaoFuncionario,
  type ResumoPapel,
} from "@/schemas/comissoes";
import type { ContaReceber } from "@/types/contaReceber";
import type { Funcionario } from "@/types/funcionario";
import type { OrdemServico } from "@/types/os";
import type { Peca } from "@/types/peca";
import type { Servico } from "@/types/servico";

function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarData(dataIso: string): string {
  return new Date(dataIso).toLocaleDateString("pt-BR");
}

function primeiroDiaDoMes(): string {
  const hoje = new Date();
  return new Date(hoje.getFullYear(), hoje.getMonth(), 1).toLocaleDateString("sv-SE");
}

function hojeStr(): string {
  return new Date().toLocaleDateString("sv-SE");
}

interface ComissoesSectionProps {
  ordens: OrdemServico[];
  pecas: Peca[];
  servicos: Servico[];
  funcionarios: Funcionario[];
  contasReceber: ContaReceber[];
}

export function ComissoesSection({
  ordens,
  pecas,
  servicos,
  funcionarios,
  contasReceber,
}: ComissoesSectionProps) {
  const [dataInicio, setDataInicio] = useState(primeiroDiaDoMes());
  const [dataFim, setDataFim] = useState(hojeStr());
  const [abertoId, setAbertoId] = useState<string | null>(null);

  const linhas = useMemo(
    () =>
      resumirComissoes({
        ordens,
        funcionarios,
        custoPeca: mapaCustoPecas(pecas),
        custoServico: mapaCustoServicos(servicos),
        ordensAReceber: new Set(
          contasReceber
            .filter((conta) => conta.status === "pendente" && conta.ordem_servico_id)
            .map((conta) => conta.ordem_servico_id as string),
        ),
        de: dataInicio,
        ate: dataFim,
      }),
    [ordens, funcionarios, pecas, servicos, contasReceber, dataInicio, dataFim],
  );

  const totais = totaisComissoes(linhas);
  const semPercentual = linhas.filter(
    (linha) => linha.funcionarioId !== SEM_FUNCIONARIO && linha.percentual === null,
  );
  const semDono = linhas.find((linha) => linha.funcionarioId === SEM_FUNCIONARIO);

  return (
    <>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-sakura-purple-dark/80">
          De:
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            className="rounded-lg border border-sakura-gray/40 px-3 py-1.5"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-sakura-purple-dark/80">
          Até:
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            className="rounded-lg border border-sakura-gray/40 px-3 py-1.5"
          />
        </label>
      </div>

      <p className="text-xs text-sakura-muted">
        Conta só OS já faturada, pela data do faturamento. A comissão é calculada sobre o lucro
        (venda − custo), na porcentagem do cadastro de cada funcionário.
      </p>

      <div className="grid grid-cols-3 gap-4">
        <div className="sakura-card p-4">
          <p className="text-xs text-sakura-muted">Lucro do período</p>
          <p className="text-xl font-semibold text-sakura-purple-dark">
            {formatarMoeda(totais.lucro)}
          </p>
        </div>
        <div className="sakura-card p-4">
          <p className="text-xs text-sakura-muted">Total de comissões</p>
          <p className="text-xl font-semibold text-sakura-purple-dark">
            {formatarMoeda(totais.comissao)}
          </p>
        </div>
        <div className="sakura-card p-4">
          <p className="text-xs text-sakura-muted">Comissão de OS ainda não recebida</p>
          <p className="text-xl font-semibold text-sakura-purple-dark">
            {formatarMoeda(totais.comissaoAReceber)}
          </p>
        </div>
      </div>

      {totais.comissaoAReceber > 0 && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {formatarMoeda(totais.comissaoAReceber)} dessa comissão vem de OS faturada como "a
          receber depois", que o cliente ainda não pagou.
        </p>
      )}

      {totais.itensSemCusto > 0 && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {totais.itensSemCusto === 1
            ? "1 item vendido no período está sem preço de custo cadastrado"
            : `${totais.itensSemCusto} itens vendidos no período estão sem preço de custo cadastrado`}
          . Eles entram como lucro cheio, então a comissão sai maior que a real — vale conferir o
          cadastro dessas peças/serviços antes de pagar.
        </p>
      )}

      {semPercentual.length > 0 && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Sem porcentagem de comissão cadastrada:{" "}
          {semPercentual.map((linha) => linha.nome).join(", ")}. A comissão deles fica em zero até
          preencher o campo "Comissão (%)" no cadastro do funcionário.
        </p>
      )}

      {semDono && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {formatarMoeda(semDono.lucroTotal)} de lucro ficou sem
          dono no período — OS sem vendedor escolhido, ou item sem técnico. Esse valor não gera
          comissão pra ninguém.
        </p>
      )}

      {linhas.length === 0 ? (
        <p className="text-sm text-sakura-muted">
          Nenhuma OS faturada nesse período — nada pra calcular ainda.
        </p>
      ) : (
        <section>
          <h2 className="mb-3 text-sm font-semibold text-sakura-purple-dark">
            Comissão por funcionário
          </h2>
          <div className="overflow-hidden sakura-card">
            <table className="w-full text-left text-sm">
              <thead className="bg-sakura-pink-soft text-sakura-purple-dark">
                <tr>
                  <th className="px-4 py-3 font-medium">Funcionário</th>
                  <th className="px-4 py-3 font-medium">Comissão</th>
                  <th className="px-4 py-3 font-medium">Vendeu</th>
                  <th className="px-4 py-3 font-medium">Lucro gerado</th>
                  <th className="px-4 py-3 font-medium">A pagar</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {linhas.map((linha) => (
                  <LinhaFuncionario
                    key={linha.funcionarioId}
                    linha={linha}
                    aberta={abertoId === linha.funcionarioId}
                    onAlternar={() =>
                      setAbertoId(abertoId === linha.funcionarioId ? null : linha.funcionarioId)
                    }
                  />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  );
}

function LinhaFuncionario({
  linha,
  aberta,
  onAlternar,
}: {
  linha: ComissaoFuncionario;
  aberta: boolean;
  onAlternar: () => void;
}) {
  return (
    <>
      <tr className="border-t border-sakura-gray/20">
        <td className="px-4 py-3">{linha.nome}</td>
        <td className="px-4 py-3">
          {linha.percentual === null ? (
            <span className="text-sakura-muted">—</span>
          ) : (
            `${linha.percentual}%`
          )}
        </td>
        <td className="px-4 py-3">{formatarMoeda(linha.vendidoTotal)}</td>
        <td className="px-4 py-3">{formatarMoeda(linha.lucroTotal)}</td>
        <td className="px-4 py-3 font-medium">{formatarMoeda(linha.comissaoTotal)}</td>
        <td className="px-4 py-3 text-right">
          <button
            onClick={onAlternar}
            className="text-xs font-medium text-sakura-purple hover:underline"
          >
            {aberta ? "Fechar" : "Ver as OS"}
          </button>
        </td>
      </tr>
      {aberta && (
        <tr className="border-t border-sakura-gray/20">
          <td colSpan={6} className="px-4 py-4">
            <div className="space-y-4">
              <BlocoDoPapel
                titulo="Como vendedor (atendeu a OS)"
                papel={linha.comoVendedor}
                vazio="Não atendeu nenhuma OS faturada nesse período."
              />
              <BlocoDoPapel
                titulo="Como técnico (executou o item)"
                papel={linha.comoTecnico}
                vazio="Não foi marcado como técnico em nenhum item nesse período."
              />
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function BlocoDoPapel({
  titulo,
  papel,
  vazio,
}: {
  titulo: string;
  papel: ResumoPapel;
  vazio: string;
}) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold text-sakura-purple-dark">
        {titulo}
        {papel.ordens.length > 0 && (
          <span className="ml-2 font-normal text-sakura-muted">
            {formatarMoeda(papel.lucro)} de lucro · {formatarMoeda(papel.comissao)} de comissão
          </span>
        )}
      </h3>
      {papel.ordens.length === 0 ? (
        <p className="text-xs text-sakura-muted">{vazio}</p>
      ) : (
        <table className="w-full table-fixed text-left text-xs">
          {/* Largura fixa pra as duas tabelas (vendedor e técnico) ficarem
              alinhadas uma embaixo da outra, e não cada uma num lugar. */}
          <thead className="text-sakura-purple-dark/90">
            <tr>
              <th className="w-[10%] py-1 font-medium">OS</th>
              <th className="w-[14%] py-1 font-medium">Data</th>
              <th className="w-[30%] py-1 font-medium">Cliente</th>
              <th className="w-[14%] py-1 font-medium">Vendido</th>
              <th className="w-[14%] py-1 font-medium">Lucro</th>
              <th className="py-1 font-medium">Comissão</th>
            </tr>
          </thead>
          <tbody>
            {papel.ordens.map((ordem) => (
              <tr key={`${ordem.ordemId}-${titulo}`} className="border-t border-sakura-gray/20">
                <td className="py-1.5">OS {ordem.numero}</td>
                <td className="py-1.5">{formatarData(ordem.data)}</td>
                <td className="py-1.5">{ordem.cliente}</td>
                <td className="py-1.5">{formatarMoeda(ordem.vendido)}</td>
                <td className="py-1.5">{formatarMoeda(ordem.lucro)}</td>
                <td className="py-1.5">
                  {formatarMoeda(ordem.comissao)}
                  {ordem.aReceber && (
                    <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-800">
                      a receber
                    </span>
                  )}
                  {ordem.itensSemCusto > 0 && (
                    <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-800">
                      sem custo
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
