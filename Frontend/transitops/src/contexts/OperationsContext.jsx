import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { initialDrivers, initialExpenses, initialFuelLogs, initialMaintenance, initialTrips, initialVehicles } from '../data/mockOperations'

const OperationsContext = createContext(null)

export const OperationsProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState(initialVehicles)
  const [drivers, setDrivers] = useState(initialDrivers)
  const [trips, setTrips] = useState(initialTrips)
  const [maintenance, setMaintenance] = useState(initialMaintenance)
  const [fuelLogs, setFuelLogs] = useState(initialFuelLogs)
  const [expenses, setExpenses] = useState(initialExpenses)

  useEffect(() => {
    const stored = localStorage.getItem('transitops_operations')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setVehicles(parsed.vehicles || initialVehicles)
        setDrivers(parsed.drivers || initialDrivers)
        setTrips(parsed.trips || initialTrips)
        setMaintenance(parsed.maintenance || initialMaintenance)
        setFuelLogs(parsed.fuelLogs || initialFuelLogs)
        setExpenses(parsed.expenses || initialExpenses)
      } catch {
        // ignore invalid storage
      }
    }
  }, [])

  useEffect(() => {
    const payload = { vehicles, drivers, trips, maintenance, fuelLogs, expenses }
    localStorage.setItem('transitops_operations', JSON.stringify(payload))
  }, [vehicles, drivers, trips, maintenance, fuelLogs, expenses])

  const availableVehicles = useMemo(() => vehicles.filter((vehicle) => vehicle.status === 'Available'), [vehicles])
  const availableDrivers = useMemo(() => drivers.filter((driver) => driver.status === 'Available'), [drivers])

  const addFuelLog = (payload) => {
    setFuelLogs((current) => [{ id: Date.now(), ...payload }, ...current])
  }

  const addExpense = (payload) => {
    setExpenses((current) => [{ id: Date.now(), ...payload }, ...current])
  }

  const value = useMemo(
    () => ({
      vehicles,
      setVehicles,
      drivers,
      setDrivers,
      trips,
      setTrips,
      maintenance,
      setMaintenance,
      fuelLogs,
      setFuelLogs,
      expenses,
      setExpenses,
      availableVehicles,
      availableDrivers,
      addFuelLog,
      addExpense,
    }),
    [vehicles, drivers, trips, maintenance, fuelLogs, expenses, availableVehicles, availableDrivers],
  )

  return <OperationsContext.Provider value={value}>{children}</OperationsContext.Provider>
}

export const useOperations = () => {
  const context = useContext(OperationsContext)
  if (!context) {
    throw new Error('useOperations must be used within OperationsProvider')
  }
  return context
}
