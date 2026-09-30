import { useState } from 'react'
import { Spinner } from '../../components/ui'
import { hourLabel } from '../../lib/slots'
import { AMENITIES, CITIES, SPORTS } from '../../seed/venues'

const HOURS = Array.from({ length: 25 }, (_, h) => h)

export default function VenueForm({ initial, onSubmit, submitLabel }) {
  const [form, setForm] = useState(initial)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const set = (patch) => setForm((f) => ({ ...f, ...patch }))

  const toggleAmenity = (a) =>
    set({ amenities: form.amenities.includes(a) ? form.amenities.filter((x) => x !== a) : [...form.amenities, a] })

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await onSubmit(form)
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="card space-y-5 p-5 md:p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="label" htmlFor="vname">Venue name</label>
          <input id="vname" required className="input" value={form.name} onChange={(e) => set({ name: e.target.value })} />
        </div>
        <div>
          <label className="label" htmlFor="sport">Sport</label>
          <select id="sport" className="input" value={form.sport} onChange={(e) => set({ sport: e.target.value })}>
            {Object.entries(SPORTS).map(([id, s]) => (
              <option key={id} value={id}>{s.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="price">Price per hour (₹)</label>
          <input id="price" type="number" min={100} step={50} required className="input" value={form.pricePerHour} onChange={(e) => set({ pricePerHour: Number(e.target.value) })} />
        </div>
        <div>
          <label className="label" htmlFor="city">City</label>
          <select id="city" className="input" value={form.city} onChange={(e) => set({ city: e.target.value })}>
            {CITIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="area">Area / neighbourhood</label>
          <input id="area" required className="input" value={form.area} onChange={(e) => set({ area: e.target.value })} />
        </div>
        <div>
          <label className="label" htmlFor="from">Opens at</label>
          <select id="from" className="input" value={form.openFrom} onChange={(e) => set({ openFrom: Number(e.target.value) })}>
            {HOURS.slice(0, 24).map((h) => (
              <option key={h} value={h}>{hourLabel(h)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="to">Closes at</label>
          <select id="to" className="input" value={form.openTo} onChange={(e) => set({ openTo: Number(e.target.value) })}>
            {HOURS.slice(1).map((h) => (
              <option key={h} value={h}>{h === 24 ? 'Midnight' : hourLabel(h)}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="label" htmlFor="desc">Description</label>
          <textarea id="desc" rows={3} className="input" value={form.description} onChange={(e) => set({ description: e.target.value })} />
        </div>
      </div>

      <fieldset>
        <legend className="label">Amenities</legend>
        <div className="flex flex-wrap gap-2">
          {AMENITIES.map((a) => {
            const on = form.amenities.includes(a)
            return (
              <button
                type="button"
                key={a}
                onClick={() => toggleAmenity(a)}
                aria-pressed={on}
                className={`rounded-full border px-3 py-1 text-sm transition ${
                  on ? 'border-pitch-600 bg-pitch-600 text-white' : 'border-zinc-300 dark:border-zinc-700'
                }`}
              >
                {a}
              </button>
            )
          })}
        </div>
      </fieldset>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">{error}</p>}

      <button className="btn-primary" disabled={busy}>
        {busy && <Spinner />} {submitLabel}
      </button>
    </form>
  )
}
