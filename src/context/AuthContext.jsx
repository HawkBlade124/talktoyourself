import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

// Create the context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);     // holds the user object
  const [token, setToken] = useState(null);   // holds the JWT token
  const [loading, setLoading] = useState(true);

  // Load user/token from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }

    setLoading(false);
  }, []);

  // Login function
  const login = async (identifier, password) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || "https://talktoyourself.space"}/login`, {
        identifier,
        password,
      });

      if (res.data.success) {
        const { token, user } = res.data;
        setUser(user);
        setToken(token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
        return { success: true };
      } else {
        return { success: false, message: "Invalid credentials" };
      }
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, message: err.response?.data?.message || "Login failed" };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Auth header helper
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  return (
    <AuthContext.Provider value={{ user, token, login, logout, authHeader, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);
