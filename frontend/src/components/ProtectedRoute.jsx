import React from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthProvider";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // ✅ Show loading while fetching user
  if (loading) return <p className="text-center mt-10">Loading...</p>;

  // ✅ Not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ✅ Role-based access (optional)
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <p className="text-center mt-10 text-red-500">
        Access denied: your role "{user.role}" cannot view this page
      </p>
    );
  }

  // ✅ User is logged in & allowed
  return children;
};

export default ProtectedRoute;
