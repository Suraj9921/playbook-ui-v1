import { Building2, CalendarDays, IndianRupee, Users } from 'lucide-react'
import { PageHeader } from '../components/ui'
import ApprovalQueue from '../features/admin/ApprovalQueue'
import StatsBars from '../features/admin/StatsBars'
import UserTable from '../features/admin/UserTable'
import StatCard from '../features/owner/StatCard'
import { money } from '../lib/money'
import { useStore } from '../store/context'

export default function AdminPanel() {
  const { venues, bookings, users } = useStore()
  const confirmed = bookings.filter((b) => b.status === 'confirmed')
  const pendingCount = venues.filter((v) => v.status === 'pending').length

  return (
    <>
      <PageHeader title="Admin" subtitle="Approve listings, keep an eye on the numbers, manage accounts." />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={IndianRupee} label="Gross bookings" value={money(confirmed.reduce((s, b) => s + b.total, 0))} />
        <StatCard icon={CalendarDays} label="Bookings" value={confirmed.length} hint={`${bookings.length - confirmed.length} cancelled`} />
        <StatCard icon={Building2} label="Live venues" value={venues.filter((v) => v.status === 'approved').length} hint={`${pendingCount} awaiting review`} />
        <StatCard icon={Users} label="Users" value={users.length} hint={`${users.filter((u) => u.suspended).length} suspended`} />
      </div>

      <section className="mt-8">
        <h2 className="mb-3 font-semibold">
          Approval queue {pendingCount > 0 && <span className="ml-1 rounded-full bg-amber-100 px-2 text-xs text-amber-800">{pendingCount}</span>}
        </h2>
        <ApprovalQueue />
      </section>

      <section className="mt-8">
        <h2 className="mb-3 font-semibold">Activity</h2>
        <StatsBars venues={venues} bookings={bookings} />
      </section>

      <section className="mt-8">
        <h2 className="mb-3 font-semibold">Users</h2>
        <UserTable />
      </section>
    </>
  )
}
