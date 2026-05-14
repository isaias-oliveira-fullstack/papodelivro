import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

const PrivateRoute = () => {
  const { signed, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div>Verificando autenticação...</div>
  }

  return signed ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />
}

export default PrivateRoute