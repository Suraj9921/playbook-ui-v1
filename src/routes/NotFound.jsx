import { Flag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../components/ui'

export default function NotFound() {
  return (
    <EmptyState icon={Flag} title="Out of bounds">
      That page doesn't exist or isn't available to you.
      <Link to="/" className="btn-primary mx-auto mt-4 w-fit">
        Back to venues
      </Link>
    </EmptyState>
  )
}
