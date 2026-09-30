import { format, parseISO } from 'date-fns'
import { CalendarDays, Clock, MapPin } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { SportIcon } from '../components/SportBadge'
import { EmptyState, PageHeader, StatusPill } from '../components/ui'
import StarRating from '../features/booking/StarRating'
import { money } from '../lib/money'
import { formatHours, isPastBooking } from '../lib/slots'
import { useStore } from '../store/context'

const TABS = ['upcoming', 'past', 'cancelled']

function bucketOf(booking) {
  if (booking.status === 'cancelled') return 'cancelled'
  return isPastBooking(booking) ? 'past' : 'upcoming'
}

export default function MyBookings() {
  const { bookings, venues, currentUser, actions } = useStore()
  const [tab, setTab] = useState('upcoming')

  const mine = bookings
    .filter((b) => b.playerId === currentUser.id)
    .map((b) => ({ ...b, bucket: bucketOf(b), venue: venues.find((v) => v.id === b.venueId) }))

  const counts = Object.fromEntries(TABS.map((t) => [t, mine.filter((b) => b.bucket === t).length]))
  const list = mine
    .filter((b) => b.bucket === tab)
    .sort((a, b) => {
      const key = (x) => `${x.date}-${String(x.hours[0]).padStart(2, '0')}`
      return tab === 'upcoming' ? key(a).localeCompare(key(b)) : key(b).localeCompare(key(a))
    })

  const cancel = async (id) => {
    if (!window.confirm('Cancel this booking? The slot will be released to other players.')) return
    try {
      await actions.cancelBooking(id)
      toast.success('Booking cancelled')
    } catch (err) {
      toast.error(err.message)
    }
  }

  const rate = async (id, stars) => {
    try {
      await actions.rateBooking(id, stars)
      toast.success('Thanks for rating!')
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <>
      <PageHeader title="My bookings" subtitle="Your games, past and upcoming." />

      <div className="mb-5 inline-flex rounded-xl bg-zinc-200/60 p-1 dark:bg-zinc-800">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition ${
              tab === t ? 'bg-white shadow-sm dark:bg-zinc-900' : 'text-zinc-500'
            }`}
          >
            {t} <span className="text-xs text-zinc-400">{counts[t]}</span>
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState icon={CalendarDays} title={`No ${tab} bookings`}>
          {tab === 'upcoming' ? (
            <>
              Nothing on the calendar.{' '}
              <Link to="/" className="font-medium text-pitch-600 hover:underline">
                Find a venue
              </Link>
            </>
          ) : (
            'They will show up here.'
          )}
        </EmptyState>
      ) : (
        <ul className="space-y-3">
          {list.map((b) => (
            <li key={b.id} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-pitch-100 text-pitch-700 dark:bg-pitch-900/50 dark:text-volt">
                <SportIcon sport={b.venue?.sport} className="size-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {b.venue ? (
                    <Link to={`/venues/${b.venue.id}`} className="font-semibold hover:text-pitch-600">
                      {b.venue.name}
                    </Link>
                  ) : (
                    <span className="font-semibold text-zinc-400">Venue removed</span>
                  )}
                  <StatusPill status={b.bucket === 'past' ? 'completed' : b.status} />
                </div>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-500">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="size-3.5" /> {format(parseISO(b.date), 'EEE, d MMM yyyy')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3.5" /> {formatHours(b.hours)}
                  </span>
                  {b.venue && (
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3.5" /> {b.venue.area}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-center">
                <span className="font-bold">{money(b.total)}</span>
                {b.bucket === 'upcoming' && (
                  <button onClick={() => cancel(b.id)} className="text-sm font-medium text-red-600 hover:underline">
                    Cancel
                  </button>
                )}
                {b.bucket === 'past' && (
                  <StarRating value={b.rating} readOnly={!!b.rating} onRate={(n) => rate(b.id, n)} />
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
