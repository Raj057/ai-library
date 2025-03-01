import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    // Redirect to login if no token exists
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; // Render protected content
};

export default ProtectedRoute;
