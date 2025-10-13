import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const localUser = localStorage.getItem("user");

    // ✅ Restore user immediately from localStorage so header doesn't flash "logged out"
    if (localUser) setUser(JSON.parse(localUser));

    if (token) {
      axios
        .get("http://localhost:5000/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log("Fetched user from /me:", res.data);
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data)); // keep synced
        })
        .catch((err) => {
          console.error("Error fetching /me:", err.message);

          // ❗️ Don’t auto-logout unless 401 (invalid token)
          if (err.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
