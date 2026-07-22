import { Link } from 'react-router-dom'
import { MapPin, Globe } from 'lucide-react'
import type { CompanyListItem } from '../lib/api'

interface Props {
  company: CompanyListItem
}

const AVATAR_COLORS = ['#1B3068', '#C41717', '#2A8B22', '#F08C00', '#7B3FA8', '#1A7A8A']

function avatarColor(name: string): string {
  let hash = 0
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffff
  return AVATAR_COLORS[hash % AVATAR_COLORS.length]
}

export default function CompanyCard({ company }: Props) {
  const initials = company.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <Link
      to={`/company/${company.slug}`}
      className="group block bg-white rounded-lg border border-gray-200 hover:border-navy hover:shadow-md transition-all overflow-hidden"
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div
            className="w-14 h-14 rounded-lg flex items-center justify-center text-white font-bold text-lg shrink-0"
            style={{ backgroundColor: company.logo_url ? undefined : avatarColor(company.name) }}
          >
            {company.logo_url
              ? <img src={company.logo_url} alt={company.name} className="w-full h-full object-cover rounded-lg" />
              : initials}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 group-hover:text-navy truncate">
              {company.name}
            </h3>
            <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
              <MapPin size={13} className="shrink-0" />
              <span>
                {[company.address_city, company.address_country].filter(Boolean).join(', ')}
              </span>
            </div>
          </div>

          {company.industry && (
            <span className="badge bg-blue-100 text-blue-800 shrink-0 text-xs">
              {company.industry}
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600 mt-3 line-clamp-2">{company.description}</p>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {company.tags.slice(0, 3).map((s) => (
            <span key={s} className="badge bg-gray-100 text-gray-700">{s}</span>
          ))}
          {company.tags.length > 3 && (
            <span className="badge bg-gray-100 text-gray-500">
              +{company.tags.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-center justify-end mt-4 pt-3 border-t border-gray-100">
          <Globe size={14} className="text-gray-200 group-hover:text-navy transition-colors" />
        </div>
      </div>
    </Link>
  )
}
