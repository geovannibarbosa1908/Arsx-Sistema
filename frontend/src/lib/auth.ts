const TOKEN_KEY = 'on_token'
const COMPANY_KEY = 'on_company'

export function saveAuth(token: string, company: object) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(COMPANY_KEY, JSON.stringify(company))
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function getStoredCompany<T>(): T | null {
  const raw = localStorage.getItem(COMPANY_KEY)
  return raw ? (JSON.parse(raw) as T) : null
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(COMPANY_KEY)
}

export function isAuthenticated(): boolean {
  return !!getToken()
}
