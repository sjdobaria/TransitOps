import { useState } from 'react'
import { Plus } from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'
import { useOperations } from '../contexts/OperationsContext'

const initialForm = {
  vehicle_id: '',
  title: '',
  description: '',
  issue_date: '',
  status: 'Active',
}

const MaintenancePage = () => {
  const { vehicles, maintenance, addMaintenance, closeMaintenance } = useOperations()
  const [form, setForm] = useState(initialForm)

  const handleSubmit = (event) => {
    event.preventDefault()
    const vehicle = vehicles.find(
      (item) =>
        String(item.id) === String(form.vehicle_id) ||
        Number(item.id) === Number(form.vehicle_id)
    )
    if (!vehicle) {
      alert('Select a valid vehicle')
      return
    }

    addMaintenance({
      ...form,
      vehicle_id: vehicle.id,
    })
    setForm(initialForm)
  }

  return (
    <DashboardLayout title="Maintenance" subtitle="Scheduled upkeep and repairs">
      <div className="space-y-6">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Create maintenance record</h2>
          <p className="mb-4 text-sm text-slate-500">Active maintenance automatically marks the vehicle unavailable for trips.</p>
          <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <select required value={form.vehicle_id} onChange={(event) => setForm({ ...form, vehicle_id: event.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <option value="">Select vehicle</option>
              {vehicles.filter((vehicle) => vehicle.status !== 'Retired').map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.registration_number}</option>)}
            </select>
            <input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Maintenance title" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2" />
            <input required type="date" value={form.issue_date} onChange={(event) => setForm({ ...form, issue_date: event.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2" />
            <input required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Description" className="md:col-span-2 xl:col-span-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2" />
            <button type="submit" className="md:col-span-2 xl:col-span-3 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-slate-950">
              <Plus size={16} /> Create Maintenance
            </button>
          </form>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Maintenance list</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-3 pr-4">Vehicle</th>
                  <th className="py-3 pr-4">Title</th>
                  <th className="py-3 pr-4">Issue date</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {maintenance.map((item) => {
                  const vehicle = vehicles.find((entry) => entry.id === item.vehicle_id)
                  return (
                    <tr key={item.id} className="border-b border-slate-100 last:border-0">
                      <td className="py-3 pr-4 font-medium text-slate-900">{vehicle?.registration_number || '-'}</td>
                      <td className="py-3 pr-4">{item.title}</td>
                      <td className="py-3 pr-4">{item.issue_date}</td>
                      <td className="py-3 pr-4"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{item.status}</span></td>
                      <td className="py-3">
                        {item.status === 'Active' ? (
                          <button onClick={() => closeMaintenance(item.id, item.vehicle_id)} className="rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-slate-950">Close</button>
                        ) : null}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default MaintenancePage
