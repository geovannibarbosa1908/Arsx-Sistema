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
      <div className="bg-arsx-card pt-28 pb-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-extrabold text-white mb-2">Diretório de Empresas</h1>
          <p className="text-blue-200 text-sm">
            Encontre parceiros de negócios verificados em todos os setores — cada empresa foi analisada e aprovada.
          </p>

          <div className="mt-6 bg-white rounded-lg shadow-lg flex items-center overflow-hidden">
            <Search size={18} className="ml-4 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Buscar por nome da empresa ou palavra-chave..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="flex-1 px-3 py-3.5 text-sm outline-none"
            />
            <button
              className="flex items-center gap-2 px-4 py-3.5 text-sm font-medium text-gray-600 border-l hover:bg-gray-50 transition-colors"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal size={16} />
              Filtros
            </button>
            <button className="bg-arsx text-white px-5 py-3.5 text-sm font-semibold hover:bg-red-700 transition-colors">
              Buscar
            </button>
          </div>

          {showFilters && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="input bg-white text-gray-800"
              >
                <option value="">Todos os Países</option>
                {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
              </select>

              <input
                type="text"
                placeholder="Cidade"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="input bg-white"
              />

              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="input bg-white text-gray-800"
              >
                <option value="">Todos os Setores</option>
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
              ? 'Carregando...'
              : <><span className="font-semibold text-gray-900">{results.length}</span> empresas encontradas</>}
          </p>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-sm text-arsx hover:underline"
            >
              <X size={14} />
              Limpar filtros
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-400">
            <Loader2 size={32} className="animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">
            <p className="font-medium">Erro ao carregar o diretório</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Search size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">Nenhuma empresa encontrada</p>
            <p className="text-sm mt-1">Tente ajustar os filtros</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {results.map((c) => (
              <CompanyCard key={c.id} company={c} />
            ))}
          </div>
        )}

        <div className="mt-12 bg-arsx-card rounded-xl p-8 text-center text-white">
          <h2 className="text-xl font-bold">Sua empresa está listada aqui?</h2>
          <p className="text-blue-200 mt-2 text-sm">
            Junte-se à comunidade ARS<span className="text-arsx">X</span> e conecte-se com parceiros de negócios em todo o mundo
          </p>
          <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/register" className="btn-primary">Cadastrar Minha Empresa</a>
            <a href="/plans" className="btn-outline border-white text-white hover:bg-white hover:text-arsx">
              Ver Planos
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
