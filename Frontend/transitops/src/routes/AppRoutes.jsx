import { Navigate, Route, Routes } from 'react-router-dom'
import LandingPage from '../pages/LandingPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import DashboardPage from '../pages/DashboardPage'
import ProtectedRoute from '../components/ProtectedRoute'
import VehicleRegistryPage from '../pages/VehicleRegistryPage'
import DriverManagementPage from '../pages/DriverManagementPage'
import TripManagementPage from '../pages/TripManagementPage'
import MaintenancePage from '../pages/MaintenancePage'
import FuelLogsPage from '../pages/FuelLogsPage'
import ExpensesPage from '../pages/ExpensesPage'
import ReportsPage from '../pages/ReportsPage'
import SettingsPage from '../pages/SettingsPage'
import { getStoredUser } from '../services/api'

const AppRoutes = () => {
  const user = getStoredUser()

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/vehicles"
        element={
          <ProtectedRoute>
            <VehicleRegistryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/drivers"
        element={
          <ProtectedRoute>
            <DriverManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/trips"
        element={
          <ProtectedRoute>
            <TripManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/maintenance"
        element={
          <ProtectedRoute>
            <MaintenancePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/fuel-logs"
        element={
          <ProtectedRoute>
            <FuelLogsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/expenses"
        element={
          <ProtectedRoute>
            <ExpensesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/reports"
        element={
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
