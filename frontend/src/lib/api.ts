import { getToken } from './auth'

const API_URL = import.meta.env.VITE_API_URL ?? ''

export interface CompanyListItem {
  id: number
  name: string
  slug: string
  industry: string | null
  address_city: string | null
  address_country: string | null
  description: string | null
  logo_url: string | null
  tags: string[]
}

export interface PaginatedCompanies {
  items: CompanyListItem[]
  total: number
  page: number
  page_size: number
  pages: number
}

export interface CompanyProfile {
  history: string | null
  certifications: string[]
  networks: string[]
  tags: string[]
}

export interface CompanyDetail {
  id: number
  name: string
  slug: string
  email: string | null
  phone: string | null
  website: string | null
  industry: string | null
  status: string
  address_street: string | null
  address_number: string | null
  address_complement: string | null
  address_district: string | null
  address_city: string | null
  address_state: string | null
  address_country: string | null
  address_zip: string | null
  linkedin_url: string | null
  instagram_url: string | null
  description: string | null
  founding_year: number | null
  employee_count: string | null
  logo_url: string | null
  banner_url: string | null
  created_at: string
  profile: CompanyProfile | null
  contact_visible: boolean
}

export interface CompanyUpdatePayload {
  name?: string
  phone?: string | null
  website?: string | null
  industry?: string | null
  description?: string | null
  founding_year?: number | null
  employee_count?: string | null
  logo_url?: string | null
  address?: {
    street?: string | null
    number?: string | null
    complement?: string | null
    district?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    zip?: string | null
  }
  social_media?: {
    linkedin_url?: string | null
    instagram_url?: string | null
  }
  profile?: {
    history?: string | null
    certifications?: string[]
    networks?: string[]
    tags?: string[]
  }
}

export interface CompanyCreatePayload {
  name: string
  email: string
  password: string
  phone: string | null
  website: string | null
  industry: string | null
  description: string | null
  founding_year: number | null
  employee_count: string | null
  address: {
    street: string | null
    number: string | null
    complement: string | null
    district: string | null
    city: string | null
    state: string | null
    country: string | null
    zip: string | null
  }
  social_media: {
    linkedin_url: string | null
    instagram_url: string | null
  }
  profile: {
    history: null
    certifications: string[]
    networks: string[]
    tags: string[]
  }
}

function redirectToLogin() {
  localStorage.removeItem('on_token')
  localStorage.removeItem('on_company')
  window.location.href = '/login?expired=true'
}

async function request<T>(path: string, options?: RequestInit, auth = false): Promise<T> {
  const headers: Record<string, string> = {
    ...(options?.headers as Record<string, string>),
  }
  let hadToken = false
  if (auth) {
    const token = getToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
      hadToken = true
    }
  }
  const res = await fetch(`${API_URL}${path}`, { ...options, headers })
  if (!res.ok) {
    if (auth && hadToken && (res.status === 401 || res.status === 403)) {
      const body = await res.json().catch(() => null)
      const detail = body?.detail ?? ''
      if (!detail || detail === 'Invalid token' || detail === 'Not authenticated') {
        redirectToLogin()
        return new Promise(() => {})
      }
      throw new Error(detail || 'Forbidden')
    }
    const err = await res.json().catch(() => ({ detail: 'Request failed' }))
    throw new Error(err.detail ?? 'Request failed')
  }
  return res.json() as Promise<T>
}

export interface TokenResponse {
  access_token: string
  token_type: string
  company: CompanyDetail
}

export function login(email: string, password: string): Promise<TokenResponse> {
  return request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
}

export function forgotPassword(email: string): Promise<{ message: string }> {
  return request('/api/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
}

export function resetPassword(token: string, new_password: string): Promise<{ message: string }> {
  return request('/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, new_password }),
  })
}

export function getCompanies(params: {
  country?: string
  city?: string
  industry?: string
  tag?: string
  page?: number
}): Promise<PaginatedCompanies> {
  const qs = new URLSearchParams()
  if (params.country) qs.set('country', params.country)
  if (params.city) qs.set('city', params.city)
  if (params.industry) qs.set('industry', params.industry)
  if (params.tag) qs.set('tag', params.tag)
  if (params.page) qs.set('page', String(params.page))
  return request(`/api/companies?${qs}`, undefined, true)
}

export function getCompany(slug: string): Promise<CompanyDetail> {
  return request(`/api/companies/${slug}`, undefined, true)
}

export function createCompany(data: CompanyCreatePayload): Promise<CompanyDetail> {
  return request('/api/companies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export function updateCompany(companyId: number, data: CompanyUpdatePayload): Promise<CompanyDetail> {
  return request(`/api/companies/${companyId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }, true)
}

export interface AdminCompanyItem {
  id: number
  name: string
  slug: string
  email: string
  phone: string | null
  industry: string | null
  status: 'pending' | 'active' | 'suspended'
  address_city: string | null
  address_country: string | null
  logo_url: string | null
  created_at: string
  subscription_plan: string | null
  subscription_status: string | null
  subscription_period_end: string | null
}

export interface AdminTokenResponse {
  access_token: string
  token_type: string
  name: string
  role: 'admin' | 'super_admin'
}

export interface AdminUserItem {
  id: number
  name: string
  email: string
  role: 'admin' | 'super_admin'
  is_active: boolean
  created_at: string
}

export interface CompanyEventItem {
  id: number
  event_type: string
  description: string
  created_at: string
}

function adminRequest<T>(path: string, token: string, options?: RequestInit): Promise<T> {
  return request(path, {
    ...options,
    headers: { ...(options?.headers as Record<string, string>), 'Authorization': `Bearer ${token}` },
  })
}

export function adminLogin(email: string, password: string): Promise<AdminTokenResponse> {
  return request('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
}

export function adminSetup(name: string, email: string, password: string): Promise<{ message: string }> {
  return request('/api/admin/setup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })
}

export function adminGetCompanies(token: string, status?: string): Promise<AdminCompanyItem[]> {
  const qs = status ? `?status=${status}` : ''
  return adminRequest(`/api/admin/companies${qs}`, token)
}

export function adminApprove(token: string, companyId: number): Promise<CompanyDetail> {
  return adminRequest(`/api/admin/companies/${companyId}/approve`, token, { method: 'POST' })
}

export function adminSuspend(token: string, companyId: number): Promise<CompanyDetail> {
  return adminRequest(`/api/admin/companies/${companyId}/suspend`, token, { method: 'POST' })
}

export function adminGetEvents(token: string, companyId: number): Promise<CompanyEventItem[]> {
  return adminRequest(`/api/admin/companies/${companyId}/events`, token)
}

export function adminListUsers(token: string): Promise<AdminUserItem[]> {
  return adminRequest('/api/admin/users', token)
}

export function adminCreateUser(token: string, data: { name: string; email: string; password: string }): Promise<AdminUserItem> {
  return adminRequest('/api/admin/users', token, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export function adminToggleUser(token: string, adminId: number, isActive: boolean): Promise<AdminUserItem> {
  return adminRequest(`/api/admin/users/${adminId}`, token, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ is_active: isActive }),
  })
}

export interface QuoteCreatePayload {
  supplier_company_id: number
  message: string
  cargo_details?: string | null
  origin?: string | null
  destination?: string | null
}

export interface QuoteDetail {
  id: number
  buyer_company_id: number
  buyer_company_name: string
  buyer_company_slug: string
  buyer_company_logo: string | null
  supplier_company_id: number
  supplier_company_name: string
  supplier_company_slug: string
  supplier_company_logo: string | null
  message: string
  cargo_details: string | null
  origin: string | null
  destination: string | null
  status: 'sent' | 'viewed' | 'replied' | 'closed'
  created_at: string
}

export function sendQuote(buyerCompanyId: number, data: QuoteCreatePayload): Promise<{ id: number }> {
  return request(`/api/quotes/${buyerCompanyId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }, true)
}

export function getQuotesSent(buyerCompanyId: number): Promise<QuoteDetail[]> {
  return request(`/api/quotes/sent/${buyerCompanyId}`, undefined, true)
}

export function getQuotesReceived(supplierCompanyId: number): Promise<QuoteDetail[]> {
  return request(`/api/quotes/received/${supplierCompanyId}`, undefined, true)
}

export function createCheckout(
  companyId: number,
  planType: string,
  successUrl: string,
  cancelUrl: string,
): Promise<{ checkout_url: string }> {
  return request(`/api/subscriptions/checkout/${companyId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan_type: planType, success_url: successUrl, cancel_url: cancelUrl }),
  })
}
