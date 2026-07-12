import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
import { registerMockUser } from '../services/api'

const roles = ['Fleet Manager', 'Driver', 'Safety Officer', 'Financial Analyst']

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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.16),_transparent_35%),linear-gradient(135deg,#07111f_0%,#0f172a_55%,#111827_100%)] px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-xl items-center justify-center rounded-[32px] border border-slate-800 bg-slate-950/70 p-6 shadow-2xl shadow-slate-950/40 sm:p-8">
        <div className="w-full rounded-[28px] border border-slate-800 bg-slate-900/70 p-8">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-emerald-300">
            <ArrowLeft size={16} /> Back to login
          </Link>
          <h1 className="mt-8 text-3xl font-semibold text-white">Create your TransitOps account</h1>
          <p className="mt-3 text-base leading-7 text-slate-400">Register with a role and start using the mock workspace right away.</p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <label className="block text-sm text-slate-300">
              <span className="mb-1.5 block font-medium">Name</span>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
                <User size={18} className="text-slate-500" />
                <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full bg-transparent outline-none" placeholder="Full name" required />
              </div>
            </label>

            <label className="block text-sm text-slate-300">
              <span className="mb-1.5 block font-medium">Email</span>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
                <Mail size={18} className="text-slate-500" />
                <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="w-full bg-transparent outline-none" placeholder="you@company.com" required />
              </div>
            </label>

            <label className="block text-sm text-slate-300">
              <span className="mb-1.5 block font-medium">Password</span>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
                <Lock size={18} className="text-slate-500" />
                <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="w-full bg-transparent outline-none" placeholder="Create a password" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            <label className="block text-sm text-slate-300">
              <span className="mb-1.5 block font-medium">Confirm Password</span>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3">
                <Lock size={18} className="text-slate-500" />
                <input type={showConfirm ? 'text' : 'password'} value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} className="w-full bg-transparent outline-none" placeholder="Retype your password" required />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-slate-400">
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            <label className="block text-sm text-slate-300">
              <span className="mb-1.5 block font-medium">Role</span>
              <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none">
                {roles.map((role) => <option key={role} value={role}>{role}</option>)}
              </select>
            </label>

            {error && <p className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</p>}

            <button type="submit" disabled={loading} className="w-full rounded-2xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
