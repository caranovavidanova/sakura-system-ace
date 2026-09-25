// @vitest-environment jsdom
/**
 * Teste de TELA da comissão paga (item TL-46.1).
 *
 * A comparação e o retrato estão testados em schemas/comissoesPagas.test.ts.
 * O que só a tela prova: que o retrato GRAVADO é o das OS que a tela mostrou
 * naquele período, e que uma OS editada depois do pagamento aparece em aviso
 * — a promessa inteira do item é "mostrar, nunca esconder".
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderizar, screen, within } from "@/testes/tela";
import { diaLocal, hojeLocal } from "@/lib/datas";
import type { ComissaoFechamento } from "@/types/comissaoFechamento";
import type { Funcionario } from "@/types/funcionario";
import type { OrdemServico } from "@/types/os";
import type { Peca } from "@/types/peca";

const registrarComissaoPaga = vi.fn();
vi.mock("@/lib/comissoesFechamentos", () => ({
  registrarComissaoPaga: (...a: unknown[]) => registrarComissaoPaga(...a),
  desfazerComissaoPaga: vi.fn(),
}));

const { ComissoesSection } = await import("./ComissoesSection");

const agora = new Date();
const inicioDoMes = diaLocal(new Date(agora.getFullYear(), agora.getMonth(), 1));
const hoje = hojeLocal();

const ordem = {
  id: "os-1",
  numero: 7,
  loja_id: "l",
  cliente_id: "c",
  veiculo_id: null,
  status: "faturada",
  km_entrada: null,
  descricao_problema: null,
  forma_pagamento: "Pix",
  parcelas: 1,
  data_abertura: agora.toISOString(),
  data_fechamento: agora.toISOString(),
  vendedor_id: "ana",
  criado_por_id: null,
  atualizado_por_id: null,
  cliente: { nome: "Cliente" },
  itens: [
    {
      id: "i1",
      ordem_servico_id: "os-1",
      tipo: "peca",
      peca_id: "p1",
      servico_id: null,
      tecnico_id: null,
      descricao: "Pneu",
      quantidade: 1,
      preco_unitario: 150,
      desconto: 0,
    },
  ],
} as unknown as OrdemServico;

const pecas = [{ id: "p1", preco_custo: 100 }] as unknown as Peca[];
const funcionarios = [{ id: "ana", nome: "Ana", comissao: 10 }] as unknown as Funcionario[];

function montar(pagamentos: ComissaoFechamento[] = []) {
  const onPagamentosMudaram = vi.fn().mockResolvedValue(undefined);
  const r = renderizar(
    <ComissoesSection
      ordens={[ordem]}
      pecas={pecas}
      servicos={[]}
      funcionarios={funcionarios}
      contasReceber={[]}
      lojaId="l"
      nomeLoja="Loja"
      pagamentos={pagamentos}
      podeDesfazer={false}
      onPagamentosMudaram={onPagamentosMudaram}
    />,
  );
  return { ...r, onPagamentosMudaram };
}

beforeEach(() => {
  registrarComissaoPaga.mockReset().mockResolvedValue(undefined);
});

describe("ComissoesSection — comissão paga", () => {
  it("registra o pagamento com o retrato das OS que a tela mostrou", async () => {
    const { user, onPagamentosMudaram } = montar();
    await user.click(screen.getByRole("button", { name: "Registrar pagamento" }));

    const modal = screen.getByRole("dialog");
    // lucro 50 × 10% = 5
    expect(within(modal).getByDisplayValue("5")).toBeInTheDocument();
    await user.click(within(modal).getByRole("button", { name: "Registrar pagamento" }));

    expect(registrarComissaoPaga).toHaveBeenCalledTimes(1);
    expect(registrarComissaoPaga.mock.calls[0][0]).toMatchObject({
      loja_id: "l",
      funcionario_id: "ana",
      funcionario_nome: "Ana",
      periodo_inicio: inicioDoMes,
      periodo_fim: hoje,
      valor_calculado: 5,
      valor_pago: 5,
      snapshot: [{ ordemId: "os-1", numero: 7, papel: "vendedor", comissao: 5 }],
    });
    expect(onPagamentosMudaram).toHaveBeenCalled();
  });

  it("período já pago: mostra o pagamento no lugar do botão", () => {
    montar([
      {
        id: "p",
        loja_id: "l",
        funcionario_id: "ana",
        funcionario_nome: "Ana",
        periodo_inicio: inicioDoMes,
        periodo_fim: hoje,
        percentual: 10,
        valor_calculado: 5,
        valor_pago: 5,
        data_pagamento: hoje,
        observacao: null,
        snapshot: [{ ordemId: "os-1", numero: 7, papel: "vendedor", comissao: 5 }],
        operador_id: null,
        criado_em: agora.toISOString(),
      },
    ]);
    expect(screen.queryByRole("button", { name: "Registrar pagamento" })).not.toBeInTheDocument();
    expect(screen.queryByText(/mudou depois do pagamento/)).not.toBeInTheDocument();
  });

  it("OS editada depois do pagamento: AVISA, com a OS e os dois valores", () => {
    montar([
      {
        id: "p",
        loja_id: "l",
        funcionario_id: "ana",
        funcionario_nome: "Ana",
        periodo_inicio: inicioDoMes,
        periodo_fim: hoje,
        percentual: 10,
        valor_calculado: 8,
        valor_pago: 8,
        data_pagamento: hoje,
        observacao: null,
        // no dia do pagamento a OS 7 dava 8,00 de comissão; hoje dá 5,00
        snapshot: [{ ordemId: "os-1", numero: 7, papel: "vendedor", comissao: 8 }],
        operador_id: null,
        criado_em: agora.toISOString(),
      },
    ]);
    expect(screen.getByText(/A comissão de Ana mudou depois do pagamento/)).toBeInTheDocument();
    expect(screen.getByText(/OS 7 \(vendedor\): R\$\s8,00 → R\$\s5,00/)).toBeInTheDocument();
  });
});
