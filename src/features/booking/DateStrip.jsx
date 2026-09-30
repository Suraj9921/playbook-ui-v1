import { addDays, format } from 'date-fns'
import { toDateKey } from '../../lib/slots'

export default function DateStrip({ value, onChange, days = 7 }) {
  const start = new Date()
  const dates = Array.from({ length: days }, (_, i) => addDays(start, i))

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {dates.map((d, i) => {
        const key = toDateKey(d)
        const active = key === value
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`flex w-16 shrink-0 flex-col items-center rounded-2xl border py-2 transition ${
              active
                ? 'border-pitch-600 bg-pitch-600 text-white'
                : 'border-zinc-200 hover:border-pitch-500 dark:border-zinc-700'
            }`}
          >
            <span className={`text-[11px] font-medium uppercase ${active ? 'text-pitch-100' : 'text-zinc-500'}`}>
              {i === 0 ? 'Today' : format(d, 'EEE')}
            </span>
            <span className="text-xl font-bold">{format(d, 'd')}</span>
            <span className={`text-[11px] ${active ? 'text-pitch-100' : 'text-zinc-500'}`}>{format(d, 'MMM')}</span>
          </button>
        )
      })}
    </div>
  )
}
