import { useMemo, useState } from 'react'
import { Plus, Search, Trash2, PencilLine } from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'
import { useOperations } from '../contexts/OperationsContext'

const initialForm = {
  registration_number: '',
  vehicle_type: 'Truck',
  max_capacity: '',
  status: 'Available',
  mileage: '',
  acquisition_cost: '',
  notes: '',
}

const VehicleRegistryPage = () => {
  const { vehicles, addVehicle, updateVehicle, deleteVehicle } = useOperations()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState(null)

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      const matchesSearch = `${vehicle.registration_number} ${vehicle.vehicle_type}`.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === 'All' || vehicle.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [vehicles, search, statusFilter])

  const handleSubmit = (event) => {
    event.preventDefault()

    const exists = vehicles.some((vehicle) => vehicle.registration_number.toLowerCase() === form.registration_number.toLowerCase() && vehicle.id !== editingId)
    if (exists) {
      alert('Registration number already exists')
      return
    }

    if (editingId) {
      updateVehicle(editingId, form)
    } else {
      addVehicle(form)
    }

    setForm(initialForm)
    setEditingId(null)
  }

  const handleEdit = (vehicle) => {
    setEditingId(vehicle.id)
    setForm({
      registration_number: vehicle.registration_number,
      vehicle_type: vehicle.vehicle_type,
      max_capacity: vehicle.max_capacity,
      status: vehicle.status,
      mileage: vehicle.mileage,
      acquisition_cost: vehicle.acquisition_cost,
      notes: vehicle.notes,
    })
  }

  const handleDelete = (id) => {
    deleteVehicle(id)
  }

  return (
    <DashboardLayout title="Vehicle Registry" subtitle="Fleet assets and availability">
      <div className="space-y-6">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Vehicle registry</h2>
              <p className="text-sm text-slate-500">Keep fleet details, availability, and capacity aligned with operations.</p>
            </div>
            <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
              {editingId ? 'Editing vehicle' : 'New entry'}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-[20px] border border-slate-200 bg-slate-50/80 p-4 sm:p-5">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <label className="text-sm text-slate-600">
                <span className="mb-1.5 block font-medium text-slate-700">Registration number</span>
                <input required value={form.registration_number} onChange={(event) => setForm({ ...form, registration_number: event.target.value })} placeholder="e.g. LAG-4021" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-emerald-400" />
              </label>
              <label className="text-sm text-slate-600">
                <span className="mb-1.5 block font-medium text-slate-700">Vehicle type</span>
                <input required value={form.vehicle_type} onChange={(event) => setForm({ ...form, vehicle_type: event.target.value })} placeholder="Truck, Van, Trailer" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-emerald-400" />
              </label>
              <label className="text-sm text-slate-600">
                <span className="mb-1.5 block font-medium text-slate-700">Max capacity</span>
                <input required type="number" value={form.max_capacity} onChange={(event) => setForm({ ...form, max_capacity: event.target.value })} placeholder="18000" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-emerald-400" />
              </label>
              <label className="text-sm text-slate-600">
                <span className="mb-1.5 block font-medium text-slate-700">Status</span>
                <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-emerald-400">
                  <option>Available</option>
                  <option>On Trip</option>
                  <option>In Shop</option>
                  <option>Retired</option>
                </select>
              </label>
              <label className="text-sm text-slate-600">
                <span className="mb-1.5 block font-medium text-slate-700">Mileage</span>
                <input required type="number" value={form.mileage} onChange={(event) => setForm({ ...form, mileage: event.target.value })} placeholder="128450" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-emerald-400" />
              </label>
              <label className="text-sm text-slate-600">
                <span className="mb-1.5 block font-medium text-slate-700">Acquisition cost</span>
                <input required type="number" value={form.acquisition_cost} onChange={(event) => setForm({ ...form, acquisition_cost: event.target.value })} placeholder="4200000" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-emerald-400" />
              </label>
            </div>

            <label className="mt-4 block text-sm text-slate-600">
              <span className="mb-1.5 block font-medium text-slate-700">Notes</span>
              <input value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} placeholder="Optional notes or maintenance remarks" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-emerald-400" />
            </label>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-500">Use the form to add or update a vehicle entry quickly.</p>
              <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 font-semibold text-slate-950 transition hover:bg-emerald-400">
                <Plus size={16} /> {editingId ? 'Update Vehicle' : 'Add Vehicle'}
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Vehicle list</h3>
              <p className="text-sm text-slate-500">Search and filter the fleet registry.</p>
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
                <option>In Shop</option>
                <option>Retired</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-3 pr-4">Registration</th>
                  <th className="py-3 pr-4">Type</th>
                  <th className="py-3 pr-4">Capacity</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3 pr-4">Mileage</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="border-b border-slate-100 last:border-0">
                    <td className="py-3 pr-4 font-medium text-slate-900">{vehicle.registration_number}</td>
                    <td className="py-3 pr-4">{vehicle.vehicle_type}</td>
                    <td className="py-3 pr-4">{vehicle.max_capacity}</td>
                    <td className="py-3 pr-4"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{vehicle.status}</span></td>
                    <td className="py-3 pr-4">{vehicle.mileage}</td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(vehicle)} className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-emerald-400 hover:text-emerald-600"><PencilLine size={16} /></button>
                        <button onClick={() => handleDelete(vehicle.id)} className="rounded-lg border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-50"><Trash2 size={16} /></button>
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

export default VehicleRegistryPage
