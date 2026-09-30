import { SportIcon } from '../../components/SportBadge'
import { money } from '../../lib/money'
import { SPORTS } from '../../seed/venues'

function Bars({ rows, format = (n) => n }) {
  const max = Math.max(1, ...rows.map((r) => r.value))
  return (
    <ul className="space-y-3">
      {rows.map((r) => (
        <li key={r.key}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5">{r.icon}{r.label}</span>
            <span className="font-semibold tabular-nums">{format(r.value)}</span>
          </div>
          <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div className="h-2 rounded-full bg-pitch-500" style={{ width: `${(r.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  )
}

export default function StatsBars({ venues, bookings }) {
  const confirmed = bookings.filter((b) => b.status === 'confirmed')
  const venueById = Object.fromEntries(venues.map((v) => [v.id, v]))

  const bySport = Object.keys(SPORTS)
    .map((sport) => ({
      key: sport,
      label: SPORTS[sport].label,
      icon: <SportIcon sport={sport} className="size-4 text-zinc-400" />,
      value: confirmed.filter((b) => venueById[b.venueId]?.sport === sport).reduce((n, b) => n + b.hours.length, 0),
    }))
    .sort((a, b) => b.value - a.value)

  const revenueByVenue = {}
  for (const b of confirmed) revenueByVenue[b.venueId] = (revenueByVenue[b.venueId] ?? 0) + b.total
  const topVenues = Object.entries(revenueByVenue)
    .filter(([id]) => venueById[id])
    .map(([id, value]) => ({ key: id, label: venueById[id].name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <section className="card p-5">
        <h3 className="mb-4 text-sm font-semibold">Hours booked by sport</h3>
        <Bars rows={bySport} format={(n) => `${n} h`} />
      </section>
      <section className="card p-5">
        <h3 className="mb-4 text-sm font-semibold">Top venues by revenue</h3>
        {topVenues.length ? <Bars rows={topVenues} format={money} /> : <p className="text-sm text-zinc-500">No bookings yet.</p>}
      </section>
    </div>
  )
}
