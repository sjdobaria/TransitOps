// import { useMemo, useState } from 'react'
// import { NavLink, useLocation, useNavigate } from 'react-router-dom'
// import * as Icons from 'lucide-react'
// import { Bell, LogOut, Menu, Moon, Sun, X } from 'lucide-react'
// import { getStoredUser, logoutMockUser } from '../services/api'
// import { ROLE_NAMES, getVisibleModules } from '../config/roles'
// import { useTheme } from '../contexts/ThemeContext'

// const DashboardLayout = ({ title, subtitle, children }) => {
//   const user = getStoredUser()
//   const navigate = useNavigate()
//   const location = useLocation()
//   const [mobileOpen, setMobileOpen] = useState(false)
//   const { theme, setTheme } = useTheme()

//   const role = user?.role || ROLE_NAMES.FLEET_MANAGER
//   const visibleModules = useMemo(() => getVisibleModules(role), [role])

//   const isActiveModule = (modulePath) => {
//     if (modulePath === '/dashboard') {
//       return location.pathname === '/dashboard'
//     }

//     return location.pathname === modulePath || location.pathname.startsWith(`${modulePath}/`)
//   }

//   const handleLogout = () => {
//     logoutMockUser()
//     navigate('/login')
//   }

//   return (
//     <div className="min-h-screen" style={{ backgroundColor: 'var(--app-bg)', color: 'var(--text)' }}>
//       <div className="flex min-h-screen flex-col lg:flex-row">
//         <aside className={`w-full lg:w-72 lg:min-h-screen ${mobileOpen ? 'block' : 'hidden lg:block'}`} style={{ backgroundColor: 'var(--sidebar-bg)', color: 'var(--sidebar-text)' }}>
//           <div className="flex items-center justify-between border-b border-slate-800 px-5 py-5">
//             <div>
//               <p className="text-xs uppercase tracking-[0.35em] text-emerald-400">TransitOps</p>
//               <h2 className="text-lg font-semibold text-white">Fleet Command</h2>
//             </div>
//             <button className="rounded-full p-2 text-slate-300 lg:hidden" onClick={() => setMobileOpen(false)}>
//               <X size={18} />
//             </button>
//           </div>

//           <nav className="space-y-1 px-3 py-4">
//             {visibleModules.map((module) => {
//               const Icon = Icons[module.icon]
//               const active = isActiveModule(module.path)

//               return (
//                 <NavLink
//                   key={module.id}
//                   to={module.path}
//                   className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? 'bg-emerald-500/15 text-emerald-300' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
//                   onClick={() => setMobileOpen(false)}
//                 >
//                   <Icon size={18} />
//                   <span>{module.label}</span>
//                 </NavLink>
//               )
//             })}
//             <button
//               onClick={handleLogout}
//               className="mt-4 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
//             >
//               <LogOut size={18} />
//               <span>Logout</span>
//             </button>
//           </nav>
//         </aside>

//         <div className="flex-1">
//           <header className="border-b px-4 py-4 backdrop-blur sm:px-6 lg:px-8" style={{ backgroundColor: 'color-mix(in srgb, var(--surface) 90%, transparent)', borderColor: 'var(--border)' }}>
//             <div className="flex items-center justify-between gap-4">
//               <div className="flex items-center gap-3">
//                 <button className="rounded-full border p-2 lg:hidden" style={{ borderColor: 'var(--border)', color: 'var(--text)' }} onClick={() => setMobileOpen(true)}>
//                   <Menu size={18} />
//                 </button>
//                 <div>
//                   <p className="text-sm font-medium text-emerald-600">{title}</p>
//                   <h1 className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>{subtitle}</h1>
//                 </div>
//               </div>

//               <div className="flex items-center gap-3">
//                 <button
//                   className="rounded-full border p-2 transition hover:border-emerald-400 hover:text-emerald-600"
//                   style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
//                   onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
//                   aria-label="Toggle theme"
//                 >
//                   {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
//                 </button>
//                 <button className="rounded-full border p-2 transition hover:border-emerald-400 hover:text-emerald-600" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
//                   <Bell size={18} />
//                 </button>
//                 <div className="hidden text-right sm:block">
//                   <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{user?.name || 'TransitOps User'}</p>
//                   <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{user?.role || 'Fleet Manager'}</p>
//                 </div>
//               </div>
//             </div>
//           </header>

//           <main className="p-4 sm:p-6 lg:p-8">{children}</main>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default DashboardLayout

import { useMemo, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import * as Icons from 'lucide-react'
import { Bell, LogOut, Menu, Moon, Sun, X } from 'lucide-react'
import { getStoredUser, logoutMockUser } from '../services/api'
import { ROLE_NAMES, getVisibleModules } from '../config/roles'
import { useTheme } from '../contexts/ThemeContext'

const DashboardLayout = ({ title, subtitle, children }) => {
  const user = getStoredUser()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const role = user?.role || ROLE_NAMES.FLEET_MANAGER

  const visibleModules = useMemo(
    () => getVisibleModules(role),
    [role]
  )

  const isActiveModule = (modulePath) => {
    if (modulePath === '/dashboard') {
      return location.pathname === '/dashboard'
    }

    return (
      location.pathname === modulePath ||
      location.pathname.startsWith(`${modulePath}/`)
    )
  }

  const handleLogout = () => {
    logoutMockUser()
    window.location.href = '/login'
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: 'var(--app-bg)',
        color: 'var(--text)',
      }}
    >
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside
          className={`w-full lg:min-h-screen lg:w-72 ${
            mobileOpen ? 'block' : 'hidden lg:block'
          }`}
          style={{
            backgroundColor: 'var(--sidebar-bg)',
            color: 'var(--sidebar-text)',
          }}
        >
          <div className="flex items-center justify-between border-b border-slate-800 px-5 py-5">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-emerald-400">
                TransitOps
              </p>

              <h2 className="text-lg font-semibold text-white">
                Fleet Command
              </h2>
            </div>

            <button
              className="rounded-full p-2 text-slate-300 lg:hidden"
              onClick={() => setMobileOpen(false)}
            >
              <X size={18} />
            </button>
          </div>

          <nav className="space-y-1 px-3 py-4">
            {visibleModules.map((module) => {
              const Icon = Icons[module.icon]
              const active = isActiveModule(module.path)

              return (
                <NavLink
                  key={module.id}
                  to={module.path}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? 'bg-emerald-500/15 text-emerald-300'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
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
          <header
            className="border-b px-4 py-4 backdrop-blur sm:px-6 lg:px-8"
            style={{
              backgroundColor:
                'color-mix(in srgb, var(--surface) 90%, transparent)',
              borderColor: 'var(--border)',
            }}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  className="rounded-full border p-2 lg:hidden"
                  style={{
                    borderColor: 'var(--border)',
                    color: 'var(--text)',
                  }}
                  onClick={() => setMobileOpen(true)}
                >
                  <Menu size={18} />
                </button>

                <div>
                  <p className="text-sm font-medium text-emerald-600">
                    {title}
                  </p>

                  <h1
                    className="text-2xl font-semibold"
                    style={{ color: 'var(--text)' }}
                  >
                    {subtitle}
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  className="rounded-full border p-2 transition hover:border-emerald-400 hover:text-emerald-600"
                  style={{
                    borderColor: 'var(--border)',
                    color: 'var(--text)',
                  }}
                  onClick={() =>
                    setTheme(theme === 'dark' ? 'light' : 'dark')
                  }
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <Sun size={18} />
                  ) : (
                    <Moon size={18} />
                  )}
                </button>

                <button
                  className="rounded-full border p-2 transition hover:border-emerald-400 hover:text-emerald-600"
                  style={{
                    borderColor: 'var(--border)',
                    color: 'var(--text)',
                  }}
                >
                  <Bell size={18} />
                </button>

                <div className="hidden text-right sm:block">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: 'var(--text)' }}
                  >
                    {user?.name || 'TransitOps User'}
                  </p>

                  <p
                    className="text-xs"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {user?.role || 'Fleet Manager'}
                  </p>
                </div>
              </div>
            </div>
          </header>

          <main className="p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout