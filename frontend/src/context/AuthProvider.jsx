import { createContext, useContext, useState, useEffect } from "react";
import api from "../axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // restore user from sessionStorage (only persists until tab closes)
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  // Refresh user from backend if session exists
  useEffect(() => {
    const loadUser = async () => {
      if (user) {
        try {
          const res = await api.get("/auth/me", { withCredentials: true });
          setUser(res.data);
        } catch (err) {
          console.error("Fetch user error:", err);
          setUser(null);
          sessionStorage.removeItem("user");
        }
      }
    };
    loadUser();
  }, []);

  // Login function
  const login = async ({ username, password }) => {
    setLoading(true);
    try {
      const res = await api.post(
        "/auth/login",
        { username, password },
        { withCredentials: true }
      );
      setUser(res.data);
      sessionStorage.setItem("user", JSON.stringify(res.data));
      setLoading(false);
      return true;
    } catch (err) {
      console.error("Login error:", err);
      setLoading(false);
      throw new Error(
        err?.response?.data?.error || "Invalid username or password"
      );
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      setUser(null);
      sessionStorage.removeItem("user");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
