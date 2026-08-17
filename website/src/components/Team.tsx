import { Linkedin, MapPin, ExternalLink } from 'lucide-react'

const TAGS = ['Internacionalização', 'Oil & Gas Supply Chain', 'Desenvolvimento Industrial', 'Supply Chain Global']

export default function Team() {
  return (
    <section id="nossa-equipe" className="bg-white text-gray-900 section-pad">
      <div className="container-xl">
        <p className="text-[#cc0000] text-sm font-bold uppercase tracking-widest">Equipe</p>
        <h2 className="text-4xl sm:text-5xl font-black mt-2 leading-tight">
          NOSSA <span className="text-[#cc0000]">EQUIPE</span>
        </h2>
        <span className="green-line" />
        <p className="text-gray-500 max-w-xl mb-12 text-sm leading-relaxed">
          Profissionais especializados em comércio internacional, prontos para conectar sua empresa ao mundo.
        </p>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — info */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
            <h3 className="font-black text-2xl text-gray-900">Geovanni Barbosa</h3>
            <p className="text-[#cc0000] font-semibold mt-1">CEO & Fundador</p>

            <div className="flex items-center gap-1.5 text-gray-400 text-xs mt-3">
              <MapPin size={12} />
              Macaé, Rio de Janeiro — Brasil
            </div>

            <div className="flex flex-wrap gap-2 mt-5">
              {TAGS.map(tag => (
                <span key={tag} className="text-xs bg-[#cc0000]/10 text-[#cc0000] px-3 py-1 rounded-full font-medium">
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-gray-500 text-sm leading-relaxed mt-6">
              Com experiência em relações internacionais, supply chain, desenvolvimento de negócios e gestão
              financeira, atua conectando pessoas e oportunidades em escala global — unindo estratégia de
              negócios a soluções práticas de internacionalização.
            </p>

            <ul className="mt-6 space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2"><span className="text-[#cc0000] font-bold mt-0.5">→</span> Avaliação completa para expansão de mercados internacionais</li>
              <li className="flex items-start gap-2"><span className="text-[#cc0000] font-bold mt-0.5">→</span> Suporte à abertura de filiais nos EUA e outros países</li>
              <li className="flex items-start gap-2"><span className="text-[#cc0000] font-bold mt-0.5">→</span> Análise de viabilidade e conexões com +2.000 fornecedores</li>
            </ul>

            <a
              href="https://www.linkedin.com/in/geovannibarbosa"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#cc0000] hover:underline"
            >
              <Linkedin size={15} />
              Ver no LinkedIn
              <ExternalLink size={12} />
            </a>
          </div>

          {/* Right — photo */}
          <div className="relative">
            <img
              src="/geovanni.jpg"
              alt="Geovanni Barbosa"
              className="relative w-full max-w-md mx-auto rounded-2xl object-cover shadow-2xl"
              style={{ aspectRatio: '4/5' }}
            />
            {/* Badge */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-xl px-5 py-3 shadow-lg text-center whitespace-nowrap">
              <p className="font-black text-gray-900 text-sm">Geovanni Barbosa</p>
              <p className="text-[#cc0000] text-xs font-semibold mt-0.5">CEO & Fundador · ARSX</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
