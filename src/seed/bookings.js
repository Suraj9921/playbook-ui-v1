import { addDays, format } from 'date-fns'

const day = (offset) => format(addDays(new Date(), offset), 'yyyy-MM-dd')

// A handful of bookings relative to today so the grid and history aren't empty on first run.
export const seedBookings = () =>
  [
    { id: 'b1', venueId: 'v1', playerId: 'u-player2', date: day(0), hours: [19, 20], total: 3600, status: 'confirmed', rating: null },
    { id: 'b2', venueId: 'v1', playerId: 'u-player2', date: day(1), hours: [18], total: 1800, status: 'confirmed', rating: null },
    { id: 'b3', venueId: 'v2', playerId: 'u-player1', date: day(-3), hours: [7, 8], total: 900, status: 'confirmed', rating: null },
    { id: 'b4', venueId: 'v3', playerId: 'u-player1', date: day(-8), hours: [17], total: 900, status: 'confirmed', rating: 4 },
    { id: 'b5', venueId: 'v1', playerId: 'u-player1', date: day(2), hours: [21], total: 1800, status: 'confirmed', rating: null },
    { id: 'b6', venueId: 'v6', playerId: 'u-player2', date: day(-2), hours: [20], total: 1400, status: 'confirmed', rating: 5 },
    { id: 'b7', venueId: 'v9', playerId: 'u-player1', date: day(-5), hours: [22, 23], total: 3200, status: 'cancelled', rating: null },
  ].map((b) => ({ ...b, createdAt: new Date().toISOString() }))
