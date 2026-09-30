import { useState } from 'react'
import toast from 'react-hot-toast'
import { useStore } from '../../store/context'

const ROLE_FILTERS = ['all', 'player', 'owner', 'admin']

export default function UserTable() {
  const { users, bookings, venues, currentUser, actions } = useStore()
  const [role, setRole] = useState('all')

  const rows = users.filter((u) => role === 'all' || u.role === role)

  const activity = (u) => {
    if (u.role === 'player') return `${bookings.filter((b) => b.playerId === u.id).length} bookings`
    if (u.role === 'owner') return `${venues.filter((v) => v.ownerId === u.id).length} venues`
    return '—'
  }

  const toggle = (u) => {
    actions.toggleSuspend(u.id)
    toast.success(`${u.name} ${u.suspended ? 'reinstated' : 'suspended'}`)
  }

  return (
    <div className="card overflow-hidden">
      <div className="flex gap-1 border-b border-zinc-200 p-2 dark:border-zinc-800">
        {ROLE_FILTERS.map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            className={`rounded-lg px-3 py-1 text-sm capitalize ${role === r ? 'bg-zinc-100 font-semibold dark:bg-zinc-800' : 'text-zinc-500'}`}
          >
            {r}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs tracking-wide text-zinc-500 uppercase">
            <tr>
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">Role</th>
              <th className="px-4 py-2 font-medium">City</th>
              <th className="px-4 py-2 font-medium">Activity</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {rows.map((u) => (
              <tr key={u.id} className={u.suspended ? 'opacity-50' : ''}>
                <td className="px-4 py-3">
                  <p className="font-medium">{u.name}</p>
                  <p className="text-xs text-zinc-500">{u.email}</p>
                </td>
                <td className="px-4 py-3 capitalize">{u.role}</td>
                <td className="px-4 py-3">{u.city}</td>
                <td className="px-4 py-3 text-zinc-500">{activity(u)}</td>
                <td className="px-4 py-3 text-right">
                  {u.id !== currentUser.id && (
                    <button onClick={() => toggle(u)} className={`text-xs font-semibold hover:underline ${u.suspended ? 'text-pitch-600' : 'text-red-600'}`}>
                      {u.suspended ? 'Reinstate' : 'Suspend'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
