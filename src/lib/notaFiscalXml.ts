import type { TipoNotaFiscal } from "@/types/notaFiscal";

// Sakura System — AutoCenter Edition
// Interpreta o XML de uma NFe/NFCe/NFS-e já enviado ao módulo "Notas
// Fiscais" pra montar uma versão visual (recibo em HTML) pra entregar ao
// cliente — além do XML "cru" que já era possível baixar. NÃO é uma cópia
// oficial do DANFE (sem código de barras/QR code da chave de acesso) — é só
// uma versão legível dos mesmos dados.
//
// NFe/NFCe seguem o layout nacional da SEFAZ, estável e bem documentado —
// interpretação confiável. NFS-e usa o modelo nacional (obrigatório desde
// jan/2026), mais recente — interpretação "melhor esforço": se os campos
// esperados não forem encontrados, `reconhecido` vem `false` e a tela deve
// avisar em vez de mostrar dados incompletos como se fossem corretos.

export interface ItemNotaFiscalVisual {
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

export interface PessoaNotaFiscalVisual {
  nome: string | null;
  documento: string | null;
  endereco: string | null;
}

export interface FormaPagamentoVisual {
  forma: string | null;
  valor: number;
}

export interface NotaFiscalVisual {
  reconhecido: boolean;
  tipo: TipoNotaFiscal;
  numero: string | null;
  serie: string | null;
  dataEmissao: string | null;
  chaveAcesso: string | null;
  protocolo: string | null;
  emitente: PessoaNotaFiscalVisual | null;
  destinatario: PessoaNotaFiscalVisual | null;
  itens: ItemNotaFiscalVisual[];
  total: number | null;
  formasPagamento: FormaPagamentoVisual[];
  // Só preenchido pra prefeituras (ex: Araraquara/Giap) cujo XML devolvido
  // pela Focus NFe não é o "corpo" da nota (sem itens/valores) — é só uma
  // confirmação de emissão, com um link pro documento oficial completo,
  // hospedado no próprio site da prefeitura. Ver interpretarConfirmacaoGiap().
  linkOficial: string | null;
}

const TPAG_LABEL: Record<string, string> = {
  "01": "Dinheiro",
  "02": "Cheque",
  "03": "Cartão de crédito",
  "04": "Cartão de débito",
  "05": "Crédito loja",
  "10": "Vale alimentação",
  "11": "Vale refeição",
  "15": "Boleto",
  "17": "PIX",
  "99": "Outros",
};

function texto(elemento: Element | undefined, tag: string): string | null {
  const valor = elemento?.getElementsByTagName(tag)[0]?.textContent?.trim();
  return valor ? valor : null;
}

function numero(elemento: Element | undefined, tag: string): number | null {
  const valor = texto(elemento, tag);
  if (valor === null) return null;
  const n = Number(valor);
  return Number.isNaN(n) ? null : n;
}

function el(elemento: Element | Document | undefined, tag: string): Element | undefined {
  return elemento?.getElementsByTagName(tag)[0];
}

function montarEndereco(ender: Element | undefined): string | null {
  if (!ender) return null;
  const partes = [
    [texto(ender, "xLgr"), texto(ender, "nro")].filter(Boolean).join(", "),
    texto(ender, "xBairro"),
    [texto(ender, "xMun"), texto(ender, "UF")].filter(Boolean).join("/"),
    texto(ender, "CEP"),
  ].filter(Boolean);
  return partes.length > 0 ? partes.join(" — ") : null;
}

function notaNaoReconhecida(tipo: TipoNotaFiscal): NotaFiscalVisual {
  return {
    reconhecido: false,
    tipo,
    numero: null,
    serie: null,
    dataEmissao: null,
    chaveAcesso: null,
    protocolo: null,
    emitente: null,
    destinatario: null,
    itens: [],
    total: null,
    formasPagamento: [],
    linkOficial: null,
  };
}

// Algumas prefeituras (Araraquara/Giap incluída) não emitem NFS-e no layout
// Nacional nem no ABRASF tradicional — a Focus NFe devolve, no lugar do
// "corpo" da nota, só uma confirmação de emissão (número da nota/RPS/lote,
// código de verificação e um link pro documento oficial completo, hospedado
// no próprio site da prefeitura). Sem itens nem valores nesse XML — não tem
// como montar uma tabela de itens de verdade, então o recibo mostra os dados
// de confirmação + esse link, em vez de uma tabela vazia.
function interpretarConfirmacaoGiap(doc: Document): NotaFiscalVisual | null {
  const notaFiscal = el(el(doc, "nfeResposta"), "notaFiscal");
  if (!notaFiscal) return null;

  const numeroNota = texto(notaFiscal, "numeroNota");
  if (!numeroNota) return null;

  const loteRps = texto(notaFiscal, "loteRps");
  const numeroRps = texto(notaFiscal, "numeroRps");
  const cnpjPrestador = texto(notaFiscal, "cnpjPrestador");

  return {
    reconhecido: true,
    tipo: "nfse",
    numero: numeroNota,
    serie: null,
    dataEmissao: texto(notaFiscal, "dataEmissaoNF") ?? texto(notaFiscal, "dataEmissaoRPS"),
    chaveAcesso: texto(notaFiscal, "codigoVerificacao"),
    protocolo:
      loteRps || numeroRps
        ? [loteRps ? `Lote ${loteRps}` : null, numeroRps ? `RPS ${numeroRps}` : null]
            .filter(Boolean)
            .join(" · ")
        : null,
    emitente: cnpjPrestador ? { nome: null, documento: cnpjPrestador, endereco: null } : null,
    destinatario: null,
    itens: [],
    total: null,
    formasPagamento: [],
    linkOficial: texto(notaFiscal, "link"),
  };
}

function interpretarNFe(doc: Document): NotaFiscalVisual {
  const infNFe = el(doc, "infNFe");
  if (!infNFe) return notaNaoReconhecida("nfe");

  const ide = el(infNFe, "ide");
  const emit = el(infNFe, "emit");
  const dest = el(infNFe, "dest");
  const icmsTot = el(infNFe, "ICMSTot");
  const protNFe = el(doc, "protNFe");

  const itens: ItemNotaFiscalVisual[] = Array.from(infNFe.getElementsByTagName("det")).map(
    (det) => {
      const prod = el(det, "prod");
      return {
        descricao: texto(prod, "xProd") ?? "Item",
        quantidade: numero(prod, "qCom") ?? 1,
        valorUnitario: numero(prod, "vUnCom") ?? 0,
        valorTotal: numero(prod, "vProd") ?? 0,
      };
    },
  );

  const formasPagamento: FormaPagamentoVisual[] = Array.from(
    infNFe.getElementsByTagName("detPag"),
  ).map((detPag) => {
    const codigo = texto(detPag, "tPag");
    return {
      forma: codigo ? (TPAG_LABEL[codigo] ?? `Código ${codigo}`) : null,
      valor: numero(detPag, "vPag") ?? 0,
    };
  });

  const idAttr = infNFe.getAttribute("Id");

  return {
    reconhecido: true,
    tipo: "nfe",
    numero: texto(ide, "nNF"),
    serie: texto(ide, "serie"),
    dataEmissao: texto(ide, "dhEmi"),
    chaveAcesso: texto(protNFe, "chNFe") ?? (idAttr ? idAttr.replace(/^NFe/, "") : null),
    protocolo: texto(protNFe, "nProt"),
    emitente: emit
      ? {
          nome: texto(emit, "xNome"),
          documento: texto(emit, "CNPJ") ?? texto(emit, "CPF"),
          endereco: montarEndereco(el(emit, "enderEmit")),
        }
      : null,
    destinatario: dest
      ? {
          nome: texto(dest, "xNome"),
          documento: texto(dest, "CNPJ") ?? texto(dest, "CPF"),
          endereco: montarEndereco(el(dest, "enderDest")),
        }
      : null,
    itens,
    total: numero(icmsTot, "vNF"),
    formasPagamento,
    linkOficial: null,
  };
}

function interpretarNFSe(doc: Document): NotaFiscalVisual {
  const confirmacaoGiap = interpretarConfirmacaoGiap(doc);
  if (confirmacaoGiap) return confirmacaoGiap;

  const infNFSe = el(doc, "infNFSe");
  const prest = el(infNFSe, "prest") ?? el(doc, "prest");
  const toma = el(infNFSe, "toma") ?? el(doc, "toma");
  const serv = el(infNFSe, "serv") ?? el(doc, "serv");
  const valores = el(infNFSe, "valores") ?? el(doc, "valores");

  const descricaoServico = texto(serv, "xDescServ") ?? texto(serv, "discrim");
  const valorServico =
    numero(valores, "vLiq") ?? numero(valores, "vServPrest") ?? numero(valores, "vServ");

  const reconhecido = Boolean(prest && (descricaoServico || valorServico !== null));
  if (!reconhecido) return notaNaoReconhecida("nfse");

  return {
    reconhecido: true,
    tipo: "nfse",
    numero: texto(infNFSe, "nNFSe"),
    serie: null,
    dataEmissao: texto(infNFSe, "dhProc") ?? texto(infNFSe, "dhEmi"),
    chaveAcesso: infNFSe?.getAttribute("Id") ?? null,
    protocolo: null,
    emitente: prest
      ? {
          nome: texto(prest, "xNome"),
          documento: texto(prest, "CNPJ") ?? texto(prest, "CPF"),
          endereco: montarEndereco(el(prest, "end")),
        }
      : null,
    destinatario: toma
      ? {
          nome: texto(toma, "xNome"),
          documento: texto(toma, "CNPJ") ?? texto(toma, "CPF"),
          endereco: montarEndereco(el(toma, "end")),
        }
      : null,
    itens: [
      {
        descricao: descricaoServico ?? "Serviço prestado",
        quantidade: 1,
        valorUnitario: valorServico ?? 0,
        valorTotal: valorServico ?? 0,
      },
    ],
    total: valorServico,
    formasPagamento: [],
    linkOficial: null,
  };
}

export function interpretarXmlNotaFiscal(
  xmlTexto: string,
  tipo: TipoNotaFiscal,
): NotaFiscalVisual {
  try {
    const doc = new DOMParser().parseFromString(xmlTexto, "text/xml");
    if (doc.getElementsByTagName("parsererror").length > 0) {
      return notaNaoReconhecida(tipo);
    }
    return tipo === "nfe" ? interpretarNFe(doc) : interpretarNFSe(doc);
  } catch (err) {
    console.error("Erro ao interpretar XML da nota fiscal:", err);
    return notaNaoReconhecida(tipo);
  }
}

function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarData(iso: string | null): string {
  if (!iso) return "—";
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return iso;
  return data.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function linhaPessoa(titulo: string, pessoa: PessoaNotaFiscalVisual | null): string {
  if (!pessoa || (!pessoa.nome && !pessoa.documento)) return "";
  return `
    <div class="bloco">
      <p class="rotulo">${titulo}</p>
      <p class="valor">${pessoa.nome ?? "—"}</p>
      ${pessoa.documento ? `<p class="detalhe">${pessoa.documento}</p>` : ""}
      ${pessoa.endereco ? `<p class="detalhe">${pessoa.endereco}</p>` : ""}
    </div>
  `;
}

export function montarHtmlVisualNotaFiscal(dados: NotaFiscalVisual): string {
  const titulo = dados.tipo === "nfe" ? "NFC-e / NFe" : "NFS-e";

  const linhasItens = dados.itens
    .map(
      (item) => `
        <tr>
          <td>${item.descricao}</td>
          <td class="numero">${item.quantidade}</td>
          <td class="numero">${formatarMoeda(item.valorUnitario)}</td>
          <td class="numero">${formatarMoeda(item.valorTotal)}</td>
        </tr>
      `,
    )
    .join("");

  const linhasPagamento =
    dados.formasPagamento.length > 0
      ? `
        <div class="bloco">
          <p class="rotulo">Forma de pagamento</p>
          ${dados.formasPagamento
            .map((fp) => `<p class="valor">${fp.forma ?? "—"}: ${formatarMoeda(fp.valor)}</p>`)
            .join("")}
        </div>
      `
      : "";

  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<title>${titulo} — recibo</title>
<style>
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, "Segoe UI", Arial, sans-serif;
    color: #3a2a3f;
    max-width: 640px;
    margin: 24px auto;
    padding: 0 16px;
  }
  h1 { font-size: 18px; margin: 0 0 4px; }
  .aviso {
    font-size: 11px;
    color: #8a6b60;
    background: #fdf3e7;
    border-radius: 8px;
    padding: 8px 12px;
    margin-bottom: 16px;
  }
  .cabecalho { border-bottom: 2px solid #B38DAC; padding-bottom: 12px; margin-bottom: 16px; }
  .grid { display: flex; flex-wrap: wrap; gap: 16px; margin-bottom: 16px; }
  .bloco { flex: 1 1 240px; }
  .rotulo { font-size: 11px; color: #8a7a8a; margin: 0 0 2px; text-transform: uppercase; }
  .valor { font-size: 14px; margin: 0; font-weight: 600; }
  .detalhe { font-size: 12px; margin: 2px 0 0; color: #6a5a6a; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 13px; }
  th, td { text-align: left; padding: 6px 8px; border-bottom: 1px solid #e5dde5; }
  th { color: #8a7a8a; font-weight: 600; font-size: 11px; text-transform: uppercase; }
  td.numero, th.numero { text-align: right; }
  .total { text-align: right; font-size: 16px; font-weight: 700; margin-bottom: 16px; }
  .chave { font-family: monospace; font-size: 12px; word-break: break-all; color: #6a5a6a; }
  @media print {
    body { margin: 0; }
  }
</style>
</head>
<body>
  <div class="cabecalho">
    <h1>${titulo}</h1>
    <p style="margin:0;font-size:12px;color:#6a5a6a;">
      Nº ${dados.numero ?? "—"}${dados.serie ? ` · Série ${dados.serie}` : ""} · ${formatarData(dados.dataEmissao)}
    </p>
  </div>

  <p class="aviso">
    Este é um recibo gerado a partir do XML da nota, pra entregar ao cliente — não é uma cópia
    do DANFE oficial (sem código de barras/QR code). O documento fiscal válido é o XML original.
  </p>

  <div class="grid">
    ${linhaPessoa("Emitente", dados.emitente)}
    ${linhaPessoa("Cliente", dados.destinatario)}
  </div>

  ${
    dados.linkOficial
      ? `
    <div class="aviso" style="background:#eaf7ee;color:#1f6b3d;">
      Esta prefeitura confirma a emissão, mas não inclui os itens/valores no arquivo da nota — o
      documento oficial completo fica hospedado no site dela:<br />
      <a href="${dados.linkOficial}" target="_blank" rel="noopener" style="color:#1f6b3d;font-weight:600;">Ver documento oficial completo</a>
    </div>
  `
      : `
    <table>
      <thead>
        <tr>
          <th>Descrição</th>
          <th class="numero">Qtde.</th>
          <th class="numero">Valor unit.</th>
          <th class="numero">Valor total</th>
        </tr>
      </thead>
      <tbody>
        ${linhasItens}
      </tbody>
    </table>

    <p class="total">Total: ${dados.total !== null ? formatarMoeda(dados.total) : "—"}</p>
  `
  }

  ${linhasPagamento}

  ${
    dados.chaveAcesso
      ? `<div class="bloco"><p class="rotulo">Chave de acesso</p><p class="chave">${dados.chaveAcesso}</p></div>`
      : ""
  }
  ${dados.protocolo ? `<p class="detalhe">Protocolo de autorização: ${dados.protocolo}</p>` : ""}
</body>
</html>`;
}
