'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Alert, Button, Card, Field, Input, PageHeader, PageShell, Textarea } from '@/components/ui'

export default function NovaOrdemPage() {
  const [enviando, setEnviando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setEnviando(true)
    setSucesso(false)
    setErro(null)

    const form = e.currentTarget
    const dados = {
      nome_cliente: (form.elements.namedItem('nome_cliente') as HTMLInputElement).value,
      telefone_cliente: (form.elements.namedItem('telefone_cliente') as HTMLInputElement).value,
      carro_modelo: (form.elements.namedItem('carro_modelo') as HTMLInputElement).value,
      carro_placa: (form.elements.namedItem('carro_placa') as HTMLInputElement).value,
      servico_descricao: (form.elements.namedItem('servico_descricao') as HTMLTextAreaElement).value,
    }

    const { error } = await supabase.from('ordens_servico').insert(dados)

    setEnviando(false)

    if (error) {
      setErro(error.message)
    } else {
      setSucesso(true)
      form.reset()
    }
  }

  return (
    <PageShell>
      <PageHeader
        title="Nova Ordem de Serviço"
        subtitle="Preencha os dados do cliente e do serviço para enviar para casa."
      />

      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="Nome do cliente" required>
            <Input name="nome_cliente" required placeholder="Ex: João da Silva" />
          </Field>

          <Field label="Telefone do cliente">
            <Input name="telefone_cliente" type="tel" placeholder="(00) 00000-0000" />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Modelo do carro">
              <Input name="carro_modelo" placeholder="Ex: Gol 1.6" />
            </Field>

            <Field label="Placa">
              <Input
                name="carro_placa"
                placeholder="ABC1D23"
                className="uppercase"
                maxLength={7}
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value.toUpperCase()
                }}
              />
            </Field>
          </div>

          <Field label="Descrição do serviço">
            <Textarea name="servico_descricao" rows={4} placeholder="O que precisa ser feito no veículo" />
          </Field>

          <div className="mt-2 flex items-center gap-3">
            <Button type="submit" loading={enviando}>
              {enviando ? 'Enviando...' : 'Enviar ordem'}
            </Button>
          </div>

          {sucesso && <Alert kind="success">Ordem enviada com sucesso!</Alert>}
          {erro && <Alert kind="error">Erro ao enviar: {erro}</Alert>}
        </form>
      </Card>
    </PageShell>
  )
}
