import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { OperationsProvider } from './contexts/OperationsContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <OperationsProvider>
      <App />
    </OperationsProvider>
  </StrictMode>,
)