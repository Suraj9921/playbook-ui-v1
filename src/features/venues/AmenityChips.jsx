import { Car, Coffee, Droplets, Lightbulb, Shirt, ShowerHead, Wrench } from 'lucide-react'

const ICONS = {
  Parking: Car,
  Floodlights: Lightbulb,
  Showers: ShowerHead,
  'Drinking water': Droplets,
  Cafe: Coffee,
  'Changing room': Shirt,
  'Equipment rental': Wrench,
}

export default function AmenityChips({ amenities, compact = false }) {
  const list = compact ? amenities.slice(0, 3) : amenities
  const extra = amenities.length - list.length
  return (
    <ul className="flex flex-wrap gap-1.5">
      {list.map((a) => {
        const Icon = ICONS[a] ?? Wrench
        return (
          <li key={a} className="inline-flex items-center gap-1 rounded-lg bg-zinc-100 px-2 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            <Icon className="size-3.5" />
            {a}
          </li>
        )
      })}
      {extra > 0 && <li className="px-1 py-1 text-xs text-zinc-500">+{extra} more</li>}
    </ul>
  )
}
