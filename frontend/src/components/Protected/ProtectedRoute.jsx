import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading, token } = useContext(AuthContext);

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  // If not logged in, redirect to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // If logged in but role not allowed, redirect to home or unauthorized page
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <div className="p-8 text-center text-red-600">Unauthorized Access</div>;
  }

  return <Outlet />;
};

export default ProtectedRoute;