// Stands in for a network round-trip so loading states are exercised.
export const latency = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms + Math.random() * 200))

export class ApiError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ApiError'
  }
}

export const newId = (prefix) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
