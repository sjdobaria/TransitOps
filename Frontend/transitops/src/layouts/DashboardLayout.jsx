import { useMemo, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import * as Icons from 'lucide-react'
import { Bell, LogOut, Menu, Search, X } from 'lucide-react'
import { getStoredUser, logoutMockUser } from '../services/api'
import { getVisibleModules } from '../config/roles'

const DashboardLayout = ({ title, subtitle, children }) => {
  const user = getStoredUser()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const visibleModules = useMemo(() => getVisibleModules(user?.role), [user?.role])

  const handleLogout = () => {
    logoutMockUser()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="w-full bg-slate-950 text-slate-200 lg:w-72 lg:min-h-screen">
          <div className="flex items-center justify-between border-b border-slate-800 px-5 py-5">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-400">TransitOps</p>
              <h2 className="text-lg font-semibold text-white">Fleet Command</h2>
            </div>
            <button className="rounded-full p-2 text-slate-300 lg:hidden" onClick={() => setMobileOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <nav className="space-y-1 px-3 py-4">
            {visibleModules.map((module) => {
              const Icon = Icons[module.icon]
              return (
                <NavLink
                  key={module.id}
                  to={module.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-emerald-500/15 text-emerald-300' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`
                  }
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon size={18} />
                  <span>{module.label}</span>
                </NavLink>
              )
            })}
            <button
              onClick={handleLogout}
              className="mt-4 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </nav>
        </aside>

        <div className="flex-1">
          <header className="border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button className="rounded-full border border-slate-200 p-2 text-slate-700 lg:hidden" onClick={() => setMobileOpen(true)}>
                  <Menu size={18} />
                </button>
                <div>
                  <p className="text-sm font-medium text-emerald-600">{title}</p>
                  <h1 className="text-2xl font-semibold text-slate-900">{subtitle}</h1>
                </div>
              </div>

              <div className="hidden items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
                <Search size={16} className="text-slate-400" />
                <input className="w-40 bg-transparent text-sm outline-none" placeholder="Search" />
              </div>

              <div className="flex items-center gap-3">
                <button className="rounded-full border border-slate-200 p-2 text-slate-700 transition hover:border-emerald-400 hover:text-emerald-600">
                  <Bell size={18} />
                </button>
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.role}</p>
                </div>
              </div>
            </div>
          </header>

          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
