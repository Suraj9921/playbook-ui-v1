import { format, parseISO } from 'date-fns'
import { Banknote, QrCode, Wallet, X } from 'lucide-react'
import { useState } from 'react'
import { Spinner } from '../../components/ui'
import { money, priceBreakdown } from '../../lib/money'
import { formatHours } from '../../lib/slots'

const METHODS = [
  { id: 'upi', label: 'UPI', hint: 'Pay with any UPI app', icon: QrCode },
  { id: 'wallet', label: 'PlayBook wallet', hint: 'Demo balance: unlimited', icon: Wallet },
  { id: 'venue', label: 'Pay at venue', hint: 'Settle in cash before you play', icon: Banknote },
]

// Demo checkout: no payment details are collected, the booking is simply confirmed.
export default function CheckoutDialog({ venue, date, hours, onConfirm, onClose, busy }) {
  const [method, setMethod] = useState('upi')
  const { total } = priceBreakdown(venue.pricePerHour, hours.length)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4" onClick={busy ? undefined : onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        className="card w-full max-w-md rounded-b-none p-6 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 id="checkout-title" className="text-lg font-bold">Confirm & pay</h2>
            <p className="text-sm text-zinc-500">
              {venue.name} · {format(parseISO(date), 'EEE d MMM')} · {formatHours(hours)}
            </p>
          </div>
          <button onClick={onClose} disabled={busy} className="btn-ghost -mt-1 -mr-2 p-2" aria-label="Close">
            <X className="size-4" />
          </button>
        </div>

        <fieldset className="mt-5 space-y-2">
          <legend className="label">Payment method</legend>
          {METHODS.map(({ id, label, hint, icon: Icon }) => (
            <label
              key={id}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                method === id ? 'border-pitch-600 bg-pitch-50 dark:bg-pitch-900/30' : 'border-zinc-200 dark:border-zinc-700'
              }`}
            >
              <input type="radio" name="method" value={id} checked={method === id} onChange={() => setMethod(id)} className="accent-pitch-600" />
              <Icon className="size-5 text-pitch-600 dark:text-volt" />
              <span>
                <span className="block text-sm font-medium">{label}</span>
                <span className="block text-xs text-zinc-500">{hint}</span>
              </span>
            </label>
          ))}
        </fieldset>

        <button className="btn-primary mt-6 w-full py-3" onClick={() => onConfirm(method)} disabled={busy}>
          {busy ? <Spinner /> : null}
          {busy ? 'Booking…' : method === 'venue' ? `Reserve · ${money(total)} due at venue` : `Pay ${money(total)}`}
        </button>
        <p className="mt-2 text-center text-xs text-zinc-500">Free cancellation until your slot starts.</p>
      </div>
    </div>
  )
}
