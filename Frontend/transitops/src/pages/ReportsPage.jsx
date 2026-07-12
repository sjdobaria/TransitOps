import { useMemo } from 'react'
import { BarChart3, Download, TrendingUp } from 'lucide-react'
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts'
import DashboardLayout from '../layouts/DashboardLayout'
import { useOperations } from '../contexts/OperationsContext'

const ReportsPage = () => {
  const { vehicles, trips, fuelLogs, expenses } = useOperations()

  const efficiencyData = useMemo(() => {
    const map = {}
    fuelLogs.forEach((entry) => {
      const name = entry.vehicleId || entry.vehicle_reg || 'Fleet Asset'
      if (!map[name]) map[name] = { name, liters: 0, cost: 0 }
      map[name].liters += Number(entry.liters || 0)
      map[name].cost += Number(entry.cost || 0)
    })
    return Object.values(map).map((item) => ({
      name: item.name,
      liters: Number(item.liters.toFixed(2)),
      cost: Number(item.cost.toFixed(2)),
    }))
  }, [fuelLogs])

  const utilizationData = useMemo(() => {
    return vehicles.map((vehicle) => ({
      name: vehicle.registration_number || `VH-${vehicle.id}`,
      utilization:
        vehicle.status === 'On Trip'
          ? 95
          : vehicle.status === 'In Shop'
          ? 30
          : vehicle.status === 'Retired'
          ? 0
          : 75,
    }))
  }, [vehicles])

  const costData = useMemo(() => {
    const map = {}
    expenses.forEach((entry) => {
      const rawCategory = entry.type || entry.expense_type || 'Other'
      const name =
        rawCategory.charAt(0).toUpperCase() +
        rawCategory.slice(1).toLowerCase()
      map[name] = (map[name] || 0) + Number(entry.amount || 0)
    })
    return Object.entries(map).map(([name, amount]) => ({
      name,
      amount: Number(amount.toFixed(2)),
    }))
  }, [expenses])

  const tripData = useMemo(() => {
    return trips.map((trip) => ({
      name: trip.trip_id || trip.route || `TRP-${trip.id}`,
      miles: Number(trip.planned_distance || trip.distance || 0),
    }))
  }, [trips])

  const exportCsv = () => {
    const rows = [
      ['Type', 'Amount', 'Date'],
      ...expenses.map((item) => [item.type, item.amount, item.date]),
    ]
    const csv = rows.map((row) => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'transitops-expenses.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <DashboardLayout title="Insight Center" subtitle="Reports and analytics">
      <div className="space-y-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-violet-600">Insight center</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">Reports</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-600">Evaluate fleet efficiency, operating costs, and utilization with a lightweight reporting view.</p>
            </div>
            <button onClick={exportCsv} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
              <Download size={16} /> Export CSV
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-2xl bg-violet-50 p-2 text-violet-600"><TrendingUp size={18} /></div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Fuel efficiency</h2>
                <p className="text-sm text-slate-600">Liters logged by vehicle</p>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={efficiencyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="liters" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-50 p-2 text-emerald-600"><BarChart3 size={18} /></div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Fleet utilization</h2>
                <p className="text-sm text-slate-600">Estimated utilization rate</p>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={utilizationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="utilization" stroke="#10b981" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-2xl bg-amber-50 p-2 text-amber-600"><BarChart3 size={18} /></div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Operational cost</h2>
                <p className="text-sm text-slate-600">Expense distribution by category</p>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-2xl bg-sky-50 p-2 text-sky-600"><TrendingUp size={18} /></div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Trip distance</h2>
                <p className="text-sm text-slate-600">Tracked trip miles</p>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={tripData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="miles" stroke="#0ea5e9" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ReportsPage
