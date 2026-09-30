const fmt = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })

export const money = (n) => fmt.format(n)

export const FEE_RATE = 0.02

export function priceBreakdown(pricePerHour, hourCount) {
  const subtotal = pricePerHour * hourCount
  const fee = Math.round(subtotal * FEE_RATE)
  return { subtotal, fee, total: subtotal + fee }
}
