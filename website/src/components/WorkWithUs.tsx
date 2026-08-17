import { useState, type FormEvent } from 'react'
import { X, Send, Briefcase } from 'lucide-react'
import { submitJob, type JobData } from '../lib/api'

type Status = 'idle' | 'loading' | 'success' | 'error'

const EMPTY: JobData = {
  first_name: '',
  last_name: '',
  email: '',
  linkedin: '',
  how_found: '',
  skills: '',
}

function Modal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<JobData>(EMPTY)
  const [status, setStatus] = useState<Status>('idle')

  const set = (field: keyof JobData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      await submitJob(form)
      setStatus('success')
      setForm(EMPTY)
    } catch {
      setStatus('error')
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <X size={22} />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-black text-gray-900 text-center mb-6">Trabalhe Conosco</h2>

          {status === 'success' ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-full bg-[#cc0000]/10 flex items-center justify-center mx-auto mb-4">
                <Send size={24} className="text-[#cc0000]" />
              </div>
              <p className="font-bold text-gray-900 text-lg">Candidatura enviada!</p>
              <p className="text-gray-500 text-sm mt-2">Entraremos em contato em breve.</p>
              <button onClick={onClose} className="mt-6 btn-green mx-auto">
                Fechar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  placeholder="Nome"
                  value={form.first_name}
                  onChange={set('first_name')}
                  className="border border-gray-200 rounded-full px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#cc0000] transition-colors bg-gray-50"
                />
                <input
                  required
                  placeholder="Sobrenome"
                  value={form.last_name}
                  onChange={set('last_name')}
                  className="border border-gray-200 rounded-full px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#cc0000] transition-colors bg-gray-50"
                />
              </div>
              <input
                required
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={set('email')}
                className="w-full border border-gray-200 rounded-full px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#cc0000] transition-colors bg-gray-50"
              />
              <input
                placeholder="LinkedIn (URL)"
                value={form.linkedin ?? ''}
                onChange={set('linkedin')}
                className="w-full border border-gray-200 rounded-full px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#cc0000] transition-colors bg-gray-50"
              />
              <input
                placeholder="Como conheceu a ARSX?"
                value={form.how_found ?? ''}
                onChange={set('how_found')}
                className="w-full border border-gray-200 rounded-full px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#cc0000] transition-colors bg-gray-50"
              />
              <textarea
                required
                rows={4}
                placeholder="Quais habilidades você acredita que podem contribuir com a gente?"
                value={form.skills}
                onChange={set('skills')}
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-[#cc0000] transition-colors bg-gray-50 resize-none"
              />
              {status === 'error' && (
                <p className="text-red-500 text-xs text-center">Erro ao enviar. Tente novamente.</p>
              )}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-green justify-center w-full disabled:opacity-60"
                >
                  {status === 'loading' ? 'Enviando...' : 'Enviar'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-outline-green justify-center w-full"
                >
                  Fechar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default function WorkWithUs() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <section id="trabalhe-conosco" className="bg-arsx-card section-pad border-t border-arsx-border">
        <div className="container-xl text-center">
          <div className="w-14 h-14 rounded-full bg-[#cc0000]/10 flex items-center justify-center mx-auto mb-6">
            <Briefcase size={26} className="text-[#cc0000]" />
          </div>
          <p className="text-[#cc0000] text-sm font-bold uppercase tracking-widest mb-2">Carreiras</p>
          <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">
            TRABALHE <span className="text-[#cc0000]">CONOSCO</span>
          </h2>
          <span className="block w-10 h-0.5 bg-[#cc0000] mx-auto mt-3 mb-6" />
          <p className="text-gray-400 max-w-xl mx-auto leading-relaxed mb-8">
            Nossa equipe diferenciada e personalizada pode fazer parte da{' '}
            <span className="text-[#cc0000] font-semibold">SUA</span> trajetória. Se você tem paixão
            por comércio internacional e negócios globais, queremos te conhecer.
          </p>
          <button onClick={() => setModalOpen(true)} className="btn-green text-base">
            Enviar Candidatura <Send size={18} />
          </button>
        </div>
      </section>

      {modalOpen && <Modal onClose={() => setModalOpen(false)} />}
    </>
  )
}
