// Data normalization utilities between Django backend snake_case models and React frontend properties

export const fromBackendVehicle = (v) => {
  if (!v) return null
  return {
    id: v.id,
    registration_number: v.registration_number || '',
    vehicle_type: v.vehicle_type ? (v.vehicle_type.charAt(0).toUpperCase() + v.vehicle_type.slice(1)) : 'Truck',
    max_capacity: v.max_load_capacity ?? v.max_capacity ?? 0,
    status: v.status === 'available' ? 'Available' : v.status === 'on_trip' ? 'On Trip' : v.status === 'in_shop' ? 'In Shop' : v.status === 'retired' ? 'Retired' : v.status || 'Available',
    mileage: v.current_odometer ?? v.mileage ?? 0,
    acquisition_cost: v.acquisition_cost ?? 0,
    notes: v.notes || '',
    name: v.name || v.registration_number || '',
  }
}

export const toBackendVehicle = (v) => ({
  registration_number: v.registration_number,
  name: v.name || v.registration_number || 'Fleet Asset',
  vehicle_type: v.vehicle_type ? v.vehicle_type.toLowerCase() : 'truck',
  max_load_capacity: Number(v.max_capacity ?? v.max_load_capacity ?? 0),
  current_odometer: Number(v.mileage ?? v.current_odometer ?? 0),
  acquisition_cost: Number(v.acquisition_cost ?? 0),
  status: v.status === 'Available' ? 'available' : v.status === 'On Trip' ? 'on_trip' : v.status === 'In Shop' ? 'in_shop' : v.status === 'Retired' ? 'retired' : 'available',
  notes: v.notes || '',
})

export const fromBackendDriver = (d) => {
  if (!d) return null
  return {
    id: d.id,
    full_name: d.name || d.full_name || '',
    license_number: d.license_number || '',
    license_expiry: d.license_expiry_date || d.license_expiry || '',
    safety_score: d.safety_score ?? 100,
    status: d.status === 'available' ? 'Available' : d.status === 'on_trip' ? 'On Trip' : d.status === 'suspended' ? 'Suspended' : d.status === 'off_duty' ? 'Available' : d.status || 'Available',
    phone: d.contact_number || d.phone || '',
  }
}

export const toBackendDriver = (d) => ({
  name: d.full_name || d.name || 'Unknown Driver',
  license_number: d.license_number,
  license_category: d.license_category || 'B',
  license_expiry_date: d.license_expiry || d.license_expiry_date || new Date().toISOString().split('T')[0],
  contact_number: d.phone || d.contact_number || 'N/A',
  safety_score: Number(d.safety_score ?? 100),
  status: d.status === 'Available' ? 'available' : d.status === 'On Trip' ? 'on_trip' : d.status === 'Suspended' ? 'suspended' : 'available',
})

export const fromBackendTrip = (t) => {
  if (!t) return null
  const source = t.source || ''
  const dest = t.destination || ''
  const route = source && dest ? `${source} → ${dest}` : t.route || 'Local Route'
  return {
    id: t.id,
    trip_id: t.trip_number || t.trip_id || `TRP-${String(t.id).slice(-4)}`,
    route,
    vehicle_id: t.vehicle ? (typeof t.vehicle === 'object' ? t.vehicle.id : t.vehicle) : t.vehicle_id,
    driver_id: t.driver ? (typeof t.driver === 'object' ? t.driver.id : t.driver) : t.driver_id,
    cargo: t.notes || t.cargo || 'General Cargo',
    cargo_weight: t.cargo_weight || 0,
    planned_distance: t.planned_distance || 0,
    status: t.status === 'draft' ? 'Draft' : t.status === 'dispatched' ? 'Dispatched' : t.status === 'completed' ? 'Completed' : t.status === 'cancelled' ? 'Cancelled' : t.status || 'Draft',
  }
}

export const toBackendTrip = (t) => {
  const parts = (t.route || 'Origin → Destination').split('→').map(s => s.trim())
  const source = parts[0] || 'Origin'
  const destination = parts[1] || 'Destination'
  return {
    source,
    destination,
    vehicle: t.vehicle_id,
    driver: t.driver_id,
    cargo_weight: Number(t.cargo_weight || 0),
    planned_distance: Number(t.planned_distance || 10),
    status: t.status === 'Draft' ? 'draft' : t.status === 'Dispatched' ? 'dispatched' : t.status === 'Completed' ? 'completed' : t.status === 'Cancelled' ? 'cancelled' : 'draft',
    notes: t.cargo || '',
  }
}

export const fromBackendMaintenance = (m) => {
  if (!m) return null
  return {
    id: m.id,
    vehicle_id: m.vehicle ? (typeof m.vehicle === 'object' ? m.vehicle.id : m.vehicle) : m.vehicle_id,
    title: m.maintenance_type ? m.maintenance_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : m.title || 'General Service',
    description: m.description || m.notes || '',
    issue_date: m.scheduled_date || m.issue_date || new Date().toISOString().split('T')[0],
    status: m.status === 'completed' ? 'Closed' : 'Active',
  }
}

export const toBackendMaintenance = (m) => ({
  vehicle: m.vehicle_id,
  maintenance_type: 'general_service',
  description: m.description || m.title || 'Service required',
  status: m.status === 'Closed' ? 'completed' : 'open',
  scheduled_date: m.issue_date || new Date().toISOString().split('T')[0],
  cost: Number(m.cost || 0),
})

export const fromBackendFuelLog = (f) => {
  if (!f) return null
  return {
    id: f.id,
    vehicleId: f.vehicle_reg || (f.vehicle && typeof f.vehicle === 'object' ? f.vehicle.registration_number : typeof f.vehicle === 'string' ? f.vehicle : f.vehicleId || 'Fleet Asset'),
    date: f.date || new Date().toISOString().split('T')[0],
    liters: f.liters || 0,
    cost: f.total_cost ?? f.cost ?? 0,
    trip: f.trip ? (typeof f.trip === 'object' ? f.trip.trip_number : typeof f.trip === 'string' ? f.trip : f.trip) : 'General',
  }
}

export const toBackendFuelLog = (f, vehicles = [], trips = []) => {
  const v = vehicles.find(item => item.registration_number === f.vehicleId || item.id === Number(f.vehicleId) || item.id === f.vehicleId) || vehicles[0]
  const t = trips.find(item => item.trip_id === f.trip || item.trip_number === f.trip || item.id === Number(f.trip) || item.id === f.trip)
  const liters = Number(f.liters || 1)
  const totalCost = Number(f.cost || 0)
  return {
    vehicle: v ? v.id : null,
    trip: t ? t.id : null,
    liters: liters,
    cost_per_liter: Number((totalCost / liters).toFixed(2)),
    date: f.date || new Date().toISOString().split('T')[0],
  }
}

export const fromBackendExpense = (e) => {
  if (!e) return null
  return {
    id: e.id,
    type: e.expense_type ? e.expense_type.charAt(0).toUpperCase() + e.expense_type.slice(1) : e.type || 'Other',
    date: e.date || new Date().toISOString().split('T')[0],
    amount: e.amount || 0,
    description: e.description || '',
  }
}

export const toBackendExpense = (e) => ({
  expense_type: e.type ? e.type.toLowerCase() : 'other',
  amount: Number(e.amount || 0),
  date: e.date || new Date().toISOString().split('T')[0],
  description: e.description || '',
})
