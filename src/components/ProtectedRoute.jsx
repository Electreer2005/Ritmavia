import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <p role="status">Cargando tu sesión…</p>
  if (!user) return <Navigate replace to="/login" state={{ from: location.pathname + location.search }} />
  return children
}
