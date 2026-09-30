import { LoaderCircle } from 'lucide-react'

export function Spinner({ className = 'size-4' }) {
  return <LoaderCircle className={`animate-spin ${className}`} />
}

export function EmptyState({ icon: Icon, title, children }) {
  return (
    <div className="card flex flex-col items-center gap-2 px-6 py-12 text-center">
      {Icon && <Icon className="size-10 text-zinc-400" />}
      <h3 className="font-semibold">{title}</h3>
      <div className="max-w-sm text-sm text-zinc-500">{children}</div>
    </div>
  )
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function StatusPill({ status }) {
  const styles = {
    approved: 'bg-pitch-100 text-pitch-700 dark:bg-pitch-900/50 dark:text-volt',
    confirmed: 'bg-pitch-100 text-pitch-700 dark:bg-pitch-900/50 dark:text-volt',
    pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    cancelled: 'bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
    completed: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  }
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${styles[status] ?? styles.cancelled}`}>
      {status}
    </span>
  )
}
