// components/protectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthProvider";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role.toLowerCase())) {
    return <p className="text-center mt-10 text-red-500">Access Denied</p>;
  }

  return <Outlet />; // render children routes
};

export default ProtectedRoute;
