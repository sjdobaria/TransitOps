import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, ArrowLeft, Truck, Activity, ShieldCheck, Sparkles } from 'lucide-react'
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
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_35%),linear-gradient(135deg,#07111f_0%,#0f172a_55%,#111827_100%)] px-4 py-8 text-slate-100 sm:px-6 lg:flex lg:items-center lg:justify-center lg:px-8">
      {/* Ambient background glow rings */}
      <div className="pointer-events-none absolute left-1/4 top-10 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-10 right-1/4 h-96 w-96 translate-x-1/2 rounded-full bg-sky-500/10 blur-[120px]" />

      <div className="relative z-10 mx-auto w-full max-w-5xl overflow-hidden rounded-[36px] border border-slate-800/80 bg-slate-950/80 shadow-2xl shadow-slate-950/80 backdrop-blur-2xl lg:grid lg:grid-cols-12">
        
        {/* Left Showcase & Feature Banner */}
        <div className="relative hidden flex-col justify-between border-b border-slate-800/80 bg-gradient-to-br from-slate-900/95 via-slate-900/60 to-slate-950/95 p-10 lg:col-span-5 lg:flex lg:border-b-0 lg:border-r">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-emerald-400">
              <ArrowLeft size={16} /> Back to home
            </Link>

            <h2 className="mt-8 text-3xl font-extrabold tracking-tight text-white xl:text-4xl">
              Precision Dispatch & Operations.
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Real-time fleet telemetry, instant fuel expense ledger sync, and automated safety compliance tracked directly across your MongoDB database.
            </p>

            <div className="mt-8 space-y-3.5">
              <div className="flex items-center gap-3.5 rounded-2xl border border-slate-800/70 bg-slate-900/50 p-3.5 text-xs text-slate-300">
                <div className="rounded-xl bg-emerald-500/15 p-2 text-emerald-400">
                  <Truck size={18} />
                </div>
                <div>
                  <p className="font-semibold text-white">Live Fleet Dispatching</p>
                  <p className="mt-0.5 text-slate-400">Instant driver telemetry and trip updates</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 rounded-2xl border border-slate-800/70 bg-slate-900/50 p-3.5 text-xs text-slate-300">
                <div className="rounded-xl bg-sky-500/15 p-2 text-sky-400">
                  <Activity size={18} />
                </div>
                <div>
                  <p className="font-semibold text-white">Synchronized Cost Ledger</p>
                  <p className="mt-0.5 text-slate-400">100% automated fuel & maintenance sync</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 rounded-2xl border border-slate-800/70 bg-slate-900/50 p-3.5 text-xs text-slate-300">
                <div className="rounded-xl bg-violet-500/15 p-2 text-violet-400">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <p className="font-semibold text-white">Compliance & Asset Pulse</p>
                  <p className="mt-0.5 text-slate-400">License renewal and inspection tracking</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="p-6 sm:p-10 lg:col-span-7 lg:p-14">
          <div className="mx-auto max-w-md">
            <div className="flex items-center justify-between lg:hidden">
              <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-emerald-400">
                <ArrowLeft size={16} /> Back to home
              </Link>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                Control Tower
              </span>
            </div>

            <div className="mt-6 lg:mt-0">
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Welcome back</h1>
              <p className="mt-2 text-sm text-slate-400">
                Sign in to continue to your TransitOps workspace.
              </p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">Email Address</label>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-700/80 bg-slate-900/90 px-4 py-3.5 text-sm transition-all duration-200 focus-within:border-emerald-500 focus-within:bg-slate-950 focus-within:ring-2 focus-within:ring-emerald-500/20 hover:border-slate-600">
                  <Mail size={18} className="text-slate-500 shrink-0" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                    className="w-full bg-transparent text-white placeholder-slate-500 outline-none"
                    placeholder="you@company.com"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">Password</label>
                  <a href="#" className="text-xs font-semibold text-emerald-400 transition hover:text-emerald-300">Forgot password?</a>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-700/80 bg-slate-900/90 px-4 py-3.5 text-sm transition-all duration-200 focus-within:border-emerald-500 focus-within:bg-slate-950 focus-within:ring-2 focus-within:ring-emerald-500/20 hover:border-slate-600">
                  <Lock size={18} className="text-slate-500 shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(event) => setForm({ ...form, password: event.target.value })}
                    className="w-full bg-transparent text-white placeholder-slate-500 outline-none"
                    placeholder="Enter password"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400 transition hover:text-white">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-sm text-slate-400">
                <label className="flex cursor-pointer items-center gap-2.5 font-medium select-none">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={() => setRemember(!remember)}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-2 focus:ring-emerald-500/30 focus:ring-offset-0"
                  />
                  Remember my session
                </label>
              </div>

              {error && (
                <div className="rounded-2xl border border-rose-500/40 bg-rose-500/15 px-4 py-3 text-sm font-medium text-rose-300 shadow-sm animate-shake">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-2xl bg-emerald-500 px-4 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:bg-emerald-400 hover:shadow-emerald-500/35 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Signing in to Workspace...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-8 border-t border-slate-800/80 pt-6 text-center">
              <p className="text-sm text-slate-400">
                New to TransitOps?{' '}
                <Link to="/register" className="font-semibold text-emerald-400 transition hover:text-emerald-300">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default LoginPage
