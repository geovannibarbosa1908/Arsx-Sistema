import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle, ArrowRight, Clock, Mail, LayoutDashboard } from 'lucide-react'

const PLAN_LABELS: Record<string, string> = {
  supplier_basic: 'Supplier Basic — $49/mo',
  supplier_premium: 'Supplier Premium — $99/mo',
  buyer_basic: 'Buyer Basic — $29/mo',
  buyer_premium: 'Buyer Premium — $79/mo',
}

const NEXT_STEPS = [
  {
    icon: Clock,
    title: 'Perfil em análise',
    desc: 'Nossa equipe revisará seu perfil de empresa em 24–48 horas.',
  },
  {
    icon: Mail,
    title: 'E-mail de confirmação',
    desc: 'Você receberá um e-mail assim que sua listagem for aprovada e publicada no diretório.',
  },
  {
    icon: LayoutDashboard,
    title: 'Acesse sua conta',
    desc: 'Entre agora para completar seu perfil e começar a receber pedidos de cotação.',
  },
]

export default function PaymentSuccessPage() {
  const [params] = useSearchParams()
  const plan = params.get('plan') ?? ''
  const planLabel = PLAN_LABELS[plan]

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 pt-20 pb-16">
      <div className="w-full max-w-lg text-center">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle size={44} className="text-green-600" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-extrabold text-arsx mb-2">Pagamento Confirmado!</h1>
        <p className="text-gray-500 text-sm mb-1">
          Bem-vindo ao Diretório de Parceiros ARS<span className="text-arsx">X</span>.
        </p>
        {planLabel && (
          <p className="text-sm font-semibold text-arsx mt-1">
            Plano: <span className="text-arsx">{planLabel}</span>
          </p>
        )}

        {/* Divider */}
        <div className="my-8 border-t border-gray-100" />

        {/* Next steps */}
        <h2 className="text-base font-bold text-gray-800 mb-5">O que acontece agora?</h2>
        <div className="space-y-4 text-left">
          {NEXT_STEPS.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="flex gap-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="w-9 h-9 rounded-lg bg-arsx/10 flex items-center justify-center shrink-0">
                <Icon size={18} className="text-arsx" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400">0{i + 1}</span>
                  <p className="text-sm font-semibold text-gray-900">{title}</p>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/login"
            className="btn-primary flex items-center justify-center gap-2 px-8 py-3"
          >
            Entrar na Minha Conta <ArrowRight size={16} />
          </Link>
          <Link
            to="/"
            className="btn-outline px-8 py-3 flex items-center justify-center gap-2"
          >
            Voltar ao Início
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Dúvidas? Entre em contato:{' '}
          <a href="mailto:support@arsx.com.br" className="underline hover:text-arsx">
            support@arsx.com.br
          </a>
        </p>
      </div>
    </div>
  )
}
