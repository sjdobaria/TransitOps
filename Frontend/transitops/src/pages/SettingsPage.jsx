import { Moon, Bell, UserCircle, Palette } from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'
import { getStoredUser } from '../services/api'
import { useTheme } from '../contexts/ThemeContext'

const SettingsPage = () => {
  const user = getStoredUser()
  const { theme, setTheme } = useTheme()

  return (
    <DashboardLayout title="Workspace Settings" subtitle="Manage your preferences">
      <div className="space-y-6">
        <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-slate-100 p-2 text-slate-700">
              <UserCircle size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Profile</h2>
              <p className="text-sm text-slate-500">Your signed-in workspace identity is shown below.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <label className="block text-sm text-slate-700">
              <span className="mb-1.5 block font-medium">Full name</span>
              <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" value={user?.name || ''} readOnly />
            </label>
            <label className="block text-sm text-slate-700">
              <span className="mb-1.5 block font-medium">Email</span>
              <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" value={user?.email || ''} readOnly />
            </label>
            <label className="block text-sm text-slate-700">
              <span className="mb-1.5 block font-medium">Role</span>
              <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" value={user?.role || 'Fleet Manager'} readOnly />
            </label>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-slate-100 p-2 text-slate-700">
              <Bell size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Notifications</h2>
              <p className="text-sm text-slate-500">Control how updates appear across the workspace.</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {['Trip alerts', 'Maintenance reminders', 'Weekly reports'].map((item) => (
              <label key={item} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                <span>{item}</span>
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-slate-100 p-2 text-slate-700">
              <Palette size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Appearance</h2>
              <p className="text-sm text-slate-500">Choose how the dashboard should feel.</p>
            </div>
          </div>

          <div className="mt-6 max-w-md">
            <label className="block text-sm text-slate-700">
              <span className="mb-1.5 block font-medium">Theme</span>
              <select value={theme} onChange={(event) => setTheme(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>
          </div>

          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <Moon size={16} />
            <span>{theme === 'dark' ? 'Dark mode is currently enabled for the workspace experience.' : 'Light mode is currently enabled for the workspace experience.'}</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default SettingsPage
