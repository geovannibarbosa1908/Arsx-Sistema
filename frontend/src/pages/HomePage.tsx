import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Shield, Globe, TrendingUp, ArrowRight, Star } from 'lucide-react'
import CompanyCard from '../components/CompanyCard'
import { getCompanies, type CompanyListItem } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'
import { TESTIMONIALS } from '../data/mock'

const STATS = [
  { label: 'Member Companies', value: '500+' },
  { label: 'Countries', value: '40+' },
  { label: 'Messages Sent', value: '12k+' },
  { label: 'Industries', value: '15+' },
]

const FEATURES = [
  {
    icon: Search,
    title: 'Find Verified Partners',
    desc: 'Search companies across all industries — every member has been screened and approved.',
  },
  {
    icon: Shield,
    title: 'Trusted Network',
    desc: 'Every listed company goes through our approval process. Connect with confidence.',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    desc: 'Connect with business professionals across 40+ countries worldwide.',
  },
  {
    icon: TrendingUp,
    title: 'Grow Your Business',
    desc: 'Get discovered by companies actively looking for partners in your industry.',
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
      <section className="bg-navy py-20 px-4 text-center">
        <p className="text-blue-300 text-sm font-semibold uppercase tracking-widest mb-3">
          Open Networking
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight max-w-3xl mx-auto">
          Connect with Trusted<br />
          <span className="text-brand-orange">Business Partners</span>
        </h1>
        <p className="text-blue-200 mt-4 text-base max-w-xl mx-auto">
          The verified B2B directory where companies find and connect with partners across all industries, worldwide.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/directory" className="btn-primary px-8 py-3.5 text-base">
            Browse Directory
          </Link>
          <Link to="/plans" className="btn-outline border-white text-white hover:bg-white hover:text-navy px-8 py-3.5 text-base">
            View Plans
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-10 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-extrabold text-navy">{s.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-navy text-center mb-10">
            Why Join Open Networking?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm text-center">
                <div className="w-12 h-12 rounded-xl bg-navy/10 flex items-center justify-center mx-auto mb-4">
                  <Icon size={22} className="text-navy" />
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
              <h2 className="text-2xl font-bold text-navy">Featured Members</h2>
              <Link to="/directory" className="flex items-center gap-1.5 text-sm text-brand-red font-medium hover:underline">
                View all
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
            <h2 className="text-2xl font-bold text-navy">What Our Members Say</h2>
            <p className="text-gray-500 text-sm mt-2">Trusted by business professionals across 40+ countries</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col gap-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-brand-orange text-brand-orange" />
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
      <section className="bg-brand-red py-14 px-4 text-center text-white">
        <h2 className="text-2xl font-bold">Ready to grow your business network?</h2>
        <p className="text-red-200 mt-2 text-sm">
          Create a free profile and connect with companies worldwide.
        </p>
        <Link to="/register" className="mt-6 inline-block bg-white text-brand-red font-bold px-8 py-3.5 rounded hover:bg-red-50 transition-colors">
          Create Free Profile
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-navy-dark py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-blue-300">
          <div className="font-bold text-base text-white">
            Open Networking
          </div>
          <p>The verified B2B business directory</p>
          <p>© {new Date().getFullYear()} Open Networking. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
