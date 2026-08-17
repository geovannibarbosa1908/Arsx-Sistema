import { Check } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Plan {
  id: string
  name: string
  price: number
  features: string[]
  cta: string
  highlight: boolean
  color: string
}

interface Props {
  plan: Plan
}

export default function PlanCard({ plan }: Props) {
  return (
    <div
      className={`relative rounded-xl border-2 p-8 flex flex-col ${plan.color} ${
        plan.highlight ? 'shadow-xl' : 'shadow-sm'
      }`}
    >
      {plan.highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-arsx text-white text-xs font-semibold px-4 py-1 rounded-full">
            Mais Popular
          </span>
        </div>
      )}

      <div>
        <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
        <div className="mt-3 flex items-baseline gap-1">
          {plan.price === 0
            ? <span className="text-4xl font-extrabold text-arsx">Grátis</span>
            : <>
                <span className="text-4xl font-extrabold text-arsx">${plan.price}</span>
                <span className="text-gray-500 text-sm">/mês</span>
              </>
          }
        </div>
      </div>

      <ul className="mt-6 space-y-3 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
            <Check size={16} className="text-arsx mt-0.5 shrink-0" />
            {f}
          </li>
        ))}
      </ul>

      <Link
        to="/register"
        className={`mt-8 block text-center font-semibold py-3 rounded transition-colors ${
          plan.highlight
            ? 'bg-arsx text-white hover:bg-arsx-dark'
            : 'bg-gray-100 text-arsx hover:bg-gray-200'
        }`}
      >
        {plan.cta}
      </Link>
    </div>
  )
}
