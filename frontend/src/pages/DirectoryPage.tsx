import { useState, useEffect, useMemo } from 'react'
import { Search, SlidersHorizontal, X, Loader2 } from 'lucide-react'
import CompanyCard from '../components/CompanyCard'
import { getCompanies, type CompanyListItem } from '../lib/api'
import { INDUSTRIES, COUNTRIES } from '../data/mock'

export default function DirectoryPage() {
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [industry, setIndustry] = useState('')
  const [keyword, setKeyword] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const [items, setItems] = useState<CompanyListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getCompanies({
      country: country || undefined,
      city: city || undefined,
      industry: industry || undefined,
    })
      .then((data) => { setItems(data.items); setLoading(false) })
      .catch((err: Error) => { setError(err.message); setLoading(false) })
  }, [country, city, industry])

  const results = useMemo(() => {
    if (!keyword) return items
    const kw = keyword.toLowerCase()
    return items.filter(
      (c) =>
        c.name.toLowerCase().includes(kw) ||
        (c.description ?? '').toLowerCase().includes(kw),
    )
  }, [items, keyword])

  const hasFilters = country || city || industry || keyword

  function clearFilters() {
    setCountry('')
    setCity('')
    setIndustry('')
    setKeyword('')
  }

  return (
    <div>
      <div className="bg-navy py-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-extrabold text-white mb-2">Member Directory</h1>
          <p className="text-blue-200 text-sm">
            Find verified business partners across all industries — every company has been screened and approved.
          </p>

          <div className="mt-6 bg-white rounded-lg shadow-lg flex items-center overflow-hidden">
            <Search size={18} className="ml-4 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by company name or keyword..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="flex-1 px-3 py-3.5 text-sm outline-none"
            />
            <button
              className="flex items-center gap-2 px-4 py-3.5 text-sm font-medium text-gray-600 border-l hover:bg-gray-50 transition-colors"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>
            <button className="bg-brand-red text-white px-5 py-3.5 text-sm font-semibold hover:bg-red-700 transition-colors">
              Search
            </button>
          </div>

          {showFilters && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="input bg-white text-gray-800"
              >
                <option value="">All Countries</option>
                {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
              </select>

              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="input bg-white"
              />

              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="input bg-white text-gray-800"
              >
                <option value="">All Industries</option>
                {INDUSTRIES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-gray-600">
            {loading
              ? 'Loading...'
              : <><span className="font-semibold text-gray-900">{results.length}</span> companies found</>}
          </p>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-sm text-brand-red hover:underline"
            >
              <X size={14} />
              Clear filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-400">
            <Loader2 size={32} className="animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">
            <p className="font-medium">Failed to load directory</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Search size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No companies found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {results.map((c) => (
              <CompanyCard key={c.id} company={c} />
            ))}
          </div>
        )}

        <div className="mt-12 bg-navy rounded-xl p-8 text-center text-white">
          <h2 className="text-xl font-bold">Is your company listed here?</h2>
          <p className="text-blue-200 mt-2 text-sm">
            Join the Open Networking community and connect with business partners worldwide
          </p>
          <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/register" className="btn-primary">List My Company</a>
            <a href="/plans" className="btn-outline border-white text-white hover:bg-white hover:text-navy">
              View Plans
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
