import { Ban, Check, Lock } from 'lucide-react'
import { hourLabel } from '../../lib/slots'

const STYLES = {
  free: 'border-zinc-200 bg-white hover:border-pitch-500 hover:bg-pitch-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-pitch-900/30',
  selected: 'border-pitch-600 bg-pitch-600 text-white',
  booked: 'border-transparent bg-zinc-200 text-zinc-400 line-through dark:bg-zinc-800 dark:text-zinc-600',
  blocked: 'border-dashed border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300',
  past: 'border-transparent bg-zinc-100 text-zinc-300 dark:bg-zinc-900 dark:text-zinc-700',
}

const TITLES = {
  blocked: 'Blocked for maintenance',
  booked: 'Already booked',
  past: 'This time has passed',
}

/**
 * mode="book": players pick free hours.
 * mode="block": owners toggle free <-> blocked; booked hours stay locked.
 */
export default function SlotGrid({ slots, selected = [], onToggle, mode = 'book' }) {
  const isClickable = (state) => (mode === 'book' ? state === 'free' : state === 'free' || state === 'blocked')

  return (
    <div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
        {slots.map(({ hour, state }) => {
          const isSelected = mode === 'book' && selected.includes(hour)
          const style = isSelected ? STYLES.selected : STYLES[state]
          return (
            <button
              key={hour}
              disabled={!isClickable(state)}
              onClick={() => onToggle(hour)}
              className={`flex items-center justify-center gap-1 rounded-xl border px-2 py-3 text-sm font-semibold transition disabled:cursor-not-allowed ${style}`}
              aria-pressed={isSelected}
              title={TITLES[state]}
            >
              {isSelected && <Check className="size-3.5" />}
              {state === 'blocked' && <Ban className="size-3.5" />}
              {state === 'booked' && mode === 'block' && <Lock className="size-3.5" />}
              {hourLabel(hour)}
            </button>
          )
        })}
      </div>
      <Legend mode={mode} />
    </div>
  )
}

function Legend({ mode }) {
  const items = [
    ['Available', STYLES.free],
    mode === 'book' && ['Your pick', STYLES.selected],
    ['Booked', STYLES.booked],
    ['Blocked', STYLES.blocked],
    ['Past', STYLES.past],
  ].filter(Boolean)
  return (
    <div className="mt-3 flex flex-wrap gap-4 text-xs text-zinc-500">
      {items.map(([label, style]) => (
        <span key={label} className="flex items-center gap-1.5">
          <span className={`size-3 rounded border ${style}`} />
          {label}
        </span>
      ))}
    </div>
  )
}
