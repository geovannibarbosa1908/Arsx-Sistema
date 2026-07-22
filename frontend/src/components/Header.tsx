import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut, Shield } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'


const NAV_PUBLIC = [
  { label: 'Directory', to: '/directory' },
  { label: 'Plans', to: '/plans' },
]

const NAV_AUTH = [
  { label: 'Directory', to: '/directory' },
  { label: 'My RFQs', to: '/quotes' },
  { label: 'Plans', to: '/plans' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const { isAuthenticated, company, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl font-black tracking-tight">
              <span className="text-navy">A</span>
              <span className="text-brand-red">B</span>
              <span className="text-brand-orange">P</span>
              <span className="text-brand-green">L</span>
            </span>
            <span className="hidden sm:block text-xs text-gray-500 leading-tight max-w-[140px]">
              Member Directory
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {(isAuthenticated ? NAV_AUTH : NAV_PUBLIC).map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  pathname === item.to
                    ? 'bg-navy text-white'
                    : 'text-gray-600 hover:text-navy hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <div className="ml-4 flex items-center gap-3">
                <Link to="/profile" className="text-sm text-gray-600 font-medium hover:text-navy hover:underline">
                  {company?.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-navy"
                >
                  <LogOut size={15} /> Sign out
                </button>
                <Link to="/admin" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-navy border border-gray-200 rounded px-2.5 py-1.5 hover:border-navy transition-colors">
                  <Shield size={13} /> Admin
                </Link>
              </div>
            ) : (
              <div className="ml-4 flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 rounded text-sm font-medium text-gray-600 hover:text-navy hover:bg-gray-100">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2">
                  Join Now
                </Link>
                <Link to="/admin" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-navy border border-gray-200 rounded px-2.5 py-1.5 hover:border-navy transition-colors">
                  <Shield size={13} /> Admin
                </Link>
              </div>
            )}
          </nav>

          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-1">
          {(isAuthenticated ? NAV_AUTH : NAV_PUBLIC).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="block px-3 py-2 rounded text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              {item.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              <Link to="/profile" onClick={() => setOpen(false)} className="block px-3 py-2 rounded text-sm font-medium text-gray-700 hover:bg-gray-100">
                My Profile
              </Link>
              <button
                onClick={() => { handleLogout(); setOpen(false) }}
                className="block w-full text-left px-3 py-2 rounded text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="block px-3 py-2 rounded text-sm font-medium text-gray-700 hover:bg-gray-100">
                Sign In
              </Link>
              <Link to="/register" onClick={() => setOpen(false)} className="block px-3 py-2 rounded text-sm font-medium text-gray-700 hover:bg-gray-100">
                Register
              </Link>
            </>
          )}
          <Link
            to="/admin"
            onClick={() => setOpen(false)}
            className="flex items-center gap-1.5 px-3 py-2 rounded text-sm font-medium text-gray-400 hover:bg-gray-100 hover:text-navy"
          >
            <Shield size={14} /> Admin
          </Link>
        </div>
      )}
    </header>
  )
}
