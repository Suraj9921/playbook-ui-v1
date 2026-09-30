import { useEffect, useMemo, useReducer, useRef } from 'react'
import * as bookingApi from '../api/bookings'
import { latency } from '../api/fakeApi'
import * as userApi from '../api/users'
import * as venueApi from '../api/venues'
import { seedBookings } from '../seed/bookings'
import { seedUsers } from '../seed/users'
import { seedVenues } from '../seed/venues'
import { StoreContext } from './context'
import { authReducer } from './reducers/authReducer'
import { bookingReducer } from './reducers/bookingReducer'
import { venueReducer } from './reducers/venueReducer'

const STORAGE_KEY = 'playbook:v1'

const freshState = () => ({
  auth: { users: seedUsers, sessionId: null },
  venues: seedVenues,
  bookings: seedBookings(),
})

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : freshState()
  } catch {
    return freshState()
  }
}

function rootReducer(state, action) {
  if (action.type === 'store/reset') return freshState()
  if (action.type === 'store/hydrated') return action.state
  return {
    auth: authReducer(state.auth, action),
    venues: venueReducer(state.venues, action),
    bookings: bookingReducer(state.bookings, action),
  }
}

export default function AppStore({ children }) {
  const [state, dispatch] = useReducer(rootReducer, undefined, loadState)
  // Actions read the latest snapshot through a ref so they stay referentially stable.
  const stateRef = useRef(state)

  useEffect(() => {
    stateRef.current = state
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Storage full or blocked: the app keeps working in memory.
    }
  }, [state])

  // Keep other open tabs in sync, e.g. a slot booked in one tab shows as taken in another.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== STORAGE_KEY || !e.newValue) return
      const incoming = JSON.parse(e.newValue)
      dispatch({ type: 'store/hydrated', state: { ...incoming, auth: { ...incoming.auth, sessionId: stateRef.current.auth.sessionId } } })
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const actions = useMemo(() => {
    const snap = () => stateRef.current
    const me = () => snap().auth.users.find((u) => u.id === snap().auth.sessionId)

    return {
      async signIn(email, password) {
        const user = await userApi.authenticate(snap().auth.users, email, password)
        dispatch({ type: 'auth/signedIn', user })
        return user
      },
      async signUp(form) {
        const user = await userApi.register(snap().auth.users, form)
        dispatch({ type: 'auth/registered', user })
        return user
      },
      signOut() {
        dispatch({ type: 'auth/signedOut' })
      },
      async book(request) {
        const booking = await bookingApi.createBooking(snap(), me(), request)
        dispatch({ type: 'bookings/created', booking })
        return booking
      },
      async cancelBooking(bookingId) {
        await bookingApi.cancelBooking(snap().bookings, bookingId, me().id)
        dispatch({ type: 'bookings/cancelled', bookingId })
      },
      async rateBooking(bookingId, rating) {
        await bookingApi.rateBooking(snap().bookings, bookingId, me().id, rating)
        dispatch({ type: 'bookings/rated', bookingId, rating })
      },
      async saveVenue(draft) {
        const venue = await venueApi.saveVenue(snap().venues, me(), draft)
        dispatch({ type: 'venues/saved', venue })
        return venue
      },
      async deleteVenue(venueId) {
        await venueApi.deleteVenue(snap().venues, snap().bookings, me(), venueId)
        dispatch({ type: 'venues/deleted', venueId })
      },
      toggleBlock(venueId, date, hour) {
        dispatch({ type: 'venues/blockToggled', venueId, date, hour })
      },
      async setVenueStatus(venueId, status) {
        await latency(150)
        dispatch({ type: 'venues/statusChanged', venueId, status })
      },
      toggleSuspend(userId) {
        dispatch({ type: 'users/suspensionToggled', userId })
      },
      resetDemo() {
        dispatch({ type: 'store/reset' })
      },
    }
  }, [])

  const value = useMemo(() => {
    const currentUser = state.auth.users.find((u) => u.id === state.auth.sessionId) ?? null
    return { ...state, users: state.auth.users, currentUser, actions }
  }, [state, actions])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
