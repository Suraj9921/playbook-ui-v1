import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Spinner } from '../components/ui'
import { useStore } from '../store/context'

const HOME_FOR_ROLE = { player: '/', owner: '/owner', admin: '/admin' }

const DEMO_ACCOUNTS = [
  { role: 'Player', email: 'player@playbook.dev', password: 'player123' },
  { role: 'Owner', email: 'owner@playbook.dev', password: 'owner123' },
  { role: 'Admin', email: 'admin@playbook.dev', password: 'admin123' },
]

export default function SignIn() {
  const { currentUser, actions } = useStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (currentUser) return <Navigate to={location.state?.from ?? HOME_FOR_ROLE[currentUser.role]} replace />

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const user = await actions.signIn(form.email, form.password)
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`)
      navigate(location.state?.from ?? HOME_FOR_ROLE[user.role], { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm py-8">
      <h1 className="text-2xl font-bold tracking-tight">Sign in</h1>
      <p className="mt-1 text-sm text-zinc-500">Book courts, manage venues, or run the show.</p>

      <form onSubmit={submit} className="card mt-6 space-y-4 p-5">
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" required className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input id="password" type="password" required className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">{error}</p>}
        <button className="btn-primary w-full" disabled={busy}>
          {busy && <Spinner />} Sign in
        </button>
        <p className="text-center text-sm text-zinc-500">
          New here?{' '}
          <Link to="/signup" state={location.state} className="font-medium text-pitch-600 hover:underline">
            Create an account
          </Link>
        </p>
      </form>

      <div className="mt-6 rounded-2xl border border-dashed border-zinc-300 p-4 dark:border-zinc-700">
        <p className="label">Demo accounts</p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {DEMO_ACCOUNTS.map((a) => (
            <button
              key={a.role}
              type="button"
              className="btn-ghost border border-zinc-200 dark:border-zinc-700"
              onClick={() => setForm({ email: a.email, password: a.password })}
            >
              {a.role}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
