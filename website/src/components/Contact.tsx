import { useState, type FormEvent } from 'react'
import { Phone, Mail, Globe, Send } from 'lucide-react'
import { submitContact, type ContactData } from '../lib/api'

type Status = 'idle' | 'loading' | 'success' | 'error'

const EMPTY: ContactData = {
  first_name: '',
  last_name: '',
  email: '',
  company: '',
  phone: '',
  how_found: '',
  message: '',
}

export default function Contact() {
  const [form, setForm] = useState<ContactData>(EMPTY)
  const [status, setStatus] = useState<Status>('idle')

  const set = (field: keyof ContactData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      await submitContact(form)
      setStatus('success')
      setForm(EMPTY)
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contato" className="bg-arsx-dark section-pad border-t border-arsx-border">
      <div className="container-xl">
        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Left info */}
          <div className="lg:col-span-2">
            <p className="text-[#cc0000] text-sm font-bold uppercase tracking-widest">Contato</p>
            <h2 className="text-4xl sm:text-5xl font-black mt-2 leading-tight text-white">
              ENTRE EM <span className="text-[#cc0000]">CONTATO</span>
            </h2>
            <span className="green-line" />
            <p className="text-gray-400 mb-10 leading-relaxed">
              Estamos prontos para atender você e sua empresa. Fale conosco em Português, Inglês ou Espanhol.
            </p>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#cc0000] flex items-center justify-center shrink-0">
                  <Phone size={16} className="text-black" />
                </div>
                <div>
                  <p className="text-[#cc0000] text-xs font-bold uppercase tracking-widest mb-0.5">Telefone</p>
                  <a href="tel:+5522981544419" className="text-gray-300 text-sm hover:text-white transition-colors">
                    +55 22 98154-4419
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#cc0000] flex items-center justify-center shrink-0">
                  <Mail size={16} className="text-black" />
                </div>
                <div>
                  <p className="text-[#cc0000] text-xs font-bold uppercase tracking-widest mb-0.5">Email</p>
                  <a href="mailto:geovannibarbosa@hotmail.com" className="text-gray-300 text-sm hover:text-white transition-colors break-all">
                    geovannibarbosa@hotmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#cc0000] flex items-center justify-center shrink-0">
                  <Globe size={16} className="text-black" />
                </div>
                <div>
                  <p className="text-[#cc0000] text-xs font-bold uppercase tracking-widest mb-0.5">Atendimento</p>
                  <p className="text-gray-300 text-sm">
                    <span className="text-[#cc0000] font-semibold">Português</span> · Inglês · Espanhol
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right form */}
          <div className="lg:col-span-3 bg-arsx-card border border-arsx-border rounded-2xl p-8">
            {status === 'success' ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 rounded-full bg-[#cc0000]/10 flex items-center justify-center mx-auto mb-4">
                  <Send size={24} className="text-[#cc0000]" />
                </div>
                <p className="font-bold text-white text-lg">Mensagem enviada com sucesso!</p>
                <p className="text-gray-400 text-sm mt-2">Nossa equipe retornará em breve.</p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-6 btn-outline-green"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wide mb-1.5">Primeiro Nome *</label>
                    <input
                      required
                      value={form.first_name}
                      onChange={set('first_name')}
                      className="w-full bg-arsx-dark border border-arsx-border rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#cc0000] transition-colors placeholder:text-gray-600"
                      placeholder="João"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wide mb-1.5">Sobrenome *</label>
                    <input
                      required
                      value={form.last_name}
                      onChange={set('last_name')}
                      className="w-full bg-arsx-dark border border-arsx-border rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#cc0000] transition-colors placeholder:text-gray-600"
                      placeholder="Silva"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wide mb-1.5">Email *</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={set('email')}
                      className="w-full bg-arsx-dark border border-arsx-border rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#cc0000] transition-colors placeholder:text-gray-600"
                      placeholder="joao@empresa.com"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wide mb-1.5">Empresa</label>
                    <input
                      value={form.company ?? ''}
                      onChange={set('company')}
                      className="w-full bg-arsx-dark border border-arsx-border rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#cc0000] transition-colors placeholder:text-gray-600"
                      placeholder="Sua empresa"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wide mb-1.5">Telefone</label>
                    <input
                      value={form.phone ?? ''}
                      onChange={set('phone')}
                      className="w-full bg-arsx-dark border border-arsx-border rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#cc0000] transition-colors placeholder:text-gray-600"
                      placeholder="+55 (00) 00000-0000"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wide mb-1.5">Como nos conheceu?</label>
                    <select
                      value={form.how_found ?? ''}
                      onChange={set('how_found')}
                      className="w-full bg-arsx-dark border border-arsx-border rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#cc0000] transition-colors"
                    >
                      <option value="">Selecione...</option>
                      <option>LinkedIn</option>
                      <option>Google</option>
                      <option>Indicação</option>
                      <option>Instagram</option>
                      <option>Outro</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wide mb-1.5">Mensagem *</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={set('message')}
                    className="w-full bg-arsx-dark border border-arsx-border rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-[#cc0000] transition-colors resize-none placeholder:text-gray-600"
                    placeholder="Como podemos ajudar sua empresa?"
                  />
                </div>
                {status === 'error' && (
                  <p className="text-red-400 text-xs">Erro ao enviar mensagem. Tente novamente ou entre em contato pelo email.</p>
                )}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-green w-full justify-center disabled:opacity-60"
                >
                  {status === 'loading' ? 'Enviando...' : 'Enviar Mensagem'}
                  <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
