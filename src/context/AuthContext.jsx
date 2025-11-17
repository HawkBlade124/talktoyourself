import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { buildApiUrl } from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [Thoughts, setThoughts] = useState([]);

  const apiBase = buildApiUrl(); 
useEffect(() => {
  const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
  const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
  if (storedToken && storedUser) {
    setUser(JSON.parse(storedUser));
    setToken(storedToken);
  }
  setLoading(false);
}, []);

  const login = async (identifier, password) => {
    try {
      const res = await axios.post(`${apiBase}/login`, { identifier, password });

      if (res.data.success) {
        const { token, user } = res.data;
        setUser(user);
        setToken(token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
      } else {
        return { success: false, message: "Invalid credentials" };
      }
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, message: err.response?.data?.message || "Login failed" };
    }
  };


const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
  setUser(null);
  setToken(null);
  window.location.href = "/";
};

  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  return (
    <AuthContext.Provider value={{ user, Thoughts, setThoughts, token, login, logout, authHeader, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
