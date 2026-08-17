import { Link } from 'react-router-dom'
import PlanCard from '../components/PlanCard'
import { PLANS } from '../data/mock'
import { HelpCircle } from 'lucide-react'

export default function PlansPage() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-arsx-card pt-28 pb-14 px-4 text-center">
        <h1 className="text-3xl font-extrabold text-white">Preços Simples e Transparentes</h1>
        <p className="text-blue-200 mt-2 text-sm">
          Comece grátis. Faça upgrade quando estiver pronto para se conectar.
        </p>
      </div>

      {/* Plan cards */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
          {PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-14">
          <h2 className="text-xl font-bold text-arsx text-center mb-8">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {[
              {
                q: 'O plano gratuito é realmente grátis?',
                a: 'Sim. Criar seu perfil de empresa é completamente gratuito. Suas informações básicas e descrição ficarão visíveis no diretório. Faça upgrade para Pro ou Business para desbloquear detalhes de contato e enviar mensagens.',
              },
              {
                q: 'O que acontece após o cadastro?',
                a: 'Seu perfil é revisado pela nossa equipe em 24–48 horas. Após aprovado, sua empresa aparece imediatamente no diretório.',
              },
              {
                q: 'Como os membros entram em contato entre si?',
                a: 'Membros Pro e Business podem ver todos os dados de contato e enviar mensagens diretamente pelo diretório. Membros gratuitos podem navegar pelos perfis, mas precisam fazer upgrade para acessar os contatos.',
              },
              {
                q: 'Posso cancelar a qualquer momento?',
                a: 'Sim. Todos os planos pagos são cobrados mensalmente e podem ser cancelados a qualquer momento. Sua listagem permanece ativa até o fim do período de cobrança.',
              },
            ].map(({ q, a }) => (
              <div key={q} className="border border-gray-200 rounded-lg p-5">
                <div className="flex items-start gap-3">
                  <HelpCircle size={18} className="text-arsx mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{q}</p>
                    <p className="text-sm text-gray-600 mt-1">{a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link to="/register" className="btn-primary">
            Criar Perfil Gratuito
          </Link>
          <p className="text-xs text-gray-400 mt-3">Nenhum cartão de crédito necessário para o plano gratuito</p>
        </div>
      </div>
    </div>
  )
}
