import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, ArrowLeft } from 'lucide-react'
import { forgotPassword } from '../lib/api'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await forgotPassword(email)
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-navy">Forgot Password</h1>
          <p className="text-gray-500 text-sm mt-1">We'll send a reset link to your email</p>
        </div>

        {sent ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center space-y-4">
            <p className="text-green-700 font-medium">Reset link sent!</p>
            <p className="text-sm text-gray-500">
              If <strong>{email}</strong> is registered, you'll receive an email with a link to reset your password. Check your inbox (and spam folder).
            </p>
            <Link to="/login" className="inline-flex items-center gap-1 text-sm text-navy font-medium hover:underline">
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 space-y-5">
            <div>
              <label className="label">Business Email</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <p className="text-center">
              <Link to="/login" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-navy">
                <ArrowLeft size={14} /> Back to Sign In
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
