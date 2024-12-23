import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    if (user.role === UserRole.STUDENT) {
      return <Navigate to="/user/dashboard" />;
    } else {
      return <Navigate to="/dashboard" />;
    }
  }

  return <>{children}</>;
};

export default RouteGuard;