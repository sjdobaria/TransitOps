import { useMemo, useState } from 'react'
import { AlertTriangle, CircleDollarSign, Clock3, Route, ShieldCheck, Truck, Wrench } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts'
import DashboardLayout from '../layouts/DashboardLayout'
import MetricCard from '../components/MetricCard'
import {
  dashboardKpis,
  fleetStatusData,
  utilizationTrend,
  costOverview,
  recentTrips,
  maintenanceAlerts,
  licenseAlerts,
  filterOptions,
} from '../data/mockDashboard'

const statusStyles = {
  Draft: 'bg-slate-100 text-slate-700',
  Dispatched: 'bg-emerald-100 text-emerald-700',
  Completed: 'bg-sky-100 text-sky-700',
  Cancelled: 'bg-rose-100 text-rose-700',
}

const DashboardPage = () => {
  const [vehicleType, setVehicleType] = useState('All')
  const [status, setStatus] = useState('All')
  const [region, setRegion] = useState('All')

  const filteredTrips = useMemo(() => {
    return recentTrips.filter((trip) => {
      const matchesType = vehicleType === 'All' || trip.vehicle.includes(vehicleType[0])
      const matchesStatus = status === 'All' || trip.status === status
      const matchesRegion = region === 'All' || trip.route.includes(region)
      return matchesType && matchesStatus && matchesRegion
    })
  }, [vehicleType, status, region])

  return (
    <DashboardLayout title="Operations Center" subtitle="Fleet performance overview">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-500">Control Tower</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">Monitor fleet health, dispatch readiness, and operational efficiency.</h2>
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
          {dashboardKpis.map((card) => (
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
                  <Pie data={fleetStatusData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={2}>
                    {fleetStatusData.map((entry) => (
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
              <p className="text-sm text-slate-500">Operational efficiency over the last six months</p>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={utilizationTrend}>
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
            <h3 className="text-lg font-semibold text-slate-900">Operational Cost Overview</h3>
            <p className="text-sm text-slate-500">Fuel, maintenance, and labor efficiency across recent months</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costOverview}>
                <CartesianGrid stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="fuel" fill="#0f766e" radius={[6, 6, 0, 0]} />
                <Bar dataKey="maintenance" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                <Bar dataKey="labor" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Recent Trips</h3>
                <p className="text-sm text-slate-500">Live dispatch activity and trip pipeline</p>
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
                  {filteredTrips.map((trip) => (
                    <tr key={trip.trip_id} className="border-b border-slate-100 last:border-0">
                      <td className="py-3 pr-4 font-medium text-slate-900">{trip.trip_id}</td>
                      <td className="py-3 pr-4">{trip.route}</td>
                      <td className="py-3 pr-4">{trip.vehicle}</td>
                      <td className="py-3 pr-4">{trip.driver}</td>
                      <td className="py-3 pr-4">{trip.cargo}</td>
                      <td className="py-3">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[trip.status]}`}>
                          {trip.status}
                        </span>
                      </td>
                    </tr>
                  ))}
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
                {maintenanceAlerts.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <p className="font-medium text-slate-900">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.asset}</p>
                    <span className="mt-2 inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">{item.severity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-500" />
                <h3 className="text-lg font-semibold text-slate-900">Driver License Expiry Alerts</h3>
              </div>
              <div className="space-y-3">
                {licenseAlerts.map((item) => (
                  <div key={item.license} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <p className="font-medium text-slate-900">{item.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.license} • {item.expiry}</p>
                    <span className="mt-2 inline-flex rounded-full bg-rose-100 px-2.5 py-1 text-xs font-semibold text-rose-700">{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DashboardPage
