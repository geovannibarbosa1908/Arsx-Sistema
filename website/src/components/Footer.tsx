const NAV_LINKS = [
  { label: 'Início', href: '#inicio' },
  { label: 'Quem Somos', href: '#quem-somos' },
  { label: 'Atuação', href: '#atuacao' },
  { label: 'Nossa Equipe', href: '#nossa-equipe' },
  { label: 'Trabalhe Conosco', href: '#trabalhe-conosco' },
]

export default function Footer() {
  return (
    <footer className="bg-black border-t border-arsx-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          {/* Brand */}
          <div>
            <a href="#inicio" className="text-2xl font-black text-white tracking-tight">
              ARS<span className="text-[#cc0000]">X</span>
            </a>
            <p className="text-gray-500 text-xs mt-2">Conectando o mundo com os Estados Unidos.</p>
            <p className="text-gray-500 text-xs mt-0.5">
              <span className="text-[#cc0000]">Português</span> · Inglês · Espanhol
            </p>
          </div>

          {/* Nav */}
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs text-gray-500 hover:text-[#cc0000] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a href="#contato" className="text-xs text-gray-500 hover:text-[#cc0000] transition-colors">
              Contato
            </a>
          </nav>

          {/* Contact mini */}
          <div className="text-xs text-gray-500 text-right space-y-1">
            <p>+55 22 98154-4419</p>
            <p>arsx.com.br</p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-arsx-border flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} ARSX Diplomacia Empresarial. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
