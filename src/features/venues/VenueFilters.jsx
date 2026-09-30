import { Search } from 'lucide-react'
import { SportIcon } from '../../components/SportBadge'
import { CITIES, SPORTS } from '../../seed/venues'

export default function VenueFilters({ filters, onChange }) {
  const set = (patch) => onChange({ ...filters, ...patch })

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {['all', ...Object.keys(SPORTS)].map((s) => {
          const active = filters.sport === s
          return (
            <button
              key={s}
              onClick={() => set({ sport: s })}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                active
                  ? 'border-pitch-600 bg-pitch-600 text-white'
                  : 'border-zinc-300 hover:border-pitch-500 dark:border-zinc-700'
              }`}
            >
              {s !== 'all' && <SportIcon sport={s} className="size-4" />}
              {s === 'all' ? 'All sports' : SPORTS[s].label}
            </button>
          )
        })}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="relative sm:col-span-2 lg:col-span-1">
          <Search className="absolute top-2.5 left-3 size-4 text-zinc-400" />
          <input
            className="input pl-9"
            placeholder="Venue or area"
            value={filters.q}
            onChange={(e) => set({ q: e.target.value })}
          />
        </label>
        <select className="input" value={filters.city} onChange={(e) => set({ city: e.target.value })}>
          <option value="all">All cities</option>
          {CITIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select className="input" value={filters.sort} onChange={(e) => set({ sort: e.target.value })}>
          <option value="popular">Most booked</option>
          <option value="rating">Top rated</option>
          <option value="priceLow">Price: low to high</option>
          <option value="priceHigh">Price: high to low</option>
        </select>
        <label className="flex items-center gap-3 text-sm">
          <span className="shrink-0 text-zinc-500">Up to ₹{filters.maxPrice}</span>
          <input
            type="range"
            min={300}
            max={2000}
            step={100}
            value={filters.maxPrice}
            onChange={(e) => set({ maxPrice: Number(e.target.value) })}
            className="w-full accent-pitch-600"
          />
        </label>
      </div>
    </div>
  )
}
