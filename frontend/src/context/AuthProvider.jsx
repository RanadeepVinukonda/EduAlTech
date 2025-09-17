import { createContext, useState, useEffect } from "react";
import api from "../axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 👇 On app start, check if cookie JWT is still valid
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/auth/me", { withCredentials: true });
        setUser(res.data);
      } catch (err) {
        setUser(null); // not logged in
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (username, password) => {
    const res = await api.post(
      "/api/auth/login",
      { username, password },
      { withCredentials: true }
    );
    setUser(res.data);
  };

  const logout = async () => {
    await api.post("/api/auth/logout", {}, { withCredentials: true });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
