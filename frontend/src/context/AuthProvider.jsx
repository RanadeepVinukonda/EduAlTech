import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../axios";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // logged-in user
  const [loading, setLoading] = useState(true); // app-wide loading state

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Restore user on app load (using JWT cookie)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me", { withCredentials: true });
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
      setUser(res.data);

      const redirectTo = location.state?.from?.pathname || "/profile";
      navigate(redirectTo, { replace: true });
      toast.success("Logged in successfully");
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.error || "Login failed");
      return false;
    }
  };

  // ✅ Signup
  const signup = async (formData) => {
    try {
      const res = await api.post("/auth/signup", formData, {
        withCredentials: true,
      });
      setUser(res.data);

      navigate("/profile", { replace: true });
      toast.success("Account created successfully");
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.error || "Signup failed");
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
    <AuthContext.Provider
      value={{ user, setUser, login, signup, logout, loading }}
    >
      {!loading ? children : <p className="text-center mt-10">Loading...</p>}
    </AuthContext.Provider>
  );
};

// ✅ Hook to use auth anywhere
export const useAuth = () => useContext(AuthContext);
