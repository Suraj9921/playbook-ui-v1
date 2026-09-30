import { format, isBefore, parseISO, startOfDay } from 'date-fns'

export const toDateKey = (d) => format(d, 'yyyy-MM-dd')

export const hourLabel = (h) => {
  const hh = h % 24
  const suffix = hh < 12 ? 'am' : 'pm'
  const twelve = hh % 12 === 0 ? 12 : hh % 12
  return `${twelve}${suffix}`
}

/** [18, 19, 21] -> "6pm–8pm, 9pm–10pm" */
export function formatHours(hours) {
  const sorted = [...hours].sort((a, b) => a - b)
  const ranges = []
  for (const h of sorted) {
    const last = ranges[ranges.length - 1]
    if (last && last[1] === h) last[1] = h + 1
    else ranges.push([h, h + 1])
  }
  return ranges.map(([from, to]) => `${hourLabel(from)}–${hourLabel(to)}`).join(', ')
}

export const bookedHours = (bookings, venueId, date) =>
  new Set(
    bookings
      .filter((b) => b.venueId === venueId && b.date === date && b.status === 'confirmed')
      .flatMap((b) => b.hours),
  )

export const blockedHours = (venue, date) =>
  new Set(venue.blocked.filter((b) => b.date === date).map((b) => b.hour))

/**
 * Hourly slots for a venue on a given date, each tagged with a state:
 * 'free' | 'booked' | 'blocked' | 'past'.
 */
export function buildSlots(venue, date, bookings, now = new Date()) {
  const booked = bookedHours(bookings, venue.id, date)
  const blocked = blockedHours(venue, date)
  const isToday = date === toDateKey(now)
  const slots = []
  for (let h = venue.openFrom; h < venue.openTo; h++) {
    let state = 'free'
    if (booked.has(h)) state = 'booked'
    else if (blocked.has(h)) state = 'blocked'
    else if (isToday && h <= now.getHours()) state = 'past'
    slots.push({ hour: h, state })
  }
  return slots
}

/** Hours from the request that are no longer free; empty means the booking can go through. */
export function findConflicts(venue, date, hours, bookings) {
  const booked = bookedHours(bookings, venue.id, date)
  const blocked = blockedHours(venue, date)
  return hours.filter((h) => booked.has(h) || blocked.has(h))
}

export const isPastBooking = (booking, now = new Date()) => {
  const end = parseISO(booking.date)
  end.setHours(Math.max(...booking.hours) + 1, 0, 0, 0)
  return isBefore(end, now)
}

export const isUpcomingDate = (date) => !isBefore(parseISO(date), startOfDay(new Date()))
