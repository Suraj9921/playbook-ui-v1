import { Building2, User } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Spinner } from '../components/ui'
import { CITIES } from '../seed/venues'
import { useStore } from '../store/context'

const ROLES = [
  { id: 'player', title: 'I want to play', hint: 'Find and book courts', icon: User },
  { id: 'owner', title: 'I run a venue', hint: 'List courts and take bookings', icon: Building2 },
]

export default function SignUp() {
  const { currentUser, actions } = useStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'player', city: CITIES[0] })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (currentUser) {
    return <Navigate to={currentUser.role === 'owner' ? '/owner' : (location.state?.from ?? '/')} replace />
  }

  const set = (patch) => setForm((f) => ({ ...f, ...patch }))

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const user = await actions.signUp(form)
      toast.success('Account created')
      navigate(user.role === 'owner' ? '/owner' : (location.state?.from ?? '/'), { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-md py-8">
      <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>

      <form onSubmit={submit} className="card mt-6 space-y-4 p-5">
        <div className="grid grid-cols-2 gap-2">
          {ROLES.map(({ id, title, hint, icon: Icon }) => (
            <button
              type="button"
              key={id}
              onClick={() => set({ role: id })}
              className={`rounded-xl border p-3 text-left transition ${
                form.role === id ? 'border-pitch-600 bg-pitch-50 dark:bg-pitch-900/30' : 'border-zinc-200 dark:border-zinc-700'
              }`}
            >
              <Icon className="size-5 text-pitch-600 dark:text-volt" />
              <span className="mt-2 block text-sm font-semibold">{title}</span>
              <span className="block text-xs text-zinc-500">{hint}</span>
            </button>
          ))}
        </div>
        <div>
          <label className="label" htmlFor="name">{form.role === 'owner' ? 'Business name' : 'Full name'}</label>
          <input id="name" required className="input" value={form.name} onChange={(e) => set({ name: e.target.value })} />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" required className="input" value={form.email} onChange={(e) => set({ email: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input id="password" type="password" required minLength={6} className="input" value={form.password} onChange={(e) => set({ password: e.target.value })} />
          </div>
          <div>
            <label className="label" htmlFor="city">City</label>
            <select id="city" className="input" value={form.city} onChange={(e) => set({ city: e.target.value })}>
              {CITIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">{error}</p>}
        <button className="btn-primary w-full" disabled={busy}>
          {busy && <Spinner />} Create account
        </button>
        <p className="text-center text-sm text-zinc-500">
          Already have one?{' '}
          <Link to="/signin" className="font-medium text-pitch-600 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  )
}
