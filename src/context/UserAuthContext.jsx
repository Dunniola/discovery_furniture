// src/context/UserAuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const UserAuthContext = createContext();

export const UserAuthProvider = ({ children }) => {
  const [member, setMember] = useState(null);
  const [message, setMessage] = useState(null);

  const API_URL = "https://api.damxstudio.com/api"; // adjust if using live backend

  // Restore session on page load
  useEffect(() => {
    const token = localStorage.getItem("member_token");
    const user = localStorage.getItem("member_data");
    if (token && user) {
      setMember(JSON.parse(user));
    }
  }, []);

  // ✅ Register user
  const register = async (firstName, lastName, email, password, role = "member") => {
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          role,
          password,
          password_confirmation: password, // Laravel expects confirmed
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Laravel does not return token on registration, only user
      setMember(data.user);
      localStorage.setItem("member_data", JSON.stringify(data.user));

      setMessage("✅ Registration successful!");
      return { success: true, message: "Registration successful", data };
    } catch (error) {
      setMessage(`❌ ${error.message}`);
      return { success: false, message: error.message };
    }
  };

  // ✅ Login user
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Login Response:", data);

      if (!res.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      setMember(data.user); // store user
      localStorage.setItem("member_token", data.token); // store token
      localStorage.setItem("member_data", JSON.stringify(data.user));

      setMessage("✅ Login successful!");
      return { success: true, message: "Login successful", data };
    } catch (error) {
      setMessage(`❌ ${error.message}`);
      return { success: false, message: error.message };
    }
  };

  // ✅ Logout user
  const logout = async () => {
    try {
      const token = localStorage.getItem("member_token");
      if (!token) return;

      await fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.removeItem("member_token");
      localStorage.removeItem("member_data");
      setMember(null);

      setMessage("👋 Logout successful!");
      return { success: true, message: "Logout successful" };
    } catch (error) {
      setMessage(`❌ ${error.message}`);
      return { success: false, message: error.message };
    }
  };

  return (
    <UserAuthContext.Provider value={{ member, register, login, logout, message }}>
      {children}
    </UserAuthContext.Provider>
  );
};

// Custom hook for easy access
export const useUserAuth = () => useContext(UserAuthContext);
