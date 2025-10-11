import { createContext, useContext, useEffect, useState } from "react";
import api from "../axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Restore user from sessionStorage (not localStorage)
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  // Fetch logged-in user (auto-login)
  const fetchUser = async () => {
    try {
      const res = await api.get("/auth/me", { withCredentials: true });
      setUser(res.data);
      sessionStorage.setItem("user", JSON.stringify(res.data));
    } catch (err) {
      setUser(null);
      sessionStorage.removeItem("user");
      console.error("Fetch user error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();

    // Clear session on browser close or reload
    const handleUnload = () => {
      sessionStorage.removeItem("user");
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  // ✅ Fixed Login function
  const login = async ({ email, password }) => {
    try {
      const res = await api.post(
        "/auth/login",
        { email, password },
        { withCredentials: true }
      );
      setUser(res.data);
      sessionStorage.setItem("user", JSON.stringify(res.data));
      return true;
    } catch (err) {
      console.error("Login error:", err);
      throw new Error(err?.response?.data?.error || "Login failed");
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      setUser(null);
      sessionStorage.removeItem("user");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
