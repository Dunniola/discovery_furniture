// src/context/AuthContext.jsx
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("adminToken") || "");
  const [admin, setAdmin] = useState(
    JSON.parse(localStorage.getItem("admin")) || null
  );

  const login = (tokenValue, adminData) => {
    setToken(tokenValue);
    setAdmin(adminData);
    localStorage.setItem("adminToken", tokenValue);
    localStorage.setItem("admin", JSON.stringify(adminData));
  };

  const logout = () => {
    setToken("");
    setAdmin(null);
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
  };

  const shouldKick = (err) => {
    if (err?.response?.status === 401) {
      logout();
      window.location.href = "/admin/login";
    }
  };

  return (
    <AuthContext.Provider value={{ token, admin, login, logout, shouldKick }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
