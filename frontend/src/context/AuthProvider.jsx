// src/context/AuthProvider.jsx
import { createContext, useContext, useState, useEffect } from "react";
import api from "../axios";
// ✅ Create context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ On app mount, check if user is logged in via backend cookie
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/auth/me", { withCredentials: true });
        setUser(res.data);
      } catch (err) {
        setUser(null); // no valid cookie / not logged in
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // ✅ Login function
  const login = async (username, password) => {
    const res = await api.post(
      "/api/auth/login",
      { username, password },
      { withCredentials: true }
    );
    setUser(res.data);
    return res.data;
  };

  // ✅ Signup function (optional)
  const signup = async (formData) => {
    const res = await api.post("/api/auth/signup", formData, {
      withCredentials: true,
    });
    setUser(res.data);
    return res.data;
  };

  // ✅ Logout function
  const logout = async () => {
    await api.post("/api/auth/logout", {}, { withCredentials: true });
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, signup, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ useAuth hook for easy access
export const useAuth = () => {
  return useContext(AuthContext);
};
