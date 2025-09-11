import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../axios";
import { useNavigate, useLocation } from "react-router";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Fetch user on app load (checks cookie + role)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me", { withCredentials: true });

        // ✅ make sure backend returns { id, name, email, role }
        setUser(res.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // ✅ Login
  const login = async (credentials) => {
    try {
      const res = await api.post("/auth/login", credentials, {
        withCredentials: true,
      });

      // ✅ res.data must include role (provider/seeker)
      setUser(res.data);

      const redirectTo = location.state?.from?.pathname || "/profile";
      navigate(redirectTo, { replace: true });
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.error || "Login failed");
      return false;
    }
  };

  // ✅ Logout
  const logout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      setUser(null);
      navigate("/login");
      toast.success("Logged out successfully");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {!loading ? children : <p className="text-center mt-10">Loading...</p>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
