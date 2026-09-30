import { CalendarDays, Compass, LayoutDashboard, LogIn, LogOut, Moon, Plus, RotateCcw, ShieldCheck, Sun } from 'lucide-react'
import toast from 'react-hot-toast'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useTheme } from '../lib/theme'
import { useStore } from '../store/context'

function navFor(role) {
  const items = [{ to: '/', label: 'Explore', icon: Compass, end: true }]
  if (role === 'player') items.push({ to: '/bookings', label: 'My bookings', icon: CalendarDays })
  if (role === 'owner') {
    items.push({ to: '/owner', label: 'Dashboard', icon: LayoutDashboard, end: true })
    items.push({ to: '/owner/venues/new', label: 'Add venue', icon: Plus })
  }
  if (role === 'admin') items.push({ to: '/admin', label: 'Admin', icon: ShieldCheck })
  return items
}

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 font-extrabold tracking-tight">
      <img src="/favicon.svg" alt="" className="size-8" />
      <span className="text-lg">
        Play<span className="text-pitch-600 dark:text-volt">Book</span>
      </span>
    </Link>
  )
}

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-pitch-600 text-white'
      : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
  }`

export default function AppShell() {
  const { currentUser, actions } = useStore()
  const [theme, toggleTheme] = useTheme()
  const navigate = useNavigate()
  const items = navFor(currentUser?.role)

  const signOut = () => {
    // Leave the page first so a role-guarded route doesn't bounce us to /signin.
    navigate('/')
    actions.signOut()
    toast.success('Signed out')
  }

  const resetDemo = () => {
    if (!window.confirm('Reset all demo data? Bookings and venues you created will be lost.')) return
    actions.resetDemo()
    toast.success('Demo data restored')
    navigate('/')
  }

  const ThemeIcon = theme === 'dark' ? Sun : Moon
  const themeLabel = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'

  return (
    <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-zinc-200 bg-white p-4 md:flex dark:border-zinc-800 dark:bg-zinc-900">
        <Logo />
        <nav className="mt-8 flex flex-col gap-1">
          {items.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClass}>
              <Icon className="size-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-3">
          <div className="flex gap-1">
            <button onClick={toggleTheme} className="btn-ghost flex-1" title={themeLabel} aria-label={themeLabel}>
              <ThemeIcon className="size-4" />
            </button>
            <button onClick={resetDemo} className="btn-ghost flex-1" title="Reset demo data" aria-label="Reset demo data">
              <RotateCcw className="size-4" />
            </button>
          </div>
          {currentUser ? (
            <div className="rounded-xl bg-zinc-100 p-3 dark:bg-zinc-800">
              <p className="truncate text-sm font-semibold">{currentUser.name}</p>
              <p className="text-xs capitalize text-zinc-500">{currentUser.role}</p>
              <button onClick={signOut} className="mt-2 flex items-center gap-1 text-xs font-medium text-red-600 hover:underline">
                <LogOut className="size-3" /> Sign out
              </button>
            </div>
          ) : (
            <Link to="/signin" className="btn-primary w-full">
              <LogIn className="size-4" /> Sign in
            </Link>
          )}
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-zinc-200 bg-white/90 px-4 py-3 backdrop-blur md:hidden dark:border-zinc-800 dark:bg-zinc-900/90">
        <Logo />
        <div className="flex items-center gap-1">
          <button onClick={toggleTheme} className="btn-ghost px-2" title={themeLabel} aria-label={themeLabel}>
            <ThemeIcon className="size-4" />
          </button>
          {currentUser ? (
            <button onClick={signOut} className="btn-ghost px-2" aria-label="Sign out">
              <LogOut className="size-4" />
            </button>
          ) : (
            <Link to="/signin" className="btn-primary px-3 py-1.5">
              Sign in
            </Link>
          )}
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pt-6 pb-24 md:px-8 md:pb-10">
        <Outlet />
      </main>

      {/* Mobile bottom tabs */}
      <nav className="fixed inset-x-0 bottom-0 z-20 flex justify-around border-t border-zinc-200 bg-white py-2 md:hidden dark:border-zinc-800 dark:bg-zinc-900">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 text-[11px] font-medium ${
                isActive ? 'text-pitch-600 dark:text-volt' : 'text-zinc-500'
              }`
            }
          >
            <Icon className="size-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
