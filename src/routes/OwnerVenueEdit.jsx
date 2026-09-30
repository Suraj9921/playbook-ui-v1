import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader, StatusPill } from '../components/ui'
import VenueForm from '../features/owner/VenueForm'
import { BLANK_VENUE } from '../seed/venues'
import { useStore } from '../store/context'
import NotFound from './NotFound'

export default function OwnerVenueEdit() {
  const { venueId } = useParams()
  const { venues, currentUser, actions } = useStore()
  const navigate = useNavigate()

  const existing = venueId ? venues.find((v) => v.id === venueId && v.ownerId === currentUser.id) : null
  if (venueId && !existing) return <NotFound />

  const submit = async (form) => {
    const saved = await actions.saveVenue(form)
    toast.success(existing ? 'Venue updated' : 'Venue submitted for review')
    navigate(saved.status === 'approved' ? `/venues/${saved.id}` : '/owner')
  }

  return (
    <div className="max-w-3xl">
      <PageHeader
        title={existing ? `Edit ${existing.name}` : 'List a new venue'}
        subtitle={existing ? null : 'New venues go live after an admin approves them.'}
        action={existing && <StatusPill status={existing.status} />}
      />
      <VenueForm key={venueId ?? 'new'} initial={existing ?? BLANK_VENUE} onSubmit={submit} submitLabel={existing ? 'Save changes' : 'Submit for review'} />
    </div>
  )
}
