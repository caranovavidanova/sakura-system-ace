// Edge Function do Supabase — lê fotos ou PDFs de nota fiscal e devolve os
// produtos já estruturados (NCM, CFOP, CST/CSOSN, alíquota de ICMS, etc.)
// usando o Claude (Anthropic). Fica no Supabase de propósito: é o único
// lugar onde a chave da Anthropic (ANTHROPIC_API_KEY, configurada como
// "secret" do projeto) existe de verdade — o app Electron nunca vê essa
// chave, só chama esta função (autenticado, com o login normal do operador).
import Anthropic from "npm:@anthropic-ai/sdk";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MAX_ARQUIVOS = 10;

const ITEM_SCHEMA = {
  type: "object",
  properties: {
    descricao: { type: "string" },
    marca: { anyOf: [{ type: "string" }, { type: "null" }] },
    modelo: { anyOf: [{ type: "string" }, { type: "null" }] },
    codigo_barras: { anyOf: [{ type: "string" }, { type: "null" }] },
    ncm: { anyOf: [{ type: "string" }, { type: "null" }] },
    cest: { anyOf: [{ type: "string" }, { type: "null" }] },
    cfop_padrao: { anyOf: [{ type: "string" }, { type: "null" }] },
    origem: { anyOf: [{ type: "string" }, { type: "null" }] },
    cst_ou_csosn: { anyOf: [{ type: "string" }, { type: "null" }] },
    aliquota_icms: { anyOf: [{ type: "number" }, { type: "null" }] },
    unidade: { anyOf: [{ type: "string" }, { type: "null" }] },
    preco_custo: { anyOf: [{ type: "number" }, { type: "null" }] },
    quantidade: { anyOf: [{ type: "number" }, { type: "null" }] },
  },
  required: [
    "descricao",
    "marca",
    "modelo",
    "codigo_barras",
    "ncm",
    "cest",
    "cfop_padrao",
    "origem",
    "cst_ou_csosn",
    "aliquota_icms",
    "unidade",
    "preco_custo",
    "quantidade",
  ],
  additionalProperties: false,
};

const PROMPT = `Você vai receber uma ou mais fotos e/ou PDFs de notas fiscais de
peças/produtos automotivos (pode ser mais de uma nota na mesma leitura).
Extraia TODOS os itens/produtos listados em todos os arquivos, um por um,
preenchendo os campos:

- descricao: descrição do produto como está na nota
- marca, modelo: se identificáveis pela descrição ou fabricante da nota
- codigo_barras: código de barras/EAN do item, se aparecer
- ncm: código NCM do item
- cest: código CEST do item
- cfop_padrao: código CFOP da operação
- origem: código de 0 a 8 da tabela de origem da mercadoria (Convênio ICMS
  106/96) — "0" nacional, "1" estrangeira importação direta, etc.
- cst_ou_csosn: código de situação tributária (CST) ou CSOSN do item
- aliquota_icms: alíquota de ICMS em %, como número (ex: 18 para 18%)
- unidade: unidade de medida (ex: UN, PC, KG, CX) — use "UN" se não achar
- preco_custo: valor unitário de custo do item, como número
- quantidade: quantidade daquele item na nota, como número

Se um campo não estiver visível ou não se aplicar, use null — não invente
valor. Devolva todos os itens encontrados, mesmo que a nota tenha muitos.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      throw new Error(
        "ANTHROPIC_API_KEY não configurada nos secrets desta função do Supabase.",
      );
    }

    const { arquivos } = await req.json();
    if (!Array.isArray(arquivos) || arquivos.length === 0) {
      throw new Error("Envie ao menos um arquivo em 'arquivos'.");
    }
    if (arquivos.length > MAX_ARQUIVOS) {
      throw new Error(`Envie no máximo ${MAX_ARQUIVOS} arquivos por leitura.`);
    }

    const client = new Anthropic({ apiKey });

    const conteudoArquivos = arquivos.map(
      (arquivo: { base64: string; mediaType: string }) =>
        arquivo.mediaType === "application/pdf"
          ? {
              type: "document" as const,
              source: {
                type: "base64" as const,
                media_type: "application/pdf" as const,
                data: arquivo.base64,
              },
            }
          : {
              type: "image" as const,
              source: {
                type: "base64" as const,
                media_type: arquivo.mediaType,
                data: arquivo.base64,
              },
            },
    );

    const response = await client.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 8000,
      output_config: {
        effort: "medium",
        format: {
          type: "json_schema",
          schema: {
            type: "object",
            properties: { itens: { type: "array", items: ITEM_SCHEMA } },
            required: ["itens"],
            additionalProperties: false,
          },
        },
      },
      messages: [
        {
          role: "user",
          content: [...conteudoArquivos, { type: "text", text: PROMPT }],
        },
      ],
    });

    if (response.stop_reason === "refusal") {
      throw new Error(
        "O Claude não conseguiu ler esses arquivos (recusa de segurança). Tente fotos mais nítidas, um PDF de cada vez, ou um arquivo de cada vez.",
      );
    }

    const blocoTexto = response.content.find((b) => b.type === "text");
    if (!blocoTexto || blocoTexto.type !== "text") {
      throw new Error("Resposta da IA veio sem texto.");
    }
    const resultado = JSON.parse(blocoTexto.text);

    return new Response(JSON.stringify(resultado), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const mensagem = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: mensagem }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
