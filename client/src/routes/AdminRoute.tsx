import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const AdminRoute = () => {
  const { signed, user, loading } = useAuth();

  if (loading) {
    return <div>Verificando permissões...</div>;
  }

  return signed && user?.role === 'admin' ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
