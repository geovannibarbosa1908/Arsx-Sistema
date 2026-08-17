import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const registered = params.get('registered') === 'true'
  const resetDone = params.get('reset') === 'true'
  const expired = params.get('expired') === 'true'
  const next = params.get('next') || '/directory'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await login(email, password)
      navigate(next, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao entrar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-arsx">Acesso de Membros</h1>
          <p className="text-gray-500 text-sm mt-1">Acesse o Diretório de Parceiros ARS<span className="text-arsx">X</span></p>
        </div>

        {expired && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            Sua sessão expirou. Por favor, entre novamente.
          </div>
        )}

        {registered && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
            Cadastro concluído! Sua conta está aguardando aprovação. Você já pode entrar e terá acesso completo após a aprovação.
          </div>
        )}

        {resetDone && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
            Senha atualizada com sucesso. Entre com sua nova senha.
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 space-y-5">
          <div>
            <label className="label">E-mail Corporativo</label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="label">Senha</label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <div className="flex items-center justify-between text-sm">
            <Link to="/forgot-password" className="text-gray-500 hover:text-arsx hover:underline">
              Esqueceu a senha?
            </Link>
            <Link to="/register" className="text-arsx font-medium hover:underline">
              Cadastre sua empresa
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
