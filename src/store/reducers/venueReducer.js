export function venueReducer(venues, action) {
  switch (action.type) {
    case 'venues/saved': {
      const exists = venues.some((v) => v.id === action.venue.id)
      return exists ? venues.map((v) => (v.id === action.venue.id ? action.venue : v)) : [...venues, action.venue]
    }
    case 'venues/deleted':
      return venues.filter((v) => v.id !== action.venueId)
    case 'venues/statusChanged':
      return venues.map((v) => (v.id === action.venueId ? { ...v, status: action.status } : v))
    case 'venues/blockToggled':
      return venues.map((v) => {
        if (v.id !== action.venueId) return v
        const { date, hour } = action
        const isBlocked = v.blocked.some((b) => b.date === date && b.hour === hour)
        const blocked = isBlocked
          ? v.blocked.filter((b) => !(b.date === date && b.hour === hour))
          : [...v.blocked, { date, hour }]
        return { ...v, blocked }
      })
    default:
      return venues
  }
}
