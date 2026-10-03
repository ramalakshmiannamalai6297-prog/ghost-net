import React, { useEffect, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const ProtectedRoute = ({ allowedRole, children }) => {
  const { user, showToast } = useApp();
  const showToastRef = useRef(showToast);
  showToastRef.current = showToast;
  const location = useLocation();
  const hasAllowedRole = user?.role === allowedRole;
  const dashboardPath = user?.role === 'authority' ? '/authority' : '/fisherman';
  const loginPath = allowedRole === 'authority' ? '/authority/login' : '/fisherman/login';

  useEffect(() => {
    if (user && !hasAllowedRole) {
      showToastRef.current(
        `Access denied. Redirected to your ${user.role === 'authority' ? 'Authority' : 'Fisherman'} dashboard.`,
        'warning'
      );
    }
  }, [user?.role, hasAllowedRole]);

  if (!user) {
    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }
  if (!hasAllowedRole) {
    return <Navigate to={dashboardPath} replace />;
  }
  return children;
};

export default ProtectedRoute;
