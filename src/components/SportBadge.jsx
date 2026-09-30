import { CircleDot, Dumbbell, Target, Trophy, Volleyball } from 'lucide-react'
import { SPORTS } from '../seed/venues'

const ICONS = { football: Trophy, badminton: Volleyball, cricket: Target, tennis: CircleDot, pickleball: Dumbbell }

export function SportIcon({ sport, className = 'size-5' }) {
  const Icon = ICONS[sport] ?? Trophy
  return <Icon className={className} />
}

/** Gradient tile standing in for a venue photo. */
export function SportCover({ sport, className = 'h-32' }) {
  const gradient = SPORTS[sport]?.gradient ?? 'from-zinc-500 to-zinc-300'
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} ${className}`}>
      <div className="absolute inset-0 opacity-20 [background-image:repeating-linear-gradient(90deg,#fff_0_2px,transparent_2px_48px)]" />
      <SportIcon sport={sport} className="absolute right-4 bottom-3 size-14 text-white/80" />
    </div>
  )
}

export function SportLabel({ sport }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-pitch-50 px-2 py-0.5 text-xs font-medium text-pitch-700 dark:bg-pitch-900/40 dark:text-volt">
      <SportIcon sport={sport} className="size-3.5" />
      {SPORTS[sport]?.label ?? sport}
    </span>
  )
}
