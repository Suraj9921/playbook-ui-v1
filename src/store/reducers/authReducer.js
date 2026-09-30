export function authReducer(state, action) {
  switch (action.type) {
    case 'auth/signedIn':
      return { ...state, sessionId: action.user.id }
    case 'auth/registered':
      return { users: [...state.users, action.user], sessionId: action.user.id }
    case 'auth/signedOut':
      return { ...state, sessionId: null }
    case 'users/suspensionToggled':
      return {
        ...state,
        users: state.users.map((u) => (u.id === action.userId ? { ...u, suspended: !u.suspended } : u)),
      }
    default:
      return state
  }
}
