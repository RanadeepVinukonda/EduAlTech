import { createContext, useContext, useState } from "react";
import api from "../axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // user state
  const [loading, setLoading] = useState(false); // loading state for login/logout

  // Login function
  const login = async ({ username, password }) => {
    setLoading(true);
    try {
      const res = await api.post(
        "/auth/login",
        { username, password },
        { withCredentials: true }
      );

      setUser(res.data); // set user state
      sessionStorage.setItem("user", JSON.stringify(res.data)); // store session temporarily
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
