import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "../context/AuthProvider";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading)
    return <p className="text-center mt-10">Checking authentication...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role))
    return (
      <p className="text-center mt-10 text-red-600 font-semibold">
        You are not authorized to view this page.
      </p>
    );

  return children;
};

export default ProtectedRoute;
