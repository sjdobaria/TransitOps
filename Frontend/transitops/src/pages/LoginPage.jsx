import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, ArrowLeft } from 'lucide-react'
import { loginMockUser } from '../services/api'

const LoginPage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: 'admin@transitops.com', password: 'admin123' })
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await loginMockUser(form.email, form.password)
      if (remember) {
        localStorage.setItem('transitops_remember', 'true')
      } else {
        localStorage.removeItem('transitops_remember')
      }
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.16),_transparent_35%),linear-gradient(135deg,#07111f_0%,#0f172a_55%,#111827_100%)] px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-md items-center justify-center rounded-[32px] border border-slate-800 bg-slate-950/70 p-6 shadow-2xl shadow-slate-950/40 sm:p-8">
        <div className="w-full rounded-[28px] border border-slate-800 bg-slate-900/70 p-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-emerald-300">
            <ArrowLeft size={16} /> Back to home
          </Link>
          <h1 className="mt-8 text-3xl font-semibold text-white">Welcome back</h1>
          <p className="mt-3 text-base leading-7 text-slate-400">
            Sign in to continue to your TransitOps workspace.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Email</label>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
                <Mail size={18} className="text-slate-500" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  className="w-full bg-transparent outline-none"
                  placeholder="you@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">Password</label>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
                <Lock size={18} className="text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                  className="w-full bg-transparent outline-none"
                  placeholder="Enter password"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-400">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={remember} onChange={() => setRemember(!remember)} className="rounded border-slate-700 bg-slate-900" />
                Remember me
              </label>
              <a href="#" className="text-emerald-400 transition hover:text-emerald-300">Forgot password?</a>
            </div>

            {error && <p className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</p>}

            <button type="submit" disabled={loading} className="w-full rounded-2xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
