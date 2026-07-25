import Link from "next/link";
import { Card, PageHeader, PageShell } from "@/components/ui";

const acoes = [
  {
    href: "/nova-ordem",
    icon: "📋",
    titulo: "Nova Ordem de Serviço",
    descricao: "Cadastre cliente, carro e o serviço a ser feito.",
  },
  {
    href: "/nova-nota",
    icon: "📷",
    titulo: "Nova Nota Fiscal",
    descricao: "Envie a foto da nota de peças pelo celular para leitura automática.",
  },
  {
    href: "/revisao",
    icon: "✅",
    titulo: "Fila de Revisão",
    descricao: "Confira e confirme as ordens e notas recebidas antes de lançar no sistema.",
  },
];

export default function Home() {
  return (
    <PageShell>
      <PageHeader
        title="Sistema da Borracharia"
        subtitle="Envie dados da loja e revise tudo antes de lançar no sistema."
      />

      <div className="grid gap-4 sm:grid-cols-1">
        {acoes.map((acao) => (
          <Link key={acao.href} href={acao.href} className="group block">
            <Card className="flex items-center gap-4 transition-all duration-150 group-hover:-translate-y-0.5 group-hover:border-amber-400 group-hover:shadow-md">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-xl dark:bg-amber-500/10">
                {acao.icon}
              </span>
              <div className="min-w-0">
                <h2 className="font-medium text-zinc-900 dark:text-zinc-50">{acao.titulo}</h2>
                <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{acao.descricao}</p>
              </div>
              <span className="ml-auto text-zinc-300 transition-transform group-hover:translate-x-0.5 group-hover:text-amber-500 dark:text-zinc-700">
                →
              </span>
            </Card>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
