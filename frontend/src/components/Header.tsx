import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, LogOut, Shield } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const NAV_PUBLIC = [
  { label: 'Diretório', to: '/directory' },
  { label: 'Planos', to: '/plans' },
]

const NAV_AUTH = [
  { label: 'Diretório', to: '/directory' },
  { label: 'Minhas Cotações', to: '/quotes' },
  { label: 'Planos', to: '/plans' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isAuthenticated, company, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const isHome = pathname === '/'

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  function handleLogout() {
    logout()
    navigate('/')
    setMobileOpen(false)
  }

  const links = isAuthenticated ? NAV_AUTH : NAV_PUBLIC
  const solid = !isHome || scrolled

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        solid
          ? 'bg-arsx-card/95 backdrop-blur-md shadow-[0_1px_0_rgba(255,255,255,0.08)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link to="/">
            <img src="/logo.png" alt="ARSX" className="h-10 w-auto" />
          </Link>

          <div className="hidden lg:flex items-center gap-3">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-150"
              >
                {link.label}
              </Link>
            ))}

            <div className="w-px h-4 bg-white/20 mx-1" />

            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  {company?.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white border border-white/20 px-4 py-2 rounded hover:bg-white/10 transition-colors"
                >
                  <LogOut size={14} /> Sair
                </button>
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white border border-white/20 rounded px-3 py-2 hover:bg-white/10 transition-colors"
                >
                  <Shield size={13} /> Admin
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white border border-white/20 rounded px-3 py-2 hover:bg-white/10 transition-colors"
                >
                  <Shield size={13} /> Admin
                </Link>
                <Link
                  to="/login"
                  className="text-sm font-medium text-white border border-white/30 px-4 py-2 rounded hover:bg-white/10 transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-bold bg-arsx text-white px-5 py-2 rounded hover:bg-arsx-light transition-colors"
                >
                  Cadastrar
                </Link>
              </>
            )}
          </div>

          <button
            className="lg:hidden text-white p-1"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden bg-arsx-card border-t border-arsx-border py-3">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-4 pt-3 pb-1 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="text-center text-white border border-white/20 py-2.5 rounded text-sm font-medium"
                  >
                    {company?.name}
                  </Link>
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-1.5 text-gray-400 border border-white/10 py-2.5 rounded text-sm"
                  >
                    <Shield size={13} /> Admin
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-center text-arsx border border-arsx/30 py-2.5 rounded text-sm font-medium"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-1.5 text-gray-400 border border-white/10 py-2.5 rounded text-sm"
                  >
                    <Shield size={13} /> Admin
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="text-center text-white border border-white/30 py-2.5 rounded text-sm font-medium"
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="text-center bg-arsx text-white font-bold py-2.5 rounded text-sm"
                  >
                    Cadastrar
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
