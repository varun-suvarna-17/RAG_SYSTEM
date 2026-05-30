import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import useAuthStore from '../store/authStore'
import Navbar from '../components/Navbar'
import GlassCard from '../components/GlassCard'
import { HiOutlineLockClosed, HiSparkles } from 'react-icons/hi2'

export default function AdminLogin() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { data } = await api.post('/api/admin/login', { username, password })
      login(data.username, data.token)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="void-grid-bg flex min-h-screen flex-col">
      <Navbar showLinks={false} />

      <main className="relative flex flex-1 items-center justify-center px-4 py-12">
        <div
          className="pointer-events-none absolute top-1/4 h-72 w-72 rounded-full bg-[#D6FF3F]/10 blur-3xl"
          aria-hidden
        />

        <GlassCard className="relative w-full max-w-md border-[rgba(214,255,63,0.2)] shadow-[0_0_60px_rgba(214,255,63,0.08)]">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#D6FF3F]/12 ring-1 ring-[#D6FF3F]/25">
              <HiOutlineLockClosed className="text-2xl text-[#D6FF3F]" />
            </div>
            <h1 className="text-2xl font-bold text-[#F5F5E8]">Admin Login</h1>
            <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-[#9CA38A]">
              <HiSparkles className="text-[#D6FF3F]" />
              void.ai management portal
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-[#9CA38A]">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
                autoComplete="username"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-[#9CA38A]">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                autoComplete="current-password"
                required
              />
            </div>

            <p className="text-center text-xs text-[#6B7C2A]">
              Use credentials created via <code className="text-[#9CA38A]">python auth/auth_handler.py</code>
            </p>

            {error && (
              <p className="rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-center text-sm text-red-400">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[#9CA38A]">
            <Link to="/" className="text-[#D6FF3F] transition hover:underline">
              ← Back to home
            </Link>
          </p>
        </GlassCard>
      </main>
    </div>
  )
}
