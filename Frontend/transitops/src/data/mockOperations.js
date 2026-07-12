export const initialVehicles = [
  {
    id: 1,
    registration_number: 'LAG-4021',
    vehicle_type: 'Truck',
    max_capacity: 18000,
    status: 'Available',
    mileage: 128450,
    acquisition_cost: 4200000,
    notes: 'Refrigerated unit',
  },
  {
    id: 2,
    registration_number: 'ABJ-1188',
    vehicle_type: 'Van',
    max_capacity: 6500,
    status: 'On Trip',
    mileage: 84220,
    acquisition_cost: 2100000,
    notes: 'City delivery',
  },
  {
    id: 3,
    registration_number: 'PHC-2309',
    vehicle_type: 'Trailer',
    max_capacity: 26000,
    status: 'In Shop',
    mileage: 175900,
    acquisition_cost: 6100000,
    notes: 'Brake inspection pending',
  },
]

export const initialDrivers = [
  {
    id: 1,
    full_name: 'M. Adeyemi',
    license_number: 'LIC-1001',
    license_expiry: '2027-06-15',
    safety_score: 94,
    status: 'Available',
    phone: '+234 803 111 2222',
  },
  {
    id: 2,
    full_name: 'K. Yusuf',
    license_number: 'LIC-1002',
    license_expiry: '2026-08-10',
    safety_score: 88,
    status: 'On Trip',
    phone: '+234 813 555 4444',
  },
  {
    id: 3,
    full_name: 'S. Okafor',
    license_number: 'LIC-1003',
    license_expiry: '2026-07-20',
    safety_score: 91,
    status: 'Off Duty',
    phone: '+234 805 777 8888',
  },
]

export const initialTrips = [
  {
    id: 1,
    trip_id: 'TRIP-1042',
    route: 'Lagos → Abuja',
    vehicle_id: 1,
    driver_id: 1,
    cargo: 'Pharma Cargo',
    cargo_weight: 12000,
    planned_distance: 560,
    status: 'Dispatched',
  },
]

export const initialMaintenance = [
  {
    id: 1,
    vehicle_id: 3,
    title: 'Brake inspection',
    description: 'Brake pads and fluid replacement',
    issue_date: '2026-07-10',
    status: 'Active',
  },
]

export const initialFuelLogs = [
  {
    id: 1,
    vehicleId: '1',
    date: '2026-07-10',
    liters: 180,
    cost: 340,
    trip: 'TRIP-1042',
  },
]

export const initialExpenses = [
  {
    id: 1,
    type: 'Toll',
    date: '2026-07-11',
    amount: 180,
    description: 'Lagos bypass toll',
  },
]
