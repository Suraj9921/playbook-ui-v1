import { priceBreakdown } from '../lib/money'
import { findConflicts, hourLabel, isPastBooking } from '../lib/slots'
import { ApiError, latency, newId } from './fakeApi'

export async function createBooking({ venues, bookings }, player, { venueId, date, hours, paymentMethod = 'upi' }) {
  await latency(500)
  const venue = venues.find((v) => v.id === venueId && v.status === 'approved')
  if (!venue) throw new ApiError('This venue is not accepting bookings.')
  if (!hours.length) throw new ApiError('Pick at least one slot.')
  const conflicts = findConflicts(venue, date, hours, bookings)
  if (conflicts.length) {
    throw new ApiError(`Someone just grabbed ${conflicts.map(hourLabel).join(', ')}. Pick another slot.`)
  }
  return {
    id: newId('b'),
    venueId,
    playerId: player.id,
    date,
    hours: [...hours].sort((a, b) => a - b),
    total: priceBreakdown(venue.pricePerHour, hours.length).total,
    paymentMethod,
    status: 'confirmed',
    rating: null,
    createdAt: new Date().toISOString(),
  }
}

export async function cancelBooking(bookings, bookingId, userId) {
  await latency()
  const booking = bookings.find((b) => b.id === bookingId)
  if (!booking || booking.playerId !== userId) throw new ApiError('Booking not found.')
  if (isPastBooking(booking)) throw new ApiError('Past bookings cannot be cancelled.')
  return bookingId
}

export async function rateBooking(bookings, bookingId, userId, rating) {
  await latency(150)
  const booking = bookings.find((b) => b.id === bookingId)
  if (!booking || booking.playerId !== userId) throw new ApiError('Booking not found.')
  if (!isPastBooking(booking)) throw new ApiError('You can rate a venue after you have played.')
  if (rating < 1 || rating > 5) throw new ApiError('Rating must be 1 to 5 stars.')
  return { bookingId, rating }
}
