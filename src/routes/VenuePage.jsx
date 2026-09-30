import { ArrowLeft, Clock, MapPin, Star } from 'lucide-react'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { SportCover, SportLabel } from '../components/SportBadge'
import { StatusPill } from '../components/ui'
import BookingSummary from '../features/booking/BookingSummary'
import CheckoutDialog from '../features/booking/CheckoutDialog'
import DateStrip from '../features/booking/DateStrip'
import SlotGrid from '../features/booking/SlotGrid'
import AmenityChips from '../features/venues/AmenityChips'
import { venueRating } from '../lib/ratings'
import { buildSlots, hourLabel, toDateKey } from '../lib/slots'
import { useStore } from '../store/context'
import NotFound from './NotFound'

export default function VenuePage() {
  const { venueId } = useParams()
  const { venues, bookings, users, currentUser, actions } = useStore()
  const navigate = useNavigate()
  const venue = venues.find((v) => v.id === venueId)

  const [date, setDate] = useState(() => toDateKey(new Date()))
  const [picked, setPicked] = useState([])
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [busy, setBusy] = useState(false)

  const slots = useMemo(() => (venue ? buildSlots(venue, date, bookings) : []), [venue, date, bookings])

  // Only the owner and admins can see a venue before it is approved.
  const canView = venue && (venue.status === 'approved' || currentUser?.role === 'admin' || currentUser?.id === venue.ownerId)
  if (!canView) return <NotFound />

  const rating = venueRating(bookings, venue.id)
  const owner = users.find((u) => u.id === venue.ownerId)
  // Drop picks that became unavailable (e.g. booked from another tab).
  const hours = picked.filter((h) => slots.some((s) => s.hour === h && s.state === 'free'))

  let disabledReason = null
  if (venue.status !== 'approved') disabledReason = 'Not open for bookings yet'
  else if (currentUser && currentUser.role !== 'player') disabledReason = 'Only player accounts can book'

  const toggle = (hour) => setPicked((prev) => (prev.includes(hour) ? prev.filter((h) => h !== hour) : [...prev, hour]))

  const changeDate = (d) => {
    setDate(d)
    setPicked([])
  }

  const startCheckout = () => {
    if (!currentUser) {
      toast('Sign in to finish your booking')
      navigate('/signin', { state: { from: `/venues/${venue.id}` } })
      return
    }
    setCheckoutOpen(true)
  }

  const confirm = async (paymentMethod) => {
    setBusy(true)
    try {
      await actions.book({ venueId: venue.id, date, hours, paymentMethod })
      toast.success("You're booked! See you on the field.")
      navigate('/bookings')
    } catch (err) {
      toast.error(err.message)
      setPicked([])
      setCheckoutOpen(false)
    } finally {
      setBusy(false)
    }
  }

  const freeCount = slots.filter((s) => s.state === 'free').length

  return (
    <>
      <Link to="/" className="mb-4 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-pitch-600">
        <ArrowLeft className="size-4" /> All venues
      </Link>

      <div className="card overflow-hidden">
        <SportCover sport={venue.sport} className="h-40 md:h-52" />
        <div className="p-5 md:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <SportLabel sport={venue.sport} />
            {venue.status !== 'approved' && <StatusPill status={venue.status} />}
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">{venue.name}</h1>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-500">
            <span className="flex items-center gap-1">
              <MapPin className="size-4" /> {venue.area}, {venue.city}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-4" /> {hourLabel(venue.openFrom)} – {hourLabel(venue.openTo)}
            </span>
            <span className="flex items-center gap-1">
              <Star className="size-4 fill-amber-400 text-amber-400" />
              {rating.avg ? `${rating.avg} (${rating.count} rating${rating.count > 1 ? 's' : ''})` : 'No ratings yet'}
            </span>
          </div>
          <p className="mt-4 max-w-2xl text-zinc-600 dark:text-zinc-300">{venue.description}</p>
          <div className="mt-4">
            <AmenityChips amenities={venue.amenities} />
          </div>
          {owner && <p className="mt-4 text-xs text-zinc-500">Managed by {owner.name}</p>}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="card p-5">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="font-semibold">Pick a date & time</h2>
            <span className="text-xs text-zinc-500">{freeCount} free slots</span>
          </div>
          <DateStrip value={date} onChange={changeDate} />
          <div className="mt-5">
            <SlotGrid slots={slots} selected={hours} onToggle={toggle} />
          </div>
        </section>

        <aside>
          <BookingSummary
            venue={venue}
            date={date}
            hours={hours}
            onCheckout={startCheckout}
            busy={busy}
            disabledReason={disabledReason}
          />
        </aside>
      </div>

      {checkoutOpen && (
        <CheckoutDialog
          venue={venue}
          date={date}
          hours={hours}
          busy={busy}
          onConfirm={confirm}
          onClose={() => setCheckoutOpen(false)}
        />
      )}
    </>
  )
}
