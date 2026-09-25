import { beforeEach, describe, expect, it, vi } from "vitest";
import { FunctionsHttpError } from "@supabase/supabase-js";
import type { ConfiguracaoFiscalLoja } from "@/types/configuracao";
import type { OrdemServico } from "@/types/os";
import type { Peca } from "@/types/peca";

// O caminho do programa até o porteiro da Focus NFe (TR-04.2). O que se
// testa aqui é a costura: o que vai no pedido, e como cada resposta do
// porteiro vira o que a tela mostra. O porteiro em si tem o teste dele, em
// supabase/functions/focus-nfe/index.test.ts.

const invoke = vi.fn();
vi.mock("./supabase", () => ({ supabase: { functions: { invoke: (...a: unknown[]) => invoke(...a) } } }));

const {
  baixarArquivoNota,
  cancelarNFSe,
  emitirNFCe,
  FocusNfeError,
  montarCorpoNFCe,
  motivoDaRecusa,
} = await import("./focusNfe");

const LOJA = "00000000-0000-0000-0000-000000000001";

const configuracaoFiscal = {
  loja_id: LOJA,
  cnpj: "12.345.678/0001-90",
  focus_nfe_configurado: true,
  focus_nfe_ambiente: "producao",
} as ConfiguracaoFiscalLoja;

const peca = {
  id: "peca-1",
  codigo_interno: "P1",
  descricao: "Pneu 175/70 R13",
  unidade: "UN",
  ncm: "40111000",
  cfop_padrao: "5102",
  origem: "0",
  cst_ou_csosn: "500",
  aliquota_icms: 0,
} as Peca;

const dadosNFCe = {
  ordem: { id: "os-1", numero: 12 } as OrdemServico,
  itens: [{ peca, quantidade: 1, precoUnitario: 250, desconto: 0 }],
  cliente: null,
  pagamentos: [{ formaPagamento: "pix", valor: 250 }],
  configuracaoFiscal,
};

// O porteiro sempre responde 200 com um envelope quando REPASSA.
const repassou = (dados: unknown, status = 200) => ({
  data: { ok: status < 400, status, dados },
  error: null,
});

// E responde outro código com { erro, motivo } quando RECUSA — que o
// supabase-js entrega como FunctionsHttpError com a Response dentro.
const recusou = (status: number, corpo: unknown) => ({
  data: null,
  error: new FunctionsHttpError(new Response(JSON.stringify(corpo), { status })),
});

beforeEach(() => invoke.mockReset());

describe("o pedido que vai pro porteiro", () => {
  it("emitir manda a loja, a ref e o corpo EXATO da nota — e nenhum token", async () => {
    invoke.mockResolvedValue(repassou({ status: "autorizado", ref: "x" }));
    await emitirNFCe(dadosNFCe);

    const [nome, { body }] = invoke.mock.calls[0];
    expect(nome).toBe("focus-nfe");
    expect(body).toMatchObject({ loja_id: LOJA, acao: "emitir", tipo: "nfce" });
    expect(body.ref).toMatch(/^os12-nfce-\d+$/);
    // O corpo é o mesmo que o teste-ouro fixa; só o instante de emissão muda
    // de uma chamada pra outra.
    expect({ ...body.corpo, data_emissao: "" }).toEqual({
      ...montarCorpoNFCe(dadosNFCe),
      data_emissao: "",
    });

    for (const [, chamada] of invoke.mock.calls) {
      expect(JSON.stringify(chamada)).not.toMatch(/token/i);
    }
  });

  it("a consulta de acompanhamento usa a mesma ref da emissão", async () => {
    invoke.mockResolvedValue(repassou({ status: "autorizado" }));
    await emitirNFCe(dadosNFCe);
    const [emissao, consulta] = invoke.mock.calls.map(([, { body }]) => body);
    expect(consulta).toEqual({ loja_id: LOJA, acao: "consultar", tipo: "nfce", ref: emissao.ref });
  });

  it("a ref volta junto mesmo se a Focus NFe não a repetir — é o que permite cancelar depois", async () => {
    invoke.mockResolvedValue(repassou({ status: "autorizado" }));
    const resposta = await emitirNFCe(dadosNFCe);
    expect(resposta.ref).toMatch(/^os12-nfce-\d+$/);
  });

  it("loja sem token nem chega a chamar o porteiro", async () => {
    await expect(
      emitirNFCe({ ...dadosNFCe, configuracaoFiscal: { ...configuracaoFiscal, focus_nfe_configurado: false } }),
    ).rejects.toThrow(/Token do Focus NFe não configurado/);
    expect(invoke).not.toHaveBeenCalled();
  });

  it("cancelar manda a justificativa e a loja", async () => {
    invoke.mockResolvedValue(repassou({ status: "cancelado" }));
    await cancelarNFSe("os12-nfse-1", "Serviço lançado em duplicidade", LOJA);
    expect(invoke.mock.calls[0][1].body).toEqual({
      loja_id: LOJA,
      acao: "cancelar",
      tipo: "nfse",
      ref: "os12-nfse-1",
      justificativa: "Serviço lançado em duplicidade",
    });
  });
});

describe("como a resposta do porteiro vira mensagem na tela", () => {
  it("erro da Focus NFe mostra a mensagem dela, como sempre mostrou", async () => {
    invoke.mockResolvedValue(repassou({ mensagem: "CSOSN inválido para o regime" }, 422));
    await expect(emitirNFCe(dadosNFCe)).rejects.toThrow("CSOSN inválido para o regime");
  });

  it("recusa do porteiro mostra a frase dele, e o motivo fica disponível pro código", async () => {
    invoke.mockResolvedValue(
      recusou(403, { erro: "Você não tem permissão para usar a emissão de nota fiscal nesta loja.", motivo: "sem_permissao" }),
    );
    const erro = await emitirNFCe(dadosNFCe).catch((e: unknown) => e);
    expect(erro).toBeInstanceOf(FocusNfeError);
    expect((erro as Error).message).toMatch(/não tem permissão/);
    expect(motivoDaRecusa(erro)).toBe("sem_permissao");
  });

  it("404 sem a resposta do porteiro = porteiro não publicado, e a mensagem diz isso", async () => {
    invoke.mockResolvedValue(recusou(404, { code: "NOT_FOUND", message: "Requested function was not found" }));
    await expect(emitirNFCe(dadosNFCe)).rejects.toThrow(/falta publicar o porteiro/);
  });

  it("sem internet vira uma frase, não um erro técnico", async () => {
    invoke.mockResolvedValue({ data: null, error: new Error("Failed to send a request to the Edge Function") });
    await expect(emitirNFCe(dadosNFCe)).rejects.toThrow(/Confira a internet/);
  });
});

describe("baixar o PDF/XML", () => {
  it("pede pela ref e devolve o arquivo com o tipo que a Focus NFe informou", async () => {
    const bytes = [0x25, 0x50, 0x44, 0x46, 0xff, 0x00];
    invoke.mockResolvedValue({
      data: {
        ok: true,
        status: 200,
        tipo_conteudo: "application/pdf",
        conteudo_base64: btoa(String.fromCharCode(...bytes)),
      },
      error: null,
    });
    const blob = await baixarArquivoNota(LOJA, "nfce", "os12-nfce-1", "danfe");
    expect(invoke.mock.calls[0][1].body).toEqual({
      loja_id: LOJA,
      acao: "baixar",
      tipo: "nfce",
      ref: "os12-nfce-1",
      arquivo: "danfe",
    });
    expect(blob.type).toBe("application/pdf");
    expect(Array.from(new Uint8Array(await blob.arrayBuffer()))).toEqual(bytes);
  });

  it("arquivo que não veio vira erro, não um PDF vazio", async () => {
    invoke.mockResolvedValue({ data: { ok: false, status: 404, conteudo_base64: null }, error: null });
    await expect(baixarArquivoNota(LOJA, "nfse", "os12-nfse-1", "xml")).rejects.toThrow(/HTTP 404/);
  });
});
