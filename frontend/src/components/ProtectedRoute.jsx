import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  const userRole = user.role ? user.role.toLowerCase() : '';

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to their respective dashboard if they don't have access
    return <Navigate to={`/${userRole}/dashboard`} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
