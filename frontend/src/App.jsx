import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Evidence from './pages/Evidence'
import Reports from './pages/Reports'
import Archives from './pages/Archives'
import Settings from './pages/Settings'
import AuditLog from './pages/AuditLog'
import HexViewer from './pages/HexViewer'
import ProtectedRoute from './components/ProtectedRoute'
import SessionWarning from './components/SessionWarning'
import GoogleCallback from './pages/GoogleCallback'
import ResetPassword from './pages/ResetPassword'

function App() {
  return (
    <BrowserRouter>
      <SessionWarning />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/evidence" element={<ProtectedRoute><Evidence /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        <Route path="/archives" element={<ProtectedRoute><Archives /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/audit-log" element={<ProtectedRoute><AuditLog /></ProtectedRoute>} />
        <Route path="/hex-viewer" element={<ProtectedRoute><HexViewer /></ProtectedRoute>} />
        <Route path="/google-callback" element={<GoogleCallback />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App