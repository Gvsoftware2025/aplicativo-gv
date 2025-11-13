const AUTH_KEY = "gv_admin_auth"
const CORRECT_PASSWORD = "admin123" // Altere para sua senha real

export function login(password: string, rememberMe: boolean): boolean {
  if (password === CORRECT_PASSWORD) {
    const expiresAt = rememberMe
      ? Date.now() + 24 * 60 * 60 * 1000 // 24 horas
      : Date.now() + 60 * 60 * 1000 // 1 hora

    localStorage.setItem(AUTH_KEY, JSON.stringify({ expiresAt }))
    return true
  }
  return false
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false

  const auth = localStorage.getItem(AUTH_KEY)
  if (!auth) return false

  try {
    const { expiresAt } = JSON.parse(auth)
    if (Date.now() > expiresAt) {
      localStorage.removeItem(AUTH_KEY)
      return false
    }
    return true
  } catch {
    return false
  }
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY)
}
