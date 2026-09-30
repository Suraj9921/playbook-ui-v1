import { Check, Inbox, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { SportLabel } from '../../components/SportBadge'
import { EmptyState } from '../../components/ui'
import { money } from '../../lib/money'
import { hourLabel } from '../../lib/slots'
import { useStore } from '../../store/context'

export default function ApprovalQueue() {
  const { venues, users, actions } = useStore()
  const pending = venues.filter((v) => v.status === 'pending')

  const decide = async (venue, status) => {
    await actions.setVenueStatus(venue.id, status)
    toast.success(`${venue.name} ${status}`)
  }

  if (!pending.length) {
    return (
      <EmptyState icon={Inbox} title="Queue is clear">
        New venue listings will appear here for review.
      </EmptyState>
    )
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {pending.map((v) => {
        const owner = users.find((u) => u.id === v.ownerId)
        return (
          <article key={v.id} className="card p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <Link to={`/venues/${v.id}`} className="font-semibold hover:text-pitch-600">{v.name}</Link>
                <p className="text-xs text-zinc-500">
                  by {owner?.name ?? 'unknown'} · {v.area}, {v.city}
                </p>
              </div>
              <SportLabel sport={v.sport} />
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-300">{v.description || 'No description.'}</p>
            <p className="mt-2 text-xs text-zinc-500">
              {money(v.pricePerHour)}/hr · {hourLabel(v.openFrom)}–{hourLabel(v.openTo)} · {v.amenities.length} amenities
            </p>
            <div className="mt-4 flex gap-2">
              <button className="btn-primary flex-1" onClick={() => decide(v, 'approved')}>
                <Check className="size-4" /> Approve
              </button>
              <button className="btn-ghost flex-1 border border-zinc-200 text-red-600 dark:border-zinc-700" onClick={() => decide(v, 'rejected')}>
                <X className="size-4" /> Reject
              </button>
            </div>
          </article>
        )
      })}
    </div>
  )
}
