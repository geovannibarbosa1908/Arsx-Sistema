import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { clearAuth, getStoredCompany, getToken, saveAuth } from '../lib/auth'
import { login as apiLogin, type CompanyDetail } from '../lib/api'

interface AuthContextValue {
  company: CompanyDetail | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setCompany: (company: CompanyDetail) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [company, setCompanyState] = useState<CompanyDetail | null>(() =>
    getToken() ? getStoredCompany<CompanyDetail>() : null
  )

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiLogin(email, password)
    saveAuth(data.access_token, data.company)
    setCompanyState(data.company)
  }, [])

  const logout = useCallback(() => {
    clearAuth()
    setCompanyState(null)
  }, [])

  const setCompany = useCallback((updated: CompanyDetail) => {
    const token = getToken()
    if (token) saveAuth(token, updated)
    setCompanyState(updated)
  }, [])

  return (
    <AuthContext.Provider value={{ company, isAuthenticated: !!company, login, logout, setCompany }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
