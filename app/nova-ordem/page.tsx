'use client'

import { useId, useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Alert,
  Button,
  Card,
  Field,
  IconButton,
  Input,
  PageHeader,
  PageShell,
  Radio,
  Select,
  SectionTitle,
  Textarea,
} from '@/components/ui'

const MONTADORAS = [
  'Chevrolet',
  'Fiat',
  'Ford',
  'Volkswagen',
  'Toyota',
  'Honda',
  'Hyundai',
  'Renault',
  'Nissan',
  'Jeep',
  'Peugeot',
  'Citroën',
  'Mitsubishi',
  'Kia',
  'BMW',
  'Mercedes-Benz',
  'Audi',
]

type FormaPagamento = 'dinheiro' | 'pix' | 'debito' | 'credito'

type Pagamento = {
  id: string
  forma: FormaPagamento
  valor: string
  parcelas: number
}

function novoPagamento(): Pagamento {
  return { id: crypto.randomUUID(), forma: 'dinheiro', valor: '', parcelas: 1 }
}

function maskCpf(value: string) {
  return value
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

function maskCep(value: string) {
  return value
    .replace(/\D/g, '')
    .slice(0, 8)
    .replace(/(\d{5})(\d)/, '$1-$2')
}

export default function NovaOrdemPage() {
  const [cep, setCep] = useState('')
  const [endereco, setEndereco] = useState('')
  const [buscandoCep, setBuscandoCep] = useState(false)
  const [erroCep, setErroCep] = useState<string | null>(null)

  const [pagamentos, setPagamentos] = useState<Pagamento[]>([novoPagamento()])

  const [enviando, setEnviando] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const anoAtual = new Date().getFullYear()
  const totalPago = pagamentos.reduce((soma, p) => soma + (parseFloat(p.valor.replace(',', '.')) || 0), 0)

  async function buscarEndereco(cepDigits: string) {
    setBuscandoCep(true)
    setErroCep(null)
    try {
      const resposta = await fetch(`https://viacep.com.br/ws/${cepDigits}/json/`)
      const dados = await resposta.json()
      if (dados.erro) {
        setErroCep('CEP não encontrado')
      } else {
        const partes = [dados.logradouro, dados.bairro, `${dados.localidade}/${dados.uf}`].filter(Boolean)
        setEndereco(partes.join(' - '))
      }
    } catch {
      setErroCep('Erro ao buscar o CEP')
    } finally {
      setBuscandoCep(false)
    }
  }

  function handleCepChange(e: React.ChangeEvent<HTMLInputElement>) {
    const mascarado = maskCep(e.target.value)
    setCep(mascarado)
    setErroCep(null)
    const digitos = mascarado.replace(/\D/g, '')
    if (digitos.length === 8) {
      buscarEndereco(digitos)
    }
  }

  function addPagamento() {
    setPagamentos((atual) => [...atual, novoPagamento()])
  }

  function removePagamento(id: string) {
    setPagamentos((atual) => (atual.length > 1 ? atual.filter((p) => p.id !== id) : atual))
  }

  function updatePagamento(id: string, patch: Partial<Pagamento>) {
    setPagamentos((atual) => atual.map((p) => (p.id === id ? { ...p, ...patch } : p)))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setEnviando(true)
    setSucesso(false)
    setErro(null)

    const form = e.currentTarget
    const valor = (name: string) => (form.elements.namedItem(name) as HTMLInputElement | null)?.value ?? ''

    const dados = {
      nome_cliente: valor('nome_cliente'),
      cpf_cliente: valor('cpf_cliente'),
      telefone_cliente: valor('telefone_cliente'),
      cep_cliente: cep,
      endereco_cliente: endereco,
      numero_cliente: valor('numero_cliente'),
      montadora: valor('montadora'),
      carro_modelo: valor('carro_modelo'),
      ano_veiculo: valor('ano_veiculo'),
      carro_placa: valor('carro_placa'),
      quilometragem: valor('quilometragem'),
      pagamentos: pagamentos
        .filter((p) => parseFloat(p.valor.replace(',', '.')) > 0)
        .map((p) => ({
          forma: p.forma,
          valor: parseFloat(p.valor.replace(',', '.')) || 0,
          parcelas: p.forma === 'credito' ? p.parcelas : null,
        })),
      valor_total: totalPago,
      servico_descricao: valor('servico_descricao'),
    }

    const { error } = await supabase.from('ordens_servico').insert(dados)

    setEnviando(false)

    if (error) {
      setErro(error.message)
    } else {
      setSucesso(true)
      form.reset()
      setCep('')
      setEndereco('')
      setPagamentos([novoPagamento()])
    }
  }

  return (
    <PageShell>
      <PageHeader
        title="Nova Ordem de Serviço"
        subtitle="Preencha os dados do cliente e do serviço para enviar para casa."
      />

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <Card>
          <SectionTitle>Cliente</SectionTitle>
          <div className="flex flex-col gap-4">
            <Field label="Nome do cliente" required>
              <Input name="nome_cliente" required placeholder="Ex: João da Silva" />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="CPF do cliente">
                <Input
                  name="cpf_cliente"
                  placeholder="000.000.000-00"
                  inputMode="numeric"
                  onInput={(e) => {
                    e.currentTarget.value = maskCpf(e.currentTarget.value)
                  }}
                />
              </Field>

              <Field label="Telefone do cliente">
                <Input name="telefone_cliente" type="tel" placeholder="(00) 00000-0000" />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="CEP do cliente" hint={erroCep ?? undefined}>
                <div className="relative">
                  <Input
                    name="cep_cliente"
                    placeholder="00000-000"
                    inputMode="numeric"
                    value={cep}
                    onChange={handleCepChange}
                    onBlur={() => {
                      const digitos = cep.replace(/\D/g, '')
                      if (digitos.length === 8) buscarEndereco(digitos)
                    }}
                  />
                  {buscandoCep && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400">
                      buscando...
                    </span>
                  )}
                </div>
              </Field>

              <Field label="Número da casa">
                <Input name="numero_cliente" placeholder="Ex: 123" />
              </Field>
            </div>

            <Field label="Endereço" hint="Preenchido automaticamente a partir do CEP">
              <Input
                name="endereco_cliente"
                placeholder="Rua, bairro - cidade/UF"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
              />
            </Field>
          </div>
        </Card>

        <Card>
          <SectionTitle>Veículo do cliente</SectionTitle>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Montadora">
                <Input name="montadora" list="montadoras" placeholder="Ex: Volkswagen" />
                <datalist id="montadoras">
                  {MONTADORAS.map((m) => (
                    <option key={m} value={m} />
                  ))}
                </datalist>
              </Field>

              <Field label="Modelo">
                <Input name="carro_modelo" placeholder="Ex: Gol 1.6" />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Ano">
                <Input
                  name="ano_veiculo"
                  type="number"
                  inputMode="numeric"
                  min={1950}
                  max={anoAtual + 1}
                  placeholder={`Ex: ${anoAtual}`}
                />
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

              <Field label="Quilometragem">
                <Input name="quilometragem" type="number" inputMode="numeric" min={0} placeholder="Ex: 45000" />
              </Field>
            </div>
          </div>
        </Card>

        <Card>
          <SectionTitle>Forma de pagamento</SectionTitle>
          <div className="flex flex-col gap-4">
            {pagamentos.map((pagamento, index) => (
              <PagamentoRow
                key={pagamento.id}
                pagamento={pagamento}
                mostrarRemover={pagamentos.length > 1}
                onChange={(patch) => updatePagamento(pagamento.id, patch)}
                onRemove={() => removePagamento(pagamento.id)}
                indice={index}
              />
            ))}

            <div>
              <Button type="button" variant="secondary" onClick={addPagamento}>
                + Adicionar forma de pagamento
              </Button>
            </div>

            <div className="flex items-center justify-between border-t border-zinc-200 pt-4 text-sm dark:border-zinc-800">
              <span className="font-medium text-zinc-600 dark:text-zinc-400">Total pago</span>
              <span className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                {totalPago.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>
          </div>
        </Card>

        <Card>
          <SectionTitle>Descrição do serviço e produtos</SectionTitle>
          <Field label="Descrição do serviço e produtos">
            <Textarea
              name="servico_descricao"
              rows={4}
              placeholder="O que precisa ser feito no veículo e quais peças/produtos foram utilizados"
            />
          </Field>
        </Card>

        <div className="flex items-center gap-3">
          <Button type="submit" loading={enviando}>
            {enviando ? 'Enviando...' : 'Enviar ordem'}
          </Button>
        </div>

        {sucesso && <Alert kind="success">Ordem enviada com sucesso!</Alert>}
        {erro && <Alert kind="error">Erro ao enviar: {erro}</Alert>}
      </form>
    </PageShell>
  )
}

function PagamentoRow({
  pagamento,
  indice,
  mostrarRemover,
  onChange,
  onRemove,
}: {
  pagamento: Pagamento
  indice: number
  mostrarRemover: boolean
  onChange: (patch: Partial<Pagamento>) => void
  onRemove: () => void
}) {
  const groupName = useId()

  return (
    <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label={indice === 0 ? 'Valor pago' : `Valor pago (${indice + 1}ª forma)`}>
              <Input
                inputMode="decimal"
                placeholder="0,00"
                value={pagamento.valor}
                onChange={(e) => onChange({ valor: e.target.value.replace(/[^0-9.,]/g, '') })}
              />
            </Field>

            {pagamento.forma === 'credito' && (
              <Field label="Parcelas">
                <Select
                  value={pagamento.parcelas}
                  onChange={(e) => onChange({ parcelas: Number(e.target.value) })}
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n}x
                    </option>
                  ))}
                </Select>
              </Field>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            <Radio
              name={`forma-${groupName}`}
              label="Dinheiro"
              checked={pagamento.forma === 'dinheiro'}
              onChange={() => onChange({ forma: 'dinheiro' })}
            />
            <Radio
              name={`forma-${groupName}`}
              label="Pix"
              checked={pagamento.forma === 'pix'}
              onChange={() => onChange({ forma: 'pix' })}
            />
            <Radio
              name={`forma-${groupName}`}
              label="Cartão de débito"
              checked={pagamento.forma === 'debito'}
              onChange={() => onChange({ forma: 'debito' })}
            />
            <Radio
              name={`forma-${groupName}`}
              label="Cartão de crédito"
              checked={pagamento.forma === 'credito'}
              onChange={() => onChange({ forma: 'credito' })}
            />
          </div>
        </div>

        {mostrarRemover && (
          <IconButton aria-label="Remover forma de pagamento" onClick={onRemove} />
        )}
      </div>
    </div>
  )
}
