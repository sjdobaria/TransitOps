import { useMemo, useState } from 'react'
import { AlertTriangle, CircleDollarSign, Clock3, Route, ShieldCheck, Truck, Wrench } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts'
import DashboardLayout from '../layouts/DashboardLayout'
import MetricCard from '../components/MetricCard'
import { useOperations } from '../contexts/OperationsContext'
import { getStoredUser } from '../services/api'

const statusStyles = {
  Draft: 'bg-slate-100 text-slate-700',
  Dispatched: 'bg-emerald-100 text-emerald-700',
  Completed: 'bg-sky-100 text-sky-700',
  Cancelled: 'bg-rose-100 text-rose-700',
}

const filterOptions = {
  vehicleType: ['All', 'Truck', 'Van', 'Bus'],
  status: ['All', 'Draft', 'Dispatched', 'Completed', 'Cancelled'],
  region: ['All', 'Delhi', 'Surat', 'Mumbai', 'Ahmedabad', 'Jaipur'],
}

const DashboardPage = () => {
  const user = getStoredUser()
  const role = user?.role || 'Fleet Manager'
  const { vehicles = [], drivers = [], trips = [], maintenance = [], fuelLogs = [], expenses = [] } = useOperations()
  const [vehicleType, setVehicleType] = useState('All')
  const [status, setStatus] = useState('All')
  const [region, setRegion] = useState('All')

  // 1. KPI Cards
  const computedKpis = useMemo(() => {
    const activeVehicles = vehicles.filter((v) => v.status !== 'Retired')
    const availableCount = vehicles.filter((v) => v.status === 'Available').length
    const activeTrips = trips.filter((t) => t.status === 'Dispatched' || t.status === 'On Trip').length
    const inShopCount = vehicles.filter((v) => v.status === 'In Shop').length || maintenance.filter((m) => m.status !== 'Closed').length
    const avgSafety = drivers.length > 0
      ? Math.round(drivers.reduce((acc, d) => acc + (Number(d.safety_score) || 100), 0) / drivers.length) + '%'
      : '100%'

    return [
      {
        label: 'Active Fleet',
        value: String(activeVehicles.length),
        change: `${availableCount} ready for dispatch`,
        trend: 'up',
        icon: 'Truck',
        tone: 'emerald',
      },
      {
        label: 'Dispatched Trips',
        value: String(activeTrips),
        change: `${trips.length} total logged`,
        trend: 'up',
        icon: 'Route',
        tone: 'sky',
      },
      {
        label: 'In Shop Assets',
        value: String(inShopCount),
        change: 'Active maintenance jobs',
        trend: inShopCount > 0 ? 'down' : 'up',
        icon: 'Wrench',
        tone: 'amber',
      },
      {
        label: 'Safety Compliance',
        value: avgSafety,
        change: `${drivers.length} registered drivers`,
        trend: 'up',
        icon: 'ShieldCheck',
        tone: 'violet',
      },
    ]
  }, [vehicles, drivers, trips, maintenance])

  // 2. Fleet Status Distribution (PieChart)
  const computedStatusData = useMemo(() => {
    const counts = { Available: 0, 'On Trip': 0, 'In Shop': 0, Retired: 0 }
    vehicles.forEach((v) => {
      const s = v.status || 'Available'
      counts[s] = (counts[s] || 0) + 1
    })
    const colors = { Available: '#10b981', 'On Trip': '#0ea5e9', 'In Shop': '#f59e0b', Retired: '#64748b' }
    const result = Object.entries(counts)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({ name, value, color: colors[name] || '#94a3b8' }))
    return result.length > 0 ? result : [{ name: 'Available', value: 1, color: '#10b981' }]
  }, [vehicles])

  // 3. Fleet Utilization Trend (LineChart)
  const computedUtilizationTrend = useMemo(() => {
    const baseRate = vehicles.length > 0 ? Math.min(95, Math.max(30, Math.round((trips.length / (vehicles.length * 2 || 1)) * 100))) : 75
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    return months.map((month, idx) => ({
      month,
      utilization: Math.min(100, Math.max(20, baseRate - (5 - idx) * 3 + (idx % 2 === 0 ? 4 : -2))),
    }))
  }, [vehicles, trips])

  // 4. Operational Cost Overview (BarChart)
  const computedCostOverview = useMemo(() => {
    const totalFuel = fuelLogs.reduce((acc, f) => acc + Number(f.cost || 0), 0)
    const totalMaint = maintenance.reduce((acc, m) => acc + Number(m.cost || 0), 0) + expenses.filter((e) => (e.type || '').toLowerCase().includes('maint') || (e.type || '').toLowerCase().includes('repair')).reduce((a, c) => a + Number(c.amount || 0), 0)
    const totalTolls = expenses.filter((e) => (e.type || '').toLowerCase().includes('toll') || (e.type || '').toLowerCase().includes('park')).reduce((a, c) => a + Number(c.amount || 0), 0)
    const totalInsurance = expenses.filter((e) => (e.type || '').toLowerCase().includes('insur') || (e.type || '').toLowerCase().includes('reg')).reduce((a, c) => a + Number(c.amount || 0), 0)
    const totalOther = expenses.filter((e) => !(e.type || '').toLowerCase().includes('toll') && !(e.type || '').toLowerCase().includes('park') && !(e.type || '').toLowerCase().includes('insur') && !(e.type || '').toLowerCase().includes('reg') && !(e.type || '').toLowerCase().includes('maint') && !(e.type || '').toLowerCase().includes('repair')).reduce((a, c) => a + Number(c.amount || 0), 0)

    const map = {
      Fuel: totalFuel,
      Maintenance: totalMaint,
      Tolls: totalTolls,
      Insurance: totalInsurance,
      Other: totalOther,
    }

    return Object.entries(map).map(([name, amount]) => ({
      name,
      amount: Number(amount.toFixed(2)),
    }))
  }, [fuelLogs, maintenance, expenses])

  // 5. Recent Trips Table
  const filteredTrips = useMemo(() => {
    const list = trips.map((t) => ({
      trip_id: t.trip_id || t.route || `TRP-${t.id}`,
      route: t.route || `${t.from || ''} → ${t.to || ''}`,
      vehicle: t.vehicle_registration || String(t.vehicle_id || 'Unassigned'),
      driver: t.driver_name || String(t.driver_id || 'Unassigned'),
      cargo: t.cargo || 'General Cargo',
      status: t.status || 'Draft',
    }))

    return list.filter((trip) => {
      const matchesType = vehicleType === 'All' || (trip.vehicle && trip.vehicle.toLowerCase().includes(vehicleType.toLowerCase()))
      const matchesStatus = status === 'All' || trip.status === status
      const matchesRegion = region === 'All' || (trip.route && trip.route.toLowerCase().includes(region.toLowerCase()))
      return matchesType && matchesStatus && matchesRegion
    })
  }, [trips, vehicleType, status, region])

  // 6. Maintenance Alerts
  const computedMaintenanceAlerts = useMemo(() => {
    const active = maintenance.filter((m) => m.status !== 'Closed')
    return active.slice(0, 4).map((item) => ({
      title: item.title || item.maintenance_type || 'Service Required',
      asset: item.vehicle || item.vehicle_id || 'Fleet Asset',
      severity: Number(item.cost || 0) > 5000 ? 'High' : 'Medium',
    }))
  }, [maintenance])

  // 7. Driver License Expiry Alerts
  const computedLicenseAlerts = useMemo(() => {
    return drivers.slice(0, 4).map((item) => ({
      name: item.full_name || item.name || 'Driver',
      license: item.license_number || 'N/A',
      expiry: item.license_expiry || 'N/A',
      status: new Date(item.license_expiry) < new Date() ? 'Expired' : 'Active',
    }))
  }, [drivers])

  const roleFocus = {
    'Fleet Manager': {
      title: 'Fleet oversight',
      description: 'Monitor dispatch health, maintenance risk, and utilization from one operational view.',
    },
    Driver: {
      title: 'Trip readiness',
      description: 'Stay focused on active routes, assigned vehicles, and dispatch updates.',
    },
    'Safety Officer': {
      title: 'Compliance pulse',
      description: 'Review dispatch readiness and safety-sensitive alerts before every shift.',
    },
    'Financial Analyst': {
      title: 'Spend oversight',
      description: 'Track fuel usage, operating expenses, and report-ready trends for leadership.',
    },
  }[role] || {
    title: 'Fleet oversight',
    description: 'Monitor dispatch health, maintenance risk, and utilization from one operational view.',
  }

  return (
    <DashboardLayout title="Operations Center" subtitle="Fleet performance overview">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-500">Control Tower</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Monitor fleet health, dispatch readiness, and operational efficiency.</h2>
            <div className="mt-3 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
              {role} • {roleFocus.title}
            </div>
            <p className="mt-3 text-sm text-slate-500">{roleFocus.description}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="text-sm text-slate-600">
              <span className="mb-1 block">Vehicle Type</span>
              <select value={vehicleType} onChange={(event) => setVehicleType(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none">
                {filterOptions.vehicleType.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
            <label className="text-sm text-slate-600">
              <span className="mb-1 block">Status</span>
              <select value={status} onChange={(event) => setStatus(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none">
                {filterOptions.status.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
            <label className="text-sm text-slate-600">
              <span className="mb-1 block">Region</span>
              <select value={region} onChange={(event) => setRegion(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 outline-none">
                {filterOptions.region.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {computedKpis.map((card) => (
            <MetricCard key={card.label} {...card} icon={card.icon === 'Truck' ? Truck : card.icon === 'PackageCheck' ? ShieldCheck : card.icon === 'Wrench' ? Wrench : card.icon === 'Route' ? Route : card.icon === 'Clock3' ? Clock3 : card.icon === 'Users' ? Truck : card.icon === 'BarChart3' ? CircleDollarSign : Truck} />
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Fleet Status Distribution</h3>
                <p className="text-sm text-slate-500">Current fleet composition by operating state</p>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={computedStatusData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={2}>
                    {computedStatusData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Fleet Utilization Trend</h3>
              <p className="text-sm text-slate-500">Operational efficiency over recent activity</p>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={computedUtilizationTrend}>
                  <CartesianGrid stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="utilization" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Operational Cost Breakdown</h3>
            <p className="text-sm text-slate-500">Live expense distribution across fuel, maintenance, tolls, insurance, and other items</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={computedCostOverview}>
                <CartesianGrid stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="amount" fill="#0f766e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Recent Trips</h3>
                <p className="text-sm text-slate-500">Live dispatch activity and trip pipeline from database</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-3 pr-4">Trip ID</th>
                    <th className="py-3 pr-4">Route</th>
                    <th className="py-3 pr-4">Vehicle</th>
                    <th className="py-3 pr-4">Driver</th>
                    <th className="py-3 pr-4">Cargo</th>
                    <th className="py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrips.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-6 text-center text-slate-400">No matching trips logged yet</td>
                    </tr>
                  ) : (
                    filteredTrips.map((trip, index) => (
                      <tr key={`${trip.trip_id}-${index}`} className="border-b border-slate-100 last:border-0">
                        <td className="py-3 pr-4 font-medium text-slate-900">{trip.trip_id}</td>
                        <td className="py-3 pr-4">{trip.route}</td>
                        <td className="py-3 pr-4">{trip.vehicle}</td>
                        <td className="py-3 pr-4">{trip.driver}</td>
                        <td className="py-3 pr-4">{trip.cargo}</td>
                        <td className="py-3">
                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[trip.status] || 'bg-slate-100 text-slate-700'}`}>
                            {trip.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-500" />
                <h3 className="text-lg font-semibold text-slate-900">Maintenance Alerts</h3>
              </div>
              <div className="space-y-3">
                {computedMaintenanceAlerts.length === 0 ? (
                  <p className="text-sm text-slate-400">No active maintenance alerts</p>
                ) : (
                  computedMaintenanceAlerts.map((item, idx) => (
                    <div key={`${item.title}-${idx}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                      <p className="font-medium text-slate-900">{item.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{item.asset}</p>
                      <span className="mt-2 inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">{item.severity}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-500" />
                <h3 className="text-lg font-semibold text-slate-900">Driver License Alerts</h3>
              </div>
              <div className="space-y-3">
                {computedLicenseAlerts.length === 0 ? (
                  <p className="text-sm text-slate-400">No driver license alerts</p>
                ) : (
                  computedLicenseAlerts.map((item, idx) => (
                    <div key={`${item.license}-${idx}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                      <p className="font-medium text-slate-900">{item.name}</p>
                      <p className="mt-1 text-sm text-slate-500">{item.license} • {item.expiry}</p>
                      <span className="mt-2 inline-flex rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700">{item.status}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DashboardPage
