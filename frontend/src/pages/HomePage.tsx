import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Shield, Globe, TrendingUp, ArrowRight, Star } from 'lucide-react'
import CompanyCard from '../components/CompanyCard'
import { getCompanies, type CompanyListItem } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'
import { TESTIMONIALS } from '../data/mock'

const STATS = [
  { label: 'Empresas Parceiras', value: '500+' },
  { label: 'Países', value: '40+' },
  { label: 'Mensagens Enviadas', value: '12k+' },
  { label: 'Setores', value: '15+' },
]

const FEATURES = [
  {
    icon: Search,
    title: 'Encontre Parceiros Verificados',
    desc: 'Pesquise empresas de todos os setores — cada membro foi analisado e aprovado.',
  },
  {
    icon: Shield,
    title: 'Rede Confiável',
    desc: 'Toda empresa listada passa pelo nosso processo de aprovação. Conecte-se com confiança.',
  },
  {
    icon: Globe,
    title: 'Alcance Global',
    desc: 'Conecte-se com profissionais de negócios em mais de 40 países ao redor do mundo.',
  },
  {
    icon: TrendingUp,
    title: 'Expanda seu Negócio',
    desc: 'Seja descoberto por empresas que buscam ativamente parceiros no seu setor.',
  },
]

export default function HomePage() {
  const [featured, setFeatured] = useState<CompanyListItem[]>([])
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) return
    getCompanies({})
      .then((data) => setFeatured(data.items.slice(0, 3)))
      .catch(() => {})
  }, [isAuthenticated])

  return (
    <div>
      {/* Hero */}
      <section
        className="pt-36 pb-20 px-4 text-center relative"
        style={{
          backgroundImage: 'url(/networking.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-arsx-card/60" />
        <div className="relative z-10">
          <p className="text-blue-300 text-sm font-semibold uppercase tracking-widest mb-3">
            ARS<span className="text-arsx">X</span>
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight max-w-3xl mx-auto">
            Conecte-se com<br />
            <span className="text-arsx-light">Parceiros de Confiança</span>
          </h1>
          <p className="text-blue-200 mt-4 text-base max-w-xl mx-auto">
            O diretório B2B verificado onde empresas encontram e se conectam com parceiros em todos os setores, em todo o mundo.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/directory" className="btn-primary px-8 py-3.5 text-base">
              Explorar Diretório
            </Link>
            <Link to="/plans" className="btn-outline border-white text-white hover:bg-white hover:text-arsx px-8 py-3.5 text-base">
              Ver Planos
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-10 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-extrabold text-arsx">{s.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            Por que se juntar à ARS<span className="text-arsx">X</span>?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm text-center">
                <div className="w-12 h-12 rounded-xl bg-arsx/10 flex items-center justify-center mx-auto mb-4">
                  <Icon size={22} className="text-arsx" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured members */}
      {featured.length > 0 && (
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-arsx">Parceiros em Destaque</h2>
              <Link to="/directory" className="flex items-center gap-1.5 text-sm text-arsx font-medium hover:underline">
                Ver todos
                <ArrowRight size={15} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.map((c) => (
                <CompanyCard key={c.id} company={c} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-arsx">O Que Nossos Parceiros Dizem</h2>
            <p className="text-gray-500 text-sm mt-2">Confiado por profissionais de negócios em mais de 40 países</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col gap-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-arsx text-arsx" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed italic">"{t.text}"</p>
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-100">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                    style={{ backgroundColor: t.color }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role} · {t.company} · {t.country}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-arsx py-14 px-4 text-center text-white">
        <h2 className="text-2xl font-bold">Pronto para expandir sua rede de negócios?</h2>
        <p className="text-red-200 mt-2 text-sm">
          Crie um perfil gratuito e conecte-se com empresas em todo o mundo.
        </p>
        <Link to="/register" className="mt-6 inline-block bg-white text-arsx font-bold px-8 py-3.5 rounded hover:bg-red-50 transition-colors">
          Criar Perfil Gratuito
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-arsx-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
            {/* Brand */}
            <div>
              <Link to="/" className="text-2xl font-black text-white tracking-tight">
                ARS<span className="text-arsx">X</span>
              </Link>
              <p className="text-gray-500 text-xs mt-2">O diretório B2B verificado.</p>
              <p className="text-gray-500 text-xs mt-0.5">
                Conecte empresas em todo o mundo.
              </p>
            </div>

            {/* Nav */}
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              <Link to="/directory" className="text-xs text-gray-500 hover:text-arsx transition-colors">Diretório</Link>
              <Link to="/plans" className="text-xs text-gray-500 hover:text-arsx transition-colors">Planos</Link>
              <Link to="/quotes" className="text-xs text-gray-500 hover:text-arsx transition-colors">Cotações</Link>
              <Link to="/register" className="text-xs text-gray-500 hover:text-arsx transition-colors">Cadastrar</Link>
              <Link to="/login" className="text-xs text-gray-500 hover:text-arsx transition-colors">Entrar</Link>
            </nav>

            {/* Tagline */}
            <div className="text-xs text-gray-500 text-right space-y-1">
              <p>Freemium · Pro · Business</p>
              <p>Parceiros verificados globalmente</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-arsx-border flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
            <p>© {new Date().getFullYear()} ARS<span className="text-arsx">X</span>. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
