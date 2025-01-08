import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role'); // Check role for further validation

  // Redirect if no token is available
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Allow access if token exists
  return <Outlet />;
};

export default ProtectedRoute;
