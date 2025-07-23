import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../axios"; // Adjust the path as necessary
import { useLocation, useNavigate } from "react-router";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Fetch user on app load (to handle cookies)
useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await fetch("/auth/me", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch user");

      const data = await res.json();
      setUser(data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, []);


  // ✅ Login function
  const login = async (credentials) => {
    try {
      const res = await api.post("/auth/login", credentials, {
        withCredentials: true,
      });
      setUser(res.data);

      // Navigate to previous path or /profile
      const redirectTo = location.state?.from?.pathname || "/profile";
      navigate(redirectTo, { replace: true });

      return true;
    } catch (error) {
      toast.error(error?.response?.data?.error || "Login failed");
      return false;
    }
  };

  // ✅ Logout function
  const logout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      setUser(null);
      navigate("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  // ✅ Provide all necessary auth state
  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {!loading ? children : <p className="text-center mt-10">Loading...</p>}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook for components to use
export const useAuth = () => useContext(AuthContext);
