import { toDateKey } from '../lib/slots'
import { ApiError, latency, newId } from './fakeApi'

export async function saveVenue(venues, owner, draft) {
  await latency()
  if (!draft.name?.trim()) throw new ApiError('Give the venue a name.')
  if (!(draft.pricePerHour > 0)) throw new ApiError('Price per hour must be more than zero.')
  if (!(draft.openTo > draft.openFrom)) throw new ApiError('Closing time must be after opening time.')

  if (draft.id) {
    const existing = venues.find((v) => v.id === draft.id)
    if (!existing || existing.ownerId !== owner.id) throw new ApiError('Venue not found.')
    // Rejected venues go back into review once the owner edits them.
    const status = existing.status === 'rejected' ? 'pending' : existing.status
    return { ...existing, ...draft, status }
  }
  return { ...draft, id: newId('v'), ownerId: owner.id, status: 'pending', blocked: [] }
}

export async function deleteVenue(venues, bookings, owner, venueId) {
  await latency()
  const venue = venues.find((v) => v.id === venueId)
  if (!venue || venue.ownerId !== owner.id) throw new ApiError('Venue not found.')
  const today = toDateKey(new Date())
  const hasUpcoming = bookings.some((b) => b.venueId === venueId && b.status === 'confirmed' && b.date >= today)
  if (hasUpcoming) throw new ApiError('This venue has upcoming bookings and cannot be removed.')
  return venueId
}
