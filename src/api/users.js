import { ApiError, latency, newId } from './fakeApi'

export async function authenticate(users, email, password) {
  await latency()
  const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())
  if (!user || user.password !== password) throw new ApiError('Email or password is incorrect.')
  if (user.suspended) throw new ApiError('This account has been suspended. Contact support.')
  return user
}

export async function register(users, { name, email, password, role, city }) {
  await latency()
  if (!name.trim() || !email.trim()) throw new ApiError('Name and email are required.')
  if (password.length < 6) throw new ApiError('Password must be at least 6 characters.')
  if (!['player', 'owner'].includes(role)) throw new ApiError('Pick a valid account type.')
  if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
    throw new ApiError('An account with that email already exists.')
  }
  return { id: newId('u'), name: name.trim(), email: email.trim(), password, role, city, suspended: false }
}
