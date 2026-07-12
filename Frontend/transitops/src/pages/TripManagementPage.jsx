import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'
import { useOperations } from '../contexts/OperationsContext'

const initialForm = {
  trip_id: '',
  route: '',
  vehicle_id: '',
  driver_id: '',
  cargo: '',
  cargo_weight: '',
  planned_distance: '',
  status: 'Draft',
}

const TripManagementPage = () => {
  const { trips, vehicles, drivers, addTrip, updateTripStatus } = useOperations()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [form, setForm] = useState(initialForm)

  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      const matchesSearch = `${trip.trip_id} ${trip.route}`.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === 'All' || trip.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [trips, search, statusFilter])

  const availableVehicles = useMemo(() => vehicles.filter((vehicle) => vehicle.status === 'Available' && vehicle.status !== 'Retired'), [vehicles])
  const availableDrivers = useMemo(() => drivers.filter((driver) => driver.status === 'Available' && driver.safety_score >= 80 && new Date(driver.license_expiry) > new Date()), [drivers])

  const handleSubmit = (event) => {
    event.preventDefault()
    const vehicle = vehicles.find((item) => item.id === Number(form.vehicle_id))
    const driver = drivers.find((item) => item.id === Number(form.driver_id))

    if (!vehicle || !driver) {
      alert('Please select a valid vehicle and driver')
      return
    }

    if (vehicle.max_capacity < Number(form.cargo_weight)) {
      alert('Cargo exceeds vehicle capacity')
      return
    }

    if (driver.status !== 'Available' || driver.safety_score < 80 || new Date(driver.license_expiry) <= new Date()) {
      alert('Selected driver is unavailable or invalid')
      return
    }

    addTrip(form)
    setForm(initialForm)
  }

  return (
    <DashboardLayout title="Trip Management" subtitle="Create and track dispatches">
      <div className="space-y-6">
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Create trip</h2>
          <p className="mb-4 text-sm text-slate-500">Only available vehicles and drivers can be selected.</p>
          <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <input required value={form.trip_id} onChange={(event) => setForm({ ...form, trip_id: event.target.value })} placeholder="Trip ID" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2" />
            <input required value={form.route} onChange={(event) => setForm({ ...form, route: event.target.value })} placeholder="Route" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2" />
            <select required value={form.vehicle_id} onChange={(event) => setForm({ ...form, vehicle_id: event.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <option value="">Select vehicle</option>
              {availableVehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.registration_number}</option>)}
            </select>
            <select required value={form.driver_id} onChange={(event) => setForm({ ...form, driver_id: event.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <option value="">Select driver</option>
              {availableDrivers.map((driver) => <option key={driver.id} value={driver.id}>{driver.full_name}</option>)}
            </select>
            <input required value={form.cargo} onChange={(event) => setForm({ ...form, cargo: event.target.value })} placeholder="Cargo" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2" />
            <input required type="number" value={form.cargo_weight} onChange={(event) => setForm({ ...form, cargo_weight: event.target.value })} placeholder="Cargo weight" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2" />
            <input required type="number" value={form.planned_distance} onChange={(event) => setForm({ ...form, planned_distance: event.target.value })} placeholder="Planned distance" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2" />
            <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <option>Draft</option>
              <option>Dispatched</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
            <button type="submit" className="md:col-span-2 xl:col-span-3 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-slate-950">
              <Plus size={16} /> Create Trip
            </button>
          </form>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Trip list</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-3 pr-4">Trip ID</th>
                  <th className="py-3 pr-4">Route</th>
                  <th className="py-3 pr-4">Vehicle</th>
                  <th className="py-3 pr-4">Driver</th>
                  <th className="py-3 pr-4">Cargo</th>
                  <th className="py-3 pr-4">Status</th>
                  <th className="py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {trips.map((trip) => {
                  const vehicle = vehicles.find((item) => item.id === trip.vehicle_id)
                  const driver = drivers.find((item) => item.id === trip.driver_id)
                  return (
                    <tr key={trip.id} className="border-b border-slate-100 last:border-0">
                      <td className="py-3 pr-4 font-medium text-slate-900">{trip.trip_id}</td>
                      <td className="py-3 pr-4">{trip.route}</td>
                      <td className="py-3 pr-4">{vehicle?.registration_number || '-'}</td>
                      <td className="py-3 pr-4">{driver?.full_name || '-'}</td>
                      <td className="py-3 pr-4">{trip.cargo}</td>
                      <td className="py-3 pr-4"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{trip.status}</span></td>
                      <td className="py-3">
                        {trip.status === 'Draft' ? (
                          <button onClick={() => updateTripStatus(trip.id, 'Dispatched')} className="rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-slate-950">Dispatch</button>
                        ) : trip.status === 'Dispatched' ? (
                          <div className="flex gap-2">
                            <button onClick={() => updateTripStatus(trip.id, 'Completed')} className="rounded-lg bg-sky-500 px-3 py-2 text-xs font-semibold text-white">Complete</button>
                            <button onClick={() => updateTripStatus(trip.id, 'Cancelled')} className="rounded-lg bg-rose-500 px-3 py-2 text-xs font-semibold text-white">Cancel</button>
                          </div>
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

export default TripManagementPage
