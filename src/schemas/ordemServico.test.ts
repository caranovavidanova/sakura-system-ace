import { describe, expect, it } from "vitest";
import {
  idsDeFuncionarios,
  itemFormVazio,
  nomearFuncionarios,
  totaisDaOrdem,
  type ItemFormValues,
} from "./ordemServico";
import type { ItemOS, OrdemServico } from "@/types/os";

function itemLancado(
  tipo: "peca" | "servico",
  quantidade: number,
  precoUnitario: number,
  desconto = 0,
): ItemOS {
  return {
    id: crypto.randomUUID(),
    ordem_servico_id: "os-1",
    tipo,
    peca_id: tipo === "peca" ? "p1" : null,
    servico_id: tipo === "servico" ? "s1" : null,
    tecnico_id: null,
    descricao: tipo,
    quantidade,
    preco_unitario: precoUnitario,
    desconto,
  };
}

function itemDigitado(
  tipo: "peca" | "servico",
  quantidade: string,
  precoUnitario: string,
  desconto = "",
): ItemFormValues {
  return { ...itemFormVazio, tipo, quantidade, preco_unitario: precoUnitario, desconto };
}

describe("totaisDaOrdem", () => {
  it("é tudo zero numa OS em branco", () => {
    expect(totaisDaOrdem([], [])).toEqual({ pecas: 0, servicos: 0, total: 0 });
  });

  it("separa peça de serviço", () => {
    const totais = totaisDaOrdem(
      [itemLancado("peca", 2, 150), itemLancado("servico", 1, 60)],
      [],
    );
    expect(totais).toEqual({ pecas: 300, servicos: 60, total: 360 });
  });

  it("soma o que já está lançado com o que está sendo digitado agora", () => {
    const totais = totaisDaOrdem(
      [itemLancado("peca", 1, 200)],
      [itemDigitado("peca", "2", "50"), itemDigitado("servico", "1", "80")],
    );
    expect(totais).toEqual({ pecas: 300, servicos: 80, total: 380 });
  });

  it("desconta o desconto dos dois lados", () => {
    const totais = totaisDaOrdem(
      [itemLancado("peca", 1, 100, 10)],
      [itemDigitado("servico", "1", "100", "25")],
    );
    expect(totais).toEqual({ pecas: 90, servicos: 75, total: 165 });
  });

  it("ignora linha em branco do formulário (campo vazio não vira NaN)", () => {
    const totais = totaisDaOrdem([itemLancado("peca", 1, 100)], [{ ...itemFormVazio }]);
    expect(totais).toEqual({ pecas: 100, servicos: 0, total: 100 });
  });

  it("o total é sempre peças + serviços, sem uma terceira conta que possa divergir", () => {
    const totais = totaisDaOrdem(
      [itemLancado("peca", 3, 33.33), itemLancado("servico", 2, 11.11)],
      [itemDigitado("peca", "1", "0.01")],
    );
    expect(totais.total).toBe(totais.pecas + totais.servicos);
  });
});

// ---------------------------------------------------------------------------
// Costura do nome de vendedor e técnico (TR-04.3)
// ---------------------------------------------------------------------------
// O que estas duas funções protegem: antes da migration 0056 os nomes vinham
// por join embutido em `funcionarios`, e aquela tabela passou a exigir a
// permissão do módulo. Join embutido em tabela fechada não dá erro — devolve
// `null` calado. Estes testes são o "alguém fica sabendo" dessa troca.

function ordemCom(
  vendedorId: string | null,
  tecnicoIds: (string | null)[] = [],
): OrdemServico {
  return {
    id: crypto.randomUUID(),
    numero: 1,
    loja_id: "loja",
    cliente_id: "cliente",
    veiculo_id: null,
    status: "em_andamento",
    km_entrada: null,
    descricao_problema: null,
    forma_pagamento: null,
    parcelas: 1,
    data_abertura: "2026-09-18T12:00:00Z",
    data_fechamento: null,
    vendedor_id: vendedorId,
    criado_por_id: null,
    atualizado_por_id: null,
    itens: tecnicoIds.map((tecnicoId) => ({
      id: crypto.randomUUID(),
      ordem_servico_id: "os",
      tipo: "servico" as const,
      peca_id: null,
      servico_id: null,
      tecnico_id: tecnicoId,
      descricao: "Serviço",
      quantidade: 1,
      preco_unitario: 10,
      desconto: 0,
    })),
  };
}

describe("idsDeFuncionarios", () => {
  it("junta vendedor da OS e técnico do item, sem repetir", () => {
    const ids = idsDeFuncionarios([ordemCom("ana", ["bia", "ana"]), ordemCom("bia", ["bia"])]);
    expect([...ids].sort()).toEqual(["ana", "bia"]);
  });

  it("devolve lista vazia quando ninguém foi preenchido, pra não gastar consulta", () => {
    expect(idsDeFuncionarios([ordemCom(null, [null, null])])).toEqual([]);
  });
});

describe("nomearFuncionarios", () => {
  const nomes = new Map([
    ["ana", "Ana Souza"],
    ["bia", "Bia Lima"],
  ]);

  it("põe o nome no vendedor da OS e no técnico de cada item", () => {
    const [ordem] = nomearFuncionarios([ordemCom("ana", ["bia"])], nomes);
    expect(ordem.vendedor).toEqual({ nome: "Ana Souza" });
    expect(ordem.itens?.[0].tecnico).toEqual({ nome: "Bia Lima" });
  });

  it("id sem nome vira null, nunca um objeto com texto vazio", () => {
    // Acontece de verdade: funcionário de outra loja não vem na view pública.
    // A tela sabe mostrar o travessão pra `null`; pra `{ nome: "" }` ela
    // mostraria "técnico: " e ninguém entenderia.
    const [ordem] = nomearFuncionarios([ordemCom("zé", ["zé"])], nomes);
    expect(ordem.vendedor).toBeNull();
    expect(ordem.itens?.[0].tecnico).toBeNull();
  });

  it("item sem técnico continua sem técnico", () => {
    const [ordem] = nomearFuncionarios([ordemCom(null, [null])], nomes);
    expect(ordem.itens?.[0].tecnico).toBeNull();
  });

  it("não perde nenhum outro campo da ordem nem do item", () => {
    const original = ordemCom("ana", ["bia"]);
    const [ordem] = nomearFuncionarios([original], nomes);
    expect(ordem.numero).toBe(original.numero);
    expect(ordem.itens?.[0].preco_unitario).toBe(10);
    expect(ordem.itens).toHaveLength(1);
  });
});
