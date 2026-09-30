import { addDays } from 'date-fns'
import { Building2, CalendarDays, IndianRupee, Pencil, Plus, Star, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { SportLabel } from '../components/SportBadge'
import { EmptyState, PageHeader, StatusPill } from '../components/ui'
import OwnerCalendar from '../features/owner/OwnerCalendar'
import StatCard from '../features/owner/StatCard'
import { money } from '../lib/money'
import { venueRating } from '../lib/ratings'
import { toDateKey } from '../lib/slots'
import { useStore } from '../store/context'

export default function OwnerDashboard() {
  const { venues, bookings, currentUser, actions } = useStore()
  const myVenues = venues.filter((v) => v.ownerId === currentUser.id)
  const myIds = new Set(myVenues.map((v) => v.id))
  const myBookings = bookings.filter((b) => myIds.has(b.venueId) && b.status === 'confirmed')

  const today = toDateKey(new Date())
  const weekEnd = toDateKey(addDays(new Date(), 7))
  const revenue = myBookings.reduce((sum, b) => sum + b.total, 0)
  const upcoming = myBookings.filter((b) => b.date >= today && b.date < weekEnd).length
  const rated = myBookings.filter((b) => b.rating)
  const avgRating = rated.length ? (rated.reduce((s, b) => s + b.rating, 0) / rated.length).toFixed(1) : '–'

  const remove = async (venue) => {
    if (!window.confirm(`Remove ${venue.name}? This cannot be undone.`)) return
    try {
      await actions.deleteVenue(venue.id)
      toast.success('Venue removed')
    } catch (err) {
      toast.error(err.message)
    }
  }

  const bookable = myVenues.filter((v) => v.status === 'approved')

  return (
    <>
      <PageHeader
        title={`Hi, ${currentUser.name.split(' ')[0]}`}
        subtitle="How your venues are doing."
        action={
          <Link to="/owner/venues/new" className="btn-primary">
            <Plus className="size-4" /> Add venue
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={IndianRupee} label="Revenue" value={money(revenue)} hint="All confirmed bookings" />
        <StatCard icon={CalendarDays} label="Next 7 days" value={upcoming} hint="Upcoming bookings" />
        <StatCard icon={Building2} label="Venues" value={myVenues.length} hint={`${bookable.length} live`} />
        <StatCard icon={Star} label="Avg rating" value={avgRating} hint={`${rated.length} reviews`} />
      </div>

      <section className="mt-8">
        <h2 className="mb-3 font-semibold">Your venues</h2>
        {myVenues.length === 0 ? (
          <EmptyState icon={Building2} title="No venues yet">
            List your first court and start taking bookings once an admin approves it.
          </EmptyState>
        ) : (
          <div className="card divide-y divide-zinc-200 dark:divide-zinc-800">
            {myVenues.map((v) => {
              const r = venueRating(bookings, v.id)
              return (
                <div key={v.id} className="flex flex-wrap items-center gap-3 p-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link to={`/venues/${v.id}`} className="font-semibold hover:text-pitch-600">
                        {v.name}
                      </Link>
                      <StatusPill status={v.status} />
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                      <SportLabel sport={v.sport} />
                      <span>{v.area}, {v.city}</span>
                      <span>· {money(v.pricePerHour)}/hr</span>
                      {r.avg && <span>· ★ {r.avg}</span>}
                    </div>
                  </div>
                  <Link to={`/owner/venues/${v.id}`} className="btn-ghost px-3" aria-label={`Edit ${v.name}`}>
                    <Pencil className="size-4" />
                  </Link>
                  <button onClick={() => remove(v)} className="btn-ghost px-3 text-red-600" aria-label={`Remove ${v.name}`}>
                    <Trash2 className="size-4" />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {bookable.length > 0 && (
        <div className="mt-8">
          <OwnerCalendar venues={bookable} />
        </div>
      )}
    </>
  )
}
