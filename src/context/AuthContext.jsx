import React, { createContext, useContext, useState, useEffect } from "react";
import CookieService from "encrypted-cookie";

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
  const secretKey = import.meta.env.VITE_CRYPTO_KEY;

  const [user, setUser] = useState(JSON.parse(CookieService.getCookie("user", secretKey) || null));
  const [token, setToken] = useState(CookieService.getCookie("token", secretKey) || null);

  const handleChange = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
  };

  const logout = () => {
    CookieService.eraseCookie("user", secretKey);
  CookieService.eraseCookie("token", secretKey);
  
  // Redirect to login page
  window.location.href = "/login"; 
  };

  const shouldKick = (e) => {
    if (e.response?.data?.message === "Unauthenticated.") {
      logout();
    }
  };

  useEffect(() => {
    if (user) CookieService.setCookie("user", JSON.stringify(user), 365, secretKey);
    if (token) CookieService.setCookie("token", token, 365, secretKey);
  }, [user, token]);

  const contextData = {
    user,
    token,
    handleChange,
    logout,
    shouldKick,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
