import { SearchX } from 'lucide-react'
import { useMemo, useState } from 'react'
import { EmptyState } from '../components/ui'
import VenueCard from '../features/venues/VenueCard'
import VenueFilters from '../features/venues/VenueFilters'
import { venueRating } from '../lib/ratings'
import { buildSlots, toDateKey } from '../lib/slots'
import { useStore } from '../store/context'

const DEFAULT_FILTERS = { q: '', sport: 'all', city: 'all', maxPrice: 2000, sort: 'popular' }

export default function Explore() {
  const { venues, bookings, currentUser } = useStore()
  const [filters, setFilters] = useState(() => ({
    ...DEFAULT_FILTERS,
    city: currentUser?.role === 'player' ? currentUser.city : 'all',
  }))

  const rows = useMemo(() => {
    const today = toDateKey(new Date())
    const q = filters.q.trim().toLowerCase()
    const list = venues
      .filter((v) => v.status === 'approved')
      .filter((v) => filters.sport === 'all' || v.sport === filters.sport)
      .filter((v) => filters.city === 'all' || v.city === filters.city)
      .filter((v) => v.pricePerHour <= filters.maxPrice)
      .filter((v) => !q || `${v.name} ${v.area}`.toLowerCase().includes(q))
      .map((venue) => ({
        venue,
        rating: venueRating(bookings, venue.id),
        freeToday: buildSlots(venue, today, bookings).filter((s) => s.state === 'free').length,
        popularity: bookings.filter((b) => b.venueId === venue.id && b.status === 'confirmed').length,
      }))

    const sorters = {
      popular: (a, b) => b.popularity - a.popularity,
      rating: (a, b) => (b.rating.avg ?? 0) - (a.rating.avg ?? 0),
      priceLow: (a, b) => a.venue.pricePerHour - b.venue.pricePerHour,
      priceHigh: (a, b) => b.venue.pricePerHour - a.venue.pricePerHour,
    }
    return list.sort(sorters[filters.sort])
  }, [venues, bookings, filters])

  return (
    <>
      <section className="relative mb-8 overflow-hidden rounded-3xl bg-pitch-900 px-6 py-10 text-white md:px-10">
        <div className="absolute inset-0 opacity-10 [background-image:repeating-linear-gradient(90deg,#fff_0_2px,transparent_2px_64px)]" />
        <div className="relative max-w-xl">
          <p className="text-sm font-semibold tracking-widest text-volt uppercase">Game on</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">Find a court. Grab a slot. Play tonight.</h1>
          <p className="mt-3 text-pitch-100/80">
            Turfs, courts and nets near you with live availability. Book by the hour, no phone calls.
          </p>
        </div>
      </section>

      <VenueFilters filters={filters} onChange={setFilters} />

      <p className="mt-6 mb-3 text-sm text-zinc-500">
        {rows.length} venue{rows.length === 1 ? '' : 's'}
      </p>

      {rows.length ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((r) => (
            <VenueCard key={r.venue.id} venue={r.venue} rating={r.rating} freeToday={r.freeToday} />
          ))}
        </div>
      ) : (
        <EmptyState icon={SearchX} title="No venues match">
          Try another sport, widen the price range, or switch city.
          <button className="btn-ghost mx-auto mt-3" onClick={() => setFilters(DEFAULT_FILTERS)}>
            Clear filters
          </button>
        </EmptyState>
      )}
    </>
  )
}
