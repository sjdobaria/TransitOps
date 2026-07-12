import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { initialDrivers, initialExpenses, initialFuelLogs, initialMaintenance, initialTrips, initialVehicles } from '../data/mockOperations'
import api from '../services/api'
import {
  fromBackendVehicle,
  fromBackendDriver,
  fromBackendTrip,
  fromBackendMaintenance,
  fromBackendFuelLog,
  fromBackendExpense,
  toBackendVehicle,
  toBackendDriver,
  toBackendTrip,
  toBackendMaintenance,
  toBackendFuelLog,
  toBackendExpense,
} from '../services/normalizers'

const OperationsContext = createContext(null)

export const OperationsProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState(initialVehicles)
  const [drivers, setDrivers] = useState(initialDrivers)
  const [trips, setTrips] = useState(initialTrips)
  const [maintenance, setMaintenance] = useState(initialMaintenance)
  const [fuelLogs, setFuelLogs] = useState(initialFuelLogs)
  const [expenses, setExpenses] = useState(initialExpenses)

  const fetchBackendData = useCallback(async () => {
    try {
      const [vRes, dRes, tRes, mRes, fRes, eRes] = await Promise.all([
        api.get('/vehicles/').catch(() => null),
        api.get('/drivers/').catch(() => null),
        api.get('/trips/').catch(() => null),
        api.get('/maintenance/').catch(() => null),
        api.get('/fuel-logs/').catch(() => null),
        api.get('/expenses/').catch(() => null),
      ])

      if (vRes?.data) {
        const list = Array.isArray(vRes.data) ? vRes.data : vRes.data.results || []
        setVehicles(list.map(fromBackendVehicle).filter(Boolean))
      }
      if (dRes?.data) {
        const list = Array.isArray(dRes.data) ? dRes.data : dRes.data.results || []
        setDrivers(list.map(fromBackendDriver).filter(Boolean))
      }
      if (tRes?.data) {
        const list = Array.isArray(tRes.data) ? tRes.data : tRes.data.results || []
        setTrips(list.map(fromBackendTrip).filter(Boolean))
      }
      if (mRes?.data) {
        const list = Array.isArray(mRes.data) ? mRes.data : mRes.data.results || []
        setMaintenance(list.map(fromBackendMaintenance).filter(Boolean))
      }
      if (fRes?.data) {
        const list = Array.isArray(fRes.data) ? fRes.data : fRes.data.results || []
        setFuelLogs(list.map(fromBackendFuelLog).filter(Boolean))
      }
      if (eRes?.data) {
        const list = Array.isArray(eRes.data) ? eRes.data : eRes.data.results || []
        setExpenses(list.map(fromBackendExpense).filter(Boolean))
      }
    } catch {
      // ignore network errors if backend is offline
    }
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem('transitops_operations')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (parsed.vehicles?.length) setVehicles(parsed.vehicles)
        if (parsed.drivers?.length) setDrivers(parsed.drivers)
        if (parsed.trips?.length) setTrips(parsed.trips)
        if (parsed.maintenance?.length) setMaintenance(parsed.maintenance)
        if (parsed.fuelLogs?.length) setFuelLogs(parsed.fuelLogs)
        if (parsed.expenses?.length) setExpenses(parsed.expenses)
      } catch {
        // ignore invalid storage
      }
    }

    fetchBackendData()
  }, [fetchBackendData])

  useEffect(() => {
    const payload = { vehicles, drivers, trips, maintenance, fuelLogs, expenses }
    localStorage.setItem('transitops_operations', JSON.stringify(payload))
  }, [vehicles, drivers, trips, maintenance, fuelLogs, expenses])

  const availableVehicles = useMemo(() => vehicles.filter((vehicle) => vehicle.status === 'Available'), [vehicles])
  const availableDrivers = useMemo(() => drivers.filter((driver) => driver.status === 'Available'), [drivers])

  const addVehicle = async (payload) => {
    const tempId = Date.now()
    const item = { id: tempId, ...payload, max_capacity: Number(payload.max_capacity || 0), mileage: Number(payload.mileage || 0), acquisition_cost: Number(payload.acquisition_cost || 0) }
    setVehicles((current) => [item, ...current])
    try {
      const backendPayload = toBackendVehicle(item)
      const res = await api.post('/vehicles/', backendPayload)
      if (res?.data) {
        const normalized = fromBackendVehicle(res.data)
        setVehicles((current) => current.map((v) => (v.id === tempId ? normalized : v)))
      }
    } catch {
      // ignore if offline
    }
  }

  const updateVehicle = async (id, payload) => {
    setVehicles((current) => current.map((v) => (v.id === id ? { ...v, ...payload, max_capacity: Number(payload.max_capacity || v.max_capacity || 0), mileage: Number(payload.mileage || v.mileage || 0), acquisition_cost: Number(payload.acquisition_cost || v.acquisition_cost || 0) } : v)))
    try {
      const backendPayload = toBackendVehicle({ id, ...payload })
      await api.put(`/vehicles/${id}/`, backendPayload)
    } catch {
      // ignore if offline
    }
  }

  const deleteVehicle = async (id) => {
    setVehicles((current) => current.filter((v) => v.id !== id))
    try {
      await api.delete(`/vehicles/${id}/`)
    } catch {
      // ignore if offline
    }
  }

  const addDriver = async (payload) => {
    const tempId = Date.now()
    const item = { id: tempId, ...payload, safety_score: Number(payload.safety_score || 100) }
    setDrivers((current) => [item, ...current])
    try {
      const backendPayload = toBackendDriver(item)
      const res = await api.post('/drivers/', backendPayload)
      if (res?.data) {
        const normalized = fromBackendDriver(res.data)
        setDrivers((current) => current.map((d) => (d.id === tempId ? normalized : d)))
      }
    } catch {
      // ignore if offline
    }
  }

  const updateDriver = async (id, payload) => {
    setDrivers((current) => current.map((d) => (d.id === id ? { ...d, ...payload, safety_score: Number(payload.safety_score || d.safety_score || 100) } : d)))
    try {
      const backendPayload = toBackendDriver({ id, ...payload })
      await api.put(`/drivers/${id}/`, backendPayload)
    } catch {
      // ignore if offline
    }
  }

  const deleteDriver = async (id) => {
    setDrivers((current) => current.filter((d) => d.id !== id))
    try {
      await api.delete(`/drivers/${id}/`)
    } catch {
      // ignore if offline
    }
  }

  const addTrip = async (payload) => {
    const tempId = Date.now()
    const item = { id: tempId, ...payload, cargo_weight: Number(payload.cargo_weight || 0), planned_distance: Number(payload.planned_distance || 0) }
    setTrips((current) => [item, ...current])
    if (payload.vehicle_id && (payload.status === 'Dispatched' || payload.status === 'On Trip')) {
      setVehicles((current) => current.map((v) => (v.id === Number(payload.vehicle_id) || v.id === payload.vehicle_id ? { ...v, status: 'On Trip' } : v)))
      setDrivers((current) => current.map((d) => (d.id === Number(payload.driver_id) || d.id === payload.driver_id ? { ...d, status: 'On Trip' } : d)))
    }
    try {
      const backendPayload = toBackendTrip(item)
      const res = await api.post('/trips/', backendPayload)
      if (res?.data) {
        const normalized = fromBackendTrip(res.data)
        setTrips((current) => current.map((t) => (t.id === tempId ? normalized : t)))
        if (payload.status === 'Dispatched' && res.data.id) {
          await api.post(`/trips/${res.data.id}/dispatch/`, {}).catch(() => null)
        }
      }
    } catch {
      // ignore if offline
    }
  }

  const updateTripStatus = async (tripId, nextStatus) => {
    const trip = trips.find((t) => t.id === tripId)
    setTrips((current) => current.map((t) => (t.id === tripId ? { ...t, status: nextStatus } : t)))
    if (trip) {
      if (nextStatus === 'Dispatched') {
        setVehicles((vehicleState) => vehicleState.map((vehicle) => (vehicle.id === trip.vehicle_id ? { ...vehicle, status: 'On Trip' } : vehicle)))
        setDrivers((driverState) => driverState.map((driver) => (driver.id === trip.driver_id ? { ...driver, status: 'On Trip' } : driver)))
        try { await api.post(`/trips/${tripId}/dispatch/`, {}) } catch {}
      } else if (nextStatus === 'Completed') {
        setVehicles((vehicleState) => vehicleState.map((vehicle) => (vehicle.id === trip.vehicle_id ? { ...vehicle, status: 'Available' } : vehicle)))
        setDrivers((driverState) => driverState.map((driver) => (driver.id === trip.driver_id ? { ...driver, status: 'Available' } : driver)))
        try { await api.post(`/trips/${tripId}/complete/`, { end_odometer: (trip.planned_distance || 100) + 10000, fuel_consumed: 25 }) } catch {}
      } else if (nextStatus === 'Cancelled') {
        setVehicles((vehicleState) => vehicleState.map((vehicle) => (vehicle.id === trip.vehicle_id ? { ...vehicle, status: 'Available' } : vehicle)))
        setDrivers((driverState) => driverState.map((driver) => (driver.id === trip.driver_id ? { ...driver, status: 'Available' } : driver)))
        try { await api.post(`/trips/${tripId}/cancel/`, {}) } catch {}
      }
    }
  }

  const addMaintenance = async (payload) => {
    const tempId = Date.now()
    const item = { id: tempId, ...payload }
    setMaintenance((current) => [item, ...current])
    if (payload.vehicle_id) {
      setVehicles((current) => current.map((v) => (v.id === Number(payload.vehicle_id) || v.id === payload.vehicle_id ? { ...v, status: 'In Shop' } : v)))
    }
    try {
      const backendPayload = toBackendMaintenance(item)
      const res = await api.post('/maintenance/', backendPayload)
      if (res?.data) {
        const normalized = fromBackendMaintenance(res.data)
        setMaintenance((current) => current.map((m) => (m.id === tempId ? normalized : m)))
      }
    } catch {
      // ignore if offline
    }
  }

  const closeMaintenance = async (id, vehicleId) => {
    setMaintenance((current) => current.map((item) => (item.id === id ? { ...item, status: 'Closed' } : item)))
    if (vehicleId) {
      setVehicles((current) => current.map((item) => (item.id === vehicleId ? { ...item, status: item.status === 'Retired' ? 'Retired' : 'Available' } : item)))
    }
    try {
      await api.post(`/maintenance/${id}/close/`, {}).catch(() => null)
    } catch {
      // ignore if offline
    }
  }

  const addFuelLog = async (payload) => {
    const tempId = Date.now()
    setFuelLogs((current) => [{ id: tempId, ...payload }, ...current])
    try {
      const backendPayload = toBackendFuelLog(payload, vehicles, trips)
      const res = await api.post('/fuel-logs/', backendPayload)
      if (res?.data) {
        const normalized = fromBackendFuelLog(res.data)
        setFuelLogs((current) => current.map((item) => (item.id === tempId ? normalized : item)))
      }
    } catch {
      // ignore API error if offline
    }
  }

  const addExpense = async (payload) => {
    const tempId = Date.now()
    setExpenses((current) => [{ id: tempId, ...payload }, ...current])
    try {
      const backendPayload = toBackendExpense(payload)
      const res = await api.post('/expenses/', backendPayload)
      if (res?.data) {
        const normalized = fromBackendExpense(res.data)
        setExpenses((current) => current.map((item) => (item.id === tempId ? normalized : item)))
      }
    } catch {
      // ignore API error if offline
    }
  }

  const value = useMemo(
    () => ({
      vehicles,
      setVehicles,
      addVehicle,
      updateVehicle,
      deleteVehicle,
      drivers,
      setDrivers,
      addDriver,
      updateDriver,
      deleteDriver,
      trips,
      setTrips,
      addTrip,
      updateTripStatus,
      maintenance,
      setMaintenance,
      addMaintenance,
      closeMaintenance,
      fuelLogs,
      setFuelLogs,
      expenses,
      setExpenses,
      availableVehicles,
      availableDrivers,
      addFuelLog,
      addExpense,
      refreshOperations: fetchBackendData,
    }),
    [vehicles, drivers, trips, maintenance, fuelLogs, expenses, availableVehicles, availableDrivers, fetchBackendData],
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
