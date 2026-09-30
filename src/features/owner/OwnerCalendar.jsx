import { useState } from 'react'
import toast from 'react-hot-toast'
import { SportIcon } from '../../components/SportBadge'
import { money } from '../../lib/money'
import { buildSlots, formatHours, hourLabel, toDateKey } from '../../lib/slots'
import { useStore } from '../../store/context'
import DateStrip from '../booking/DateStrip'
import SlotGrid from '../booking/SlotGrid'

/** Day view for one venue: who booked what, and tap free/blocked slots to toggle maintenance blocks. */
export default function OwnerCalendar({ venues }) {
  const { bookings, users, actions } = useStore()
  const [venueId, setVenueId] = useState(venues[0]?.id)
  const [date, setDate] = useState(() => toDateKey(new Date()))

  const venue = venues.find((v) => v.id === venueId) ?? venues[0]
  if (!venue) return null

  const slots = buildSlots(venue, date, bookings)
  const dayBookings = bookings
    .filter((b) => b.venueId === venue.id && b.date === date && b.status === 'confirmed')
    .sort((a, b) => a.hours[0] - b.hours[0])

  const toggle = (hour) => {
    const wasBlocked = slots.find((s) => s.hour === hour)?.state === 'blocked'
    actions.toggleBlock(venue.id, date, hour)
    toast.success(`${hourLabel(hour)} ${wasBlocked ? 'reopened' : 'blocked'}`)
  }

  return (
    <section className="card p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-semibold">Schedule</h2>
        <select className="input w-auto" value={venue.id} onChange={(e) => setVenueId(e.target.value)}>
          {venues.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
      </div>
      <DateStrip value={date} onChange={setDate} days={14} />
      <p className="mt-4 mb-2 text-xs text-zinc-500">Tap an open slot to block it for maintenance. Tap again to reopen.</p>
      <SlotGrid slots={slots} mode="block" onToggle={toggle} />

      <h3 className="mt-6 mb-2 text-sm font-semibold">Bookings this day</h3>
      {dayBookings.length === 0 ? (
        <p className="text-sm text-zinc-500">No bookings yet.</p>
      ) : (
        <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {dayBookings.map((b) => {
            const player = users.find((u) => u.id === b.playerId)
            return (
              <li key={b.id} className="flex items-center gap-3 py-2 text-sm">
                <SportIcon sport={venue.sport} className="size-4 text-zinc-400" />
                <span className="w-32 font-medium">{formatHours(b.hours)}</span>
                <span className="flex-1 truncate text-zinc-600 dark:text-zinc-300">{player?.name ?? 'Unknown player'}</span>
                <span className="font-semibold">{money(b.total)}</span>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
