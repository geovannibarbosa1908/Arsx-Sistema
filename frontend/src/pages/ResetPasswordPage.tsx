import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { resetPassword } from '../lib/api'

export default function ResetPasswordPage() {
  const [params] = useSearchParams()
  const token = params.get('token') ?? ''
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setError('As senhas não coincidem')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await resetPassword(token, password)
      navigate('/login?reset=true')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha na redefinição')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 pt-20">
        <div className="text-center">
          <p className="text-red-600 font-medium">Link de redefinição inválido.</p>
          <Link to="/forgot-password" className="text-sm text-arsx hover:underline mt-2 block">
            Solicitar um novo
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-arsx">Redefinir Senha</h1>
          <p className="text-gray-500 text-sm mt-1">Escolha uma nova senha para sua conta</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 space-y-5">
          <div>
            <label className="label">Nova Senha</label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              placeholder="Mín. 8 caracteres"
            />
          </div>

          <div>
            <label className="label">Confirmar Senha</label>
            <input
              type="password"
              className="input"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={8}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            {loading ? 'Salvando...' : 'Definir Nova Senha'}
          </button>
        </form>
      </div>
    </div>
  )
}
