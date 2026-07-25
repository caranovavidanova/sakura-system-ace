import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 sm:py-12">{children}</div>
  )
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold tracking-tight text-gold-400 sm:text-3xl">{title}</h1>
      {subtitle && <p className="mt-1.5 text-sm text-brand-200">{subtitle}</p>}
    </div>
  )
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-zinc-200 bg-white p-5 shadow-md shadow-brand-950/20 ${className}`}
    >
      {children}
    </div>
  )
}

export function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string
  hint?: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-zinc-700">
        {label}
        {required && <span className="ml-0.5 text-gold-600">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-zinc-400">{hint}</span>}
    </label>
  )
}

const inputBase =
  'block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-[15px] text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-400'

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className = '', ...rest } = props
  return <input className={`${inputBase} ${className}`} {...rest} />
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = '', ...rest } = props
  return <textarea className={`${inputBase} resize-y ${className}`} {...rest} />
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  const { className = '', ...rest } = props
  return <select className={`${inputBase} ${className}`} {...rest} />
}

export function Label(props: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label {...props} />
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-4 border-l-4 border-gold-500 pl-3 text-base font-bold text-brand-900">
      {children}
    </h2>
  )
}

export function Radio({
  label,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-zinc-700">
      <input type="radio" className="h-4 w-4 accent-gold-500" {...rest} />
      {label}
    </label>
  )
}

export function IconButton({
  className = '',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 ${className}`}
      {...rest}
    >
      ×
    </button>
  )
}

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-gold-500 text-brand-950 hover:bg-gold-400 disabled:hover:bg-gold-500',
  secondary: 'bg-brand-50 text-brand-900 hover:bg-brand-100 disabled:hover:bg-brand-50',
  ghost: 'bg-transparent text-brand-600 hover:bg-brand-50 disabled:hover:bg-transparent',
}

export function Button({
  variant = 'primary',
  loading,
  className = '',
  children,
  disabled,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; loading?: boolean }) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60 ${buttonVariants[variant]} ${className}`}
      {...rest}
    >
      {loading && <Spinner />}
      {children}
    </button>
  )
}

export function Spinner({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`h-4 w-4 animate-spin ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
      />
    </svg>
  )
}

export function Alert({ kind, children }: { kind: 'success' | 'error'; children: ReactNode }) {
  const styles =
    kind === 'success'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
      : 'border-red-200 bg-red-50 text-red-800'
  return (
    <div className={`animate-in flex items-start gap-2 rounded-lg border px-4 py-3 text-sm ${styles}`}>
      <span aria-hidden="true">{kind === 'success' ? '✓' : '⚠'}</span>
      <span>{children}</span>
    </div>
  )
}
