import Link from "next/link";
import { PageHeader, PageShell } from "@/components/ui";

const acoes = [
  {
    href: "/nova-ordem",
    icon: "📋",
    titulo: "Nova Ordem de Serviço",
  },
  {
    href: "/nova-nota",
    icon: "📷",
    titulo: "Enviar Nota Fiscal",
  },
  {
    href: "/revisao",
    icon: "✅",
    titulo: "Fila de Revisão",
  },
];

export default function Home() {
  return (
    <PageShell>
      <PageHeader title="Sistema da Borracharia" subtitle="Escolha o que você quer fazer." />

      <div className="flex flex-col gap-4">
        {acoes.map((acao) => (
          <Link
            key={acao.href}
            href={acao.href}
            className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white px-6 py-6 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-md active:translate-y-0 active:shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <span className="text-4xl">{acao.icon}</span>
            <span className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              {acao.titulo}
            </span>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
