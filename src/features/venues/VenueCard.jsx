import { Clock, MapPin, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SportCover, SportLabel } from '../../components/SportBadge'
import { money } from '../../lib/money'
import { hourLabel } from '../../lib/slots'
import AmenityChips from './AmenityChips'

export default function VenueCard({ venue, rating, freeToday }) {
  return (
    <Link
      to={`/venues/${venue.id}`}
      className="card group flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <SportCover sport={venue.sport} />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold group-hover:text-pitch-600 dark:group-hover:text-volt">{venue.name}</h3>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-zinc-500">
              <MapPin className="size-3" /> {venue.area}, {venue.city}
            </p>
          </div>
          {rating.avg && (
            <span className="flex items-center gap-0.5 rounded-lg bg-amber-50 px-1.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
              <Star className="size-3 fill-current" /> {rating.avg}
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SportLabel sport={venue.sport} />
          <span className="flex items-center gap-1 text-xs text-zinc-500">
            <Clock className="size-3" /> {hourLabel(venue.openFrom)} – {hourLabel(venue.openTo)}
          </span>
        </div>
        <AmenityChips amenities={venue.amenities} compact />
        <div className="mt-auto flex items-end justify-between pt-2">
          <p>
            <span className="text-lg font-bold">{money(venue.pricePerHour)}</span>
            <span className="text-xs text-zinc-500"> / hour</span>
          </p>
          <span className={`text-xs font-medium ${freeToday > 0 ? 'text-pitch-600 dark:text-volt' : 'text-zinc-400'}`}>
            {freeToday > 0 ? `${freeToday} slots free today` : 'Full today'}
          </span>
        </div>
      </div>
    </Link>
  )
}
