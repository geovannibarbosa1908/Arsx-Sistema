import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, Send, Inbox, ChevronRight } from 'lucide-react'
import { getQuotesSent, getQuotesReceived, type QuoteDetail } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'

const STATUS_COLORS: Record<string, string> = {
  sent: 'bg-blue-100 text-blue-700',
  viewed: 'bg-yellow-100 text-yellow-700',
  replied: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-500',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function QuoteCard({ quote, mode }: { quote: QuoteDetail; mode: 'sent' | 'received' }) {
  const [expanded, setExpanded] = useState(false)
  const otherName = mode === 'sent' ? quote.supplier_company_name : quote.buyer_company_name
  const otherLogo = mode === 'sent' ? quote.supplier_company_logo : quote.buyer_company_logo
  const otherSlug = mode === 'sent' ? quote.supplier_company_slug : quote.buyer_company_slug

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <button
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
          {otherLogo
            ? <img src={otherLogo} alt={otherName} className="w-full h-full object-cover" />
            : <span className="text-sm font-bold text-gray-400">{otherName.charAt(0)}</span>
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900">{otherName}</p>
          <p className="text-sm text-gray-500 truncate mt-0.5">{quote.message}</p>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[quote.status]}`}>
            {quote.status}
          </span>
          <span className="text-xs text-gray-400">{formatDate(quote.created_at)}</span>
        </div>
        <ChevronRight size={16} className={`text-gray-300 transition-transform ${expanded ? 'rotate-90' : ''}`} />
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-3 border-t border-gray-100 pt-4">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Message</p>
            <p className="text-sm text-gray-700">{quote.message}</p>
          </div>
          {(quote.origin || quote.destination) && (
            <div className="grid grid-cols-2 gap-4">
              {quote.origin && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Origin</p>
                  <p className="text-sm text-gray-700">{quote.origin}</p>
                </div>
              )}
              {quote.destination && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Destination</p>
                  <p className="text-sm text-gray-700">{quote.destination}</p>
                </div>
              )}
            </div>
          )}
          {quote.cargo_details && (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Cargo Details</p>
              <p className="text-sm text-gray-700">{quote.cargo_details}</p>
            </div>
          )}
          <Link
            to={`/company/${otherSlug}`}
            className="inline-flex items-center gap-1.5 text-sm text-navy hover:underline mt-1"
          >
            View company profile →
          </Link>
        </div>
      )}
    </div>
  )
}

export default function QuotesPage() {
  const { company } = useAuth()
  const [tab, setTab] = useState<'sent' | 'received'>('sent')
  const [quotes, setQuotes] = useState<QuoteDetail[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!company) return
    setLoading(true)
    const fn = tab === 'sent'
      ? getQuotesSent(company.id)
      : getQuotesReceived(company.id)
    fn.then(setQuotes).finally(() => setLoading(false))
  }, [tab, company])

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-navy">My RFQs</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your quote requests</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6 w-fit">
        <button
          onClick={() => setTab('sent')}
          className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors ${
            tab === 'sent' ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Send size={14} /> Sent
        </button>
        <button
          onClick={() => setTab('received')}
          className={`flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-colors ${
            tab === 'received' ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Inbox size={14} /> Received
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={28} className="animate-spin text-gray-300" />
        </div>
      ) : quotes.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-medium mb-2">No RFQs {tab}</p>
          {tab === 'sent' && (
            <Link to="/directory" className="text-sm text-navy hover:underline">
              Browse the directory to find suppliers →
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {quotes.map((q) => (
            <QuoteCard key={q.id} quote={q} mode={tab} />
          ))}
        </div>
      )}
    </div>
  )
}
