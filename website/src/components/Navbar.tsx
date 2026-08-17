import { useState, useEffect } from 'react'
import { Menu, X, ExternalLink } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Início', href: '#inicio' },
  { label: 'Quem Somos', href: '#quem-somos' },
  { label: 'Atuação', href: '#atuacao' },
  { label: 'Nossa Equipe', href: '#nossa-equipe' },
  { label: 'Trabalhe Conosco', href: '#trabalhe-conosco' },
]

const PORTAL_URL = import.meta.env.VITE_OPENNETWORKING_PORTAL_URL ?? 'http://localhost:5173'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-arsx-dark/95 backdrop-blur-md shadow-[0_1px_0_rgba(255,255,255,0.08)]' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <a href="#inicio" className="text-2xl font-black tracking-tight text-white">
            ARS<span className="text-[#cc0000]">X</span>
          </a>

          <nav className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-150"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <a
              href={PORTAL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-[#fff] border border-[#fff]/30 px-4 py-2 rounded hover:bg-[#cc0000]/10 transition-colors"
            >
              Comunidade
              <ExternalLink size={13} />
            </a>
            <a
              href="#contato"
              className="text-sm font-bold bg-[#fff] text-black px-5 py-2 rounded hover:bg-[#e03333] transition-colors"
            >
              Entre em Contato
            </a>
          </div>

          <button
            className="lg:hidden text-white p-1"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="lg:hidden bg-arsx-card border-t border-arsx-border py-3">
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="block px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="px-4 pt-3 pb-1 flex flex-col gap-2">
              <a
                href={PORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center text-[#cc0000] border border-[#cc0000]/30 py-2.5 rounded text-sm font-medium"
                onClick={() => setMobileOpen(false)}
              >
                Comunidade
              </a>
              <a
                href="#contato"
                className="text-center bg-[#cc0000] text-black font-bold py-2.5 rounded text-sm"
                onClick={() => setMobileOpen(false)}
              >
                Entre em Contato
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
