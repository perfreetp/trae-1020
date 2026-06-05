import { Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from './components/layout/MainLayout'
import Dashboard from './pages/Dashboard'
import Pond from './pages/Pond'
import Device from './pages/Device'
import Inspection from './pages/Inspection'
import Inventory from './pages/Inventory'
import Analysis from './pages/Analysis'
import Alert from './pages/Alert'

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pond" element={<Pond />} />
        <Route path="/device" element={<Device />} />
        <Route path="/inspection" element={<Inspection />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/alert" element={<Alert />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </MainLayout>
  )
}

export default App
