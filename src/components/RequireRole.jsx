import { Navigate, useLocation } from 'react-router-dom'
import { useStore } from '../store/context'

export default function RequireRole({ role, children }) {
  const { currentUser } = useStore()
  const location = useLocation()

  if (!currentUser) return <Navigate to="/signin" replace state={{ from: location.pathname }} />
  if (currentUser.role !== role) return <Navigate to="/" replace />
  return children
}
