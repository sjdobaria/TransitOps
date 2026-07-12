// export const ROLE_NAMES = {
//   FLEET_MANAGER: 'Fleet Manager',
//   DRIVER: 'Driver',
//   SAFETY_OFFICER: 'Safety Officer',
//   FINANCIAL_ANALYST: 'Financial Analyst',
// }

// export const navigationModules = [
//   {
//     id: 'dashboard',
//     label: 'Dashboard',
//     path: '/dashboard',
//     icon: 'LayoutDashboard',
//     roles: Object.values(ROLE_NAMES),
//   },
//   {
//     id: 'vehicles',
//     label: 'Vehicles',
//     path: '/dashboard/vehicles',
//     icon: 'Truck',
//     roles: [ROLE_NAMES.FLEET_MANAGER],
//   },
//   {
//     id: 'drivers',
//     label: 'Drivers',
//     path: '/dashboard/drivers',
//     icon: 'Users',
//     roles: [ROLE_NAMES.FLEET_MANAGER, ROLE_NAMES.SAFETY_OFFICER],
//   },
//   {
//     id: 'trips',
//     label: 'Trips',
//     path: '/dashboard/trips',
//     icon: 'Route',
//     roles: [ROLE_NAMES.FLEET_MANAGER, ROLE_NAMES.DRIVER],
//   },
//   {
//     id: 'maintenance',
//     label: 'Maintenance',
//     path: '/dashboard/maintenance',
//     icon: 'Wrench',
//     roles: [ROLE_NAMES.FLEET_MANAGER],
//   },
//   {
//     id: 'fuel-logs',
//     label: 'Fuel Logs',
//     path: '/dashboard/fuel-logs',
//     icon: 'Fuel',
//     roles: [ROLE_NAMES.FINANCIAL_ANALYST],
//   },
//   {
//     id: 'expenses',
//     label: 'Expenses',
//     path: '/dashboard/expenses',
//     icon: 'ReceiptText',
//     roles: [ROLE_NAMES.FINANCIAL_ANALYST],
//   },
//   {
//     id: 'reports',
//     label: 'Reports',
//     path: '/dashboard/reports',
//     icon: 'BarChart3',
//     roles: Object.values(ROLE_NAMES),
//   },
//   {
//     id: 'settings',
//     label: 'Settings',
//     path: '/dashboard/settings',
//     icon: 'Settings',
//     roles: Object.values(ROLE_NAMES),
//   },
// ]

// export const getVisibleModules = (role) => {
//   const resolvedRole = role || ROLE_NAMES.FLEET_MANAGER
//   return navigationModules.filter((module) => module.roles.includes(resolvedRole))
// }


export const ROLE_NAMES = {
  FLEET_MANAGER: 'Fleet Manager',
  DRIVER: 'Driver',
  SAFETY_OFFICER: 'Safety Officer',
  FINANCIAL_ANALYST: 'Financial Analyst',
}

export const navigationModules = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    roles: Object.values(ROLE_NAMES),
  },
  {
    id: 'vehicles',
    label: 'Vehicles',
    path: '/dashboard/vehicles',
    icon: 'Truck',
    roles: [ROLE_NAMES.FLEET_MANAGER],
  },
  {
    id: 'drivers',
    label: 'Drivers',
    path: '/dashboard/drivers',
    icon: 'Users',
    roles: [
      ROLE_NAMES.FLEET_MANAGER,
      ROLE_NAMES.SAFETY_OFFICER,
    ],
  },
  {
    id: 'trips',
    label: 'Trips',
    path: '/dashboard/trips',
    icon: 'Route',
    roles: [
      ROLE_NAMES.FLEET_MANAGER,
      ROLE_NAMES.DRIVER,
    ],
  },
  {
    id: 'maintenance',
    label: 'Maintenance',
    path: '/dashboard/maintenance',
    icon: 'Wrench',
    roles: [ROLE_NAMES.FLEET_MANAGER],
  },
  {
    id: 'fuel-logs',
    label: 'Fuel Logs',
    path: '/dashboard/fuel-logs',
    icon: 'Fuel',
    roles: [
      ROLE_NAMES.FLEET_MANAGER,
      ROLE_NAMES.FINANCIAL_ANALYST,
    ],
  },
  {
    id: 'expenses',
    label: 'Expenses',
    path: '/dashboard/expenses',
    icon: 'ReceiptText',
    roles: [
      ROLE_NAMES.FLEET_MANAGER,
      ROLE_NAMES.FINANCIAL_ANALYST,
    ],
  },
  {
    id: 'reports',
    label: 'Reports',
    path: '/dashboard/reports',
    icon: 'BarChart3',
    roles: Object.values(ROLE_NAMES),
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/dashboard/settings',
    icon: 'Settings',
    roles: Object.values(ROLE_NAMES),
  },
]

export const getVisibleModules = (role) => {
  const resolvedRole = role || ROLE_NAMES.FLEET_MANAGER

  return navigationModules.filter((module) =>
    module.roles.includes(resolvedRole)
  )
}