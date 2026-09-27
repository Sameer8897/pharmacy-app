import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function CustomerRoute({ children }) {
  const { isAuthenticated, isAdmin } = useAuth()

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (isAdmin) return <Navigate to="/admin" replace />
  return children
}
