import { useState } from 'react'
import { Loader2, CheckCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { updateCompany as apiUpdateCompany } from '../lib/api'
import { INDUSTRIES, COUNTRIES } from '../data/mock'

const EMPLOYEE_OPTIONS = ['1–10', '10–50', '50–200', '200–500', '500+']
const CERT_OPTIONS = ['ISO 9001', 'ISO 14001', 'ISO 27001', 'B Corp', 'SOC 2', 'PCI DSS', 'GDPR Compliant']
const NETWORK_OPTIONS = ['Chamber of Commerce', 'Industry Association', 'Business Council', 'Trade Federation']
const SERVICE_TAGS = [
  'Consulting', 'Software Development', 'Marketing', 'Sales',
  'Logistics', 'Manufacturing', 'Distribution', 'Import/Export',
  'Financial Services', 'Legal Services', 'HR & Recruiting', 'Training',
  'Research & Development', 'Customer Support', 'Design', 'Data Analytics',
]

function ToggleGroup({
  options, selected, onChange,
}: { options: string[]; selected: string[]; onChange: (v: string[]) => void }) {
  const toggle = (val: string) =>
    onChange(selected.includes(val) ? selected.filter((x) => x !== val) : [...selected, val])
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => toggle(o)}
          className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
            selected.includes(o)
              ? 'bg-arsx text-white border-arsx'
              : 'bg-white text-gray-700 border-gray-300 hover:border-arsx'
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  )
}

export default function ProfilePage() {
  const { company, setCompany } = useAuth()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: company?.name ?? '',
    phone: company?.phone ?? '',
    website: company?.website ?? '',
    industry: company?.industry ?? '',
    founding_year: company?.founding_year?.toString() ?? '',
    employees: company?.employee_count ?? '',
    description: company?.description ?? '',
    logo_url: company?.logo_url ?? '',
    address_street: company?.address_street ?? '',
    address_number: company?.address_number ?? '',
    address_complement: company?.address_complement ?? '',
    address_district: company?.address_district ?? '',
    address_city: company?.address_city ?? '',
    address_state: company?.address_state ?? '',
    address_country: company?.address_country ?? '',
    address_zip: company?.address_zip ?? '',
    linkedin: company?.linkedin_url ?? '',
    instagram: company?.instagram_url ?? '',
    tags: company?.profile?.tags ?? [] as string[],
    certifications: company?.profile?.certifications ?? [] as string[],
    networks: company?.profile?.networks ?? [] as string[],
    history: company?.profile?.history ?? '',
  })

  const set = (key: string, val: unknown) => setForm((f) => ({ ...f, [key]: val }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!company) return
    setSaving(true)
    setSaved(false)
    setError(null)
    try {
      const updated = await apiUpdateCompany(company.id, {
        name: form.name,
        phone: form.phone || null,
        website: form.website ? (form.website.match(/^https?:\/\//) ? form.website : `https://${form.website}`) : null,
        industry: form.industry || null,
        description: form.description || null,
        founding_year: form.founding_year ? parseInt(form.founding_year) : null,
        employee_count: form.employees || null,
        logo_url: form.logo_url || null,
        address: {
          street: form.address_street || null,
          number: form.address_number || null,
          complement: form.address_complement || null,
          district: form.address_district || null,
          city: form.address_city || null,
          state: form.address_state || null,
          country: form.address_country || null,
          zip: form.address_zip || null,
        },
        social_media: {
          linkedin_url: form.linkedin ? (form.linkedin.match(/^https?:\/\//) ? form.linkedin : `https://${form.linkedin}`) : null,
          instagram_url: form.instagram ? (form.instagram.match(/^https?:\/\//) ? form.instagram : `https://${form.instagram}`) : null,
        },
        profile: {
          history: form.history || null,
          tags: form.tags,
          certifications: form.certifications,
          networks: form.networks,
        },
      })
      setCompany(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 4000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao salvar alterações')
    } finally {
      setSaving(false)
    }
  }

  if (!company) return null

  return (
    <div className="max-w-3xl mx-auto px-4 pt-24 pb-10">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-arsx">Meu Perfil</h1>
        <p className="text-gray-500 text-sm mt-1">
          {company.email} &mdash; <span className="capitalize">{company.status}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Section 1: Company Info */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-5">
          <h2 className="section-title">Informações da Empresa</h2>

          <div className="flex items-start gap-5">
            <div className="shrink-0">
              <div className="w-20 h-20 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                {form.logo_url
                  ? <img src={form.logo_url} alt="Logo" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  : <span className="text-2xl font-bold text-gray-300">{form.name.charAt(0).toUpperCase()}</span>
                }
              </div>
            </div>
            <div className="flex-1">
              <label className="label">Nome da Empresa *</label>
              <input className="input" value={form.name} onChange={(e) => set('name', e.target.value)} required />
            </div>
          </div>

          <div>
            <label className="label">URL do Logo</label>
            <input
              className="input"
              value={form.logo_url}
              onChange={(e) => set('logo_url', e.target.value)}
              placeholder="https://seusite.com/logo.png"
            />
            <p className="text-xs text-gray-400 mt-1">Cole uma URL direta para a imagem do logo (PNG, JPG, SVG). Recomendado: quadrado, mín. 200×200px.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Telefone</label>
              <input className="input" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+55 (11) 00000-0000" />
            </div>
            <div>
              <label className="label">Site</label>
              <input className="input" value={form.website} onChange={(e) => set('website', e.target.value)} placeholder="https://" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Setor</label>
              <select className="input" value={form.industry} onChange={(e) => set('industry', e.target.value)}>
                <option value="">Selecione o setor...</option>
                {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
                <option value="Other">Outro</option>
              </select>
            </div>
            <div>
              <label className="label">Número de Funcionários</label>
              <select className="input" value={form.employees} onChange={(e) => set('employees', e.target.value)}>
                <option value="">Selecione...</option>
                {EMPLOYEE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Ano de Fundação</label>
            <input
              type="number"
              className="input"
              value={form.founding_year}
              onChange={(e) => set('founding_year', e.target.value)}
              placeholder="ex.: 2005"
              min={1800}
              max={new Date().getFullYear()}
            />
          </div>

          <div>
            <label className="label">Descrição da Empresa</label>
            <textarea
              className="input h-24 resize-none"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Breve descrição exibida no diretório..."
            />
          </div>
        </div>

        {/* Section 2: Address & Social */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-5">
          <h2 className="section-title">Endereço & Redes Sociais</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">País</label>
              <select className="input" value={form.address_country} onChange={(e) => set('address_country', e.target.value)}>
                <option value="">Selecione o país...</option>
                {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                <option value="Other">Outro</option>
              </select>
            </div>
            <div>
              <label className="label">Estado / Província</label>
              <input className="input" value={form.address_state} onChange={(e) => set('address_state', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Cidade</label>
              <input className="input" value={form.address_city} onChange={(e) => set('address_city', e.target.value)} />
            </div>
            <div>
              <label className="label">CEP / Código Postal</label>
              <input className="input" value={form.address_zip} onChange={(e) => set('address_zip', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="label">Logradouro</label>
              <input className="input" value={form.address_street} onChange={(e) => set('address_street', e.target.value)} />
            </div>
            <div>
              <label className="label">Número</label>
              <input className="input" value={form.address_number} onChange={(e) => set('address_number', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Complemento</label>
              <input className="input" value={form.address_complement} onChange={(e) => set('address_complement', e.target.value)} placeholder="Sala, Andar..." />
            </div>
            <div>
              <label className="label">Bairro</label>
              <input className="input" value={form.address_district} onChange={(e) => set('address_district', e.target.value)} />
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Redes Sociais</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">URL do LinkedIn</label>
                <input className="input" value={form.linkedin} onChange={(e) => set('linkedin', e.target.value)} placeholder="https://linkedin.com/company/..." />
              </div>
              <div>
                <label className="label">URL do Instagram</label>
                <input className="input" value={form.instagram} onChange={(e) => set('instagram', e.target.value)} placeholder="https://instagram.com/..." />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Profile & Services */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
          <h2 className="section-title">Perfil & Serviços</h2>

          <div>
            <label className="label mb-2 block">Serviços & Especialidades</label>
            <ToggleGroup options={SERVICE_TAGS} selected={form.tags} onChange={(v) => set('tags', v)} />
          </div>

          <div>
            <label className="label mb-2 block">Certificações</label>
            <ToggleGroup options={CERT_OPTIONS} selected={form.certifications} onChange={(v) => set('certifications', v)} />
          </div>

          <div>
            <label className="label mb-2 block">Associações & Redes</label>
            <ToggleGroup options={NETWORK_OPTIONS} selected={form.networks} onChange={(v) => set('networks', v)} />
          </div>

          <div>
            <label className="label">Histórico da Empresa</label>
            <textarea
              className="input h-28 resize-none"
              value={form.history}
              onChange={(e) => set('history', e.target.value)}
              placeholder="Histórico detalhado da empresa exibido na página de perfil completo..."
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex items-center justify-between">
          {saved ? (
            <span className="flex items-center gap-2 text-sm text-green-700 font-medium">
              <CheckCircle size={16} /> Alterações salvas com sucesso
            </span>
          ) : <span />}
          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex items-center gap-2 disabled:opacity-60"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : null}
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  )
}
