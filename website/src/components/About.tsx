import { Target, Mountain } from 'lucide-react'

const STATS = [
  { value: 'Operação internacional', label: 'estruturada do zero' },
  { value: '2.000+', label: 'Fornecedores' },
  { value: '3', label: 'Idiomas' },
  { value: 'Global', label: 'Alcance' },
]

export default function About() {
  return (
    <section id="quem-somos" className="bg-white text-gray-900 section-pad">
      <div className="container-xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <p className="text-[#cc0000] text-sm font-bold uppercase tracking-widest">Sobre Nós</p>
            <h2 className="text-4xl sm:text-5xl font-black mt-2 leading-tight">
              SOBRE <span className="text-[#cc0000]">NÓS</span>
            </h2>
            <span className="green-line" />
            <p className="text-gray-600 text-lg leading-relaxed mb-10">
              A Arsx é uma empresa com foco em conectar empresas aos melhores fornecedores e
              oportunidades de mercado global — especializados em internacionalização de negócios
              com presença nos Estados Unidos.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <div className="w-10 h-10 rounded-full bg-[#cc0000]/10 flex items-center justify-center mb-4">
                  <Target size={20} className="text-[#cc0000]" />
                </div>
                <h3 className="font-bold text-[#cc0000] text-sm uppercase tracking-wide mb-1">Visão</h3>
                <span className="block w-8 h-0.5 bg-[#cc0000] mb-3" />
                <p className="text-gray-600 text-sm leading-relaxed">
                  Ser a principal ligação entre fornecedores e empresas no mercado global.
                </p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <div className="w-10 h-10 rounded-full bg-[#cc0000]/10 flex items-center justify-center mb-4">
                  <Mountain size={20} className="text-[#cc0000]" />
                </div>
                <h3 className="font-bold text-[#cc0000] text-sm uppercase tracking-wide mb-1">Missão</h3>
                <span className="block w-8 h-0.5 bg-[#cc0000] mb-3" />
                <p className="text-gray-600 text-sm leading-relaxed">
                  Criar valor e gerar crescimento para nossos parceiros através de conexões estratégicas.
                </p>
              </div>
            </div>
          </div>

          {/* Right — stat cards */}
          <div className="grid grid-cols-2 gap-4">
            {STATS.map(({ value, label }) => (
              <div key={label} className="bg-arsx-dark rounded-xl p-8 flex flex-col items-start">
                <p className="text-4xl font-black text-[#cc0000] leading-none">{value}</p>
                <span className="block w-8 h-0.5 bg-[#cc0000] my-3" />
                <p className="text-gray-300 text-sm font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
