export function venueRating(bookings, venueId) {
  const rated = bookings.filter((b) => b.venueId === venueId && b.rating)
  if (!rated.length) return { avg: null, count: 0 }
  const avg = rated.reduce((sum, b) => sum + b.rating, 0) / rated.length
  return { avg: Math.round(avg * 10) / 10, count: rated.length }
}
