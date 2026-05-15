import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { apiGetMe, isLoggedIn } from '@/lib/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) {
      setLoading(false);
      return;
    }
    
    apiGetMe()
      .then(res => {
        setUser(res.user);
      })
      .catch(() => {
        // Token is invalid or expired
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their respective correct dashboard if they are on a wrong one
    if (user.role === 'SUPER_ADMIN') return <Navigate to="/superadmin/dashboard" replace />;
    if (user.role === 'BUILDING_ADMIN') return <Navigate to="/building-admin/dashboard" replace />;
    return <Navigate to="/user/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
