import { Link } from 'react-router-dom'
import PlanCard from '../components/PlanCard'
import { PLANS } from '../data/mock'
import { HelpCircle } from 'lucide-react'

export default function PlansPage() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-navy py-14 px-4 text-center">
        <h1 className="text-3xl font-extrabold text-white">Simple, Transparent Pricing</h1>
        <p className="text-blue-200 mt-2 text-sm">
          Start free. Upgrade when you're ready to connect.
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
          <h2 className="text-xl font-bold text-navy text-center mb-8">Common Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Is the Free plan really free?',
                a: 'Yes. Creating your company profile is completely free. Your basic info and description will be visible in the directory. Upgrade to Pro or Business to unlock contact details and send messages.',
              },
              {
                q: 'What happens after I register?',
                a: 'Your profile is reviewed by our team within 24–48 hours. Once approved, your company appears in the directory immediately.',
              },
              {
                q: 'How do members contact each other?',
                a: 'Pro and Business members can view full contact details and send messages directly through the directory. Free members can browse profiles but need to upgrade to access contacts.',
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Yes. All paid plans are billed monthly and can be cancelled at any time. Your listing remains active until the end of the billing period.',
              },
            ].map(({ q, a }) => (
              <div key={q} className="border border-gray-200 rounded-lg p-5">
                <div className="flex items-start gap-3">
                  <HelpCircle size={18} className="text-navy mt-0.5 shrink-0" />
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
            Create Free Profile
          </Link>
          <p className="text-xs text-gray-400 mt-3">No credit card required for the free plan</p>
        </div>
      </div>
    </div>
  )
}
