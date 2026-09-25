import { describe, expect, it } from "vitest";
import type { ComissaoFechamento } from "@/types/comissaoFechamento";
import { escaparHtml, montarHtmlReciboComissao } from "./reciboComissao";

const pagamento: ComissaoFechamento = {
  id: "p1",
  loja_id: "l",
  funcionario_id: "f1",
  funcionario_nome: "Ana <b>Mecânica</b>",
  periodo_inicio: "2026-09-01",
  periodo_fim: "2026-09-30",
  percentual: 7.5,
  valor_calculado: 123.45,
  valor_pago: 120,
  data_pagamento: "2026-10-05",
  observacao: 'descontado vale de R$ 3,45 & "adiantamento"',
  snapshot: [
    { ordemId: "b", numero: 12, papel: "tecnico", comissao: 23.45 },
    { ordemId: "a", numero: 7, papel: "vendedor", comissao: 100 },
  ],
  operador_id: null,
  criado_em: "2026-10-05T12:00:00Z",
};

describe("montarHtmlReciboComissao", () => {
  const html = montarHtmlReciboComissao({ nomeLoja: "Pneus <Amigão>", pagamento });

  it("todo texto do banco sai escapado — nome, loja e observação", () => {
    expect(html).not.toContain("<b>Mecânica</b>");
    expect(html).toContain("Ana &lt;b&gt;Mecânica&lt;/b&gt;");
    expect(html).toContain("Pneus &lt;Amigão&gt;");
    expect(html).toContain("&amp; &quot;adiantamento&quot;");
  });

  it("período, percentual e data em formato brasileiro", () => {
    expect(html).toContain("01/09/2026 a 30/09/2026");
    expect(html).toContain("7,5% sobre o lucro");
    expect(html).toContain("Data do pagamento: 05/10/2026");
  });

  it("lista as OS em ordem, e mostra calculado E pago quando são diferentes", () => {
    expect(html.indexOf("OS 7")).toBeLessThan(html.indexOf("OS 12"));
    expect(html).toMatch(/Calculado<\/td><td class="n">R\$\s123,45/);
    expect(html).toMatch(/Pago<\/td><td class="n">R\$\s120,00/);
  });

  it("valor pago igual ao calculado: uma linha só de total", () => {
    const igual = montarHtmlReciboComissao({ nomeLoja: "Loja", pagamento: { ...pagamento, valor_pago: 123.45 } });
    expect(igual).not.toMatch(/>Pago</);
  });
});

describe("escaparHtml", () => {
  it("escapa os cinco caracteres perigosos", () => {
    expect(escaparHtml(`<a href="x" onclick='y'>&</a>`)).toBe(
      "&lt;a href=&quot;x&quot; onclick=&#39;y&#39;&gt;&amp;&lt;/a&gt;",
    );
  });
});
