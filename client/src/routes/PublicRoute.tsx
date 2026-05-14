import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

const PublicRoute = () => {
  const { signed, user, loading } = useAuth()

  if (loading) {
    return <div>Verificando autenticação...</div>
  }

  if (signed) {
    const redirectPath = user?.role === 'admin' ? '/admin/aprovacoes' : '/'
    return <Navigate to={redirectPath} replace />
  }

  return <Outlet />
}

export default PublicRoute
