import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import AppShell from './components/AppShell'
import RequireRole from './components/RequireRole'
import AdminPanel from './routes/AdminPanel'
import Explore from './routes/Explore'
import MyBookings from './routes/MyBookings'
import NotFound from './routes/NotFound'
import OwnerDashboard from './routes/OwnerDashboard'
import OwnerVenueEdit from './routes/OwnerVenueEdit'
import SignIn from './routes/SignIn'
import SignUp from './routes/SignUp'
import VenuePage from './routes/VenuePage'
import AppStore from './store/AppStore'

function ResetScrollOnNavigate() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <AppStore>
      <BrowserRouter>
        <ResetScrollOnNavigate />
        <Toaster position="top-center" toastOptions={{ className: 'text-sm' }} />
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<Explore />} />
            <Route path="venues/:venueId" element={<VenuePage />} />
            <Route path="signin" element={<SignIn />} />
            <Route path="signup" element={<SignUp />} />

            <Route path="bookings" element={<RequireRole role="player"><MyBookings /></RequireRole>} />

            <Route path="owner" element={<RequireRole role="owner"><OwnerDashboard /></RequireRole>} />
            <Route path="owner/venues/new" element={<RequireRole role="owner"><OwnerVenueEdit /></RequireRole>} />
            <Route path="owner/venues/:venueId" element={<RequireRole role="owner"><OwnerVenueEdit /></RequireRole>} />

            <Route path="admin" element={<RequireRole role="admin"><AdminPanel /></RequireRole>} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppStore>
  )
}
