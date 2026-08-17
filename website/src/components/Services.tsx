import { TrendingUp, Building2, Search, Cog, Leaf, Droplet, Cpu, Plane, Bot, Music, Tag } from 'lucide-react'

const SERVICES = [
  {
    icon: TrendingUp,
    title: 'Avaliação de Expansão',
    desc: 'Avaliação completa do momento da sua empresa para identificar se ela está pronta para expandir para outros mercados, incluindo pontos fortes, riscos e próximos passos recomendados.',
  },
  {
    icon: Building2,
    title: 'Abertura de Filial',
    desc: 'Suporte estratégico completo para planejar e estruturar a abertura de uma filial ou operação da sua empresa em outro país, do planejamento inicial à execução.',
  },
  {
    icon: Search,
    title: 'Viabilidade de Mercado',
    desc: 'Análise de viabilidade de mercados internacionais específicos, considerando concorrência, demanda, regulamentação e potencial de crescimento para o seu setor.',
  },
]

const SECTORS = [
  { icon: Cog, label: 'Industrial', desc: 'Peças, componentes e maquinários' },
  { icon: Leaf, label: 'Agronegócio', desc: 'Insumos, commodities e equipamentos' },
  { icon: Droplet, label: 'Petróleo e Gás', desc: 'Suprimentos, equipamentos e operações' },
  { icon: Cpu, label: 'Eletrônicos', desc: 'Produtos de consumo, comerciais e industriais' },
  { icon: Plane, label: 'Aeroespacial', desc: 'Peças e componentes para aviação' },
  { icon: Bot, label: 'Drones e Tecnologia', desc: 'Inovação, tecnologia e acessórios' },
  { icon: Music, label: 'Instrumentos Musicais', desc: 'Marcas globais e distribuição' },
  { icon: Tag, label: 'Marca Própria', desc: 'Desenvolvimento de produtos personalizados' },
]

export default function Services() {
  return (
    <section id="atuacao" className="relative section-pad overflow-hidden">

      {/* Canva background — loop dinâmico */}
      <div className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
        <iframe
          src="https://www.canva.com/design/DAHSiZjoFQM/gvfF0A0uvn4WWFXw_2TB2g/view?embed&autoplay=1&loop=1"
          allow="fullscreen; autoplay"
          allowFullScreen
          title="ARSX background"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            border: 'none',
            transform: 'scale(1.02)',
          }}
        />
      </div>

      {/* Overlay para legibilidade do conteúdo */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />

      <div className="relative z-10 container-xl">
        {/* Services */}
        <div className="mb-20">
          <p className="text-[#cc0000] text-sm font-bold uppercase tracking-widest">Serviços</p>
          <h2 className="text-4xl sm:text-5xl font-black mt-2 leading-tight">
            NOSSOS <span className="text-[#cc0000]">SERVIÇOS</span>
          </h2>
          <span className="green-line" />
          <p className="text-gray-400 max-w-2xl mb-12 leading-relaxed">
            Experiência em relações internacionais, supply chain, desenvolvimento de negócios e gestão financeira —
            conectando pessoas e oportunidades em escala global.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {SERVICES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-[#111111]/70 backdrop-blur-md border border-white/10 rounded-xl p-6 group hover:border-[#cc0000]/40 hover:bg-[#cc0000]/10 transition-colors">
                <div className="w-10 h-0.5 bg-[#cc0000] mb-5" />
                <div className="w-10 h-10 rounded-lg bg-[#cc0000]/10 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-[#cc0000]/40" />
                </div>
                <h3 className="font-bold text-white mb-3">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sectors */}
        <div>
          <div className="flex flex-col lg:flex-row lg:items-start gap-12">
            <div className="lg:w-64 shrink-0">
              <p className="text-[#cc0000] text-sm font-bold uppercase tracking-widest">Setores</p>
              <h2 className="text-3xl sm:text-4xl font-black mt-2 leading-tight">
                SETORES QUE <span className="text-[#cc0000]">ATENDEMOS</span>
              </h2>
              <span className="green-line" />
              <p className="text-gray-400 text-sm leading-relaxed">
                Apoiamos empresas em todo o mundo com soluções de{' '}
                <span className="text-[#cc0000] font-semibold">abastecimento, suprimentos e comércio internacional</span>{' '}
                em diversos setores estratégicos.
              </p>
            </div>

            <div className="flex-1 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {SECTORS.map(({ icon: Icon, label, desc }) => (
                <div key={label} className="bg-[#111111]/70 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:bg-[#cc0000]/10 hover:border-[#cc0000]/30 transition-colors group">
                  <div className="w-9 h-9 rounded-lg bg-[#cc0000]/10 flex items-center justify-center mb-3 group-hover:bg-[#cc0000]/20 transition-colors">
                    <Icon size={18} className="text-[#cc0000]" />
                  </div>
                  <p className="font-bold text-[#cc0000] text-xs uppercase tracking-wide mb-1">{label}</p>
                  <span className="block w-6 h-0.5 bg-[#cc0000] mb-2" />
                  <p className="text-gray-400 text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
