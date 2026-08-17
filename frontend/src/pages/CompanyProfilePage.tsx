import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  MapPin, Globe, Linkedin, Instagram, Phone, Mail,
  Calendar, Users, ArrowLeft, Send, Lock, Loader2, CheckCircle,
} from 'lucide-react'
import { getCompany, sendQuote, type CompanyDetail } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'

const AVATAR_COLORS = ['#1B3068', '#C41717', '#2A8B22', '#F08C00', '#7B3FA8', '#1A7A8A']

function avatarColor(name: string): string {
  let hash = 0
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffff
  return AVATAR_COLORS[hash % AVATAR_COLORS.length]
}

function ContactCard({ company }: { company: CompanyDetail }) {
  const { isAuthenticated, company: me } = useAuth()
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [details, setDetails] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canSend = isAuthenticated && me && me.id !== company.id

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!me) return
    setSending(true)
    setError(null)
    try {
      await sendQuote(me.id, {
        supplier_company_id: company.id,
        message,
        cargo_details: details || null,
      })
      setSent(true)
      setOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao enviar mensagem')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="bg-arsx-card rounded-xl p-5 text-white">
      <h3 className="font-semibold mb-1">Enviar Mensagem</h3>
      <p className="text-blue-200 text-xs mb-4">Conecte-se diretamente com {company.name}</p>

      {sent ? (
        <div className="flex items-center gap-2 text-green-300 text-sm font-medium">
          <CheckCircle size={16} /> Mensagem enviada com sucesso!
        </div>
      ) : canSend ? (
        <>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center justify-center gap-2 w-full bg-arsx hover:bg-red-700 transition-colors text-white text-sm font-semibold py-2.5 rounded"
          >
            <Send size={14} />
            {open ? 'Cancelar' : 'Enviar Mensagem'}
          </button>

          {open && (
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <div>
                <label className="text-xs text-blue-200 mb-1 block">Mensagem *</label>
                <textarea
                  className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-sm text-white placeholder-blue-300 resize-none h-24 focus:outline-none focus:border-white/50"
                  placeholder="Apresente-se e descreva o que você está procurando..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-xs text-blue-200 mb-1 block">Detalhes Adicionais</label>
                <input
                  className="w-full bg-white/10 border border-white/20 rounded px-3 py-1.5 text-sm text-white placeholder-blue-300 focus:outline-none focus:border-white/50"
                  placeholder="Contexto extra..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                />
              </div>
              {error && <p className="text-red-300 text-xs">{error}</p>}
              <button
                type="submit"
                disabled={sending}
                className="w-full flex items-center justify-center gap-2 bg-arsx hover:bg-red-700 text-white text-sm font-semibold py-2.5 rounded disabled:opacity-60"
              >
                {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                {sending ? 'Enviando...' : 'Enviar Mensagem'}
              </button>
            </form>
          )}
        </>
      ) : !isAuthenticated ? (
        <Link
          to="/login"
          className="flex items-center justify-center gap-2 w-full bg-arsx hover:bg-red-700 transition-colors text-white text-sm font-semibold py-2.5 rounded"
        >
          Entrar para Enviar Mensagem
        </Link>
      ) : null}
    </div>
  )
}

export default function CompanyProfilePage() {
  const { slug } = useParams<{ slug: string }>()
  const [company, setCompany] = useState<CompanyDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    getCompany(slug)
      .then((data) => { setCompany(data); setLoading(false) })
      .catch((err: Error) => { setError(err.message); setLoading(false) })
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        <Loader2 size={32} className="animate-spin" />
      </div>
    )
  }

  if (error || !company) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Empresa não encontrada</h1>
          <Link to="/directory" className="mt-4 inline-block text-arsx underline">
            Voltar ao Diretório
          </Link>
        </div>
      </div>
    )
  }

  const initials = company.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
  const profile = company.profile
  const location = [company.address_city, company.address_state, company.address_country]
    .filter(Boolean)
    .join(', ')

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
      <Link
        to="/directory"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-arsx mb-6"
      >
        <ArrowLeft size={15} />
        Voltar ao Diretório
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="h-28 relative" style={{ background: 'linear-gradient(140deg, #cc0000, #7a0000)' }} />

        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-8">
            <div
              className="w-20 h-20 rounded-xl border-4 border-white flex items-center justify-center text-white font-bold text-2xl shadow-md overflow-hidden"
              style={{ backgroundColor: company.logo_url ? undefined : avatarColor(company.name) }}
            >
              {company.logo_url
                ? <img src={company.logo_url} alt={company.name} className="w-full h-full object-cover" />
                : initials}
            </div>
            <div className="pb-1">
              <h1 className="text-xl font-extrabold text-gray-900">{company.name}</h1>
              {company.industry && (
                <span className="badge bg-blue-100 text-blue-800 text-xs mt-1 inline-block">{company.industry}</span>
              )}
              {location && (
                <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-0.5">
                  <MapPin size={13} />
                  {location}
                </div>
              )}
            </div>
          </div>

          {company.description && (
            <p className="mt-4 text-gray-700 text-sm leading-relaxed">{company.description}</p>
          )}

          <div className="mt-5 flex flex-wrap gap-4 text-sm text-gray-600">
            {company.founding_year && (
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-gray-400" />
                Fundada em {company.founding_year}
              </span>
            )}
            {company.employee_count && (
              <span className="flex items-center gap-1.5">
                <Users size={14} className="text-gray-400" />
                {company.employee_count} funcionários
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {profile?.history && (
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="section-title mb-3">Sobre a Empresa</h2>
              <p className="text-sm text-gray-700 leading-relaxed">{profile.history}</p>
            </section>
          )}

          {(profile?.tags?.length ?? 0) > 0 && (
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="section-title mb-4">Serviços & Especialidades</h2>
              <div className="flex flex-wrap gap-2">
                {profile!.tags.map((s) => (
                  <span key={s} className="badge bg-arsx/10 text-arsx py-1.5 px-3 text-sm">{s}</span>
                ))}
              </div>
            </section>
          )}

          {((profile?.certifications?.length ?? 0) > 0 || (profile?.networks?.length ?? 0) > 0) && (
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="section-title mb-4">Certificações & Associações</h2>
              <div className="grid grid-cols-2 gap-4">
                {profile?.certifications && profile.certifications.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Certificações</p>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.certifications.map((c) => (
                        <span key={c} className="badge bg-green-50 text-green-800 font-semibold py-1 px-2">{c}</span>
                      ))}
                    </div>
                  </div>
                )}
                {profile?.networks && profile.networks.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Associações</p>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.networks.map((n) => (
                        <span key={n} className="badge bg-purple-50 text-purple-800 py-1 px-2">{n}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">Contato</h3>

            {company.contact_visible ? (
              <div className="space-y-3">
                {company.phone && (
                  <div className="flex items-center gap-2.5 text-sm text-gray-700">
                    <Phone size={15} className="text-gray-400 shrink-0" />
                    <a href={`tel:${company.phone}`} className="hover:text-arsx">{company.phone}</a>
                  </div>
                )}
                {company.email && (
                  <div className="flex items-center gap-2.5 text-sm text-gray-700">
                    <Mail size={15} className="text-gray-400 shrink-0" />
                    <a href={`mailto:${company.email}`} className="hover:text-arsx break-all">{company.email}</a>
                  </div>
                )}
                {company.website && (
                  <div className="flex items-center gap-2.5 text-sm text-gray-700">
                    <Globe size={15} className="text-gray-400 shrink-0" />
                    <a href={company.website} target="_blank" rel="noreferrer" className="hover:text-arsx truncate">
                      {company.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                {(company.linkedin_url || company.instagram_url) && (
                  <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
                    {company.linkedin_url && (
                      <a href={company.linkedin_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm text-blue-700 hover:underline">
                        <Linkedin size={15} /> LinkedIn
                      </a>
                    )}
                    {company.instagram_url && (
                      <a href={company.instagram_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm text-pink-600 hover:underline">
                        <Instagram size={15} /> Instagram
                      </a>
                    )}
                  </div>
                )}
                {!company.phone && !company.email && !company.website && (
                  <p className="text-sm text-gray-400 italic">Nenhuma informação de contato fornecida.</p>
                )}
              </div>
            ) : (
              <div className="relative">
                <div className="space-y-3 blur-sm select-none pointer-events-none">
                  <div className="flex items-center gap-2.5 text-sm text-gray-700">
                    <Phone size={15} className="text-gray-400 shrink-0" />
                    +1 (555) 000-0000
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-gray-700">
                    <Mail size={15} className="text-gray-400 shrink-0" />
                    contact@company.com
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-gray-700">
                    <Globe size={15} className="text-gray-400 shrink-0" />
                    www.company.com
                  </div>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 rounded">
                  <Lock size={20} className="text-arsx mb-2" />
                  <p className="text-xs text-center text-gray-600 font-medium">
                    Assinatura ativa necessária<br />para ver os dados de contato
                  </p>
                  <Link to="/plans" className="mt-3 btn-primary text-xs py-2 px-4">
                    Ver Planos
                  </Link>
                </div>
              </div>
            )}
          </div>

          <ContactCard company={company} />
        </div>
      </div>
    </div>
  )
}
