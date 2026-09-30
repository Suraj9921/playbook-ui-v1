export function bookingReducer(bookings, action) {
  switch (action.type) {
    case 'bookings/created':
      return [...bookings, action.booking]
    case 'bookings/cancelled':
      return bookings.map((b) => (b.id === action.bookingId ? { ...b, status: 'cancelled' } : b))
    case 'bookings/rated':
      return bookings.map((b) => (b.id === action.bookingId ? { ...b, rating: action.rating } : b))
    default:
      return bookings
  }
}
