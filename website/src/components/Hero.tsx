import { Calendar, Users, Globe, Handshake, ArrowRight } from 'lucide-react'

const STATS = [
  { icon: Calendar, label: 'DESDE', value: '1999' },
  { icon: Users, label: 'MAIS DE', value: '2.000+ Fornecedores' },
  { icon: Globe, label: 'ALCANCE', value: 'Global' },
  { icon: Handshake, label: 'SERVIÇO', value: 'De Ponta a Ponta' },
]

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex flex-col justify-between overflow-hidden"
      style={{
        backgroundImage: 'url(/montanha.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay escuro para legibilidade */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.75) 60%, rgba(0,0,0,0.88) 100%)' }} />

      {/* Dot grid por cima do overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(204,0,0,0.10) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Glow vermelho canto superior direito */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #cc0000 0%, transparent 70%)' }}
      />

      {/* Content */}
      <div className="relative flex-1 flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-10">
        <img src="/logo.png" alt="ARSX" className="h-20 w-auto mb-8" />
        <p className="text-[#cc0000] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
          Diplomacia Empresarial · Presença Global
        </p>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight text-white max-w-4xl" style={{ textShadow: '0 2px 16px rgba(0,0,0,0.9), 0 1px 4px rgba(0,0,0,0.8)' }}>
          SUA EMPRESA,<br />NOSSA{' '}
          <span className="text-[#cc0000]">DIPLOMACIA</span>,<br />
          ALCANCE{' '}
          <span className="text-[#cc0000]">GLOBAL</span>
        </h1>
        <p className="mt-6 text-gray-200 text-lg max-w-xl leading-relaxed" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.9)' }}>
          Conectamos negócios com os maiores fornecedores do mundo —
          estratégia, <span className="text-[#cc0000] font-semibold">supply chain</span> e expansão internacional.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a href="#quem-somos" className="btn-green text-base">
            Conheça a ARSX <ArrowRight size={18} />
          </a>
          <a href="#contato" className="btn-outline-green text-base">
            Entre em Contato
          </a>
        </div>
      </div>

      {/* Stats bar */}
      <div className="relative bg-arsx-card border-t border-arsx-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-arsx-border">
            {STATS.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-4 py-6 px-6">
                <div className="w-10 h-10 rounded-full bg-[#cc0000]/10 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-[#cc0000]" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest">{label}</p>
                  <p className="text-white font-bold text-sm mt-0.5">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
