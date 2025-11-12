const ADMIN_PASSWORD = "GVAdmin!1530"
const AUTH_KEY = "gv_admin_auth"
const AUTH_TIMESTAMP_KEY = "gv_admin_auth_timestamp"
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export function login(password: string, rememberMe = false): boolean {
  if (password === ADMIN_PASSWORD) {
    const storage = rememberMe ? localStorage : sessionStorage
    storage.setItem(AUTH_KEY, "true")
    storage.setItem(AUTH_TIMESTAMP_KEY, Date.now().toString())
    return true
  }
  return false
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY)
  localStorage.removeItem(AUTH_TIMESTAMP_KEY)
  sessionStorage.removeItem(AUTH_KEY)
  sessionStorage.removeItem(AUTH_TIMESTAMP_KEY)
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false

  const localAuth = localStorage.getItem(AUTH_KEY) === "true"
  const sessionAuth = sessionStorage.getItem(AUTH_KEY) === "true"

  if (!localAuth && !sessionAuth) return false

  // Check expiration for localStorage (persistent login)
  if (localAuth) {
    const timestamp = localStorage.getItem(AUTH_TIMESTAMP_KEY)
    if (timestamp) {
      const elapsed = Date.now() - Number.parseInt(timestamp)
      if (elapsed > SESSION_DURATION) {
        logout()
        return false
      }
    }
  }

  return true
}
