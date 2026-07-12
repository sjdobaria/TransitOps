import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'
import { useOperations } from '../contexts/OperationsContext'

const initialForm = {
  from: '',
  to: '',
  vehicle_id: '',
  driver_id: '',
  cargo: '',
  cargo_weight: '',
  planned_distance: '',
}

const TripManagementPage = () => {
  const {
    vehicles,
    drivers,
    trips,
    addTrip,
    updateTripStatus,
  } = useOperations()

  const [form, setForm] = useState(initialForm)

  const fieldClass =
    'w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none focus:border-emerald-400'

  const availableVehicles = useMemo(
    () =>
      vehicles.filter(
        (vehicle) => vehicle.status === 'Available'
      ),
    [vehicles]
  )

  const availableDrivers = useMemo(
    () =>
      drivers.filter(
        (driver) =>
          driver.status === 'Available' &&
          driver.safety_score >= 80 &&
          new Date(driver.license_expiry) > new Date()
      ),
    [drivers]
  )

  const handleSubmit = (event) => {
    event.preventDefault()

    const vehicle = vehicles.find(
      (item) =>
        String(item.id) === String(form.vehicle_id) ||
        Number(item.id) === Number(form.vehicle_id)
    )

    const driver = drivers.find(
      (item) =>
        String(item.id) === String(form.driver_id) ||
        Number(item.id) === Number(form.driver_id)
    )

    if (!vehicle || !driver) {
      alert('Please select a valid vehicle and driver')
      return
    }

    if (Number(form.cargo_weight) > vehicle.max_capacity) {
      alert('Cargo exceeds vehicle capacity')
      return
    }

    addTrip({
      trip_id: `TRIP-${1042 + trips.length + 1}`,
      from: form.from,
      to: form.to,
      route: `${form.from} → ${form.to}`,
      vehicle_id: vehicle.id,
      driver_id: driver.id,
      cargo: form.cargo,
      cargo_weight: Number(form.cargo_weight),
      planned_distance: Number(form.planned_distance),
      status: 'Draft',
    })

    setForm(initialForm)
  }

  return (
    <DashboardLayout
      title="Trip Management"
      subtitle="Create and track dispatches"
    >
      <div className="space-y-6">

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Create trip
          </h2>

          <p className="mb-4 text-sm text-slate-500">
            Assign an available vehicle and driver to a trip.
          </p>

          <form
            onSubmit={handleSubmit}
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          >

            <label className="text-sm font-medium text-slate-700">
              From
              <input
                required
                value={form.from}
                onChange={(event) =>
                  setForm({
                    ...form,
                    from: event.target.value,
                  })
                }
                placeholder="Ahmedabad"
                className={`mt-1.5 ${fieldClass}`}
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              To
              <input
                required
                value={form.to}
                onChange={(event) =>
                  setForm({
                    ...form,
                    to: event.target.value,
                  })
                }
                placeholder="Surat"
                className={`mt-1.5 ${fieldClass}`}
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Vehicle
              <select
                required
                value={form.vehicle_id}
                onChange={(event) =>
                  setForm({
                    ...form,
                    vehicle_id: event.target.value,
                  })
                }
                className={`mt-1.5 ${fieldClass}`}
              >
                <option value="">Select vehicle</option>

                {availableVehicles.map((vehicle) => (
                  <option
                    key={vehicle.id}
                    value={vehicle.id}
                  >
                    {vehicle.registration_number}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium text-slate-700">
              Driver
              <select
                required
                value={form.driver_id}
                onChange={(event) =>
                  setForm({
                    ...form,
                    driver_id: event.target.value,
                  })
                }
                className={`mt-1.5 ${fieldClass}`}
              >
                <option value="">Select driver</option>

                {availableDrivers.map((driver) => (
                  <option
                    key={driver.id}
                    value={driver.id}
                  >
                    {driver.full_name}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm font-medium text-slate-700">
              Cargo
              <input
                required
                value={form.cargo}
                onChange={(event) =>
                  setForm({
                    ...form,
                    cargo: event.target.value,
                  })
                }
                placeholder="Cargo description"
                className={`mt-1.5 ${fieldClass}`}
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Cargo Weight (kg)
              <input
                required
                type="number"
                min="1"
                value={form.cargo_weight}
                onChange={(event) =>
                  setForm({
                    ...form,
                    cargo_weight: event.target.value,
                  })
                }
                placeholder="450"
                className={`mt-1.5 ${fieldClass}`}
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Planned Distance (km)
              <input
                required
                type="number"
                min="1"
                value={form.planned_distance}
                onChange={(event) =>
                  setForm({
                    ...form,
                    planned_distance: event.target.value,
                  })
                }
                placeholder="250"
                className={`mt-1.5 ${fieldClass}`}
              />
            </label>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950 md:col-span-2 xl:col-span-3"
            >
              <Plus size={16} />
              Create Trip
            </button>

          </form>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">
            Trip list
          </h3>

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
                  const vehicle = vehicles.find(
                    (item) =>
                      item.id === trip.vehicle_id ||
                      item.registration_number === trip.vehicle_id ||
                      item.name === trip.vehicle_id ||
                      item.id === Number(trip.vehicle_id)
                  )

                  const driver = drivers.find(
                    (item) =>
                      item.id === trip.driver_id ||
                      item.full_name === trip.driver_id ||
                      item.id === Number(trip.driver_id)
                  )

                  return (
                    <tr
                      key={trip.id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="py-3 pr-4 font-medium text-slate-900">
                        {trip.trip_id}
                      </td>

                      <td className="py-3 pr-4">
                        {trip.route}
                      </td>

                      <td className="py-3 pr-4">
                        {vehicle?.registration_number || vehicle?.name || trip.vehicle_registration || trip.vehicle_name || trip.vehicle_id || '-'}
                      </td>

                      <td className="py-3 pr-4">
                        {driver?.full_name || trip.driver_name || trip.driver_id || '-'}
                      </td>

                      <td className="py-3 pr-4">
                        {trip.cargo}
                      </td>

                      <td className="py-3 pr-4">
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                          {trip.status}
                        </span>
                      </td>

                      <td className="py-3">
                        {trip.status === 'Draft' && (
                          <button
                            onClick={() =>
                              updateTripStatus(
                                trip.id,
                                'Dispatched'
                              )
                            }
                            className="rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-slate-950"
                          >
                            Dispatch
                          </button>
                        )}

                        {trip.status === 'Dispatched' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                updateTripStatus(
                                  trip.id,
                                  'Completed'
                                )
                              }
                              className="rounded-lg bg-sky-500 px-3 py-2 text-xs font-semibold text-white"
                            >
                              Complete
                            </button>

                            <button
                              onClick={() =>
                                updateTripStatus(
                                  trip.id,
                                  'Cancelled'
                                )
                              }
                              className="rounded-lg bg-rose-500 px-3 py-2 text-xs font-semibold text-white"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
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