import { ShieldCheck, Package, BadgeDollarSign, TrendingUp, Award, Globe } from 'lucide-react'

const REASONS = [
  {
    num: 1,
    icon: ShieldCheck,
    title: 'Controle de Qualidade',
    desc: 'Todos os carregamentos são inspecionados e verificados antes do envio.',
  },
  {
    num: 2,
    icon: Package,
    title: 'Segurança no Envio',
    desc: 'Embalagem e cravamento completos para proteger seus produtos durante todo o transporte.',
  },
  {
    num: 3,
    icon: BadgeDollarSign,
    title: 'Custos Competitivos',
    desc: 'Frete internacional exclusivo com tarifas competitivas e logística profissional.',
  },
  {
    num: 4,
    icon: TrendingUp,
    title: 'Poder de Barganha',
    desc: 'Compramos em grande volume para maximizar a margem de lucro do cliente.',
  },
  {
    num: 5,
    icon: Award,
    title: 'Representação de Marcas',
    desc: 'Oportunidade de representar marcas conceituadas e ser distribuidor credenciado.',
  },
  {
    num: 6,
    icon: Globe,
    title: 'Suporte Multilíngue',
    desc: 'Atendimento fluente em Português, Inglês e Espanhol.',
  },
]

export default function WhyArsx() {
  return (
    <section className="bg-white text-gray-900 section-pad">
      <div className="container-xl">
        <p className="text-[#cc0000] text-sm font-bold uppercase tracking-widest">Diferenciais</p>
        <h2 className="text-4xl sm:text-5xl font-black mt-2 leading-tight">
          POR QUE ESCOLHER A <span className="text-[#cc0000]">ARSX?</span>
        </h2>
        <span className="green-line" />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {REASONS.map(({ num, icon: Icon, title, desc }) => (
            <div
              key={num}
              className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:border-[#cc0000]/40 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-9 h-9 rounded-full bg-arsx-dark flex items-center justify-center shrink-0 text-white font-black text-sm">
                  {num}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{title}</h3>
                  <span className="block w-8 h-0.5 bg-[#cc0000] mt-1.5" />
                </div>
                <Icon size={22} className="text-[#cc0000] shrink-0" />
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
