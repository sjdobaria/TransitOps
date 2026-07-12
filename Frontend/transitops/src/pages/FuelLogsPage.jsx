// import { useMemo, useState } from 'react'
// import { Fuel, Plus, Search } from 'lucide-react'
// import { useOperations } from '../contexts/OperationsContext'

// const initialForm = {
//   vehicleId: '',
//   date: '',
//   liters: '',
//   cost: '',
//   trip: '',
// }

// const FuelLogsPage = () => {
//   const { vehicles, fuelLogs, addFuelLog } = useOperations()
//   const [form, setForm] = useState(initialForm)
//   const [search, setSearch] = useState('')

//   const filteredLogs = useMemo(() => {
//     return fuelLogs.filter((entry) => {
//       const term = search.toLowerCase()
//       return [entry.vehicleId, entry.trip, entry.date].some((value) => value.toLowerCase().includes(term))
//     })
//   }, [fuelLogs, search])

//   const handleSubmit = (event) => {
//     event.preventDefault()
//     addFuelLog({
//       ...form,
//       liters: Number(form.liters),
//       cost: Number(form.cost),
//     })
//     setForm(initialForm)
//   }

//   return (
//     <div className="space-y-8">
//       <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
//         <div className="flex flex-wrap items-center justify-between gap-4">
//           <div>
//             <p className="text-sm font-medium uppercase tracking-[0.3em] text-emerald-600">Fuel management</p>
//             <h1 className="mt-2 text-3xl font-semibold text-slate-900">Fuel logs</h1>
//             <p className="mt-3 max-w-2xl text-sm text-slate-600">Track consumption, cost per refill, and trip-level fueling activity.</p>
//           </div>
//           <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-600">
//             <Fuel size={28} />
//           </div>
//         </div>
//       </div>

//       <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
//         <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
//           <div className="mb-4 flex items-center justify-between">
//             <h2 className="text-xl font-semibold text-slate-900">Recent fuel entries</h2>
//             <div className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-500">
//               <Search size={16} />
//               <input value={search} onChange={(event) => setSearch(event.target.value)} className="w-32 bg-transparent outline-none" placeholder="Search" />
//             </div>
//           </div>
//           <div className="overflow-hidden rounded-2xl border border-slate-200">
//             <table className="min-w-full divide-y divide-slate-200 text-sm">
//               <thead className="bg-slate-50 text-left text-slate-600">
//                 <tr>
//                   <th className="px-4 py-3 font-medium">Vehicle</th>
//                   <th className="px-4 py-3 font-medium">Date</th>
//                   <th className="px-4 py-3 font-medium">Liters</th>
//                   <th className="px-4 py-3 font-medium">Cost</th>
//                   <th className="px-4 py-3 font-medium">Trip</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-200 bg-white">
//                 {filteredLogs.map((entry) => (
//                   <tr key={entry.id} className="hover:bg-slate-50">
//                     <td className="px-4 py-3 font-medium text-slate-900">{entry.vehicleId}</td>
//                     <td className="px-4 py-3 text-slate-600">{entry.date}</td>
//                     <td className="px-4 py-3 text-slate-600">{entry.liters}L</td>
//                     <td className="px-4 py-3 text-slate-600">${entry.cost.toFixed(2)}</td>
//                     <td className="px-4 py-3 text-slate-600">{entry.trip}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
//           <div className="mb-4 flex items-center gap-3">
//             <div className="rounded-2xl bg-slate-100 p-2 text-slate-600">
//               <Plus size={18} />
//             </div>
//             <div>
//               <h2 className="text-xl font-semibold text-slate-900">Add fuel log</h2>
//               <p className="text-sm text-slate-600">Log a new refuel event.</p>
//             </div>
//           </div>

//           <form className="space-y-4" onSubmit={handleSubmit}>
//             <label className="block text-sm text-slate-700">
//               <span className="mb-1.5 block font-medium">Vehicle</span>
//               <select value={form.vehicleId} onChange={(event) => setForm({ ...form, vehicleId: event.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" required>
//                 <option value="">Select vehicle</option>
//                 {vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.id}</option>)}
//               </select>
//             </label>

//             <label className="block text-sm text-slate-700">
//               <span className="mb-1.5 block font-medium">Date</span>
//               <input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" required />
//             </label>

//             <div className="grid gap-4 sm:grid-cols-2">
//               <label className="block text-sm text-slate-700">
//                 <span className="mb-1.5 block font-medium">Liters</span>
//                 <input type="number" min="0" step="0.1" value={form.liters} onChange={(event) => setForm({ ...form, liters: event.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" required />
//               </label>
//               <label className="block text-sm text-slate-700">
//                 <span className="mb-1.5 block font-medium">Cost</span>
//                 <input type="number" min="0" step="0.01" value={form.cost} onChange={(event) => setForm({ ...form, cost: event.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" required />
//               </label>
//             </div>

//             <label className="block text-sm text-slate-700">
//               <span className="mb-1.5 block font-medium">Trip</span>
//               <input value={form.trip} onChange={(event) => setForm({ ...form, trip: event.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" placeholder="Trip reference" required />
//             </label>

//             <button type="submit" className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800">Save fuel log</button>
//           </form>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default FuelLogsPage


import { useMemo, useState } from 'react'
import { Fuel, Plus, Search } from 'lucide-react'
import { useOperations } from '../contexts/OperationsContext'
import DashboardLayout from '../layouts/DashboardLayout'

const initialForm = {
  vehicleId: '',
  date: '',
  liters: '',
  cost: '',
  trip: '',
}

const FuelLogsPage = () => {
  const { vehicles, fuelLogs, addFuelLog } = useOperations()
  const [form, setForm] = useState(initialForm)
  const [search, setSearch] = useState('')

  const filteredLogs = useMemo(() => {
    const term = search.toLowerCase()

    return fuelLogs.filter((entry) =>
      [entry.vehicleId, entry.trip, entry.date].some((value) =>
        String(value).toLowerCase().includes(term)
      )
    )
  }, [fuelLogs, search])

  const handleSubmit = (event) => {
    event.preventDefault()

    addFuelLog({
      ...form,
      liters: Number(form.liters),
      cost: Number(form.cost),
    })

    setForm(initialForm)
  }

  return (
    <DashboardLayout
      title="Fuel Management"
      subtitle="Track fuel consumption and costs"
    >
      <div className="space-y-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-emerald-600">
                Fuel Management
              </p>

              <h1 className="mt-2 text-3xl font-semibold text-slate-900">
                Fuel Logs
              </h1>

              <p className="mt-3 max-w-2xl text-sm text-slate-600">
                Track consumption, cost per refill, and trip-level fueling activity.
              </p>
            </div>

            <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-600">
              <Fuel size={28} />
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-slate-900">
                Recent fuel entries
              </h2>

              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-500">
                <Search size={16} />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-32 bg-transparent outline-none"
                  placeholder="Search"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-medium">Vehicle</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Liters</th>
                    <th className="px-4 py-3 font-medium">Cost</th>
                    <th className="px-4 py-3 font-medium">Trip</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 bg-white">
                  {filteredLogs.map((entry) => (
                    <tr key={entry.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {entry.vehicleId}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {entry.date}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {entry.liters}L
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        ${Number(entry.cost).toFixed(2)}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {entry.trip}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-2xl bg-slate-100 p-2 text-slate-600">
                <Plus size={18} />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Add fuel log
                </h2>

                <p className="text-sm text-slate-600">
                  Log a new refuel event.
                </p>
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <label className="block text-sm text-slate-700">
                <span className="mb-1.5 block font-medium">Vehicle</span>

                <select
                  value={form.vehicleId}
                  onChange={(event) =>
                    setForm({ ...form, vehicleId: event.target.value })
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
                  required
                >
                  <option value="">Select vehicle</option>

                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.id}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm text-slate-700">
                <span className="mb-1.5 block font-medium">Date</span>

                <input
                  type="date"
                  value={form.date}
                  onChange={(event) =>
                    setForm({ ...form, date: event.target.value })
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
                  required
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm text-slate-700">
                  <span className="mb-1.5 block font-medium">Liters</span>

                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={form.liters}
                    onChange={(event) =>
                      setForm({ ...form, liters: event.target.value })
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
                    required
                  />
                </label>

                <label className="block text-sm text-slate-700">
                  <span className="mb-1.5 block font-medium">Cost</span>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.cost}
                    onChange={(event) =>
                      setForm({ ...form, cost: event.target.value })
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
                    required
                  />
                </label>
              </div>

              <label className="block text-sm text-slate-700">
                <span className="mb-1.5 block font-medium">Trip</span>

                <input
                  value={form.trip}
                  onChange={(event) =>
                    setForm({ ...form, trip: event.target.value })
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
                  placeholder="Trip reference"
                  required
                />
              </label>

              <button
                type="submit"
                className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800"
              >
                Save fuel log
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default FuelLogsPage