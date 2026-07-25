import { GoogleGenerativeAI } from '@google/generative-ai'
import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

const PROMPT = `
Você é um assistente que extrai dados de notas fiscais de peças automotivas para cadastro em sistema.

Analise a imagem da nota fiscal e retorne um JSON com esta estrutura exata, sem nenhum texto antes ou depois, só o JSON puro:

{
  "fornecedor": "nome do fornecedor/emitente da nota",
  "itens": [
    {
      "descricao": "descrição da peça",
      "codigo_barras": "ou null se não houver",
      "referencia": "código de referência da peça",
      "marca": "ou null se não souber",
      "modelo": "ou null se não souber",
      "aplicacao": "ou null se não souber",
      "ncm": "código NCM mais provável para esse tipo de peça",
      "cest": "código CEST mais provável",
      "cfop": "CFOP mais provável (geralmente 5405 ou 5102 para revenda)",
      "origem": "0 - NACIONAL (ou outro se identificar importado)",
      "cst": "código CST mais provável",
      "unidade": "unidade de medida (UN, KT, PC, etc)",
      "csosn": "código CSOSN mais provável (geralmente 500 para revenda com ICMS-ST)",
      "preco_aquisicao": valor numérico da nota,
      "custo_atual": valor numérico da nota,
      "margem": null,
      "preco_final": null,
      "qtde_estoque": quantidade numérica da nota
    }
  ]
}

Seja direto e sempre tente preencher NCM, CEST, CFOP, CST e CSOSN com o código mais provável baseado no tipo de peça, mesmo que a nota não traga essa informação explicitamente. Uma nota pode ter vários itens — retorne todos.
`

export async function POST(req: NextRequest) {
  try {
    const { fotoUrl } = await req.json()

    // Baixa a imagem e converte pra base64
    const imgResponse = await fetch(fotoUrl)
    const imgBuffer = await imgResponse.arrayBuffer()
    const base64 = Buffer.from(imgBuffer).toString('base64')

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' })

    const result = await model.generateContent([
      PROMPT,
      { inlineData: { mimeType: 'image/jpeg', data: base64 } },
    ])

    let texto = result.response.text().trim()
    // Remove blocos de markdown ```json ... ``` se vierem
    texto = texto.replace(/^```json\s*/i, '').replace(/```$/, '')

    const dados: { fornecedor: string; itens: Record<string, unknown>[] } = JSON.parse(texto)

    // Cria a nota
    const { data: nota, error: notaError } = await supabase
      .from('notas_fiscais')
      .insert({ foto_url: fotoUrl, fornecedor: dados.fornecedor })
      .select()
      .single()

    if (notaError) throw notaError

    // Cria os itens
    const itensParaInserir = dados.itens.map((item) => ({
      ...item,
      nota_id: nota.id,
    }))

    const { error: itensError } = await supabase
      .from('itens_nota')
      .insert(itensParaInserir)

    if (itensError) throw itensError

    return NextResponse.json({ ok: true, nota_id: nota.id })
  } catch (err) {
    console.error(err)
    const mensagem = err instanceof Error ? err.message : 'Erro desconhecido'
    return NextResponse.json({ ok: false, erro: mensagem }, { status: 500 })
  }
}