'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button, Card, Input, PageHeader, PageShell } from '@/components/ui'

type Ordem = {
  id: string
  nome_cliente: string
  telefone_cliente: string
  carro_modelo: string
  carro_placa: string
  servico_descricao: string
  status: string
}

type Item = {
  id: string
  nota_id: string
  descricao: string
  codigo_barras: string
  referencia: string
  marca: string
  modelo: string
  aplicacao: string
  ncm: string
  cest: string
  cfop: string
  origem: string
  cst: string
  unidade: string
  csosn: string
  preco_aquisicao: number
  custo_atual: number
  margem: number
  preco_final: number
  qtde_estoque: number
}

type Nota = {
  id: string
  foto_url: string
  fornecedor: string
  status: string
  itens: Item[]
}

type Dados = {
  aba: 'pendentes' | 'historico'
  ordens: Ordem[]
  notas: Nota[]
}

async function buscarDados(abaAlvo: 'pendentes' | 'historico'): Promise<Dados> {
  const statusFiltro = abaAlvo === 'pendentes' ? 'pendente' : 'confirmado'

  const [{ data: ordensData }, { data: notasData }] = await Promise.all([
    supabase
      .from('ordens_servico')
      .select('*')
      .eq('status', statusFiltro)
      .order('criado_em', { ascending: false }),
    supabase
      .from('notas_fiscais')
      .select('*, itens:itens_nota(*)')
      .eq('status', statusFiltro)
      .order('criado_em', { ascending: false }),
  ])

  return {
    aba: abaAlvo,
    ordens: (ordensData as Ordem[] | null) ?? [],
    notas: (notasData as unknown as Nota[] | null) ?? [],
  }
}

export default function RevisaoPage() {
  const [aba, setAba] = useState<'pendentes' | 'historico'>('pendentes')
  const [dados, setDados] = useState<Dados | null>(null)
  const [salvandoItem, setSalvandoItem] = useState<string | null>(null)
  const [salvoItem, setSalvoItem] = useState<string | null>(null)

  const carregando = dados?.aba !== aba
  const ordens = dados?.aba === aba ? dados.ordens : []
  const notas = dados?.aba === aba ? dados.notas : []

  useEffect(() => {
    let cancelado = false
    buscarDados(aba).then((resultado) => {
      if (!cancelado) setDados(resultado)
    })
    return () => {
      cancelado = true
    }
  }, [aba])

  async function recarregar() {
    setDados(await buscarDados(aba))
  }

  async function confirmarOrdem(id: string) {
    await supabase.from('ordens_servico').update({ status: 'confirmado' }).eq('id', id)
    recarregar()
  }

  async function confirmarNota(id: string) {
    await supabase.from('notas_fiscais').update({ status: 'confirmado' }).eq('id', id)
    recarregar()
  }

  function atualizarItem(itemId: string, campo: keyof Item, valor: string) {
    setDados((prev) =>
      prev && {
        ...prev,
        notas: prev.notas.map((nota) => ({
          ...nota,
          itens: nota.itens.map((item) =>
            item.id === itemId ? { ...item, [campo]: valor } : item
          ),
        })),
      }
    )
  }

  async function salvarItem(item: Item) {
    setSalvandoItem(item.id)
    setSalvoItem(null)
    await supabase
      .from('itens_nota')
      .update({
        descricao: item.descricao,
        codigo_barras: item.codigo_barras,
        referencia: item.referencia,
        marca: item.marca,
        modelo: item.modelo,
        aplicacao: item.aplicacao,
        ncm: item.ncm,
        cest: item.cest,
        cfop: item.cfop,
        origem: item.origem,
        cst: item.cst,
        unidade: item.unidade,
        csosn: item.csosn,
        preco_aquisicao: item.preco_aquisicao,
        custo_atual: item.custo_atual,
        margem: item.margem,
        preco_final: item.preco_final,
        qtde_estoque: item.qtde_estoque,
      })
      .eq('id', item.id)
    setSalvandoItem(null)
    setSalvoItem(item.id)
    setTimeout(() => setSalvoItem((atual) => (atual === item.id ? null : atual)), 2000)
  }

  return (
    <PageShell>
      <PageHeader title="Fila de Revisão" subtitle="Confira os dados recebidos antes de lançar no sistema." />

      <div className="mb-6 inline-flex rounded-full bg-zinc-100 p-1 dark:bg-zinc-900">
        {(['pendentes', 'historico'] as const).map((valor) => (
          <button
            key={valor}
            onClick={() => setAba(valor)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
              aba === valor
                ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-50'
                : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            {valor === 'pendentes' ? 'Pendentes' : 'Histórico'}
          </button>
        ))}
      </div>

      {carregando && (
        <div className="flex flex-col gap-3">
          {[0, 1].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-900" />
          ))}
        </div>
      )}

      {!carregando && (
        <div className="flex flex-col gap-8">
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
              Ordens de Serviço
            </h2>
            {ordens.length === 0 && <EmptyState texto="Nenhuma ordem por aqui." />}
            <div className="flex flex-col gap-3">
              {ordens.map((ordem) => (
                <Card key={ordem.id}>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">
                    {ordem.nome_cliente}
                    {ordem.telefone_cliente && (
                      <span className="font-normal text-zinc-500 dark:text-zinc-400"> — {ordem.telefone_cliente}</span>
                    )}
                  </p>
                  {(ordem.carro_modelo || ordem.carro_placa) && (
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {ordem.carro_modelo}
                      {ordem.carro_modelo && ordem.carro_placa && ' — '}
                      {ordem.carro_placa}
                    </p>
                  )}
                  {ordem.servico_descricao && (
                    <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">{ordem.servico_descricao}</p>
                  )}
                  {aba === 'pendentes' && (
                    <Button variant="secondary" className="mt-3" onClick={() => confirmarOrdem(ordem.id)}>
                      Confirmar
                    </Button>
                  )}
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
              Notas Fiscais
            </h2>
            {notas.length === 0 && <EmptyState texto="Nenhuma nota por aqui." />}
            <div className="flex flex-col gap-4">
              {notas.map((nota) => (
                <Card key={nota.id}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-zinc-900 dark:text-zinc-50">
                      {nota.fornecedor || 'Fornecedor não identificado'}
                    </p>
                    <a
                      href={nota.foto_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-sm font-medium text-amber-600 hover:underline dark:text-amber-500"
                    >
                      Ver foto ↗
                    </a>
                  </div>

                  <div className="mt-3 flex flex-col divide-y divide-zinc-100 dark:divide-zinc-800">
                    {nota.itens.map((item) => (
                      <div key={item.id} className="py-4 first:pt-0 last:pb-0">
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                          <Campo label="Descrição" valor={item.descricao} onChange={(v) => atualizarItem(item.id, 'descricao', v)} className="col-span-2" />
                          <Campo label="Referência" valor={item.referencia} onChange={(v) => atualizarItem(item.id, 'referencia', v)} />
                          <Campo label="Código de Barras" valor={item.codigo_barras} onChange={(v) => atualizarItem(item.id, 'codigo_barras', v)} />
                          <Campo label="Marca" valor={item.marca} onChange={(v) => atualizarItem(item.id, 'marca', v)} />
                          <Campo label="Modelo" valor={item.modelo} onChange={(v) => atualizarItem(item.id, 'modelo', v)} />
                          <Campo label="Aplicação" valor={item.aplicacao} onChange={(v) => atualizarItem(item.id, 'aplicacao', v)} />
                          <Campo label="NCM" valor={item.ncm} onChange={(v) => atualizarItem(item.id, 'ncm', v)} />
                          <Campo label="CEST" valor={item.cest} onChange={(v) => atualizarItem(item.id, 'cest', v)} />
                          <Campo label="CFOP" valor={item.cfop} onChange={(v) => atualizarItem(item.id, 'cfop', v)} />
                          <Campo label="Origem" valor={item.origem} onChange={(v) => atualizarItem(item.id, 'origem', v)} />
                          <Campo label="CST" valor={item.cst} onChange={(v) => atualizarItem(item.id, 'cst', v)} />
                          <Campo label="Unidade" valor={item.unidade} onChange={(v) => atualizarItem(item.id, 'unidade', v)} />
                          <Campo label="CSOSN" valor={item.csosn} onChange={(v) => atualizarItem(item.id, 'csosn', v)} />
                          <Campo label="Aquisição R$" valor={item.preco_aquisicao} onChange={(v) => atualizarItem(item.id, 'preco_aquisicao', v)} />
                          <Campo label="Custo Atual" valor={item.custo_atual} onChange={(v) => atualizarItem(item.id, 'custo_atual', v)} />
                          <Campo label="Qtde Estoque" valor={item.qtde_estoque} onChange={(v) => atualizarItem(item.id, 'qtde_estoque', v)} />
                        </div>
                        {aba === 'pendentes' && (
                          <div className="mt-3 flex items-center gap-3">
                            <Button
                              variant="secondary"
                              loading={salvandoItem === item.id}
                              onClick={() => salvarItem(item)}
                            >
                              Salvar alterações
                            </Button>
                            {salvoItem === item.id && (
                              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                ✓ Salvo
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {aba === 'pendentes' && (
                    <Button className="mt-4" onClick={() => confirmarNota(nota.id)}>
                      Confirmar nota inteira
                    </Button>
                  )}
                </Card>
              ))}
            </div>
          </section>
        </div>
      )}
    </PageShell>
  )
}

function EmptyState({ texto }: { texto: string }) {
  return (
    <p className="rounded-xl border border-dashed border-zinc-200 py-6 text-center text-sm text-zinc-400 dark:border-zinc-800">
      {texto}
    </p>
  )
}

function Campo({
  label,
  valor,
  onChange,
  className = '',
}: {
  label: string
  valor: string | number | null | undefined
  onChange: (v: string) => void
  className?: string
}) {
  return (
    <label className={`block text-xs ${className}`}>
      <span className="mb-1 block font-medium text-zinc-500 dark:text-zinc-400">{label}</span>
      <Input value={valor ?? ''} onChange={(e) => onChange(e.target.value)} className="py-1.5 text-sm" />
    </label>
  )
}
