import { useMemo, useState } from 'react'
import { Plus, Search, Trash2, PencilLine } from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'
import { useOperations } from '../contexts/OperationsContext'

const initialForm = {
  full_name: '',
  license_number: '',
  license_expiry: '',
  safety_score: '',
  status: 'Available',
  phone: '',
}

const DriverManagementPage = () => {
  const { drivers, setDrivers } = useOperations()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState(null)

  const filteredDrivers = useMemo(() => {
    return drivers.filter((driver) => {
      const matchesSearch = `${driver.full_name} ${driver.license_number}`.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === 'All' || driver.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [drivers, search, statusFilter])

  const handleSubmit = (event) => {
    event.preventDefault()

    const exists = drivers.some((driver) => driver.license_number.toLowerCase() === form.license_number.toLowerCase() && driver.id !== editingId)
    if (exists) {
      alert('License number already exists')
      return
    }

    if (editingId) {
      setDrivers((current) => current.map((driver) => (driver.id === editingId ? { ...driver, ...form, safety_score: Number(form.safety_score) } : driver)))
    } else {
      setDrivers((current) => [...current, { id: Date.now(), ...form, safety_score: Number(form.safety_score) }])
    }

    setForm(initialForm)
    setEditingId(null)
  }

  const handleEdit = (driver) => {
    setEditingId(driver.id)
    setForm({
      full_name: driver.full_name,
      license_number: driver.license_number,
      license_expiry: driver.license_expiry,
      safety_score: driver.safety_score,
      status: driver.status,
      phone: driver.phone,
    })
  }

  const handleDelete = (id) => {
    setDrivers((current) => current.filter((driver) => driver.id !== id))
  }

  return (
    <DashboardLayout title="Driver Management" subtitle="Driver roster and compliance">
      <div className="space-y-6">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Driver roster</h2>
              <p className="text-sm text-slate-500">Track license validity, safety scores, and availability in one place.</p>
            </div>
            <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
              {editingId ? 'Editing driver' : 'New entry'}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-[20px] border border-slate-200 bg-slate-50/80 p-4 sm:p-5">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <label className="text-sm text-slate-600">
                <span className="mb-1.5 block font-medium text-slate-700">Full name</span>
                <input required value={form.full_name} onChange={(event) => setForm({ ...form, full_name: event.target.value })} placeholder="e.g. M. Adeyemi" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-emerald-400" />
              </label>
              <label className="text-sm text-slate-600">
                <span className="mb-1.5 block font-medium text-slate-700">License number</span>
                <input required value={form.license_number} onChange={(event) => setForm({ ...form, license_number: event.target.value })} placeholder="LIC-1001" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-emerald-400" />
              </label>
              <label className="text-sm text-slate-600">
                <span className="mb-1.5 block font-medium text-slate-700">License expiry</span>
                <input required type="date" value={form.license_expiry} onChange={(event) => setForm({ ...form, license_expiry: event.target.value })} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-emerald-400" />
              </label>
              <label className="text-sm text-slate-600">
                <span className="mb-1.5 block font-medium text-slate-700">Safety score</span>
                <input required type="number" min="0" max="100" value={form.safety_score} onChange={(event) => setForm({ ...form, safety_score: event.target.value })} placeholder="94" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-emerald-400" />
              </label>
              <label className="text-sm text-slate-600">
                <span className="mb-1.5 block font-medium text-slate-700">Status</span>
                <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-emerald-400">
                  <option>Available</option>
                  <option>On Trip</option>
                  <option>Off Duty</option>
                  <option>Suspended</option>
                </select>
              </label>
              <label className="text-sm text-slate-600">
                <span className="mb-1.5 block font-medium text-slate-700">Phone</span>
                <input required value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="+234 803 111 2222" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-emerald-400" />
              </label>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-500">Use the form to add or update a driver profile quickly.</p>
              <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 font-semibold text-slate-950 transition hover:bg-emerald-400">
                <Plus size={16} /> {editingId ? 'Update Driver' : 'Add Driver'}
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Driver list</h3>
              <p className="text-sm text-slate-500">Search and filter the roster.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                <Search size={16} className="text-slate-400" />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search" className="w-32 bg-transparent outline-none sm:w-40" />
              </div>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none">
                <option value="All">All</option>
                <option>Available</option>
                <option>On Trip</option>
                <option>Off Duty</option>
                <option>Suspended</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-3 pr-4">Name</th>
                  <th className="py-3 pr-4">License</th>
                  <th className="py-3 pr-4">Expiry</th>
                  <th className="py-3 pr-4">Safety</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDrivers.map((driver) => (
                  <tr key={driver.id} className="border-b border-slate-100 last:border-0">
                    <td className="py-3 pr-4 font-medium text-slate-900">{driver.full_name}</td>
                    <td className="py-3 pr-4">{driver.license_number}</td>
                    <td className="py-3 pr-4">{driver.license_expiry}</td>
                    <td className="py-3 pr-4">{driver.safety_score}</td>
                    <td className="py-3 pr-4"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{driver.status}</span></td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(driver)} className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-emerald-400 hover:text-emerald-600"><PencilLine size={16} /></button>
                        <button onClick={() => handleDelete(driver.id)} className="rounded-lg border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-50"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DriverManagementPage
