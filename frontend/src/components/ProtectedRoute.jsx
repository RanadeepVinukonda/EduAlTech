import React from "react";
import { Navigate,useLocation } from "react-router";
import { useAuth } from "../context/AuthProvider"; // ✅ FIXED

const ProtectRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (allowedRoles.length && !allowedRoles.includes(user.role))
    return <Navigate to="/" replace />;

  return children;
};
export default ProtectRoute;
