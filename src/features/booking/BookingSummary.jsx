import { format, parseISO } from 'date-fns'
import { money, priceBreakdown } from '../../lib/money'
import { formatHours } from '../../lib/slots'

export default function BookingSummary({ venue, date, hours, onCheckout, busy, disabledReason }) {
  const { subtotal, fee, total } = priceBreakdown(venue.pricePerHour, hours.length)

  return (
    <div className="card sticky top-20 p-5">
      <h2 className="font-semibold">Your booking</h2>
      <dl className="mt-4 space-y-2 text-sm">
        <Row label="Date" value={format(parseISO(date), 'EEE, d MMM')} />
        <Row label="Time" value={hours.length ? formatHours(hours) : 'Pick a slot'} />
        <Row label={`${hours.length} hr × ${money(venue.pricePerHour)}`} value={money(subtotal)} />
        <Row label="Convenience fee (2%)" value={money(fee)} />
      </dl>
      <div className="mt-4 flex items-baseline justify-between border-t border-zinc-200 pt-4 dark:border-zinc-800">
        <span className="text-sm text-zinc-500">Total</span>
        <span className="text-2xl font-bold">{money(total)}</span>
      </div>
      <button className="btn-primary mt-4 w-full py-3" onClick={onCheckout} disabled={!hours.length || busy || !!disabledReason}>
        {disabledReason ?? 'Continue to pay'}
      </button>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-zinc-500">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  )
}
