import { Star } from 'lucide-react'
import { useState } from 'react'

export default function StarRating({ value, onRate, readOnly = false }) {
  const [hover, setHover] = useState(0)
  const shown = hover || value || 0

  return (
    <div className="flex items-center gap-0.5" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          onMouseEnter={() => !readOnly && setHover(n)}
          onClick={() => onRate?.(n)}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          className="p-0.5 disabled:cursor-default"
        >
          <Star className={`size-5 ${n <= shown ? 'fill-amber-400 text-amber-400' : 'text-zinc-300 dark:text-zinc-600'}`} />
        </button>
      ))}
    </div>
  )
}
