export const dashboardKpis = [
  {
    label: 'Active Vehicles',
    value: '148',
    change: '+8.2%',
    icon: 'Truck',
    tone: 'emerald',
  },
  {
    label: 'Available Vehicles',
    value: '92',
    change: '+4.1%',
    icon: 'PackageCheck',
    tone: 'sky',
  },
  {
    label: 'Vehicles in Maintenance',
    value: '11',
    change: '-1.4%',
    icon: 'Wrench',
    tone: 'amber',
  },
  {
    label: 'Active Trips',
    value: '37',
    change: '+12.6%',
    icon: 'Route',
    tone: 'violet',
  },
  {
    label: 'Pending Trips',
    value: '14',
    change: '-3.2%',
    icon: 'Clock3',
    tone: 'rose',
  },
  {
    label: 'Drivers On Duty',
    value: '64',
    change: '+5.8%',
    icon: 'Users',
    tone: 'cyan',
  },
  {
    label: 'Fleet Utilization %',
    value: '84%',
    change: '+2.1%',
    icon: 'BarChart3',
    tone: 'emerald',
  },
]

export const fleetStatusData = [
  { name: 'Operational', value: 72, color: '#10b981' },
  { name: 'Maintenance', value: 14, color: '#f59e0b' },
  { name: 'Idle', value: 8, color: '#64748b' },
  { name: 'Dispatch', value: 6, color: '#0f766e' },
]

export const utilizationTrend = [
  { month: 'Jan', utilization: 71 },
  { month: 'Feb', utilization: 74 },
  { month: 'Mar', utilization: 78 },
  { month: 'Apr', utilization: 80 },
  { month: 'May', utilization: 82 },
  { month: 'Jun', utilization: 84 },
]

export const costOverview = [
  { month: 'Jan', fuel: 182000, maintenance: 94000, labor: 128000 },
  { month: 'Feb', fuel: 188000, maintenance: 101000, labor: 131000 },
  { month: 'Mar', fuel: 194000, maintenance: 97000, labor: 136000 },
  { month: 'Apr', fuel: 201000, maintenance: 112000, labor: 142000 },
  { month: 'May', fuel: 208000, maintenance: 108000, labor: 145000 },
  { month: 'Jun', fuel: 214000, maintenance: 116000, labor: 149000 },
]

export const recentTrips = [
  {
    trip_id: 'TRIP-1042',
    route: 'Lagos → Abuja',
    vehicle: 'LAG-4021',
    driver: 'M. Adeyemi',
    cargo: 'Pharma Cargo',
    status: 'Dispatched',
  },
  {
    trip_id: 'TRIP-1038',
    route: 'Abuja → Kano',
    vehicle: 'ABJ-1188',
    driver: 'K. Yusuf',
    cargo: 'Retail Goods',
    status: 'Completed',
  },
  {
    trip_id: 'TRIP-1029',
    route: 'Port Harcourt → Benin',
    vehicle: 'PHC-2309',
    driver: 'S. Okafor',
    cargo: 'Frozen Foods',
    status: 'Draft',
  },
  {
    trip_id: 'TRIP-1016',
    route: 'Ibadan → Ilorin',
    vehicle: 'IBA-4416',
    driver: 'B. Musa',
    cargo: 'Agricultural Inputs',
    status: 'Cancelled',
  },
]

export const maintenanceAlerts = [
  { title: 'Brake inspection overdue', asset: 'LAG-4021', severity: 'High' },
  { title: 'Tire rotation pending', asset: 'ABJ-1188', severity: 'Medium' },
  { title: 'Oil service due soon', asset: 'PHC-2309', severity: 'Low' },
]

export const licenseAlerts = [
  { name: 'A. Okafor', license: 'LIC-4412', expiry: '2026-08-18', status: 'Expiring Soon' },
  { name: 'D. Iroha', license: 'LIC-7785', expiry: '2026-07-29', status: 'Urgent' },
]

export const filterOptions = {
  vehicleType: ['All', 'Truck', 'Van', 'Trailer', 'Refrigerated'],
  status: ['All', 'Operational', 'Maintenance', 'Dispatch', 'Idle'],
  region: ['All', 'Lagos', 'Abuja', 'Port Harcourt', 'Kano'],
}
