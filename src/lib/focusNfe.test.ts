import { describe, expect, it } from "vitest";
import { montarCorpoNFCe, montarCorpoNFSe } from "./focusNfe";
import type { ConfiguracaoFiscalLoja } from "@/types/configuracao";
import type { Cliente } from "@/types/cliente";
import type { Peca } from "@/types/peca";

function configuracaoFiscal(sobrescrever: Partial<ConfiguracaoFiscalLoja> = {}): ConfiguracaoFiscalLoja {
  return {
    loja_id: "loja-1",
    cnpj: "51.916.585/0001-25",
    razao_social: "Amigão Pneus",
    nome_fantasia: "Amigão Pneus",
    inscricao_estadual: "123456",
    inscricao_municipal: "12345",
    regime_tributario: "simples_nacional",
    cep: "14800-000",
    rua: "Rua Exemplo",
    numero: "100",
    bairro: "Centro",
    cidade: "Araraquara",
    uf: "SP",
    telefone: null,
    email: null,
    focus_nfe_token: "token-teste",
    focus_nfe_ambiente: "homologacao",
    codigo_municipio: "3503208",
    item_lista_servico: "14.01",
    aliquota_iss: 5,
    codigo_tributario_municipio: null,
    codigo_cnae: "4520-0/01",
    atualizado_em: new Date().toISOString(),
    ...sobrescrever,
  };
}

function peca(sobrescrever: Partial<Peca> = {}): Peca {
  return {
    id: "peca-1",
    codigo_interno: "999",
    codigo_barras: null,
    descricao: "Pneu 175/70 R13",
    marca: null,
    modelo: null,
    aplicacao: null,
    unidade: "UN",
    preco_custo: 100,
    preco_venda: 250,
    ncm: "40111000",
    cest: null,
    cfop_padrao: "5102",
    origem: "0",
    cst_ou_csosn: "102",
    aliquota_icms: 0,
    categoria_id: null,
    prazo_garantia_dias: null,
    ativo: true,
    criado_em: new Date().toISOString(),
    ...sobrescrever,
  };
}

function clientePessoaFisica(sobrescrever: Partial<Cliente> = {}): Cliente {
  return {
    id: "cliente-1",
    nome: "Silvio Criscolin",
    tipo_pessoa: "fisica",
    cpf_cnpj: "043.915.416-29",
    telefone: null,
    email: null,
    cep: "14802-868",
    rua: "Rua Emília Pedraza Baena",
    numero: "114",
    bairro: "Jardim Bouganville",
    cidade: "Araraquara",
    uf: "SP",
    codigo_municipio: "3503208",
    data_nascimento: null,
    criado_em: new Date().toISOString(),
    ...sobrescrever,
  };
}

describe("montarCorpoNFCe", () => {
  it("monta um item por peça, com os campos fiscais dela e valores formatados com 2 casas", () => {
    const corpo = montarCorpoNFCe({
      ordem: { numero: 1 } as never,
      itens: [{ peca: peca(), quantidade: 2, precoUnitario: 250 }],
      cliente: clientePessoaFisica(),
      pagamentos: [{ formaPagamento: "pix", valor: 500 }],
      configuracaoFiscal: configuracaoFiscal(),
    });

    expect(corpo.items).toHaveLength(1);
    expect(corpo.items[0]).toMatchObject({
      numero_item: "1",
      codigo_ncm: "40111000",
      codigo_produto: "999",
      cfop: "5102",
      icms_origem: "0",
      icms_situacao_tributaria: "102",
      icms_aliquota: "0",
      icms_base_calculo: "0",
      valor_bruto: "500.00",
    });
    expect(corpo.valor_produtos).toBe("500.00");
    expect(corpo.valor_total).toBe("500.00");
    expect(corpo.forma_pagamento).toBe("0");
    expect(corpo.formas_pagamento).toEqual([{ forma_pagamento: "17", valor_pagamento: "500.00" }]);
  });

  it("identifica o destinatário pessoa física pelo CPF (sem formatação) e deixa o CNPJ de fora", () => {
    const corpo = montarCorpoNFCe({
      ordem: { numero: 1 } as never,
      itens: [{ peca: peca(), quantidade: 1, precoUnitario: 250 }],
      cliente: clientePessoaFisica(),
      pagamentos: [{ formaPagamento: "dinheiro", valor: 250 }],
      configuracaoFiscal: configuracaoFiscal(),
    });

    expect(corpo.cpf_destinatario).toBe("04391541629");
    expect(corpo.nome_destinatario).toBe("Silvio Criscolin");
  });

  it("calcula icms_valor_total só quando a peça tem alíquota de ICMS", () => {
    const corpo = montarCorpoNFCe({
      ordem: { numero: 1 } as never,
      itens: [{ peca: peca({ aliquota_icms: 18 }), quantidade: 1, precoUnitario: 100 }],
      cliente: clientePessoaFisica(),
      pagamentos: [{ formaPagamento: "dinheiro", valor: 100 }],
      configuracaoFiscal: configuracaoFiscal(),
    });

    expect(corpo.icms_valor_total).toBe("18.00");
    expect(corpo.items[0].icms_base_calculo).toBe("100.00");
  });

  it("soma mais de uma forma de pagamento em formas_pagamento, cada uma com o código SEFAZ certo", () => {
    const corpo = montarCorpoNFCe({
      ordem: { numero: 1 } as never,
      itens: [{ peca: peca(), quantidade: 1, precoUnitario: 250 }],
      cliente: clientePessoaFisica(),
      pagamentos: [
        { formaPagamento: "pix", valor: 125 },
        { formaPagamento: "cartao_credito", valor: 125 },
      ],
      configuracaoFiscal: configuracaoFiscal(),
    });

    expect(corpo.formas_pagamento).toEqual([
      { forma_pagamento: "17", valor_pagamento: "125.00" },
      { forma_pagamento: "03", valor_pagamento: "125.00" },
    ]);
  });
});

describe("montarCorpoNFSe", () => {
  it("monta prestador a partir da configuração fiscal da loja e tomador a partir do cliente", () => {
    const corpo = montarCorpoNFSe({
      ordem: { numero: 1 } as never,
      discriminacao: "Alinhamento e balanceamento",
      valorServicos: 150,
      cliente: clientePessoaFisica(),
      codigoMunicipioCliente: "3503208",
      configuracaoFiscal: configuracaoFiscal(),
    });

    expect(corpo.prestador).toEqual({
      cnpj: "51916585000125",
      inscricao_municipal: "12345",
      codigo_municipio: "3503208",
    });
    expect(corpo.tomador.cpf).toBe("04391541629");
    expect(corpo.tomador.razao_social).toBe("Silvio Criscolin");
    expect(corpo.servico).toMatchObject({
      aliquota: 5,
      discriminacao: "Alinhamento e balanceamento",
      item_lista_servico: "14.01",
      codigo_cnae: "4520-0/01",
      valor_servicos: 150,
    });
  });

  it("usa CNPJ (não CPF) pra cliente pessoa jurídica", () => {
    const corpo = montarCorpoNFSe({
      ordem: { numero: 1 } as never,
      discriminacao: "Serviço",
      valorServicos: 100,
      cliente: clientePessoaFisica({ tipo_pessoa: "juridica", cpf_cnpj: "66.217.744/0001-70" }),
      codigoMunicipioCliente: "3503208",
      configuracaoFiscal: configuracaoFiscal(),
    });

    expect(corpo.tomador.cnpj).toBe("66217744000170");
    expect(corpo.tomador.cpf).toBeUndefined();
  });
});
