import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, Lock, Mail, User, ShieldCheck, Truck, Activity, Sparkles, CheckCircle2, Briefcase } from 'lucide-react'
import { registerMockUser } from '../services/api'

const roles = [
  { id: 'Fleet Manager', title: 'Fleet Manager', desc: 'Full dispatch oversight & asset management', icon: Truck },
  { id: 'Driver', title: 'Driver', desc: 'Route tracking, telemetry & trip logs', icon: Activity },
  { id: 'Safety Officer', title: 'Safety Officer', desc: 'Compliance pulse & driver inspections', icon: ShieldCheck },
  { id: 'Financial Analyst', title: 'Financial Analyst', desc: 'Cost ledgers, fuel efficiency & audit reports', icon: Briefcase },
]

const RegisterPage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'Fleet Manager' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      await registerMockUser({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.12),_transparent_45%),linear-gradient(135deg,#07111f_0%,#0f172a_55%,#111827_100%)] px-4 py-8 text-slate-100 sm:px-6 lg:flex lg:items-center lg:justify-center lg:px-8">
      {/* Ambient background glow rings */}
      <div className="pointer-events-none absolute left-1/4 top-10 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-10 right-1/4 h-96 w-96 translate-x-1/2 rounded-full bg-sky-500/10 blur-[120px]" />

      <div className="relative z-10 mx-auto w-full max-w-5xl overflow-hidden rounded-[36px] border border-slate-800/80 bg-slate-950/80 shadow-2xl shadow-slate-950/80 backdrop-blur-2xl lg:grid lg:grid-cols-12">
        
        {/* Left Hero & Value Proposition Panel */}
        <div className="relative hidden flex-col justify-between border-b border-slate-800/80 bg-gradient-to-br from-slate-900/95 via-slate-900/60 to-slate-950/95 p-10 lg:col-span-5 lg:flex lg:border-b-0 lg:border-r">
          <div>
            <Link to="/login" className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-emerald-400">
              <ArrowLeft size={16} /> Back to login
            </Link>

            <h2 className="mt-8 text-3xl font-extrabold tracking-tight text-white xl:text-4xl">
              Tailored Views for Every Fleet Role.
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Create an account to unlock live MongoDB dispatches, interactive maintenance dashboards, and role-specific analytics cards.
            </p>

            <div className="mt-8 space-y-3.5">
              <div className="flex items-center gap-3.5 rounded-2xl border border-slate-800/70 bg-slate-900/50 p-3.5 text-xs text-slate-300">
                <div className="rounded-xl bg-emerald-500/15 p-2 text-emerald-400">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <p className="font-semibold text-white">Instant Setup & Auto-Sync</p>
                  <p className="mt-0.5 text-slate-400">Your profile connects directly to MongoDB Atlas</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 rounded-2xl border border-slate-800/70 bg-slate-900/50 p-3.5 text-xs text-slate-300">
                <div className="rounded-xl bg-sky-500/15 p-2 text-sky-400">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <p className="font-semibold text-white">Enterprise Security Standards</p>
                  <p className="mt-0.5 text-slate-400">JWT authentication & role-scoped permissions</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="p-6 sm:p-10 lg:col-span-7 lg:p-14">
          <div className="mx-auto max-w-lg">
            <div className="flex items-center justify-between lg:hidden">
              <Link to="/login" className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-emerald-400">
                <ArrowLeft size={16} /> Back to login
              </Link>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                Register
              </span>
            </div>

            <div className="mt-6 lg:mt-0">
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Create your account</h1>
              <p className="mt-2 text-sm text-slate-400">
                Choose an operational role and get started right away.
              </p>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              {/* Role Selection Grid */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">Select Workspace Role</label>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {roles.map((item) => {
                    const Icon = item.icon
                    const isSelected = form.role === item.id
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setForm({ ...form, role: item.id })}
                        className={`flex items-start gap-3 rounded-2xl border p-3.5 text-left transition-all duration-200 ${
                          isSelected
                            ? 'border-emerald-500/90 bg-emerald-500/15 text-white shadow-sm shadow-emerald-500/10 ring-1 ring-emerald-500/40'
                            : 'border-slate-800/80 bg-slate-900/70 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <div className={`rounded-xl p-2 shrink-0 ${isSelected ? 'bg-emerald-500/25 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                          <Icon size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{item.title}</p>
                          <p className="mt-0.5 text-[11px] leading-4 text-slate-400">{item.desc}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid gap-4 pt-2 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">Full Name</label>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-700/80 bg-slate-900/90 px-4 py-3 text-sm transition-all duration-200 focus-within:border-emerald-500 focus-within:bg-slate-950 focus-within:ring-2 focus-within:ring-emerald-500/20 hover:border-slate-600">
                    <User size={18} className="text-slate-500 shrink-0" />
                    <input
                      value={form.name}
                      onChange={(event) => setForm({ ...form, name: event.target.value })}
                      className="w-full bg-transparent text-white placeholder-slate-500 outline-none"
                      placeholder="Alex Morgan"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">Work Email</label>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-700/80 bg-slate-900/90 px-4 py-3 text-sm transition-all duration-200 focus-within:border-emerald-500 focus-within:bg-slate-950 focus-within:ring-2 focus-within:ring-emerald-500/20 hover:border-slate-600">
                    <Mail size={18} className="text-slate-500 shrink-0" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(event) => setForm({ ...form, email: event.target.value })}
                      className="w-full bg-transparent text-white placeholder-slate-500 outline-none"
                      placeholder="alex@transitops.com"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">Password</label>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-700/80 bg-slate-900/90 px-4 py-3 text-sm transition-all duration-200 focus-within:border-emerald-500 focus-within:bg-slate-950 focus-within:ring-2 focus-within:ring-emerald-500/20 hover:border-slate-600">
                    <Lock size={18} className="text-slate-500 shrink-0" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={(event) => setForm({ ...form, password: event.target.value })}
                      className="w-full bg-transparent text-white placeholder-slate-500 outline-none"
                      placeholder="Create password"
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400 transition hover:text-white">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">Confirm Password</label>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-700/80 bg-slate-900/90 px-4 py-3 text-sm transition-all duration-200 focus-within:border-emerald-500 focus-within:bg-slate-950 focus-within:ring-2 focus-within:ring-emerald-500/20 hover:border-slate-600">
                    <Lock size={18} className="text-slate-500 shrink-0" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={form.confirmPassword}
                      onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
                      className="w-full bg-transparent text-white placeholder-slate-500 outline-none"
                      placeholder="Repeat password"
                      required
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-slate-400 transition hover:text-white">
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <div className="rounded-2xl border border-rose-500/40 bg-rose-500/15 px-4 py-3 text-sm font-medium text-rose-300 shadow-sm animate-shake">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-3 w-full rounded-2xl bg-emerald-500 px-4 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:bg-emerald-400 hover:shadow-emerald-500/35 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Creating workspace account...' : 'Complete Account Registration'}
              </button>
            </form>

            <div className="mt-8 border-t border-slate-800/80 pt-6 text-center">
              <p className="text-sm text-slate-400">
                Already registered?{' '}
                <Link to="/login" className="font-semibold text-emerald-400 transition hover:text-emerald-300">
                  Sign in instead
                </Link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default RegisterPage
