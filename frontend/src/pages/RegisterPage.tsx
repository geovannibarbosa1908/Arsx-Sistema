import { useState } from 'react'
import { ChevronRight, ChevronLeft, Loader2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { INDUSTRIES, COUNTRIES } from '../data/mock'
import { createCompany, createCheckout } from '../lib/api'

const STEPS = ['Company Info', 'Address & Social', 'Profile & Tags', 'Plan']

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
              ? 'bg-navy text-white border-navy'
              : 'bg-white text-gray-700 border-gray-300 hover:border-navy'
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  )
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [alreadyRegistered, setAlreadyRegistered] = useState(false)

  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', website: '',
    industry: '',
    founding_year: '', employees: '',
    address_street: '', address_number: '', address_complement: '',
    address_district: '', address_city: '', address_state: '',
    address_country: '', address_zip: '',
    linkedin: '', instagram: '',
    description: '',
    tags: [] as string[],
    certifications: [] as string[],
    networks: [] as string[],
    plan: 'free',
  })

  const set = (key: string, val: unknown) => setForm((f) => ({ ...f, [key]: val }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError(null)
    setAlreadyRegistered(false)
    try {
      const company = await createCompany({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone || null,
        website: form.website || null,
        industry: form.industry || null,
        description: form.description || null,
        founding_year: form.founding_year ? parseInt(form.founding_year) : null,
        employee_count: form.employees || null,
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
          linkedin_url: form.linkedin || null,
          instagram_url: form.instagram || null,
        },
        profile: {
          history: null,
          certifications: form.certifications,
          networks: form.networks,
          tags: form.tags,
        },
      })

      if (form.plan === 'free') {
        navigate('/login?registered=true')
        return
      }

      const { checkout_url } = await createCheckout(
        company.id,
        form.plan,
        `${window.location.origin}/payment-success?plan=${form.plan}`,
        `${window.location.origin}/register`,
      )
      window.location.href = checkout_url
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Registration failed'
      if (msg === 'Email already registered') {
        setAlreadyRegistered(true)
      } else {
        setSubmitError(msg)
      }
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-extrabold text-navy">Register Your Company</h1>
        <p className="text-gray-500 text-sm mt-1">Join the Open Networking directory</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  i < step ? 'bg-brand-green text-white'
                    : i === step ? 'bg-navy text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-[10px] mt-1 font-medium hidden sm:block ${i === step ? 'text-navy' : 'text-gray-400'}`}>
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 ${i < step ? 'bg-brand-green' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8">

          {/* Step 0: Company Info */}
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="section-title">Company Information</h2>

              <div>
                <label className="label">Company Name *</label>
                <input className="input" value={form.name} onChange={(e) => set('name', e.target.value)} required />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Business Email *</label>
                  <input type="email" className="input" value={form.email} onChange={(e) => set('email', e.target.value)} required autoComplete="email" />
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input className="input" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+1 (555) 000-0000" />
                </div>
              </div>

              <div>
                <label className="label">Website</label>
                <input className="input" value={form.website} onChange={(e) => set('website', e.target.value)} placeholder="https://" />
              </div>

              <div>
                <label className="label">Password *</label>
                <input type="password" className="input" value={form.password} onChange={(e) => set('password', e.target.value)} required minLength={8} placeholder="Min. 8 characters" autoComplete="new-password" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Industry</label>
                  <select className="input" value={form.industry} onChange={(e) => set('industry', e.target.value)}>
                    <option value="">Select industry...</option>
                    {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="label">Number of Employees</label>
                  <select className="input" value={form.employees} onChange={(e) => set('employees', e.target.value)}>
                    <option value="">Select...</option>
                    {EMPLOYEE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="label">Year Founded</label>
                <input type="number" className="input" value={form.founding_year} onChange={(e) => set('founding_year', e.target.value)} placeholder="e.g. 2005" min={1800} max={new Date().getFullYear()} />
              </div>
            </div>
          )}

          {/* Step 1: Address & Social */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="section-title">Address & Social Media</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Country *</label>
                  <select className="input" value={form.address_country} onChange={(e) => set('address_country', e.target.value)} required>
                    <option value="">Select country...</option>
                    {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="label">State / Province</label>
                  <input className="input" value={form.address_state} onChange={(e) => set('address_state', e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">City *</label>
                  <input className="input" value={form.address_city} onChange={(e) => set('address_city', e.target.value)} required />
                </div>
                <div>
                  <label className="label">ZIP / Postal Code</label>
                  <input className="input" value={form.address_zip} onChange={(e) => set('address_zip', e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="label">Street Address</label>
                  <input className="input" value={form.address_street} onChange={(e) => set('address_street', e.target.value)} />
                </div>
                <div>
                  <label className="label">Number</label>
                  <input className="input" value={form.address_number} onChange={(e) => set('address_number', e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Complement</label>
                  <input className="input" value={form.address_complement} onChange={(e) => set('address_complement', e.target.value)} placeholder="Suite, Floor..." />
                </div>
                <div>
                  <label className="label">District / Neighborhood</label>
                  <input className="input" value={form.address_district} onChange={(e) => set('address_district', e.target.value)} />
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Social Media</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">LinkedIn URL</label>
                    <input className="input" value={form.linkedin} onChange={(e) => set('linkedin', e.target.value)} placeholder="https://linkedin.com/company/..." />
                  </div>
                  <div>
                    <label className="label">Instagram URL</label>
                    <input className="input" value={form.instagram} onChange={(e) => set('instagram', e.target.value)} placeholder="https://instagram.com/..." />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Profile & Tags */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="section-title">Profile & Services</h2>

              <div>
                <label className="label">Company Description *</label>
                <textarea
                  className="input h-20 resize-none"
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  placeholder="Brief description for the directory listing..."
                  required
                />
              </div>

              <div>
                <label className="label mb-2 block">Services & Expertise</label>
                <ToggleGroup options={SERVICE_TAGS} selected={form.tags} onChange={(v) => set('tags', v)} />
              </div>

              <div>
                <label className="label mb-2 block">Certifications</label>
                <ToggleGroup options={CERT_OPTIONS} selected={form.certifications} onChange={(v) => set('certifications', v)} />
              </div>

              <div>
                <label className="label mb-2 block">Associations & Networks</label>
                <ToggleGroup options={NETWORK_OPTIONS} selected={form.networks} onChange={(v) => set('networks', v)} />
              </div>
            </div>
          )}

          {/* Step 3: Plan */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="section-title">Choose Your Plan</h2>
              <p className="text-sm text-gray-500">
                Start free and upgrade anytime. Paid plans are activated after registration.
              </p>

              <div className="space-y-3">
                {[
                  { id: 'free', name: 'Free', price: 'Free forever', desc: 'Profile visible in directory. Basic contact info only.' },
                  { id: 'pro', name: 'Pro', price: '$29/mo', desc: 'Full access to contacts. Send and receive messages.', popular: false },
                  { id: 'business', name: 'Business', price: '$79/mo', desc: 'Featured listing, analytics, priority support.', popular: true },
                ].map((p) => (
                  <label
                    key={p.id}
                    className={`relative block border-2 rounded-xl p-4 cursor-pointer transition-all ${
                      form.plan === p.id ? 'border-navy bg-navy/5' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input type="radio" name="plan" value={p.id} checked={form.plan === p.id} onChange={() => set('plan', p.id)} className="sr-only" />
                    {p.popular && (
                      <span className="absolute -top-2.5 right-3 bg-navy text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Popular
                      </span>
                    )}
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-gray-900">{p.name}</p>
                      <p className="text-brand-red font-bold">{p.price}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{p.desc}</p>
                  </label>
                ))}
              </div>

              <p className="text-xs text-gray-400 text-center">
                {form.plan === 'free'
                  ? 'Free plan — no credit card required.'
                  : 'After submitting, you\'ll be redirected to a secure Stripe payment page.'}
              </p>
            </div>
          )}
        </div>

        {alreadyRegistered && (
          <p className="mt-4 text-sm text-red-600 text-center">
            This email is already registered.{' '}
            <Link to="/login" className="underline font-medium">Sign in here</Link>.
          </p>
        )}
        {submitError && (
          <p className="mt-4 text-sm text-red-600 text-center">{submitError}</p>
        )}

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            disabled={step === 0}
            className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
            Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 btn-navy"
            >
              Next
              <ChevronRight size={16} />
            </button>
          ) : (
            <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2 disabled:opacity-60">
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <ChevronRight size={16} />}
              {submitting ? 'Submitting...' : form.plan === 'free' ? 'Create Free Profile' : 'Continue to Payment'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
