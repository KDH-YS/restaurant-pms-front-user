import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const ProtectedRoute = ({ children, requiredRole, requireRestaurantId }) => {
  const { token, userRole, restaurantId } = useAuthStore();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  if (requireRestaurantId && !restaurantId) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

