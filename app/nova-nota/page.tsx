'use client'

import { useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Alert, Button, Card, PageHeader, PageShell } from '@/components/ui'

type Etapa = 'idle' | 'enviando' | 'processando'

export default function NovaNotaPage() {
  const [etapa, setEtapa] = useState<Etapa>('idle')
  const [sucesso, setSucesso] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const enviando = etapa !== 'idle'

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    setPreview(file ? URL.createObjectURL(file) : null)
  }

  function limpar() {
    setPreview(null)
    formRef.current?.reset()
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSucesso(false)
    setErro(null)

    const form = e.currentTarget
    const fileInput = form.elements.namedItem('foto') as HTMLInputElement
    const file = fileInput.files?.[0]

    if (!file) {
      setErro('Selecione uma foto')
      return
    }

    setEtapa('enviando')

    const nomeArquivo = `${Date.now()}-${file.name}`
    const { error: uploadError } = await supabase.storage
      .from('notas-fiscais')
      .upload(nomeArquivo, file)

    if (uploadError) {
      setErro('Erro ao enviar foto: ' + uploadError.message)
      setEtapa('idle')
      return
    }

    const { data: urlData } = supabase.storage.from('notas-fiscais').getPublicUrl(nomeArquivo)

    setEtapa('processando')

    const resposta = await fetch('/api/processar-nota', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fotoUrl: urlData.publicUrl }),
    })
    const resultado = await resposta.json()

    setEtapa('idle')

    if (!resultado.ok) {
      setErro('Erro ao processar: ' + resultado.erro)
    } else {
      setSucesso(true)
      limpar()
    }
  }

  return (
    <PageShell>
      <PageHeader
        title="Entrada de Peças"
        subtitle="Tire uma foto da nota de peças — os dados são lidos automaticamente."
      />

      <Card>
        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label
            htmlFor="foto"
            className="relative flex aspect-[4/3] w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 text-center transition-colors hover:border-gold-400 hover:bg-gold-50/60"
          >
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Pré-visualização da nota" className="h-full w-full object-contain" />
            ) : (
              <>
                <span className="text-3xl">📷</span>
                <span className="text-sm font-medium text-zinc-600">
                  Toque para tirar ou escolher uma foto
                </span>
              </>
            )}
            <input
              id="foto"
              name="foto"
              type="file"
              accept="image/*"
              capture="environment"
              required
              disabled={enviando}
              onChange={handleFileChange}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          </label>

          <div className="flex items-center gap-3">
            <Button type="submit" loading={enviando} className="flex-1 sm:flex-none">
              {etapa === 'enviando' && 'Enviando foto...'}
              {etapa === 'processando' && 'Lendo dados com IA...'}
              {etapa === 'idle' && 'Enviar'}
            </Button>
            {preview && !enviando && (
              <Button type="button" variant="ghost" onClick={limpar}>
                Trocar foto
              </Button>
            )}
          </div>

          {sucesso && <Alert kind="success">Nota enviada e processada com sucesso!</Alert>}
          {erro && <Alert kind="error">{erro}</Alert>}
        </form>
      </Card>
    </PageShell>
  )
}
