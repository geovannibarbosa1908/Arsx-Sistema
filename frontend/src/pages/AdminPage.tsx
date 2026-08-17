import { useState, useEffect, useCallback } from 'react'
import {
  Loader2, CheckCircle, XCircle, Clock, Users, Search, LogOut,
  ChevronRight, Calendar, Shield, UserPlus, ToggleLeft, ToggleRight,
} from 'lucide-react'
import {
  adminLogin,
  adminGetCompanies,
  adminApprove,
  adminSuspend,
  adminGetEvents,
  adminListUsers,
  adminCreateUser,
  adminToggleUser,
  type AdminCompanyItem,
  type CompanyEventItem,
  type AdminUserItem,
} from '../lib/api'

const SESSION_KEY = 'on_admin_token'
const SESSION_NAME = 'on_admin_name'
const SESSION_ROLE = 'on_admin_role'

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  active: 'bg-green-100 text-green-800',
  suspended: 'bg-red-100 text-red-800',
}

const PLAN_LABELS: Record<string, string> = {
  pro: 'Pro',
  business: 'Business',
}

const EVENT_ICONS: Record<string, string> = {
  registered: '📋',
  approved: '✅',
  reactivated: '🔄',
  suspended: '🚫',
  login: '🔐',
  profile_updated: '✏️',
  rfq_sent: '📤',
  rfq_received: '📥',
  subscription_created: '💳',
  subscription_cancelled: '❌',
  subscription_past_due: '⚠️',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return formatDate(iso)
}

function isToday(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
}

function Initials({ name, logo }: { name: string; logo: string | null }) {
  const colors = ['#1B3068', '#C41717', '#2A8B22', '#F08C00', '#7B3FA8']
  let hash = 0
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffff
  const bg = colors[hash % colors.length]
  const initials = name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
  if (logo) return <img src={logo} alt={name} className="w-10 h-10 rounded-lg object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
  return (
    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ backgroundColor: bg }}>
      {initials}
    </div>
  )
}

// ── Login ──────────────────────────────────────────────────────────────────
function AdminLogin({ onLogin }: { onLogin: (token: string, name: string, role: string) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const data = await adminLogin(email, password)
      sessionStorage.setItem(SESSION_KEY, data.access_token)
      sessionStorage.setItem(SESSION_NAME, data.name)
      sessionStorage.setItem(SESSION_ROLE, data.role)
      onLogin(data.access_token, data.name, data.role)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Credenciais inválidas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-3xl font-black tracking-tight">
            <span className="text-arsx">A</span><span className="text-arsx">R</span>
            <span className="text-arsx-light">S</span><span className="text-arsx">X</span>
          </span>
          <p className="text-gray-500 text-sm mt-1">Painel Administrativo</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 space-y-4">
          <div>
            <label className="label">E-mail</label>
            <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </div>
          <div>
            <label className="label">Senha</label>
            <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Timeline ───────────────────────────────────────────────────────────────
function Timeline({ companyId, token }: { companyId: number; token: string }) {
  const [events, setEvents] = useState<CompanyEventItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminGetEvents(token, companyId)
      .then(setEvents)
      .finally(() => setLoading(false))
  }, [companyId, token])

  if (loading) return <div className="flex justify-center py-4"><Loader2 size={18} className="animate-spin text-gray-400" /></div>
  if (events.length === 0) return <p className="text-sm text-gray-400 italic">Nenhum evento registrado.</p>

  const todayEvents = events.filter((e) => isToday(e.created_at))
  const olderEvents = events.filter((e) => !isToday(e.created_at))

  function EventItem({ ev }: { ev: CompanyEventItem }) {
    return (
      <div className="flex gap-3 text-sm">
        <span className="text-base leading-none mt-0.5">{EVENT_ICONS[ev.event_type] ?? '📌'}</span>
        <div className="flex-1">
          <p className="text-gray-800">{ev.description}</p>
          <p className="text-xs text-gray-400 mt-0.5">{formatRelative(ev.created_at)}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {todayEvents.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Hoje</p>
          <div className="space-y-3">
            {todayEvents.map((ev) => <EventItem key={ev.id} ev={ev} />)}
          </div>
        </div>
      )}
      {olderEvents.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Anteriores</p>
          <div className="space-y-3">
            {olderEvents.map((ev) => <EventItem key={ev.id} ev={ev} />)}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Company detail panel ───────────────────────────────────────────────────
function CompanyDetail({
  company, token, onAction, onClose,
}: {
  company: AdminCompanyItem
  token: string
  onAction: (updated: AdminCompanyItem) => void
  onClose: () => void
}) {
  const [loading, setLoading] = useState<'approve' | 'suspend' | null>(null)
  const [tab, setTab] = useState<'overview' | 'timeline'>('overview')

  async function approve() {
    setLoading('approve')
    try {
      await adminApprove(token, company.id)
      const eventType = company.status === 'suspended' ? 'reactivated' : 'approved'
      onAction({ ...company, status: 'active', _refreshEvents: eventType } as AdminCompanyItem & { _refreshEvents: string })
    } finally { setLoading(null) }
  }

  async function suspend() {
    setLoading('suspend')
    try {
      await adminSuspend(token, company.id)
      onAction({ ...company, status: 'suspended' })
    } finally { setLoading(null) }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-900">Detalhes</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XCircle size={20} /></button>
      </div>

      {/* Company header */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <Initials name={company.name} logo={company.logo_url} />
          <div>
            <h3 className="font-bold text-gray-900">{company.name}</h3>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[company.status]}`}>
              {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
          <span>{company.email}</span>
          <span>{company.phone ?? '—'}</span>
          <span>{company.industry ?? '—'}</span>
          <span>{[company.address_city, company.address_country].filter(Boolean).join(', ') || '—'}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 px-5">
        {(['overview', 'timeline'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`py-2.5 px-3 text-sm font-medium border-b-2 transition-colors capitalize ${
              tab === t ? 'border-arsx text-arsx' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'timeline' ? '🕐 Histórico' : 'Visão Geral'}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        {tab === 'overview' && (
          <>
            {/* Subscription */}
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Assinatura</p>
              {company.subscription_plan ? (
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-3 text-sm space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Plano</span>
                    <span className="font-medium">{PLAN_LABELS[company.subscription_plan] ?? company.subscription_plan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Situação</span>
                    <span className={`font-medium ${company.subscription_status === 'active' ? 'text-green-700' : 'text-yellow-700'}`}>
                      {company.subscription_status}
                    </span>
                  </div>
                  {company.subscription_period_end && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Renovação</span>
                      <span className="flex items-center gap-1"><Calendar size={12} />{formatDate(company.subscription_period_end)}</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">Nenhuma assinatura ativa</p>
              )}
            </div>

            {/* Registered */}
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Cadastrado em</p>
              <p className="text-sm text-gray-700">{formatDate(company.created_at)}</p>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              {company.status === 'pending' && (
                <button onClick={approve} disabled={!!loading}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-60">
                  {loading === 'approve' ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />}
                  Aprovar Membro
                </button>
              )}
              {company.status === 'active' && (
                <button onClick={suspend} disabled={!!loading}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-60">
                  {loading === 'suspend' ? <Loader2 size={15} className="animate-spin" /> : <XCircle size={15} />}
                  Suspender Membro
                </button>
              )}
              {company.status === 'suspended' && (
                <button onClick={approve} disabled={!!loading}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-60">
                  {loading === 'approve' ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />}
                  Reativar Membro
                </button>
              )}
            </div>
          </>
        )}

        {tab === 'timeline' && (
          <Timeline companyId={company.id} token={token} />
        )}
      </div>
    </div>
  )
}

// ── Admin Users Panel ──────────────────────────────────────────────────────
function AdminUsersPanel({ token }: { token: string }) {
  const [users, setUsers] = useState<AdminUserItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    adminListUsers(token).then(setUsers).finally(() => setLoading(false))
  }, [token])

  useEffect(() => { load() }, [load])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await adminCreateUser(token, form)
      setForm({ name: '', email: '', password: '' })
      setShowForm(false)
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao criar administrador')
    } finally { setSaving(false) }
  }

  async function handleToggle(user: AdminUserItem) {
    try {
      const updated = await adminToggleUser(token, user.id, !user.is_active)
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)))
    } catch { /* ignore */ }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Usuários Administradores</h2>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-arsx text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-arsx/90">
          <UserPlus size={15} /> Novo Admin
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-gray-800">Criar Usuário Administrador</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="label">Nome</label>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="label">E-mail</label>
              <input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required autoComplete="off" />
            </div>
            <div>
              <label className="label">Senha</label>
              <input type="password" className="input" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} autoComplete="new-password" />
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="btn-outline px-4 py-2 text-sm">Cancelar</button>
            <button type="submit" disabled={saving} className="btn-primary px-4 py-2 text-sm flex items-center gap-2 disabled:opacity-60">
              {saving ? <Loader2 size={14} className="animate-spin" /> : null} Criar
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 size={24} className="animate-spin text-gray-300" /></div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Nome</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">E-mail</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Função</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Ativo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                  <td className="px-4 py-3 text-gray-500">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${u.role === 'super_admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-700'}`}>
                      {u.role === 'super_admin' ? 'Super Admin' : 'Administrador'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {u.role !== 'super_admin' && (
                      <button onClick={() => handleToggle(u)} className="text-gray-400 hover:text-arsx">
                        {u.is_active ? <ToggleRight size={22} className="text-green-600" /> : <ToggleLeft size={22} />}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

// ── Main panel ─────────────────────────────────────────────────────────────
function AdminPanel({ token, adminName, adminRole, onLogout }: { token: string; adminName: string; adminRole: string; onLogout: () => void }) {
  const [section, setSection] = useState<'companies' | 'admins'>('companies')
  const [companies, setCompanies] = useState<AdminCompanyItem[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<AdminCompanyItem | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await adminGetCompanies(token, statusFilter || undefined)
      setCompanies(data)
    } finally { setLoading(false) }
  }, [token, statusFilter])

  useEffect(() => { load() }, [load])

  function handleAction(updated: AdminCompanyItem) {
    setCompanies((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
    setSelected(updated)
  }

  const filtered = companies.filter((c) =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    total: companies.length,
    pending: companies.filter((c) => c.status === 'pending').length,
    active: companies.filter((c) => c.status === 'active').length,
    suspended: companies.filter((c) => c.status === 'suspended').length,
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-black tracking-tight">
            <span className="text-arsx">A</span><span className="text-arsx">R</span>
            <span className="text-arsx-light">S</span><span className="text-arsx">X</span>
          </span>
          <span className="text-gray-400 text-sm">Admin</span>
        </div>
        <div className="flex items-center gap-4">
          {adminRole === 'super_admin' && (
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              <button onClick={() => setSection('companies')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${section === 'companies' ? 'bg-white text-arsx shadow-sm' : 'text-gray-500'}`}>
                <Users size={13} /> Empresas
              </button>
              <button onClick={() => setSection('admins')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${section === 'admins' ? 'bg-white text-arsx shadow-sm' : 'text-gray-500'}`}>
                <Shield size={13} /> Admins
              </button>
            </div>
          )}
          <span className="text-sm text-gray-600">{adminName}</span>
          <button onClick={onLogout} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-arsx">
            <LogOut size={15} /> Sair
          </button>
        </div>
      </header>

      {section === 'admins' ? (
        <div className="flex-1 overflow-y-auto p-6">
          <AdminUsersPanel token={token} />
        </div>
      ) : (

      <div className="flex flex-1 overflow-hidden">
        <div className={`flex-1 overflow-y-auto p-6 space-y-6 ${selected ? 'hidden lg:block' : ''}`}>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total de Empresas', value: stats.total, icon: Users, color: 'text-arsx' },
              { label: 'Aguardando Revisão', value: stats.pending, icon: Clock, color: 'text-yellow-600' },
              { label: 'Membros Ativos', value: stats.active, icon: CheckCircle, color: 'text-green-600' },
              { label: 'Suspensos', value: stats.suspended, icon: XCircle, color: 'text-red-500' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Icon size={16} className={color} />
                  <span className="text-xs text-gray-500">{label}</span>
                </div>
                <p className={`text-3xl font-bold ${color}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="input pl-9" placeholder="Buscar por nome ou e-mail..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1">
              {[
                { value: '', label: 'Todos' },
                { value: 'pending', label: 'Pendente' },
                { value: 'active', label: 'Ativo' },
                { value: 'suspended', label: 'Suspenso' },
              ].map((f) => (
                <button key={f.value} onClick={() => setStatusFilter(f.value)}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${statusFilter === f.value ? 'bg-arsx text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-40"><Loader2 size={24} className="animate-spin text-gray-400" /></div>
            ) : filtered.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-gray-400 text-sm">Nenhuma empresa encontrada</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Empresa</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Setor</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Plano</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Desde</th>
                    <th className="w-8" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((c) => (
                    <tr key={c.id} onClick={() => setSelected(c)}
                      className={`hover:bg-gray-50 cursor-pointer transition-colors ${selected?.id === c.id ? 'bg-blue-50' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Initials name={c.name} logo={c.logo_url} />
                          <div>
                            <p className="font-medium text-gray-900">{c.name}</p>
                            <p className="text-xs text-gray-400">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-gray-600">{c.industry ?? '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[c.status]}`}>
                          {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-gray-600">
                        {c.subscription_plan ? PLAN_LABELS[c.subscription_plan] : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-gray-400">{formatDate(c.created_at)}</td>
                      <td className="px-4 py-3"><ChevronRight size={16} className="text-gray-300" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-full lg:w-96 bg-white border-l border-gray-200 flex flex-col">
            <CompanyDetail company={selected} token={token} onAction={handleAction} onClose={() => setSelected(null)} />
          </div>
        )}
      </div>

      )}
    </div>
  )
}

// ── Root ───────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem(SESSION_KEY))
  const [adminName, setAdminName] = useState(() => sessionStorage.getItem(SESSION_NAME) ?? '')
  const [adminRole, setAdminRole] = useState(() => sessionStorage.getItem(SESSION_ROLE) ?? 'admin')

  function handleLogin(t: string, name: string, role: string) {
    setToken(t)
    setAdminName(name)
    setAdminRole(role)
  }

  function handleLogout() {
    sessionStorage.removeItem(SESSION_KEY)
    sessionStorage.removeItem(SESSION_NAME)
    sessionStorage.removeItem(SESSION_ROLE)
    setToken(null)
  }

  if (!token) return <AdminLogin onLogin={handleLogin} />
  return <AdminPanel token={token} adminName={adminName} adminRole={adminRole} onLogout={handleLogout} />
}
