import { FileText, Lightbulb, Tag, Users, Globe, ArrowRight } from 'lucide-react'

const ITEMS = [
  { icon: FileText, label: 'Registro de patentes de produtos' },
  { icon: Lightbulb, label: 'Desenvolvimento de novos produtos' },
  { icon: Tag, label: 'Produtos de marca própria (Private Label)' },
  { icon: Users, label: 'Consultoria completa de A a Z' },
  { icon: Globe, label: 'Conexões com fabricantes globais' },
]

export default function WhatWeHave() {
  return (
    <section className="bg-arsx-dark section-pad">
      <div className="container-xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — dark list */}
          <div>
            <p className="text-[#cc0000] text-sm font-bold uppercase tracking-widest">Soluções Completas</p>
            <h2 className="text-4xl sm:text-5xl font-black mt-2 leading-tight text-white">
              O QUE MAIS <span className="text-[#cc0000]">TEMOS?</span>
            </h2>
            <span className="green-line" />

            <div className="mt-4 divide-y divide-arsx-border">
              {ITEMS.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-4 py-4">
                  <div className="w-9 h-9 rounded-full bg-[#cc0000] flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-black" />
                  </div>
                  <p className="text-gray-200 font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — CTA block */}
          <div className="bg-white rounded-2xl p-10 text-gray-900 relative overflow-hidden">
            <div
              className="absolute top-0 right-0 w-48 h-48 opacity-5 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, #cc0000 1px, transparent 1px)',
                backgroundSize: '16px 16px',
              }}
            />
            <h3 className="text-4xl font-black leading-tight">
              Sua <span className="text-[#cc0000]">Ideia.</span><br />
              Nossa<br />
              <span className="text-[#cc0000]">Execução.</span>
            </h3>
            <span className="block w-10 h-0.5 bg-[#cc0000] my-4" />
            <p className="text-gray-600 leading-relaxed mb-3">
              Nossa equipe diferenciada e personalizada pode fazer parte da{' '}
              <span className="text-[#cc0000] font-semibold">SUA</span> equipe.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Fazemos as conexões necessárias com fabricantes, estudamos suas necessidades específicas
              e calculamos seu ticket médio — transformando seu sonho em realidade.
            </p>
            <a href="#contato" className="btn-green">
              Fale com nossa equipe <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
