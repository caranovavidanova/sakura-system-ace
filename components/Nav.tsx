'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/nova-ordem', label: 'Nova Ordem' },
  { href: '/nova-nota', label: 'Entrada de Peças' },
  { href: '/revisao', label: 'Revisão' },
]

export function Nav() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-10 border-b border-brand-800 bg-brand-950/95 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-gold-500 bg-white shadow-sm">
            <Image src="/logo.jpg" alt="Pneus Amigão" width={40} height={40} className="h-full w-full scale-125 object-cover" priority />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-sm font-bold tracking-wide text-gold-400">Amigão</span>
            <span className="hidden text-[10px] font-medium uppercase tracking-widest text-brand-300 sm:block">
              Sistema da Borracharia
            </span>
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {links.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-gold-500 text-brand-950'
                    : 'text-brand-200 hover:bg-brand-800 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
